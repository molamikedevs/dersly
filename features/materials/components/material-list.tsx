import type { ComponentProps } from 'react';

import DataRenderer from '@/components/common/data-renderer';
import Pagination from '@/components/common/pagination';
import MaterialCard from '@/features/materials/components/material-card';
import ReadingRow from '@/features/materials/components/reading-row';
import { getMaterials } from '@/features/materials/queries';
import type { MaterialKind } from '@/lib/utils';
import { cn } from '@/lib/utils';

type Props = {
  kind: MaterialKind;
  page: number;
  pageSize: number;
  filter?: string;
  editable?: boolean;
  wide?: boolean;
  empty: ComponentProps<typeof DataRenderer>['empty'];
};

export default async function MaterialList({
  kind,
  page,
  pageSize,
  filter,
  editable = false,
  wide = false,
  empty,
}: Props) {
  const { data, success, error } = await getMaterials(
    { page, pageSize, filter },
    kind,
  );

  return (
    <>
      <DataRenderer
        success={success}
        error={error}
        data={data?.materials}
        empty={empty}
        render={(materials) =>
          kind === 'article' ? (
            <ul className="flex flex-col divide-y divide-border rounded-2xl border border-border bg-card px-5">
              {materials.map((item) => (
                <ReadingRow key={item.id} data={item} editable={editable} />
              ))}
            </ul>
          ) : (
            <div
              className={cn(
                'grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3',
                wide && 'xl:grid-cols-4',
              )}
            >
              {materials.map((item) => (
                <MaterialCard key={item.id} data={item} editable={editable} />
              ))}
            </div>
          )
        }
      />

      <Pagination isNext={data?.isNext ?? false} />
    </>
  );
}
