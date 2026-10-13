import { ID } from './ids';

export type DemoHomework = {
  id: string;
  classId: string;
  title: string;
  content: string;
  postedDaysAgo: number;
};

export const DEMO_HOMEWORK: DemoHomework[] = [
  {
    id: ID.homework(1),
    classId: ID.class(1),
    title: 'Talking about travel plans',
    postedDaysAgo: 1,
    content: `## Before the lesson

Think of a trip you would like to take next year. Be ready to talk about it for two minutes.

## Useful phrases

| Phrase | Use it to |
| --- | --- |
| I'm thinking of going to... | share a plan you are not sure about |
| I've always wanted to see... | say why the place matters to you |
| It depends on... | explain what could change the plan |

> Tip: say the place first, then the reason. "Georgia, because I love mountains" is easier to follow than a long start.

## Practice

1. Write five sentences about your trip using **going to** and **might**.
2. Record yourself reading them, then listen once.`,
  },
  {
    id: ID.homework(2),
    classId: ID.class(1),
    title: 'Phrasal verbs with get',
    postedDaysAgo: 6,
    content: `## The six we used

| Verb | Meaning | Example |
| --- | --- | --- |
| get up | leave your bed | I get up at seven. |
| get on with | have a good relationship | I get on with my boss. |
| get over | recover from | She got over the flu quickly. |
| get by | manage with little | We get by on one salary. |
| get back | return | When did you get back? |
| get along | be friendly | The neighbours get along well. |

## Your turn

Write one true sentence about yourself with each verb.`,
  },
  {
    id: ID.homework(3),
    classId: ID.class(2),
    title: 'My daily routine',
    postedDaysAgo: 3,
    content: `## Write about your day

Write 8 to 10 sentences about a normal weekday. Use **always**, **usually**, **sometimes** and **never** at least once.

> Remember: the word goes before the verb. "I usually drink tea", not "I drink usually tea".

## Words you may need

| Morning | Afternoon | Evening |
| --- | --- | --- |
| wake up | have lunch | cook dinner |
| get dressed | go back to work | watch a series |
| catch the bus | pick up the kids | go to bed |`,
  },
  {
    id: ID.homework(4),
    classId: ID.class(2),
    title: 'There is and there are',
    postedDaysAgo: 10,
    content: `## The rule

Use **there is** for one thing and **there are** for more than one.

- There is a park near my flat.
- There are two cafés on my street.

## Practice

Describe your neighbourhood in six sentences.`,
  },
  {
    id: ID.homework(5),
    classId: ID.class(3),
    title: 'Present perfect or past simple?',
    postedDaysAgo: 2,
    content: `## When to use which

| Present perfect | Past simple |
| --- | --- |
| No finished time: I've been to Paris. | Finished time: I went to Paris in 2019. |
| Result now: I've lost my keys. | A story: I lost my keys yesterday. |

> If the sentence has *yesterday*, *last week* or *in 2019*, use the past simple.

## Practice

Fill in the gaps in your notebook:

1. I ___ (see) that film last weekend.
2. She ___ (live) here since 2020.
3. We ___ (not finish) the report yet.`,
  },
];
