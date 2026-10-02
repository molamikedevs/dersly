'use server';

import action from '@/lib/handlers/action';
import handleError from '@/lib/handlers/errors';
import { NotFoundError, throwPostgresError } from '@/lib/http-errors';
import { createClient } from '@/lib/supabase/server';
import { generateInviteCode, toCamel } from '@/lib/utils';
import { ClassSchema, ClassValues } from '@/lib/validation/class.schema';
import {
  LessonSchema,
  LessonValues,
  MarkLessonSchema,
  MarkLessonValues,
} from '@/lib/validation/lesson.schema';
import { ActionResponse, ErrorResponse } from '@/types/global';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';

function revalidateLessonPaths() {
  revalidatePath('/dashboard/classes');
  revalidatePath('/dashboard');
  revalidatePath('/');
}

export async function createClass(
  params: ClassValues,
): Promise<ActionResponse<ClassRecord>> {
  const validationResult = await action({
    params,
    schema: ClassSchema,
    authorize: true,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const { name, type, level, schedule, meetingUrl } = validationResult.params!;
  const { user } = validationResult;

  try {
    const supabase = createClient(await cookies());

    const { data, error } = await supabase
      .from('classes')
      .insert({
        teacher_id: user!.id,
        name,
        type,
        level: level ?? null,
        schedule: schedule || null,
        meeting_url: meetingUrl || null,
        invite_code: generateInviteCode(),
        handles_payment: type === 'one_to_one',
      })
      .select()
      .single();

    if (error) throwPostgresError(error, 'Class');

    revalidatePath('/dashboard/classes');

    return { success: true, data: toCamel<ClassRecord>(data) };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}

export async function updateClass(
  id: string,
  params: ClassValues,
): Promise<ActionResponse<ClassRecord>> {
  const validationResult = await action({
    params,
    schema: ClassSchema,
    authorize: true,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const { name, type, level, schedule, meetingUrl } = validationResult.params!;

  try {
    const supabase = createClient(await cookies());

    const { data, error } = await supabase
      .from('classes')
      .update({
        name,
        type,
        level: level ?? null,
        schedule: schedule || null,
        meeting_url: meetingUrl || null,
        handles_payment: type === 'one_to_one',
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throwPostgresError(error, 'Class');

    revalidatePath('/dashboard/classes');
    revalidatePath(`/dashboard/classes/${id}`);

    return { success: true, data: toCamel<ClassRecord>(data) };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}

export async function archiveClass(id: string): Promise<ActionResponse<null>> {
  const validationResult = await action({ authorize: true });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  try {
    const supabase = createClient(await cookies());

    const { data, error } = await supabase
      .from('classes')
      .update({ is_active: false, enrollment_open: false })
      .eq('id', id)
      .select();

    if (error) throwPostgresError(error, 'Class');
    if (!data?.length) throw new NotFoundError('Class');

    revalidatePath('/dashboard/classes');

    return { success: true, data: null };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}

export async function markLesson(
  params: MarkLessonValues,
): Promise<ActionResponse<{ lessonsDone: number }>> {
  const validationResult = await action({
    params,
    schema: MarkLessonSchema,
    authorize: true,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const { enrollmentId, note } = validationResult.params!;

  try {
    const supabase = createClient(await cookies());

    const { data, error } = await supabase.rpc('mark_lesson', {
      p_enrollment_id: enrollmentId,
      p_note: note || null,
    });

    if (error) throwPostgresError(error, 'Lesson');

    revalidateLessonPaths();

    return { success: true, data: { lessonsDone: data as number } };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}

export async function undoLesson(
  params: LessonValues,
): Promise<ActionResponse<{ lessonsDone: number }>> {
  const validationResult = await action({
    params,
    schema: LessonSchema,
    authorize: true,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const { enrollmentId } = validationResult.params!;

  try {
    const supabase = createClient(await cookies());

    const { data, error } = await supabase.rpc('undo_lesson', {
      p_enrollment_id: enrollmentId,
    });

    if (error) throwPostgresError(error, 'Lesson');

    revalidateLessonPaths();

    return { success: true, data: { lessonsDone: data as number } };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}

export async function resetPackage(
  params: LessonValues,
): Promise<ActionResponse<null>> {
  const validationResult = await action({
    params,
    schema: LessonSchema,
    authorize: true,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const { enrollmentId } = validationResult.params!;

  try {
    const supabase = createClient(await cookies());

    const { error } = await supabase.rpc('reset_package', {
      p_enrollment_id: enrollmentId,
    });

    if (error) throwPostgresError(error, 'Package');

    revalidateLessonPaths();

    return { success: true, data: null };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}
