import Link from 'next/link';

import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center px-6 text-center">
      <p className="font-mono text-7xl text-muted-foreground">404</p>

      <h1 className="mt-3 text-2xl font-semibold tracking-tight text-foreground">
        Page not found
      </h1>

      <p className="mt-2 max-w-sm text-sm text-muted-foreground">
        This page does not exist, or it may have been removed.
      </p>

      <Button className="mt-8 h-11">
        <Link href="/">Go to home</Link>
      </Button>
    </div>
  );
}
