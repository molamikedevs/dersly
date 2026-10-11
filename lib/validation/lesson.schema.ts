import { z } from 'zod';

import { isAllowedLessonDate } from '@/lib/lesson-date';

export const LessonSchema = z.object({
  enrollmentId: z.uuid(),
});

export const MarkLessonSchema = LessonSchema.extend({
  note: z
    .string()
    .trim()
    .max(2000, { message: 'Keep the note under 2000 characters.' })
    .optional(),

  // The day the lesson happened, 'YYYY-MM-DD' in Baku. Left out, the lesson
  // is dated today.
  lessonDate: z.iso
    .date({ message: 'Choose the lesson date.' })
    .refine((value) => isAllowedLessonDate(value), {
      message: 'Choose a date from the last month, not in the future.',
    })
    .optional(),
});

export type LessonValues = z.infer<typeof LessonSchema>;
export type MarkLessonValues = z.infer<typeof MarkLessonSchema>;
