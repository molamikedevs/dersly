// Vocabulary weeks start on Monday in Baku. A week is stored as the date of
// that Monday, 'YYYY-MM-DD', the same as the words table.

import { SCHEDULE_TIME_ZONE } from '@/lib/schedule';

const bakuDay = new Intl.DateTimeFormat('en-CA', {
  timeZone: SCHEDULE_TIME_ZONE,
});

// A week date has no time zone of its own, so it is read as a UTC day
const labelFormat = new Intl.DateTimeFormat('en-GB', {
  timeZone: 'UTC',
  day: 'numeric',
  month: 'short',
});

// The Monday of this week, or of a week before or after it
export function weekStart(now: Date = new Date(), offsetWeeks = 0) {
  const date = new Date(`${bakuDay.format(now)}T00:00:00Z`);
  const fromMonday = (date.getUTCDay() + 6) % 7;

  date.setUTCDate(date.getUTCDate() - fromMonday + offsetWeeks * 7);

  return date.toISOString().slice(0, 10);
}

// "10 Nov to 16 Nov"
export function weekLabel(start: string) {
  const monday = new Date(`${start}T00:00:00Z`);
  const sunday = new Date(monday);
  sunday.setUTCDate(sunday.getUTCDate() + 6);

  return `${labelFormat.format(monday)} to ${labelFormat.format(sunday)}`;
}
