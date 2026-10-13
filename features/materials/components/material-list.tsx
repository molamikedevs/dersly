import type { ComponentProps } from 'react';

import DataRenderer from '@/components/common/data-renderer';
import Pagination from '@/components/common/pagination';
import MaterialGrid from '@/features/materials/components/material-grid';
import { getMaterials } from '@/features/materials/queries';
import type { MaterialKind } from '@/lib/utils';

type Props = {
  kind: MaterialKind;
  page: number;
  pageSize: number;
  filter?: string;
  editable?: boolean;
  wide?: boolean;
  empty: ComponentProps<typeof DataRenderer>['empty'];
};

// Fetches one page of materials and hands it to MaterialGrid
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
      <MaterialGrid
        kind={kind}
        materials={data?.materials}
        editable={editable}
        wide={wide}
        empty={empty}
        success={success}
        error={error}
      />

      <Pagination isNext={data?.isNext ?? false} />
    </>
  );
}
