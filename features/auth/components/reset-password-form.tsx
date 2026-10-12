'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { Controller, useForm, useWatch } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field';
import { updatePassword } from '@/features/auth/actions';
import FormAlert from '@/features/auth/components/form-alert';
import PasswordInput from '@/features/auth/components/password-input';
import PasswordRules from '@/features/auth/components/password-rules';
import {
  AUTH_INPUT,
  AUTH_LINK_PRIMARY,
  AUTH_SUBMIT,
  AUTH_TEXT_LINK,
} from '@/features/auth/styles';
import {
  ResetPasswordSchema,
  type ResetPasswordValues,
} from '@/lib/validation/auth.schema';

// True when the page already knows the link is dead, so the person never
// types a new password only to be told afterwards.
type Props = {
  expired?: boolean;
};

function LinkExpired() {
  return (
    <div className="flex w-full flex-col">
      <h1 className="font-serif text-4xl leading-tight font-medium tracking-tight wrap-break-word text-foreground sm:text-5xl">
        This link has expired.
      </h1>

      <p className="mt-3 text-base leading-relaxed text-muted-foreground">
        A reset link works once, for one hour. Ask for a new one and open the
        newest email we send.
      </p>

      <div className="mt-8 flex flex-col items-center gap-3">
        <Link href="/forgot-password" className={AUTH_LINK_PRIMARY}>
          Send a new link
        </Link>
        <Link href="/login" className={`py-2 text-[15px] ${AUTH_TEXT_LINK}`}>
          Back to log in
        </Link>
      </div>
    </div>
  );
}

export default function ResetPasswordForm({ expired = false }: Props) {
  const [isExpired, setIsExpired] = useState(expired);
  const [formError, setFormError] = useState<string | null>(null);

  const form = useForm<ResetPasswordValues>({
    resolver: zodResolver(ResetPasswordSchema),
    defaultValues: { password: '', confirm: '' },
  });

  const { isSubmitting } = form.formState;
  const password = useWatch({ control: form.control, name: 'password' });

  async function onSubmit(data: ResetPasswordValues) {
    setFormError(null);

    const result = await updatePassword(data);
    if (!result?.error) return;

    if (result.expired) {
      setIsExpired(true);
      return;
    }

    if (result.field === 'password') {
      form.setError(
        'password',
        { type: 'server', message: result.error },
        { shouldFocus: true },
      );
      return;
    }

    setFormError(result.error);
  }

  if (isExpired) return <LinkExpired />;

  return (
    <div className="flex w-full flex-col">
      <h1 className="font-serif text-4xl leading-tight font-medium tracking-tight wrap-break-word text-foreground sm:text-5xl">
        Choose a new password.
      </h1>
      <p className="mt-3 text-base text-muted-foreground">
        You will be logged in once it is saved.
      </p>

      <form
        onSubmit={form.handleSubmit(onSubmit)}
        noValidate
        className="mt-8"
        aria-busy={isSubmitting}
      >
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
                  autoComplete="new-password"
                  enterKeyHint="next"
                  className={AUTH_INPUT}
                  aria-invalid={fieldState.invalid}
                  aria-describedby={
                    fieldState.invalid
                      ? 'reset-password-error reset-password-rules'
                      : 'reset-password-rules'
                  }
                />
                <PasswordRules
                  id="reset-password-rules"
                  value={password ?? ''}
                />
                <FieldError
                  id="reset-password-error"
                  errors={[fieldState.error]}
                />
              </Field>
            )}
          />

          <Controller
            name="confirm"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="reset-confirm">Type it again</FieldLabel>
                <PasswordInput
                  {...field}
                  id="reset-confirm"
                  autoComplete="new-password"
                  enterKeyHint="done"
                  className={AUTH_INPUT}
                  aria-invalid={fieldState.invalid}
                  aria-describedby={
                    fieldState.invalid ? 'reset-confirm-error' : undefined
                  }
                />
                <FieldError
                  id="reset-confirm-error"
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
            {isSubmitting ? 'Saving' : 'Save password'}
          </Button>
        </FieldGroup>
      </form>
    </div>
  );
}
