// A word the teacher set for a one-to-one student, for one week
type WordRecord = {
  id: string;
  enrollmentId: string;
  // The Monday the week starts, 'YYYY-MM-DD' in Baku
  weekStart: string;
  word: string;
  meaning: string;
  example: string | null;
  // 0 until the student answers it in the check, then 1
  attempts: number;
  // Set when the student got it right in the check
  learnedAt: string | null;
  createdAt: string;
};

// A word to study this week, shown in full
type StudyWord = {
  id: string;
  word: string;
  meaning: string;
  example: string | null;
};

// A word in the check, from last week. The word itself only arrives once
// the student has answered, and the example has it blanked out.
type CheckWord = {
  id: string;
  meaning: string;
  example: string | null;
  result: WordCheck | null;
};

type StudentVocabulary = {
  study: { weekStart: string; words: StudyWord[] };
  check: { weekStart: string; words: CheckWord[] };
};

// The answer to the one try: right or not, and the word either way
type WordCheck = {
  right: boolean;
  word: string;
};
