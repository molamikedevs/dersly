'use server';

import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';

import action from '@/lib/handlers/action';
import handleError from '@/lib/handlers/errors';
import { throwPostgresError } from '@/lib/http-errors';
import { createClient } from '@/lib/supabase/server';
import { toCamel } from '@/lib/utils';
import {
  WordAnswerSchema,
  WordSchema,
  type WordAnswerValues,
  type WordValues,
} from '@/lib/validation/vocabulary.schema';
import { ActionResponse, ErrorResponse } from '@/types/global';
import { weekStart } from './week';

// The class page shows the list, the student home shows the card
function revalidateWordPaths() {
  revalidatePath('/dashboard/classes', 'layout');
  revalidatePath('/');
}

export async function addWord(
  params: WordValues,
): Promise<ActionResponse<WordRecord>> {
  const validationResult = await action({
    params,
    schema: WordSchema,
    authorize: true,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const { enrollmentId, word, meaning, example } = validationResult.params!;

  try {
    const supabase = createClient(await cookies());

    // Words are for this week. The database allows 5 a week and
    // one-to-one classes only.
    const { data, error } = await supabase
      .from('words')
      .insert({
        enrollment_id: enrollmentId,
        week_start: weekStart(),
        word,
        meaning,
        example: example || null,
      })
      .select()
      .single();

    if (error) throwPostgresError(error, 'Word');

    revalidateWordPaths();

    return { success: true, data: toCamel<WordRecord>(data) };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}

// The week is not changed here, only what the word says
export async function updateWord(
  id: string,
  params: WordValues,
): Promise<ActionResponse<WordRecord>> {
  const validationResult = await action({
    params,
    schema: WordSchema,
    authorize: true,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const { word, meaning, example } = validationResult.params!;

  try {
    const supabase = createClient(await cookies());

    const { data, error } = await supabase
      .from('words')
      .update({ word, meaning, example: example || null })
      .eq('id', id)
      .select()
      .single();

    if (error) throwPostgresError(error, 'Word');

    revalidateWordPaths();

    return { success: true, data: toCamel<WordRecord>(data) };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}

export async function deleteWord(id: string): Promise<ActionResponse<null>> {
  const validationResult = await action({ authorize: true });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  try {
    const supabase = createClient(await cookies());

    const { error } = await supabase.from('words').delete().eq('id', id);

    if (error) throwPostgresError(error, 'Word');

    revalidateWordPaths();

    return { success: true, data: null };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}

// The student's one try at a word from last week, checked in the database
// so the word never reaches the page before they answer
export async function checkWord(
  params: WordAnswerValues,
): Promise<ActionResponse<WordCheck>> {
  const validationResult = await action({
    params,
    schema: WordAnswerSchema,
    authorize: true,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const { wordId, answer } = validationResult.params!;

  try {
    const supabase = createClient(await cookies());

    const { data, error } = await supabase.rpc('check_word', {
      p_word_id: wordId,
      p_answer: answer,
    });

    if (error) throwPostgresError(error, 'Word');

    // The result shows on Home and on the class page
    revalidateWordPaths();

    return { success: true, data: data as WordCheck };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}
