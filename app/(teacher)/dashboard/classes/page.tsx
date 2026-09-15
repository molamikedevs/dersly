import { BookOpen } from 'lucide-react';

import DataRenderer from '@/components/common/data-renderer';
import FormDialog from '@/components/common/form-dialog';
import PageHeader from '@/components/common/page-header';
import AddClassForm from '@/features/classes/components/add-class-form';
import ClassMenu from '@/features/classes/components/class-menu';
import ClassSection from '@/features/classes/components/class-section';
import { getGroupedClasses } from '@/features/classes/queries';
import { RouteParams } from '@/types/global';

export default async function Page({ searchParams }: RouteParams) {
  const { page, pageSize } = await searchParams;

  const { data, success, error } = await getGroupedClasses({
    page: Number(page) || 1,
    pageSize: Number(pageSize) || 20,
  });

  const { groups = [], private: privateClasses = [] } = data || {};

  return (
    <div className="pb-16">
      <div className="flex items-center justify-between gap-4">
        <PageHeader title="Classes" subText="class categories" />

        <FormDialog triggerLabel="Add Class" title="New class">
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
          <>
            {groups.length > 0 && (
              <ClassSection
                title="Groups & clubs"
                meta={`${groups.length} classes`}
                classes={groups}
                rowAction={(item) => <ClassMenu data={item} />}
              />
            )}
            {privateClasses.length > 0 && (
              <ClassSection
                title="One to one"
                meta={`${privateClasses.length} students`}
                classes={privateClasses}
                rowAction={(item) => <ClassMenu data={item} />}
              />
            )}
          </>
        )}
      />
    </div>
  );
}
