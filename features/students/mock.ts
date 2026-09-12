export const mockStudents: StudentRecord[] = [
  {
    id: 's1',
    fullName: 'Aysel Mammadova',
    email: 'aysel@example.com',
    level: 'elementary',
    joinedAt: '2026-09-01T10:00:00Z',
    classes: [
      { id: '1', name: 'English Group', type: 'course' },
      { id: '2', name: 'Conversation Club', type: 'conversation' },
    ],
  },
  {
    id: 's2',
    fullName: 'Rashad Aliyev',
    email: 'rashad@example.com',
    level: 'beginner',
    joinedAt: '2026-09-03T10:00:00Z',
    classes: [{ id: '1', name: 'English Group', type: 'course' }],
  },
  {
    id: 's3',
    fullName: 'Laman Lara',
    email: 'laman@example.com',
    level: 'intermediate',
    joinedAt: '2026-08-22T10:00:00Z',
    classes: [{ id: '3', name: 'Laman Lara', type: 'one_to_one' }],
  },
];
