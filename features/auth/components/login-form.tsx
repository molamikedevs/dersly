'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';
import { Controller, useForm } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/toast';
import { signIn } from '@/features/auth/actions';
import PasswordInput from '@/features/auth/components/password-input';
import { LogInSchema, type LogInValues } from '@/lib/validation/auth.schema';

export function LoginForm() {
  const form = useForm<LogInValues>({
    resolver: zodResolver(LogInSchema),
    defaultValues: { email: '', password: '' },
  });

  const { isSubmitting } = form.formState;

  async function onSubmit(data: LogInValues) {
    const result = await signIn(data);
    if (result?.error)
      toast.add({ title: 'Could not log in', description: result.error });
  }

  return (
    <div className="w-full rounded-2xl border border-border bg-card p-6 sm:p-10">
      <h1 className="font-serif text-3xl font-medium tracking-tight text-foreground sm:text-4xl">
        Welcome back.
      </h1>
      <p className="mt-2 text-[15px] text-muted-foreground">
        Log in to see your lessons and homework.
      </p>

      <form onSubmit={form.handleSubmit(onSubmit)} noValidate className="mt-8">
        <FieldGroup className="gap-5">
          <Controller
            name="email"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="login-email">Email</FieldLabel>
                <Input
                  {...field}
                  id="login-email"
                  type="email"
                  inputMode="email"
                  className="h-12 rounded-xl text-[15px]"
                  autoComplete="email"
                  placeholder="you@example.com"
                  aria-invalid={fieldState.invalid}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Controller
            name="password"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <div className="flex items-baseline justify-between gap-4">
                  <FieldLabel htmlFor="login-password">Password</FieldLabel>
                  <Link
                    href="/forgot-password"
                    className="text-sm font-medium text-primary underline-offset-4 hover:underline"
                  >
                    Forgot?
                  </Link>
                </div>
                <PasswordInput
                  {...field}
                  id="login-password"
                  className="h-12 rounded-xl text-[15px]"
                  autoComplete="current-password"
                  placeholder="••••••••"
                  aria-invalid={fieldState.invalid}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Button
            type="submit"
            className="mt-1 h-12 w-full rounded-xl text-[15px] font-semibold"
            disabled={isSubmitting}
          >
            {isSubmitting && (
              <Loader2 className="size-4 animate-spin" aria-hidden />
            )}
            {isSubmitting ? 'Logging in' : 'Log in'}
          </Button>
        </FieldGroup>
      </form>

      <p className="mt-8 border-t border-border pt-6 text-center text-sm text-muted-foreground">
        New student?{' '}
        <Link
          href="/register"
          className="font-semibold text-primary underline-offset-4 hover:underline"
        >
          Create an account
        </Link>
      </p>
    </div>
  );
}
