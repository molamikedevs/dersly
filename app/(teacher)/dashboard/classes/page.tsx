import { BookOpen } from 'lucide-react';

import DataRenderer from '@/components/common/data-renderer';
import FormDialog from '@/components/common/form-dialog';
import PageHeader from '@/components/common/page-header';
import AddClassForm from '@/features/classes/components/add-class-form';
import ClassMenu from '@/features/classes/components/class-menu';
import ClassSection from '@/features/classes/components/class-section';
import LessonTracker from '@/features/classes/components/lesson-tracker';
import { studentCountLabel } from '@/features/classes/constants/index';
import { getGroupedClasses } from '@/features/classes/queries';
import { SCHEDULE_TIME_ZONE, bakuWeekday, classSlots } from '@/lib/schedule';
import { RouteParams } from '@/types/global';

export const metadata = { title: 'Classes' };

type AnyClass = ClassWithCount | PrivateClass;

const todayLabel = new Intl.DateTimeFormat('en-GB', {
  weekday: 'long',
  day: 'numeric',
  month: 'short',
  timeZone: SCHEDULE_TIME_ZONE,
});

function byLessonsDone(a: PrivateClass, b: PrivateClass) {
  const joined =
    Number(Boolean(b.enrollmentId)) - Number(Boolean(a.enrollmentId));
  return joined || b.lessonsDone - a.lessonsDone;
}

function isPrivate(item: AnyClass): item is PrivateClass {
  return 'lessonsDone' in item;
}

// One-to-one rows show the lesson strip, group rows show the student count
function rowAside(item: AnyClass) {
  if (isPrivate(item)) {
    return (
      <LessonTracker
        name={item.name}
        enrollmentId={item.enrollmentId}
        lessonsDone={item.lessonsDone}
        inviteCode={item.enrollmentOpen ? item.inviteCode : null}
      />
    );
  }

  return (
    <p className="text-sm text-muted-foreground tabular-nums sm:text-right">
      {studentCountLabel(item.studentCount)}
    </p>
  );
}

export default async function Page({ searchParams }: RouteParams) {
  const { page, pageSize } = await searchParams;

  const { data, success, error } = await getGroupedClasses({
    page: Number(page) || 1,
    pageSize: Number(pageSize) || 20,
  });

  const { groups = [], private: privateClasses = [] } = data || {};
  const oneToOne = [...privateClasses].sort(byLessonsDone);
  const all: AnyClass[] = [...oneToOne, ...groups];

  // Classes with a lesson today in Baku, earliest first
  const weekday = bakuWeekday();
  const todayTime = new Map<string, string>();

  for (const item of all) {
    const slot = classSlots(item).find((entry) => entry.day === weekday);
    if (slot) todayTime.set(item.id, slot.time);
  }

  const today = all
    .filter((item) => todayTime.has(item.id))
    .sort((a, b) => todayTime.get(a.id)!.localeCompare(todayTime.get(b.id)!));

  return (
    <div className="flex w-full max-w-6xl min-w-0 flex-col gap-10 pb-16">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <PageHeader
          title="Classes"
          subText="Groups, clubs and one-to-one students."
        />

        <FormDialog triggerLabel="Add class" title="New class">
          <AddClassForm />
        </FormDialog>
      </div>

      <DataRenderer
        success={success}
        error={error}
        data={all}
        empty={{
          icon: BookOpen,
          title: 'No classes yet',
          message:
            'Create your first class and share the invite code with your students.',
          action: (
            <div className="mt-6">
              <FormDialog triggerLabel="New class" title="New class">
                <AddClassForm />
              </FormDialog>
            </div>
          ),
        }}
        render={() => (
          <div className="flex flex-col gap-10">
            {today.length > 0 && (
              <ClassSection
                title="Today"
                meta={todayLabel.format(new Date())}
                classes={today}
                rowSchedule={(item) => `Today, ${todayTime.get(item.id)}`}
                rowAside={rowAside}
                rowMenu={(item) => <ClassMenu data={item} />}
              />
            )}
            {oneToOne.length > 0 && (
              <ClassSection
                title="One to one"
                meta={`${oneToOne.length} ${oneToOne.length === 1 ? 'student' : 'students'}`}
                classes={oneToOne}
                rowAside={rowAside}
                rowMenu={(item) => <ClassMenu data={item} />}
              />
            )}
            {groups.length > 0 && (
              <ClassSection
                title="Groups & clubs"
                meta={`${groups.length} ${groups.length === 1 ? 'class' : 'classes'}`}
                classes={groups}
                rowAside={rowAside}
                rowMenu={(item) => <ClassMenu data={item} />}
              />
            )}
          </div>
        )}
      />
    </div>
  );
}
