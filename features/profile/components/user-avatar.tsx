'use client';

import { ChevronsUpDown, User } from 'lucide-react';
import Link from 'next/link';

import InitialsAvatar from '@/components/common/initials-avatar';
import ThemeSwitch from '@/components/theme/theme-switch';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import SignOutButton from '@/features/auth/components/signout-button';
import { cn } from '@/lib/utils';

type Props = {
  name: string;
  email: string;
  avatarUrl?: string | null;
  profileHref?: string;
  variant?: 'button' | 'row' | 'tab';
  active?: boolean;
  className?: string;
};

export default function UserAvatar({
  name,
  email,
  avatarUrl,
  profileHref = '/profile',
  variant = 'button',
  active = false,
  className,
}: Props) {
  const side = variant === 'button' ? 'bottom' : 'top';
  const align = variant === 'button' ? 'end' : 'start';

  const triggerClass =
    variant === 'row'
      ? cn(
          'flex w-full items-center gap-3 rounded-lg px-1 py-2 text-left transition-colors',
          'hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
          'group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0',
          className,
        )
      : variant === 'tab'
        ? cn(
            'flex h-14 w-full flex-col items-center justify-center gap-1 px-1',
            'transition-colors active:bg-muted',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring',
            active ? 'text-primary' : 'text-muted-foreground',
            className,
          )
        : cn(
            'flex size-11 shrink-0 items-center justify-center rounded-full',
            'transition-opacity hover:opacity-80',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
            className,
          );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger aria-label="Account" className={triggerClass}>
        {variant === 'row' ? (
          <>
            <InitialsAvatar
              name={name}
              src={avatarUrl}
              className="size-8 shrink-0"
            />

            <span className="min-w-0 flex-1 group-data-[collapsible=icon]:hidden">
              <span className="block truncate text-sm font-medium text-foreground">
                {name}
              </span>
              <span
                className="block truncate text-xs text-muted-foreground"
                title={email}
              >
                {email}
              </span>
            </span>

            <ChevronsUpDown
              className="size-4 shrink-0 text-muted-foreground group-data-[collapsible=icon]:hidden"
              aria-hidden
            />
          </>
        ) : variant === 'tab' ? (
          <>
            <User
              className="size-5 shrink-0"
              aria-hidden
              strokeWidth={active ? 2.25 : 1.75}
            />
            <span
              className={cn(
                'max-w-full truncate text-[11px] leading-tight',
                active ? 'font-medium' : 'font-normal',
              )}
            >
              Profile
            </span>
          </>
        ) : (
          <InitialsAvatar
            name={name}
            src={avatarUrl}
            className="size-9 ring-1 ring-border"
          />
        )}
      </DropdownMenuTrigger>

      <DropdownMenuContent
        side={side}
        align={align}
        sideOffset={8}
        className="w-64 rounded-xl p-1.5"
      >
        <div className="flex items-center gap-3 px-2.5 py-3">
          <InitialsAvatar
            name={name}
            src={avatarUrl}
            className="size-10 shrink-0"
          />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-foreground">
              {name}
            </p>
            <p className="truncate text-xs text-muted-foreground" title={email}>
              {email}
            </p>
          </div>
        </div>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          render={<Link href={profileHref} />}
          className="flex h-11 items-center gap-2.5 rounded-lg px-2.5 text-sm"
        >
          <User className="size-4 text-muted-foreground" aria-hidden />
          Your profile
        </DropdownMenuItem>

        <div
          onClick={(event) => event.stopPropagation()}
          className="flex h-11 items-center justify-between gap-2 rounded-lg px-2.5 text-sm text-foreground"
        >
          Theme
          <ThemeSwitch />
        </div>

        <DropdownMenuSeparator />

        <SignOutButton className="[&>button]:h-11 [&>button]:w-full [&>button]:justify-start [&>button]:rounded-lg [&>button]:px-2.5" />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
