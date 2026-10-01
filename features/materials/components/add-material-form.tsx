'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { BookOpen, Link2, Loader2, Play } from 'lucide-react';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/components/ui/toast';
import MarkdownContent from '@/features/homework/components/markdown-content';
import { cn } from '@/lib/utils';
import {
  MaterialSchema,
  type MaterialValues,
} from '@/lib/validation/materials.schema';
import { MaterialRecord } from '@/types/materials';
import { createMaterialAction, updateMaterialAction } from '../actions';

const KINDS = [
  { value: 'guide' as const, label: 'Guide', icon: BookOpen },
  { value: 'link' as const, label: 'Video', icon: Play },
  { value: 'article' as const, label: 'Reading', icon: Link2 },
];

const VIEWS = ['write', 'preview'] as const;

export default function AddMaterialForm({
  onSuccess,
  material,
}: {
  onSuccess?: () => void;
  material?: MaterialRecord;
}) {
  const [view, setView] = useState<(typeof VIEWS)[number]>('write');
  const isEdit = Boolean(material);

  const form = useForm<MaterialValues>({
    resolver: zodResolver(MaterialSchema),
    defaultValues: {
      kind: material?.kind ?? 'guide',
      title: material?.title ?? '',
      description: material?.description ?? '',
      url: material?.url ?? '',
      content: material?.content ?? '',
      level: material?.level ?? undefined,
    },
  });

  const kind = useWatch({ control: form.control, name: 'kind' });
  const content = useWatch({ control: form.control, name: 'content' });
  const { isSubmitting } = form.formState;

  async function onSubmit(data: MaterialValues) {
    const result = isEdit
      ? await updateMaterialAction(material!.id, data)
      : await createMaterialAction(data);

    if (!result.success) {
      toast.add({
        title: isEdit ? 'Could not update material' : 'Could not add material',
        description: result.error?.message,
      });
      return;
    }

    toast.add({ title: isEdit ? 'Material updated' : 'Material added' });
    form.reset();
    setView('write');
    onSuccess?.();
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} noValidate>
      <FieldGroup className="gap-5">
        <Controller
          name="kind"
          control={form.control}
          render={({ field }) => (
            <div
              role="radiogroup"
              aria-label="Type"
              className="grid grid-cols-3 gap-1 rounded-xl bg-muted p-1"
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
                      'flex h-10 items-center justify-center gap-2 rounded-lg text-sm transition-colors',
                      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                      selected
                        ? 'bg-card font-semibold text-foreground shadow-sm'
                        : 'font-medium text-muted-foreground hover:text-foreground',
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
                className="h-11 rounded-xl text-[15px]"
                autoComplete="off"
                placeholder={
                  kind === 'guide'
                    ? 'Irregular verbs reference'
                    : kind === 'link'
                      ? 'How to use the present perfect'
                      : 'A short story for beginners'
                }
                aria-invalid={fieldState.invalid}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        {kind === 'guide' ? (
          <Controller
            name="content"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <FieldLabel htmlFor="material-content">Guide</FieldLabel>

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
                    id="material-content"
                    className="h-[50svh] min-h-64 resize-y font-mono text-sm leading-relaxed"
                    placeholder={
                      '## Irregular verbs\n\n| Base | Past | Past participle |\n| --- | --- | --- |\n| go | went | gone |'
                    }
                    aria-invalid={fieldState.invalid}
                  />
                ) : (
                  <div className="h-[50svh] min-h-64 overflow-y-auto rounded-xl border border-border p-4 sm:p-6">
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
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        ) : (
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
                  className="h-11 rounded-xl text-[15px]"
                  autoComplete="off"
                  placeholder={
                    kind === 'link'
                      ? 'https://youtube.com/watch?v=...'
                      : 'https://example.com/article'
                  }
                  aria-invalid={fieldState.invalid}
                  aria-describedby="material-url-hint"
                />
                <FieldDescription id="material-url-hint">
                  {kind === 'link'
                    ? 'YouTube links play inline for students.'
                    : 'Opens in a new tab for students to read.'}
                </FieldDescription>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        )}

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-4">
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
                  <SelectTrigger
                    id="material-level"
                    className="h-11 w-full rounded-xl text-[15px]"
                  >
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
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="material-description">
                  Description{' '}
                  <span className="font-normal text-muted-foreground">
                    optional
                  </span>
                </FieldLabel>
                <Input
                  {...field}
                  id="material-description"
                  className="h-11 rounded-xl text-[15px]"
                  autoComplete="off"
                  placeholder="What is this for?"
                  aria-invalid={fieldState.invalid}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        </div>

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
              : 'Adding'
            : isEdit
              ? 'Save changes'
              : 'Add material'}
        </Button>
      </FieldGroup>
    </form>
  );
}
