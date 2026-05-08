import React, { useEffect, useState } from 'react';
import api from '../lib/api';
import { Survey } from '../types';
import { Clock, MessageSquare, TrendingUp, Filter, Search as SearchIcon, ArrowRight, User } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';

export default function Feed() {
  const [surveys, setSurveys] = useState<Survey[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');

  const categories = ['All', 'Academic', 'Social', 'Market Research', 'Technology', 'Health'];

  useEffect(() => {
    const fetchSurveys = async () => {
      try {
        const res = await api.get('/surveys/feed');
        setSurveys(res.data.content || res.data); // Support both for safety during transition
      } catch (err) {
        console.error('Failed to fetch surveys');
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div>
          <h1 className="text-4xl mt-8 font-black text-stone-900 tracking-tight mb-2 underline decoration-emerald-500/30 underline-offset-8">Available Surveys</h1>
          <p className="text-stone-500 text-sm font-medium">Contribute to fellow researchers to earn academic credits.</p>
        </div>
        
        <div className="flex items-center gap-2 bg-stone-100 p-1 rounded-xl shrink-0">
          {categories.slice(0, 4).map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={cn(
                "px-4 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap",
                activeCategory === cat
                  ? "bg-white text-stone-900 shadow-sm"
                  : "text-stone-500 hover:text-stone-700"
              )}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col gap-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-white rounded-2xl h-32 animate-pulse border border-stone-200" />
          ))}
        </div>
      ) : filteredSurveys.length === 0 ? (
        <div className="bg-white rounded-3xl p-16 text-center border border-stone-200 max-w-xl mx-auto shadow-sm">
          <div className="w-16 h-16 bg-stone-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <SearchIcon className="w-8 h-8 text-stone-300" />
          </div>
          <h3 className="text-xl font-bold text-stone-900">Research pool is empty</h3>
          <p className="text-stone-500 mt-2">Adjust your filters or check back in a few hours.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {filteredSurveys.map((survey, index) => (
            <motion.div
              key={survey.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className={cn(
                "group relative p-6 border bg-white rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6 transition-all",
                survey.isBoosted 
                  ? "border-amber-200 bg-amber-50/20 shadow-md shadow-amber-900/5" 
                  : "border-stone-200 hover:border-emerald-600/30 hover:shadow-lg hover:shadow-stone-200/50"
              )}
            >
              {survey.isBoosted && (
                <div className="absolute -top-3 left-6 px-3 py-0.5 bg-amber-400 text-amber-950 text-[10px] font-black uppercase tracking-widest rounded-full shadow-sm">
                  Featured
                </div>
              )}

              <div className="flex gap-5 flex-grow">
                <div className={cn(
                  "w-12 h-12 rounded-xl flex items-center justify-center text-xl shrink-0 border",
                  survey.isBoosted ? "bg-white border-amber-200" : "bg-stone-50 border-stone-200"
                )}>
                  {survey.category === 'Health' ? '💊' : survey.category === 'Academic' ? '📚' : survey.category === 'Technology' ? '📡' : '📊'}
                </div>
                <div>
                  <h3 className="font-bold text-stone-900 mb-1 group-hover:text-emerald-800 transition-colors">
                    {survey.title}
                  </h3>
                  <p className="text-[11px] text-stone-500 font-medium flex items-center gap-2">
                    <span className="uppercase font-bold text-emerald-700">{survey.category}</span>
                    <span className="text-stone-300">•</span>
                    {survey.authorName}
                    <span className="text-stone-300">•</span>
                    {survey.estimatedTime} mins
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-8 self-end md:self-center">
                <div className="text-center">
                  <p className={cn(
                    "text-lg font-mono font-bold leading-none",
                    survey.isBoosted ? "text-amber-700" : "text-stone-700"
                  )}>+1</p>
                  <p className="text-[9px] text-stone-400 uppercase font-black tracking-tighter">Credit</p>
                </div>

                <Link
                  to={`/survey/${survey.id}`}
                  className={cn(
                    "px-8 py-2.5 rounded-xl font-bold text-xs uppercase tracking-widest transition-all",
                    survey.isBoosted 
                      ? "bg-emerald-800 text-white hover:bg-emerald-900 shadow-lg shadow-emerald-900/20" 
                      : "border border-emerald-800 text-emerald-800 hover:bg-emerald-50"
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
