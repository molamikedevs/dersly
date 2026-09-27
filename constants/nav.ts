import {
  BookOpen,
  ClipboardList,
  FolderOpen,
  Home,
  LayoutDashboard,
  Users,
  type LucideIcon,
} from 'lucide-react';

export type NavItem = {
  label: string;
  href: string;
};

export type NavItemWithIcon = NavItem & {
  icon: LucideIcon;
};

const workLabel: Record<ClassType, string> = {
  one_to_one: 'Homework',
  course: 'Homework',
  conversation: 'Topics',
};

export function studentTopNav(classType?: ClassType | null): NavItem[] {
  return [
    { label: 'Home', href: '/' },
    { label: workLabel[classType ?? 'course'], href: '/homework' },
    { label: 'Materials', href: '/materials' },
  ];
}

export function studentTabNav(classType?: ClassType | null): NavItemWithIcon[] {
  return [
    { label: 'Home', href: '/', icon: Home },
    {
      label: workLabel[classType ?? 'course'],
      href: '/homework',
      icon: ClipboardList,
    },
    { label: 'Materials', href: '/materials', icon: FolderOpen },
  ];
}

export const TEACHER_NAV: NavItemWithIcon[] = [
  { label: 'Overview', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Classes', href: '/dashboard/classes', icon: BookOpen },
  { label: 'Students', href: '/dashboard/students', icon: Users },
  { label: 'Homework', href: '/dashboard/homework', icon: ClipboardList },
  { label: 'Materials', href: '/dashboard/materials', icon: FolderOpen },
];
