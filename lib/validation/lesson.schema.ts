import { z } from 'zod';

export const LessonSchema = z.object({
  enrollmentId: z.uuid(),
});

export type LessonValues = z.infer<typeof LessonSchema>;
