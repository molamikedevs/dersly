export default function PageHeader({
  title,
  subText,
  meta,
}: {
  title: string;
  subText?: string;
  meta?: string;
}) {
  return (
    <header className="flex flex-col gap-1.5">
      <div className="flex flex-wrap items-baseline gap-x-3.5 gap-y-1">
        <h1 className="font-serif text-3xl font-medium tracking-tight text-foreground sm:text-5xl">
          {title}
        </h1>
        {meta && (
          <span className="text-sm font-medium text-muted-foreground sm:text-[15px]">
            {meta}
          </span>
        )}
      </div>
      {subText && (
        <p className="text-[15px] text-muted-foreground sm:text-base">
          {subText}
        </p>
      )}
    </header>
  );
}
