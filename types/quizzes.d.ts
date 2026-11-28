type QuizQuestionKind = 'mcq' | 'word_bank';

type QuizQuestionRecord = {
  id: string;
  quizId: string;
  position: number;
  kind: QuizQuestionKind;
  prompt: string;
  options: string[];
  correctAnswer: string;
};

type QuizAttemptRecord = {
  id: string;
  quizId: string;
  studentId: string;
  answers: Record<string, string>;
  score: number | null;
  submittedAt: string | null;
  updatedAt: string;
};

type QuizRecord = {
  id: string;
  classId: string;
  title: string;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
};

type QuizSummary = QuizRecord & {
  questionCount: number;
  latestAttempt: {
    id: string;
    score: number | null;
    submittedAt: string | null;
  } | null;
};

type QuizWithQuestions = QuizRecord & {
  classes?: { id: string; name: string } | null;
  questions: QuizQuestionRecord[];
  attempt: QuizAttemptRecord | null;
};
