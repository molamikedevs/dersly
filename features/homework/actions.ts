'use server';

import action from '@/lib/handlers/action';
import handleError from '@/lib/handlers/errors';
import { NotFoundError, throwPostgresError } from '@/lib/http-errors';
import { createClient } from '@/lib/supabase/server';
import { uploadFile } from '@/lib/supabase/upload-file';
import { toCamel } from '@/lib/utils';
import {
  HomeworkSchema,
  HomeworkValues,
} from '@/lib/validation/homework.schema';
import { ActionResponse, ErrorResponse } from '@/types/global';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';

const HOMEWORK_BUCKET = 'homework';

export async function createHomework(
  params: HomeworkValues,
): Promise<ActionResponse<HomeWorkRecord>> {
  const validationResult = await action({
    params,
    schema: HomeworkSchema,
    authorize: true,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const { classId, title, instructions, file } = validationResult.params!;

  try {
    const attachmentPath = file
      ? await uploadFile(file, HOMEWORK_BUCKET)
      : null;

    const supabase = createClient(await cookies());

    const { data, error } = await supabase
      .from('homework')
      .insert({
        class_id: classId,
        title,
        instructions: instructions || null,
        attachment_path: attachmentPath,
        attachment_name: file?.name ?? null,
        is_published: true,
      })
      .select()
      .single();

    if (error) throwPostgresError(error, 'Homework');

    revalidatePath('/dashboard/homework');
    revalidatePath(`/dashboard/classes/${classId}`);

    return { success: true, data: toCamel<HomeWorkRecord>(data) };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}

export async function updateHomework(
  id: string,
  params: HomeworkValues,
): Promise<ActionResponse<HomeWorkRecord>> {
  const validationResult = await action({
    params,
    schema: HomeworkSchema,
    authorize: true,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const { classId, title, instructions, file } = validationResult.params!;

  try {
    const supabase = createClient(await cookies());

    const { data: existing, error: readError } = await supabase
      .from('homework')
      .select('attachment_path, attachment_name')
      .eq('id', id)
      .maybeSingle();

    if (readError) throwPostgresError(readError, 'Homework');
    if (!existing) throw new NotFoundError('Homework');

    const newPath = file ? await uploadFile(file, HOMEWORK_BUCKET) : null;
    const attachmentPath = newPath ?? existing.attachment_path;
    const attachmentName = file?.name ?? existing.attachment_name;

    const { data, error } = await supabase
      .from('homework')
      .update({
        title,
        instructions: instructions || null,
        attachment_path: attachmentPath,
        attachment_name: attachmentName,
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throwPostgresError(error, 'Homework');

    const orphan = existing.attachment_path;
    if (orphan && orphan !== attachmentPath) {
      const [bucket, ...rest] = orphan.split('/');
      await supabase.storage.from(bucket).remove([rest.join('/')]);
    }

    revalidatePath('/dashboard/homework');
    revalidatePath(`/dashboard/classes/${classId}`);

    return { success: true, data: toCamel<HomeWorkRecord>(data) };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}

export async function deleteHomeWork(
  id: string,
): Promise<ActionResponse<null>> {
  const validationResult = await action({ authorize: true });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  try {
    const supabase = createClient(await cookies());

    const { data: existing, error: readError } = await supabase
      .from('homework')
      .select('class_id, attachment_path')
      .eq('id', id)
      .maybeSingle();

    if (readError) throwPostgresError(readError, 'Homework');
    if (!existing) throw new NotFoundError('Homework');

    const { error } = await supabase.from('homework').delete().eq('id', id);

    if (error) throwPostgresError(error, 'Homework');

    if (existing.attachment_path) {
      const [bucket, ...rest] = existing.attachment_path.split('/');
      await supabase.storage.from(bucket).remove([rest.join('/')]);
    }

    revalidatePath('/dashboard/homework');
    revalidatePath(`/dashboard/classes/${existing.class_id}`);

    return { success: true, data: null };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}
