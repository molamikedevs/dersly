'use server';

import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';

import action from '@/lib/handlers/action';
import handleError from '@/lib/handlers/errors';
import { throwPostgresError } from '@/lib/http-errors';
import { createClient } from '@/lib/supabase/server';
import { toCamel } from '@/lib/utils';
import {
  MistakeFixedSchema,
  MistakeFixSchema,
  MistakeSchema,
  type MistakeFixedValues,
  type MistakeFixValues,
  type MistakeValues,
} from '@/lib/validation/mistake.schema';
import { ActionResponse, ErrorResponse } from '@/types/global';

// The class page shows the list, the student home shows the card
function revalidateMistakePaths() {
  revalidatePath('/dashboard/classes', 'layout');
  revalidatePath('/');
}

export async function addMistake(
  params: MistakeValues,
): Promise<ActionResponse<MistakeRecord>> {
  const validationResult = await action({
    params,
    schema: MistakeSchema,
    authorize: true,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const { enrollmentId, wrong, correct, tip } = validationResult.params!;

  try {
    const supabase = createClient(await cookies());

    // The database only accepts one-to-one classes for now
    const { data, error } = await supabase
      .from('mistakes')
      .insert({
        enrollment_id: enrollmentId,
        wrong,
        correct,
        tip: tip || null,
      })
      .select()
      .single();

    if (error) throwPostgresError(error, 'Mistake');

    revalidateMistakePaths();

    return { success: true, data: toCamel<MistakeRecord>(data) };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}

export async function updateMistake(
  id: string,
  params: MistakeValues,
): Promise<ActionResponse<MistakeRecord>> {
  const validationResult = await action({
    params,
    schema: MistakeSchema,
    authorize: true,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const { wrong, correct, tip } = validationResult.params!;

  try {
    const supabase = createClient(await cookies());

    const { data, error } = await supabase
      .from('mistakes')
      .update({ wrong, correct, tip: tip || null })
      .eq('id', id)
      .select()
      .single();

    if (error) throwPostgresError(error, 'Mistake');

    revalidateMistakePaths();

    return { success: true, data: toCamel<MistakeRecord>(data) };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}

export async function deleteMistake(id: string): Promise<ActionResponse<null>> {
  const validationResult = await action({ authorize: true });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  try {
    const supabase = createClient(await cookies());

    const { error } = await supabase.from('mistakes').delete().eq('id', id);

    if (error) throwPostgresError(error, 'Mistake');

    revalidateMistakePaths();

    return { success: true, data: null };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}

// The student's try. The database saves it and only then hands back the
// correct version, so the answer never reaches the page before they try.
export async function submitMistakeFix(
  params: MistakeFixValues,
): Promise<ActionResponse<MistakeAnswer>> {
  const validationResult = await action({
    params,
    schema: MistakeFixSchema,
    authorize: true,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const { mistakeId, attempt } = validationResult.params!;

  try {
    const supabase = createClient(await cookies());

    const { data, error } = await supabase.rpc('submit_mistake_fix', {
      p_mistake_id: mistakeId,
      p_attempt: attempt,
    });

    if (error) throwPostgresError(error, 'Mistake');

    // Nothing is revalidated here: the card keeps the answer on screen
    // until the student chooses Got it or Still learning
    return { success: true, data: data as MistakeAnswer };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}

export async function setMistakeFixed(
  params: MistakeFixedValues,
): Promise<ActionResponse<null>> {
  const validationResult = await action({
    params,
    schema: MistakeFixedSchema,
    authorize: true,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const { mistakeId, fixed } = validationResult.params!;

  try {
    const supabase = createClient(await cookies());

    const { error } = await supabase.rpc('set_mistake_fixed', {
      p_mistake_id: mistakeId,
      p_fixed: fixed,
    });

    if (error) throwPostgresError(error, 'Mistake');

    revalidateMistakePaths();

    return { success: true, data: null };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}
