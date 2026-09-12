import * as z from 'zod';

const MAX_SIZE = 10 * 1024 * 1024;

const ACCEPTED_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'image/jpeg',
  'image/png',
];

export const HomeworkSchema = z.object({
  title: z
    .string()
    .trim()
    .min(2, { message: 'Give the homework a title.' })
    .max(80, { message: 'Title cannot exceed 80 characters.' }),

  file: z
    .instanceof(File, { message: 'Choose a file to upload.' })
    .refine((file) => file.size > 0, { message: 'Choose a file to upload.' })
    .refine((file) => file.size <= MAX_SIZE, {
      message: 'File must be under 10MB.',
    })
    .refine((file) => ACCEPTED_TYPES.includes(file.type), {
      message: 'Upload a PDF, Word document or image.',
    }),
});

export type HomeworkValues = z.infer<typeof HomeworkSchema>;
