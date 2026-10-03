import MarkdownContent from '@/features/homework/components/markdown-content';

export default function LessonNoteBody({ note }: { note: string }) {
  return (
    <div className="max-w-prose [&_h2]:mt-6 [&_h2]:font-sans [&_h2]:text-base [&_h2]:font-semibold [&_h2]:tracking-normal [&_h3]:mt-6 [&_h3]:text-base [&_li]:text-[15px] [&_p]:text-[15px]">
      <MarkdownContent content={note} />
    </div>
  );
}
