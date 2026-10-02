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

type AttemptResult = { score: number; total: number; level: string };

export async function submitAttempt(
  params: AttemptValues,
): Promise<ActionResponse<AttemptResult>> {
  const validationResult = await action({
    params,
    schema: AttemptSchema,
    authorize: true,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const { quizId, answers } = validationResult.params!;

  try {
    const supabase = createClient(await cookies());

    // Scoring, the level band and saving the attempt all happen in SQL
    const { data, error } = await supabase.rpc('submit_level_test', {
      p_quiz_id: quizId,
      p_answers: answers.map((answer) => ({
        question_id: answer.questionId,
        option_id: answer.optionId,
      })),
    });

    if (error) throwPostgresError(error, 'Test');

    revalidatePath('/');
    revalidatePath('/profile');

    return { success: true, data: data as AttemptResult };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}
