import { z } from 'zod';

export const LessonSchema = z.object({
  enrollmentId: z.uuid(),
});

export const MarkLessonSchema = LessonSchema.extend({
  note: z
    .string()
    .trim()
    .max(2000, { message: 'Keep the note under 2000 characters.' })
    .optional(),
});

export type LessonValues = z.infer<typeof LessonSchema>;
export type MarkLessonValues = z.infer<typeof MarkLessonSchema>;
