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
  value: string;
  onChange: (value: string) => void;
  onBlur: () => void;
  view: MarkdownView;
  onViewChange: (view: MarkdownView) => void;
  placeholder: string;
  invalid: boolean;
  error?: { message?: string };
};

export default function MarkdownEditor({
  id,
  value,
  onChange,
  onBlur,
  view,
  onViewChange,
  placeholder,
  invalid,
  error,
}: Props) {
  const { fileInputRef, uploadError, isUploading, textareaRef, handleFiles } =
    useEditor({ onChange });

  return (
    <Field data-invalid={invalid}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <FieldLabel htmlFor={id}>Guide</FieldLabel>

        <div className="flex flex-wrap items-center gap-2">
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
            className="h-11 gap-2 rounded-lg px-3 text-sm font-semibold"
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
            aria-label="Guide view"
            className="flex rounded-lg bg-muted p-1"
          >
            {MARKDOWN_VIEWS.map((option) => (
              <button
                key={option}
                type="button"
                aria-pressed={view === option}
                onClick={() => onViewChange(option)}
                className={cn(
                  'h-9 rounded-md px-3 text-sm font-semibold capitalize transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
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

      <Textarea
        ref={textareaRef}
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        onBlur={onBlur}
        readOnly={isUploading}
        className={cn(
          'h-[50svh] min-h-64 resize-y font-mono text-sm leading-relaxed',
          view === 'preview' && 'hidden',
        )}
        placeholder={placeholder}
        aria-invalid={invalid}
      />

      {view === 'preview' && (
        <div className="h-[50svh] min-h-64 overflow-y-auto rounded-xl border border-border p-4 sm:p-6">
          {value ? (
            <MarkdownContent content={value} />
          ) : (
            <p className="text-sm text-muted-foreground">
              Nothing to preview yet.
            </p>
          )}
        </div>
      )}

      {uploadError && (
        <p role="alert" className="text-sm font-medium text-destructive">
          {uploadError}
        </p>
      )}

      <FieldDescription>
        Markdown: ## for headings, **bold**, tables, and &gt; for tip boxes. Add
        image puts a picture where your cursor is. Pick several for a vocabulary
        table.
      </FieldDescription>
      {invalid && <FieldError errors={[error]} />}
    </Field>
  );
}
