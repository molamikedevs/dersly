import { z } from 'zod';

export const LessonSchema = z.object({
  enrollmentId: z.uuid(),
});

export const MarkLessonSchema = LessonSchema.extend({
  note: z
    .string()
    .trim()
    .max(1000, { message: 'Keep the note under 1000 characters.' })
    .optional(),
});

export type LessonValues = z.infer<typeof LessonSchema>;
export type MarkLessonValues = z.infer<typeof MarkLessonSchema>;
