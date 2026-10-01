'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
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
import { changePassword } from '@/features/auth/actions';
import {
  ChangePasswordSchema,
  ChangePasswordValues,
} from '@/lib/validation/profile.schema';

const FIELDS = [
  {
    name: 'currentPassword',
    label: 'Current password',
    autoComplete: 'current-password',
  },
  {
    name: 'newPassword',
    label: 'New password',
    autoComplete: 'new-password',
  },
  {
    name: 'confirmPassword',
    label: 'Confirm new password',
    autoComplete: 'new-password',
  },
] as const;

type FieldName = (typeof FIELDS)[number]['name'];

function isFieldName(value: string | undefined): value is FieldName {
  return FIELDS.some(({ name }) => name === value);
}

export default function ChangePasswordForm({
  onSuccess,
}: {
  onSuccess?: () => void;
}) {
  const form = useForm<ChangePasswordValues>({
    resolver: zodResolver(ChangePasswordSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  const { isSubmitting } = form.formState;

  async function onSubmit(data: ChangePasswordValues) {
    const result = await changePassword(data);

    if (result?.error) {
      // Field errors show inline, inside the dialog, where the user is looking
      if (isFieldName(result.field)) {
        form.setError(
          result.field,
          { message: result.error },
          { shouldFocus: true },
        );
        return;
      }

      form.setError('root', { message: result.error });
      return;
    }

    toast.add({ title: 'Password changed' });
    form.reset();
    onSuccess?.();
  }

  const rootError = form.formState.errors.root?.message;

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} noValidate>
      <FieldGroup className="gap-5">
        {FIELDS.map(({ name, label, autoComplete }) => (
          <Controller
            key={name}
            name={name}
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={name}>{label}</FieldLabel>
                <Input
                  {...field}
                  id={name}
                  type="password"
                  autoComplete={autoComplete}
                  className="h-11 rounded-xl text-[15px]"
                  aria-invalid={fieldState.invalid}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        ))}

        {rootError && (
          <p
            role="alert"
            className="rounded-xl bg-destructive/10 px-4 py-3 text-sm font-medium text-destructive"
          >
            {rootError}
          </p>
        )}

        <Button
          type="submit"
          className="mt-1 h-12 w-full rounded-xl text-[15px] font-semibold"
          disabled={isSubmitting}
        >
          {isSubmitting && (
            <Loader2 className="size-4 animate-spin" aria-hidden />
          )}
          {isSubmitting ? 'Saving' : 'Change password'}
        </Button>
      </FieldGroup>
    </form>
  );
}
