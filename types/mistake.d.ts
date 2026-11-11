// A mistake the teacher wrote down for a one-to-one student
type MistakeRecord = {
  id: string;
  enrollmentId: string;
  wrong: string;
  correct: string;
  tip: string | null;
  // The student's last try, null until they try
  attempt: string | null;
  fixedAt: string | null;
  createdAt: string;
};

// What the student sees before they try: never the answer
type OpenMistake = {
  id: string;
  wrong: string;
};

type StudentMistakes = {
  open: OpenMistake[];
  fixedCount: number;
};

// Sent back once the student has written their fix
type MistakeAnswer = {
  correct: string;
  tip: string | null;
};
