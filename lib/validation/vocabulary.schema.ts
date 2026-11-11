import * as z from 'zod';

// Same limits as the words table
export const WORD_MAX = 60;
export const MEANING_MAX = 200;
export const EXAMPLE_MAX = 300;

// One line, one space between words, the same letters however they were typed
function singleLine(value: string) {
  return value.normalize('NFC').replace(/\s+/g, ' ').trim();
}

function text(required: string, max: number) {
  return z
    .string()
    .transform(singleLine)
    .pipe(
      z
        .string()
        .min(1, { message: required })
        .max(max, { message: `Keep it under ${max} characters.` }),
    );
}

export const WordSchema = z.object({
  enrollmentId: z.uuid(),
  // Words can be set ahead, for the week after this one
  week: z.enum(['this', 'next']),
  word: text('Write the word.', WORD_MAX),
  meaning: text('Write what it means.', MEANING_MAX),
  example: z
    .string()
    .transform(singleLine)
    .pipe(
      z.string().max(EXAMPLE_MAX, {
        message: `Keep the example under ${EXAMPLE_MAX} characters.`,
      }),
    )
    .optional(),
});

export const WordAnswerSchema = z.object({
  wordId: z.uuid(),
  answer: text('Write the word first.', WORD_MAX),
});

export type WordValues = z.infer<typeof WordSchema>;
export type WordAnswerValues = z.infer<typeof WordAnswerSchema>;
