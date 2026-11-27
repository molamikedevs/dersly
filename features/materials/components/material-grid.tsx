import type { ComponentProps } from 'react';

import DataRenderer from '@/components/common/data-renderer';
import MaterialCard from '@/features/materials/components/material-card';
import ReadingRow from '@/features/materials/components/reading-row';
import type { MaterialKind } from '@/lib/utils';
import type { MaterialRecord } from '@/types/materials';

type Props = {
  kind: MaterialKind;
  materials: MaterialRecord[] | undefined;
  editable?: boolean;
  wide?: boolean;
  empty: ComponentProps<typeof DataRenderer>['empty'];
  success?: boolean;
  error?: ComponentProps<typeof DataRenderer>['error'];
};

export default function MaterialGrid({
  kind,
  materials,
  editable = false,
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
      render={(items) => (
        <ul className="surface-card flex flex-col overflow-hidden">
          {items.map((item) =>
            kind === 'article' ? (
              <ReadingRow key={item.id} data={item} editable={editable} />
            ) : (
              <MaterialCard key={item.id} data={item} editable={editable} />
            ),
          )}
        </ul>
      )}
    />
  );
}
