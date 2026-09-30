import { Skeleton } from '@/components/ui/skeleton';

function RowSkeleton({ control }: { control: string }) {
  return (
    <div className="flex items-center justify-between gap-4 px-6 py-5">
      <div className="flex min-w-0 flex-col gap-2">
        <Skeleton className="h-5 w-24" />
        <Skeleton className="h-4 w-48 max-w-full" />
      </div>
      <Skeleton className={control} />
    </div>
  );
}

export default function AccountSettingsSkeleton({
  allowDelete = false,
}: {
  allowDelete?: boolean;
}) {
  return (
    <>
      <section className="flex flex-col gap-4">
        <Skeleton className="h-7 w-28" />

        <div className="flex flex-col divide-y divide-border rounded-2xl border border-border bg-card">
          <RowSkeleton control="h-11 w-28 shrink-0 rounded-xl" />
          <RowSkeleton control="size-9 shrink-0 rounded-full" />
        </div>

        <Skeleton className="h-12 w-full rounded-xl" />
      </section>

      {allowDelete && (
        <div className="rounded-2xl border border-border bg-card">
          <RowSkeleton control="h-11 w-40 shrink-0 rounded-xl" />
        </div>
      )}
    </>
  );
}
