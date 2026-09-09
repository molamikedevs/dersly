type ClassType = 'course' | 'conversation' | 'one_to_one';

interface ClassRecordParams {
  id: string;
  name: string;
  type: ClassType;
  level: string | null;
  schedule: string | null;
  meetingUrl: string | null;
  inviteCode: string;
  enrollmentOpen: boolean;
  isActive: boolean;
  studentCount: number;
}
