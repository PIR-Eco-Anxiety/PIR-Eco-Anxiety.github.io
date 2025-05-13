export const MULTIPLIER = 1.2;

export interface QuestionBase {
  question: string;
  source?: string;
}

export interface MultipleChoiceQuestion extends QuestionBase {
  answers: {
    answer: string;
    isCorrect: boolean;
  }[];
}

export function isMultipleChoiceQuestion(question: BonusQuestion): question is MultipleChoiceQuestion {
  return (question as MultipleChoiceQuestion).answers !== undefined;
}

export interface SimpleQuestion extends QuestionBase {
  answer: string;
}

export function isSimpleQuestion(question: BonusQuestion): question is SimpleQuestion {
  return (question as SimpleQuestion).answer !== undefined;
}

export interface OpenQuestion extends QuestionBase {
}

export function isOpenQuestion(question: BonusQuestion): question is OpenQuestion {
  return (question as SimpleQuestion).answer === undefined && (question as MultipleChoiceQuestion).answers === undefined;
}

export type BonusQuestion = MultipleChoiceQuestion | OpenQuestion | SimpleQuestion;

export enum BonusQuestionType {
  MULTIPLE_CHOICE,
  OPEN,
  SIMPLE
}

export function getBonusQuestionType(question: BonusQuestion): BonusQuestionType {
  if (isMultipleChoiceQuestion(question)) {
    return BonusQuestionType.MULTIPLE_CHOICE;
  } else if (isSimpleQuestion(question)) {
    return BonusQuestionType.SIMPLE;
  } else {
    return BonusQuestionType.OPEN;
  }
}

export function convertBonusQuestion(question: BonusQuestion, type: BonusQuestionType): BonusQuestion {
  switch (type) {
    case BonusQuestionType.MULTIPLE_CHOICE:
      return {question: question.question, answers: []};
    case BonusQuestionType.SIMPLE:
      return {question: question.question, answer: ''};
    case BonusQuestionType.OPEN:
      return {question: question.question};
  }
}