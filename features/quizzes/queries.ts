import { cookies } from 'next/headers';
import { cache } from 'react';
import * as z from 'zod';

import action from '@/lib/handlers/action';
import handleError from '@/lib/handlers/errors';
import { NotFoundError, throwPostgresError } from '@/lib/http-errors';
import { createClient } from '@/lib/supabase/server';
import { toCamel } from '@/lib/utils';
import { ActionResponse, ErrorResponse } from '@/types/global';

export async function getClassQuizzes(
  classId: string,
): Promise<ActionResponse<QuizSummary[]>> {
  const validationResult = await action({
    params: { classId },
    schema: z.object({ classId: z.uuid() }),
    authorize: true,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  try {
    const supabase = createClient(await cookies());

    const { data, error } = await supabase
      .from('class_quizzes')
      .select(
        '*, class_quiz_questions(count), class_quiz_attempts(id, score, submitted_at)',
      )
      .eq('class_id', classId)
      .order('created_at', { ascending: false });

    if (error) throwPostgresError(error, 'Quiz');

    const summaries: QuizSummary[] = (data ?? []).map((row) => {
      const { class_quiz_questions, class_quiz_attempts, ...rest } =
        row as Record<string, unknown> & {
          class_quiz_questions?: { count: number }[];
          class_quiz_attempts?: {
            id: string;
            score: number | null;
            submitted_at: string | null;
          }[];
        };

      const submitted = (class_quiz_attempts ?? []).filter(
        (a) => a.submitted_at,
      );
      const latest = submitted[0] ?? class_quiz_attempts?.[0] ?? null;

      return {
        ...toCamel<QuizRecord>(rest),
        questionCount: class_quiz_questions?.[0]?.count ?? 0,
        latestAttempt: latest
          ? {
              id: latest.id,
              score: latest.score,
              submittedAt: latest.submitted_at,
            }
          : null,
      };
    });

    return { success: true, data: summaries };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}

export const getQuiz = cache(
  async (quizId: string): Promise<ActionResponse<QuizWithQuestions>> => {
    const validationResult = await action({
      params: { quizId },
      schema: z.object({ quizId: z.uuid() }),
      authorize: true,
    });

    if (validationResult instanceof Error) {
      return handleError(new NotFoundError('Quiz')) as ErrorResponse;
    }

    const { user } = validationResult;

    try {
      const supabase = createClient(await cookies());

      const [quizRes, questionsRes, attemptsRes] = await Promise.all([
        supabase
          .from('class_quizzes')
          .select('*, classes(id, name, teacher_id)')
          .eq('id', quizId)
          .maybeSingle(),
        supabase
          .from('class_quiz_questions')
          .select('*')
          .eq('quiz_id', quizId)
          .order('position', { ascending: true }),
        supabase
          .from('class_quiz_attempts')
          .select('*')
          .eq('quiz_id', quizId)
          .order('submitted_at', { ascending: false, nullsFirst: false })
          .order('updated_at', { ascending: false }),
      ]);

      if (quizRes.error) throwPostgresError(quizRes.error, 'Quiz');
      if (!quizRes.data) throw new NotFoundError('Quiz');
      if (questionsRes.error) throwPostgresError(questionsRes.error, 'Quiz');
      if (attemptsRes.error) throwPostgresError(attemptsRes.error, 'Quiz');

      const questions = toCamel<QuizQuestionRecord[]>(questionsRes.data ?? []);
      const attempts = toCamel<QuizAttemptRecord[]>(attemptsRes.data ?? []);

      const isTeacher =
        (quizRes.data.classes as { teacher_id?: string } | null)?.teacher_id ===
        user!.id;

      const attempt = isTeacher
        ? (attempts.find((a) => a.submittedAt) ?? attempts[0] ?? null)
        : (attempts.find((a) => a.studentId === user!.id) ?? null);

      return {
        success: true,
        data: {
          ...toCamel<QuizRecord>(quizRes.data),
          questions,
          attempt,
        },
      };
    } catch (error) {
      return handleError(error) as ErrorResponse;
    }
  },
);

export async function getMyActiveQuiz(): Promise<
  ActionResponse<QuizSummary | null>
> {
  const validationResult = await action({ authorize: true });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const { user } = validationResult;

  try {
    const supabase = createClient(await cookies());

    const { data, error } = await supabase
      .from('class_quizzes')
      .select(
        '*, class_quiz_questions(count), class_quiz_attempts(id, student_id, score, submitted_at)',
      )
      .eq('is_published', true)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) throwPostgresError(error, 'Quiz');
    if (!data) return { success: true, data: null };

    const { class_quiz_questions, class_quiz_attempts, ...rest } =
      data as Record<string, unknown> & {
        class_quiz_questions?: { count: number }[];
        class_quiz_attempts?: {
          id: string;
          student_id: string;
          score: number | null;
          submitted_at: string | null;
        }[];
      };

    const mine =
      (class_quiz_attempts ?? []).find((a) => a.student_id === user!.id) ??
      null;

    return {
      success: true,
      data: {
        ...toCamel<QuizRecord>(rest),
        questionCount: class_quiz_questions?.[0]?.count ?? 0,
        latestAttempt: mine
          ? {
              id: mine.id,
              score: mine.score,
              submittedAt: mine.submitted_at,
            }
          : null,
      },
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}
