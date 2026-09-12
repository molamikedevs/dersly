'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';
import { Controller, useForm } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/toast';
import { signUp } from '@/features/auth/actions';
import PasswordInput from '@/features/auth/components/password-input';
import {
  RegisterSchema,
  type RegisterValues,
} from '@/lib/validation/auth.schema';

export function RegisterForm() {
  const form = useForm<RegisterValues>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: { fullname: '', email: '', password: '', code: '' },
  });

  const { isSubmitting } = form.formState;

  async function onSubmit(data: RegisterValues) {
    const result = await signUp(data);
    if (result?.error)
      toast.add({
        title: 'Could not create account',
        description: result.error,
      });
  }

  return (
    <div className="w-full rounded-lg bg-card p-5 shadow-sm sm:p-6">
      <h1 className="text-xl font-semibold tracking-tight text-foreground">
        Create your account
      </h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Use the class code your teacher gave you.
      </p>

      <form onSubmit={form.handleSubmit(onSubmit)} noValidate className="mt-6">
        <FieldGroup className="gap-4">
          <Controller
            name="code"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="register-code">Class code</FieldLabel>
                <Input
                  {...field}
                  onChange={(e) => field.onChange(e.target.value.toUpperCase())}
                  id="register-code"
                  autoComplete="off"
                  autoCapitalize="characters"
                  autoCorrect="off"
                  spellCheck={false}
                  placeholder="ABC123"
                  aria-invalid={fieldState.invalid}
                  className="invite-code h-11 text-center"
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Controller
            name="fullname"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="register-name">Full name</FieldLabel>
                <Input
                  {...field}
                  id="register-name"
                  className="h-11"
                  autoComplete="name"
                  placeholder="Aysel Mammadova"
                  aria-invalid={fieldState.invalid}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Controller
            name="email"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="register-email">Email</FieldLabel>
                <Input
                  {...field}
                  id="register-email"
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
                <FieldLabel htmlFor="register-password">Password</FieldLabel>
                <PasswordInput
                  {...field}
                  id="register-password"
                  className="h-11"
                  autoComplete="new-password"
                  placeholder="••••••••"
                  aria-invalid={fieldState.invalid}
                  aria-describedby="register-password-hint"
                />
                <FieldDescription id="register-password-hint">
                  At least 8 characters, with a letter and a number.
                </FieldDescription>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Button
            type="submit"
            className="mt-1 h-11 w-full"
            disabled={isSubmitting}
          >
            {isSubmitting && (
              <Loader2 className="size-4 animate-spin" aria-hidden />
            )}
            {isSubmitting ? 'Creating account' : 'Create account'}
          </Button>
        </FieldGroup>
      </form>

      <p className="mt-5 border-t border-border pt-4 text-center text-sm text-muted-foreground">
        Already have an account?{' '}
        <Link
          href="/login"
          className="font-medium text-primary underline-offset-4 hover:underline"
        >
          Log in
        </Link>
      </p>
    </div>
  );
}
