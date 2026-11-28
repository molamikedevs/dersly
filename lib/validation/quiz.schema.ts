import * as z from 'zod';

export const QUIZ_MAX_QUESTIONS = 30;
export const QUIZ_MAX_SCORE = 100;

export function calculateQuizScore(
  correctCount: number,
  totalQuestions: number,
) {
  if (totalQuestions <= 0) return 0;
  return Math.round((correctCount / totalQuestions) * QUIZ_MAX_SCORE);
}

export function calculateCorrectCount(score: number, totalQuestions: number) {
  if (totalQuestions <= 0) return 0;
  return Math.round((score / QUIZ_MAX_SCORE) * totalQuestions);
}

function singleLine(value: string) {
  return value.normalize('NFC').replace(/\s+/g, ' ').trim();
}

function normalizePrompt(value: string) {
  return singleLine(value).replace(/_{3,}/g, '___');
}

const cleanText = (message: string, max = 240) =>
  z
    .string()
    .transform(singleLine)
    .pipe(
      z
        .string()
        .min(1, { message })
        .max(max, { message: `Keep it under ${max} characters.` }),
    );

export const QuizQuestionInputSchema = z
  .object({
    kind: z.enum(['mcq', 'word_bank']),
    prompt: z
      .string()
      .transform(normalizePrompt)
      .pipe(
        z
          .string()
          .min(1, { message: 'Write the question.' })
          .max(300, { message: 'Keep it under 300 characters.' }),
      ),
    options: z
      .array(cleanText('Fill in all choices.', 120))
      .min(2, { message: 'Add at least 2 choices.' })
      .max(6, { message: 'Keep it to 6 choices or fewer.' }),
    correctAnswer: cleanText('Pick the right answer.', 120),
  })
  .refine(
    (q) =>
      new Set(q.options.map((opt) => opt.toLowerCase())).size ===
      q.options.length,
    {
      message: 'Each choice must be unique.',
      path: ['options'],
    },
  )
  .refine((q) => q.options.includes(q.correctAnswer), {
    message: 'The right answer must match one of the choices.',
    path: ['correctAnswer'],
  })
  .refine((q) => q.kind !== 'word_bank' || q.prompt.includes('___'), {
    message: 'Use ___ where the word goes.',
    path: ['prompt'],
  });

export const SaveQuizSchema = z.object({
  quizId: z.uuid().optional(),
  classId: z.uuid(),
  title: cleanText('Give the quiz a title.', 120),
  isPublished: z.boolean(),
  questions: z
    .array(QuizQuestionInputSchema)
    .min(1, { message: 'Add at least 1 question.' })
    .max(QUIZ_MAX_QUESTIONS, {
      message: `A quiz can have at most ${QUIZ_MAX_QUESTIONS} questions.`,
    }),
});

export const SaveQuizProgressSchema = z.object({
  quizId: z.uuid(),
  answers: z.record(z.string(), z.string()),
});

export const SubmitQuizSchema = z.object({
  quizId: z.uuid(),
  answers: z.record(z.string(), z.string()),
});

export type QuizQuestionInput = z.infer<typeof QuizQuestionInputSchema>;
export type SaveQuizValues = z.infer<typeof SaveQuizSchema>;
