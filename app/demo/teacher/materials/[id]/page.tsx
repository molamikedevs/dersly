'use client';

import { notFound } from 'next/navigation';
import { use } from 'react';

import { useDemoData } from '@/features/demo/components/store';
import { findMaterial } from '@/features/demo/selectors';
import MaterialDetail from '@/features/materials/components/material-detail';

export default function DemoTeacherMaterial({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const material = findMaterial(useDemoData(), id);

  if (!material) notFound();

  return (
    <MaterialDetail
      data={material}
      backHref={`/dashboard/materials?kind=${material.kind}`}
      backLabel="Back to materials"
    />
  );
}
