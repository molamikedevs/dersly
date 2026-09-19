import * as z from 'zod';

export const PaginatedSearchParamsSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(10),
  sort: z.string().optional(),
  filter: z.string().optional(),
  query: z.string().optional(),
});

export const AvatarSchema = z.object({
  file: z
    .instanceof(File)
    .refine((file) => file.size > 0, { message: 'Choose an image.' })
    .refine((file) => file.size <= 2 * 1024 * 1024, {
      message: 'Image must be under 2MB.',
    })
    .refine(
      (file) => ['image/jpeg', 'image/png', 'image/webp'].includes(file.type),
      { message: 'Upload a JPG, PNG or WebP image.' },
    ),
});

export type AvatarValues = z.infer<typeof AvatarSchema>;
