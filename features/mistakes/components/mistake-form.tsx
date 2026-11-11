'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
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
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/components/ui/toast';
import { useDerslyActions } from '@/features/app/actions-context';
import FormAlert from '@/features/auth/components/form-alert';
import {
  MISTAKE_MAX,
  MistakeSchema,
  type MistakeValues,
} from '@/lib/validation/mistake.schema';

// 16px on every screen, so an iPhone does not zoom in on tap
const TEXT_AREA = 'min-h-12 rounded-xl px-3.5 py-3 text-base md:text-base';

export default function MistakeForm({
  enrollmentId,
  mistake,
  onSuccess,
}: {
  enrollmentId: string;
  mistake?: MistakeRecord;
  onSuccess?: () => void;
}) {
  // The real actions in the app, local ones in the demo
  const { addMistake, updateMistake } = useDerslyActions();
  const [formError, setFormError] = useState<string | null>(null);
  const isEdit = Boolean(mistake);
  console.log('MistakeForm onSuccess:', typeof onSuccess);

  const form = useForm<MistakeValues>({
    resolver: zodResolver(MistakeSchema),
    defaultValues: {
      enrollmentId,
      wrong: mistake?.wrong ?? '',
      correct: mistake?.correct ?? '',
      tip: mistake?.tip ?? '',
    },
  });

  const { isSubmitting } = form.formState;

  async function onSubmit(data: MistakeValues) {
    setFormError(null);

    const result = isEdit
      ? await updateMistake(mistake!.id, data)
      : await addMistake(data);

    // Nothing is cleared on failure, so nothing typed is lost
    if (!result.success) {
      setFormError(
        isEdit
          ? 'Could not save your changes. Everything you wrote is still here, so try again.'
          : 'Could not add this mistake. Everything you wrote is still here, so try again.',
      );
      return;
    }

    toast.add(
      isEdit
        ? { title: 'Changes saved' }
        : {
            title: 'Mistake added',
            description: 'Your student sees it on their Home page now.',
          },
    );
    form.reset();
    onSuccess?.();
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} noValidate>
      <FieldGroup className="gap-6">
        <Controller
          name="wrong"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="mistake-wrong">What they said</FieldLabel>
              <Textarea
                {...field}
                id="mistake-wrong"
                rows={1}
                maxLength={MISTAKE_MAX}
                className={TEXT_AREA}
                autoCapitalize="sentences"
                placeholder="She don't like coffee."
                aria-invalid={fieldState.invalid}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="correct"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="mistake-correct">Correct version</FieldLabel>
              <Textarea
                {...field}
                id="mistake-correct"
                rows={1}
                maxLength={MISTAKE_MAX}
                className={TEXT_AREA}
                autoCapitalize="sentences"
                placeholder="She doesn't like coffee."
                aria-invalid={fieldState.invalid}
              />
              <FieldDescription>
                The student only sees this after they try to fix it.
              </FieldDescription>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="tip"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="mistake-tip">
                Rule to remember{' '}
                <span className="font-normal text-muted-foreground">
                  optional
                </span>
              </FieldLabel>
              <Textarea
                {...field}
                value={field.value ?? ''}
                id="mistake-tip"
                rows={1}
                maxLength={MISTAKE_MAX}
                className={TEXT_AREA}
                autoCapitalize="sentences"
                placeholder="He, she and it take doesn't."
                aria-invalid={fieldState.invalid}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <div className="flex flex-col gap-3">
          {formError && <FormAlert>{formError}</FormAlert>}

          <Button
            type="submit"
            className="h-12 w-full touch-manipulation rounded-xl text-base font-semibold select-none active:scale-[0.97]"
            disabled={isSubmitting}
          >
            {isSubmitting && (
              <Loader2 className="size-4 animate-spin" aria-hidden />
            )}
            {isSubmitting ? 'Saving' : isEdit ? 'Save changes' : 'Add mistake'}
          </Button>
        </div>
      </FieldGroup>
    </form>
  );
}
