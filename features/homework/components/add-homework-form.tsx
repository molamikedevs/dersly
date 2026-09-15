'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { FileText, Loader2, Upload, X } from 'lucide-react';
import { useRef } from 'react';
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
import { formatSize } from '@/lib/utils';
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
  const inputRef = useRef<HTMLInputElement>(null);
  const isEdit = Boolean(homework);

  const form = useForm<HomeworkValues>({
    resolver: zodResolver(HomeworkSchema),
    defaultValues: {
      classId,
      title: homework?.title ?? '',
      instructions: homework?.instructions ?? '',
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
    onSuccess?.();
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} noValidate>
      <FieldGroup className="gap-4">
        <Controller
          name="title"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="homework-title">Title</FieldLabel>
              <Input
                {...field}
                id="homework-title"
                className="h-11"
                autoComplete="off"
                placeholder="Past simple worksheet"
                aria-invalid={fieldState.invalid}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="file"
          control={form.control}
          render={({ field: { onChange, value }, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="homework-file">Document</FieldLabel>

              <input
                ref={inputRef}
                id="homework-file"
                type="file"
                className="sr-only"
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                onChange={(event) => onChange(event.target.files?.[0])}
              />

              {value instanceof File ? (
                <div className="flex items-center gap-3 rounded-md bg-muted p-3">
                  <span
                    aria-hidden
                    className="flex size-9 shrink-0 items-center justify-center rounded-md bg-background"
                  >
                    <FileText className="size-4 text-muted-foreground" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-foreground">
                      {value.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatSize(value.size)}
                    </p>
                  </div>
                  <button
                    type="button"
                    aria-label="Remove file"
                    className="-mr-1 flex size-11 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    onClick={() => {
                      onChange(undefined);
                      if (inputRef.current) inputRef.current.value = '';
                    }}
                  >
                    <X className="size-4" aria-hidden />
                  </button>
                </div>
              ) : homework?.attachmentPath ? (
                <div className="flex items-center gap-3 rounded-md bg-muted p-3">
                  <span
                    aria-hidden
                    className="flex size-9 shrink-0 items-center justify-center rounded-md bg-background"
                  >
                    <FileText className="size-4 text-muted-foreground" />
                  </span>
                  <p className="min-w-0 flex-1 truncate text-sm text-muted-foreground">
                    Current file attached
                  </p>
                  <button
                    type="button"
                    onClick={() => inputRef.current?.click()}
                    className="shrink-0 rounded-md px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    Replace
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => inputRef.current?.click()}
                  className="flex w-full flex-col items-center justify-center rounded-md bg-muted px-4 py-7 text-center transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <Upload
                    className="size-5 text-muted-foreground"
                    aria-hidden
                  />
                  <span className="mt-2 text-sm font-medium text-foreground">
                    Choose a file
                  </span>
                </button>
              )}

              <FieldDescription>
                PDF, Word or image. Up to 10MB.
              </FieldDescription>
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
                rows={3}
                placeholder="What should students do before the next lesson?"
                aria-invalid={fieldState.invalid}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Button type="submit" className="h-11 w-full" disabled={isSubmitting}>
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
