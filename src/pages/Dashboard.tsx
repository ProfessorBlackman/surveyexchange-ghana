import { useEffect, useState } from 'react';
import api from '../lib/api';
import { Survey, CreditTransaction, SurveyStatus } from '../types';
import { useAuthStore } from '../store/authStore';
import {
  BarChart3,
  Layout,
  Coins,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Pencil,
  Zap,
} from 'lucide-react';
import { format, formatDistanceToNow, isAfter, parseISO } from 'date-fns';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import { Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { CREDIT_LOG_REASON_LABELS } from '../lib/constants';

const STATUS_STYLES: Record<SurveyStatus, string> = {
  DRAFT:  'bg-amber-100 text-amber-700 border-amber-200',
  ACTIVE: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  CLOSED: 'bg-stone-100 text-stone-500 border-stone-200',
};

const STATUS_LABELS: Record<SurveyStatus, string> = {
  DRAFT:  'Draft',
  ACTIVE: 'Active',
  CLOSED: 'Closed',
};

function SurveySkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-stone-200 p-4 sm:p-6">
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div className="flex gap-4 grow">
          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-2">
              <div className="skeleton h-5 rounded w-48" />
              <div className="skeleton h-4 rounded-full w-14" />
            </div>
            <div className="skeleton h-3 rounded w-40" />
            <div className="skeleton h-2 rounded-full w-full max-w-xs mt-3" />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="skeleton h-8 rounded-lg w-20" />
          <div className="skeleton h-8 rounded-lg w-8" />
          <div className="skeleton h-8 rounded-lg w-8" />
        </div>
      </div>
    </div>
  );
}

function CreditsSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden">
      {[1, 2, 3, 4, 5].map(i => (
        <div key={i} className="flex items-center justify-between px-4 sm:px-8 py-4 border-b border-stone-100 last:border-0">
          <div className="space-y-1.5">
            <div className="skeleton h-4 rounded w-36" />
            <div className="skeleton h-3 rounded w-24" />
          </div>
          <div className="skeleton h-6 rounded w-10" />
        </div>
      ))}
    </div>
  );
}

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<'surveys' | 'credits'>('surveys');
  const [mySurveys, setMySurveys] = useState<Survey[]>([]);
  const [history, setHistory] = useState<CreditTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const { user, updateCredits } = useAuthStore();
  const [boostingId, setBoostingId] = useState<string | null>(null);
  const [statusLoadingId, setStatusLoadingId] = useState<string | null>(null);

  const fetchDashboardData = async () => {
    try {
      const [surveysRes, historyRes] = await Promise.all([
        api.get('/surveys/mine'),
        api.get('/credits/history'),
      ]);
      setMySurveys(surveysRes.data);
      setHistory(historyRes.data.content ?? historyRes.data);
    } catch {
      // silently fail — data is best-effort on dashboard
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleBoost = async (surveyId: string) => {
    if (!window.confirm('Spending 5 credits will boost this survey for 24 hours. Continue?'))
      return;

    setBoostingId(surveyId);
    try {
      const res = await api.post(`/surveys/${surveyId}/boost`);
      updateCredits(res.data.newBalance);
      toast.success('-5 credits spent. Survey promoted!');
      await fetchDashboardData();
    } catch (err: any) {
      const status = err.response?.status;
      const data = err.response?.data;
      if (status === 402) {
        toast.error('You need at least 5 credits to boost');
      } else if (status === 409 && data?.boostExpiresAt) {
        toast.error(
          `This survey is already boosted until ${format(parseISO(data.boostExpiresAt), 'MMM d, HH:mm')}`
        );
      } else {
        toast.error(data?.message || 'Failed to boost survey');
      }
    } finally {
      setBoostingId(null);
    }
  };

  const handleStatusChange = async (surveyId: string, newStatus: 'ACTIVE' | 'CLOSED') => {
    setStatusLoadingId(surveyId);
    try {
      await api.patch(`/surveys/${surveyId}`, { status: newStatus });
      const messages: Record<string, string> = {
        ACTIVE: 'Survey published!',
        CLOSED: 'Survey closed',
      };
      toast.success(messages[newStatus]);
      await fetchDashboardData();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to update survey');
    } finally {
      setStatusLoadingId(null);
    }
  };

  const tabs = [
    { id: 'surveys', label: 'My Research', icon: <Layout className="w-4 h-4" aria-hidden="true" /> },
    { id: 'credits', label: 'Credit Flow', icon: <Coins className="w-4 h-4" aria-hidden="true" /> },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 md:gap-6 mb-6 sm:mb-10">
        <div>
          <h1 className="text-2xl sm:text-4xl font-black text-stone-900 tracking-tight mb-2 underline decoration-emerald-500/30 underline-offset-8">
            Research Hub
          </h1>
          <p className="text-stone-500 text-sm font-medium">
            Analyze your data and manage your academic standing.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <div className="bg-emerald-900 rounded-2xl p-4 sm:p-5 flex items-center gap-3 sm:gap-4 shadow-xl shadow-emerald-900/20 w-full sm:w-auto sm:min-w-56">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/10 rounded-xl flex items-center justify-center border border-white/10 shrink-0">
              <Coins className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-300" aria-hidden="true" />
            </div>
            <div>
              <p className="text-emerald-400 text-[11px] font-black uppercase tracking-widest leading-none mb-1">
                Available Credits
              </p>
              <p className="text-2xl sm:text-3xl font-mono font-bold text-white leading-none">
                {user?.creditBalance}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div
        className="flex items-center gap-1 bg-stone-200/50 p-1 rounded-xl mb-6 sm:mb-10 w-fit"
        role="tablist"
        aria-label="Dashboard sections"
      >
        {tabs.map((tab) => (
          <button
            key={tab.id}
            role="tab"
            aria-selected={activeTab === tab.id}
            onClick={() => setActiveTab(tab.id as 'surveys' | 'credits')}
            className={cn(
              'flex items-center gap-2 px-4 sm:px-6 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-all cursor-pointer',
              activeTab === tab.id
                ? 'bg-white text-stone-900 shadow-sm border border-stone-200'
                : 'text-stone-500 hover:text-stone-700'
            )}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex flex-col gap-4">
          {activeTab === 'surveys'
            ? [1, 2, 3].map(i => <SurveySkeleton key={i} />)
            : <CreditsSkeleton />
          }
        </div>
      ) : (
        <AnimatePresence mode="wait">
          {activeTab === 'surveys' ? (
            <motion.div
              key="surveys"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.15 }}
              className="flex flex-col gap-4"
            >
              {mySurveys.map((survey) => {
                const status = survey.status ?? 'ACTIVE';
                const actual = survey.actualResponseCount ?? 0;
                const target = survey.targetResponses ?? 0;
                const progressPercent = target > 0
                  ? Math.min(Math.round((actual / target) * 100), 100)
                  : 0;
                const boostActive =
                  survey.boostExpiresAt &&
                  isAfter(parseISO(survey.boostExpiresAt), new Date());
                const actionBusy =
                  boostingId === survey.id || statusLoadingId === survey.id;

                return (
                  <div
                    key={survey.id}
                    className="bg-white rounded-2xl border border-stone-200 p-4 sm:p-6 hover:border-emerald-600/30 transition-all"
                  >
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 sm:gap-6">
                      {/* Left: meta */}
                      <div className="flex gap-3 sm:gap-4 grow min-w-0">
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2 mb-1">
                            <h3 className="font-bold text-stone-900 text-base sm:text-lg truncate">
                              {survey.title}
                            </h3>
                            <span
                              className={cn(
                                'px-2 py-0.5 text-[11px] font-black uppercase rounded-full border tracking-wide shrink-0',
                                STATUS_STYLES[status]
                              )}
                            >
                              {STATUS_LABELS[status]}
                            </span>
                            {survey.boosted && (
                              <span className="px-2 py-0.5 bg-amber-100 text-amber-700 text-[11px] font-black uppercase rounded-full border border-amber-200 shrink-0">
                                Boosted
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-stone-400 font-medium uppercase tracking-wider">
                            {survey.category}
                            {survey.createdAt &&
                              ` • Created ${format(new Date(survey.createdAt), 'MMM d, yyyy')}`}
                            {survey.publishedAt &&
                              ` • Published ${format(new Date(survey.publishedAt), 'MMM d, yyyy')}`}
                          </p>

                          {/* Response progress */}
                          {target > 0 && (
                            <div className="mt-3 max-w-xs">
                              <div className="flex justify-between items-center mb-1">
                                <span className="text-xs text-stone-500 font-semibold">
                                  {actual} / {target} responses
                                </span>
                                <span className="text-xs text-stone-400 font-mono">
                                  {progressPercent}%
                                </span>
                              </div>
                              <div
                                className="h-1.5 bg-stone-100 rounded-full overflow-hidden"
                                role="progressbar"
                                aria-valuenow={progressPercent}
                                aria-valuemin={0}
                                aria-valuemax={100}
                                aria-label={`${progressPercent}% of target responses collected`}
                              >
                                <div
                                  className="h-full bg-emerald-500 rounded-full transition-all"
                                  style={{ width: `${progressPercent}%` }}
                                />
                              </div>
                            </div>
                          )}

                          {boostActive && survey.boostExpiresAt && (
                            <p className="mt-2 text-xs text-amber-600 font-semibold flex items-center gap-1">
                              <Zap className="w-3 h-3" aria-hidden="true" />
                              Boosted — expires in{' '}
                              {formatDistanceToNow(parseISO(survey.boostExpiresAt))}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Right: actions */}
                      <div className="flex items-center gap-2 flex-wrap shrink-0">
                        {/* Status transition */}
                        {status === 'DRAFT' && (
                          <button
                            onClick={() => handleStatusChange(survey.id, 'ACTIVE')}
                            disabled={actionBusy}
                            aria-label={`Publish ${survey.title}`}
                            className="flex items-center gap-1.5 px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black rounded-lg transition-all shadow-sm disabled:opacity-50 uppercase tracking-widest cursor-pointer"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                            {statusLoadingId === survey.id ? 'Publishing…' : 'Publish'}
                          </button>
                        )}
                        {status === 'ACTIVE' && (
                          <button
                            onClick={() => handleStatusChange(survey.id, 'CLOSED')}
                            disabled={actionBusy}
                            aria-label={`Close ${survey.title}`}
                            className="flex items-center gap-1.5 px-3 py-2 bg-stone-100 hover:bg-stone-200 text-stone-600 text-xs font-black rounded-lg transition-all disabled:opacity-50 uppercase tracking-widest cursor-pointer"
                          >
                            <XCircle className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                            {statusLoadingId === survey.id ? 'Closing…' : 'Close'}
                          </button>
                        )}
                        {status === 'CLOSED' && (
                          <button
                            onClick={() => handleStatusChange(survey.id, 'ACTIVE')}
                            disabled={actionBusy}
                            aria-label={`Re-open ${survey.title}`}
                            className="flex items-center gap-1.5 px-3 py-2 bg-stone-100 hover:bg-stone-200 text-stone-600 text-xs font-black rounded-lg transition-all disabled:opacity-50 uppercase tracking-widest cursor-pointer"
                          >
                            <RotateCcw className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                            {statusLoadingId === survey.id ? 'Re-opening…' : 'Re-open'}
                          </button>
                        )}

                        {/* Boost (only for active surveys) */}
                        {status === 'ACTIVE' && !boostActive && (
                          <button
                            onClick={() => handleBoost(survey.id)}
                            disabled={actionBusy || (user?.creditBalance ?? 0) < 5}
                            aria-label={`Boost ${survey.title} for 5 credits`}
                            className="px-3 py-2 bg-amber-400 hover:bg-amber-500 disabled:opacity-50 text-amber-950 text-xs font-black rounded-lg transition-all shadow-md shadow-amber-900/10 uppercase tracking-widest cursor-pointer"
                          >
                            {boostingId === survey.id ? 'Boosting…' : 'Boost (5 Cr)'}
                          </button>
                        )}

                        <Link
                          to={`/survey/${survey.id}/edit`}
                          aria-label={`Edit ${survey.title}`}
                          className="p-2 border border-stone-200 text-stone-400 hover:text-emerald-700 hover:border-emerald-200 rounded-lg hover:bg-emerald-50 transition-all shadow-sm"
                        >
                          <Pencil className="w-4 h-4" aria-hidden="true" />
                        </Link>
                        <Link
                          to={`/survey/${survey.id}/analytics`}
                          aria-label={`View analytics for ${survey.title}`}
                          className="p-2 border border-stone-200 text-stone-400 hover:text-stone-900 rounded-lg hover:bg-stone-50 transition-all shadow-sm"
                        >
                          <BarChart3 className="w-4 h-4" aria-hidden="true" />
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}

              {mySurveys.length === 0 && (
                <div className="py-12 sm:py-20 text-center bg-white rounded-3xl border border-stone-200 shadow-sm">
                  <Layout className="w-12 h-12 text-stone-200 mx-auto mb-4" aria-hidden="true" />
                  <h3 className="text-xl font-bold text-stone-900">No research studies yet</h3>
                  <Link
                    to="/create"
                    className="mt-6 inline-flex items-center gap-2 px-8 py-3 bg-emerald-800 text-white font-bold rounded-xl hover:bg-emerald-900 transition-all uppercase text-xs tracking-widest"
                  >
                    Post your first survey
                  </Link>
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="credits"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.15 }}
              className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-sm"
            >
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-stone-50 border-b border-stone-100">
                      <th scope="col" className="px-4 py-3 md:px-8 md:py-4 text-xs font-black text-stone-400 uppercase tracking-widest">
                        Transaction
                      </th>
                      <th scope="col" className="px-4 py-3 md:px-8 md:py-4 text-xs font-black text-stone-400 uppercase tracking-widest">
                        Timestamp
                      </th>
                      <th scope="col" className="px-4 py-3 md:px-8 md:py-4 text-xs font-black text-stone-400 uppercase tracking-widest text-right">
                        Credits
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {history.map((item) => (
                      <tr key={item.id} className="hover:bg-stone-50/50 transition-colors">
                        <td className="px-4 py-3 md:px-8 md:py-5">
                          <p className="text-sm font-bold text-stone-800">
                            {CREDIT_LOG_REASON_LABELS[item.type] ?? item.description ?? item.type}
                          </p>
                        </td>
                        <td className="px-4 py-3 md:px-8 md:py-5">
                          <p
                            className="text-xs text-stone-500 font-medium"
                            title={format(new Date(item.createdAt), 'PPpp')}
                          >
                            {formatDistanceToNow(new Date(item.createdAt), { addSuffix: true })}
                          </p>
                        </td>
                        <td className="px-4 py-3 md:px-8 md:py-5 text-right">
                          <span
                            className={cn(
                              'font-mono font-bold text-lg',
                              item.amount > 0 ? 'text-green-600' : 'text-red-500'
                            )}
                          >
                            {item.amount > 0 ? `+${item.amount}` : item.amount}
                          </span>
                        </td>
                      </tr>
                    ))}
                    {history.length === 0 && (
                      <tr>
                        <td colSpan={3} className="px-4 py-10 md:px-8 md:py-14 text-center text-stone-400 text-sm">
                          No transactions yet
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </div>
  );
}
