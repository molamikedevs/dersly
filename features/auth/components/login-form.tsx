'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { signIn } from '@/features/auth/actions';
import FormAlert from '@/features/auth/components/form-alert';
import PasswordInput from '@/features/auth/components/password-input';
import {
  AUTH_INPUT,
  AUTH_SUBMIT,
  AUTH_TEXT_LINK,
} from '@/features/auth/styles';
import { LogInSchema, type LogInValues } from '@/lib/validation/auth.schema';

// Shown above the form, for example after an expired email link
type Props = {
  notice?: string | null;
};

export function LoginForm({ notice }: Props) {
  const [formError, setFormError] = useState<string | null>(null);

  const form = useForm<LogInValues>({
    resolver: zodResolver(LogInSchema),
    defaultValues: { email: '', password: '' },
  });

  const { isSubmitting } = form.formState;

  async function onSubmit(data: LogInValues) {
    setFormError(null);

    const result = await signIn(data);

    if (result?.error) {
      setFormError(result.error);
      // Ready for another try: the password is selected, nothing is cleared
      form.setFocus('password', { shouldSelect: true });
    }
  }

  return (
    <div className="flex w-full flex-col">
      <h1 className="font-serif text-4xl leading-tight font-medium tracking-tight wrap-break-word text-foreground sm:text-5xl">
        Welcome back.
      </h1>
      <p className="mt-3 text-base text-muted-foreground">
        Log in to see your lessons and homework.
      </p>

      {notice && (
        <FormAlert tone="info" className="mt-8">
          {notice}
        </FormAlert>
      )}

      <form
        onSubmit={form.handleSubmit(onSubmit)}
        noValidate
        className="mt-8"
        aria-busy={isSubmitting}
      >
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
                  autoComplete="email"
                  autoCapitalize="none"
                  autoCorrect="off"
                  spellCheck={false}
                  enterKeyHint="next"
                  placeholder="you@example.com"
                  className={AUTH_INPUT}
                  aria-invalid={fieldState.invalid}
                  aria-describedby={
                    fieldState.invalid ? 'login-email-error' : undefined
                  }
                />
                <FieldError
                  id="login-email-error"
                  errors={[fieldState.error]}
                />
              </Field>
            )}
          />

          <Controller
            name="password"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                  <FieldLabel htmlFor="login-password">Password</FieldLabel>
                  <Link
                    href="/forgot-password"
                    className={`-my-2 py-2 text-sm ${AUTH_TEXT_LINK}`}
                  >
                    Forgot password?
                  </Link>
                </div>
                <PasswordInput
                  {...field}
                  id="login-password"
                  autoComplete="current-password"
                  enterKeyHint="go"
                  className={AUTH_INPUT}
                  aria-invalid={fieldState.invalid}
                  aria-describedby={
                    fieldState.invalid ? 'login-password-error' : undefined
                  }
                />
                <FieldError
                  id="login-password-error"
                  errors={[fieldState.error]}
                />
              </Field>
            )}
          />

          {formError && <FormAlert>{formError}</FormAlert>}

          <Button type="submit" className={AUTH_SUBMIT} disabled={isSubmitting}>
            {isSubmitting && (
              <Loader2 className="size-4 animate-spin" aria-hidden />
            )}
            {isSubmitting ? 'Logging in' : 'Log in'}
          </Button>
        </FieldGroup>
      </form>

      <p className="mt-10 border-t border-border pt-6 text-[15px] text-muted-foreground">
        New student?{' '}
        <Link href="/register" className={AUTH_TEXT_LINK}>
          Create an account
        </Link>
      </p>
    </div>
  );
}
