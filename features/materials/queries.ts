import { cookies } from 'next/headers';

import action from '@/lib/handlers/action';
import handleError from '@/lib/handlers/errors';
import { throwPostgresError } from '@/lib/http-errors';
import { createClient } from '@/lib/supabase/server';
import { toCamel } from '@/lib/utils';
import { PaginatedSearchParamsSchema } from '@/lib/validation/global.schema';
import type {
  ActionResponse,
  ErrorResponse,
  PaginatedSearchParams,
} from '@/types/global';
import type { MaterialRecord } from '@/types/materials';

const SORTABLE = ['uploaded_at', 'title'] as const;

export async function getMaterials(
  params: PaginatedSearchParams,
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
      .is('class_id', null);

    if (query) request = request.ilike('title', `%${query}%`);
    if (filter) request = request.eq('level', filter);

    const column = SORTABLE.includes(sort as never)
      ? (sort as string)
      : 'uploaded_at';

    const { data, count, error } = await request
      .order(column, { ascending: false })
      .range(from, to);

    if (error) throwPostgresError(error, 'Material');

    const materials = toCamel<MaterialRecord[]>(data ?? []);

    await Promise.all(
      materials.map(async (item) => {
        if (!item.filePath) return;

        const [bucket, ...rest] = item.filePath.split('/');
        const path = rest.join('/');
        const extension = path.split('.').pop() ?? 'pdf';

        const [view, download] = await Promise.all([
          supabase.storage.from(bucket).createSignedUrl(path, 60 * 15),
          supabase.storage.from(bucket).createSignedUrl(path, 60 * 15, {
            download: `${item.title}.${extension}`,
          }),
        ]);

        item.signedUrl = view.data?.signedUrl ?? null;
        item.downloadUrl = download.data?.signedUrl ?? null;
      }),
    );

    return {
      success: true,
      data: {
        materials,
        isNext: (count ?? 0) > to + 1,
      },
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}
