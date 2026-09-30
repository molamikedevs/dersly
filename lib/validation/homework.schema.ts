import * as z from 'zod';

const MAX_SIZE = 10 * 1024 * 1024;

const ACCEPTED_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'image/jpeg',
  'image/png',
];

export const HomeworkSchema = z
  .object({
    classId: z.uuid({ message: 'Choose a class.' }),

    title: z
      .string()
      .trim()
      .min(2, { message: 'Give the homework a title.' })
      .max(80, { message: 'Title cannot exceed 80 characters.' }),

    instructions: z
      .string()
      .trim()
      .max(500, { message: 'Keep the instructions short.' })
      .optional(),

    content: z
      .string()
      .trim()
      .max(20000, { message: 'The guide is too long.' })
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
  .refine(
    (data) =>
      !!data.content ||
      !!data.file ||
      !!data.existingPath ||
      !!data.instructions,
    {
      message: 'Write a guide, add a file or write instructions.',
      path: ['content'],
    },
  );

export type HomeworkValues = z.infer<typeof HomeworkSchema>;
