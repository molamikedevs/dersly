import { bakuWeekday } from '@/lib/schedule';

import { ID } from './ids';

export type DemoEnrollment = {
  id: string;
  classId: string;
  studentId: string;
  lessonsDone: number;
  joinedDaysAgo: number;
};

const BAKU_HOUR = new Intl.DateTimeFormat('en-GB', {
  timeZone: 'Asia/Baku',
  hour: '2-digit',
  hourCycle: 'h23',
});

function bakuHour(now: Date) {
  return Number(BAKU_HOUR.format(now));
}

// ISO weekday `ahead` days from today, 1 Monday to 7 Sunday
function weekdayFrom(today: number, ahead: number) {
  return ((today - 1 + ahead) % 7) + 1;
}

function time(hour: number, minute = 0) {
  return `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}:00`;
}

// Days and times in the same order, sorted by day, as the database keeps them
function schedule(slots: [number, string][]) {
  const sorted = [...slots].sort((a, b) => a[0] - b[0]);
  return {
    scheduleDays: sorted.map(([day]) => day),
    scheduleTimes: sorted.map(([, at]) => at),
  };
}

type DemoClass = ClassRecord;

// Built around the moment the demo opens, so there is always a lesson on
// now and one more today, whatever the day and hour
export function buildClasses(now: Date): DemoClass[] {
  const today = bakuWeekday(now);
  const hour = bakuHour(now);
  const laterToday = hour <= 21 ? hour + 2 : hour - 4;

  const base = {
    teacherId: ID.teacher,
    isActive: true,
    createdAt: new Date(now.getTime() - 120 * 86_400_000).toISOString(),
  };

  return [
    {
      ...base,
      id: ID.class(1),
      name: 'Evening Conversation Club',
      type: 'conversation',
      level: 'intermediate',
      meetingUrl: 'https://meet.google.com/demo-club',
      inviteCode: 'K7QX2M',
      handlesPayment: false,
      enrollmentOpen: true,
      // On now: it started at the top of this hour
      ...schedule([
        [today, time(hour)],
        [weekdayFrom(today, 3), time(19)],
      ]),
    },
    {
      ...base,
      id: ID.class(2),
      name: 'A2 Weekend Course',
      type: 'course',
      level: 'elementary',
      meetingUrl: 'https://meet.google.com/demo-course',
      inviteCode: 'R4PT8N',
      handlesPayment: false,
      enrollmentOpen: true,
      ...schedule([
        [6, time(11)],
        [7, time(11)],
      ]),
    },
    {
      ...base,
      id: ID.class(3),
      name: 'Murad Hüseynov',
      type: 'one_to_one',
      level: 'elementary',
      meetingUrl: 'https://meet.google.com/demo-murad',
      inviteCode: 'M2HD6V',
      handlesPayment: true,
      enrollmentOpen: false,
      // Later today
      ...schedule([
        [today, time(laterToday, 30)],
        [weekdayFrom(today, 4), time(18, 30)],
      ]),
    },
    {
      ...base,
      id: ID.class(4),
      name: 'Sabina Rzayeva',
      type: 'one_to_one',
      level: 'advanced',
      meetingUrl: 'https://meet.google.com/demo-sabina',
      inviteCode: 'S9WK3L',
      handlesPayment: true,
      enrollmentOpen: false,
      ...schedule([
        [weekdayFrom(today, 2), time(17)],
        [weekdayFrom(today, 5), time(17)],
      ]),
    },
  ];
}

// Who is in which class. Murad is one lesson from the end of his package,
// Sabina has finished hers.
export const DEMO_ENROLLMENTS: DemoEnrollment[] = [
  {
    id: ID.enrollment(1),
    classId: ID.class(1),
    studentId: ID.student(1),
    lessonsDone: 0,
    joinedDaysAgo: 64,
  },
  {
    id: ID.enrollment(2),
    classId: ID.class(1),
    studentId: ID.student(6),
    lessonsDone: 0,
    joinedDaysAgo: 40,
  },
  {
    id: ID.enrollment(3),
    classId: ID.class(1),
    studentId: ID.student(7),
    lessonsDone: 0,
    joinedDaysAgo: 21,
  },
  {
    id: ID.enrollment(4),
    classId: ID.class(2),
    studentId: ID.student(5),
    lessonsDone: 0,
    joinedDaysAgo: 90,
  },
  {
    id: ID.enrollment(5),
    classId: ID.class(2),
    studentId: ID.student(3),
    lessonsDone: 0,
    joinedDaysAgo: 33,
  },
  {
    id: ID.enrollment(6),
    classId: ID.class(2),
    studentId: ID.student(8),
    lessonsDone: 0,
    joinedDaysAgo: 2,
  },
  {
    id: ID.enrollment(7),
    classId: ID.class(3),
    studentId: ID.student(2),
    lessonsDone: 7,
    joinedDaysAgo: 75,
  },
  {
    id: ID.enrollment(8),
    classId: ID.class(4),
    studentId: ID.student(4),
    lessonsDone: 8,
    joinedDaysAgo: 110,
  },
];
