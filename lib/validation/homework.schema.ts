import * as z from 'zod';

const MAX_SIZE = 10 * 1024 * 1024;

const ACCEPTED_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'image/jpeg',
  'image/png',
];

export const TITLE_MAX = 80;
export const GUIDE_MAX = 20000;

// One line, one space between words, the same letters however they were typed
function singleLine(value: string) {
  return value.normalize('NFC').replace(/\s+/g, ' ').trim();
}

export const HomeworkSchema = z
  .object({
    classId: z.uuid({ message: 'Choose a class.' }),

    title: z
      .string()
      .transform(singleLine)
      .pipe(
        z
          .string()
          .min(2, { message: 'Give the homework a title.' })
          .max(TITLE_MAX, {
            message: `Keep the title under ${TITLE_MAX} characters.`,
          }),
      ),

    content: z
      .string()
      .trim()
      .max(GUIDE_MAX, {
        message: `The guide is too long. Keep it under ${GUIDE_MAX.toLocaleString('en')} characters.`,
      })
      .optional(),

    existingPath: z.string().optional(),

    file: z
      .instanceof(File)
      .refine((file) => file.size > 0, { message: 'Choose a file to upload.' })
      .refine((file) => file.size <= MAX_SIZE, {
        message: 'File must be under 10MB.',
      })
      .refine((file) => ACCEPTED_TYPES.includes(file.type), {
        message: 'Upload a PDF, Word document or image.',
      })
      .optional(),
  })
  .refine((data) => !!data.content || !!data.file || !!data.existingPath, {
    message: 'Write the guide before posting.',
    path: ['content'],
  });

export type HomeworkValues = z.infer<typeof HomeworkSchema>;
