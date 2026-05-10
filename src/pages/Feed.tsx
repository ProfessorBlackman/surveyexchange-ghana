import React, { useEffect, useState } from 'react';
import api from '../lib/api';
import { Survey } from '../types';
import { Search as SearchIcon, Heart, BookOpen, Wifi, BarChart2, FlaskConical, Globe } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  Health:           <Heart className="w-4 h-4 sm:w-5 sm:h-5" aria-hidden="true" />,
  Academic:         <BookOpen className="w-4 h-4 sm:w-5 sm:h-5" aria-hidden="true" />,
  Technology:       <Wifi className="w-4 h-4 sm:w-5 sm:h-5" aria-hidden="true" />,
  'Market Research':<BarChart2 className="w-4 h-4 sm:w-5 sm:h-5" aria-hidden="true" />,
  Social:           <Globe className="w-4 h-4 sm:w-5 sm:h-5" aria-hidden="true" />,
  Science:          <FlaskConical className="w-4 h-4 sm:w-5 sm:h-5" aria-hidden="true" />,
};

const DEFAULT_ICON = <BarChart2 className="w-4 h-4 sm:w-5 sm:h-5" aria-hidden="true" />;

function SurveySkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-stone-200 p-4 sm:p-5 lg:p-6 flex flex-col md:flex-row justify-between gap-3 sm:gap-4 md:gap-6">
      <div className="flex gap-3 sm:gap-4 grow">
        <div className="skeleton w-10 h-10 sm:w-12 sm:h-12 rounded-xl shrink-0" />
        <div className="flex-1 space-y-2 py-0.5">
          <div className="skeleton h-4 rounded w-2/3" />
          <div className="skeleton h-3 rounded w-1/3" />
        </div>
      </div>
      <div className="flex items-center gap-4 w-full md:w-auto md:self-center">
        <div className="skeleton h-4 w-8 rounded shrink-0" />
        <div className="skeleton h-9 flex-1 md:w-28 md:flex-none rounded-xl" />
      </div>
    </div>
  );
}

export default function Feed() {
  const [surveys, setSurveys] = useState<Survey[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');

  const categories = ['All', 'Academic', 'Social', 'Market Research', 'Technology', 'Health'];

  useEffect(() => {
    const fetchSurveys = async () => {
      try {
        const res = await api.get('/surveys/feed');
        setSurveys(res.data.content || res.data);
      } catch {
        // silently fail — feed is best-effort
      } finally {
        setLoading(false);
      }
    };
    fetchSurveys();
  }, []);

  const filteredSurveys = activeCategory === 'All'
    ? surveys
    : surveys.filter(s => s.category === activeCategory);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-8 lg:py-10">
      {/* Page header */}
      <div className="mb-4 sm:mb-6">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-stone-900 tracking-tight mb-1 sm:mb-2 underline decoration-emerald-500/30 underline-offset-8">
          Available Surveys
        </h1>
        <p className="text-stone-500 text-xs sm:text-sm font-medium pt-4">
          Contribute to fellow researchers to earn academic credits.
        </p>
      </div>

      {/* Category pills — breaks out of page padding on mobile for edge-to-edge scroll */}
      <div className="-mx-4 sm:-mx-6 lg:mx-0 mb-5 sm:mb-8">
        <div
          className="overflow-x-auto scrollbar-hide px-4 sm:px-6 lg:px-0"
          role="tablist"
          aria-label="Filter by category"
        >
          <div className="flex items-center gap-1.5 overflow-x-scroll bg-stone-100 p-1 rounded-xl w-fit max-w-3/4 lg:max-w-none">
            {categories.map(cat => (
              <button
                key={cat}
                role="tab"
                aria-selected={activeCategory === cat}
                onClick={() => setActiveCategory(cat)}
                className={cn(
                  'px-3 sm:px-4 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap shrink-0 cursor-pointer',
                  activeCategory === cat
                    ? 'bg-white text-stone-900 shadow-sm'
                    : 'text-stone-500 hover:text-stone-700'
                )}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col gap-3 sm:gap-4">
          {[1, 2, 3, 4].map(i => <SurveySkeleton key={i} />)}
        </div>
      ) : filteredSurveys.length === 0 ? (
        <div className="bg-white rounded-2xl sm:rounded-3xl p-8 lg:p-16 text-center border border-stone-200 w-full shadow-sm">
          <div className="w-12 h-12 sm:w-14 sm:h-14 bg-stone-50 rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6">
            <SearchIcon className="w-6 h-6 sm:w-7 sm:h-7 text-stone-300" aria-hidden="true" />
          </div>
          <h3 className="text-lg sm:text-xl font-bold text-stone-900">Research pool is empty</h3>
          <p className="text-stone-500 mt-2 text-xs sm:text-sm">
            Adjust your filters or check back in a few hours.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-3 sm:gap-4" role="list">
          {filteredSurveys.map((survey, index) => (
            <motion.div
              key={survey.id}
              role="listitem"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.04, duration: 0.2 }}
              className={cn(
                'group relative sm:w-full w-3/4 p-4 sm:p-5 lg:p-6 border bg-white rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-3 sm:gap-4 md:gap-6 transition-all',
                survey.boosted
                  ? 'border-amber-200 bg-amber-50/20 shadow-md shadow-amber-900/5'
                  : 'border-stone-200 hover:border-emerald-600/30 hover:shadow-lg hover:shadow-stone-200/50'
              )}
            >
              {survey.boosted && (
                <div
                  className="absolute -top-3 left-4 sm:left-5 px-3 py-0.5 bg-amber-400 text-amber-950 text-[10px] sm:text-[11px] font-black uppercase tracking-widest rounded-full shadow-sm"
                  aria-label="Featured survey"
                >
                  Featured
                </div>
              )}

              <div className="flex gap-3 sm:gap-4 grow min-w-0">
                <div className={cn(
                  'w-10 h-10 sm:w-11 sm:h-11 lg:w-12 lg:h-12 rounded-xl flex items-center justify-center shrink-0 border',
                  survey.boosted ? 'bg-white border-amber-200 text-amber-600' : 'bg-stone-50 border-stone-200 text-stone-500'
                )}>
                  {CATEGORY_ICONS[survey.category ?? ''] ?? DEFAULT_ICON}
                </div>
                <div className="min-w-0">
                  <h3 className="font-bold text-sm sm:text-base text-stone-900 mb-0.5 sm:mb-1 group-hover:text-emerald-800 transition-colors truncate">
                    {survey.title}
                  </h3>
                  <p className="text-[11px] sm:text-xs text-stone-500 font-medium flex flex-wrap items-center gap-x-1.5 sm:gap-x-2 gap-y-0.5">
                    <span className="uppercase font-bold text-emerald-700">{survey.category}</span>
                    <span className="text-stone-300" aria-hidden="true">•</span>
                    <span>{survey.owner?.name}</span>
                    <span className="text-stone-300" aria-hidden="true">•</span>
                    <span>{survey.estimatedTime} mins</span>
                  </p>
                </div>
              </div>

              {/* Action area: full-width on mobile, auto-width on desktop */}
              <div className="flex items-center gap-4 sm:gap-6 md:gap-8 w-full md:w-auto md:shrink-0">
                <div className="text-center" aria-label="Earn 1 credit">
                  <p className={cn(
                    'text-base sm:text-lg font-mono font-bold leading-none',
                    survey.boosted ? 'text-amber-700' : 'text-stone-700'
                  )}>+{survey.creditValue}</p>
                  <p className="text-[10px] sm:text-[11px] text-stone-400 uppercase font-black tracking-tighter">Credit</p>
                </div>

                <Link
                  to={`/survey/${survey.id}`}
                  className={cn(
                    'flex-1 md:flex-none text-center px-5 sm:px-6 lg:px-8 py-2 sm:py-2.5 rounded-xl font-bold text-xs uppercase tracking-widest transition-all whitespace-nowrap',
                    survey.boosted
                      ? 'bg-emerald-800 text-white hover:bg-emerald-900 shadow-lg shadow-emerald-900/20'
                      : 'border border-emerald-800 text-emerald-800 hover:bg-emerald-50'
                  )}
                >
                  Start Survey
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
