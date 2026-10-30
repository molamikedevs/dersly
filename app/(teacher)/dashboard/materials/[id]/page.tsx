import { notFound } from 'next/navigation';

import MaterialDetail from '@/features/materials/components/material-detail';
import { getMaterial, getRelatedVideos } from '@/features/materials/queries';
import type { RouteParams } from '@/types/global';

export async function generateMetadata({ params }: RouteParams) {
  const { id } = await params;
  const { data } = await getMaterial(id);
  return { title: data?.title ?? 'Material' };
}

export default async function Page({ params }: RouteParams) {
  const { id } = await params;
  const { data, success } = await getMaterial(id);

  if (!success || !data) notFound();

  // Only a video page has the side list
  const related = data.kind === 'link' ? await getRelatedVideos(data) : null;

  return (
    <MaterialDetail
      data={data}
      backHref={`/dashboard/materials?kind=${data.kind}`}
      backLabel="Back to materials"
      upNext={{ items: related?.data ?? [], hrefBase: '/dashboard/materials' }}
    />
  );
}
