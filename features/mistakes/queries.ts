import { cookies } from 'next/headers';
import * as z from 'zod';

import action from '@/lib/handlers/action';
import handleError from '@/lib/handlers/errors';
import { throwPostgresError } from '@/lib/http-errors';
import { createClient } from '@/lib/supabase/server';
import { toCamel } from '@/lib/utils';
import { ActionResponse, ErrorResponse } from '@/types/global';

// The newest open mistakes a student sees on their home page
const OPEN_SHOWN = 5;

// One student's mistakes for the teacher: open ones first, newest first
export async function getStudentMistakes(
  enrollmentId: string,
): Promise<ActionResponse<MistakeRecord[]>> {
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
      .from('mistakes')
      .select('*')
      .eq('enrollment_id', enrollmentId)
      .order('fixed_at', { ascending: false, nullsFirst: true })
      .order('created_at', { ascending: false });

    if (error) throwPostgresError(error, 'Mistake');

    return { success: true, data: toCamel<MistakeRecord[]>(data ?? []) };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}

// The signed-in student's open mistakes, without the answers, and how many
// they have fixed. Row level security keeps it to their own.
export async function getMyMistakes(): Promise<
  ActionResponse<StudentMistakes>
> {
  const validationResult = await action({ authorize: true });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  try {
    const supabase = createClient(await cookies());

    const [openResult, fixedResult] = await Promise.all([
      supabase
        .from('mistakes')
        .select('id, wrong')
        .is('fixed_at', null)
        .order('created_at', { ascending: false })
        .limit(OPEN_SHOWN),
      supabase
        .from('mistakes')
        .select('id', { count: 'exact', head: true })
        .not('fixed_at', 'is', null),
    ]);

    if (openResult.error) throwPostgresError(openResult.error, 'Mistake');
    if (fixedResult.error) throwPostgresError(fixedResult.error, 'Mistake');

    return {
      success: true,
      data: {
        open: (openResult.data ?? []) as OpenMistake[],
        fixedCount: fixedResult.count ?? 0,
      },
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}
