'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';
import { Controller, useForm } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
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
    <Card className="border-0 bg-transparent shadow-none sm:border sm:bg-card sm:shadow-sm">
      <CardHeader className="px-4 sm:px-6">
        <CardTitle className="text-xl sm:text-2xl">Welcome back</CardTitle>
        <CardDescription>
          Log in to see your lessons and homework.
        </CardDescription>
      </CardHeader>

      <CardContent className="px-4 sm:px-6">
        <form onSubmit={form.handleSubmit(onSubmit)} noValidate>
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
                      className="text-sm font-medium text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
                    >
                      Forgot?
                    </Link>
                  </div>
                  <PasswordInput
                    {...field}
                    id="login-password"
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

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting && (
                <Loader2 className="size-4 animate-spin" aria-hidden />
              )}
              {isSubmitting ? 'Logging in' : 'Log in'}
            </Button>

            <p className="text-center text-sm text-muted-foreground">
              New student?{' '}
              <Link
                href="/register"
                className="font-medium text-primary underline-offset-4 hover:underline"
              >
                Create an account
              </Link>
            </p>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
}
