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

function toRow({
  kind,
  title,
  description,
  level,
  url,
  content,
}: MaterialValues) {
  return {
    title,
    kind,
    description: description || null,
    level: level ?? null,
    url: kind === 'guide' ? null : url,
    content: kind === 'guide' ? content : null,
  };
}

function revalidateMaterialPaths(id?: string) {
  revalidatePath('/dashboard/materials');
  revalidatePath('/materials');
  revalidatePath('/');
  if (id) revalidatePath(`/materials/${id}`);
}

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

  try {
    const supabase = createClient(await cookies());

    const { data, error } = await supabase
      .from('materials')
      .insert({ ...toRow(validationResult.params!), class_id: null })
      .select()
      .single();

    if (error) throwPostgresError(error, 'Material');

    revalidateMaterialPaths();

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

  try {
    const supabase = createClient(await cookies());

    const { data, error } = await supabase
      .from('materials')
      .update(toRow(validationResult.params!))
      .eq('id', id)
      .select()
      .maybeSingle();

    if (error) throwPostgresError(error, 'Material');
    if (!data) throw new NotFoundError('Material');

    revalidateMaterialPaths(id);

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

    const { data, error } = await supabase
      .from('materials')
      .delete()
      .eq('id', id)
      .select('id');

    if (error) throwPostgresError(error, 'Material');
    if (!data?.length) throw new NotFoundError('Material');

    revalidateMaterialPaths(id);

    return { success: true, data: null };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}
