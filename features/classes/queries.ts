import { cookies } from 'next/headers';

import action from '@/lib/handlers/action';
import handleError from '@/lib/handlers/errors';
import { NotFoundError, throwPostgresError } from '@/lib/http-errors';
import { createClient } from '@/lib/supabase/server';
import { toCamel } from '@/lib/utils';
import { PaginatedSearchParamsSchema } from '@/lib/validation/global.schema';
import {
  ActionResponse,
  ErrorResponse,
  PaginatedSearchParams,
} from '@/types/global';
import { cache } from 'react';

type ClassRow = Record<string, unknown> & {
  enrollments?: { count: number }[];
};

type ProgressRow = {
  enrollment_id: string;
  class_id: string;
  lessons_done: number;
};

function withCount(row: ClassRow): ClassWithCount {
  const { enrollments, ...rest } = row;

  return {
    ...toCamel<ClassRecord>(rest),
    studentCount: enrollments?.[0]?.count ?? 0,
  };
}

export async function getClasses(
  params: PaginatedSearchParams,
): Promise<ActionResponse<{ classes: ClassWithCount[]; isNext: boolean }>> {
  const validationResult = await action({
    params,
    schema: PaginatedSearchParamsSchema,
    authorize: true,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const { page = 1, pageSize = 20 } = validationResult.params!;

  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  try {
    const supabase = createClient(await cookies());

    const { data, count, error } = await supabase
      .from('classes')
      .select('*, enrollments(count)', { count: 'exact' })
      .eq('is_active', true)
      .order('created_at', { ascending: false })
      .range(from, to);

    if (error) throwPostgresError(error, 'Class');

    return {
      success: true,
      data: {
        classes: (data ?? []).map(withCount),
        isNext: (count ?? 0) > to + 1,
      },
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}

export const getClass = cache(
  async (id: string): Promise<ActionResponse<ClassWithCount>> => {
    const validationResult = await action({ authorize: true });

    if (validationResult instanceof Error) {
      return handleError(validationResult) as ErrorResponse;
    }

    try {
      const supabase = createClient(await cookies());

      const { data, error } = await supabase
        .from('classes')
        .select('*, enrollments(count)')
        .eq('id', id)
        .maybeSingle();

      if (error) throwPostgresError(error, 'Class');
      if (!data) throw new NotFoundError('Class');

      return { success: true, data: withCount(data) };
    } catch (error) {
      return handleError(error) as ErrorResponse;
    }
  },
);

export async function getGroupedClasses(params: PaginatedSearchParams): Promise<
  ActionResponse<{
    groups: ClassWithCount[];
    private: PrivateClass[];
    isNext: boolean;
  }>
> {
  const result = await getClasses(params);

  if (!result.success || !result.data) return result as ErrorResponse;

  const { classes, isNext } = result.data;

  const groups = classes.filter((item) => item.type !== 'one_to_one');
  const privateClasses = classes.filter((item) => item.type === 'one_to_one');

  if (!privateClasses.length) {
    return { success: true, data: { groups, private: [], isNext } };
  }

  try {
    const supabase = createClient(await cookies());

    const { data, error } = await supabase
      .from('lesson_progress')
      .select('enrollment_id, class_id, lessons_done')
      .in(
        'class_id',
        privateClasses.map((item) => item.id),
      );

    if (error) throwPostgresError(error, 'Lesson');

    const progressByClass = new Map(
      ((data ?? []) as ProgressRow[]).map((row) => [row.class_id, row]),
    );

    return {
      success: true,
      data: {
        groups,
        private: privateClasses.map((item) => {
          const progress = progressByClass.get(item.id);

          return {
            ...item,
            enrollmentId: progress?.enrollment_id ?? null,
            lessonsDone: progress?.lessons_done ?? 0,
          };
        }),
        isNext,
      },
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}

export async function getStudentClasses(): Promise<
  ActionResponse<
    {
      id: string;
      name: string;
      schedule: string | null;
      meetingUrl: string | null;
      type: ClassType;
    }[]
  >
> {
  const validationResult = await action({ authorize: true });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const { user } = validationResult;

  try {
    const supabase = createClient(await cookies());

    const { data, error } = await supabase
      .from('enrollments')
      .select(
        'class:classes!enrollments_class_id_fkey(id, name, schedule, meeting_url, type)',
      )
      .eq('student_id', user!.id)
      .eq('status', 'active');

    if (error) throwPostgresError(error, 'Class');

    const classes = (data ?? [])
      .map((row) => row.class)
      .filter(Boolean)
      .map((item) =>
        toCamel<{
          id: string;
          name: string;
          schedule: string | null;
          type: ClassType;
          meetingUrl: string | null;
        }>(item),
      );

    return { success: true, data: classes };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}
