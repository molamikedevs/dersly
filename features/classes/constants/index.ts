export const TYPES = [
  { value: 'one_to_one', label: 'One to one' },
  { value: 'course', label: 'Course' },
  { value: 'conversation', label: 'Conversation' },
] as const;

export const LEVELS = [
  { value: 'beginner', label: 'Beginner' },
  { value: 'elementary', label: 'Elementary' },
  { value: 'intermediate', label: 'Intermediate' },
  { value: 'advanced', label: 'Advanced' },
] as const;

export const LESSONS_PER_PACKAGE = 8;

export function studentCountLabel(count: number) {
  if (count <= 0) return 'No students yet';
  if (count === 1) return '1 student';
  return `${count} students`;
}
