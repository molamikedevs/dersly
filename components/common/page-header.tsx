export default function PageHeader({
  title,
  subText,
}: {
  title: string;
  subText: string;
}) {
  return (
    <header className="flex flex-col gap-2">
      <h1 className="font-serif text-4xl font-medium tracking-tight text-foreground sm:text-5xl">
        {title}
      </h1>
      <p className="text-[15px] text-muted-foreground sm:text-base">
        {subText}
      </p>
    </header>
  );
}
