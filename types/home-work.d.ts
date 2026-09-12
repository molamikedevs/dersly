type HomeWorkRecord = {
  id: string;
  classId: string;
  title: string;
  instructions: string | null;
  attachmentPath: string | null;
  dueDate: string | null;
  isPublished: boolean;
  createdAt: string;
};

type HomeWorkWithSubmission = HomeWorkRecord & {
  submission: {
    submittedAt: string;
    reviewedAt: string | null;
  } | null;
};
