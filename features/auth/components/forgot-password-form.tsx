'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, MailCheck } from 'lucide-react';
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
import { toast } from '@/components/ui/toast';
import { requestPasswordReset } from '@/features/auth/actions';
import {
  ForgotPasswordSchema,
  type ForgotPasswordValues,
} from '@/lib/validation/auth.schema';

export default function ForgotPasswordForm() {
  const [sent, setSent] = useState(false);

  const form = useForm<ForgotPasswordValues>({
    resolver: zodResolver(ForgotPasswordSchema),
    defaultValues: { email: '' },
  });

  const { isSubmitting } = form.formState;

  async function onSubmit(data: ForgotPasswordValues) {
    const result = await requestPasswordReset(data);

    if (result?.error) {
      toast.add({ title: 'Something went wrong', description: result.error });
      return;
    }

    setSent(true);
  }

  if (sent) {
    return (
      <div className="w-full rounded-2xl border border-border bg-card p-6 text-center sm:p-10">
        <span
          aria-hidden
          className="mx-auto flex size-12 items-center justify-center rounded-full bg-accent text-primary"
        >
          <MailCheck className="size-5" />
        </span>

        <h1 className="mt-5 font-serif text-2xl font-medium tracking-tight text-foreground sm:text-3xl">
          Check your email.
        </h1>

        <p className="mx-auto mt-3 max-w-sm text-[15px] leading-relaxed text-muted-foreground">
          If an account exists for that address, we have sent a link to reset
          your password. It expires in one hour.
        </p>

        <Button
          variant="ghost"
          className="mt-8 h-12 w-full rounded-xl text-[15px]"
        >
          <Link href="/login">Back to log in</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="w-full rounded-2xl border border-border bg-card p-6 sm:p-10">
      <h1 className="font-serif text-3xl font-medium tracking-tight text-foreground sm:text-4xl">
        Reset your password.
      </h1>
      <p className="mt-2 text-[15px] text-muted-foreground">
        Enter your email and we will send you a link.
      </p>

      <form onSubmit={form.handleSubmit(onSubmit)} noValidate className="mt-8">
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

          <Button
            type="submit"
            className="mt-1 h-12 w-full rounded-xl text-[15px] font-semibold"
            disabled={isSubmitting}
          >
            {isSubmitting && (
              <Loader2 className="size-4 animate-spin" aria-hidden />
            )}
            {isSubmitting ? 'Sending' : 'Send reset link'}
          </Button>
        </FieldGroup>
      </form>

      <p className="mt-8 border-t border-border pt-6 text-center text-sm text-muted-foreground">
        Remembered it?{' '}
        <Link
          href="/login"
          className="font-semibold text-primary underline-offset-4 hover:underline"
        >
          Log in
        </Link>
      </p>
    </div>
  );
}
