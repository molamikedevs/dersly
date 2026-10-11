type StudentHome = {
  firstName: string;
  studentLevel: string | null;
  enrolment: {
    classId: string;
    className: string;
    type: ClassType;
    level: string | null;
    schedule: string | null;
    nextLessonAt: string | null;
    meetingUrl: string | null;
    lessonsDone: number;
  };
  lessonNotes: {
    id: string;
    // The day the lesson happened, 'YYYY-MM-DD'
    lessonDate: string;
    note: string;
  }[];
  reading: {
    id: string;
    title: string;
    url: string | null;
  }[];
  current: {
    id: string;
    title: string;
    instructions: string | null;
    attachmentName: string | null;
    signedUrl: string | null;
    downloadUrl: string | null;
    hasGuide: boolean;
  } | null;
  materials: {
    id: string;
    title: string;
    kind: 'guide' | 'link' | 'article';
    level: string | null;
    url: string | null;
  }[];
};
