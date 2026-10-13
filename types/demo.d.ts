// Invented people. None of these names belongs to a real Dersly student.

type DemoPerson = {
  id: string;
  fullName: string;
  email: string;
  level: ClassLevel | null;
  // Hours since the person last opened Dersly. Null: never.
  seenHoursAgo: number | null;
};

type DemoStudentRecord = Omit<DemoPerson, 'seenHoursAgo'> & {
  lastSeenAt: string | null;
};

type DemoNoteRecord = {
  id: string;
  enrollmentId: string;
  lessonDate: string;
  note: string;
};

type DemoAttempt = {
  score: number;
  total: number;
  level: ClassLevel;
  takenAt: string;
};

type DemoData = {
  // The moment the demo opened. Every date below is relative to it, so the
  // server and the browser render the same thing.
  now: number;
  teacher: {
    id: string;
    fullName: string;
    email: string;
    avatarUrl: string | null;
  };
  viewerId: string;
  viewerAvatarUrl: string | null;
  students: DemoStudentRecord[];
  classes: ClassRecord[];
  enrollments: (DemoEnrollment & { joinedAt: string })[];
  homework: HomeWorkRecord[];
  notes: DemoNoteRecord[];
  materials: MaterialRecord[];
  attempts: DemoAttempt[];
};
