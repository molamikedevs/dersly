'use client';

import { useRouter } from 'next/navigation';
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';

import {
  ActionsProvider,
  type DerslyActions,
} from '@/features/app/actions-context';
import { AppModeProvider, type DemoSide } from '@/features/app/app-mode';
import { LESSONS_PER_PACKAGE } from '@/features/classes/constants';
import { createDemoData } from '@/features/demo/data/index';
import { scoreDemoTest } from '@/features/demo/data/level-test';
import { toScheduleColumns } from '@/lib/schedule';
import { generateInviteCode } from '@/lib/utils';
import { ClassSchema, type ClassValues } from '@/lib/validation/class.schema';

// Everything the demo shows lives here, in memory. Nothing is sent anywhere,
// and a reload starts again from the same invented data.

type Store = {
  data: DemoData;
  // The latest data, read by actions that run between renders
  read: () => DemoData;
  write: (next: DemoData) => void;
};

const StoreContext = createContext<Store | null>(null);

export function DemoStoreProvider({
  now,
  children,
}: {
  // Passed down from the server, so both sides build identical data
  now: number;
  children: ReactNode;
}) {
  const [data, setData] = useState(() => createDemoData(now));
  const latest = useRef(data);

  const read = useCallback(() => latest.current, []);
  const write = useCallback((next: DemoData) => {
    latest.current = next;
    setData(next);
  }, []);

  const value = useMemo(() => ({ data, read, write }), [data, read, write]);

  return (
    <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
  );
}

function useStore() {
  const store = useContext(StoreContext);
  if (!store) throw new Error('useDemoData must be used inside the demo.');
  return store;
}

export function useDemoData() {
  return useStore().data;
}

// A short pause, so buttons show their saving state as they do for real
function settle() {
  return new Promise((resolve) => setTimeout(resolve, 350));
}

function ok<T>(data: T) {
  return { success: true as const, data };
}

function fail(message: string) {
  return { success: false as const, error: { message } };
}

// The columns a class form sets, in the shape the classes query returns
function classFields({ name, type, level, schedule, meetingUrl }: ClassValues) {
  const columns = toScheduleColumns(schedule);

  return {
    name,
    type,
    level: level ?? null,
    meetingUrl: meetingUrl || null,
    handlesPayment: type === 'one_to_one',
    scheduleDays: columns.schedule_days,
    scheduleTimes: columns.schedule_times,
  };
}

// The same message the real action shows for a value the schema rejects
function firstIssue(error: { issues: { message: string }[] }) {
  return error.issues[0]?.message ?? 'Check the class details and try again.';
}

const BAKU_DATE = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Baku' });

function buildActions(
  side: DemoSide,
  read: () => DemoData,
  write: (next: DemoData) => void,
  goToLogin: () => void,
): DerslyActions {
  return {
    async createClass(values) {
      await settle();
      const parsed = ClassSchema.safeParse(values);
      if (!parsed.success) return fail(firstIssue(parsed.error));

      const data = read();
      const item: ClassRecord = {
        id: crypto.randomUUID(),
        teacherId: data.teacher.id,
        inviteCode: generateInviteCode(),
        isActive: true,
        enrollmentOpen: true,
        createdAt: new Date().toISOString(),
        ...classFields(parsed.data),
      };

      write({ ...data, classes: [...data.classes, item] });
      return ok(item);
    },

    async updateClass(id, values) {
      await settle();
      const parsed = ClassSchema.safeParse(values);
      if (!parsed.success) return fail(firstIssue(parsed.error));

      const data = read();
      const current = data.classes.find((item) => item.id === id);
      if (!current) return fail('This class no longer exists.');

      const updated = { ...current, ...classFields(parsed.data) };

      write({
        ...data,
        classes: data.classes.map((item) => (item.id === id ? updated : item)),
      });

      return ok(updated);
    },

    async archiveClass(id) {
      await settle();
      const data = read();

      write({
        ...data,
        classes: data.classes.filter((item) => item.id !== id),
      });

      return ok(null);
    },

    async markLesson({ enrollmentId, note, lessonDate }) {
      await settle();
      const data = read();
      const enrollment = data.enrollments.find((e) => e.id === enrollmentId);

      if (!enrollment) return fail('This student is no longer in the class.');
      if (enrollment.lessonsDone >= LESSONS_PER_PACKAGE) {
        return fail('This package is complete. Start a new one first.');
      }

      const lessonsDone = enrollment.lessonsDone + 1;

      write({
        ...data,
        enrollments: data.enrollments.map((item) =>
          item.id === enrollmentId ? { ...item, lessonsDone } : item,
        ),
        notes: note
          ? [
              {
                id: crypto.randomUUID(),
                enrollmentId,
                lessonDate: lessonDate ?? BAKU_DATE.format(new Date()),
                note,
              },
              ...data.notes,
            ]
          : data.notes,
      });

      return ok({ lessonsDone });
    },

    async undoLesson({ enrollmentId }) {
      await settle();
      const data = read();
      const enrollment = data.enrollments.find((e) => e.id === enrollmentId);
      if (!enrollment) return fail('This student is no longer in the class.');

      const lessonsDone = Math.max(0, enrollment.lessonsDone - 1);

      write({
        ...data,
        enrollments: data.enrollments.map((item) =>
          item.id === enrollmentId ? { ...item, lessonsDone } : item,
        ),
      });

      return ok({ lessonsDone });
    },

    async resetPackage({ enrollmentId }) {
      await settle();
      const data = read();

      write({
        ...data,
        enrollments: data.enrollments.map((item) =>
          item.id === enrollmentId ? { ...item, lessonsDone: 0 } : item,
        ),
      });

      return ok(null);
    },

    async createHomework({ classId, title, content }) {
      await settle();
      const data = read();
      const owner = data.classes.find((item) => item.id === classId);

      const work: HomeWorkRecord = {
        id: crypto.randomUUID(),
        classId,
        title,
        instructions: null,
        content: content || null,
        attachmentPath: null,
        attachmentName: null,
        dueDate: null,
        isPublished: true,
        createdAt: new Date().toISOString(),
        classes: owner
          ? { id: owner.id, name: owner.name, type: owner.type }
          : null,
      };

      write({ ...data, homework: [work, ...data.homework] });
      return ok(work);
    },

    async updateHomework(id, { title, content }) {
      await settle();
      const data = read();
      const current = data.homework.find((work) => work.id === id);
      if (!current) return fail('This homework no longer exists.');

      const updated = { ...current, title, content: content || null };

      write({
        ...data,
        homework: data.homework.map((work) =>
          work.id === id ? updated : work,
        ),
      });

      return ok(updated);
    },

    async deleteHomework(id) {
      await settle();
      const data = read();
      write({
        ...data,
        homework: data.homework.filter((work) => work.id !== id),
      });
      return ok(null);
    },

    async createMaterial(values) {
      await settle();
      const data = read();

      const item = {
        id: crypto.randomUUID(),
        classId: null,
        kind: values.kind,
        title: values.title,
        description: values.description || null,
        level: values.level ?? null,
        url: values.kind === 'guide' ? null : (values.url ?? null),
        content: values.kind === 'guide' ? (values.content ?? null) : null,
        uploadedAt: new Date().toISOString(),
      };

      write({ ...data, materials: [item, ...data.materials] });
      return ok(item);
    },

    async updateMaterial(id, values) {
      await settle();
      const data = read();
      const current = data.materials.find((item) => item.id === id);
      if (!current) return fail('This material no longer exists.');

      const updated = {
        ...current,
        kind: values.kind,
        title: values.title,
        description: values.description || null,
        level: values.level ?? null,
        url: values.kind === 'guide' ? null : (values.url ?? null),
        content: values.kind === 'guide' ? (values.content ?? null) : null,
      };

      write({
        ...data,
        materials: data.materials.map((item) =>
          item.id === id ? updated : item,
        ),
      });

      return ok(updated);
    },

    async deleteMaterial(id) {
      await settle();
      const data = read();
      write({
        ...data,
        materials: data.materials.filter((item) => item.id !== id),
      });
      return ok(null);
    },

    async submitAttempt({ answers }) {
      await settle();
      const data = read();
      const result = scoreDemoTest(answers);

      write({
        ...data,
        attempts: [
          { ...result, takenAt: new Date().toISOString() },
          ...data.attempts,
        ],
        students: data.students.map((person) =>
          person.id === data.viewerId
            ? { ...person, level: result.level }
            : person,
        ),
      });

      return ok(result) as Awaited<ReturnType<DerslyActions['submitAttempt']>>;
    },

    async updateAvatar({ file }) {
      await settle();
      const data = read();
      // A local preview only: the photo never leaves the browser
      const avatarUrl = URL.createObjectURL(file);

      write(
        side === 'teacher'
          ? { ...data, teacher: { ...data.teacher, avatarUrl } }
          : { ...data, viewerAvatarUrl: avatarUrl },
      );

      return ok({ avatarUrl });
    },

    async changePassword() {
      return { error: 'Passwords cannot be changed in the demo.' };
    },

    async deleteAccount() {
      return { error: 'Demo accounts cannot be deleted.' };
    },

    async signOut() {
      goToLogin();
    },
  };
}

// Wraps one side of the demo: its links stay under /demo/<side>, and every
// action saves to the store above instead of the database
export function DemoSideProvider({
  side,
  children,
}: {
  side: DemoSide;
  children: ReactNode;
}) {
  const { read, write } = useStore();
  const router = useRouter();

  const actions = useMemo(
    () => buildActions(side, read, write, () => router.push('/login')),
    [side, read, write, router],
  );

  return (
    <AppModeProvider side={side}>
      <ActionsProvider actions={actions}>{children}</ActionsProvider>
    </AppModeProvider>
  );
}
