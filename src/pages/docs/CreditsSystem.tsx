import { motion } from 'motion/react';
import { Coins, TrendingUp, ShoppingCart, Zap, History, AlertTriangle, CheckCircle2, Info } from 'lucide-react';

const creditPackages = [
  { credits: 10, price: 'GH₵ 5' },
  { credits: 25, price: 'GH₵ 10' },
  { credits: 50, price: 'GH₵ 18' },
  { credits: 100, price: 'GH₵ 30' },
];

const earningWays = [
  { label: 'Welcome bonus', value: '+10 CR', note: 'Awarded once when you create your account.' },
  { label: 'Complete a survey', value: 'Varies', note: 'Each survey card shows its credit reward before you start.' },
];

export default function CreditsSystem() {
  return (
    <div className="space-y-8 pb-12">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h1 className="text-3xl sm:text-4xl font-black text-stone-900 tracking-tight mb-3">
          Credits System
        </h1>
        <p className="text-stone-500 text-sm sm:text-base font-medium max-w-2xl">
          Credits are SurveyXchange's internal currency. Earn them by completing surveys, spend them to purchase more capacity, and use them to boost your survey's visibility in the feed.
        </p>
      </motion.div>

      {/* What are credits */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05, duration: 0.3 }}
        className="bg-white rounded-3xl border border-stone-200 shadow-sm overflow-hidden"
      >
        <div className="px-6 sm:px-8 py-5 border-b border-stone-100 bg-stone-50">
          <div className="flex items-center gap-2">
            <Coins className="w-4 h-4 text-amber-600" aria-hidden="true" />
            <h2 className="text-sm font-black text-stone-900 uppercase tracking-widest">What are credits?</h2>
          </div>
        </div>
        <div className="px-6 sm:px-8 py-6">
          <p className="text-sm text-stone-600 leading-relaxed mb-4">
            Credits are a virtual currency used only within the SurveyXchange platform. They cannot be transferred, withdrawn, or converted to cash. Think of them as a reputation token: the more surveys you complete for others, the more visibility you can give your own work.
          </p>
          <div className="flex items-start gap-3 bg-stone-50 rounded-2xl p-4">
            <Info className="w-4 h-4 text-stone-400 shrink-0 mt-0.5" aria-hidden="true" />
            <p className="text-sm text-stone-500">Your current credit balance is always visible in the top navigation bar.</p>
          </div>
        </div>
      </motion.div>

      {/* Earning credits */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.3 }}
        className="bg-white rounded-3xl border border-stone-200 shadow-sm overflow-hidden"
      >
        <div className="px-6 sm:px-8 py-5 border-b border-stone-100 bg-stone-50">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-emerald-600" aria-hidden="true" />
            <h2 className="text-sm font-black text-stone-900 uppercase tracking-widest">Earning credits</h2>
          </div>
        </div>
        <div className="px-6 sm:px-8 py-6 space-y-3">
          {earningWays.map(({ label, value, note }) => (
            <div key={label} className="flex items-start gap-4 py-3 border-b border-stone-50 last:border-0">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" aria-hidden="true" />
              <div className="flex-1">
                <div className="flex items-center justify-between gap-2 mb-0.5">
                  <span className="text-sm font-black text-stone-900">{label}</span>
                  <span className="text-sm font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-lg">{value}</span>
                </div>
                <p className="text-xs text-stone-500">{note}</p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Spending / purchasing */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.3 }}
        className="bg-white rounded-3xl border border-stone-200 shadow-sm overflow-hidden"
      >
        <div className="px-6 sm:px-8 py-5 border-b border-stone-100 bg-stone-50">
          <div className="flex items-center gap-2">
            <ShoppingCart className="w-4 h-4 text-stone-500" aria-hidden="true" />
            <h2 className="text-sm font-black text-stone-900 uppercase tracking-widest">Purchasing credits</h2>
          </div>
        </div>
        <div className="px-6 sm:px-8 py-6">
          <p className="text-sm text-stone-500 mb-5 leading-relaxed">
            If you need credits faster than you can earn them, you can purchase packages from the <strong className="text-stone-700">Credits</strong> page. The following packages are available:
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {creditPackages.map(({ credits, price }) => (
              <div
                key={credits}
                className="flex flex-col items-center gap-1 border border-stone-200 rounded-2xl py-4 px-3 bg-stone-50 text-center"
              >
                <span className="text-2xl font-black text-stone-900 tabular-nums">{credits}</span>
                <span className="text-[10px] font-black uppercase tracking-widest text-stone-400">Credits</span>
                <span className="text-sm font-bold text-emerald-700 mt-1">{price}</span>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Boosting */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.3 }}
        className="bg-white rounded-3xl border border-stone-200 shadow-sm overflow-hidden"
      >
        <div className="px-6 sm:px-8 py-5 border-b border-stone-100 bg-stone-50">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-500" aria-hidden="true" />
            <h2 className="text-sm font-black text-stone-900 uppercase tracking-widest">Boosting a survey</h2>
          </div>
        </div>
        <div className="px-6 sm:px-8 py-6 space-y-4">
          <p className="text-sm text-stone-600 leading-relaxed">
            A <strong className="text-stone-800">Boost</strong> pins your survey to the top of the feed and attaches a visible "Boosted" badge, increasing the chance that other users see and complete it.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { label: 'Cost', value: '5 credits / 24 hours', icon: Coins },
              { label: 'Duration', value: '24 hours per boost', icon: Zap },
              { label: 'Limit', value: 'One active boost at a time per survey', icon: CheckCircle2 },
            ].map(({ label, value, icon: Icon }) => (
              <div key={label} className="bg-amber-50 border border-amber-100 rounded-2xl p-4">
                <div className="flex items-center gap-2 mb-1">
                  <Icon className="w-3.5 h-3.5 text-amber-600" aria-hidden="true" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-amber-600">{label}</span>
                </div>
                <p className="text-sm font-bold text-stone-800">{value}</p>
              </div>
            ))}
          </div>
          <p className="text-sm text-stone-500 leading-relaxed">
            To boost a survey, open it from your <strong className="text-stone-700">Dashboard</strong>, then click the <strong className="text-stone-700">Boost</strong> button. The boost activates immediately and expires after 24 hours. You can re-boost the same survey after the previous boost expires.
          </p>
        </div>
      </motion.div>

      {/* Transaction history */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25, duration: 0.3 }}
        className="bg-white rounded-3xl border border-stone-200 shadow-sm overflow-hidden"
      >
        <div className="px-6 sm:px-8 py-5 border-b border-stone-100 bg-stone-50">
          <div className="flex items-center gap-2">
            <History className="w-4 h-4 text-stone-400" aria-hidden="true" />
            <h2 className="text-sm font-black text-stone-900 uppercase tracking-widest">Transaction history</h2>
          </div>
        </div>
        <div className="px-6 sm:px-8 py-6">
          <p className="text-sm text-stone-600 leading-relaxed">
            Every credit movement — earned from completions, spent on purchases, or used for boosts — is recorded. To review your full history, go to the <strong className="text-stone-800">Dashboard</strong> and switch to the <strong className="text-stone-800">Credit Flow</strong> tab.
          </p>
        </div>
      </motion.div>

      {/* Payment disclaimer */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.3 }}
        className="bg-amber-50 border border-amber-200 rounded-2xl p-5 flex items-start gap-3"
      >
        <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" aria-hidden="true" />
        <div>
          <p className="text-sm font-black text-amber-900 mb-1">Payments are currently simulated</p>
          <p className="text-sm text-amber-700 leading-relaxed">
            No real money is charged at this time. The checkout flow is for demonstration and testing purposes only. You will not be billed.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
