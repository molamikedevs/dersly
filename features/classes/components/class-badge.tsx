type ClassType = 'course' | 'conversation' | 'one_to_one';

const LABELS: Record<ClassType, string> = {
  course: 'Course',
  conversation: 'Conversation',
  one_to_one: 'One to one',
};

export default function ClassBadge({ type }: { type: ClassType }) {
  return (
    <span className="inline-flex items-center rounded-md border px-2 py-0.5 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
      {LABELS[type]}
    </span>
  );
}
