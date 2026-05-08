# Frontend Data Collection Specification

**Platform:** SurveyExchange  
**Frontend:** React (React Query for server state, Zustand for client state)  
**Companion to:** `data-collection-spec.md`  
**Version:** 1.0 — MVP + Analytics Foundation  

---

## 1. Overview

This document specifies all frontend changes required to support the data model additions in `data-collection-spec.md`. It covers form changes, new fields, state management, client-side measurement logic, and UI behaviour changes.

### Priority legend

| Tag | Meaning |
|---|---|
| `[MVP]` | Required for core functionality |
| `[ANALYTICS]` | Collect now — single field, low effort, high future value |
| `[FUTURE]` | Defer — UI not needed until feature is built |

---

## 2. Registration Form

### 2.1 New required fields

`academic_level` is the only new required field at registration. All others are optional but should be presented to encourage completion.

| Field | Input type | Required | Tag |
|---|---|---|---|
| `academicLevel` | `<select>` | Yes | `[MVP]` |
| `yearOfStudy` | `<select>` (1–8) | Conditional | `[ANALYTICS]` |
| `gender` | `<select>` + "Prefer not to say" | No | `[ANALYTICS]` |
| `ageRange` | `<select>` | No | `[ANALYTICS]` |
| `referralSource` | `<select>` | No | `[ANALYTICS]` |

### 2.2 Conditional visibility

`yearOfStudy` should only appear when `academicLevel` is `UNDERGRADUATE` or `POSTGRADUATE_MASTERS` / `POSTGRADUATE_PHD`. Hide it for `LECTURER` and `RESEARCHER`.

```jsx
const showYearOfStudy = ['UNDERGRADUATE', 'POSTGRADUATE_MASTERS', 'POSTGRADUATE_PHD']
  .includes(watch('academicLevel'));

{showYearOfStudy && (
  <SelectField
    name="yearOfStudy"
    label="Year of Study"
    options={[1, 2, 3, 4, 5, 6, 7, 8].map(n => ({ value: n, label: `Year ${n}` }))}
  />
)}
```

### 2.3 Select options

```js
export const ACADEMIC_LEVEL_OPTIONS = [
  { value: 'UNDERGRADUATE',         label: 'Undergraduate' },
  { value: 'POSTGRADUATE_MASTERS',  label: 'Postgraduate — Masters' },
  { value: 'POSTGRADUATE_PHD',      label: 'Postgraduate — PhD' },
  { value: 'LECTURER',              label: 'Lecturer' },
  { value: 'RESEARCHER',            label: 'Researcher' },
  { value: 'OTHER',                 label: 'Other' },
];

export const GENDER_OPTIONS = [
  { value: 'MALE',               label: 'Male' },
  { value: 'FEMALE',             label: 'Female' },
  { value: 'NON_BINARY',         label: 'Non-binary' },
  { value: 'PREFER_NOT_TO_SAY',  label: 'Prefer not to say' },
];

export const AGE_RANGE_OPTIONS = [
  { value: 'UNDER_18',   label: 'Under 18' },
  { value: 'AGE_18_24',  label: '18–24' },
  { value: 'AGE_25_34',  label: '25–34' },
  { value: 'AGE_35_44',  label: '35–44' },
  { value: 'AGE_45_PLUS', label: '45 and above' },
];

export const REFERRAL_SOURCE_OPTIONS = [
  { value: 'WHATSAPP',      label: 'WhatsApp' },
  { value: 'SOCIAL_MEDIA',  label: 'Social media' },
  { value: 'WORD_OF_MOUTH', label: 'A friend told me' },
  { value: 'SEARCH_ENGINE', label: 'Search engine' },
  { value: 'OTHER',         label: 'Other' },
];
```

### 2.4 Registration request payload

```js
// POST /api/auth/register
{
  fullName:        "Ama Owusu",
  email:           "ama@ug.edu.gh",
  password:        "••••••••",
  institution:     "University of Ghana",
  fieldOfStudy:    "Computer Science",
  academicLevel:   "UNDERGRADUATE",       // required
  yearOfStudy:     3,                     // conditional
  gender:          "FEMALE",              // optional — omit key if not selected
  ageRange:        "AGE_18_24",           // optional — omit key if not selected
  referralSource:  "WHATSAPP",            // optional — omit key if not selected
}
```

Omit optional keys entirely when not selected — don't send `null` or empty string. The backend treats absent keys as null.

### 2.5 Optional fields UX note

Group the optional fields under a collapsible "Help us match you better" section to reduce form abandonment. These fields improve respondent targeting but should not feel mandatory.

```jsx
<Disclosure>
  <Disclosure.Button>Help us match you better (optional)</Disclosure.Button>
  <Disclosure.Panel>
    <SelectField name="gender" ... />
    <SelectField name="ageRange" ... />
    <SelectField name="referralSource" ... />
  </Disclosure.Panel>
</Disclosure>
```

---

## 3. Survey Creation Form

### 3.1 New fields

| Field | Input type | Required | Tag |
|---|---|---|---|
| `targetResponseCount` | `<input type="number">` | Yes | `[MVP]` |
| `status` | Implicit — always `DRAFT` on create | — | `[MVP]` |

`targetResponseCount` is the only meaningful addition to the creation form. Surveys are created as `DRAFT` by default; a separate "Publish" action transitions them to `ACTIVE`.

### 3.2 Draft / Publish flow

The creation form now has two submit actions:

```jsx
<Button variant="secondary" onClick={handleSaveDraft}>
  Save as Draft
</Button>
<Button variant="primary" onClick={handlePublish}>
  Save & Publish
</Button>
```

Both call `POST /api/surveys` but with different status values:

```js
// Save as draft
{ ...surveyData, status: 'DRAFT' }

// Publish immediately
{ ...surveyData, status: 'ACTIVE' }
```

### 3.3 My Surveys page — updated survey card

Each survey card in the creator's dashboard should now display:

| Data point | Source | Tag |
|---|---|---|
| Status badge (`DRAFT` / `ACTIVE` / `CLOSED`) | `survey.status` | `[MVP]` |
| Response progress (`42 / 100 responses`) | `actualResponseCount / targetResponseCount` | `[MVP]` |
| Progress bar (percentage fill) | Derived | `[MVP]` |
| Published date | `survey.publishedAt` | `[ANALYTICS]` |
| Boost expiry countdown (if active) | `survey.boostExpiresAt` | `[MVP]` |

```jsx
const progressPercent = Math.min(
  Math.round((survey.actualResponseCount / survey.targetResponseCount) * 100),
  100
);

// Boost expiry — show remaining time if active
const boostActive = survey.boostExpiresAt && isAfter(parseISO(survey.boostExpiresAt), new Date());
const boostLabel = boostActive
  ? `Boosted — expires in ${formatDistanceToNow(parseISO(survey.boostExpiresAt))}`
  : null;
```

### 3.4 Publish / Close toggle on existing surveys

Add action buttons to the survey card for status transitions:

| Current status | Available actions |
|---|---|
| `DRAFT` | "Publish" |
| `ACTIVE` | "Close survey" |
| `CLOSED` | "Re-open" |

```js
// PATCH /api/surveys/:id
{ status: 'ACTIVE' }   // Publish
{ status: 'CLOSED' }   // Close
```

On success, invalidate the `['my-surveys']` query cache so the card re-renders with the new status immediately.

---

## 4. Survey Response Flow

### 4.1 Timing — `timeToCompleteSeconds`

Start a timer when the survey detail page first renders (not when the user clicks "Start" — keep it simple for MVP). Submit elapsed time with the response payload.

```jsx
// hooks/useSurveyTimer.js
export function useSurveyTimer() {
  const startTimeRef = useRef(Date.now());

  const getElapsedSeconds = useCallback(() => {
    return Math.floor((Date.now() - startTimeRef.current) / 1000);
  }, []);

  return { getElapsedSeconds };
}
```

```jsx
// SurveyDetailPage.jsx
const { getElapsedSeconds } = useSurveyTimer();

const { mutate: submitResponse } = useMutation({
  mutationFn: (answers) =>
    api.post(`/surveys/${surveyId}/responses`, {
      answers,
      timeToCompleteSeconds: getElapsedSeconds(),
    }),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['feed'] });
    queryClient.invalidateQueries({ queryKey: ['user', 'balance'] });
  }
});
```

The timer resets naturally on page unmount — no cleanup needed. If the user navigates away and returns, the timer restarts, which is acceptable for MVP. The backend caps and floors the value regardless.

### 4.2 Per-question answer payload

Answers must be submitted as an array of `{ questionId, answerValue }` objects — not a map or blob. This aligns with the `response_answers` table structure.

```js
// POST /api/surveys/:id/responses
{
  timeToCompleteSeconds: 142,
  answers: [
    { questionId: 1, answerValue: "Option A" },
    { questionId: 2, answerValue: "4" },             // rating
    { questionId: 3, answerValue: "Yes" },            // yes/no
    { questionId: 4, answerValue: "Short text here" },
    { questionId: 5, answerValue: "Option B,Option D" } // checkbox — comma-separated
  ]
}
```

### 4.3 Answer serialisation by question type

| Question type | `answerValue` format | Example |
|---|---|---|
| Multiple choice | Selected option string | `"Option A"` |
| Checkbox | Comma-separated selected options | `"Option B,Option D"` |
| Short text | Raw string | `"I think that..."` |
| Rating (1–5) | Stringified integer | `"4"` |
| Yes/No | `"Yes"` or `"No"` | `"Yes"` |

All values are serialised as strings on the frontend and stored as `TEXT` on the backend. Type coercion happens at the analytics layer, not in the submission path.

### 4.4 Credit balance update after response

On successful submission, update the balance immediately from the response payload without a separate fetch:

```js
onSuccess: (data) => {
  // Update balance from response — no refetch
  queryClient.setQueryData(['user', 'balance'], data.newBalance);

  // Invalidate feed (answered survey disappears)
  queryClient.invalidateQueries({ queryKey: ['feed'] });
}
```

---

## 5. User Profile

### 5.1 Profile page — display new fields

The profile page (or settings page) should display and allow editing of the new user fields:

| Field | Editable? | Notes |
|---|---|---|
| `academicLevel` | Yes | Dropdown |
| `yearOfStudy` | Yes | Conditional on `academicLevel` |
| `gender` | Yes | Dropdown with "Prefer not to say" |
| `ageRange` | Yes | Dropdown |
| `institution` | Yes | Text input |
| `fieldOfStudy` | Yes | Text input |
| `referralSource` | No | Set once at signup; not shown after |
| `createdAt` | No | Display only — "Member since" |

### 5.2 Profile update payload

```js
// PATCH /api/users/me
{
  institution:   "KNUST",
  fieldOfStudy:  "Electrical Engineering",
  academicLevel: "POSTGRADUATE_MASTERS",
  yearOfStudy:   2,
  gender:        "MALE",
  ageRange:      "AGE_25_34",
}
```

On success, update the cached user profile:

```js
onSuccess: (data) => {
  queryClient.setQueryData(['user', 'profile'], data);
}
```

---

## 6. Credit History Page

### 6.1 Display requirements

The credit history page lists all `credit_log` entries in reverse chronological order. Each entry should display:

| Data | Source | Notes |
|---|---|---|
| Amount | `log.amount` | Show `+1`, `-5` with colour coding |
| Reason label | `log.reason` | Human-readable — see mapping below |
| Related survey title | `log.survey.title` | Link to survey if still accessible |
| Timestamp | `log.createdAt` | Relative time + absolute on hover |

### 6.2 Reason label mapping

```js
export const CREDIT_LOG_REASON_LABELS = {
  SIGNUP_BONUS:     'Signup bonus',
  SURVEY_RESPONSE:  'Completed a survey',
  BOOST:            'Boosted a survey',
};
```

### 6.3 Colour coding

```js
const amountColour = log.amount > 0 ? 'text-green-600' : 'text-red-500';
const amountLabel  = log.amount > 0 ? `+${log.amount}` : `${log.amount}`;
```

---

## 7. Global State — Zustand Store Changes

If using Zustand for client-side auth/user state, update the user slice to include the new profile fields:

```js
// store/userStore.js
const useUserStore = create((set) => ({
  user: null,   // full profile including new fields
  balance: 0,

  setUser: (user) => set({
    user,
    balance: user.creditBalance,
  }),

  updateBalance: (newBalance) => set({ balance: newBalance }),

  updateProfile: (updates) => set((state) => ({
    user: { ...state.user, ...updates }
  })),
}));
```

`balance` is kept as a top-level key (not nested inside `user`) so components that only care about the balance don't re-render on unrelated profile updates.

---

## 8. React Query — Key Conventions

All query keys affected by the data model changes:

| Query key | Data fetched | Invalidated when |
|---|---|---|
| `['user', 'profile']` | Full user profile incl. new fields | Profile updated |
| `['user', 'balance']` | Credit balance only | Response submitted, boost applied |
| `['user', 'credit-history']` | All credit log entries | Response submitted, boost applied |
| `['my-surveys']` | Creator's surveys with status + progress | Survey created, published, closed, boosted |
| `['feed']` | Paginated survey feed | Response submitted (answered survey removed) |
| `['survey', surveyId]` | Single survey detail + questions | Survey updated |

---

## 9. Error Handling — New Cases

| HTTP Status | Context | User-facing message |
|---|---|---|
| `422` | `academicLevel` missing on register | "Please select your academic level" |
| `409` | Duplicate response submission | "You've already responded to this survey" |
| `402` | Boost with insufficient credits | "You need at least 5 credits to boost" |
| `409` | Boost on already-active boost | "This survey is already boosted until [date]" |

All error toasts should auto-dismiss after 4 seconds. Validation errors on forms (422) should be displayed inline below the relevant field, not as toasts.

---

## 10. What Is Explicitly Deferred

| Feature | Reason |
|---|---|
| Respondent targeting filters on survey creation | Backend matching logic not built yet |
| Per-survey analytics dashboard | Needs sufficient response volume before useful |
| Fraud flag indicators on responses | Backend detection not implemented at MVP |
| "Re-boost / extend" action | Product decision pending — not in MVP spec |
| Profile completeness indicator | Nice to have; not blocking any core flow |

---

*Spec authored for SurveyExchange MVP — internal reference document.*
