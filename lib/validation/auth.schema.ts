import * as z from 'zod';

export const LogInSchema = z.object({
  email: z.email({ message: 'Please provide a valid email address.' }),
  password: z.string().min(1, { message: 'Password is required.' }),
});

export const RegisterSchema = z.object({
  fullname: z
    .string()
    .trim()
    .min(2, { message: 'Name is required.' })
    .max(50, { message: 'Name cannot exceed 50 characters.' })
    .regex(/^[\p{L}\s'-]+$/u, {
      message:
        'Name can only contain letters, spaces, hyphens and apostrophes.',
    }),

  email: z.email({ message: 'Please provide a valid email address.' }),

  password: z
    .string()
    .min(8, { message: 'Password must be at least 8 characters long.' })
    .max(100, { message: 'Password cannot exceed 100 characters.' })
    .regex(/[a-zA-Z]/, {
      message: 'Password must contain at least one letter.',
    })
    .regex(/[0-9]/, { message: 'Password must contain at least one number.' }),

  code: z
    .string()
    .trim()
    .min(4, { message: 'Enter the code your teacher gave you.' })
    .max(12, { message: 'That code looks too long.' })
    .transform((value) => value.toUpperCase()),
});

export type LogInValues = z.infer<typeof LogInSchema>;
export type RegisterValues = z.infer<typeof RegisterSchema>;
