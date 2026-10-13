import { ID } from './ids';

export type DemoNote = {
  id: string;
  enrollmentId: string;
  daysAgo: number;
  note: string;
};

// What the teacher wrote after past lessons
export const DEMO_NOTES: DemoNote[] = [
  {
    id: ID.note(1),
    enrollmentId: ID.enrollment(7),
    daysAgo: 3,
    note: 'Present perfect with "already" and "yet". Murad mixes them with the past simple when he tells stories. Next time: short stories about last weekend.',
  },
  {
    id: ID.note(2),
    enrollmentId: ID.enrollment(7),
    daysAgo: 7,
    note: 'Ordering at a restaurant role play. Good confidence. Watch "I want" versus "I would like".',
  },
  {
    id: ID.note(3),
    enrollmentId: ID.enrollment(1),
    daysAgo: 2,
    note: 'Great discussion on remote work. Günel used "on the other hand" well. Practise linking words for longer answers.',
  },
  {
    id: ID.note(4),
    enrollmentId: ID.enrollment(1),
    daysAgo: 5,
    note: 'Travel stories. Work on the pronunciation of "-ed" endings: worked, visited, stayed.',
  },
  {
    id: ID.note(5),
    enrollmentId: ID.enrollment(8),
    daysAgo: 4,
    note: 'Last lesson of the package. Sabina presented her article summary with almost no notes. Ready for C1 reading.',
  },
];
