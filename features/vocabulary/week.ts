// Vocabulary weeks start on Monday in Baku. A week is stored as the date of
// that Monday, 'YYYY-MM-DD', the same as the words table.

import { addDays, addWeeks, format, parseISO, startOfISOWeek } from 'date-fns';

import { inBaku } from '@/lib/time-zone';

// The Monday of this week, or of a week before or after it
export function weekStart(now: Date = new Date(), offsetWeeks = 0) {
  const monday = addWeeks(startOfISOWeek(now, inBaku), offsetWeeks, inBaku);

  return format(monday, 'yyyy-MM-dd', inBaku);
}

// "10 Nov to 16 Nov". A week date is a plain calendar day with no time zone,
// so parseISO reads it as that day wherever the code runs.
export function weekLabel(start: string) {
  const monday = parseISO(start);

  return `${format(monday, 'd MMM')} to ${format(addDays(monday, 6), 'd MMM')}`;
}
