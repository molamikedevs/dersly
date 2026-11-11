// This week's words on the student's Home page. Each word is a tile: the
// word first, and its meaning and example one tap away, so the student can
// test themselves before they look. Next week the words come back in the
// check.

type Props = { words: StudyWord[] };

export default function VocabularyStudy({ words }: Props) {
  if (words.length === 0) return null;

  return (
    <section id="words" className="flex scroll-mt-24 flex-col gap-4">
      <div className="flex flex-col gap-1">
        <h2 className="text-xl leading-snug font-bold tracking-tight text-foreground">
          This week&apos;s words
        </h2>
        <p className="text-[15px] text-muted-foreground">
          Say what each word means, then tap it to check. Next week there is a
          short check.
        </p>
      </div>

      <ul className="grid grid-cols-2 items-start gap-2.5 sm:gap-3 md:grid-cols-3">
        {words.map((item) => (
          <li key={item.id}>
            <details className="group rounded-2xl border border-border bg-card transition-colors open:border-primary/40">
              <summary className="flex min-h-22 cursor-pointer touch-manipulation list-none flex-col justify-between gap-3 rounded-2xl p-4 outline-none select-none group-open:min-h-0 group-open:pb-2 focus-visible:ring-2 focus-visible:ring-ring [&::-webkit-details-marker]:hidden">
                <span className="font-serif text-xl leading-tight font-medium tracking-tight break-words text-foreground sm:text-2xl">
                  {item.word}
                </span>
                <span className="text-sm text-muted-foreground group-open:hidden">
                  Tap to see the meaning
                </span>
              </summary>

              <div className="flex flex-col gap-2 px-4 pb-4">
                <p className="text-[15px] leading-relaxed break-words text-foreground">
                  {item.meaning}
                </p>
                {item.example && (
                  <p className="text-[15px] leading-relaxed break-words text-muted-foreground italic">
                    {item.example}
                  </p>
                )}
              </div>
            </details>
          </li>
        ))}
      </ul>
    </section>
  );
}
