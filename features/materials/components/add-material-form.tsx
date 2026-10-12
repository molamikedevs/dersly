'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Check, Loader2 } from 'lucide-react';
import { useState } from 'react';
import {
  Controller,
  useForm,
  useWatch,
  type FieldErrors,
} from 'react-hook-form';

import { Button } from '@/components/ui/button';
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/toast';
import FormAlert from '@/features/auth/components/form-alert';
import MarkdownEditor, {
  type MarkdownView,
} from '@/features/homework/components/markdown-editor';
import { cn } from '@/lib/utils';
import {
  MATERIAL_GUIDE_MAX,
  MaterialSchema,
  youTubeVideoId,
  type MaterialValues,
} from '@/lib/validation/materials.schema';
import { MaterialRecord } from '@/types/materials';
import { createMaterialAction, updateMaterialAction } from '../actions';

// 16px on every screen, so an iPhone does not zoom in on tap
const TEXT_INPUT = 'h-12 rounded-xl text-base md:text-base';

type Kind = MaterialValues['kind'];
type Level = NonNullable<MaterialValues['level']>;

// Each type says what the student actually gets, so the choice is clear
const KINDS: { value: Kind; label: string; explains: string }[] = [
  {
    value: 'guide',
    label: 'Guide',
    explains: 'A page you write here, with headings, tables and pictures.',
  },
  {
    value: 'link',
    label: 'Video',
    explains: 'A YouTube video. It plays inside Dersly.',
  },
  {
    value: 'article',
    label: 'Reading',
    explains: 'A page on another website. It opens in a new tab.',
  },
];

const LEVELS: { value: Level | ''; label: string }[] = [
  { value: '', label: 'All levels' },
  { value: 'beginner', label: 'Beginner' },
  { value: 'elementary', label: 'Elementary' },
  { value: 'intermediate', label: 'Intermediate' },
  { value: 'advanced', label: 'Advanced' },
];

const TITLE_PLACEHOLDER: Record<Kind, string> = {
  guide: 'Irregular verbs',
  link: 'How to use the present perfect',
  article: 'Common English idioms',
};

export default function AddMaterialForm({
  onSuccess,
  material,
}: {
  onSuccess?: () => void;
  material?: MaterialRecord;
}) {
  const [view, setView] = useState<MarkdownView>('write');
  const [formError, setFormError] = useState<string | null>(null);
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
  const url = useWatch({ control: form.control, name: 'url' }) ?? '';
  const { isSubmitting } = form.formState;

  const chosen = KINDS.find((option) => option.value === kind) ?? KINDS[0];
  const videoFound = kind === 'link' && youTubeVideoId(url) !== null;

  function onInvalid(errors: FieldErrors<MaterialValues>) {
    if (errors.content) setView('write');
  }

  async function onSubmit(data: MaterialValues) {
    setFormError(null);

    const result = isEdit
      ? await updateMaterialAction(material!.id, data)
      : await createMaterialAction(data);

    // Nothing is cleared on failure, so nothing typed is lost
    if (!result.success) {
      setFormError(
        isEdit
          ? 'Could not save your changes. Everything you wrote is still here, so try again.'
          : 'Could not add this material. Everything you wrote is still here, so try again.',
      );
      return;
    }

    toast.add(
      isEdit
        ? {
            title: 'Changes saved',
            description: 'Students see the updated version now.',
          }
        : {
            title: 'Added to materials',
            description: 'Students can find it in Materials now.',
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
          name="kind"
          control={form.control}
          render={({ field }) => (
            <FieldSet className="gap-2">
              <FieldLegend variant="label">Type</FieldLegend>

              {/* Real radio buttons, styled as one control: arrow keys and
                  screen readers work without extra code */}
              <div className="grid grid-cols-3 gap-1 rounded-xl bg-muted p-1">
                {KINDS.map((option) => (
                  <label
                    key={option.value}
                    className={cn(
                      'flex h-10 cursor-pointer touch-manipulation items-center justify-center rounded-lg px-2 text-[15px] font-medium text-muted-foreground transition-[color,background-color,box-shadow] duration-150 select-none hover:text-foreground',
                      'has-checked:bg-card has-checked:font-semibold has-checked:text-foreground has-checked:shadow-sm',
                      'has-focus-visible:ring-2 has-focus-visible:ring-ring',
                    )}
                  >
                    <input
                      type="radio"
                      name={field.name}
                      value={option.value}
                      checked={field.value === option.value}
                      onChange={() => {
                        field.onChange(option.value);
                        form.clearErrors();
                        setFormError(null);
                      }}
                      className="sr-only"
                    />
                    {option.label}
                  </label>
                ))}
              </div>

              <FieldDescription>{chosen.explains}</FieldDescription>
            </FieldSet>
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
                className={TEXT_INPUT}
                autoComplete="off"
                autoCapitalize="sentences"
                enterKeyHint="next"
                placeholder={TITLE_PLACEHOLDER[kind]}
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
              <MarkdownEditor
                id="material-content"
                value={field.value ?? ''}
                onChange={field.onChange}
                onBlur={field.onBlur}
                inputRef={field.ref}
                view={view}
                onViewChange={setView}
                maxLength={MATERIAL_GUIDE_MAX}
                placeholder={
                  '## Irregular verbs\n\n| Base | Past | Past participle |\n| --- | --- | --- |\n| go | went | gone |'
                }
                invalid={fieldState.invalid}
                error={fieldState.error}
              />
            )}
          />
        ) : (
          <Controller
            name="url"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="material-url">
                  {kind === 'link' ? 'YouTube link' : 'Link'}
                </FieldLabel>
                <Input
                  {...field}
                  value={field.value ?? ''}
                  id="material-url"
                  type="url"
                  inputMode="url"
                  className={TEXT_INPUT}
                  autoComplete="off"
                  autoCapitalize="none"
                  autoCorrect="off"
                  spellCheck={false}
                  enterKeyHint="next"
                  placeholder={
                    kind === 'link'
                      ? 'https://youtu.be/...'
                      : 'https://example.com/article'
                  }
                  aria-invalid={fieldState.invalid}
                  aria-describedby="material-url-hint"
                />
                {/* Says so as soon as the link is one the player can use */}
                <p
                  id="material-url-hint"
                  aria-live="polite"
                  className={cn(
                    'flex items-center gap-1.5 text-sm',
                    videoFound ? 'text-foreground' : 'text-muted-foreground',
                  )}
                >
                  {videoFound && (
                    <Check className="size-4 text-primary" aria-hidden />
                  )}
                  {kind === 'link'
                    ? videoFound
                      ? 'Video found.'
                      : 'Copy it from the Share button on YouTube.'
                    : 'Copy it from the address bar.'}
                </p>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        )}

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
                value={field.value ?? ''}
                id="material-description"
                className={TEXT_INPUT}
                autoComplete="off"
                autoCapitalize="sentences"
                enterKeyHint="done"
                placeholder="What is this for?"
                aria-invalid={fieldState.invalid}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="level"
          control={form.control}
          render={({ field }) => (
            <FieldSet className="gap-2">
              <FieldLegend variant="label">
                Level{' '}
                <span className="font-normal text-muted-foreground">
                  optional
                </span>
              </FieldLegend>

              <div className="flex flex-wrap gap-2">
                {LEVELS.map((option) => (
                  <label
                    key={option.label}
                    className={cn(
                      'flex h-10 cursor-pointer touch-manipulation items-center rounded-full border border-border px-4 text-[15px] font-medium text-foreground transition-[color,background-color,border-color,scale] duration-150 select-none hover:border-input-border active:scale-[0.97]',
                      'has-checked:border-primary has-checked:bg-primary has-checked:text-primary-foreground',
                      'has-focus-visible:ring-2 has-focus-visible:ring-ring has-focus-visible:ring-offset-2 has-focus-visible:ring-offset-background',
                    )}
                  >
                    <input
                      type="radio"
                      name={field.name}
                      value={option.value}
                      checked={(field.value ?? '') === option.value}
                      onChange={() => field.onChange(option.value || undefined)}
                      className="sr-only"
                    />
                    {option.label}
                  </label>
                ))}
              </div>
            </FieldSet>
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
                : 'Adding'
              : isEdit
                ? 'Save changes'
                : 'Add to materials'}
          </Button>
        </div>
      </FieldGroup>
    </form>
  );
}
