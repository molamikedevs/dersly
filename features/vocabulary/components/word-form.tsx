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
import { useDerslyActions } from '@/features/app/actions-context';
import FormAlert from '@/features/auth/components/form-alert';
import {
  EXAMPLE_MAX,
  MEANING_MAX,
  WORD_MAX,
  WordSchema,
  type WordValues,
} from '@/lib/validation/vocabulary.schema';

// 16px on every screen, so an iPhone does not zoom in on tap
const TEXT_INPUT = 'h-12 rounded-xl text-base md:text-base';
const TEXT_AREA = 'min-h-12 rounded-xl px-3.5 py-3 text-base md:text-base';

// A new word goes into this week. An edit keeps the week the word is in.
type Props = {
  enrollmentId: string;
  word?: WordRecord;
  onSuccess?: () => void;
};

export default function WordForm({ enrollmentId, word, onSuccess }: Props) {
  // The real actions in the app, local ones in the demo
  const { addWord, updateWord } = useDerslyActions();
  const [formError, setFormError] = useState<string | null>(null);
  const isEdit = Boolean(word);

  const form = useForm<WordValues>({
    resolver: zodResolver(WordSchema),
    defaultValues: {
      enrollmentId,
      word: word?.word ?? '',
      meaning: word?.meaning ?? '',
      example: word?.example ?? '',
    },
  });

  const { isSubmitting } = form.formState;

  async function onSubmit(data: WordValues) {
    setFormError(null);

    const result = isEdit
      ? await updateWord(word!.id, data)
      : await addWord(data);

    // Nothing is cleared on failure, so nothing typed is lost
    if (!result.success) {
      setFormError(
        result.status === 409
          ? result.error?.message === 'Word already exists.'
            ? 'This word is already set for this week.'
            : (result.error?.message ?? 'That week is full.')
          : isEdit
            ? 'Could not save your changes. Everything you wrote is still here, so try again.'
            : 'Could not add this word. Everything you wrote is still here, so try again.',
      );
      return;
    }

    toast.add(
      isEdit
        ? { title: 'Changes saved' }
        : {
            title: 'Word added',
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
          name="word"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="word-word">Word</FieldLabel>
              <Input
                {...field}
                id="word-word"
                maxLength={WORD_MAX}
                className={TEXT_INPUT}
                autoComplete="off"
                autoCapitalize="none"
                enterKeyHint="next"
                placeholder="borrow"
                aria-invalid={fieldState.invalid}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="meaning"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="word-meaning">Meaning</FieldLabel>
              <Textarea
                {...field}
                id="word-meaning"
                rows={1}
                maxLength={MEANING_MAX}
                className={TEXT_AREA}
                autoCapitalize="sentences"
                placeholder="To take something and give it back later."
                aria-invalid={fieldState.invalid}
              />
              <FieldDescription>
                The student sees this and types the word.
              </FieldDescription>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="example"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="word-example">
                Example sentence{' '}
                <span className="font-normal text-muted-foreground">
                  optional
                </span>
              </FieldLabel>
              <Textarea
                {...field}
                value={field.value ?? ''}
                id="word-example"
                rows={1}
                maxLength={EXAMPLE_MAX}
                className={TEXT_AREA}
                autoCapitalize="sentences"
                placeholder="Can I borrow your pen?"
                aria-invalid={fieldState.invalid}
              />
              <FieldDescription>
                In next week&apos;s check, the word is blanked out.
              </FieldDescription>
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
            {isSubmitting ? 'Saving' : isEdit ? 'Save changes' : 'Add word'}
          </Button>
        </div>
      </FieldGroup>
    </form>
  );
}
