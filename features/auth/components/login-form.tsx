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
    <div className="w-full rounded-lg bg-card p-5 shadow-sm sm:p-8">
      <h1 className="text-2xl font-semibold tracking-tight text-foreground">
        Welcome back
      </h1>
      <p className="mt-1.5 text-sm text-muted-foreground">
        Log in to see your lessons and homework.
      </p>

      <form onSubmit={form.handleSubmit(onSubmit)} noValidate className="mt-8">
        <FieldGroup>
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
                  className="h-11"
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
                    className="text-sm text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline"
                  >
                    Forgot?
                  </Link>
                </div>
                <PasswordInput
                  {...field}
                  id="login-password"
                  className="h-11"
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

          <Button type="submit" className="h-11 w-full" disabled={isSubmitting}>
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
          className="font-medium text-primary underline-offset-4 hover:underline"
        >
          Create an account
        </Link>
      </p>
    </div>
  );
}
