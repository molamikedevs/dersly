import { cookies } from 'next/headers';

import action from '@/lib/handlers/action';
import handleError from '@/lib/handlers/errors';
import { throwPostgresError } from '@/lib/http-errors';
import { createClient } from '@/lib/supabase/server';
import { toCamel } from '@/lib/utils';
import { PaginatedSearchParamsSchema } from '@/lib/validation/global.schema';
import {
  ActionResponse,
  ErrorResponse,
  PaginatedSearchParams,
} from '@/types/global';

async function fetchStudents(
  params: PaginatedSearchParams,
  classId?: string,
): Promise<ActionResponse<{ students: StudentRecord[]; isNext: boolean }>> {
  const validationResult = await action({
    params,
    schema: PaginatedSearchParamsSchema,
    authorize: true,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const { page = 1, pageSize = 50 } = validationResult.params!;
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  try {
    const supabase = createClient(await cookies());

    let request = supabase
      .from('enrollments')
      .select(
        `joined_at,
         student:profiles!enrollments_student_id_fkey(id, full_name, email, level),
         class:classes!enrollments_class_id_fkey(id, name, type, schedule)`,
        { count: 'exact' },
      )
      .eq('status', 'active');

    if (classId) request = request.eq('class_id', classId);

    const { data, count, error } = await request
      .order('joined_at', { ascending: false })
      .range(from, to);

    if (error) throwPostgresError(error, 'Student');

    return {
      success: true,
      data: {
        students: toCamel<StudentRecord[]>(data ?? []),
        isNext: (count ?? 0) > to + 1,
      },
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}

export function getStudents(params: PaginatedSearchParams) {
  return fetchStudents(params);
}

export function getClassStudents(
  classId: string,
  params: PaginatedSearchParams,
) {
  return fetchStudents(params, classId);
}
