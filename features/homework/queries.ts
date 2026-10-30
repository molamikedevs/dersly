import { cookies } from 'next/headers';
import { cache } from 'react';
import * as z from 'zod';

import action from '@/lib/handlers/action';
import handleError from '@/lib/handlers/errors';
import { NotFoundError, throwPostgresError } from '@/lib/http-errors';
import { getNextLesson, toSlots } from '@/lib/schedule';
import { createClient } from '@/lib/supabase/server';
import { signStoragePath } from '@/lib/supabase/sign';
import { toCamel } from '@/lib/utils';
import { PaginatedSearchParamsSchema } from '@/lib/validation/global.schema';
import {
  ActionResponse,
  ErrorResponse,
  PaginatedSearchParams,
} from '@/types/global';

async function fetchHomework(
  params: PaginatedSearchParams,
  classId?: string,
): Promise<ActionResponse<{ homework: HomeworkItem[]; isNext: boolean }>> {
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
      .select('*, classes(id, name, type, schedule_days, schedule_times)', {
        count: 'exact',
      });

    if (classId) request = request.eq('class_id', classId);

    const { data, count, error } = await request
      .order('created_at', { ascending: false })
      .range(from, to);

    if (error) throwPostgresError(error, 'Homework');

    const homework: HomeworkItem[] = toCamel<HomeworkRow[]>(data ?? []).map(
      (item) => {
        const slots = toSlots(
          item.classes?.scheduleDays,
          item.classes?.scheduleTimes,
        );
        const lesson = getNextLesson(slots, new Date(item.createdAt), 0);

        return { ...item, lessonAt: lesson?.toISOString() ?? null };
      },
    );

    await Promise.all(
      homework.map(async (item) => {
        if (!item.attachmentPath) return;

        const urls = await signStoragePath(
          supabase,
          item.attachmentPath,
          item.attachmentName ?? item.title,
        );

        item.signedUrl = urls.signedUrl;
        item.downloadUrl = urls.downloadUrl;
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

export async function getGroupedHomework(
  params: PaginatedSearchParams,
): Promise<ActionResponse<{ groups: HomeWorkGroup[]; isNext: boolean }>> {
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

    // !inner leaves out classes with no homework
    const { data, count, error } = await supabase
      .from('classes')
      .select('id, name, homework!inner(*)', { count: 'exact' })
      .order('name', { ascending: true })
      .order('created_at', { referencedTable: 'homework', ascending: false })
      .range(from, to);

    if (error) throwPostgresError(error, 'Homework');

    const groups: HomeWorkGroup[] = toCamel<
      { id: string; name: string; homework: HomeWorkRecord[] }[]
    >(data ?? []).map(({ id, name, homework }) => ({
      id,
      name,
      items: homework,
    }));

    return { success: true, data: { groups, isNext: (count ?? 0) > to + 1 } };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}

// The ids of the classes that have at least one published homework. Overview
// only needs to know which classes have nothing, so this reads one column and
// signs no files.
export async function getClassIdsWithHomework(): Promise<
  ActionResponse<string[]>
> {
  const validationResult = await action({ authorize: true });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  try {
    const supabase = createClient(await cookies());

    const { data, error } = await supabase
      .from('homework')
      .select('class_id')
      .eq('is_published', true);

    if (error) throwPostgresError(error, 'Homework');

    const ids = new Set<string>(
      (data ?? []).map((row: { class_id: string }) => row.class_id),
    );

    return { success: true, data: [...ids] };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}

export const getHomework = cache(
  async (id: string): Promise<ActionResponse<HomeWorkRecord>> => {
    const validationResult = await action({
      params: { id },
      schema: z.object({ id: z.uuid() }),
      authorize: true,
    });

    if (validationResult instanceof Error) {
      return handleError(new NotFoundError('Homework')) as ErrorResponse;
    }

    try {
      const supabase = createClient(await cookies());

      const { data, error } = await supabase
        .from('homework')
        .select('*, classes(id, name, type)')
        .eq('id', id)
        .maybeSingle();

      if (error) throwPostgresError(error, 'Homework');
      if (!data) throw new NotFoundError('Homework');

      const homework = toCamel<HomeWorkRecord>(data);

      if (homework.attachmentPath) {
        const urls = await signStoragePath(
          supabase,
          homework.attachmentPath,
          homework.attachmentName ?? homework.title,
        );

        homework.signedUrl = urls.signedUrl;
        homework.downloadUrl = urls.downloadUrl;
      }

      return { success: true, data: homework };
    } catch (error) {
      return handleError(error) as ErrorResponse;
    }
  },
);
