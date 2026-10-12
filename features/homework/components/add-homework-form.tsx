'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { useState } from 'react';
import { Controller, useForm, type FieldErrors } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/toast';
import FormAlert from '@/features/auth/components/form-alert';
import { createHomework, updateHomework } from '@/features/homework/actions';
import MarkdownEditor, {
  type MarkdownView,
} from '@/features/homework/components/markdown-editor';
import {
  GUIDE_MAX,
  HomeworkSchema,
  type HomeworkValues,
} from '@/lib/validation/homework.schema';

// 16px on every screen, so an iPhone does not zoom in on tap
const TEXT_INPUT = 'h-12 rounded-xl text-base md:text-base';

export default function AddHomeworkForm({
  classId,
  homework,
  onSuccess,
}: {
  classId: string;
  homework?: HomeWorkRecord;
  onSuccess?: () => void;
}) {
  const [view, setView] = useState<MarkdownView>('write');
  const [formError, setFormError] = useState<string | null>(null);
  const isEdit = Boolean(homework);

  const form = useForm<HomeworkValues>({
    resolver: zodResolver(HomeworkSchema),
    defaultValues: {
      classId,
      title: homework?.title ?? '',
      content: homework?.content ?? '',
      existingPath: homework?.attachmentPath ?? undefined,
    },
  });

  const { isSubmitting } = form.formState;

  // A problem with the guide while Preview is open: go back to Write so the
  // form can put the cursor in it
  function onInvalid(errors: FieldErrors<HomeworkValues>) {
    if (errors.content) setView('write');
  }

  async function onSubmit(data: HomeworkValues) {
    setFormError(null);

    const result = isEdit
      ? await updateHomework(homework!.id, data)
      : await createHomework(data);

    // Nothing is cleared on failure, so the guide is never lost
    if (!result.success) {
      setFormError(
        isEdit
          ? 'Could not save your changes. Everything you wrote is still here, so try again.'
          : 'Could not post the homework. Everything you wrote is still here, so try again.',
      );
      return;
    }

    toast.add(
      isEdit
        ? {
            title: 'Changes saved',
            description: 'Students see the updated homework now.',
          }
        : {
            title: 'Homework posted',
            description: 'Students in this class can see it now.',
          },
    );
    form.reset();
    setView('write');
    onSuccess?.();
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit, onInvalid)} noValidate>
      <FieldGroup className="gap-6">
        <Controller
          name="title"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="homework-title">Title</FieldLabel>
              <Input
                {...field}
                id="homework-title"
                className={TEXT_INPUT}
                autoComplete="off"
                autoCapitalize="sentences"
                enterKeyHint="next"
                placeholder="People I know"
                aria-invalid={fieldState.invalid}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="content"
          control={form.control}
          render={({ field, fieldState }) => (
            <MarkdownEditor
              id="homework-content"
              value={field.value ?? ''}
              onChange={field.onChange}
              onBlur={field.onBlur}
              inputRef={field.ref}
              view={view}
              onViewChange={setView}
              maxLength={GUIDE_MAX}
              placeholder={
                '## Key vocabulary\n\n| Word | Meaning |\n| --- | --- |\n| tall | higher than most people |'
              }
              invalid={fieldState.invalid}
              error={fieldState.error}
            />
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
            {isSubmitting
              ? isEdit
                ? 'Saving'
                : 'Posting'
              : isEdit
                ? 'Save changes'
                : 'Post homework'}
          </Button>
        </div>
      </FieldGroup>
    </form>
  );
}
