import { NextResponse } from 'next/server';

type ActionResponse<T = null> = {
  success: boolean;
  data?: T;
  status?: number;
  error?: {
    message: string;
    details?: Record<string, string[]>;
  };
};

type SuccessResponse<T = null> = ActionResponse<T> & { success: true };
type ErrorResponse = ActionResponse<undefined> & { success: false };
type ApiErrrorResponse = NextResponse<ErrorResponse>;

export interface RouteParams<
  P = Record<string, string>,
  S = Record<string, string | string[] | undefined>,
> {
  params: Promise<P>;
  searchParams: Promise<S>;
}
