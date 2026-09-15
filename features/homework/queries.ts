import { cookies } from 'next/headers';

import action from '@/lib/handlers/action';
import handleError from '@/lib/handlers/errors';
import { throwPostgresError } from '@/lib/http-errors';
import { createClient } from '@/lib/supabase/server';
import { signStoragePath } from '@/lib/supabase/sign';
import { toCamel } from '@/lib/utils';
import {
  ActionResponse,
  ErrorResponse,
  PaginatedSearchParams,
} from '@/types/global';

import { PaginatedSearchParamsSchema } from '@/lib/validation/global.schema';

async function fetchHomework(
  params: PaginatedSearchParams,
  classId?: string,
): Promise<ActionResponse<{ homework: HomeWorkRecord[]; isNext: boolean }>> {
  const validationResult = await action({
    params,
    schema: PaginatedSearchParamsSchema,
    authorize: true,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const { page = 1, pageSize = 10 } = validationResult.params!;
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  try {
    const supabase = createClient(await cookies());

    let request = supabase
      .from('homework')
      .select('*, classes(id, name, type)', { count: 'exact' });

    if (classId) request = request.eq('class_id', classId);

    const { data, count, error } = await request
      .order('created_at', { ascending: false })
      .range(from, to);

    if (error) throwPostgresError(error, 'Homework');

    const homework = toCamel<HomeWorkRecord[]>(data ?? []);

    await Promise.all(
      homework.map(async (item) => {
        if (!item.attachmentPath) return;
        const urls = await signStoragePath(
          supabase,
          item.attachmentPath,
          item.title,
        );
        Object.assign(item, urls);
      }),
    );

    return { success: true, data: { homework, isNext: (count ?? 0) > to + 1 } };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}

export function getAllHomework(params: PaginatedSearchParams) {
  return fetchHomework(params);
}

export function getClassHomework(
  classId: string,
  params: PaginatedSearchParams,
) {
  return fetchHomework(params, classId);
}
