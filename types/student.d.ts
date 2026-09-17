type StudentRecord = {
  id: string;
  fullName: string;
  email: string;
  level: ClassLevel | null;
  createdAt: string;
  classes: {
    id: string;
    name: string;
    type: ClassType;
  }[];
};
