import ClassRow from '@/features/classes/components/class-row';

export default function ClassSection({
  title,
  meta,
  classes,
}: {
  title: string;
  meta: string;
  classes: ClassRecordParams[];
}) {
  if (classes.length === 0) return null;

  return (
    <section className="mt-8">
      <div className="flex items-center gap-4">
        <h2 className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          {title}
        </h2>
        <span className="h-px flex-1 bg-border" />
        <span className="text-sm text-muted-foreground">{meta}</span>
      </div>

      <div className="mt-4 flex flex-col gap-3">
        {classes.map((item) => (
          <ClassRow key={item.id} data={item} />
        ))}
      </div>
    </section>
  );
}
