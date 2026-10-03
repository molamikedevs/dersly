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
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/components/ui/toast';
import { createHomework, updateHomework } from '@/features/homework/actions';
import MarkdownEditor, {
  type MarkdownView,
} from '@/features/homework/components/markdown-editor';
import {
  HomeworkSchema,
  type HomeworkValues,
} from '@/lib/validation/homework.schema';

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
  const isEdit = Boolean(homework);

  const form = useForm<HomeworkValues>({
    resolver: zodResolver(HomeworkSchema),
    defaultValues: {
      classId,
      title: homework?.title ?? '',
      instructions: homework?.instructions ?? '',
      content: homework?.content ?? '',
      existingPath: homework?.attachmentPath ?? undefined,
    },
  });

  const { isSubmitting } = form.formState;

  async function onSubmit(data: HomeworkValues) {
    const result = isEdit
      ? await updateHomework(homework!.id, data)
      : await createHomework(data);

    if (!result.success) {
      toast.add({
        title: isEdit ? 'Could not update homework' : 'Could not post homework',
        description: result.error?.message,
      });
      return;
    }

    toast.add({ title: isEdit ? 'Homework updated' : 'Homework posted' });
    form.reset();
    setView('write');
    onSuccess?.();
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} noValidate>
      <FieldGroup className="gap-5">
        <Controller
          name="title"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="homework-title">Title</FieldLabel>
              <Input
                {...field}
                id="homework-title"
                className="h-11 rounded-xl text-[15px]"
                autoComplete="off"
                placeholder="People I Know"
                aria-invalid={fieldState.invalid}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="instructions"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="homework-instructions">
                Instructions{' '}
                <span className="font-normal text-muted-foreground">
                  optional
                </span>
              </FieldLabel>
              <Textarea
                {...field}
                id="homework-instructions"
                rows={2}
                className="text-[15px]"
                placeholder="What should students do before the next lesson?"
                aria-invalid={fieldState.invalid}
              />
              <FieldDescription>Shown on the homework card.</FieldDescription>
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
              view={view}
              onViewChange={setView}
              placeholder={
                '## Key vocabulary\n\n| Word | Meaning |\n| --- | --- |\n| tall | higher than most people |'
              }
              invalid={fieldState.invalid}
              error={fieldState.error}
            />
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
          {isSubmitting
            ? isEdit
              ? 'Saving'
              : 'Posting'
            : isEdit
              ? 'Save changes'
              : 'Post homework'}
        </Button>
      </FieldGroup>
    </form>
  );
}
