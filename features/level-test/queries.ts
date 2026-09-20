import { cookies } from 'next/headers';

import action from '@/lib/handlers/action';
import handleError from '@/lib/handlers/errors';
import { NotFoundError, throwPostgresError } from '@/lib/http-errors';
import { createClient } from '@/lib/supabase/server';
import { shuffle } from '@/lib/utils';
import type { ActionResponse, ErrorResponse } from '@/types/global';

export async function getPlacementTest(): Promise<
  ActionResponse<{ quizId: string; questions: TestQuestion[] }>
> {
  const validationResult = await action({ authorize: true });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  try {
    const supabase = createClient(await cookies());

    const { data, error } = await supabase
      .from('quizzes')
      .select(
        'id, questions(id, prompt, position, options(id, text, position))',
      )
      .eq('is_active', true)
      .order('position', { referencedTable: 'questions', ascending: true })
      .order('position', {
        referencedTable: 'questions.options',
        ascending: true,
      })
      .limit(1)
      .maybeSingle();

    if (error) throwPostgresError(error, 'Test');
    if (!data) throw new NotFoundError('Test');

    const questions: TestQuestion[] = (data.questions ?? []).map(
      (question) => ({
        id: question.id,
        prompt: question.prompt,
        options: shuffle(
          (question.options ?? []).map((option) => ({
            id: option.id,
            text: option.text,
          })),
        ),
      }),
    );

    return { success: true, data: { quizId: data.id, questions } };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}

export async function getLatestAttempt(): Promise<
  ActionResponse<{
    score: number;
    total: number;
    level: string;
    completedAt: string;
  }>
> {
  const validationResult = await action({ authorize: true });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const { user } = validationResult;

  try {
    const supabase = createClient(await cookies());

    const { data, error } = await supabase
      .from('quiz_attempts')
      .select('score, total, level_result, completed_at')
      .eq('student_id', user!.id)
      .order('completed_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) throwPostgresError(error, 'Attempt');
    if (!data) throw new NotFoundError('Attempt');

    return {
      success: true,
      data: {
        score: data.score,
        total: data.total,
        level: data.level_result,
        completedAt: data.completed_at,
      },
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}
