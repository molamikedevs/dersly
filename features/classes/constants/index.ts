import { type TodayClass, type UpNext } from '@/features/classes/today';
import {
  classSlots,
  formatNextLesson,
  getNextLesson,
  getTodaysLesson,
} from '@/lib/schedule';

const COMING_UP_SHOWN = 5;

export function upcomingLessons(
  classes: TodayClass[],
  upNext: UpNext | null,
  now: Date,
) {
  const coming: { class: TodayClass; start: Date }[] = [];

  for (const item of classes) {
    const slots = classSlots(item);
    const today = getTodaysLesson(slots, now)?.getTime();

    let next = getNextLesson(slots, now, 0);

    // A class meets at most once a day, so one step past today's lesson
    // reaches its next day
    if (next && next.getTime() === today) {
      next = getNextLesson(slots, new Date(next.getTime() + 60_000), 0);
    }

    if (!next || next.getTime() === today) continue;

    const shownAbove =
      upNext !== null &&
      upNext.class.id === item.id &&
      upNext.start.getTime() === next.getTime();

    if (!shownAbove) coming.push({ class: item, start: next });
  }

  return coming
    .sort(
      (a, b) =>
        a.start.getTime() - b.start.getTime() ||
        a.class.name.localeCompare(b.class.name),
    )
    .slice(0, COMING_UP_SHOWN);
}

export function lessonCountTitle(count: number) {
  if (count === 0) return 'No lessons today';
  if (count === 1) return '1 lesson today';
  return `${count} lessons today`;
}

// "Next lesson tomorrow, 21:00" or "Next lesson Monday 12 Oct, 21:00"
export function nextLessonLine(next: Date | null, now: Date) {
  if (!next) return 'No lesson times set';

  const when = formatNextLesson(next, now);
  const text = /^(Today|Tonight|Tomorrow)/.test(when)
    ? when[0].toLowerCase() + when.slice(1)
    : when;

  return `Next lesson ${text}`;
}

export const TYPES = [
  { value: 'one_to_one', label: 'One to one' },
  { value: 'course', label: 'Course' },
  { value: 'conversation', label: 'Conversation' },
] as const;

export const LEVELS = [
  { value: 'beginner', label: 'Beginner' },
  { value: 'elementary', label: 'Elementary' },
  { value: 'intermediate', label: 'Intermediate' },
  { value: 'advanced', label: 'Advanced' },
] as const;

export const LESSONS_PER_PACKAGE = 8;

export function studentCountLabel(count: number) {
  if (count <= 0) return 'No students yet';
  if (count === 1) return '1 student';
  return `${count} students`;
}

export const PAYMENT_SOON = LESSONS_PER_PACKAGE - 1;
