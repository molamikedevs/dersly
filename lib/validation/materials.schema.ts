import * as z from 'zod';

export const MaterialSchema = z
  .object({
    kind: z.enum(['guide', 'link', 'article']),
    title: z
      .string()
      .trim()
      .min(2, { message: 'Give this a title.' })
      .max(120, { message: 'Keep the title under 120 characters.' }),
    description: z
      .string()
      .trim()
      .max(300, { message: 'Keep the description short.' })
      .optional(),
    level: z
      .enum(['beginner', 'elementary', 'intermediate', 'advanced'])
      .optional(),
    url: z.string().trim().optional(),
    content: z
      .string()
      .trim()
      .max(50000, { message: 'The guide is too long.' })
      .optional(),
  })
  .refine((data) => data.kind === 'guide' || !!data.url, {
    message: 'Enter a link.',
    path: ['url'],
  })
  .refine((data) => data.kind !== 'guide' || !!data.content, {
    message: 'Write the guide.',
    path: ['content'],
  });

export type MaterialValues = z.infer<typeof MaterialSchema>;
