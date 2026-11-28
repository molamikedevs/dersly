'use server';

import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import * as z from 'zod';

import action from '@/lib/handlers/action';
import handleError from '@/lib/handlers/errors';
import {
  ConflictError,
  ForbiddenError,
  NotFoundError,
  throwPostgresError,
} from '@/lib/http-errors';
import { createClient } from '@/lib/supabase/server';
import { toCamel } from '@/lib/utils';
import {
  calculateQuizScore,
  SaveQuizProgressSchema,
  SaveQuizSchema,
  SubmitQuizSchema,
  type SaveQuizValues,
} from '@/lib/validation/quiz.schema';
import { ActionResponse, ErrorResponse } from '@/types/global';

function revalidateQuizPaths(classId: string, quizId?: string) {
  revalidatePath(`/dashboard/classes/${classId}`);
  revalidatePath('/');
  if (quizId) {
    revalidatePath(`/quiz/${quizId}`);
    revalidatePath(`/quiz/${quizId}/result`);
    revalidatePath(`/dashboard/classes/${classId}/quizzes/${quizId}`);
    revalidatePath(`/dashboard/classes/${classId}/quizzes/${quizId}/edit`);
  }
}

export async function saveQuiz(
  params: SaveQuizValues,
): Promise<ActionResponse<QuizRecord>> {
  const validationResult = await action({
    params,
    schema: SaveQuizSchema,
    authorize: true,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const { quizId, classId, title, isPublished, questions } =
    validationResult.params!;

  try {
    const supabase = createClient(await cookies());
    let targetQuizId = quizId;
    let savedRow: unknown;

    if (targetQuizId) {
      const { count: submittedCount, error: attemptCheckError } = await supabase
        .from('class_quiz_attempts')
        .select('id', { count: 'exact', head: true })
        .eq('quiz_id', targetQuizId)
        .not('submitted_at', 'is', null);

      if (attemptCheckError) throwPostgresError(attemptCheckError, 'Quiz');
      if ((submittedCount ?? 0) > 0) {
        throw new ConflictError(
          'This quiz has already been completed and cannot be edited.',
        );
      }

      const { data, error } = await supabase
        .from('class_quizzes')
        .update({
          title,
          is_published: isPublished,
          updated_at: new Date().toISOString(),
        })
        .eq('id', targetQuizId)
        .select()
        .single();

      if (error) throwPostgresError(error, 'Quiz');
      savedRow = data;

      await supabase
        .from('class_quiz_attempts')
        .delete()
        .eq('quiz_id', targetQuizId)
        .is('submitted_at', null);

      const { error: delError } = await supabase
        .from('class_quiz_questions')
        .delete()
        .eq('quiz_id', targetQuizId);

      if (delError) throwPostgresError(delError, 'Quiz');
    } else {
      const { data, error } = await supabase
        .from('class_quizzes')
        .insert({
          class_id: classId,
          title,
          is_published: isPublished,
        })
        .select()
        .single();

      if (error) throwPostgresError(error, 'Quiz');
      savedRow = data;
      targetQuizId = (data as { id: string }).id;
    }

    const questionRows = questions.map((q, index) => ({
      quiz_id: targetQuizId,
      position: index + 1,
      kind: q.kind,
      prompt: q.prompt,
      options: q.options,
      correct_answer: q.correctAnswer,
    }));

    const { error: insertError } = await supabase
      .from('class_quiz_questions')
      .insert(questionRows);

    if (insertError) throwPostgresError(insertError, 'Quiz');

    revalidateQuizPaths(classId, targetQuizId);

    return { success: true, data: toCamel<QuizRecord>(savedRow) };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}

export async function deleteQuiz(
  quizId: string,
): Promise<ActionResponse<null>> {
  const validationResult = await action({
    params: { quizId },
    schema: z.object({ quizId: z.uuid() }),
    authorize: true,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  try {
    const supabase = createClient(await cookies());

    const { data: existing, error: readError } = await supabase
      .from('class_quizzes')
      .select('class_id')
      .eq('id', quizId)
      .maybeSingle();

    if (readError) throwPostgresError(readError, 'Quiz');
    if (!existing) throw new NotFoundError('Quiz');

    const { error } = await supabase
      .from('class_quizzes')
      .delete()
      .eq('id', quizId);

    if (error) throwPostgresError(error, 'Quiz');

    revalidateQuizPaths(existing.class_id, quizId);

    return { success: true, data: null };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}

export async function saveQuizProgress(params: {
  quizId: string;
  answers: Record<string, string>;
}): Promise<ActionResponse<null>> {
  const validationResult = await action({
    params,
    schema: SaveQuizProgressSchema,
    authorize: true,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const { quizId, answers } = validationResult.params!;
  const { user } = validationResult;

  try {
    const supabase = createClient(await cookies());

    const { data: existingAttempt, error: attemptError } = await supabase
      .from('class_quiz_attempts')
      .select('submitted_at')
      .eq('quiz_id', quizId)
      .eq('student_id', user!.id)
      .maybeSingle();

    if (attemptError) throwPostgresError(attemptError, 'Quiz');
    if (existingAttempt?.submitted_at) {
      return { success: true, data: null };
    }

    const { error } = await supabase.from('class_quiz_attempts').upsert(
      {
        quiz_id: quizId,
        student_id: user!.id,
        answers,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'quiz_id,student_id' },
    );

    if (error) throwPostgresError(error, 'Quiz');

    return { success: true, data: null };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}

export async function submitQuiz(params: {
  quizId: string;
  answers: Record<string, string>;
}): Promise<ActionResponse<{ score: number }>> {
  const validationResult = await action({
    params,
    schema: SubmitQuizSchema,
    authorize: true,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const { quizId, answers } = validationResult.params!;
  const { user } = validationResult;

  try {
    const supabase = createClient(await cookies());

    const [quizRes, questionsRes, existingAttemptRes] = await Promise.all([
      supabase
        .from('class_quizzes')
        .select('class_id, is_published')
        .eq('id', quizId)
        .maybeSingle(),
      supabase
        .from('class_quiz_questions')
        .select('id, correct_answer')
        .eq('quiz_id', quizId),
      supabase
        .from('class_quiz_attempts')
        .select('score, submitted_at')
        .eq('quiz_id', quizId)
        .eq('student_id', user!.id)
        .maybeSingle(),
    ]);

    if (quizRes.error) throwPostgresError(quizRes.error, 'Quiz');
    if (!quizRes.data) throw new NotFoundError('Quiz');
    if (!quizRes.data.is_published) {
      throw new ForbiddenError('This quiz is not available yet.');
    }
    if (questionsRes.error) throwPostgresError(questionsRes.error, 'Quiz');
    if (existingAttemptRes.error) {
      throwPostgresError(existingAttemptRes.error, 'Quiz');
    }

    if (existingAttemptRes.data?.submitted_at) {
      throw new ConflictError('You have already submitted this quiz.');
    }

    const questions = questionsRes.data ?? [];
    let correctCount = 0;

    for (const q of questions) {
      const picked = (answers[q.id] ?? '').trim().toLowerCase();
      const target = q.correct_answer.trim().toLowerCase();
      if (picked && picked === target) {
        correctCount += 1;
      }
    }

    const score = calculateQuizScore(correctCount, questions.length);

    const { error } = await supabase.from('class_quiz_attempts').upsert(
      {
        quiz_id: quizId,
        student_id: user!.id,
        answers,
        score,
        submitted_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'quiz_id,student_id' },
    );

    if (error) throwPostgresError(error, 'Quiz');

    revalidateQuizPaths(quizRes.data.class_id, quizId);

    return { success: true, data: { score } };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}
