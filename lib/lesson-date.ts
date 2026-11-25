// Lesson dates. A lesson date is a calendar day in Baku, written
// 'YYYY-MM-DD', which is also how the database stores it.

import { format, getHours, subDays } from 'date-fns';

import { inBaku } from '@/lib/time-zone';

// How many days back the "Lesson done" dialog offers, today included
export const LESSON_DATE_DAYS = 31;

// Lessons run in the evening, so one marked before this hour most likely
// happened the day before.
const LATE_NIGHT_ENDS_AT = 5;

// The Baku calendar day `daysAgo` days before now, as 'YYYY-MM-DD'
export function bakuDay(now: Date, daysAgo = 0) {
  return format(subDays(now, daysAgo, inBaku), 'yyyy-MM-dd', inBaku);
}

// Today's date in Baku
export function bakuToday(now: Date = new Date()) {
  return bakuDay(now);
}

// The date a lesson being marked right now most likely has: today, or
// yesterday when it is marked in the small hours after an evening lesson.
export function defaultLessonDate(now: Date = new Date()) {
  return bakuDay(now, getHours(now, inBaku) < LATE_NIGHT_ENDS_AT ? 1 : 0);
}

// The choices in the "Lesson done" dialog, today first:
//   Today, Sunday 11 October
//   Yesterday, Saturday 10 October
//   Friday 9 October
export function lessonDateOptions(now: Date = new Date()) {
  return Array.from({ length: LESSON_DATE_DAYS }, (_, index) => {
    const label = format(subDays(now, index, inBaku), 'EEEE d MMMM', inBaku);

    return {
      value: bakuDay(now, index),
      label:
        index === 0
          ? `Today, ${label}`
          : index === 1
            ? `Yesterday, ${label}`
            : label,
    };
  });
}

// True for today and the days the dialog offers. ISO dates sort as text.
export function isAllowedLessonDate(value: string, now: Date = new Date()) {
  return value <= bakuDay(now) && value > bakuDay(now, LESSON_DATE_DAYS);
}
