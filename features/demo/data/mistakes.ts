import { ID } from './ids';

export type DemoMistake = {
  id: string;
  enrollmentId: string;
  daysAgo: number;
  wrong: string;
  correct: string;
  tip: string | null;
  attempt: string | null;
  fixed: boolean;
};

// Mistakes from Murad's and Sabina's recent lessons
export const DEMO_MISTAKES: DemoMistake[] = [
  {
    id: ID.mistake(1),
    enrollmentId: ID.enrollment(7),
    daysAgo: 3,
    wrong: 'I have seen him yesterday.',
    correct: 'I saw him yesterday.',
    tip: 'With a finished time like "yesterday", use the past simple.',
    attempt: null,
    fixed: false,
  },
  {
    id: ID.mistake(2),
    enrollmentId: ID.enrollment(7),
    daysAgo: 3,
    wrong: 'She don’t like coffee.',
    correct: 'She doesn’t like coffee.',
    tip: 'He, she and it take "doesn’t".',
    attempt: 'She not like coffee.',
    fixed: false,
  },
  {
    id: ID.mistake(3),
    enrollmentId: ID.enrollment(7),
    daysAgo: 7,
    wrong: 'I want a tea, please.',
    correct: 'I would like a tea, please.',
    tip: '"I would like" is the polite way to order.',
    attempt: 'I would like a tea, please.',
    fixed: true,
  },
  {
    id: ID.mistake(4),
    enrollmentId: ID.enrollment(8),
    daysAgo: 4,
    wrong: 'It depends of the context.',
    correct: 'It depends on the context.',
    tip: null,
    attempt: null,
    fixed: false,
  },
];
