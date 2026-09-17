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

export async function getStudents(
  params: PaginatedSearchParams,
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

    const { data, count, error } = await supabase
      .from('profiles')
      .select(
        'id, full_name, email, level, created_at, classes(id, name, type)',
        {
          count: 'exact',
        },
      )
      .eq('role', 'student')
      .order('created_at', { ascending: false })
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
