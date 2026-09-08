import { createClient } from '@/lib/supabase/client';
import { Session } from '@supabase/supabase-js';
import { ZodError, type ZodSchema } from 'zod';
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
  const supabase = createClient();
  // 1. Validation
  if (schema && params)
    try {
      schema.parse(params);
    } catch (error) {
      if (error instanceof ZodError) {
        return new ValidationError(
          error.flatten().fieldErrors as Record<string, string[]>,
        );
      }
      return new RequestError(400, 'Schema validation faild');
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
