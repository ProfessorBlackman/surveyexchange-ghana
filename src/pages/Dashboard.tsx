import React, { useEffect, useState } from 'react';
import api from '../lib/api';
import { Survey, CreditTransaction } from '../types';
import { useAuthStore } from '../store/authStore';
import { 
  BarChart3, 
  TrendingUp, 
  History, 
  Layout, 
  ChevronRight, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  PlusCircle, 
  Coins,
  ArrowUpRight
} from 'lucide-react';
import { format } from 'date-fns';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import { Link } from 'react-router-dom';

import { toast } from 'react-hot-toast';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<'surveys' | 'credits'>('surveys');
  const [mySurveys, setMySurveys] = useState<Survey[]>([]);
  const [history, setHistory] = useState<CreditTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const { user, updateCredits } = useAuthStore();
  const [boostingId, setBoostingId] = useState<string | null>(null);

  const fetchDashboardData = async () => {
    try {
      const [surveysRes, historyRes] = await Promise.all([
        api.get('/surveys/mine'),
        api.get('/credits/history')
      ]);
      setMySurveys(surveysRes.data);
      setHistory(historyRes.data.content || historyRes.data);
    } catch (err) {
      console.error('Failed to fetch dashboard data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleBoost = async (surveyId: string) => {
    if (!window.confirm('Spending 5 credits will boost this survey for 24 hours. Continue?')) return;
    
    setBoostingId(surveyId);
    try {
      await api.post(`/surveys/${surveyId}/boost`);
      toast.success('-5 credits spent. Survey promoted!');
      const userRes = await api.get('/users/me');
      updateCredits(userRes.data.creditBalance || userRes.data.credits);
      await fetchDashboardData();
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Failed to boost survey');
    } finally {
      setBoostingId(null);
    }
  };

  const tabs = [
    { id: 'surveys', label: 'My Research', icon: <Layout className="w-4 h-4" /> },
    { id: 'credits', label: 'Credit flow', icon: <Coins className="w-4 h-4" /> }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div>
          <h1 className="text-4xl font-black text-stone-900 tracking-tight mb-2 underline decoration-emerald-500/30 underline-offset-8">Research Hub</h1>
          <p className="text-stone-500 text-sm font-medium">Analyze your data and manage your academic standing.</p>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <div className="bg-emerald-900 rounded-2xl p-5 flex items-center gap-4 shadow-xl shadow-emerald-900/10 min-w-[240px]">
            <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center border border-white/10">
              <Coins className="w-6 h-6 text-emerald-300" />
            </div>
            <div>
              <p className="text-emerald-400 text-[10px] font-black uppercase tracking-widest leading-none mb-1">Available Credits</p>
              <p className="text-3xl font-mono font-bold text-white leading-none">{user?.credits}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 bg-stone-200/50 p-1 rounded-xl mb-10 w-fit">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={cn(
              "flex items-center gap-2 px-6 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-all",
              activeTab === tab.id 
                ? "bg-white text-stone-900 shadow-sm border border-stone-200" 
                : "text-stone-500 hover:text-stone-700"
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
              {mySurveys.map(survey => (
                <div key={survey.id} className="bg-white rounded-2xl border border-stone-200 p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 group hover:border-emerald-600/30 transition-all">
                  <div className="flex gap-4 flex-grow">
                    <div className="w-14 h-14 bg-stone-50 border border-stone-100 rounded-2xl flex items-center justify-center shrink-0">
                      <BarChart3 className="w-6 h-6 text-stone-400" />
                    </div>
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="font-bold text-stone-900 text-lg group-hover:text-emerald-800 transition-colors">
                          {survey.title}
                        </h3>
                        {survey.isBoosted && (
                          <span className="px-2 py-0.5 bg-amber-100 text-amber-700 text-[9px] font-black uppercase rounded-full">Boosted</span>
                        )}
                      </div>
                      <p className="text-[11px] text-stone-400 font-medium uppercase tracking-wider">
                        {survey.category} • {format(new Date(survey.createdAt), 'MMM d, yyyy')}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-10 w-full md:w-auto">
                    <div className="text-center">
                      <p className="text-2xl font-mono font-bold text-emerald-800">{survey.responseCount}</p>
                      <p className="text-[9px] text-stone-400 uppercase font-black tracking-tighter">Responses</p>
                    </div>

                    {!survey.isBoosted ? (
                      <button
                        onClick={() => handleBoost(survey.id)}
                        disabled={boostingId === survey.id || (user?.credits || 0) < 5}
                        className="px-6 py-2 bg-amber-400 hover:bg-amber-500 disabled:opacity-50 text-amber-950 text-[10px] font-black rounded-lg transition-all shadow-md shadow-amber-900/10 uppercase tracking-widest"
                      >
                        {boostingId === survey.id ? 'Boosting...' : 'Boost (5 Cr)'}
                      </button>
                    ) : (
                      <div className="px-6 py-2 bg-emerald-50 text-emerald-700 text-[10px] font-black uppercase rounded-lg border border-emerald-100 tracking-widest">
                        Promoted
                      </div>
                    )}
                    <Link 
                      to={`/survey/${survey.id}/analytics`}
                      className="p-2 border border-stone-200 text-stone-400 hover:text-stone-900 rounded-lg hover:bg-stone-50 transition-all shadow-sm"
                      title="View Analytics"
                    >
                      <BarChart3 className="w-5 h-5" />
                    </Link>
                    <Link 
                      to={`/survey/${survey.id}`}
                      className="p-2 border border-stone-200 text-stone-400 hover:text-stone-900 rounded-lg hover:bg-stone-50 transition-all shadow-sm"
                      title="View Live Task"
                    >
                      <ArrowUpRight className="w-5 h-5" />
                    </Link>
                  </div>
                </div>
              ))}

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
                      <th className="px-8 py-4 text-[10px] font-black text-stone-400 uppercase tracking-widest">Transaction Description</th>
                      <th className="px-8 py-4 text-[10px] font-black text-stone-400 uppercase tracking-widest">Timestamp</th>
                      <th className="px-8 py-4 text-[10px] font-black text-stone-400 uppercase tracking-widest text-right">Credit Value</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {history.map(item => (
                      <tr key={item.id} className="hover:bg-stone-50/50 transition-colors">
                        <td className="px-8 py-5">
                          <p className="text-sm font-bold text-stone-800">{item.description}</p>
                        </td>
                        <td className="px-8 py-5">
                          <p className="text-xs text-stone-500 font-medium">{format(new Date(item.createdAt), 'MMM d, yyyy HH:mm')}</p>
                        </td>
                        <td className="px-8 py-5 text-right">
                          <span className={cn(
                            "font-mono font-bold text-lg",
                            item.amount > 0 ? "text-emerald-700" : "text-amber-700"
                          )}>
                            {item.amount > 0 ? '+' : ''}{item.amount}
                          </span>
                        </td>
                      </tr>
                    ))}
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
