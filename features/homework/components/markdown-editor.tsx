'use client';

import { ImagePlus, Loader2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from '@/components/ui/field';
import { Textarea } from '@/components/ui/textarea';
import MarkdownContent from '@/features/homework/components/markdown-content';
import { LESSON_IMAGE_TYPES } from '@/features/homework/upload-lesson-image';
import { cn } from '@/lib/utils';
import { useEditor } from '../hook/use-editor';

export const MARKDOWN_VIEWS = ['write', 'preview'] as const;
export type MarkdownView = (typeof MARKDOWN_VIEWS)[number];

type Props = {
  id: string;
  label?: string;
  value: string;
  onChange: (value: string) => void;
  onBlur: () => void;
  // From the form, so a failed submit can move focus here
  inputRef?: (node: HTMLTextAreaElement | null) => void;
  view: MarkdownView;
  onViewChange: (view: MarkdownView) => void;
  placeholder: string;
  // The character limit, counted down once the guide gets close to it
  maxLength?: number;
  invalid: boolean;
  error?: { message?: string };
};

// The counter appears from this share of the limit, not before
const COUNT_FROM = 0.8;

export default function MarkdownEditor({
  id,
  label = 'Guide',
  value,
  onChange,
  onBlur,
  inputRef,
  view,
  onViewChange,
  placeholder,
  maxLength,
  invalid,
  error,
}: Props) {
  const { fileInputRef, uploadError, isUploading, bindTextarea, handleFiles } =
    useEditor({ onChange, inputRef });

  const hintId = `${id}-hint`;
  const nearLimit = maxLength ? value.length >= maxLength * COUNT_FROM : false;
  const overLimit = maxLength ? value.length > maxLength : false;

  return (
    <Field data-invalid={invalid}>
      <div className="flex flex-wrap items-end justify-between gap-x-3 gap-y-2">
        <FieldLabel htmlFor={id}>{label}</FieldLabel>

        <div className="flex max-w-full min-w-0 flex-wrap items-center gap-2">
          <input
            ref={fileInputRef}
            type="file"
            accept={LESSON_IMAGE_TYPES.join(',')}
            multiple
            hidden
            onChange={handleFiles}
          />
          <Button
            type="button"
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading || view === 'preview'}
            className="h-11 touch-manipulation gap-2 rounded-lg px-3 text-sm font-semibold active:scale-[0.97]"
          >
            {isUploading ? (
              <Loader2 className="size-4 animate-spin" aria-hidden />
            ) : (
              <ImagePlus className="size-4" aria-hidden />
            )}
            {isUploading ? 'Uploading' : 'Add image'}
          </Button>

          <div
            role="group"
            aria-label={`${label} view`}
            className="flex max-w-full min-w-0 rounded-lg bg-muted p-1"
          >
            {MARKDOWN_VIEWS.map((option) => (
              <button
                key={option}
                type="button"
                aria-pressed={view === option}
                onClick={() => onViewChange(option)}
                className={cn(
                  'h-9 min-w-0 touch-manipulation truncate rounded-md px-3 text-sm font-semibold capitalize transition-colors select-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none',
                  view === option
                    ? 'bg-card text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground',
                )}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Body-size text with roomy lines, so a long guide reads like the page
          students see, not like code. 16px also stops iPhones zooming in. */}
      <Textarea
        ref={bindTextarea}
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        onBlur={onBlur}
        readOnly={isUploading}
        autoCapitalize="sentences"
        className={cn(
          'h-[50svh] min-h-64 resize-y rounded-xl px-4 py-3 text-base leading-7 wrap-break-word md:text-base',
          view === 'preview' && 'hidden',
        )}
        placeholder={placeholder}
        aria-invalid={invalid}
        aria-describedby={hintId}
      />

      {view === 'preview' && (
        <div className="h-[50svh] min-h-64 overflow-y-auto overscroll-contain rounded-xl border border-border px-4 py-3 sm:px-6 sm:py-5">
          {value.trim() ? (
            <MarkdownContent content={value} />
          ) : (
            <p className="text-[15px] text-muted-foreground">
              Nothing to preview yet. Switch to Write and add some text.
            </p>
          )}
        </div>
      )}

      {uploadError && (
        <p role="alert" className="text-sm font-medium text-destructive">
          {uploadError}
        </p>
      )}

      <div className="flex items-start justify-between gap-4">
        <FieldDescription id={hintId} className="min-w-0">
          Use ## for a heading, **bold** for bold and &gt; for a tip box. Add
          image puts a picture where your cursor is. Pick several for a
          vocabulary table.
        </FieldDescription>

        {maxLength && nearLimit && (
          <p
            aria-live="polite"
            className={cn(
              'shrink-0 text-sm tabular-nums',
              overLimit
                ? 'font-semibold text-destructive'
                : 'text-muted-foreground',
            )}
          >
            {value.length.toLocaleString('en')} /{' '}
            {maxLength.toLocaleString('en')}
          </p>
        )}
      </div>

      {invalid && <FieldError errors={[error]} />}
    </Field>
  );
}
