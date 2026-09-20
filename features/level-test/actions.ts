'use server';

import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';

import action from '@/lib/handlers/action';
import handleError from '@/lib/handlers/errors';
import { throwPostgresError } from '@/lib/http-errors';
import { createClient } from '@/lib/supabase/server';
import {
  AttemptSchema,
  type AttemptValues,
} from '@/lib/validation/level-test.schema';
import type { ActionResponse, ErrorResponse } from '@/types/global';

function bandFor(score: number, total: number) {
  const ratio = score / total;

  if (ratio < 0.27) return 'beginner';
  if (ratio < 0.53) return 'elementary';
  if (ratio < 0.8) return 'intermediate';
  return 'advanced';
}

export async function submitAttempt(
  params: AttemptValues,
): Promise<ActionResponse<{ score: number; total: number; level: string }>> {
  const validationResult = await action({
    params,
    schema: AttemptSchema,
    authorize: true,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const { quizId, answers } = validationResult.params!;
  const { user } = validationResult;

  try {
    const supabase = createClient(await cookies());

    const { data: correct, error: readError } = await supabase
      .from('options')
      .select('id, question_id')
      .eq('is_correct', true)
      .in(
        'question_id',
        answers.map((answer) => answer.questionId),
      );

    if (readError) throwPostgresError(readError, 'Test');

    const correctByQuestion = new Map(
      (correct ?? []).map((option) => [option.question_id, option.id]),
    );

    const score = answers.reduce(
      (total, answer) =>
        correctByQuestion.get(answer.questionId) === answer.optionId
          ? total + 1
          : total,
      0,
    );

    const total = answers.length;
    const level = bandFor(score, total);

    const { error: attemptError } = await supabase
      .from('quiz_attempts')
      .insert({
        quiz_id: quizId,
        student_id: user!.id,
        score,
        total,
        level_result: level,
      });

    if (attemptError) throwPostgresError(attemptError, 'Test');

    const { error: profileError } = await supabase
      .from('profiles')
      .update({ level })
      .eq('id', user!.id);

    if (profileError) throwPostgresError(profileError, 'Profile');

    revalidatePath('/');
    revalidatePath('/profile');

    return { success: true, data: { score, total, level } };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}
