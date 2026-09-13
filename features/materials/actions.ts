'use server';

import action from '@/lib/handlers/action';
import handleError from '@/lib/handlers/errors';
import { throwPostgresError } from '@/lib/http-errors';
import { createClient } from '@/lib/supabase/server';
import { toCamel } from '@/lib/utils';
import {
  MaterialSchema,
  MaterialValues,
} from '@/lib/validation/materials.schema';
import type { ActionResponse, ErrorResponse } from '@/types/global';
import type { MaterialRecord } from '@/types/materials';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import { uploadMaterialFile } from './uploader';

export async function createMaterialAction(
  params: MaterialValues,
): Promise<ActionResponse<MaterialRecord>> {
  const validationResult = await action({
    params,
    schema: MaterialSchema,
    authorize: true,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const { kind, title, description, level, url, file } = params!;

  try {
    const filePath =
      kind === 'file' && file ? await uploadMaterialFile(file) : null;

    const supabase = createClient(await cookies());

    const { data, error } = await supabase.from('materials').insert({
      title,
      kind,
      description: description || null,
      level: level ?? null,
      url: kind === 'link' ? url : null,
      file_path: filePath,
      class_id: null,
    });

    if (error) throwPostgresError(error, 'Material');

    revalidatePath('/dashboard/materials');

    return { success: true, data: toCamel<MaterialRecord>(data) };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}
