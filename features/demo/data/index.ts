import { buildClasses, DEMO_ENROLLMENTS } from './classes';
import { DEMO_HOMEWORK } from './homework';
import { DEMO_NOTES } from './lesson-notes';
import { DEMO_MATERIALS } from './materials';
import { DEMO_STUDENTS, DEMO_TEACHER, DEMO_VIEWER_ID } from './people';

const HOUR = 3_600_000;
const DAY = 24 * HOUR;

// 'YYYY-MM-DD' in Baku, `daysAgo` days before `now`
const BAKU_DATE = new Intl.DateTimeFormat('en-CA', {
  timeZone: 'Asia/Baku',
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
});

function bakuDate(now: number, daysAgo: number) {
  return BAKU_DATE.format(new Date(now - daysAgo * DAY));
}

function iso(now: number, msAgo: number) {
  return new Date(now - msAgo).toISOString();
}

export function createDemoData(now: number): DemoData {
  return {
    now,
    teacher: { ...DEMO_TEACHER, avatarUrl: null },
    viewerId: DEMO_VIEWER_ID,
    viewerAvatarUrl: null,

    students: DEMO_STUDENTS.map(({ seenHoursAgo, ...person }) => ({
      ...person,
      lastSeenAt: seenHoursAgo === null ? null : iso(now, seenHoursAgo * HOUR),
    })),

    classes: buildClasses(new Date(now)),

    enrollments: DEMO_ENROLLMENTS.map((item) => ({
      ...item,
      joinedAt: iso(now, item.joinedDaysAgo * DAY),
    })),

    homework: DEMO_HOMEWORK.map(({ postedDaysAgo, ...work }) => ({
      ...work,
      instructions: null,
      attachmentPath: null,
      attachmentName: null,
      dueDate: null,
      isPublished: true,
      createdAt: iso(now, postedDaysAgo * DAY + 2 * HOUR),
    })),

    notes: DEMO_NOTES.map(({ daysAgo, ...note }) => ({
      ...note,
      lessonDate: bakuDate(now, daysAgo),
    })),

    materials: DEMO_MATERIALS.map(({ uploadedDaysAgo, ...item }) => ({
      ...item,
      uploadedAt: iso(now, uploadedDaysAgo * DAY),
    })),

    // The viewer took the test once, a month ago
    attempts: [
      {
        score: 7,
        total: 12,
        level: 'intermediate',
        takenAt: iso(now, 30 * DAY),
      },
    ],
  };
}
