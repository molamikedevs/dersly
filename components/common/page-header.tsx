export default function PageHeader({
  title,
  subText,
}: {
  title: string;
  subText: string;
}) {
  return (
    <header>
      <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
        {title}
      </h1>
      <p className="mt-1.5 text-sm text-muted-foreground">{subText}</p>
    </header>
  );
}
