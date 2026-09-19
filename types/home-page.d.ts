type StudentHome = {
  firstName: string;
  enrolment: {
    classId: string;
    className: string;
    type: ClassType;
    level: string | null;
    schedule: string | null;
    meetingUrl: string | null;
    lessonsCompleted: number;
  };
  current: {
    id: string;
    title: string;
    instructions: string | null;
    attachmentName: string | null;
    signedUrl: string | null;
    downloadUrl: string | null;
  } | null;
  materials: {
    id: string;
    title: string;
    level: string | null;
    url: string | null;
  }[];
};
