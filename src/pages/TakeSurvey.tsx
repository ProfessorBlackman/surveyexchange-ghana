import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../lib/api';
import { Survey } from '../types';
import { useAuthStore } from '../store/authStore';
import { CheckCircle, AlertCircle, ArrowLeft, ArrowRight, Send, Star, User, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';

import { toast } from 'react-hot-toast';

export default function TakeSurvey() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { updateCredits } = useAuthStore();
  const [survey, setSurvey] = useState<Survey | null>(null);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchSurvey = async () => {
      try {
        const res = await api.get(`/surveys/${id}`);
        setSurvey(res.data);
      } catch (err) {
        setError('Failed to load survey');
      } finally {
        setLoading(false);
      }
    };
    fetchSurvey();
  }, [id]);

  const handleAnswer = (questionId: string, value: any) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  const handleCheckbox = (questionId: string, value: string) => {
    const current = answers[questionId] || [];
    const updated = current.includes(value)
      ? current.filter((v: string) => v !== value)
      : [...current, value];
    setAnswers(prev => ({ ...prev, [questionId]: updated }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const formattedAnswers = Object.entries(answers).map(([questionId, value]) => {
        const q = survey?.questions?.find(q => q.id === questionId);
        const req: any = { questionId };
        
        if (q?.questionType === 'CHECKBOX') {
          req.selectedOptions = Array.isArray(value) ? value : [];
        } else if (q?.questionType === 'MULTIPLE_CHOICE' || q?.questionType === 'YES_NO') {
          req.selectedOptions = [String(value)];
        } else {
          req.answerText = String(value);
        }
        
        return req;
      });

      await api.post(`/surveys/${id}/respond`, { answers: formattedAnswers });
      toast.success('+1 credit earned!');
      
      // Refresh credits locally (usually +1)
      const userRes = await api.get('/users/me');
      updateCredits(userRes.data.creditBalance || userRes.data.credits);
      setCompleted(true);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to submit survey');
      toast.error('Submission failed');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return (
    <div className="max-w-3xl mx-auto px-4 py-20 flex flex-col items-center">
      <div className="w-16 h-16 border-4 border-emerald-100 border-t-emerald-600 rounded-full animate-spin mb-4" />
      <p className="text-gray-500 animate-pulse">Loading research survey...</p>
    </div>
  );

  if (completed) return (
    <div className="max-w-md mx-auto px-4 py-20 text-center">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white p-12 rounded-3xl shadow-xl border border-gray-100"
      >
        <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-10 h-10 text-emerald-600" />
        </div>
        <h2 className="text-3xl font-extrabold text-gray-900 mb-2">Thank You!</h2>
        <p className="text-gray-600 mb-8 leading-relaxed">
          Your response has been recorded. You've earned <span className="font-bold text-amber-600">+1 credit</span> for your participation.
        </p>
        <button
          onClick={() => navigate('/')}
          className="w-full py-4 bg-gray-900 text-white font-bold rounded-2xl hover:bg-emerald-600 transition-all shadow-xl shadow-gray-200"
        >
          Return to Feed
        </button>
      </motion.div>
    </div>
  );

  if (!survey) return (
    <div className="max-w-md mx-auto px-4 py-20 text-center">
      <h2 className="text-2xl font-bold text-gray-900">Survey not found</h2>
      <button onClick={() => navigate('/')} className="mt-4 text-emerald-600 font-bold hover:underline">Go back home</button>
    </div>
  );

  return (
    <div className="max-w-3xl mx-auto px-4 pb-20">
      <button
        onClick={() => navigate('/')}
        className="flex items-center gap-2 text-gray-500 hover:text-gray-900 mb-8 transition-colors group"
      >
        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
        Back to Feed
      </button>

      <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-gray-100 mb-8 overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-2 bg-emerald-600" />
        
        <header className="mb-10">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span className="px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold uppercase rounded-md tracking-wider border border-emerald-100 italic">
              {survey.category}
            </span>
          </div>
          <h1 className="text-3xl font-extrabold text-gray-900 mb-4">{survey.title}</h1>
          <p className="text-gray-600 text-lg leading-relaxed">{survey.description}</p>
          
          <div className="flex items-center gap-2 mt-8 pt-6 border-t border-gray-50">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-emerald-600" />
              <span className="text-sm font-medium text-gray-700">{survey.authorName}</span>
            </div>
            <div className="w-1.5 h-1.5 rounded-full bg-gray-300 mx-2" />
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-emerald-600" />
              <span className="text-sm font-medium text-gray-700">~{survey.estimatedTime} mins</span>
            </div>
          </div>
        </header>

        {error && (
          <div className="mb-8 p-4 bg-red-50 border border-red-100 rounded-xl text-red-600 flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-12">
          {survey.questions?.map((q, i) => (
            <div key={q.id} className="space-y-4">
              <h3 className="text-xl font-bold text-gray-900 flex gap-4">
                <span className="text-emerald-500 flex-shrink-0">{i + 1}.</span>
                {q.text}
              </h3>

              {q.questionType === 'MULTIPLE_CHOICE' && (
                <div className="grid grid-cols-1 gap-3 pl-8">
                  {q.options?.map((opt: any) => (
                    <label key={opt.id} className={cn(
                      "flex items-center gap-3 p-4 rounded-2xl border transition-all cursor-pointer hover:bg-emerald-50",
                      answers[q.id!] === opt.text ? "bg-emerald-50 border-emerald-500 shadow-sm" : "bg-gray-50 border-gray-100"
                    )}>
                      <input
                        type="radio"
                        name={q.id}
                        required
                        className="w-5 h-5 accent-emerald-600"
                        checked={answers[q.id!] === opt.text}
                        onChange={() => handleAnswer(q.id!, opt.text)}
                      />
                      <span className="text-gray-700 font-medium">{opt.text}</span>
                    </label>
                  ))}
                </div>
              )}

              {q.questionType === 'CHECKBOX' && (
                <div className="grid grid-cols-1 gap-3 pl-8">
                  {q.options?.map((opt: any) => (
                    <label key={opt.id} className={cn(
                      "flex items-center gap-3 p-4 rounded-2xl border transition-all cursor-pointer hover:bg-emerald-50",
                      (answers[q.id!] || []).includes(opt.text) ? "bg-emerald-50 border-emerald-500 shadow-sm" : "bg-gray-50 border-gray-100"
                    )}>
                      <input
                        type="checkbox"
                        className="w-5 h-5 accent-emerald-600 rounded"
                        checked={(answers[q.id!] || []).includes(opt.text)}
                        onChange={() => handleCheckbox(q.id!, opt.text)}
                      />
                      <span className="text-gray-700 font-medium">{opt.text}</span>
                    </label>
                  ))}
                </div>
              )}

              {q.questionType === 'SHORT_TEXT' && (
                <div className="pl-8">
                  <textarea
                    required
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none min-h-[100px]"
                    placeholder="Your answer..."
                    value={answers[q.id!] || ''}
                    onChange={e => handleAnswer(q.id!, e.target.value)}
                  />
                </div>
              )}

              {q.questionType === 'RATING' && (
                <div className="flex items-center gap-4 pl-8">
                  {[1, 2, 3, 4, 5].map(val => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => handleAnswer(q.id!, val)}
                      className={cn(
                        "w-12 h-12 rounded-xl flex items-center justify-center text-lg font-bold transition-all border",
                        answers[q.id!] === val 
                          ? "bg-amber-400 border-amber-500 text-amber-900 shadow-lg shadow-amber-100"
                          : "bg-gray-50 border-gray-100 text-gray-400 hover:border-amber-200"
                      )}
                    >
                      {val}
                    </button>
                  ))}
                </div>
              )}

              {q.questionType === 'YES_NO' && (
                <div className="flex items-center gap-4 pl-8">
                  {['Yes', 'No'].map(val => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => handleAnswer(q.id!, val)}
                      className={cn(
                        "flex-1 py-4 px-8 rounded-2xl border font-bold transition-all",
                        answers[q.id!] === val
                          ? "bg-emerald-600 border-emerald-700 text-white shadow-xl shadow-emerald-100"
                          : "bg-gray-50 border-gray-100 text-gray-500 hover:border-emerald-200"
                      )}
                    >
                      {val}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}

          <div className="pt-12 border-t border-gray-50 flex flex-col items-center">
            <button
              type="submit"
              disabled={submitting}
              className="px-12 py-5 bg-emerald-600 text-white font-black text-xl rounded-2xl hover:bg-emerald-700 shadow-2xl shadow-emerald-200 transition-all transform hover:scale-105 active:scale-95 disabled:opacity-50 flex items-center gap-3 uppercase tracking-wider"
            >
              {submitting ? 'Submitting...' : (
                <>
                  <Send className="w-6 h-6" />
                  Submit Survey
                </>
              )}
            </button>
            <p className="mt-4 text-gray-400 text-sm italic">Completing this survey gives you 1 credit toward your own research.</p>
          </div>
        </form>
      </div>
    </div>
  );
}
