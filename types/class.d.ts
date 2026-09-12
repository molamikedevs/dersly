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
  schedule: string | null;
  createdAt: string;
};

type ClassWithCount = ClassRecord & {
  studentCount: number;
};
