// This week's words on the student's Home page, in full, to study all week.
// Next week they come back in the check.

type Props = { words: StudyWord[] };

export default function VocabularyStudy({ words }: Props) {
  if (words.length === 0) return null;

  return (
    <section className="flex flex-col gap-3">
      <h2 className="text-xl leading-snug font-bold tracking-tight text-foreground">
        This week&apos;s vocabulary
      </h2>
      <p className="text-[15px] text-muted-foreground">
        Learn these words this week. Next week there is a short check.
      </p>

      <ol className="flex flex-col divide-y divide-border border-y border-border">
        {words.map((item) => (
          <li key={item.id} className="flex flex-col gap-1 py-4">
            <p className="text-lg font-semibold break-words text-foreground">
              {item.word}
            </p>
            <p className="text-[15px] break-words text-foreground">
              {item.meaning}
            </p>
            {item.example && (
              <p className="text-[15px] break-words text-muted-foreground italic">
                {item.example}
              </p>
            )}
          </li>
        ))}
      </ol>
    </section>
  );
}
