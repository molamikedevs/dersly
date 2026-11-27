import { Skeleton } from '@/components/ui/skeleton';

export default function AccountSettingsSkeleton({
  allowDelete = false,
  embedded = false,
}: {
  allowDelete?: boolean;
  embedded?: boolean;
}) {
  const rows = (
    <>
      {['w-36', 'w-44', 'w-28'].map((buttonWidth, index) => (
        <div
          key={index}
          className="surface-row grid grid-cols-1 gap-4 px-5 py-5 sm:grid-cols-[15rem_minmax(0,1fr)] sm:items-center sm:gap-8 sm:px-7"
        >
          <div className="flex flex-col gap-1.5">
            <Skeleton className="h-5 w-24" />
            <Skeleton className="h-4 w-48 max-w-full" />
          </div>
          <Skeleton className={`h-9 ${buttonWidth} rounded-lg`} />
        </div>
      ))}
    </>
  );

  const deleteSection = allowDelete ? (
    <div className="flex flex-col items-start gap-3">
      <div className="flex flex-col gap-1.5">
        <Skeleton className="h-5 w-32" />
        <Skeleton className="h-4 w-72 max-w-full" />
      </div>
      <Skeleton className="h-10 w-36 rounded-xl" />
    </div>
  ) : null;

  if (embedded) {
    return (
      <>
        {rows}
        {deleteSection}
      </>
    );
  }

  return (
    <>
      <div className="flex flex-col gap-3">
        <Skeleton className="h-6 w-24" />
        <div className="surface-card flex flex-col overflow-hidden">{rows}</div>
      </div>

      {deleteSection}
    </>
  );
}
