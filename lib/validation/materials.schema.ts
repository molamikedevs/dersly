import * as z from 'zod';

export const MaterialSchema = z
  .object({
    kind: z.enum(['file', 'link', 'article']),
    title: z.string().trim().min(2, { message: 'Give this a title.' }),
    description: z.string().trim().optional(),
    existingPath: z.string().optional(),
    level: z
      .enum(['beginner', 'elementary', 'intermediate', 'advanced'])
      .optional(),
    url: z.string().trim().optional(),
    file: z.instanceof(File).optional(),
  })
  .refine((data) => data.kind === 'file' || !!data.url, {
    message: 'Enter a link.',
    path: ['url'],
  })
  .refine(
    (data) => data.kind !== 'file' || !!data.file || !!data.existingPath,
    {
      message: 'Choose a file.',
      path: ['file'],
    },
  );

export type MaterialValues = z.infer<typeof MaterialSchema>;
