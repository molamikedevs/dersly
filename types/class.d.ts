type ClassType = 'course' | 'conversation' | 'one_to_one';
type ClassLevel = 'beginner' | 'elementary' | 'intermediate' | 'advanced';

type ClassRecord = {
  id: string;
  teacherId: string;
  name: string;
  type: ClassType;
  level: ClassLevel | null;
  meetingUrl: string | null;
  inviteCode: string;
  handlesPayment: boolean;
  isActive: boolean;
  enrollmentOpen: boolean;
  // ISO weekdays, 1 Monday to 7 Sunday, sorted
  scheduleDays: number[];
  // Start time for the day at the same position, 'HH:MM:SS' in Baku time
  scheduleTimes: string[];
  createdAt: string;
};

type ClassWithCount = ClassRecord & {
  studentCount: number;
};

// enrollmentId is null until the student has joined with the invite code
type PrivateClass = ClassWithCount & {
  enrollmentId: string | null;
  lessonsDone: number;
};
