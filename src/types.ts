export interface User {
  id: string;
  name: string;
  email: string;
  credits: number;
  institution?: string;
  field_of_study?: string;
}

export interface Question {
  id?: string;
  text: string;
  questionType: 'MULTIPLE_CHOICE' | 'CHECKBOX' | 'SHORT_TEXT' | 'RATING' | 'YES_NO' | 'LONG_TEXT';
  options?: string[];
  order?: number;
}

export interface Survey {
  id: string;
  userId: string;
  title: string;
  description: string;
  category: string;
  estimatedTime: number;
  isBoosted: boolean;
  authorName: string;
  createdAt: string;
  responseCount?: number;
  questions?: Question[];
}

export interface CreditTransaction {
  id: string;
  userId: string;
  amount: number;
  type: 'SIGNUP_BONUS' | 'SURVEY_REWARD' | 'BOOST_SPEND' | 'PURCHASE';
  referenceId?: string;
  description: string;
  createdAt: string;
}

export interface PaginatedResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

export interface AnalyticsOverview {
  totalResponses: number;
  targetResponses: number;
  completionPercentage: number;
}

export interface QuestionAnalyticData {
  optionText: string;
  count: number;
  percentage: number;
}

export interface QuestionAnalytic {
  questionId: string;
  text: string;
  type: Question['questionType'];
  distribution?: QuestionAnalyticData[];
  textResponses?: string[];
}

export interface SurveyAnalytics {
  surveyId: string;
  title: string;
  totalResponses: number;
  targetResponses: number;
  completionPercentage: number;
  questions: QuestionAnalytic[];
}

export interface AnswerRowDTO {
  questionId: string;
  questionText: string;
  questionType: string;
  answerText?: string;
  selectedOptions?: string[];
}

export interface RawResponse {
  responseId: string;
  submittedAt: string;
  answers: AnswerRowDTO[];
}
