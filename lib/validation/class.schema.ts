import * as z from 'zod';

const TIME = /^([01]\d|2[0-3]):[0-5]\d$/;

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
    .array(
      z.object({
        day: z.number().int().min(1).max(7),
        time: z.string().regex(TIME, { message: 'Set a start time.' }),
      }),
    )
    .max(7)
    .refine(
      (slots) => new Set(slots.map((slot) => slot.day)).size === slots.length,
      { message: 'Each day can only be picked once.' },
    ),

  meetingUrl: z
    .union([
      z.literal(''),
      z
        .url({ message: 'Enter a valid link.' })
        .max(500, { message: 'That link is too long.' })
        .refine((value) => /^https?:\/\//i.test(value), {
          message: 'The link must start with https://',
        }),
    ])
    .optional(),
});

export type ClassValues = z.infer<typeof ClassSchema>;
