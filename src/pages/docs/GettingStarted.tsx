import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { UserPlus, LogIn, User, PlusCircle, Search, Coins, ArrowRight, CheckCircle2, Info } from 'lucide-react';

const steps = [
  {
    number: '01',
    icon: UserPlus,
    title: 'Create your account',
    description: 'Sign up with your name, email address, and a password. You\'ll receive 10 bonus credits the moment your account is created.',
  },
  {
    number: '02',
    icon: LogIn,
    title: 'Log in',
    description: 'Use your email and password to log in. Your session is saved so you won\'t need to log in again on the same device.',
  },
  {
    number: '03',
    icon: User,
    title: 'Complete your profile',
    description: 'Add your institution, field of study, and academic level. A complete profile helps the platform match you with the most relevant surveys.',
  },
];

const nextSteps = [
  {
    icon: PlusCircle,
    title: 'Create a Survey',
    description: 'Build and publish your first survey. Choose question types, set categories, and reach your target audience.',
    link: '/docs/creating-surveys',
    linkLabel: 'Creating Surveys guide',
  },
  {
    icon: Search,
    title: 'Browse & Respond',
    description: 'Explore surveys posted by other researchers. Complete them to earn credits.',
    link: '/docs/browsing-responding',
    linkLabel: 'Browsing & Responding guide',
  },
  {
    icon: Coins,
    title: 'Understand Credits',
    description: 'Learn how the credit economy works — how you earn, spend, and boost your surveys.',
    link: '/docs/credits',
    linkLabel: 'Credits System guide',
  },
];

export default function GettingStarted() {
  return (
    <div className="space-y-8 pb-12">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h1 className="text-3xl sm:text-4xl font-black text-stone-900 tracking-tight mb-3">
          Getting Started
        </h1>
        <p className="text-stone-500 text-sm sm:text-base font-medium max-w-2xl">
          SurveyXchange Ghana is a peer-to-peer survey platform for Ghanaian students and researchers. Post surveys to collect responses, respond to others' surveys to earn credits, and use those credits to boost your own research.
        </p>
      </motion.div>

      {/* Steps */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05, duration: 0.3 }}
        className="bg-white rounded-3xl border border-stone-200 shadow-sm overflow-hidden"
      >
        <div className="px-6 sm:px-8 py-5 border-b border-stone-100 bg-stone-50">
          <h2 className="text-sm font-black text-stone-900 uppercase tracking-widest">Three steps to get going</h2>
        </div>
        <div className="divide-y divide-stone-100">
          {steps.map(({ number, icon: Icon, title, description }, i) => (
            <motion.div
              key={number}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 + i * 0.07, duration: 0.3 }}
              className="flex items-start gap-5 px-6 sm:px-8 py-6"
            >
              <div className="flex flex-col items-center gap-2 shrink-0">
                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-emerald-700 border border-stone-200 shadow-sm">
                  <Icon className="w-5 h-5" aria-hidden="true" />
                </div>
                <span className="text-[10px] font-black text-stone-300 tabular-nums">{number}</span>
              </div>
              <div className="pt-1">
                <h3 className="text-sm font-black text-stone-900 mb-1">{title}</h3>
                <p className="text-sm text-stone-500 leading-relaxed">{description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Bonus credits callout */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25, duration: 0.3 }}
        className="bg-emerald-50 border border-emerald-100 rounded-2xl p-5 flex items-start gap-3"
      >
        <Info className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" aria-hidden="true" />
        <div>
          <p className="text-sm font-black text-emerald-900 mb-1">You start with 10 free credits</p>
          <p className="text-sm text-emerald-700 leading-relaxed">
            Every new account receives a 10-credit welcome bonus — enough to publish your first survey and get your research moving straight away.
          </p>
        </div>
      </motion.div>

      {/* Registration fields */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.3 }}
        className="bg-white rounded-3xl border border-stone-200 shadow-sm overflow-hidden"
      >
        <div className="px-6 sm:px-8 py-5 border-b border-stone-100 bg-stone-50">
          <h2 className="text-sm font-black text-stone-900 uppercase tracking-widest">Registration fields</h2>
        </div>
        <div className="px-6 sm:px-8 py-6 space-y-3">
          {[
            { field: 'Full Name', note: 'Displayed on your profile and in survey analytics (anonymised to other respondents).' },
            { field: 'Email Address', note: 'Used to log in. Must be unique across the platform.' },
            { field: 'Password', note: 'At least 8 characters recommended. Choose something memorable but strong.' },
          ].map(({ field, note }) => (
            <div key={field} className="flex items-start gap-3">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" aria-hidden="true" />
              <div>
                <span className="text-sm font-black text-stone-900">{field}: </span>
                <span className="text-sm text-stone-500">{note}</span>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* What's next */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35, duration: 0.3 }}
      >
        <h2 className="text-lg font-black text-stone-900 mb-4">What's next?</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {nextSteps.map(({ icon: Icon, title, description, link, linkLabel }) => (
            <Link
              key={link}
              to={link}
              className="group bg-white rounded-2xl border border-stone-200 shadow-sm p-5 hover:border-emerald-200 hover:shadow-md transition-all"
            >
              <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-700 mb-3">
                <Icon className="w-5 h-5" aria-hidden="true" />
              </div>
              <h3 className="text-sm font-black text-stone-900 mb-1 group-hover:text-emerald-800 transition-colors">{title}</h3>
              <p className="text-xs text-stone-500 leading-relaxed mb-3">{description}</p>
              <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700">
                {linkLabel} <ArrowRight className="w-3 h-3" aria-hidden="true" />
              </span>
            </Link>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
