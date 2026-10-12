'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { Controller, useForm, useWatch } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { signUp } from '@/features/auth/actions';
import FormAlert from '@/features/auth/components/form-alert';
import PasswordInput from '@/features/auth/components/password-input';
import PasswordRules from '@/features/auth/components/password-rules';
import {
  AUTH_INPUT,
  AUTH_SUBMIT,
  AUTH_TEXT_LINK,
} from '@/features/auth/styles';
import { cn } from '@/lib/utils';
import {
  NAME_MAX,
  RegisterSchema,
  type RegisterValues,
} from '@/lib/validation/auth.schema';

const FIELDS = ['code', 'fullname', 'email', 'password'] as const;

function isField(value?: string): value is (typeof FIELDS)[number] {
  return FIELDS.includes(value as (typeof FIELDS)[number]);
}

export function RegisterForm() {
  const [formError, setFormError] = useState<string | null>(null);

  const form = useForm<RegisterValues>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: { fullname: '', email: '', password: '', code: '' },
  });

  const { isSubmitting } = form.formState;
  const password = useWatch({ control: form.control, name: 'password' });

  async function onSubmit(data: RegisterValues) {
    setFormError(null);

    const result = await signUp(data);
    if (!result?.error) return;

    // A wrong class code or a taken email belongs next to its field
    if (isField(result.field)) {
      form.setError(
        result.field,
        { type: 'server', message: result.error },
        { shouldFocus: true },
      );
      return;
    }

    setFormError(result.error);
  }

  return (
    <div className="flex w-full flex-col">
      <h1 className="font-serif text-4xl leading-tight font-medium tracking-tight wrap-break-word text-foreground sm:text-5xl">
        Create your account.
      </h1>
      <p className="mt-3 text-base text-muted-foreground">
        You need the class code from your teacher.
      </p>

      <form
        onSubmit={form.handleSubmit(onSubmit)}
        noValidate
        className="mt-8"
        aria-busy={isSubmitting}
      >
        <FieldGroup className="gap-5">
          <Controller
            name="code"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="register-code">Class code</FieldLabel>
                <Input
                  {...field}
                  onChange={(event) =>
                    field.onChange(event.target.value.toUpperCase())
                  }
                  id="register-code"
                  autoComplete="off"
                  autoCapitalize="characters"
                  autoCorrect="off"
                  spellCheck={false}
                  enterKeyHint="next"
                  maxLength={12}
                  placeholder="ABC234"
                  className={cn(AUTH_INPUT, 'bg-muted invite-code text-lg')}
                  aria-invalid={fieldState.invalid}
                  aria-describedby={
                    fieldState.invalid ? 'register-code-error' : undefined
                  }
                />
                <FieldError
                  id="register-code-error"
                  errors={[fieldState.error]}
                />
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
                  autoComplete="name"
                  autoCapitalize="words"
                  enterKeyHint="next"
                  maxLength={NAME_MAX + 10}
                  placeholder="Aysel Məmmədova"
                  className={AUTH_INPUT}
                  aria-invalid={fieldState.invalid}
                  aria-describedby={
                    fieldState.invalid
                      ? 'register-name-error register-name-hint'
                      : 'register-name-hint'
                  }
                />
                <FieldDescription id="register-name-hint">
                  Your teacher sees this name.
                </FieldDescription>
                <FieldError
                  id="register-name-error"
                  errors={[fieldState.error]}
                />
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
                  autoComplete="email"
                  autoCapitalize="none"
                  autoCorrect="off"
                  spellCheck={false}
                  enterKeyHint="next"
                  placeholder="you@example.com"
                  className={AUTH_INPUT}
                  aria-invalid={fieldState.invalid}
                  aria-describedby={
                    fieldState.invalid ? 'register-email-error' : undefined
                  }
                />
                <FieldError
                  id="register-email-error"
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
                <FieldLabel htmlFor="register-password">Password</FieldLabel>
                <PasswordInput
                  {...field}
                  id="register-password"
                  autoComplete="new-password"
                  enterKeyHint="done"
                  className={AUTH_INPUT}
                  aria-invalid={fieldState.invalid}
                  aria-describedby={
                    fieldState.invalid
                      ? 'register-password-error register-password-rules'
                      : 'register-password-rules'
                  }
                />
                <PasswordRules
                  id="register-password-rules"
                  value={password ?? ''}
                />
                <FieldError
                  id="register-password-error"
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
            {isSubmitting ? 'Creating account' : 'Create account'}
          </Button>
        </FieldGroup>
      </form>

      <p className="mt-10 border-t border-border pt-6 text-[15px] text-muted-foreground">
        Already have an account?{' '}
        <Link href="/login" className={AUTH_TEXT_LINK}>
          Log in
        </Link>
      </p>
    </div>
  );
}
