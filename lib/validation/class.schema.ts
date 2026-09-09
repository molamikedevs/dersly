import * as z from 'zod';

export const ClassSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, { message: 'Name is required.' })
    .max(60, { message: 'Name cannot exceed 60 characters.' }),

  type: z.enum(['one_to_one', 'course', 'conversation'], {
    message: 'Choose a class type.',
  }),

  level: z
    .enum(['beginner', 'elementary', 'intermediate', 'advanced'])
    .optional(),

  schedule: z
    .string()
    .trim()
    .max(60, { message: 'Keep the schedule short.' })
    .optional(),

  meetingUrl: z
    .union([z.literal(''), z.url({ message: 'Enter a valid link.' })])
    .optional(),
});

export type ClassValues = z.infer<typeof ClassSchema>;
