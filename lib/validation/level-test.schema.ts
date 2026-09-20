import * as z from 'zod';

export const AttemptSchema = z.object({
  quizId: z.uuid(),
  answers: z
    .array(
      z.object({
        questionId: z.uuid(),
        optionId: z.uuid(),
      }),
    )
    .min(1, { message: 'Answer at least one question.' }),
});

export type AttemptValues = z.infer<typeof AttemptSchema>;
