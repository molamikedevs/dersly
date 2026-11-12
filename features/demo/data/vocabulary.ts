import { ID } from './ids';

export type DemoWord = {
  id: string;
  enrollmentId: string;
  // 0 is this week, 1 is last week (in the check)
  weeksAgo: number;
  word: string;
  meaning: string;
  example: string | null;
  // Last week's words only: null not answered yet, true passed, false missed
  passed: boolean | null;
};

// Words for the two one-to-one students, Murad and Sabina
export const DEMO_WORDS: DemoWord[] = [
  {
    id: ID.word(1),
    enrollmentId: ID.enrollment(7),
    weeksAgo: 0,
    word: 'borrow',
    meaning: 'To take something and give it back later.',
    example: 'Can I borrow your pen for a minute?',
    passed: null,
  },
  {
    id: ID.word(2),
    enrollmentId: ID.enrollment(7),
    weeksAgo: 0,
    word: 'receipt',
    meaning: 'The paper a shop gives you to show you paid.',
    example: 'Keep the receipt in case the shoes are too small.',
    passed: null,
  },
  {
    id: ID.word(3),
    enrollmentId: ID.enrollment(7),
    weeksAgo: 0,
    word: 'crowded',
    meaning: 'Full of people.',
    example: 'The metro is always crowded at eight in the morning.',
    passed: null,
  },
  {
    id: ID.word(4),
    enrollmentId: ID.enrollment(7),
    weeksAgo: 1,
    word: 'bill',
    meaning: 'The paper that shows how much you must pay in a restaurant.',
    example: 'Could we have the bill, please?',
    passed: true,
  },
  {
    id: ID.word(5),
    enrollmentId: ID.enrollment(7),
    weeksAgo: 1,
    word: 'tip',
    meaning: 'Extra money you give a waiter for good service.',
    example: null,
    passed: false,
  },
  {
    id: ID.word(6),
    enrollmentId: ID.enrollment(7),
    weeksAgo: 1,
    word: 'starter',
    meaning: 'A small dish you eat before the main course.',
    example: 'I will have the soup as a starter.',
    passed: null,
  },
  {
    id: ID.word(7),
    enrollmentId: ID.enrollment(8),
    weeksAgo: 0,
    word: 'nuance',
    meaning: 'A very small difference in meaning or feeling.',
    example: 'The translation lost some of the nuance of the original.',
    passed: null,
  },
  {
    id: ID.word(8),
    enrollmentId: ID.enrollment(8),
    weeksAgo: 0,
    word: 'compelling',
    meaning: 'So interesting or strong that you have to pay attention.',
    example: 'She made a compelling case for working from home.',
    passed: null,
  },
];
