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
    <Card className="border-0 bg-transparent shadow-none sm:border sm:bg-card sm:shadow-sm">
      <CardHeader className="px-4 sm:px-6">
        <CardTitle className="text-xl sm:text-2xl">
          Create your account
        </CardTitle>
        <CardDescription>
          Use the class code your teacher gave you.
        </CardDescription>
      </CardHeader>

      <CardContent className="px-4 sm:px-6">
        <form onSubmit={form.handleSubmit(onSubmit)} noValidate>
          <FieldGroup>
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

            <Controller
              name="code"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="register-code">Class code</FieldLabel>
                  <Input
                    {...field}
                    // Normalise on the way in so the value matches what is
                    // displayed. `uppercase` is presentation only and was
                    // submitting whatever case the student typed.
                    onChange={(e) =>
                      field.onChange(e.target.value.toUpperCase())
                    }
                    id="register-code"
                    autoComplete="off"
                    autoCapitalize="characters"
                    autoCorrect="off"
                    spellCheck={false}
                    placeholder="ABC123"
                    aria-invalid={fieldState.invalid}
                    // invite-code utility: mono, uppercase, wide tracking,
                    // tabular figures and slashed zero from the theme.
                    className="invite-code"
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
              {isSubmitting ? 'Creating account' : 'Create account'}
            </Button>

            <p className="text-center text-sm text-muted-foreground">
              Already have an account?{' '}
              <Link
                href="/login"
                className="font-medium text-primary underline-offset-4 hover:underline"
              >
                Log in
              </Link>
            </p>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
}
