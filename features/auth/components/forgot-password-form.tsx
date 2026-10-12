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
import { requestPasswordReset } from '@/features/auth/actions';
import FormAlert from '@/features/auth/components/form-alert';
import {
  AUTH_INPUT,
  AUTH_LINK_SECONDARY,
  AUTH_SUBMIT,
  AUTH_TEXT_LINK,
} from '@/features/auth/styles';
import {
  ForgotPasswordSchema,
  type ForgotPasswordValues,
} from '@/lib/validation/auth.schema';

export default function ForgotPasswordForm() {
  const [sentTo, setSentTo] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  const form = useForm<ForgotPasswordValues>({
    resolver: zodResolver(ForgotPasswordSchema),
    defaultValues: { email: '' },
  });

  const { isSubmitting } = form.formState;

  async function onSubmit(data: ForgotPasswordValues) {
    setFormError(null);

    const result = await requestPasswordReset(data);

    if (result?.error) {
      setFormError(result.error);
      return;
    }

    setSentTo(data.email);
  }

  if (sentTo) {
    return (
      <div className="flex w-full flex-col">
        <h1 className="font-serif text-4xl leading-tight font-medium tracking-tight wrap-break-word text-foreground sm:text-5xl">
          Check your email.
        </h1>

        <p
          role="status"
          className="mt-3 text-base leading-relaxed text-muted-foreground"
        >
          If{' '}
          <span className="font-semibold break-all text-foreground">
            {sentTo}
          </span>{' '}
          has a Dersly account, a link to choose a new password is on its way.
          The link works once, for one hour.
        </p>

        <p className="mt-4 text-[15px] leading-relaxed text-muted-foreground">
          Nothing there? Check your spam folder, or wait a minute and send it
          again.
        </p>

        <div className="mt-8 flex flex-col gap-3">
          <Link href="/login" className={AUTH_LINK_SECONDARY}>
            Back to log in
          </Link>
          <button
            type="button"
            onClick={() => setSentTo(null)}
            className={`self-center py-2 text-[15px] ${AUTH_TEXT_LINK}`}
          >
            Use a different email
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col">
      <h1 className="font-serif text-4xl leading-tight font-medium tracking-tight wrap-break-word text-foreground sm:text-5xl">
        Reset your password.
      </h1>
      <p className="mt-3 text-base text-muted-foreground">
        Enter the email you signed up with. We will send you a link to choose a
        new password.
      </p>

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
                <FieldLabel htmlFor="forgot-email">Email</FieldLabel>
                <Input
                  {...field}
                  id="forgot-email"
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  autoCapitalize="none"
                  autoCorrect="off"
                  spellCheck={false}
                  enterKeyHint="send"
                  placeholder="you@example.com"
                  className={AUTH_INPUT}
                  aria-invalid={fieldState.invalid}
                  aria-describedby={
                    fieldState.invalid ? 'forgot-email-error' : undefined
                  }
                />
                <FieldError
                  id="forgot-email-error"
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
            {isSubmitting ? 'Sending' : 'Send reset link'}
          </Button>
        </FieldGroup>
      </form>

      <p className="mt-10 border-t border-border pt-6 text-[15px] text-muted-foreground">
        Remembered it?{' '}
        <Link href="/login" className={AUTH_TEXT_LINK}>
          Log in
        </Link>
      </p>
    </div>
  );
}
