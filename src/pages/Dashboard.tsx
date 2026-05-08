import React, { useEffect, useState } from 'react';
import api from '../lib/api';
import { Survey, CreditTransaction, SurveyStatus } from '../types';
import { useAuthStore } from '../store/authStore';
import {
  BarChart3,
  Layout,
  Coins,
  ArrowUpRight,
  Zap,
  CheckCircle2,
  XCircle,
  RotateCcw,
  FileText,
  Pencil,
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
    { id: 'surveys', label: 'My Research', icon: <Layout className="w-4 h-4" /> },
    { id: 'credits', label: 'Credit Flow', icon: <Coins className="w-4 h-4" /> },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div>
          <h1 className="text-4xl font-black text-stone-900 tracking-tight mb-2 underline decoration-emerald-500/30 underline-offset-8">
            Research Hub
          </h1>
          <p className="text-stone-500 text-sm font-medium">
            Analyze your data and manage your academic standing.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <div className="bg-emerald-900 rounded-2xl p-5 flex items-center gap-4 shadow-xl shadow-emerald-900/10 min-w-60">
            <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center border border-white/10">
              <Coins className="w-6 h-6 text-emerald-300" />
            </div>
            <div>
              <p className="text-emerald-400 text-[10px] font-black uppercase tracking-widest leading-none mb-1">
                Available Credits
              </p>
              <p className="text-3xl font-mono font-bold text-white leading-none">
                {user?.creditBalance}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 bg-stone-200/50 p-1 rounded-xl mb-10 w-fit">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as 'surveys' | 'credits')}
            className={cn(
              'flex items-center gap-2 px-6 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-all',
              activeTab === tab.id
                ? 'bg-white text-stone-900 shadow-sm border border-stone-200'
                : 'text-stone-500 hover:text-stone-700'
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="h-64 flex items-center justify-center">
          <div className="w-12 h-12 border-4 border-stone-100 border-t-emerald-800 rounded-full animate-spin" />
        </div>
      ) : (
        <AnimatePresence mode="wait">
          {activeTab === 'surveys' ? (
            <motion.div
              key="surveys"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
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
                    className="bg-white rounded-2xl border border-stone-200 p-6 hover:border-emerald-600/30 transition-all"
                  >
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                      {/* Left: meta */}
                      <div className="flex gap-4 grow min-w-0">
                        <div className="w-14 h-14 bg-stone-50 border border-stone-100 rounded-2xl flex items-center justify-center shrink-0">
                          <BarChart3 className="w-6 h-6 text-stone-400" />
                        </div>
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2 mb-1">
                            <h3 className="font-bold text-stone-900 text-lg truncate">
                              {survey.title}
                            </h3>
                            <span
                              className={cn(
                                'px-2 py-0.5 text-[9px] font-black uppercase rounded-full border tracking-wide',
                                STATUS_STYLES[status]
                              )}
                            >
                              {STATUS_LABELS[status]}
                            </span>
                            {survey.boosted && (
                              <span className="px-2 py-0.5 bg-amber-100 text-amber-700 text-[9px] font-black uppercase rounded-full border border-amber-200">
                                Boosted
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-stone-400 font-medium uppercase tracking-wider">
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
                                <span className="text-[10px] text-stone-500 font-semibold">
                                  {actual} / {target} responses
                                </span>
                                <span className="text-[10px] text-stone-400 font-mono">
                                  {progressPercent}%
                                </span>
                              </div>
                              <div className="h-1.5 bg-stone-100 rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-emerald-500 rounded-full transition-all"
                                  style={{ width: `${progressPercent}%` }}
                                />
                              </div>
                            </div>
                          )}

                          {boostActive && survey.boostExpiresAt && (
                            <p className="mt-2 text-[10px] text-amber-600 font-semibold">
                              <Zap className="w-3 h-3 inline mr-0.5" />
                              Boosted — expires in{' '}
                              {formatDistanceToNow(parseISO(survey.boostExpiresAt))}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Right: actions */}
                      <div className="flex items-center gap-3 shrink-0 flex-wrap">
                        {/* Status transition */}
                        {status === 'DRAFT' && (
                          <button
                            onClick={() => handleStatusChange(survey.id, 'ACTIVE')}
                            disabled={actionBusy}
                            className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-black rounded-lg transition-all shadow-sm disabled:opacity-50 uppercase tracking-widest"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            {statusLoadingId === survey.id ? 'Publishing...' : 'Publish'}
                          </button>
                        )}
                        {status === 'ACTIVE' && (
                          <button
                            onClick={() => handleStatusChange(survey.id, 'CLOSED')}
                            disabled={actionBusy}
                            className="flex items-center gap-1.5 px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-600 text-[10px] font-black rounded-lg transition-all disabled:opacity-50 uppercase tracking-widest"
                          >
                            <XCircle className="w-3.5 h-3.5" />
                            {statusLoadingId === survey.id ? 'Closing...' : 'Close survey'}
                          </button>
                        )}
                        {status === 'CLOSED' && (
                          <button
                            onClick={() => handleStatusChange(survey.id, 'ACTIVE')}
                            disabled={actionBusy}
                            className="flex items-center gap-1.5 px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-600 text-[10px] font-black rounded-lg transition-all disabled:opacity-50 uppercase tracking-widest"
                          >
                            <RotateCcw className="w-3.5 h-3.5" />
                            {statusLoadingId === survey.id ? 'Re-opening...' : 'Re-open'}
                          </button>
                        )}

                        {/* Boost (only for active surveys) */}
                        {status === 'ACTIVE' && !boostActive && (
                          <button
                            onClick={() => handleBoost(survey.id)}
                            disabled={actionBusy || (user?.creditBalance ?? 0) < 5}
                            className="px-4 py-2 bg-amber-400 hover:bg-amber-500 disabled:opacity-50 text-amber-950 text-[10px] font-black rounded-lg transition-all shadow-md shadow-amber-900/10 uppercase tracking-widest"
                          >
                            {boostingId === survey.id ? 'Boosting...' : 'Boost (5 Cr)'}
                          </button>
                        )}

                        <Link
                          to={`/survey/${survey.id}/edit`}
                          className="p-2 border border-stone-200 text-stone-400 hover:text-emerald-700 hover:border-emerald-200 rounded-lg hover:bg-emerald-50 transition-all shadow-sm"
                          title="Edit Survey"
                        >
                          <Pencil className="w-5 h-5" />
                        </Link>
                        <Link
                          to={`/survey/${survey.id}/analytics`}
                          className="p-2 border border-stone-200 text-stone-400 hover:text-stone-900 rounded-lg hover:bg-stone-50 transition-all shadow-sm"
                          title="View Analytics"
                        >
                          <BarChart3 className="w-5 h-5" />
                        </Link>
                        {/* <Link
                          to={`/survey/${survey.id}`}
                          className="p-2 border border-stone-200 text-stone-400 hover:text-stone-900 rounded-lg hover:bg-stone-50 transition-all shadow-sm"
                          title="View Survey"
                        >
                          <ArrowUpRight className="w-5 h-5" />
                        </Link> */}
                      </div>
                    </div>
                  </div>
                );
              })}

              {mySurveys.length === 0 && (
                <div className="py-24 text-center bg-white rounded-3xl border border-stone-200 shadow-sm">
                  <Layout className="w-12 h-12 text-stone-200 mx-auto mb-4" />
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
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-sm"
            >
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-stone-50 border-b border-stone-100">
                      <th className="px-8 py-4 text-[10px] font-black text-stone-400 uppercase tracking-widest">
                        Transaction
                      </th>
                      <th className="px-8 py-4 text-[10px] font-black text-stone-400 uppercase tracking-widest">
                        Timestamp
                      </th>
                      <th className="px-8 py-4 text-[10px] font-black text-stone-400 uppercase tracking-widest text-right">
                        Credits
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {history.map((item) => (
                      <tr key={item.id} className="hover:bg-stone-50/50 transition-colors">
                        <td className="px-8 py-5">
                          <p className="text-sm font-bold text-stone-800">
                            {CREDIT_LOG_REASON_LABELS[item.type] ?? item.description ?? item.type}
                          </p>
                        </td>
                        <td className="px-8 py-5">
                          <p
                            className="text-xs text-stone-500 font-medium"
                            title={format(new Date(item.createdAt), 'PPpp')}
                          >
                            {formatDistanceToNow(new Date(item.createdAt), { addSuffix: true })}
                          </p>
                        </td>
                        <td className="px-8 py-5 text-right">
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
                        <td colSpan={3} className="px-8 py-12 text-center text-stone-400 text-sm">
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
