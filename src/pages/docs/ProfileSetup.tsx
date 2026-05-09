import { motion } from 'motion/react';
import { User, GraduationCap, BarChart3, Shield, CheckCircle2, Info, Target } from 'lucide-react';

const academicLevels = [
  'Undergraduate (Year 1–2)',
  'Undergraduate (Year 3–4)',
  'Postgraduate (Masters)',
  'Postgraduate (PhD / MPhil)',
  'Diploma / Certificate',
  'Alumni / Researcher',
];

const statCards = [
  { label: 'Surveys Created', description: 'Total number of surveys you have published on the platform (any status).' },
  { label: 'Surveys Answered', description: 'Total number of other users\' surveys you have completed and submitted.' },
  { label: 'Credits Earned', description: 'Cumulative credits earned through survey completions and your signup bonus.' },
  { label: 'Credits Spent', description: 'Cumulative credits spent on credit packages and survey boosts.' },
];

export default function ProfileSetup() {
  return (
    <div className="space-y-8 pb-12">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h1 className="text-3xl sm:text-4xl font-black text-stone-900 tracking-tight mb-3">
          Profile Setup
        </h1>
        <p className="text-stone-500 text-sm sm:text-base font-medium max-w-2xl">
          Your profile stores your academic identity. The more complete it is, the better the platform can match you with relevant surveys — and the better researchers can target their survey audience.
        </p>
      </motion.div>

      {/* Why it matters */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05, duration: 0.3 }}
        className="bg-emerald-50 border border-emerald-100 rounded-2xl p-5 flex items-start gap-3"
      >
        <Target className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" aria-hidden="true" />
        <div>
          <p className="text-sm font-black text-emerald-900 mb-1">Why profile completeness matters</p>
          <p className="text-sm text-emerald-700 leading-relaxed">
            Survey creators can restrict their surveys to specific academic levels, institutions, fields of study, age ranges, and genders. A complete profile ensures you can see — and are counted for — the surveys most relevant to your background.
          </p>
        </div>
      </motion.div>

      {/* Academic fields */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.3 }}
        className="bg-white rounded-3xl border border-stone-200 shadow-sm overflow-hidden"
      >
        <div className="px-6 sm:px-8 py-5 border-b border-stone-100 bg-stone-50 flex items-center gap-2">
          <GraduationCap className="w-4 h-4 text-emerald-600" aria-hidden="true" />
          <h2 className="text-sm font-black text-stone-900 uppercase tracking-widest">Academic information</h2>
        </div>
        <div className="divide-y divide-stone-50">
          {[
            {
              field: 'Institution',
              required: true,
              note: 'Your university, college, or research institution. Helps match you with surveys from your institution.',
            },
            {
              field: 'Field of Study',
              required: true,
              note: 'Your academic discipline (e.g., Computer Science, Economics, Medicine). Used for subject-specific survey targeting.',
            },
            {
              field: 'Academic Level',
              required: true,
              note: 'Your current level of study. Used by researchers who need responses from a specific academic tier.',
              options: academicLevels,
            },
            {
              field: 'Year of Study',
              required: false,
              note: 'Your current year or semester (shown when applicable to your academic level).',
            },
          ].map(({ field, required, note, options }) => (
            <div key={field} className="px-6 sm:px-8 py-5">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm font-black text-stone-900">{field}</span>
                {required
                  ? <span className="text-[10px] font-black text-emerald-700 bg-emerald-50 border border-emerald-100 px-1.5 py-0.5 rounded-md uppercase">Required</span>
                  : <span className="text-[10px] font-black text-stone-400 bg-stone-50 border border-stone-100 px-1.5 py-0.5 rounded-md uppercase">Optional</span>
                }
              </div>
              <p className="text-sm text-stone-500 mb-2">{note}</p>
              {options && (
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {options.map((opt) => (
                    <span key={opt} className="text-[11px] font-bold text-stone-600 bg-stone-100 px-2 py-0.5 rounded-lg">{opt}</span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </motion.div>

      {/* Personal info */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.3 }}
        className="bg-white rounded-3xl border border-stone-200 shadow-sm overflow-hidden"
      >
        <div className="px-6 sm:px-8 py-5 border-b border-stone-100 bg-stone-50 flex items-center gap-2">
          <User className="w-4 h-4 text-stone-400" aria-hidden="true" />
          <h2 className="text-sm font-black text-stone-900 uppercase tracking-widest">Personal information (optional)</h2>
        </div>
        <div className="divide-y divide-stone-50">
          {[
            {
              field: 'Gender',
              note: 'Entirely optional. Used only when a researcher specifically targets a survey at a particular gender group.',
            },
            {
              field: 'Age Range',
              note: 'Entirely optional. Used only when a researcher restricts responses to a specific age bracket.',
            },
          ].map(({ field, note }) => (
            <div key={field} className="flex items-start gap-3 px-6 sm:px-8 py-5">
              <CheckCircle2 className="w-4 h-4 text-stone-300 shrink-0 mt-0.5" aria-hidden="true" />
              <div>
                <p className="text-sm font-black text-stone-900 mb-0.5">{field}</p>
                <p className="text-sm text-stone-500">{note}</p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Privacy note */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.3 }}
        className="bg-stone-50 border border-stone-200 rounded-2xl p-5 flex items-start gap-3"
      >
        <Shield className="w-5 h-5 text-stone-400 shrink-0 mt-0.5" aria-hidden="true" />
        <div>
          <p className="text-sm font-black text-stone-700 mb-1">Your personal data stays private</p>
          <p className="text-sm text-stone-500 leading-relaxed">
            Demographic details (gender, age range) are never shown to other users or survey creators in identifiable form. They are used only for anonymous aggregate matching and are never included in exported analytics.
          </p>
        </div>
      </motion.div>

      {/* Stat cards */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25, duration: 0.3 }}
        className="bg-white rounded-3xl border border-stone-200 shadow-sm overflow-hidden"
      >
        <div className="px-6 sm:px-8 py-5 border-b border-stone-100 bg-stone-50 flex items-center gap-2">
          <BarChart3 className="w-4 h-4 text-emerald-600" aria-hidden="true" />
          <h2 className="text-sm font-black text-stone-900 uppercase tracking-widest">Your stats</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-stone-100">
          {statCards.map(({ label, description }) => (
            <div key={label} className="px-6 sm:px-8 py-5 border-b border-stone-50 last:border-0">
              <p className="text-xs font-black uppercase tracking-widest text-stone-400 mb-1">{label}</p>
              <p className="text-sm text-stone-600 leading-relaxed">{description}</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Account details */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.3 }}
        className="bg-white rounded-3xl border border-stone-200 shadow-sm overflow-hidden"
      >
        <div className="px-6 sm:px-8 py-5 border-b border-stone-100 bg-stone-50">
          <h2 className="text-sm font-black text-stone-900 uppercase tracking-widest">Account details</h2>
        </div>
        <div className="px-6 sm:px-8 py-6 space-y-3">
          {[
            { field: 'Email address', note: 'Read-only. This is your login identifier and cannot be changed.' },
            { field: 'Member since', note: 'The date your account was created.' },
            { field: 'Account ID', note: 'A unique identifier for your account. Useful if you need to contact support.' },
          ].map(({ field, note }) => (
            <div key={field} className="flex items-start gap-3">
              <Info className="w-4 h-4 text-stone-300 shrink-0 mt-0.5" aria-hidden="true" />
              <div>
                <span className="text-sm font-black text-stone-900">{field}: </span>
                <span className="text-sm text-stone-500">{note}</span>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
