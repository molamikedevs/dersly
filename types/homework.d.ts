type HomeWorkRecord = {
  id: string;
  classId: string;
  title: string;
  instructions: string | null;
  attachmentPath: string | null;
  dueDate: string | null;
  isPublished: boolean;
  createdAt: string;
  signedUrl?: string | null;
  downloadUrl?: string | null;
  classes?: {
    id: string;
    name: string;
    type: ClassType;
  } | null;
};

type HomeWorkGroup = {
  id: string;
  name: string;
  items: HomeWorkRecord[];
};
