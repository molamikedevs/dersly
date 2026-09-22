import { BookOpen } from 'lucide-react';

import DataRenderer from '@/components/common/data-renderer';
import FormDialog from '@/components/common/form-dialog';
import PageHeader from '@/components/common/page-header';
import AddClassForm from '@/features/classes/components/add-class-form';
import ClassMenu from '@/features/classes/components/class-menu';
import ClassSection from '@/features/classes/components/class-section';
import { getGroupedClasses } from '@/features/classes/queries';
import { RouteParams } from '@/types/global';

export const metadata = { title: 'Classes' };

export default async function Page({ searchParams }: RouteParams) {
  const { page, pageSize } = await searchParams;

  const { data, success, error } = await getGroupedClasses({
    page: Number(page) || 1,
    pageSize: Number(pageSize) || 20,
  });

  const { groups = [], private: privateClasses = [] } = data || {};

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
        data={[...groups, ...privateClasses]}
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
            {groups.length > 0 && (
              <ClassSection
                title="Groups & clubs"
                meta={`${groups.length} ${groups.length === 1 ? 'class' : 'classes'}`}
                classes={groups}
                rowAction={(item) => <ClassMenu data={item} />}
              />
            )}
            {privateClasses.length > 0 && (
              <ClassSection
                title="One to one"
                meta={`${privateClasses.length} ${privateClasses.length === 1 ? 'student' : 'students'}`}
                classes={privateClasses}
                rowAction={(item) => <ClassMenu data={item} />}
              />
            )}
          </div>
        )}
      />
    </div>
  );
}
