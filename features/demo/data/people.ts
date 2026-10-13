import { ID } from './ids';

export const DEMO_TEACHER = {
  id: ID.teacher,
  fullName: 'Nigar Əliyeva',
  email: 'nigar.aliyeva@example.com',
};

export const DEMO_STUDENTS: DemoPerson[] = [
  {
    id: ID.student(1),
    fullName: 'Günel Məmmədova',
    email: 'gunel.mammadova@example.com',
    level: 'intermediate',
    seenHoursAgo: 1,
  },
  {
    id: ID.student(2),
    fullName: 'Murad Hüseynov',
    email: 'murad.huseynov@example.com',
    level: 'elementary',
    seenHoursAgo: 20,
  },
  {
    id: ID.student(3),
    fullName: 'Elvin Qasımov',
    email: 'elvin.qasimov@example.com',
    level: 'beginner',
    seenHoursAgo: 52,
  },
  {
    id: ID.student(4),
    fullName: 'Sabina Rzayeva',
    email: 'sabina.rzayeva@example.com',
    level: 'advanced',
    seenHoursAgo: 4,
  },
  {
    id: ID.student(5),
    fullName: 'Tural Əhmədov',
    email: 'tural.ahmadov@example.com',
    level: 'elementary',
    seenHoursAgo: 130,
  },
  {
    id: ID.student(6),
    fullName: 'Ana Souza',
    email: 'ana.souza@example.com',
    level: 'intermediate',
    seenHoursAgo: 9,
  },
  {
    id: ID.student(7),
    fullName: 'Kenji Watanabe',
    email: 'kenji.watanabe@example.com',
    level: 'advanced',
    seenHoursAgo: 30,
  },
  {
    id: ID.student(8),
    fullName: 'Amara Okafor',
    email: 'amara.okafor@example.com',
    level: null,
    seenHoursAgo: null,
  },
];

// The student the demo is seen as: in the conversation club, with a lesson
// on now
export const DEMO_VIEWER_ID = ID.student(1);
