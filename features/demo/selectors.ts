import { classSlots, formatSchedule } from '@/lib/schedule';

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
