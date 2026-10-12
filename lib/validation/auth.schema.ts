import * as z from 'zod';

// The same limits are checked by the profiles_full_name_check constraint in
// the database, so a request that skips this form is still refused.
export const NAME_MIN = 2;
export const NAME_MAX = 50;

// bcrypt, which Supabase uses for passwords, ignores anything past 72 bytes
export const PASSWORD_MIN = 8;
export const PASSWORD_MAX = 72;

// Shown as a checklist under every new-password field, before anything is
// typed. The schema below uses the same tests, so the two never disagree.
export const PASSWORD_RULES = [
  {
    label: `At least ${PASSWORD_MIN} characters`,
    test: (value: string) => value.length >= PASSWORD_MIN,
  },
  { label: 'A letter', test: (value: string) => /\p{L}/u.test(value) },
  { label: 'A number', test: (value: string) => /\d/.test(value) },
] as const;

// Pasted addresses often carry a space or capital letters
const email = z
  .string()
  .trim()
  .min(1, { message: 'Enter your email address.' })
  .toLowerCase()
  .pipe(z.email({ message: 'Enter an email address like name@example.com.' }));

const newPassword = z
  .string()
  .min(PASSWORD_MIN, {
    message: `Use at least ${PASSWORD_MIN} characters.`,
  })
  .max(PASSWORD_MAX, {
    message: `Use ${PASSWORD_MAX} characters or fewer.`,
  })
  .regex(/\p{L}/u, { message: 'Add at least one letter.' })
  .regex(/\d/, { message: 'Add at least one number.' });

// Letters in any alphabet (Aysel, Gülnarə, Şəhriyar), single spaces, hyphens
// and apostrophes, including the curly one phones type. Extra spaces are
// tidied away rather than rejected.
const fullname = z
  .string()
  .transform((value) => value.normalize('NFC').trim().replace(/\s+/g, ' '))
  .pipe(
    z
      .string()
      .min(NAME_MIN, { message: 'Enter your full name.' })
      .max(NAME_MAX, {
        message: `Keep your name to ${NAME_MAX} characters or fewer.`,
      })
      .regex(/^[\p{L}' ’-]+$/u, {
        message: 'Use letters only. Spaces, hyphens and apostrophes are fine.',
      }),
  );

export const LogInSchema = z.object({
  email,
  password: z.string().min(1, { message: 'Enter your password.' }),
});

export const RegisterSchema = z.object({
  fullname,
  email,
  password: newPassword,
  code: z
    .string()
    .trim()
    .min(4, { message: 'Enter the class code your teacher gave you.' })
    .max(12, { message: 'Class codes are 6 letters and numbers.' })
    .transform((value) => value.toUpperCase()),
});

export const ForgotPasswordSchema = z.object({ email });

export const ResetPasswordSchema = z
  .object({
    password: newPassword,
    confirm: z.string().min(1, { message: 'Type the new password again.' }),
  })
  .refine((data) => data.password === data.confirm, {
    message: 'The two passwords do not match.',
    path: ['confirm'],
  });

export type ForgotPasswordValues = z.infer<typeof ForgotPasswordSchema>;
export type ResetPasswordValues = z.infer<typeof ResetPasswordSchema>;
export type LogInValues = z.infer<typeof LogInSchema>;
export type RegisterValues = z.infer<typeof RegisterSchema>;
