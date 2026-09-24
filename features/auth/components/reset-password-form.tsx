'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field';
import { toast } from '@/components/ui/toast';
import { updatePassword } from '@/features/auth/actions';
import PasswordInput from '@/features/auth/components/password-input';
import {
  ResetPasswordSchema,
  type ResetPasswordValues,
} from '@/lib/validation/auth.schema';

export default function ResetPasswordForm() {
  const [expired, setExpired] = useState(false);

  const form = useForm<ResetPasswordValues>({
    resolver: zodResolver(ResetPasswordSchema),
    defaultValues: { password: '', confirm: '' },
  });

  const { isSubmitting } = form.formState;

  async function onSubmit(data: ResetPasswordValues) {
    const result = await updatePassword(data);

    if (result?.error) {
      setExpired(true);
      toast.add({ title: 'Link expired', description: result.error });
    }
  }

  if (expired) {
    return (
      <div className="w-full rounded-2xl border border-border bg-card p-6 text-center sm:p-10">
        <h1 className="font-serif text-2xl font-medium tracking-tight text-foreground sm:text-3xl">
          This link has expired.
        </h1>

        <p className="mx-auto mt-3 max-w-sm text-[15px] leading-relaxed text-muted-foreground">
          Reset links can only be used once, and they expire after an hour.
          Request a new one.
        </p>

        <Button className="mt-8 h-12 w-full rounded-xl text-[15px]">
          <Link href="/forgot-password">Send a new link</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="w-full rounded-2xl border border-border bg-card p-6 sm:p-10">
      <h1 className="font-serif text-3xl font-medium tracking-tight text-foreground sm:text-4xl">
        Choose a new password.
      </h1>
      <p className="mt-2 text-[15px] text-muted-foreground">
        You will be logged in once it is saved.
      </p>

      <form onSubmit={form.handleSubmit(onSubmit)} noValidate className="mt-8">
        <FieldGroup className="gap-5">
          <Controller
            name="password"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="reset-password">New password</FieldLabel>
                <PasswordInput
                  {...field}
                  id="reset-password"
                  className="h-12 rounded-xl text-[15px]"
                  autoComplete="new-password"
                  placeholder="••••••••"
                  aria-invalid={fieldState.invalid}
                  aria-describedby="reset-password-hint"
                />
                <FieldDescription id="reset-password-hint">
                  At least 8 characters, with a letter and a number.
                </FieldDescription>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Controller
            name="confirm"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="reset-confirm">
                  Confirm password
                </FieldLabel>
                <PasswordInput
                  {...field}
                  id="reset-confirm"
                  className="h-12 rounded-xl text-[15px]"
                  autoComplete="new-password"
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
            {isSubmitting ? 'Saving' : 'Save password'}
          </Button>
        </FieldGroup>
      </form>
    </div>
  );
}
