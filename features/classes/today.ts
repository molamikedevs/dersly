import { classSlots, getNextLesson, getTodaysLesson } from '@/lib/schedule';

// How long a lesson counts as "on now" after its start time. The student
// home uses the same hour.
export const LESSON_MINUTES = 60;

export type TodayClass = ClassWithCount | PrivateClass;

export type TodayLesson = {
  class: TodayClass;
  start: Date;
  state: 'earlier' | 'now' | 'later';
};

export type UpNext = {
  class: TodayClass;
  start: Date;
  started: boolean;
  isToday: boolean;
};

export type Today = {
  lessons: TodayLesson[];
  upNext: UpNext | null;
};

function byStart<T extends { class: TodayClass; start: Date }>(a: T, b: T) {
  return (
    a.start.getTime() - b.start.getTime() ||
    a.class.name.localeCompare(b.class.name)
  );
}

export function isUpNext(lesson: TodayLesson, upNext: UpNext | null) {
  return (
    upNext !== null &&
    upNext.class.id === lesson.class.id &&
    upNext.start.getTime() === lesson.start.getTime()
  );
}

export function buildToday(
  classes: TodayClass[],
  now: Date = new Date(),
): Today {
  const time = now.getTime();
  const lessons: TodayLesson[] = [];
  const coming: { class: TodayClass; start: Date }[] = [];

  for (const item of classes) {
    const slots = classSlots(item);

    const today = getTodaysLesson(slots, now);

    if (today) {
      const end = today.getTime() + LESSON_MINUTES * 60_000;

      lessons.push({
        class: item,
        start: today,
        state:
          time > end ? 'earlier' : time >= today.getTime() ? 'now' : 'later',
      });
    }

    const next = getNextLesson(slots, now, LESSON_MINUTES);

    if (next) coming.push({ class: item, start: next });
  }

  lessons.sort(byStart);
  coming.sort(byStart);

  const [first] = coming;

  if (!first) return { lessons, upNext: null };

  const upNext: UpNext = {
    ...first,
    started: first.start.getTime() <= time,
    isToday: false,
  };

  upNext.isToday = lessons.some((lesson) => isUpNext(lesson, upNext));

  return { lessons, upNext };
}
