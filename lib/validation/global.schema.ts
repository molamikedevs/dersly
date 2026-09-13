import * as z from 'zod';

export const PaginatedSearchParamsSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(10),
  sort: z.string().optional(),
  filter: z.string().optional(),
  query: z.string().optional(),
});
