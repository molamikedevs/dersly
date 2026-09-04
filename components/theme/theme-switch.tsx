'use client';

import { AnimatedThemeToggler } from '@/components/ui/animated-theme-toggler';

export default function ThemeSwitch() {
  return <AnimatedThemeToggler variant="hexagon" duration={800} fromCenter />;
}
