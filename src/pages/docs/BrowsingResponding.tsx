import { motion } from 'motion/react';
import { Search, Filter, MousePointerClick, CheckCircle2, Coins, AlertTriangle, BookOpen, ShoppingBag, Cpu, HeartPulse, FlaskConical, Info } from 'lucide-react';

const categories = [
  { name: 'Academic', icon: BookOpen, description: 'Research papers, dissertations, thesis studies, and classroom projects.' },
  { name: 'Social', icon: CheckCircle2, description: 'Community issues, lifestyle, culture, and social behaviour research.' },
  { name: 'Market Research', icon: ShoppingBag, description: 'Consumer preferences, product testing, and business viability studies.' },
  { name: 'Technology', icon: Cpu, description: 'Tech adoption, digital behaviour, software usability, and innovation studies.' },
  { name: 'Health', icon: HeartPulse, description: 'Health behaviours, wellness, medical research, and public health studies.' },
  { name: 'Science', icon: FlaskConical, description: 'Scientific research, experiments, environmental studies, and STEM projects.' },
];

const takingSteps = [
  { icon: Search, text: 'Open the Browse feed from the home page. Use the category filter pills to narrow down surveys by topic.' },
  { icon: MousePointerClick, text: 'Click "Take Survey" on any card that interests you. The card shows the credit reward and estimated time.' },
  { icon: CheckCircle2, text: 'Answer each question carefully, then submit. Your credit reward is added to your balance instantly.' },
  { icon: Coins, text: 'Check your updated credit balance in the navigation bar — the new credits appear immediately after submission.' },
];

export default function BrowsingResponding() {
  return (
    <div className="space-y-8 pb-12">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h1 className="text-3xl sm:text-4xl font-black text-stone-900 tracking-tight mb-3">
          Browsing & Responding
        </h1>
        <p className="text-stone-500 text-sm sm:text-base font-medium max-w-2xl">
          The Browse feed is where you discover surveys posted by other researchers. Complete surveys to earn credits and contribute to the community's data.
        </p>
      </motion.div>

      {/* How the feed works */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05, duration: 0.3 }}
        className="bg-white rounded-3xl border border-stone-200 shadow-sm overflow-hidden"
      >
        <div className="px-6 sm:px-8 py-5 border-b border-stone-100 bg-stone-50 flex items-center gap-2">
          <Filter className="w-4 h-4 text-stone-400" aria-hidden="true" />
          <h2 className="text-sm font-black text-stone-900 uppercase tracking-widest">How the feed works</h2>
        </div>
        <div className="px-6 sm:px-8 py-6 space-y-4">
          <p className="text-sm text-stone-600 leading-relaxed">
            The feed shows all <strong className="text-stone-800">ACTIVE</strong> surveys from all users. Surveys that have been boosted appear at the top and carry a <strong className="text-stone-800">Boosted</strong> badge. Non-boosted surveys are ordered by recency.
          </p>
          <p className="text-sm text-stone-600 leading-relaxed">
            Use the <strong className="text-stone-800">category filter pills</strong> at the top of the feed to show only surveys in a particular topic area. Selecting "All" removes the filter and shows every active survey.
          </p>
          <div className="bg-stone-50 border border-stone-100 rounded-2xl p-4 flex items-start gap-3">
            <Info className="w-4 h-4 text-stone-400 shrink-0 mt-0.5" aria-hidden="true" />
            <p className="text-sm text-stone-500">Each survey card shows the credit reward, category badge, estimated completion time, and the number of responses collected so far.</p>
          </div>
        </div>
      </motion.div>

      {/* How to take a survey */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.3 }}
        className="bg-white rounded-3xl border border-stone-200 shadow-sm overflow-hidden"
      >
        <div className="px-6 sm:px-8 py-5 border-b border-stone-100 bg-stone-50 flex items-center gap-2">
          <MousePointerClick className="w-4 h-4 text-emerald-600" aria-hidden="true" />
          <h2 className="text-sm font-black text-stone-900 uppercase tracking-widest">How to take a survey</h2>
        </div>
        <div className="divide-y divide-stone-50">
          {takingSteps.map(({ icon: Icon, text }, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15 + i * 0.06, duration: 0.25 }}
              className="flex items-start gap-4 px-6 sm:px-8 py-5"
            >
              <div className="flex flex-col items-center gap-1.5 shrink-0">
                <div className="w-10 h-10 bg-white rounded-xl border border-stone-200 flex items-center justify-center text-emerald-700">
                  <Icon className="w-4 h-4" aria-hidden="true" />
                </div>
                <span className="text-[10px] font-black text-stone-300">{String(i + 1).padStart(2, '0')}</span>
              </div>
              <p className="text-sm text-stone-600 leading-relaxed pt-1">{text}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Eligibility rules */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.3 }}
        className="bg-white rounded-3xl border border-stone-200 shadow-sm overflow-hidden"
      >
        <div className="px-6 sm:px-8 py-5 border-b border-stone-100 bg-stone-50 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-500" aria-hidden="true" />
          <h2 className="text-sm font-black text-stone-900 uppercase tracking-widest">Eligibility rules</h2>
        </div>
        <div className="px-6 sm:px-8 py-6 space-y-3">
          {[
            { rule: 'You cannot complete your own surveys.', detail: 'Surveys you created will not appear as completable when you view them. This prevents self-reported data from inflating your response count.' },
            { rule: 'Each survey can only be completed once per user.', detail: 'Once you submit, the survey is marked as completed for your account. Revisiting the survey URL will show your previous responses.' },
          ].map(({ rule, detail }) => (
            <div key={rule} className="flex items-start gap-3 py-2">
              <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" aria-hidden="true" />
              <div>
                <p className="text-sm font-black text-stone-900 mb-0.5">{rule}</p>
                <p className="text-sm text-stone-500 leading-relaxed">{detail}</p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Categories */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25, duration: 0.3 }}
        className="bg-white rounded-3xl border border-stone-200 shadow-sm overflow-hidden"
      >
        <div className="px-6 sm:px-8 py-5 border-b border-stone-100 bg-stone-50">
          <h2 className="text-sm font-black text-stone-900 uppercase tracking-widest">Survey categories</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-0 divide-y sm:divide-y-0 sm:divide-x divide-stone-50">
          {categories.map(({ name, icon: Icon, description }, i) => (
            <motion.div
              key={name}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 + i * 0.04, duration: 0.25 }}
              className="flex items-start gap-3 px-6 sm:px-8 py-5 border-b border-stone-50 last:border-0"
            >
              <div className="w-9 h-9 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-700 shrink-0">
                <Icon className="w-4 h-4" aria-hidden="true" />
              </div>
              <div>
                <p className="text-sm font-black text-stone-900 mb-0.5">{name}</p>
                <p className="text-xs text-stone-500 leading-relaxed">{description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
