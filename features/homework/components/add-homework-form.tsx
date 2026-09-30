'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { FileText, Loader2, Upload, X } from 'lucide-react';
import { useRef, useState } from 'react';
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
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/components/ui/toast';
import { createHomework, updateHomework } from '@/features/homework/actions';
import MarkdownContent from '@/features/homework/components/markdown-content';
import { cn, formatSize } from '@/lib/utils';
import {
  HomeworkSchema,
  type HomeworkValues,
} from '@/lib/validation/homework.schema';

const VIEWS = ['write', 'preview'] as const;

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
  const [view, setView] = useState<(typeof VIEWS)[number]>('write');
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

  const content = useWatch({ control: form.control, name: 'content' });
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
            <Field data-invalid={fieldState.invalid}>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <FieldLabel htmlFor="homework-content">
                  Guide{' '}
                  <span className="font-normal text-muted-foreground">
                    optional
                  </span>
                </FieldLabel>

                <div
                  role="group"
                  aria-label="Guide view"
                  className="flex rounded-lg bg-muted p-1"
                >
                  {VIEWS.map((value) => (
                    <button
                      key={value}
                      type="button"
                      aria-pressed={view === value}
                      onClick={() => setView(value)}
                      className={cn(
                        'h-9 rounded-md px-3 text-sm font-semibold capitalize transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                        view === value
                          ? 'bg-card text-foreground shadow-sm'
                          : 'text-muted-foreground hover:text-foreground',
                      )}
                    >
                      {value}
                    </button>
                  ))}
                </div>
              </div>

              {view === 'write' ? (
                <Textarea
                  {...field}
                  id="homework-content"
                  rows={12}
                  className="font-mono text-sm"
                  placeholder={
                    '## Key vocabulary\n\n| Word | Meaning |\n| --- | --- |\n| tall | higher than most people |'
                  }
                  aria-invalid={fieldState.invalid}
                />
              ) : (
                <div className="max-h-[50svh] overflow-y-auto rounded-xl border border-border p-4">
                  {content ? (
                    <MarkdownContent content={content} />
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      Nothing to preview yet.
                    </p>
                  )}
                </div>
              )}

              <FieldDescription>
                Markdown: ## for headings, **bold**, tables, and &gt; for tip
                boxes.
              </FieldDescription>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="file"
          control={form.control}
          render={({ field: { onChange, value }, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="homework-file">
                File{' '}
                <span className="font-normal text-muted-foreground">
                  optional
                </span>
              </FieldLabel>

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
                A printable version, if you have one. PDF, Word or image. Up to
                10MB.
              </FieldDescription>
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
