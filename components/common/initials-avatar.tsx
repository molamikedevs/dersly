import { cn, initials } from '@/lib/utils';

type Props = {
  name: string;
  shape?: 'circle' | 'square';
  className?: string;
};

export default function InitialsAvatar({
  name,
  shape = 'circle',
  className,
}: Props) {
  return (
    <span
      aria-hidden
      className={cn(
        'flex size-9 shrink-0 items-center justify-center text-xs font-semibold',
        shape === 'circle'
          ? 'rounded-full bg-primary text-primary-foreground'
          : 'rounded-md bg-muted text-muted-foreground',
        className,
      )}
    >
      {initials(name)}
    </span>
  );
}
