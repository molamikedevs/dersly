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

export const STUDENT_TOP_NAV: NavItem[] = [
  { label: 'Home', href: '/' },
  { label: 'Classes', href: '/classes' },
  { label: 'Home work', href: '/homework' },
];

export const STUDENT_TAB_NAV: NavItemWithIcon[] = [
  { label: 'Home', href: '/', icon: Home },
  { label: 'Classes', href: '/classes', icon: BookOpen },
  { label: 'Home work', href: '/homework', icon: ClipboardList },
];

export const TEACHER_NAV: NavItemWithIcon[] = [
  { label: 'Overview', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Classes', href: '/dashboard/classes', icon: BookOpen },
  { label: 'Students', href: '/dashboard/students', icon: Users },
  { label: 'Home work', href: '/dashboard/homework', icon: ClipboardList },
  { label: 'Materials', href: '/dashboard/materials', icon: FolderOpen },
];
