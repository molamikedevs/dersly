'use server';

import action from '@/lib/handlers/action';
import handleError from '@/lib/handlers/errors';
import { NotFoundError, throwPostgresError } from '@/lib/http-errors';
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

  const { kind, title, description, level, url, file } =
    validationResult.params!;

  try {
    const supabase = createClient(await cookies());

    const filePath =
      kind === 'file' && file ? await uploadMaterialFile(file) : null;

    const { data, error } = await supabase
      .from('materials')
      .insert({
        title,
        kind,
        description: description || null,
        level: level ?? null,
        url: kind === 'file' ? null : url,
        file_path: filePath,
        file_name: kind === 'file' ? (file?.name ?? null) : null,
        class_id: null,
      })
      .select()
      .single();

    if (error) throwPostgresError(error, 'Material');

    revalidatePath('/dashboard/materials');
    revalidatePath('/materials');
    revalidatePath('/');

    return { success: true, data: toCamel<MaterialRecord>(data) };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}

export async function updateMaterialAction(
  id: string,
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

  const { kind, title, description, level, url, file } =
    validationResult.params!;

  try {
    const supabase = createClient(await cookies());

    const { data: existing, error: readError } = await supabase
      .from('materials')
      .select('file_path, file_name')
      .eq('id', id)
      .maybeSingle();

    if (readError) throwPostgresError(readError, 'Material');
    if (!existing) throw new NotFoundError('Material');

    const newPath =
      kind === 'file' && file ? await uploadMaterialFile(file) : null;

    const filePath = kind === 'file' ? (newPath ?? existing.file_path) : null;
    const fileName =
      kind === 'file' ? (file?.name ?? existing.file_name) : null;

    const { data, error } = await supabase
      .from('materials')
      .update({
        title,
        kind,
        description: description || null,
        level: level ?? null,
        url: kind === 'file' ? null : url,
        file_path: filePath,
        file_name: fileName,
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throwPostgresError(error, 'Material');

    const orphan = existing.file_path;
    if (orphan && orphan !== filePath) {
      const [bucket, ...rest] = orphan.split('/');
      await supabase.storage.from(bucket).remove([rest.join('/')]);
    }

    revalidatePath('/dashboard/materials');
    revalidatePath('/materials');
    revalidatePath('/');

    return { success: true, data: toCamel<MaterialRecord>(data) };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}

export async function deleteMaterialAction(
  id: string,
): Promise<ActionResponse<null>> {
  const validationResult = await action({ authorize: true });
  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  try {
    const supabase = createClient(await cookies());

    const { data: material, error: readError } = await supabase
      .from('materials')
      .select('file_path')
      .eq('id', id)
      .maybeSingle();

    if (readError) throwPostgresError(readError, 'Material');
    if (!material) throw new NotFoundError('Material');

    const { error } = await supabase.from('materials').delete().eq('id', id);
    if (error) throwPostgresError(error, 'Material');

    if (material.file_path) {
      const [bucket, ...rest] = material.file_path.split('/');
      await supabase.storage.from(bucket).remove([rest.join('/')]);
    }

    revalidatePath('/dashboard/materials');
    revalidatePath('/materials');
    revalidatePath('/');

    return { success: true, data: null };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}
