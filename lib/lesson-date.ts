// Lesson dates. A lesson date is a calendar day in Baku, written
// 'YYYY-MM-DD', which is also how the database stores it.

import { SCHEDULE_TIME_ZONE } from '@/lib/schedule';

// How many days back the "Lesson done" dialog offers, today included
export const LESSON_DATE_DAYS = 31;

// Lessons run in the evening, so one marked before this hour most likely
// happened the day before.
const LATE_NIGHT_ENDS_AT = 5;

const bakuFormat = new Intl.DateTimeFormat('en-GB', {
  timeZone: SCHEDULE_TIME_ZONE,
  hourCycle: 'h23',
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  hour: '2-digit',
});

// A lesson date has no time zone of its own, so it is read as a UTC day
const labelFormat = new Intl.DateTimeFormat('en-GB', {
  timeZone: 'UTC',
  weekday: 'long',
  day: 'numeric',
  month: 'long',
});

function bakuNow(now: Date) {
  const parts: Record<string, string> = {};

  for (const { type, value } of bakuFormat.formatToParts(now)) {
    parts[type] = value;
  }

  return {
    day: `${parts.year}-${parts.month}-${parts.day}`,
    hour: Number(parts.hour),
  };
}

function shiftDay(day: string, by: number) {
  const date = new Date(`${day}T00:00:00Z`);
  date.setUTCDate(date.getUTCDate() + by);

  return date.toISOString().slice(0, 10);
}

// "Sunday 11 October"
function dayLabel(day: string) {
  const parts: Record<string, string> = {};

  for (const { type, value } of labelFormat.formatToParts(
    new Date(`${day}T00:00:00Z`),
  )) {
    parts[type] = value;
  }

  return `${parts.weekday} ${parts.day} ${parts.month}`;
}

// Today's date in Baku
export function bakuToday(now: Date = new Date()) {
  return bakuNow(now).day;
}

// The date a lesson being marked right now most likely has: today, or
// yesterday when it is marked in the small hours after an evening lesson.
export function defaultLessonDate(now: Date = new Date()) {
  const { day, hour } = bakuNow(now);

  return hour < LATE_NIGHT_ENDS_AT ? shiftDay(day, -1) : day;
}

// The choices in the "Lesson done" dialog, today first:
//   Today, Sunday 11 October
//   Yesterday, Saturday 10 October
//   Friday 9 October
export function lessonDateOptions(now: Date = new Date()) {
  const today = bakuToday(now);

  return Array.from({ length: LESSON_DATE_DAYS }, (_, index) => {
    const value = shiftDay(today, -index);
    const label = dayLabel(value);

    return {
      value,
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
  const today = bakuToday(now);

  return value <= today && value > shiftDay(today, -LESSON_DATE_DAYS);
}
