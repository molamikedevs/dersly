import type { ComponentProps } from 'react';

import DataRenderer from '@/components/common/data-renderer';
import MaterialCard from '@/features/materials/components/material-card';
import ReadingRow from '@/features/materials/components/reading-row';
import type { MaterialKind } from '@/lib/utils';
import { cn } from '@/lib/utils';
import type { MaterialRecord } from '@/types/materials';

// One page of materials, without the fetching. Reading is a list of links,
// videos and guides are cards. MaterialList fetches and renders this, the
// demo passes it invented materials.

type Props = {
  kind: MaterialKind;
  materials: MaterialRecord[] | undefined;
  editable?: boolean;
  wide?: boolean;
  empty: ComponentProps<typeof DataRenderer>['empty'];
  // From the query. The demo leaves these out.
  success?: boolean;
  error?: ComponentProps<typeof DataRenderer>['error'];
};

export default function MaterialGrid({
  kind,
  materials,
  editable = false,
  wide = false,
  empty,
  success = true,
  error,
}: Props) {
  return (
    <DataRenderer
      success={success}
      error={error}
      data={materials}
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
  );
}
