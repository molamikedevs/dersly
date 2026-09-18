type StudentRecord = {
  joinedAt: string;
  student: {
    id: string;
    fullName: string;
    email: string;
    level: ClassLevel | null;
  };
  class: {
    id: string;
    name: string;
    type: ClassType;
    schedule: string | null;
  };
};
