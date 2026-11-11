// A word the teacher set for a one-to-one student, for one week
type WordRecord = {
  id: string;
  enrollmentId: string;
  // The Monday the week starts, 'YYYY-MM-DD' in Baku
  weekStart: string;
  word: string;
  meaning: string;
  example: string | null;
  attempts: number;
  learnedAt: string | null;
  createdAt: string;
};

// What the student sees. The word itself only arrives once it is learned,
// and the example has the word blanked out.
type StudentWord = {
  id: string;
  meaning: string;
  example: string | null;
  word: string | null;
};

type StudentVocabulary = {
  weekStart: string;
  words: StudentWord[];
};

// The answer to one try: the word once it is right or after two tries,
// and a hint after the first wrong try
type WordCheck = {
  right: boolean;
  word: string | null;
  hint: string | null;
};
