type TestQuestion = {
  id: string;
  prompt: string;
  options: { id: string; text: string }[];
};

type TestAnswer = {
  questionId: string;
  optionId: string;
};
