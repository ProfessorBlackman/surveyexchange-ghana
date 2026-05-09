import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import api from '../lib/api';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell
} from 'recharts';
import {
  Users, CheckCircle2, ChevronLeft,
  Table as TableIcon, BarChart3, ChevronRight,
} from 'lucide-react';
import { format } from 'date-fns';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import { SurveyAnalytics, PaginatedResponse, RawResponse, Question } from '../types';

const COLORS = ['#065f46', '#059669', '#10b981', '#34d399', '#6ee7b7'];

function StatCardSkeleton() {
  return (
    <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-sm">
      <div className="flex items-center gap-4 mb-4">
        <div className="skeleton w-10 h-10 rounded-xl" />
        <div className="skeleton h-3 rounded w-28" />
      </div>
      <div className="skeleton h-10 rounded w-20" />
      <div className="skeleton h-1.5 rounded-full w-full mt-4" />
    </div>
  );
}

function ChartSkeleton() {
  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm">
      <div className="mb-6 space-y-2">
        <div className="skeleton h-3 rounded w-20" />
        <div className="skeleton h-6 rounded w-2/3" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="skeleton h-48 sm:h-64 rounded-2xl" />
        <div className="space-y-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="skeleton h-16 rounded-2xl" />
          ))}
        </div>
      </div>
    </div>
  );
}

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
    enabled: !!id,
  });

  const { data: responsesData, isLoading: isLoadingResponses } = useQuery<PaginatedResponse<RawResponse>>({
    queryKey: ['survey-responses', id, responsePage],
    queryFn: async () => {
      const res = await api.get(`/surveys/${id}/analytics/responses?page=${responsePage}`);
      return res.data;
    },
    enabled: !!id && activeView === 'responses',
  });

  const { data: survey } = useQuery({
    queryKey: ['survey', id],
    queryFn: async () => {
      const res = await api.get(`/surveys/${id}`);
      return res.data;
    },
    enabled: !!id,
  });

  if (analyticsError) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-stone-900 mb-4">Failed to load analytics</h2>
        <p className="text-stone-500 mb-8">This survey might not exist or you don't have access to it.</p>
        <Link
          to="/dashboard"
          className="px-6 py-2.5 bg-emerald-800 text-white rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-emerald-900 transition-all"
        >
          Return to Dashboard
        </Link>
      </div>
    );
  }

  const { totalResponses, targetResponses, completionPercentage, questions: questionAnalytics } =
    analytics ?? { totalResponses: 0, targetResponses: 0, completionPercentage: 0, questions: [] };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 md:gap-6 mb-8 sm:mb-12">
        <div className="grow">
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-1 text-stone-400 hover:text-emerald-700 transition-colors mb-4 group"
          >
            <ChevronLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" aria-hidden="true" />
            <span className="text-xs font-black uppercase tracking-widest">Back to Hub</span>
          </Link>
          <h1 className="text-2xl sm:text-4xl font-black text-stone-900 tracking-tight mb-2 underline decoration-emerald-500/30 underline-offset-8">
            {survey?.title || 'Survey Analytics'}
          </h1>
          <p className="text-stone-500 text-sm font-medium">Real-time data insights and participant responses.</p>
        </div>

        <div
          className="flex items-center gap-1 bg-stone-100 p-1 rounded-xl shrink-0"
          role="tablist"
          aria-label="Analytics views"
        >
          <button
            role="tab"
            aria-selected={activeView === 'charts'}
            onClick={() => setActiveView('charts')}
            className={cn(
              'flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-bold transition-all uppercase tracking-widest cursor-pointer',
              activeView === 'charts' ? 'bg-white text-stone-900 shadow-sm' : 'text-stone-500 hover:text-stone-700'
            )}
          >
            <BarChart3
              className={cn('w-3.5 h-3.5', activeView === 'charts' ? 'text-emerald-600' : 'text-stone-400')}
              aria-hidden="true"
            />
            Insights
          </button>
          <button
            role="tab"
            aria-selected={activeView === 'responses'}
            onClick={() => setActiveView('responses')}
            className={cn(
              'flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-bold transition-all uppercase tracking-widest cursor-pointer',
              activeView === 'responses' ? 'bg-white text-stone-900 shadow-sm' : 'text-stone-500 hover:text-stone-700'
            )}
          >
            <TableIcon
              className={cn('w-3.5 h-3.5', activeView === 'responses' ? 'text-emerald-600' : 'text-stone-400')}
              aria-hidden="true"
            />
            Responses
          </button>
        </div>
      </div>

      {/* Overview Cards */}
      {isLoadingAnalytics ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-8 sm:mb-12">
          <StatCardSkeleton />
          <StatCardSkeleton />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-8 sm:mb-12">
          <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-sm">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600 shrink-0">
                <Users className="w-5 h-5" aria-hidden="true" />
              </div>
              <p className="text-xs font-black text-stone-400 uppercase tracking-widest">Total Responses</p>
            </div>
            <p className="text-3xl sm:text-4xl font-black text-stone-900">{totalResponses}</p>
            <div
              className="h-1.5 bg-stone-100 rounded-full mt-4 overflow-hidden"
              role="progressbar"
              aria-valuenow={Math.min(completionPercentage, 100)}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label={`${Math.round(completionPercentage)}% of target reached`}
            >
              <div
                className="h-full bg-emerald-600 rounded-full transition-all"
                style={{ width: `${Math.min(completionPercentage, 100)}%` }}
              />
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-sm">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center text-amber-600 shrink-0">
                <CheckCircle2 className="w-5 h-5" aria-hidden="true" />
              </div>
              <p className="text-xs font-black text-stone-400 uppercase tracking-widest">Completion</p>
            </div>
            <p className="text-3xl sm:text-4xl font-black text-stone-900">
              {Math.round(completionPercentage || 0)}%
            </p>
          </div>
        </div>
      )}

      <AnimatePresence mode="wait">
        {activeView === 'charts' ? (
          <motion.div
            key="charts"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.15 }}
            className="space-y-6 sm:space-y-8"
          >
            {isLoadingAnalytics ? (
              <>
                <ChartSkeleton />
                <ChartSkeleton />
              </>
            ) : totalResponses === 0 ? (
              <div className="bg-white rounded-3xl p-12 sm:p-16 text-center border border-stone-200 shadow-sm max-w-xl mx-auto mt-10">
                <Users className="w-14 h-14 text-stone-200 mx-auto mb-6" aria-hidden="true" />
                <h3 className="text-xl font-bold text-stone-900 mb-2 underline decoration-emerald-500/30">
                  No responses yet
                </h3>
                <p className="text-stone-500 text-sm font-medium mb-8">
                  Start sharing your survey with the academic community to collect insights.
                </p>
                <Link
                  to="/"
                  className="px-8 py-3 bg-emerald-800 text-white rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-emerald-900 transition-all"
                >
                  Browse Pool
                </Link>
              </div>
            ) : (
              questionAnalytics.map((analysis) => (
                <div key={analysis.questionId} className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm">
                  <div className="mb-6 sm:mb-8">
                    <span className="inline-block px-2 py-0.5 bg-stone-50 text-stone-400 text-[11px] font-black uppercase rounded-lg border border-stone-100 mb-2">
                      {analysis.type?.replace('_', ' ') || 'UNKNOWN'}
                    </span>
                    <h3 className="text-lg sm:text-xl font-black text-stone-900 tracking-tight">{analysis.text}</h3>
                  </div>

                  {analysis.distribution && analysis.distribution.length > 0 ? (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-12 items-center">
                      {/* Chart — fluid height using aspect ratio */}
                      <div className="h-48 sm:h-64 md:h-72">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart
                            layout="vertical"
                            data={analysis.distribution}
                            margin={{ top: 5, right: 30, left: 10, bottom: 5 }}
                          >
                            <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f5f5f4" />
                            <XAxis type="number" hide />
                            <YAxis
                              dataKey="option"
                              type="category"
                              width={90}
                              tick={{ fontSize: 11, fontWeight: 700, fill: '#78716c' }}
                            />
                            <Tooltip
                              cursor={{ fill: '#f8fafc' }}
                              content={({ active, payload }) => {
                                if (active && payload && payload.length) {
                                  return (
                                    <div className="bg-stone-900 text-white p-3 rounded-lg shadow-xl border border-stone-800">
                                      <p className="text-xs font-black uppercase tracking-widest mb-1">
                                        {payload[0].payload.option}
                                      </p>
                                      <p className="text-lg font-mono font-bold leading-none">
                                        {payload[0].value}{' '}
                                        <span className="text-stone-400 text-xs">Responses</span>
                                      </p>
                                    </div>
                                  );
                                }
                                return null;
                              }}
                            />
                            <Bar dataKey="count" radius={[0, 4, 4, 0]} barSize={28}>
                              {analysis.distribution.map((_, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                              ))}
                            </Bar>
                          </BarChart>
                        </ResponsiveContainer>
                      </div>

                      {/* Legend breakdown */}
                      <div className="space-y-3">
                        {analysis.distribution.map((item, idx) => (
                          <div
                            key={idx}
                            className="flex items-center justify-between p-3 sm:p-4 bg-stone-50 rounded-2xl border border-stone-100"
                          >
                            <div className="min-w-0 mr-3">
                              <p className="text-xs font-black text-stone-900 uppercase tracking-tight mb-1 truncate">
                                {item.option}
                              </p>
                              <div className="flex items-center gap-2">
                                <div
                                  className="w-2 h-2 rounded-full shrink-0"
                                  style={{ backgroundColor: COLORS[idx % COLORS.length] }}
                                  aria-hidden="true"
                                />
                                <p className="text-[11px] text-stone-500 font-bold uppercase tracking-widest">
                                  {Math.round(item.percentage)}% of total
                                </p>
                              </div>
                            </div>
                            <div className="text-right shrink-0">
                              <p className="text-lg font-mono font-bold text-stone-900">{item.count}</p>
                              <p className="text-[11px] text-stone-400 font-black uppercase tracking-tighter">Count</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : analysis.textResponses && analysis.textResponses.length > 0 ? (
                    <div className="grid grid-cols-1 gap-3 max-h-72 overflow-y-auto pr-2">
                      {analysis.textResponses.map((textResp, rIdx) => (
                        <div
                          key={rIdx}
                          className="bg-stone-50 p-4 rounded-xl border border-stone-100 text-sm font-medium text-stone-700"
                        >
                          "{textResp}"
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="py-10 sm:py-12 bg-stone-50 rounded-3xl border border-dashed border-stone-200 text-center">
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
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.15 }}
            className="bg-white rounded-3xl border border-stone-200 shadow-sm overflow-hidden"
          >
            <div className="overflow-x-auto min-h-96">
              {isLoadingResponses ? (
                <div className="p-8 space-y-3">
                  {[1, 2, 3, 4, 5].map(i => (
                    <div key={i} className="flex gap-6">
                      <div className="skeleton h-10 rounded flex-1" />
                      <div className="skeleton h-10 rounded w-32" />
                      <div className="skeleton h-10 rounded flex-1" />
                    </div>
                  ))}
                </div>
              ) : (
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-stone-50 border-b border-stone-100">
                      <th scope="col" className="px-4 py-3 md:px-8 md:py-5 text-xs font-black text-stone-400 uppercase tracking-widest">
                        Respondent
                      </th>
                      <th scope="col" className="px-4 py-3 md:px-8 md:py-5 text-xs font-black text-stone-400 uppercase tracking-widest">
                        Date Submitted
                      </th>
                      {survey?.questions?.map((q: Question) => (
                        <th key={q.id} scope="col" className="px-6 py-5 text-xs font-black text-stone-400 uppercase tracking-widest min-w-48">
                          {q.text}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {responsesData?.content.map((resp: RawResponse) => (
                      <tr key={resp.responseId} className="hover:bg-stone-50/30 transition-colors">
                        <td className="px-4 py-3 md:px-8 md:py-5">
                          <p className="text-sm font-bold text-stone-900">Anonymous</p>
                          <p className="text-xs text-stone-400">ID: {resp.responseId.slice(0, 8)}</p>
                        </td>
                        <td className="px-4 py-3 md:px-8 md:py-5">
                          <p className="text-xs text-stone-500 font-medium whitespace-nowrap">
                            {format(new Date(resp.respondedAt), 'MMM d, yyyy HH:mm')}
                          </p>
                        </td>
                        {survey?.questions?.map((q: Question) => {
                          const answerRow = resp.answers?.find(a => a.questionId === q.id);
                          const answerStr = answerRow?.answerValue || '—';
                          return (
                            <td key={q.id} className="px-4 py-3 md:px-8 md:py-5">
                              <p className="text-xs text-stone-800 font-medium line-clamp-2">{answerStr}</p>
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                    {responsesData?.totalElements === 0 && (
                      <tr>
                        <td colSpan={100} className="px-4 py-12 md:px-8 md:py-16 text-center text-stone-400 font-bold uppercase tracking-widest text-xs italic">
                          No responses recorded.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              )}
            </div>

            {/* Pagination */}
            {responsesData && responsesData.totalPages > 1 && (
              <div className="px-4 sm:px-8 py-4 bg-stone-50 border-t border-stone-100 flex items-center justify-between gap-4">
                <p className="text-xs font-black text-stone-400 uppercase tracking-widest">
                  Page {responsesData.page + 1} of {responsesData.totalPages}
                </p>
                <div className="flex gap-2">
                  <button
                    disabled={responsePage === 0}
                    onClick={() => setResponsePage(p => p - 1)}
                    aria-label="Previous page"
                    className="p-2 border border-stone-200 rounded-lg hover:bg-white disabled:opacity-40 transition-colors cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4" aria-hidden="true" />
                  </button>
                  <button
                    disabled={responsePage >= responsesData.totalPages - 1}
                    onClick={() => setResponsePage(p => p + 1)}
                    aria-label="Next page"
                    className="p-2 border border-stone-200 rounded-lg hover:bg-white disabled:opacity-40 transition-colors cursor-pointer"
                  >
                    <ChevronRight className="w-4 h-4" aria-hidden="true" />
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
