import * as z from 'zod';

// Same limit as the mistakes table
export const MISTAKE_MAX = 300;

// One line, one space between words, the same letters however they were typed
function singleLine(value: string) {
  return value.normalize('NFC').replace(/\s+/g, ' ').trim();
}

function sentence(required: string) {
  return z
    .string()
    .transform(singleLine)
    .pipe(
      z
        .string()
        .min(1, { message: required })
        .max(MISTAKE_MAX, {
          message: `Keep it under ${MISTAKE_MAX} characters.`,
        }),
    );
}

export const MistakeSchema = z
  .object({
    enrollmentId: z.uuid(),
    wrong: sentence('Write what the student said.'),
    correct: sentence('Write the correct version.'),
    tip: z
      .string()
      .transform(singleLine)
      .pipe(
        z.string().max(MISTAKE_MAX, {
          message: `Keep the rule under ${MISTAKE_MAX} characters.`,
        }),
      )
      .optional(),
  })
  .refine((values) => values.wrong !== values.correct, {
    path: ['correct'],
    message: 'This is the same as the mistake.',
  });

export const MistakeFixSchema = z.object({
  mistakeId: z.uuid(),
  attempt: sentence('Write your fix first.'),
});

export const MistakeFixedSchema = z.object({
  mistakeId: z.uuid(),
  fixed: z.boolean(),
});

export type MistakeValues = z.infer<typeof MistakeSchema>;
export type MistakeFixValues = z.infer<typeof MistakeFixSchema>;
export type MistakeFixedValues = z.infer<typeof MistakeFixedSchema>;
