'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { FileText, Link2, Loader2, Upload, X } from 'lucide-react';
import { useRef } from 'react';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { createMaterialAction, updateMaterialAction } from '../actions';

import { Button } from '@/components/ui/button';
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/components/ui/toast';
import { cn, formatSize } from '@/lib/utils';
import {
  MaterialSchema,
  type MaterialValues,
} from '@/lib/validation/materials.schema';
import { MaterialRecord } from '@/types/materials';

const KINDS = [
  { value: 'file' as const, label: 'Document', icon: FileText },
  { value: 'link' as const, label: 'Link', icon: Link2 },
];

export default function AddMaterialForm({
  onSuccess,
  material,
}: {
  onSuccess?: () => void;
  material?: MaterialRecord;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const isEdit = Boolean(material);
  const form = useForm<MaterialValues>({
    resolver: zodResolver(MaterialSchema),
    defaultValues: {
      kind: material?.kind ?? 'file',
      title: material?.title ?? '',
      description: material?.description ?? '',
      url: material?.url ?? '',
      level: material?.level ?? undefined,
      existingPath: material?.filePath ?? undefined,
    },
  });

  const kind = useWatch({ control: form.control, name: 'kind' });
  const { isSubmitting } = form.formState;

  async function onSubmit(data: MaterialValues) {
    const result = isEdit
      ? await updateMaterialAction(material!.id, data)
      : await createMaterialAction(data);

    if (!result.success) {
      toast.add({
        title: 'Could not add material',
        description: result.error?.message,
      });
      return;
    }

    toast.add({ title: 'Material added successfully' });
    form.reset();
    onSuccess?.();
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} noValidate>
      <FieldGroup className="gap-4">
        <Controller
          name="kind"
          control={form.control}
          render={({ field }) => (
            <div
              role="radiogroup"
              aria-label="Type"
              className="grid grid-cols-2 gap-1 rounded-md bg-muted p-1"
            >
              {KINDS.map(({ value, label, icon: Icon }) => {
                const selected = field.value === value;
                return (
                  <button
                    key={value}
                    type="button"
                    role="radio"
                    aria-checked={selected}
                    onClick={() => field.onChange(value)}
                    className={cn(
                      'flex h-9 items-center justify-center gap-2 rounded-sm text-sm transition-colors',
                      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                      selected
                        ? 'bg-background font-medium text-foreground shadow-sm'
                        : 'font-normal text-muted-foreground hover:text-foreground',
                    )}
                  >
                    <Icon className="size-4" aria-hidden />
                    {label}
                  </button>
                );
              })}
            </div>
          )}
        />

        <Controller
          name="title"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="material-title">Title</FieldLabel>
              <Input
                {...field}
                id="material-title"
                className="h-11"
                autoComplete="off"
                placeholder="Irregular verbs reference sheet"
                aria-invalid={fieldState.invalid}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        {kind === 'link' ? (
          <Controller
            name="url"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="material-url">Link</FieldLabel>
                <Input
                  {...field}
                  id="material-url"
                  type="url"
                  inputMode="url"
                  className="h-11"
                  autoComplete="off"
                  placeholder="https://youtube.com/watch?v=..."
                  aria-invalid={fieldState.invalid}
                  aria-describedby="material-url-hint"
                />
                <FieldDescription id="material-url-hint">
                  YouTube links play inline for students.
                </FieldDescription>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        ) : (
          <Controller
            name="file"
            control={form.control}
            render={({ field: { onChange, value }, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="material-file">Document</FieldLabel>

                <input
                  ref={inputRef}
                  id="material-file"
                  type="file"
                  className="sr-only"
                  accept=".pdf,.doc,.docx,.mp3,.jpg,.jpeg,.png"
                  onChange={(event) => onChange(event.target.files?.[0])}
                />

                {value instanceof File ? (
                  <div className="flex items-center gap-3 rounded-md bg-muted p-2">
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
                      className="flex size-11 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-background hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      onClick={() => {
                        onChange(undefined);
                        if (inputRef.current) inputRef.current.value = '';
                      }}
                    >
                      <X className="size-4" aria-hidden />
                    </button>
                  </div>
                ) : material?.filePath ? (
                  <div className="flex items-center gap-3 rounded-md bg-muted p-2">
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
                    className="flex h-14 w-full items-center justify-center gap-2.5 rounded-md bg-muted text-sm transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <Upload
                      className="size-4 text-muted-foreground"
                      aria-hidden
                    />
                    <span className="font-medium text-foreground">
                      Choose a file
                    </span>
                    <span className="text-muted-foreground">up to 20MB</span>
                  </button>
                )}

                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        )}

        <Controller
          name="level"
          control={form.control}
          render={({ field }) => (
            <Field>
              <FieldLabel htmlFor="material-level">
                Level{' '}
                <span className="font-normal text-muted-foreground">
                  optional
                </span>
              </FieldLabel>
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger id="material-level" className="h-11 w-full">
                  <SelectValue placeholder="All levels" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="beginner">Beginner</SelectItem>
                  <SelectItem value="elementary">Elementary</SelectItem>
                  <SelectItem value="intermediate">Intermediate</SelectItem>
                  <SelectItem value="advanced">Advanced</SelectItem>
                </SelectContent>
              </Select>
            </Field>
          )}
        />

        <Controller
          name="description"
          control={form.control}
          render={({ field }) => (
            <Field>
              <FieldLabel htmlFor="material-description">
                Description{' '}
                <span className="font-normal text-muted-foreground">
                  optional
                </span>
              </FieldLabel>
              <Textarea
                {...field}
                id="material-description"
                rows={2}
                placeholder="What is this for?"
              />
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
              : 'Adding'
            : isEdit
              ? 'Save changes'
              : 'Add material'}
        </Button>
      </FieldGroup>
    </form>
  );
}
