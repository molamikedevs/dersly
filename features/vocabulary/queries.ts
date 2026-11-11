import { cookies } from 'next/headers';
import * as z from 'zod';

import action from '@/lib/handlers/action';
import handleError from '@/lib/handlers/errors';
import { throwPostgresError } from '@/lib/http-errors';
import { createClient } from '@/lib/supabase/server';
import { toCamel } from '@/lib/utils';
import { ActionResponse, ErrorResponse } from '@/types/global';
import { weekStart } from './week';

// About ten weeks of words, enough for the class page
const WORDS_SHOWN = 50;

// The word and anything built on it ("go" also hides "goes" and "going"),
// so the example does not give the answer away
function blankOut(example: string | null, word: string) {
  if (!example) return null;

  const escaped = word.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

  return example.replace(new RegExp(`\\b${escaped}\\w*`, 'gi'), '____');
}

// One student's words for the teacher, the newest week first
export async function getStudentWords(
  enrollmentId: string,
): Promise<ActionResponse<WordRecord[]>> {
  const validationResult = await action({
    params: { enrollmentId },
    schema: z.object({ enrollmentId: z.uuid() }),
    authorize: true,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  try {
    const supabase = createClient(await cookies());

    const { data, error } = await supabase
      .from('words')
      .select('*')
      .eq('enrollment_id', enrollmentId)
      .order('week_start', { ascending: false })
      .order('created_at', { ascending: true })
      .limit(WORDS_SHOWN);

    if (error) throwPostgresError(error, 'Word');

    return { success: true, data: toCamel<WordRecord[]>(data ?? []) };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}

// The signed-in student's words: this week's to study, in full, and last
// week's for the check, without the word until they have answered.
// Row level security keeps it to their own.
export async function getMyVocabulary(): Promise<
  ActionResponse<StudentVocabulary>
> {
  const validationResult = await action({ authorize: true });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  try {
    const supabase = createClient(await cookies());
    const now = new Date();
    const thisWeek = weekStart(now);
    const lastWeek = weekStart(now, -1);

    const { data, error } = await supabase
      .from('words')
      .select('id, week_start, word, meaning, example, attempts, learned_at')
      .in('week_start', [thisWeek, lastWeek])
      .order('created_at', { ascending: true });

    if (error) throwPostgresError(error, 'Word');

    const rows = data ?? [];

    const study: StudyWord[] = rows
      .filter((row) => row.week_start === thisWeek)
      .map(({ id, word, meaning, example }) => ({
        id,
        word,
        meaning,
        example,
      }));

    const check: CheckWord[] = rows
      .filter((row) => row.week_start === lastWeek)
      .map((row) => ({
        id: row.id,
        meaning: row.meaning,
        example: blankOut(row.example, row.word),
        result:
          row.attempts > 0
            ? { right: Boolean(row.learned_at), word: row.word }
            : null,
      }));

    return {
      success: true,
      data: {
        study: { weekStart: thisWeek, words: study },
        check: { weekStart: lastWeek, words: check },
      },
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}
