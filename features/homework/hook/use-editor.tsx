'use client';

import { useRef, useState, type ChangeEvent } from 'react';

import { uploadLessonImage } from '@/features/homework/upload-lesson-image';
import { toAltText, toVocabularyTable } from '../lib/index';

interface Props {
  onChange: (value: string) => void;
}

export function useEditor({ onChange }: Props) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  function insert(snippet: string) {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const { selectionStart, selectionEnd, value: current } = textarea;
    const cursor = selectionStart + snippet.length;

    onChange(
      current.slice(0, selectionStart) + snippet + current.slice(selectionEnd),
    );

    requestAnimationFrame(() => {
      textarea.focus();
      textarea.setSelectionRange(cursor, cursor);
    });
  }

  async function handleFiles(event: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? []);
    event.target.value = '';
    if (files.length === 0) return;

    setUploadError(null);
    setIsUploading(true);

    try {
      const images = await Promise.all(
        files.map(async (file) => ({
          alt: toAltText(file.name),
          url: await uploadLessonImage(file),
        })),
      );

      insert(
        images.length === 1
          ? `![${images[0].alt}](${images[0].url})`
          : toVocabularyTable(images),
      );
    } catch (caught) {
      setUploadError(
        caught instanceof Error
          ? caught.message
          : 'Could not upload the picture.',
      );
    } finally {
      setIsUploading(false);
    }
  }

  return { fileInputRef, uploadError, isUploading, textareaRef, handleFiles };
}
