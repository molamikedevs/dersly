// Lesson schedules. A class has at most one lesson per weekday, each with its
// own start time. Everything here is Baku time, whatever time zone the server
// or the browser is in.

export const SCHEDULE_TIME_ZONE = 'Asia/Baku';

// ISO weekdays: 1 is Monday, 7 is Sunday. The week starts on Monday here.
export const WEEKDAYS = [
  { value: 1, short: 'Mon', long: 'Monday' },
  { value: 2, short: 'Tue', long: 'Tuesday' },
  { value: 3, short: 'Wed', long: 'Wednesday' },
  { value: 4, short: 'Thu', long: 'Thursday' },
  { value: 5, short: 'Fri', long: 'Friday' },
  { value: 6, short: 'Sat', long: 'Saturday' },
  { value: 7, short: 'Sun', long: 'Sunday' },
] as const;

// time is 'HH:MM', 24 hour
export type ScheduleSlot = { day: number; time: string };

const TIME = /^([01]\d|2[0-3]):[0-5]\d/;

// Builds slots from the two database columns. The database returns times as
// 'HH:MM:SS'. Anything invalid is dropped, a repeated day keeps its first
// time, and the result is sorted Monday to Sunday.
export function toSlots(
  days: readonly number[] | null | undefined,
  times: readonly string[] | null | undefined,
): ScheduleSlot[] {
  if (!days || !times) return [];

  const byDay = new Map<number, string>();

  days.forEach((day, index) => {
    const time = times[index];
    if (!Number.isInteger(day) || day < 1 || day > 7) return;
    if (typeof time !== 'string' || !TIME.test(time)) return;
    if (!byDay.has(day)) byDay.set(day, time.slice(0, 5));
  });

  return [...byDay]
    .sort(([a], [b]) => a - b)
    .map(([day, time]) => ({ day, time }));
}

export function classSlots(record: {
  scheduleDays: readonly number[] | null;
  scheduleTimes: readonly string[] | null;
}) {
  return toSlots(record.scheduleDays, record.scheduleTimes);
}

// The shape the classes table stores
export function toScheduleColumns(slots: readonly ScheduleSlot[]) {
  const sorted = toSlots(
    slots.map((slot) => slot.day),
    slots.map((slot) => slot.time),
  );

  return {
    schedule_days: sorted.map((slot) => slot.day),
    schedule_times: sorted.map((slot) => slot.time),
  };
}

function joinWords(words: string[]) {
  if (words.length <= 1) return words.join('');
  return `${words.slice(0, -1).join(', ')} and ${words.at(-1)}`;
}

// The one place a schedule becomes text:
//   Sunday, 12:00
//   Mon and Fri, 21:00
//   Wed, Sat and Sun, 20:00
//   Every day, 19:00
//   Wed 21:00 and Sat 12:00   (when the times differ)
export function formatSchedule(slots: readonly ScheduleSlot[]): string | null {
  if (slots.length === 0) return null;

  const sameTime = slots.every((slot) => slot.time === slots[0].time);

  if (!sameTime) {
    return joinWords(
      slots.map((slot) => `${WEEKDAYS[slot.day - 1].short} ${slot.time}`),
    );
  }

  const days =
    slots.length === 7
      ? 'Every day'
      : slots.length === 1
        ? WEEKDAYS[slots[0].day - 1].long
        : joinWords(slots.map((slot) => WEEKDAYS[slot.day - 1].short));

  return `${days}, ${slots[0].time}`;
}

const zonedFormat = new Intl.DateTimeFormat('en-GB', {
  timeZone: SCHEDULE_TIME_ZONE,
  hourCycle: 'h23',
  weekday: 'long',
  year: 'numeric',
  month: 'numeric',
  day: 'numeric',
  hour: 'numeric',
  minute: 'numeric',
  second: 'numeric',
});

const monthFormat = new Intl.DateTimeFormat('en-GB', {
  timeZone: SCHEDULE_TIME_ZONE,
  month: 'short',
});

// The wall clock in Baku at a given instant
function zonedParts(date: Date) {
  const parts: Record<string, string> = {};

  for (const { type, value } of zonedFormat.formatToParts(date)) {
    parts[type] = value;
  }

  return {
    weekdayName: parts.weekday,
    year: Number(parts.year),
    month: Number(parts.month),
    day: Number(parts.day),
    hour: Number(parts.hour),
    minute: Number(parts.minute),
    second: Number(parts.second),
  };
}

// Today's ISO weekday in Baku
export function bakuWeekday(now: Date = new Date()) {
  const { weekdayName } = zonedParts(now);
  return WEEKDAYS.find((weekday) => weekday.long === weekdayName)?.value ?? 1;
}

// The next lesson as a real instant, or null when the class has no schedule.
// A lesson still counts as "next" for graceMinutes after it starts, so a
// student who opens the app a few minutes late sees today's lesson and not
// next week's.
export function getNextLesson(
  slots: readonly ScheduleSlot[],
  now: Date = new Date(),
  graceMinutes = 60,
): Date | null {
  if (slots.length === 0) return null;

  const local = zonedParts(now);

  // How far Baku is ahead of UTC right now. Read from the time zone data
  // and not hard-coded, in case the offset ever changes.
  const offset =
    Date.UTC(
      local.year,
      local.month - 1,
      local.day,
      local.hour,
      local.minute,
      local.second,
    ) -
    Math.floor(now.getTime() / 1000) * 1000;

  const earliest = now.getTime() - graceMinutes * 60_000;

  // Today plus the next seven days always contains every weekday
  for (let ahead = 0; ahead <= 7; ahead += 1) {
    // Date.UTC rolls an overflowing day into the next month or year
    const midnight = Date.UTC(local.year, local.month - 1, local.day + ahead);
    const weekday = new Date(midnight).getUTCDay() || 7;
    const slot = slots.find((item) => item.day === weekday);

    if (!slot) continue;

    const [hours, minutes] = slot.time.split(':').map(Number);
    const start = midnight + (hours * 60 + minutes) * 60_000 - offset;

    if (start >= earliest) return new Date(start);
  }

  return null;
}

// "Monday 12 Oct, 22:00"
export function formatLessonDate(date: Date) {
  const { weekdayName, day, hour, minute } = zonedParts(date);
  const time = `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;

  return `${weekdayName} ${day} ${monthFormat.format(date)}, ${time}`;
}
