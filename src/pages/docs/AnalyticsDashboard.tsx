import { motion } from 'motion/react';
import { BarChart3, Users, TrendingUp, Table, MousePointerClick, Info, Clock } from 'lucide-react';

export default function AnalyticsDashboard() {
  return (
    <div className="space-y-8 pb-12">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h1 className="text-3xl sm:text-4xl font-black text-stone-900 tracking-tight mb-3">
          Analytics Dashboard
        </h1>
        <p className="text-stone-500 text-sm sm:text-base font-medium max-w-2xl">
          Each survey you create has its own analytics page showing how many people have responded, how they answered each question, and a paginated view of individual submissions.
        </p>
      </motion.div>

      {/* Accessing analytics */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05, duration: 0.3 }}
        className="bg-white rounded-3xl border border-stone-200 shadow-sm overflow-hidden"
      >
        <div className="px-6 sm:px-8 py-5 border-b border-stone-100 bg-stone-50 flex items-center gap-2">
          <MousePointerClick className="w-4 h-4 text-emerald-600" aria-hidden="true" />
          <h2 className="text-sm font-black text-stone-900 uppercase tracking-widest">How to access analytics</h2>
        </div>
        <div className="px-6 sm:px-8 py-6 space-y-4">
          <div className="space-y-3">
            {[
              { step: '1', text: 'Go to the Dashboard from the navigation bar.' },
              { step: '2', text: 'Find the survey you want to analyse in your surveys list.' },
              { step: '3', text: 'Click the bar chart icon on the survey card to open the analytics page.' },
            ].map(({ step, text }) => (
              <div key={step} className="flex items-center gap-3">
                <div className="w-6 h-6 bg-emerald-700 rounded-full flex items-center justify-center text-white text-[10px] font-black shrink-0">{step}</div>
                <p className="text-sm text-stone-600">{text}</p>
              </div>
            ))}
          </div>
          <div className="bg-stone-50 border border-stone-100 rounded-2xl p-4 flex items-start gap-3">
            <Info className="w-4 h-4 text-stone-400 shrink-0 mt-0.5" aria-hidden="true" />
            <p className="text-sm text-stone-500">You can also navigate directly to <code className="text-[11px] font-mono bg-white border border-stone-200 px-1 py-0.5 rounded">/survey/:id/analytics</code> if you know the survey ID.</p>
          </div>
        </div>
      </motion.div>

      {/* Overview stats */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.3 }}
        className="bg-white rounded-3xl border border-stone-200 shadow-sm overflow-hidden"
      >
        <div className="px-6 sm:px-8 py-5 border-b border-stone-100 bg-stone-50 flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-emerald-600" aria-hidden="true" />
          <h2 className="text-sm font-black text-stone-900 uppercase tracking-widest">Overview statistics</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-stone-100">
          {[
            {
              icon: Users,
              label: 'Total Responses',
              description: 'The number of users who have submitted a completed response to this survey. Partial or abandoned submissions are not counted.',
            },
            {
              icon: TrendingUp,
              label: 'Completion Rate',
              description: 'The percentage of your target response count that has been reached. Displayed as a progress bar (e.g., 34 / 100 target responses = 34%).',
            },
            {
              icon: Clock,
              label: 'Target Progress',
              description: 'How close you are to your self-set response target. Once you hit 100%, you may choose to close the survey or leave it open.',
            },
          ].map(({ icon: Icon, label, description }) => (
            <div key={label} className="px-6 sm:px-8 py-6">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-700">
                  <Icon className="w-4 h-4" aria-hidden="true" />
                </div>
                <span className="text-xs font-black text-stone-900 uppercase tracking-wider">{label}</span>
              </div>
              <p className="text-sm text-stone-500 leading-relaxed">{description}</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Insights tab */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.3 }}
        className="bg-white rounded-3xl border border-stone-200 shadow-sm overflow-hidden"
      >
        <div className="px-6 sm:px-8 py-5 border-b border-stone-100 bg-stone-50 flex items-center gap-2">
          <BarChart3 className="w-4 h-4 text-emerald-600" aria-hidden="true" />
          <h2 className="text-sm font-black text-stone-900 uppercase tracking-widest">Insights tab</h2>
        </div>
        <div className="px-6 sm:px-8 py-6 space-y-4">
          <p className="text-sm text-stone-600 leading-relaxed">
            The <strong className="text-stone-800">Insights</strong> tab shows a per-question breakdown of all responses. The visualisation type adapts to the question type:
          </p>
          <div className="space-y-3">
            {[
              { type: 'Multiple Choice / Checkbox', viz: 'Horizontal bar chart showing the count and percentage for each option.' },
              { type: 'Rating (1–5)', viz: 'Bar chart showing the distribution of ratings from 1 to 5, plus the average score.' },
              { type: 'Yes / No', viz: 'Simple bar chart with two bars showing Yes and No counts.' },
              { type: 'Short Text / Long Text', viz: 'Scrollable list of individual text responses, shown in chronological order.' },
            ].map(({ type, viz }) => (
              <div key={type} className="flex items-start gap-3 border border-stone-100 rounded-2xl p-4 bg-stone-50">
                <div className="shrink-0">
                  <span className="inline-block text-[10px] font-black uppercase tracking-widest bg-white border border-stone-200 text-stone-600 px-2 py-0.5 rounded-lg">{type}</span>
                </div>
                <p className="text-sm text-stone-500 leading-relaxed">{viz}</p>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Responses tab */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.3 }}
        className="bg-white rounded-3xl border border-stone-200 shadow-sm overflow-hidden"
      >
        <div className="px-6 sm:px-8 py-5 border-b border-stone-100 bg-stone-50 flex items-center gap-2">
          <Table className="w-4 h-4 text-stone-400" aria-hidden="true" />
          <h2 className="text-sm font-black text-stone-900 uppercase tracking-widest">Responses tab</h2>
        </div>
        <div className="px-6 sm:px-8 py-6 space-y-4">
          <p className="text-sm text-stone-600 leading-relaxed">
            The <strong className="text-stone-800">Responses</strong> tab shows a paginated table of individual submissions. Each row is one respondent's complete submission.
          </p>
          <div className="space-y-2">
            {[
              { col: 'Respondent', note: 'An anonymised display identifier — respondents are never identified by name.' },
              { col: 'Submitted At', note: 'The date and time the respondent hit the submit button.' },
              { col: 'Question columns', note: 'One column per question, showing exactly what the respondent selected or typed.' },
            ].map(({ col, note }) => (
              <div key={col} className="flex items-start gap-2">
                <code className="text-[11px] font-mono bg-stone-100 border border-stone-200 px-1.5 py-0.5 rounded text-stone-600 shrink-0 whitespace-nowrap">{col}</code>
                <p className="text-sm text-stone-500">{note}</p>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Export note */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25, duration: 0.3 }}
        className="bg-stone-50 border border-stone-200 rounded-2xl p-5 flex items-start gap-3"
      >
        <Info className="w-5 h-5 text-stone-400 shrink-0 mt-0.5" aria-hidden="true" />
        <div>
          <p className="text-sm font-black text-stone-700 mb-1">Data export is coming soon</p>
          <p className="text-sm text-stone-500 leading-relaxed">
            Analytics are currently view-only in the browser. The ability to export response data as an Excel or CSV file is a planned feature and will be added in a future release.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
