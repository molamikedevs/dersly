import type { Level } from '@/features/level-test/levels';

import { ID } from './ids';

// A short invented placement test, from easy to hard. The answer key stays
// in this file: the demo scores in the browser the same way the database
// scores the real test.

type Item = { prompt: string; options: string[]; correct: number };

const ITEMS: Item[] = [
  {
    prompt: 'She ___ a teacher.',
    options: ['is', 'are', 'am', 'be'],
    correct: 0,
  },
  {
    prompt: 'I ___ coffee every morning.',
    options: ['drinks', 'drink', 'drinking', 'am drink'],
    correct: 1,
  },
  {
    prompt: 'There ___ two cafés on my street.',
    options: ['is', 'be', 'are', 'has'],
    correct: 2,
  },
  {
    prompt: 'We ___ to Gəncə last summer.',
    options: ['go', 'gone', 'have gone', 'went'],
    correct: 3,
  },
  {
    prompt: 'This bag is ___ than that one.',
    options: ['heavier', 'more heavy', 'heavyer', 'most heavy'],
    correct: 0,
  },
  {
    prompt: "I've lived here ___ 2019.",
    options: ['for', 'since', 'from', 'during'],
    correct: 1,
  },
  {
    prompt: 'If it rains, we ___ at home.',
    options: ['stayed', 'would stay', 'will stay', 'stay will'],
    correct: 2,
  },
  {
    prompt: 'She asked me where ___.',
    options: ['do I live', 'I do live', 'did I live', 'I lived'],
    correct: 3,
  },
  {
    prompt: 'The report ___ by Friday.',
    options: [
      'must be finished',
      'must finish',
      'must finished',
      'must be finish',
    ],
    correct: 0,
  },
  {
    prompt: 'I wish I ___ more time to read.',
    options: ['have', 'had', 'will have', 'am having'],
    correct: 1,
  },
  {
    prompt: 'Had I known, I ___ earlier.',
    options: ['would come', 'will have come', 'would have come', 'came'],
    correct: 2,
  },
  {
    prompt: 'Rarely ___ such a clear explanation.',
    options: ['I have heard', 'I heard', 'heard I', 'have I heard'],
    correct: 3,
  },
];

export const DEMO_QUIZ: { quizId: string; questions: TestQuestion[] } = {
  quizId: ID.quiz,
  questions: ITEMS.map((item, q) => ({
    id: ID.question(q + 1),
    prompt: item.prompt,
    options: item.options.map((text, o) => ({
      id: ID.option(q + 1, o + 1),
      text,
    })),
  })),
};

const CORRECT = new Set(
  ITEMS.map((item, q) => ID.option(q + 1, item.correct + 1)),
);

// The same bands the database uses for the real test
export function scoreDemoTest(answers: TestAnswer[]) {
  const answered = new Map(answers.map((a) => [a.questionId, a.optionId]));
  const total = DEMO_QUIZ.questions.length;
  const score = DEMO_QUIZ.questions.filter((question) =>
    CORRECT.has(answered.get(question.id) ?? ''),
  ).length;

  const ratio = score / total;
  const level: Level =
    ratio < 0.27
      ? 'beginner'
      : ratio < 0.53
        ? 'elementary'
        : ratio < 0.8
          ? 'intermediate'
          : 'advanced';

  return { score, total, level };
}
