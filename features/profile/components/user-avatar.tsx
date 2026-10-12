'use client';

import { User } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import type { MouseEvent } from 'react';

import InitialsAvatar from '@/components/common/initials-avatar';
import { cn } from '@/lib/utils';

type Props = {
  name: string;
  email?: string;
  avatarUrl?: string | null;
  href?: string;
  variant?: 'button' | 'row' | 'tab';
  active?: boolean;
  className?: string;
  onClick?: (event: MouseEvent<HTMLAnchorElement>) => void;
};

function Face({
  name,
  avatarUrl,
  size,
  className,
}: {
  name: string;
  avatarUrl?: string | null;
  size: number;
  className?: string;
}) {
  if (avatarUrl) {
    return (
      <Image
        src={avatarUrl}
        alt=""
        width={size}
        height={size}
        className={cn('shrink-0 rounded-full object-cover', className)}
        style={{ width: size, height: size }}
      />
    );
  }

  return <InitialsAvatar name={name} className={cn('shrink-0', className)} />;
}

export default function UserAvatar({
  name,
  email,
  avatarUrl,
  href = '/profile',
  variant = 'button',
  active = false,
  className,
  onClick,
}: Props) {
  if (variant === 'row') {
    return (
      <Link
        href={href}
        aria-current={active ? 'page' : undefined}
        className={cn(
          'flex w-full items-center gap-3 rounded-lg px-2 py-2 transition-colors',
          'focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none',
          'group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0',
          active ? 'bg-accent text-accent-foreground' : 'hover:bg-muted',
          className,
        )}
      >
        <Face name={name} avatarUrl={avatarUrl} size={32} className="size-8" />

        <span className="min-w-0 flex-1 group-data-[collapsible=icon]:hidden">
          <span className="block truncate text-sm font-semibold text-foreground">
            {name}
          </span>
          {/* Break on the @ rather than clipping "gmail...." mid-word. */}
          {email && (
            <span
              className="block truncate text-xs text-muted-foreground"
              title={email}
            >
              {email}
            </span>
          )}
        </span>
      </Link>
    );
  }

  if (variant === 'tab') {
    // Same press feedback as the other tabs: the icon and label shrink a
    // little under the finger, and a long press does not open a link preview.
    return (
      <Link
        href={href}
        draggable={false}
        onClick={onClick}
        aria-current={active ? 'page' : undefined}
        className={cn(
          'group flex h-14 touch-manipulation items-center justify-center px-0.5 select-none',
          '[-webkit-touch-callout:none]',
          'transition-colors duration-150 ease-out',
          'focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none focus-visible:ring-inset',
          active ? 'text-primary' : 'text-muted-foreground',
          className,
        )}
      >
        <span className="flex w-full min-w-0 flex-col items-center gap-1 transition-transform duration-150 ease-out group-active:scale-[0.92]">
          {avatarUrl ? (
            <Face
              name={name}
              avatarUrl={avatarUrl}
              size={20}
              className={cn(
                'size-5 ring-offset-2 ring-offset-card',
                active && 'ring-2 ring-primary',
              )}
            />
          ) : (
            <User
              className="size-5 shrink-0"
              aria-hidden
              strokeWidth={active ? 2.25 : 1.75}
            />
          )}
          <span
            className={cn(
              'max-w-full truncate text-[11px] leading-tight',
              active ? 'font-semibold' : 'font-medium',
            )}
          >
            Profile
          </span>
        </span>
      </Link>
    );
  }

  return (
    <Link
      href={href}
      aria-label="Your profile"
      aria-current={active ? 'page' : undefined}
      className={cn(
        'flex size-11 shrink-0 items-center justify-center rounded-full transition-opacity hover:opacity-80',
        'focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-none',
        className,
      )}
    >
      <Face
        name={name}
        avatarUrl={avatarUrl}
        size={36}
        className={cn(
          'size-9',
          active && 'ring-2 ring-primary ring-offset-2 ring-offset-background',
        )}
      />
    </Link>
  );
}
