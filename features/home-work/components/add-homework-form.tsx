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
import { toast } from '@/components/ui/toast';
import {
  HomeworkSchema,
  type HomeworkValues,
} from '@/lib/validation/homework.schema';

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function AddHomeworkForm({
  onSuccess,
}: {
  onSuccess?: () => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  const form = useForm<HomeworkValues>({
    resolver: zodResolver(HomeworkSchema),
    defaultValues: { title: '' },
  });

  const { isSubmitting } = form.formState;

  async function onSubmit(data: HomeworkValues) {
    console.log(data);
    toast.add({ title: 'Homework posted' });
    form.reset();
    onSuccess?.();
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} noValidate>
      <FieldGroup>
        <Controller
          name="title"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="homework-title">Title</FieldLabel>
              <Input
                {...field}
                id="homework-title"
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
                <div className="flex items-center gap-3 rounded-md border bg-muted/40 px-3 py-2.5">
                  <FileText
                    className="size-4 shrink-0 text-muted-foreground"
                    aria-hidden
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm text-foreground">
                      {value.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatSize(value.size)}
                    </p>
                  </div>
                  <button
                    type="button"
                    aria-label="Remove file"
                    className="rounded-md p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                    onClick={() => {
                      onChange(undefined);
                      if (inputRef.current) inputRef.current.value = '';
                    }}
                  >
                    <X className="size-4" aria-hidden />
                  </button>
                </div>
              ) : (
                <Button
                  type="button"
                  variant="outline"
                  className="h-11 w-full justify-start font-normal text-muted-foreground"
                  onClick={() => inputRef.current?.click()}
                >
                  <Upload className="size-4" aria-hidden />
                  Choose a file
                </Button>
              )}

              <FieldDescription>
                PDF, Word or image. Up to 10MB.
              </FieldDescription>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting && (
            <Loader2 className="size-4 animate-spin" aria-hidden />
          )}
          {isSubmitting ? 'Posting homework' : 'Post homework'}
        </Button>
      </FieldGroup>
    </form>
  );
}
