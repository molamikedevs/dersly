type HomeWorkRecord = {
  id: string;
  classId: string;
  title: string;
  instructions: string | null;
  content: string | null;
  attachmentPath: string | null;
  attachmentName: string | null;
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

// The class comes back with its lesson times, so each piece of work can say
// which lesson it is for
type HomeworkRow = HomeWorkRecord & {
  classes?:
    | (NonNullable<HomeWorkRecord['classes']> & {
        scheduleDays: number[] | null;
        scheduleTimes: string[] | null;
      })
    | null;
};

type HomeworkItem = HomeWorkRecord & {
  lessonAt: string | null;
};
