import { classSlots, formatSchedule, getNextLesson } from '@/lib/schedule';

// The demo data, shaped the way the real queries return it, so the real
// components can show it without knowing where it came from.

const byNewest = (a: { createdAt: string }, b: { createdAt: string }) =>
  b.createdAt.localeCompare(a.createdAt);

function enrollmentsIn(data: DemoData, classId: string) {
  return data.enrollments.filter((item) => item.classId === classId);
}

// Every class with its student count. One-to-one classes also carry the
// lesson package, as getGroupedClasses returns them.
export function groupedClasses(data: DemoData) {
  const groups: ClassWithCount[] = [];
  const oneToOne: PrivateClass[] = [];

  for (const item of data.classes) {
    const joined = enrollmentsIn(data, item.id);
    const withCount = { ...item, studentCount: joined.length };

    if (item.type === 'one_to_one') {
      oneToOne.push({
        ...withCount,
        enrollmentId: joined[0]?.id ?? null,
        lessonsDone: joined[0]?.lessonsDone ?? 0,
      });
    } else {
      groups.push(withCount);
    }
  }

  return { groups, oneToOne };
}

// One class, and its lesson package when it is one-to-one
export function findClass(data: DemoData, classId: string) {
  const { groups, oneToOne } = groupedClasses(data);
  const privateClass = oneToOne.find((item) => item.id === classId) ?? null;
  const item = privateClass ?? groups.find((c) => c.id === classId) ?? null;

  return { item, privateClass };
}

// Homework with its class attached, newest first
export function homeworkFor(data: DemoData, classId?: string) {
  return data.homework
    .filter((work) => !classId || work.classId === classId)
    .map((work) => {
      const owner = data.classes.find((item) => item.id === work.classId);
      return {
        ...work,
        classes: owner
          ? { id: owner.id, name: owner.name, type: owner.type }
          : null,
      };
    })
    .sort(byNewest);
}

export function findHomework(data: DemoData, id: string) {
  return homeworkFor(data).find((work) => work.id === id) ?? null;
}

// Classes with at least one piece of homework
export function classIdsWithHomework(data: DemoData) {
  return new Set(data.homework.map((work) => work.classId));
}

// Enrolments as the students query returns them, newest first
export function studentRecords(
  data: DemoData,
  classId?: string,
): StudentRecord[] {
  return data.enrollments
    .filter((item) => !classId || item.classId === classId)
    .flatMap((item) => {
      const person = data.students.find((s) => s.id === item.studentId);
      const owner = data.classes.find((c) => c.id === item.classId);
      if (!person || !owner) return [];

      return [
        {
          joinedAt: item.joinedAt,
          student: {
            id: person.id,
            fullName: person.fullName,
            email: person.email,
            level: person.level,
            lastSeenAt: person.lastSeenAt,
          },
          class: {
            id: owner.id,
            name: owner.name,
            type: owner.type,
            schedule: formatSchedule(classSlots(owner)),
          },
        } as StudentRecord,
      ];
    })
    .sort((a, b) => b.joinedAt.localeCompare(a.joinedAt));
}

// Classes with their homework, the class with the newest work first, as
// getGroupedHomework returns them
export function homeworkGroups(data: DemoData): HomeWorkGroup[] {
  const groups = new Map<string, HomeWorkGroup>();

  for (const work of homeworkFor(data)) {
    if (!work.classes) continue;
    const group = groups.get(work.classId) ?? {
      id: work.classId,
      name: work.classes.name,
      items: [],
    };
    group.items.push(work);
    groups.set(work.classId, group);
  }

  return [...groups.values()];
}

// Shared materials of one kind, newest first, optionally at one level
export function materialsOf(data: DemoData, kind: string, level?: string) {
  return data.materials
    .filter((item) => item.kind === kind && (!level || item.level === level))
    .sort((a, b) => b.uploadedAt.localeCompare(a.uploadedAt));
}

export function findMaterial(data: DemoData, id: string) {
  return data.materials.find((item) => item.id === id) ?? null;
}

// ---- The student side: everything below is seen as the viewer ----

// Where the demo keeps level test answers in progress. Cleared each time the
// student side opens, so a reload starts the test fresh.
export const DEMO_TEST_KEY = 'dersly-demo-level-test';

export function viewer(data: DemoData) {
  const person = data.students.find((s) => s.id === data.viewerId)!;
  return { ...person, avatarUrl: data.viewerAvatarUrl };
}

// The viewer's classes, oldest enrolment first, as getStudentClasses does
export function viewerClasses(data: DemoData) {
  return data.enrollments
    .filter((item) => item.studentId === data.viewerId)
    .sort((a, b) => a.joinedAt.localeCompare(b.joinedAt))
    .flatMap((item) => {
      const owner = data.classes.find((c) => c.id === item.classId);
      if (!owner) return [];

      return [
        {
          ...owner,
          enrollment: item,
          schedule: formatSchedule(classSlots(owner)),
        },
      ];
    });
}

// The viewer's homework, newest first. lessonAt is the first lesson after the
// work was posted, as the homework query works it out.
export function viewerHomework(data: DemoData) {
  const [first] = viewerClasses(data);
  if (!first) return [];

  return homeworkFor(data, first.id).map((work) => ({
    ...work,
    lessonAt:
      getNextLesson(
        classSlots(first),
        new Date(work.createdAt),
        0,
      )?.toISOString() ?? null,
  }));
}

export function viewerHome(data: DemoData): StudentHome | null {
  const person = viewer(data);
  const [first] = viewerClasses(data);
  if (!first) return null;

  const [latest] = homeworkFor(data, first.id);
  const shared = data.materials
    .filter((item) => item.classId === null)
    .sort((a, b) => b.uploadedAt.localeCompare(a.uploadedAt));

  return {
    firstName: person.fullName.trim().split(/\s+/)[0],
    studentLevel: person.level,
    enrolment: {
      classId: first.id,
      className: first.name,
      type: first.type,
      level: first.level,
      schedule: first.schedule,
      nextLessonAt:
        getNextLesson(classSlots(first), new Date(data.now))?.toISOString() ??
        null,
      meetingUrl: first.meetingUrl,
      lessonsDone: first.enrollment.lessonsDone,
    },
    lessonNotes: data.notes
      .filter((note) => note.enrollmentId === first.enrollment.id)
      .sort((a, b) => b.lessonDate.localeCompare(a.lessonDate))
      .slice(0, 5)
      .map(({ id, lessonDate, note }) => ({ id, lessonDate, note })),
    current: latest
      ? {
          id: latest.id,
          title: latest.title,
          instructions: latest.instructions,
          attachmentName: latest.attachmentName,
          signedUrl: null,
          downloadUrl: null,
          hasGuide: Boolean(latest.content),
        }
      : null,
    materials: shared
      .filter((item) => item.kind !== 'article')
      .slice(0, 5)
      .map(({ id, title, kind, level, url }) => ({
        id,
        title,
        kind,
        level,
        url,
      })),
    reading: shared
      .filter((item) => item.kind === 'article')
      .slice(0, 5)
      .map(({ id, title, url }) => ({ id, title, url })),
  };
}
