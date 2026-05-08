import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import api from '../lib/api';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell 
} from 'recharts';
import { 
  Users, Target, CheckCircle2, ChevronLeft, Download, 
  Table as TableIcon, BarChart3, ChevronRight, Loader2
} from 'lucide-react';
import { format } from 'date-fns';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import { SurveyAnalytics, PaginatedResponse, RawResponse, Question } from '../types';

const COLORS = ['#065f46', '#059669', '#10b981', '#34d399', '#6ee7b7'];

export default function Analytics() {
  const { id } = useParams<{ id: string }>();
  const [activeView, setActiveView] = useState<'charts' | 'responses'>('charts');
  const [responsePage, setResponsePage] = useState(0);

  const { data: analytics, isLoading: isLoadingAnalytics, error: analyticsError } = useQuery<SurveyAnalytics>({
    queryKey: ['survey-analytics', id],
    queryFn: async () => {
      const res = await api.get(`/surveys/${id}/analytics`);
      return res.data;
    },
    enabled: !!id
  });

  const { data: responsesData, isLoading: isLoadingResponses } = useQuery<PaginatedResponse<RawResponse>>({
    queryKey: ['survey-responses', id, responsePage],
    queryFn: async () => {
      const res = await api.get(`/surveys/${id}/analytics/responses?page=${responsePage}`);
      return res.data;
    },
    enabled: !!id && activeView === 'responses'
  });

  const { data: survey } = useQuery({
    queryKey: ['survey', id],
    queryFn: async () => {
      const res = await api.get(`/surveys/${id}`);
      return res.data;
    },
    enabled: !!id
  });

  if (isLoadingAnalytics) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-12 h-12 text-emerald-800 animate-spin" />
          <p className="text-stone-500 font-medium animate-pulse uppercase tracking-widest text-[10px]">Assembling Data...</p>
        </div>
      </div>
    );
  }

  if (analyticsError || !analytics) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-stone-900 mb-4">Failed to load analytics</h2>
        <p className="text-stone-500 mb-8">This survey might not exist or you don't have access to it.</p>
        <Link to="/dashboard" className="px-6 py-2 bg-emerald-800 text-white rounded-xl font-bold uppercase tracking-widest text-xs">Return to Dashboard</Link>
      </div>
    );
  }

  const { totalResponses, targetResponses, completionPercentage, questions: questionAnalytics } = analytics;
  const overview = { totalResponses, targetResponses, completionPercentage };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div className="flex-grow">
          <Link to="/dashboard" className="inline-flex items-center gap-1 text-stone-400 hover:text-emerald-700 transition-colors mb-4 group">
            <ChevronLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            <span className="text-[10px] font-black uppercase tracking-widest">Back to Hub</span>
          </Link>
          <h1 className="text-4xl font-black text-stone-900 tracking-tight mb-2 underline decoration-emerald-500/30 underline-offset-8">
            {survey?.title || 'Survey Analytics'}
          </h1>
          <p className="text-stone-500 text-sm font-medium">Real-time data insights and participant responses.</p>
        </div>

        <div className="flex items-center gap-2 bg-stone-100 p-1 rounded-xl">
          <button
            onClick={() => setActiveView('charts')}
            className={cn(
              "flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-bold transition-all uppercase tracking-widest",
              activeView === 'charts' ? "bg-white text-stone-900 shadow-sm" : "text-stone-500 hover:text-stone-700"
            )}
          >
            <BarChart3 className={cn("w-3.5 h-3.5", activeView === 'charts' ? "text-emerald-600" : "text-stone-400")} />
            Insights
          </button>
          <button
            onClick={() => setActiveView('responses')}
            className={cn(
              "flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-bold transition-all uppercase tracking-widest",
              activeView === 'responses' ? "bg-white text-stone-900 shadow-sm" : "text-stone-500 hover:text-stone-700"
            )}
          >
            <TableIcon className={cn("w-3.5 h-3.5", activeView === 'responses' ? "text-emerald-600" : "text-stone-400")} />
            Responses
          </button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-sm">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600">
              <Users className="w-5 h-5" />
            </div>
            <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest">Total Responses</p>
          </div>
          <p className="text-4xl font-black text-stone-900">{overview.totalResponses}</p>
          <div className="h-1 bg-stone-100 rounded-full mt-4 overflow-hidden">
             <div 
               className="h-full bg-emerald-600 rounded-full" 
               style={{ width: `${Math.min(overview.completionPercentage, 100)}%` }} 
             />
          </div>
        </div>

        {/* <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-sm">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-10 h-10 bg-stone-50 rounded-xl flex items-center justify-center text-stone-400">
              <Target className="w-5 h-5" />
            </div>
            <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest">Target Sample</p>
          </div>
          <p className="text-4xl font-black text-stone-900">{overview.targetResponses}</p>
        </div> */}

        <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-sm">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center text-amber-600">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest">Completion</p>
          </div>
          <p className="text-4xl font-black text-stone-900">{Math.round(overview.completionPercentage || 0)}%</p>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {activeView === 'charts' ? (
          <motion.div
            key="charts"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-8"
          >
            {overview.totalResponses === 0 ? (
              <div className="bg-white rounded-3xl p-16 text-center border border-stone-200 shadow-sm max-w-xl mx-auto mt-20">
                <Users className="w-16 h-16 text-stone-200 mx-auto mb-6" />
                <h3 className="text-xl font-bold text-stone-900 mb-2 underline decoration-emerald-500/30">No responses yet</h3>
                <p className="text-stone-500 text-sm font-medium mb-8">Start sharing your survey with the academic community to collect insights.</p>
                <Link to="/" className="px-8 py-3 bg-emerald-800 text-white rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-emerald-900 transition-all">Browse Pool</Link>
              </div>
            ) : (
              questionAnalytics.map((analysis) => (
                <div key={analysis.questionId} className="bg-white rounded-3xl p-8 border border-stone-200 shadow-sm">
                  <div className="mb-8">
                    <span className="inline-block px-2 py-0.5 bg-stone-50 text-stone-400 text-[9px] font-black uppercase rounded-lg border border-stone-100 mb-2">
                       {analysis.type?.replace('_', ' ') || 'UNKNOWN'}
                    </span>
                    <h3 className="text-xl font-black text-stone-900 tracking-tight">{analysis.text}</h3>
                  </div>

                  {analysis.distribution && analysis.distribution.length > 0 ? (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                      <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart
                            layout="vertical"
                            data={analysis.distribution}
                            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                          >
                            <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f5f5f4" />
                            <XAxis type="number" hide />
                            <YAxis 
                              dataKey="option" 
                              type="category" 
                              width={100} 
                              tick={{ fontSize: 10, fontWeight: 700, fill: '#78716c' }}
                            />
                            <Tooltip 
                              cursor={{ fill: '#f8fafc' }}
                              content={({ active, payload }) => {
                                if (active && payload && payload.length) {
                                  return (
                                    <div className="bg-stone-900 text-white p-3 rounded-lg shadow-xl border border-stone-800">
                                      <p className="text-[10px] font-black uppercase tracking-widest mb-1">{payload[0].payload.option}</p>
                                      <p className="text-lg font-mono font-bold leading-none">{payload[0].value} <span className="text-stone-500 text-xs">Responses</span></p>
                                    </div>
                                  );
                                }
                                return null;
                              }}
                            />
                            <Bar 
                              dataKey="count" 
                              radius={[0, 4, 4, 0]} 
                              barSize={32}
                            >
                              {analysis.distribution.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                              ))}
                            </Bar>
                          </BarChart>
                        </ResponsiveContainer>
                      </div>

                      <div className="space-y-4">
                        {analysis.distribution.map((item, idx) => (
                          <div key={idx} className="flex items-center justify-between p-4 bg-stone-50 rounded-2xl border border-stone-100">
                            <div>
                               <p className="text-xs font-black text-stone-900 uppercase tracking-tight mb-1">{item.option}</p>
                               <div className="flex items-center gap-2">
                                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }} />
                                  <p className="text-[10px] text-stone-500 font-bold uppercase tracking-widest">{Math.round(item.percentage)}% of total</p>
                               </div>
                            </div>
                            <div className="text-right">
                               <p className="text-lg font-mono font-bold text-stone-900">{item.count}</p>
                               <p className="text-[9px] text-stone-400 font-black uppercase tracking-tighter">Count</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : analysis.textResponses && analysis.textResponses.length > 0 ? (
                    <div className="grid grid-cols-1 gap-3 max-h-[300px] overflow-y-auto pr-4">
                      {analysis.textResponses.map((textResp, rIdx) => (
                        <div key={rIdx} className="bg-stone-50 p-4 rounded-xl border border-stone-100 text-sm font-medium text-stone-700">
                          "{textResp}"
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="py-12 bg-stone-50 rounded-3xl border border-dashed border-stone-200 text-center">
                       <p className="text-stone-400 text-xs font-bold uppercase tracking-widest">No answers provided</p>
                    </div>
                  )}
                </div>
              ))
            )}
          </motion.div>
        ) : (
          <motion.div
            key="responses"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-white rounded-3xl border border-stone-200 shadow-sm overflow-hidden"
          >
            <div className="overflow-x-auto min-h-[400px]">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-stone-50 border-b border-stone-100">
                    <th className="px-8 py-5 text-[10px] font-black text-stone-400 uppercase tracking-widest">Respondent</th>
                    <th className="px-8 py-5 text-[10px] font-black text-stone-400 uppercase tracking-widest">Date Submitted</th>
                    {survey?.questions?.map((q: Question) => (
                      <th key={q.id} className="px-8 py-5 text-[10px] font-black text-stone-400 uppercase tracking-widest min-w-[200px]">
                        {q.text}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {responsesData?.content.map((resp: RawResponse) => (
                    <tr key={resp.responseId} className="hover:bg-stone-50/30 transition-colors">
                      <td className="px-8 py-5">
                        <p className="text-sm font-bold text-stone-900">Anonymous</p>
                        <p className="text-[10px] text-stone-400">Response ID: {resp.responseId.slice(0, 8)}</p>
                      </td>
                      <td className="px-8 py-5">
                        <p className="text-xs text-stone-500 font-medium">
                          {format(new Date(resp.respondedAt), 'MMM d, yyyy HH:mm')}
                        </p>
                      </td>
                      {survey?.questions?.map((q: Question) => {
                        const answerRow = resp.answers?.find(a => a.questionId === q.id);
                        const answerStr = answerRow?.answerValue || '—';

                        return (
                          <td key={q.id} className="px-8 py-5">
                            <p className="text-xs text-stone-800 font-medium line-clamp-2">
                              {answerStr}
                            </p>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                  {responsesData?.totalElements === 0 && (
                    <tr>
                      <td colSpan={100} className="px-8 py-20 text-center text-stone-400 font-bold uppercase tracking-widest text-xs italic">
                        No responses recorded.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            
            {/* Pagination */}
            {responsesData && responsesData.totalPages > 1 && (
              <div className="px-8 py-4 bg-stone-50 border-t border-stone-100 flex items-center justify-between">
                 <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest">
                   Showing Page {responsesData.page + 1} of {responsesData.totalPages}
                 </p>
                 <div className="flex gap-2">
                    <button
                      disabled={responsePage === 0}
                      onClick={() => setResponsePage(p => p - 1)}
                      className="p-2 border border-stone-200 rounded-lg hover:bg-white disabled:opacity-50 transition-colors"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      disabled={responsePage >= responsesData.totalPages - 1}
                      onClick={() => setResponsePage(p => p + 1)}
                      className="p-2 border border-stone-200 rounded-lg hover:bg-white disabled:opacity-50 transition-colors"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                 </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
