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

export const mockStudents = [
  {
    id: 's1',
    fullName: 'Aysel Mammadova',
    level: 'A2',
    joinedAt: '2026-09-01',
  },
  { id: 's2', fullName: 'Rashad Aliyev', level: 'A1', joinedAt: '2026-09-03' },
  {
    id: 's3',
    fullName: 'Nigar Huseynova',
    level: 'A2',
    joinedAt: '2026-09-05',
  },
  { id: 's4', fullName: 'Elvin Gasimov', level: 'A1', joinedAt: '2026-09-08' },
];
