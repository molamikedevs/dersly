import { createClient } from '@/lib/supabase/server';
import { Session } from '@supabase/supabase-js';
import { cookies } from 'next/headers';
import { type ZodSchema } from 'zod';
import {
  RequestError,
  UnauthorizedError,
  ValidationError,
} from '../http-errors';

interface ActionOptions<T> {
  params?: T;
  schema?: ZodSchema;
  authorize?: boolean;
}

type ActionResult<T> =
  | ValidationError
  | RequestError
  | UnauthorizedError
  | { params: T | undefined; session: Session | null };

export default async function action<T>({
  params,
  schema,
  authorize = false,
}: ActionOptions<T>): Promise<ActionResult<T>> {
  const supabase = createClient(await cookies());
  // 1. Validation
  if (schema && params) {
    const parsed = schema.safeParse(params);
    if (!parsed.success) {
      return new ValidationError(
        parsed.error.flatten().fieldErrors as Record<string, string[]>,
      );
    }
  }

  // 2. Authorization (Supabase)
  let session: Session | null = null;
  if (authorize) {
    const {
      data: { session: supabaseSession },
    } = await supabase.auth.getSession();

    if (!supabaseSession) {
      return new UnauthorizedError();
    }
    session = supabaseSession;
  }
  return { session, params };
}
