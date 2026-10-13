import type { MaterialRecord } from '@/types/materials';

import { ID } from './ids';

export type DemoMaterial = Omit<MaterialRecord, 'uploadedAt'> & {
  uploadedDaysAgo: number;
};

// Public YouTube videos and a public page, with their real titles, and two
// guides written for the demo
export const DEMO_MATERIALS: DemoMaterial[] = [
  {
    id: ID.material(1),
    classId: null,
    kind: 'guide',
    title: 'Irregular verbs you use every day',
    description: 'The 20 most common irregular verbs, with examples.',
    level: 'elementary',
    url: null,
    uploadedDaysAgo: 4,
    content: `## Learn these first

| Base | Past | Past participle |
| --- | --- | --- |
| be | was / were | been |
| have | had | had |
| go | went | gone |
| make | made | made |
| take | took | taken |
| see | saw | seen |
| come | came | come |
| get | got | got |

> Learn them in groups that sound alike: *buy, bought, bought* and *think, thought, thought*.`,
  },
  {
    id: ID.material(2),
    classId: null,
    kind: 'guide',
    title: 'Linking words for longer answers',
    description: 'Join your ideas so you can say more in one go.',
    level: 'intermediate',
    url: null,
    uploadedDaysAgo: 12,
    content: `## To add an idea

**also**, **as well as**, **on top of that**

## To compare

**however**, **on the other hand**, **while**

## To give a reason

**because**, **since**, **that's why**

> Pick two from each group and use them this week. Fewer words, used well, beat a long list.`,
  },
  {
    id: ID.material(3),
    classId: null,
    kind: 'link',
    title: 'How to connect ideas in English',
    description: 'Linking words, with examples you can copy.',
    level: 'elementary',
    url: 'https://www.youtube.com/watch?v=-JqAs_vdQb8',
    content: null,
    uploadedDaysAgo: 6,
  },
  {
    id: ID.material(4),
    classId: null,
    kind: 'link',
    title: '6 Minute English: How important is politeness?',
    description: null,
    level: 'intermediate',
    url: 'https://www.youtube.com/watch?v=5wynL5ttotw',
    content: null,
    uploadedDaysAgo: 15,
  },
  {
    id: ID.material(5),
    classId: null,
    kind: 'link',
    title: 'Understand fast English conversation',
    description: 'Listening practice at natural speed.',
    level: 'advanced',
    url: 'https://www.youtube.com/watch?v=CC2QY0Ls7iE',
    content: null,
    uploadedDaysAgo: 20,
  },
  {
    id: ID.material(6),
    classId: null,
    kind: 'article',
    title: 'Common English idioms',
    description: 'Short explanations with an example for each.',
    level: null,
    url: 'https://www.ef.com/wwen/english-resources/english-idioms',
    content: null,
    uploadedDaysAgo: 9,
  },
];
