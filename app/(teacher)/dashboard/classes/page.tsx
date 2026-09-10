import { BookOpen } from 'lucide-react';

import DataRenderer from '@/components/common/data-renderer';
import AddClass from '@/features/classes/components/add-class';
import ClassSection from '@/features/classes/components/class-section';
import { mockClasses } from '@/features/classes/mock';

export default function Page() {
  const result: { success: true; data: ClassRecordParams[] } = {
    success: true,
    data: mockClasses as ClassRecordParams[],
  };

  const groups = result.data.filter((item) => item.type !== 'one_to_one');
  const private_ = result.data.filter((item) => item.type === 'one_to_one');

  return (
    <div>
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-foreground">
            Classes
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {result.data.length} classes · {groups.length} groups,{' '}
            {private_.length} one to one
          </p>
        </div>

        <AddClass />
      </div>

      <DataRenderer
        success={result.success}
        data={result.data}
        empty={{
          icon: BookOpen,
          title: 'No classes yet',
          message:
            'Create your first class and share the invite code with your students.',
          button: { text: 'New class', href: '/dashboard/classes/new' },
        }}
        render={(classes) => (
          <>
            <ClassSection
              title="Groups & clubs"
              meta={`${groups.length} classes`}
              classes={classes.filter((item) => item.type !== 'one_to_one')}
            />
            <ClassSection
              title="One to one"
              meta={`${private_.length} students`}
              classes={classes.filter((item) => item.type === 'one_to_one')}
            />
          </>
        )}
      />
    </div>
  );
}
