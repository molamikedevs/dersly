import { cookies } from 'next/headers';
import { cache } from 'react';

import action from '@/lib/handlers/action';
import handleError from '@/lib/handlers/errors';
import { NotFoundError, throwPostgresError } from '@/lib/http-errors';
import { createClient } from '@/lib/supabase/server';
import { MaterialKind, toCamel } from '@/lib/utils';
import { PaginatedSearchParamsSchema } from '@/lib/validation/global.schema';
import type {
  ActionResponse,
  ErrorResponse,
  PaginatedSearchParams,
} from '@/types/global';
import type { MaterialRecord } from '@/types/materials';

const SORTABLE = ['uploaded_at', 'title'] as const;
const UP_NEXT_SHOWN = 5;

export async function getMaterials(
  params: PaginatedSearchParams,
  kind: MaterialKind = 'link',
): Promise<ActionResponse<{ materials: MaterialRecord[]; isNext: boolean }>> {
  const validationResult = await action({
    params,
    schema: PaginatedSearchParamsSchema,
    authorize: true,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const {
    page = 1,
    pageSize = 10,
    filter,
    sort,
    query,
  } = validationResult.params!;

  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  try {
    const supabase = createClient(await cookies());

    let request = supabase
      .from('materials')
      .select('*', { count: 'exact' })
      .is('class_id', null)
      .eq('kind', kind);

    if (filter) request = request.eq('level', filter);
    if (query) request = request.ilike('title', `%${query}%`);

    const column = SORTABLE.includes(sort as never)
      ? (sort as string)
      : 'uploaded_at';

    const { data, count, error } = await request
      .order(column, { ascending: false })
      .range(from, to);

    if (error) throwPostgresError(error, 'Material');

    return {
      success: true,
      data: {
        materials: toCamel<MaterialRecord[]>(data ?? []),
        isNext: (count ?? 0) > to + 1,
      },
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}

export const getMaterial = cache(
  async (id: string): Promise<ActionResponse<MaterialRecord>> => {
    const validationResult = await action({ authorize: true });

    if (validationResult instanceof Error) {
      return handleError(validationResult) as ErrorResponse;
    }

    try {
      const supabase = createClient(await cookies());

      const { data, error } = await supabase
        .from('materials')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (error) throwPostgresError(error, 'Material');
      if (!data) throw new NotFoundError('Material');

      return { success: true, data: toCamel<MaterialRecord>(data) };
    } catch (error) {
      return handleError(error) as ErrorResponse;
    }
  },
);

export async function getRelatedVideos(
  current: Pick<MaterialRecord, 'id' | 'level'>,
): Promise<ActionResponse<MaterialRecord[]>> {
  const validationResult = await action({ authorize: true });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  try {
    const supabase = createClient(await cookies());

    // A small window is enough to fill five places after sorting by level
    const { data, error } = await supabase
      .from('materials')
      .select('*')
      .is('class_id', null)
      .eq('kind', 'link')
      .neq('id', current.id)
      .order('uploaded_at', { ascending: false })
      .limit(20);

    if (error) throwPostgresError(error, 'Material');

    const videos = toCamel<MaterialRecord[]>(data ?? []);
    const sameLevel = (item: MaterialRecord) =>
      Number(current.level !== null && item.level === current.level);

    // sort is stable, so newest first is kept inside each group
    const related = [...videos]
      .sort((a, b) => sameLevel(b) - sameLevel(a))
      .slice(0, UP_NEXT_SHOWN);

    return { success: true, data: related };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}
