import { Skeleton } from '@/components/ui/skeleton';

function RowSkeleton({ control }: { control: string }) {
  return (
    <div className="flex items-center justify-between gap-4 px-5 py-4">
      <div className="flex min-w-0 flex-col gap-2">
        <Skeleton className="h-5 w-24" />
        <Skeleton className="h-4 w-44 max-w-full" />
      </div>
      <Skeleton className={control} />
    </div>
  );
}

// Mirrors AccountSettings block for block
export default function AccountSettingsSkeleton({
  allowDelete = false,
}: {
  allowDelete?: boolean;
}) {
  return (
    <>
      <section className="flex flex-col gap-3">
        <Skeleton className="h-7 w-24" />

        <div className="flex flex-col divide-y divide-border rounded-2xl border border-border bg-card">
          <RowSkeleton control="h-11 w-28 shrink-0 rounded-xl" />
          <RowSkeleton control="h-7 w-12 shrink-0 rounded-full" />
          <div className="flex min-h-14 items-center justify-between px-5 py-4">
            <Skeleton className="h-5 w-20" />
            <Skeleton className="size-4" />
          </div>
        </div>
      </section>

      {allowDelete && (
        <section className="flex flex-col items-start gap-3">
          <div className="flex flex-col gap-2">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-4 w-64 max-w-full" />
          </div>
          <Skeleton className="h-11 w-40 rounded-xl" />
        </section>
      )}
    </>
  );
}
