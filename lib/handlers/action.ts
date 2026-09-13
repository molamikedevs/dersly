import { createClient } from '@/lib/supabase/server';
import { User } from '@supabase/supabase-js';
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
  | { params: T | undefined; user: User | null };

export default async function action<T>({
  params,
  schema,
  authorize = false,
}: ActionOptions<T>): Promise<ActionResult<T>> {
  let validated = params;

  // 1. Validation
  if (schema && params) {
    const parsed = schema.safeParse(params);

    if (!parsed.success) {
      return new ValidationError(
        parsed.error.flatten().fieldErrors as Record<string, string[]>,
      );
    }

    validated = parsed.data as T;
  }

  // 2. Authorization
  let user: User | null = null;

  if (authorize) {
    const supabase = createClient(await cookies());
    const {
      data: { user: currentUser },
      error,
    } = await supabase.auth.getUser();

    if (error || !currentUser) return new UnauthorizedError();

    user = currentUser;
  }

  return { user, params: validated };
}
