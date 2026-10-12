// What each result means, in words a student can act on. The CEFR letters
// are a rough guide only: thirty questions place a student, they do not
// certify a level.

export const LEVEL_ORDER = [
  'beginner',
  'elementary',
  'intermediate',
  'advanced',
] as const;

export type Level = (typeof LEVEL_ORDER)[number];

type LevelCopy = {
  name: string;
  cefr: string;
  summary: string;
  canDo: string[];
  next: string;
};

export const LEVELS: Record<Level, LevelCopy> = {
  beginner: {
    name: 'Beginner',
    cefr: 'A1',
    summary:
      'You know some everyday words and can follow very simple sentences.',
    canDo: [
      'Say who you are and where you are from',
      'Understand slow, simple questions about familiar things',
    ],
    next: 'Learn the most common verbs and build short sentences with them. Slow, clear material is the right place to start.',
  },
  elementary: {
    name: 'Elementary',
    cefr: 'A2',
    summary:
      'You can handle everyday situations with simple sentences and common words.',
    canDo: [
      'Talk about your day, your family and your plans',
      'Understand short, clear messages, signs and announcements',
    ],
    next: 'Practise the past tenses and join your ideas with words like because, so and but, so you can say more in one go.',
  },
  intermediate: {
    name: 'Intermediate',
    cefr: 'B1 to B2',
    summary:
      'You can hold a real conversation on familiar topics and get your point across.',
    canDo: [
      'Keep a conversation going without long pauses',
      'Follow the main points of clear speech, videos and articles',
    ],
    next: 'Work on sounding natural: phrasal verbs, linking words, and listening at normal speed.',
  },
  advanced: {
    name: 'Advanced',
    cefr: 'C1',
    summary:
      'You are comfortable in English and can express ideas clearly and in detail.',
    canDo: [
      'Speak fluently and adjust how formal you sound',
      'Understand long texts and fast, natural speech',
    ],
    next: 'Polish idioms, formal writing and the small mistakes that are left. Native-speed podcasts and articles will stretch you.',
  },
};

export function isLevel(value: string | null | undefined): value is Level {
  return LEVEL_ORDER.includes(value as Level);
}
