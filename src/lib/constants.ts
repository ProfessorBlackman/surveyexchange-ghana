import type { AcademicLevel, AgeRange, CreditTransactionType, Gender, ReferralSource } from '../types';

export const ACADEMIC_LEVEL_OPTIONS: { value: AcademicLevel; label: string }[] = [
  { value: 'UNDERGRADUATE',        label: 'Undergraduate' },
  { value: 'POSTGRADUATE_MASTERS', label: 'Postgraduate — Masters' },
  { value: 'POSTGRADUATE_PHD',     label: 'Postgraduate — PhD' },
  { value: 'LECTURER',             label: 'Lecturer' },
  { value: 'RESEARCHER',           label: 'Researcher' },
  { value: 'OTHER',                label: 'Other' },
];

export const GENDER_OPTIONS: { value: Gender; label: string }[] = [
  { value: 'MALE',              label: 'Male' },
  { value: 'FEMALE',            label: 'Female' },
  { value: 'NON_BINARY',        label: 'Non-binary' },
  { value: 'PREFER_NOT_TO_SAY', label: 'Prefer not to say' },
];

export const AGE_RANGE_OPTIONS: { value: AgeRange; label: string }[] = [
  { value: 'UNDER_18',    label: 'Under 18' },
  { value: 'AGE_18_24',   label: '18–24' },
  { value: 'AGE_25_34',   label: '25–34' },
  { value: 'AGE_35_44',   label: '35–44' },
  { value: 'AGE_45_PLUS', label: '45 and above' },
];

export const REFERRAL_SOURCE_OPTIONS: { value: ReferralSource; label: string }[] = [
  { value: 'WHATSAPP',      label: 'WhatsApp' },
  { value: 'SOCIAL_MEDIA',  label: 'Social media' },
  { value: 'WORD_OF_MOUTH', label: 'A friend told me' },
  { value: 'SEARCH_ENGINE', label: 'Search engine' },
  { value: 'OTHER',         label: 'Other' },
];

export const CREDIT_LOG_REASON_LABELS: Record<CreditTransactionType, string> = {
  SIGNUP_BONUS:  'Signup bonus',
  SURVEY_REWARD: 'Completed a survey',
  BOOST_SPEND:   'Boosted a survey',
  PURCHASE:      'Purchased credits',
};
