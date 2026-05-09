import { motion } from 'motion/react';
import { CheckSquare, Circle, AlignLeft, AlignJustify, Star, ToggleLeft, FileSpreadsheet, Settings, ArrowRight, Info, Zap } from 'lucide-react';

const questionTypes = [
  {
    icon: Circle,
    name: 'Multiple Choice',
    code: 'multiple_choice',
    description: 'Respondent selects exactly one option from a list. Best for mutually exclusive answers (e.g., "Which year are you in?").',
  },
  {
    icon: CheckSquare,
    name: 'Checkbox',
    code: 'checkbox',
    description: 'Respondent can select one or more options. Best when multiple answers are valid (e.g., "Which platforms do you use?").',
  },
  {
    icon: AlignLeft,
    name: 'Short Text',
    code: 'short_text',
    description: 'Single-line free-text response. Best for brief answers like names, locations, or single-sentence opinions.',
  },
  {
    icon: AlignJustify,
    name: 'Long Text',
    code: 'long_text',
    description: 'Multi-line free-text response. Best for detailed feedback, descriptions, or open-ended reflections.',
  },
  {
    icon: Star,
    name: 'Rating',
    code: 'rating',
    description: 'Respondent picks a number from 1 to 5. Best for satisfaction scores, importance ratings, or frequency scales.',
  },
  {
    icon: ToggleLeft,
    name: 'Yes / No',
    code: 'yes_no',
    description: 'Simple binary choice. Best for screening questions or confirming facts.',
  },
];

const surveySettings = [
  { field: 'Title', required: true, note: 'Keep it clear and specific. It appears on the survey card in the feed.' },
  { field: 'Description', required: false, note: 'Provide context for potential respondents: why you\'re running this survey and how long it takes.' },
  { field: 'Category', required: true, note: 'One of: Academic, Social, Market Research, Technology, Health, Science.' },
  { field: 'Estimated completion time', required: false, note: 'Shown on the survey card to help respondents decide if they have time.' },
  { field: 'Target responses', required: false, note: 'The number of responses you\'re aiming to collect. Shown as a progress bar in analytics.' },
];

const statusSteps = [
  { status: 'DRAFT', color: 'bg-stone-100 text-stone-600', description: 'Saved but not visible in the public feed. Only you can see it from your Dashboard.' },
  { status: 'ACTIVE', color: 'bg-emerald-100 text-emerald-700', description: 'Published and visible to all platform users. Respondents can find and complete it.' },
  { status: 'CLOSED', color: 'bg-amber-100 text-amber-700', description: 'No longer accepting responses. Still visible in your Dashboard and analytics are still accessible.' },
];

export default function CreatingSurveys() {
  return (
    <div className="space-y-8 pb-12">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h1 className="text-3xl sm:text-4xl font-black text-stone-900 tracking-tight mb-3">
          Creating Surveys
        </h1>
        <p className="text-stone-500 text-sm sm:text-base font-medium max-w-2xl">
          Build your survey using the survey builder at <strong>/create</strong>. Add questions one by one or bulk-import them from an Excel file. Once you're ready, publish to make your survey live in the feed.
        </p>
      </motion.div>

      {/* Question types */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05, duration: 0.3 }}
        className="bg-white rounded-3xl border border-stone-200 shadow-sm overflow-hidden"
      >
        <div className="px-6 sm:px-8 py-5 border-b border-stone-100 bg-stone-50">
          <h2 className="text-sm font-black text-stone-900 uppercase tracking-widest">Question types</h2>
        </div>
        <div className="divide-y divide-stone-50">
          {questionTypes.map(({ icon: Icon, name, code, description }, i) => (
            <motion.div
              key={code}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 + i * 0.05, duration: 0.25 }}
              className="flex items-start gap-4 px-6 sm:px-8 py-5"
            >
              <div className="w-10 h-10 bg-white rounded-xl border border-stone-200 flex items-center justify-center text-emerald-700 shrink-0">
                <Icon className="w-4.5 h-4.5" aria-hidden="true" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <span className="text-sm font-black text-stone-900">{name}</span>
                  <code className="text-[10px] font-mono bg-stone-100 text-stone-500 px-1.5 py-0.5 rounded-md">{code}</code>
                </div>
                <p className="text-sm text-stone-500 leading-relaxed">{description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Survey settings */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.3 }}
        className="bg-white rounded-3xl border border-stone-200 shadow-sm overflow-hidden"
      >
        <div className="px-6 sm:px-8 py-5 border-b border-stone-100 bg-stone-50 flex items-center gap-2">
          <Settings className="w-4 h-4 text-stone-400" aria-hidden="true" />
          <h2 className="text-sm font-black text-stone-900 uppercase tracking-widest">Survey settings</h2>
        </div>
        <div className="divide-y divide-stone-50">
          {surveySettings.map(({ field, required, note }) => (
            <div key={field} className="flex items-start gap-3 px-6 sm:px-8 py-4">
              <div className="mt-0.5 shrink-0">
                {required
                  ? <span className="text-[10px] font-black text-emerald-700 bg-emerald-50 border border-emerald-100 px-1.5 py-0.5 rounded-md uppercase">Required</span>
                  : <span className="text-[10px] font-black text-stone-400 bg-stone-50 border border-stone-100 px-1.5 py-0.5 rounded-md uppercase">Optional</span>
                }
              </div>
              <div>
                <p className="text-sm font-black text-stone-900 mb-0.5">{field}</p>
                <p className="text-sm text-stone-500">{note}</p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Status flow */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.3 }}
        className="bg-white rounded-3xl border border-stone-200 shadow-sm overflow-hidden"
      >
        <div className="px-6 sm:px-8 py-5 border-b border-stone-100 bg-stone-50">
          <h2 className="text-sm font-black text-stone-900 uppercase tracking-widest">Survey status flow</h2>
        </div>
        <div className="px-6 sm:px-8 py-6">
          <div className="flex items-center gap-2 mb-6 flex-wrap">
            {statusSteps.map(({ status }, i) => (
              <div key={status} className="flex items-center gap-2">
                <span className={`px-3 py-1 rounded-full text-xs font-black ${statusSteps[i].color}`}>{status}</span>
                {i < statusSteps.length - 1 && <ArrowRight className="w-3.5 h-3.5 text-stone-300" aria-hidden="true" />}
              </div>
            ))}
          </div>
          <div className="space-y-3">
            {statusSteps.map(({ status, color, description }) => (
              <div key={status} className="flex items-start gap-3">
                <span className={`px-2 py-0.5 rounded-lg text-[10px] font-black shrink-0 mt-0.5 ${color}`}>{status}</span>
                <p className="text-sm text-stone-500">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Excel import */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25, duration: 0.3 }}
        className="bg-white rounded-3xl border border-stone-200 shadow-sm overflow-hidden"
      >
        <div className="px-6 sm:px-8 py-5 border-b border-stone-100 bg-stone-50 flex items-center gap-2">
          <FileSpreadsheet className="w-4 h-4 text-emerald-600" aria-hidden="true" />
          <h2 className="text-sm font-black text-stone-900 uppercase tracking-widest">Bulk import via Excel</h2>
        </div>
        <div className="px-6 sm:px-8 py-6 space-y-5">
          <p className="text-sm text-stone-600 leading-relaxed">
            If you have many questions prepared in advance, you can upload them all at once using a spreadsheet instead of adding them one by one.
          </p>
          <div className="space-y-3">
            {[
              { step: '1', text: 'In the survey builder, click "Import from Spreadsheet" to open the import modal.' },
              { step: '2', text: 'Download the provided Excel template. It has the required column headers pre-filled.' },
              { step: '3', text: 'Fill in your questions. Each row is one question.' },
              { step: '4', text: 'Upload the completed file. The questions are added to your survey instantly.' },
            ].map(({ step, text }) => (
              <div key={step} className="flex items-start gap-3">
                <div className="w-6 h-6 bg-emerald-700 rounded-full flex items-center justify-center text-white text-[10px] font-black shrink-0 mt-0.5">{step}</div>
                <p className="text-sm text-stone-600">{text}</p>
              </div>
            ))}
          </div>
          <div className="bg-stone-50 rounded-2xl p-4 space-y-2">
            <p className="text-xs font-black text-stone-700 uppercase tracking-widest mb-2">Required spreadsheet columns</p>
            {[
              { col: 'question', desc: 'The question text.' },
              { col: 'type', desc: 'One of: multiple_choice, checkbox, short_text, long_text, rating, yes_no' },
              { col: 'options', desc: 'Comma-separated option values (required for multiple_choice and checkbox; leave blank for others).' },
            ].map(({ col, desc }) => (
              <div key={col} className="flex items-start gap-2">
                <code className="text-[11px] font-mono bg-white border border-stone-200 px-1.5 py-0.5 rounded text-emerald-700 shrink-0">{col}</code>
                <span className="text-xs text-stone-500">{desc}</span>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Cost note */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.3 }}
        className="bg-emerald-50 border border-emerald-100 rounded-2xl p-5 flex items-start gap-3"
      >
        <Zap className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" aria-hidden="true" />
        <div>
          <p className="text-sm font-black text-emerald-900 mb-1">Publishing is free</p>
          <p className="text-sm text-emerald-700 leading-relaxed">
            Creating and publishing a survey costs no credits. Credits are only spent when you choose to <strong>boost</strong> a survey for extra visibility. See the <a href="/docs/credits" className="underline underline-offset-2">Credits System guide</a> for pricing.
          </p>
        </div>
      </motion.div>

      {/* Quality tip */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35, duration: 0.3 }}
        className="bg-stone-50 border border-stone-200 rounded-2xl p-5 flex items-start gap-3"
      >
        <Info className="w-5 h-5 text-stone-400 shrink-0 mt-0.5" aria-hidden="true" />
        <div>
          <p className="text-sm font-black text-stone-700 mb-1">Write clear, unambiguous questions</p>
          <p className="text-sm text-stone-500 leading-relaxed">
            Respondents complete surveys faster when questions are easy to understand. Avoid double negatives, jargon, and leading phrasing. Clearer questions produce higher-quality data.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
