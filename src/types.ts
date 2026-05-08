export type AcademicLevel =
  | 'UNDERGRADUATE'
  | 'POSTGRADUATE_MASTERS'
  | 'POSTGRADUATE_PHD'
  | 'LECTURER'
  | 'RESEARCHER'
  | 'OTHER';

export type Gender = 'MALE' | 'FEMALE' | 'NON_BINARY' | 'PREFER_NOT_TO_SAY';

export type AgeRange = 'UNDER_18' | 'AGE_18_24' | 'AGE_25_34' | 'AGE_35_44' | 'AGE_45_PLUS';

export type ReferralSource = 'WHATSAPP' | 'SOCIAL_MEDIA' | 'WORD_OF_MOUTH' | 'SEARCH_ENGINE' | 'OTHER';

export type SurveyStatus = 'DRAFT' | 'ACTIVE' | 'CLOSED';

export type QuestionType =
  | 'MULTIPLE_CHOICE'
  | 'CHECKBOX'
  | 'SHORT_TEXT'
  | 'LONG_TEXT'
  | 'RATING'
  | 'YES_NO';

export type CreditTransactionType = 'SIGNUP_BONUS' | 'SURVEY_REWARD' | 'BOOST_SPEND' | 'PURCHASE';

export interface User {
  id: string;
  name: string;
  email: string;
  creditBalance: number;
  institution?: string;
  fieldOfStudy?: string;
  academicLevel?: AcademicLevel;
  yearOfStudy?: number;
  gender?: Gender;
  ageRange?: AgeRange;
  referralSource?: ReferralSource;
  createdAt?: string;
}

export interface Question {
  id?: string;
  text: string;
  questionType: QuestionType;
  options?: string[];
  required?: boolean;
  orderIndex?: number;
}

export interface Survey {
  id: string;
  title: string;
  description?: string;
  category?: string;
  estimatedTime?: number;
  targetResponses?: number;
  actualResponseCount?: number;
  status?: SurveyStatus;
  boosted: boolean;
  creditValue?: number;
  owner?: User;
  createdAt: string;
  publishedAt?: string;
  boostExpiresAt?: string;
  questions?: Question[];
}

export interface CreditTransaction {
  id: string;
  amount: number;
  type: CreditTransactionType;
  description?: string;
  referenceId?: string;
  createdAt: string;
}

export interface PaginatedResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  last?: boolean;
  first?: boolean;
}

export interface QuestionAnalyticData {
  option: string;
  count: number;
  percentage: number;
}

export interface QuestionAnalytic {
  questionId: string;
  text: string;
  type: QuestionType;
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
  questionType: QuestionType;
  answerValue?: string;
}

export interface RawResponse {
  responseId: string;
  respondedAt: string;
  answers: AnswerRowDTO[];
}
