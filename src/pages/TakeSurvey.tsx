import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../lib/api';
import { Survey } from '../types';
import { useAuthStore } from '../store/authStore';
import { useSurveyTimer } from '../hooks/useSurveyTimer';
import { CheckCircle, AlertCircle, ArrowLeft, Send, User, Clock } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';
import { toast } from 'react-hot-toast';

export default function TakeSurvey() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { updateCredits } = useAuthStore();
  const { getElapsedSeconds } = useSurveyTimer();
  const [survey, setSurvey] = useState<Survey | null>(null);
  const [answers, setAnswers] = useState<Record<string, unknown>>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchSurvey = async () => {
      try {
        const res = await api.get(`/surveys/${id}`);
        setSurvey(res.data);
      } catch {
        setError('Failed to load survey');
      } finally {
        setLoading(false);
      }
    };
    fetchSurvey();
  }, [id]);

  const handleAnswer = (questionId: string, value: unknown) =>
    setAnswers((prev) => ({ ...prev, [questionId]: value }));

  const handleCheckbox = (questionId: string, option: string) => {
    const current = (answers[questionId] as string[]) ?? [];
    const updated = current.includes(option)
      ? current.filter((v) => v !== option)
      : [...current, option];
    setAnswers((prev) => ({ ...prev, [questionId]: updated }));
  };

  const serializeAnswerValue = (questionId: string, value: unknown): string => {
    const q = survey?.questions?.find((q) => q.id === questionId);
    if (q?.questionType === 'CHECKBOX') {
      return Array.isArray(value) ? value.join(',') : String(value);
    }
    return String(value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      const formattedAnswers = Object.entries(answers).map(([questionId, value]) => ({
        questionId,
        answerValue: serializeAnswerValue(questionId, value),
      }));
      const res = await api.post(`/surveys/${id}/respond`, {
        answers: formattedAnswers,
        timeToCompleteSeconds: getElapsedSeconds(),
      });
      if (res.data?.newBalance != null) {
        updateCredits(res.data.newBalance);
      } else {
        const userRes = await api.get('/users/me');
        updateCredits(userRes.data.creditBalance);
      }
      toast.success('+1 credit earned!');
      setCompleted(true);
    } catch (err: any) {
      const status = err.response?.status;
      if (status === 409) {
        const msg = "You've already responded to this survey";
        setError(msg);
        toast.error(msg);
      } else {
        const msg = err.response?.data?.message || 'Failed to submit survey';
        setError(msg);
        toast.error('Submission failed');
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (loading)
    return (
      <div className="max-w-3xl mx-auto px-4 pt-16 sm:pt-20 pb-10 flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-emerald-100 border-t-emerald-600 rounded-full animate-spin" />
        <p className="text-stone-500 text-sm animate-pulse">Loading research survey…</p>
      </div>
    );

  if (completed)
    return (
      <div className="max-w-md mx-auto px-4 py-16 sm:py-20 text-center">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.25 }}
          className="bg-white p-10 sm:p-12 rounded-3xl shadow-xl border border-stone-100"
        >
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-8 h-8 sm:w-10 sm:h-10 text-emerald-600" aria-hidden="true" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 mb-2">Thank You!</h2>
          <p className="text-stone-600 mb-8 leading-relaxed text-sm sm:text-base">
            Your response has been recorded. You've earned{' '}
            <span className="font-bold text-amber-600">+1 credit</span> for your participation.
          </p>
          <button
            onClick={() => navigate('/')}
            className="w-full py-4 bg-stone-900 text-white font-bold rounded-2xl hover:bg-emerald-700 transition-all shadow-xl cursor-pointer"
          >
            Return to Feed
          </button>
        </motion.div>
      </div>
    );

  if (!survey)
    return (
      <div className="max-w-md mx-auto px-4 py-16 sm:py-20 text-center">
        <h2 className="text-2xl font-bold text-stone-900">Survey not found</h2>
        <button
          onClick={() => navigate('/')}
          className="mt-4 text-emerald-600 font-bold hover:underline cursor-pointer"
        >
          Go back home
        </button>
      </div>
    );

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-6 sm:pt-10 pb-20">
      <button
        onClick={() => navigate('/')}
        className="flex items-center gap-2 text-stone-500 hover:text-stone-900 mb-6 sm:mb-8 transition-colors group cursor-pointer"
        aria-label="Back to survey feed"
      >
        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" aria-hidden="true" />
        <span className="text-sm font-bold">Back to Feed</span>
      </button>

      <div className="bg-white rounded-3xl p-6 sm:p-8 md:p-12 shadow-sm border border-stone-100 mb-8 overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-2 bg-emerald-600" aria-hidden="true" />

        <header className="mb-8 sm:mb-10">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span className="px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold uppercase rounded-md tracking-wider border border-emerald-100 italic">
              {survey.category}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 mb-3 sm:mb-4">
            {survey.title}
          </h1>
          <p className="text-stone-600 text-base sm:text-lg leading-relaxed">{survey.description}</p>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-6 sm:mt-8 pt-5 sm:pt-6 border-t border-stone-100">
            {survey.owner?.name && (
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-emerald-600" aria-hidden="true" />
                <span className="text-sm font-medium text-stone-700">{survey.owner.name}</span>
              </div>
            )}
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-emerald-600" aria-hidden="true" />
              <span className="text-sm font-medium text-stone-700">~{survey.estimatedTime} mins</span>
            </div>
          </div>
        </header>

        {error && (
          <div
            role="alert"
            className="mb-8 p-4 bg-red-50 border border-red-100 rounded-xl text-red-600 flex items-center gap-2 text-sm"
          >
            <AlertCircle className="w-5 h-5 shrink-0" aria-hidden="true" />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-10 sm:space-y-12">
          {survey.questions?.map((q, i) => (
            <fieldset key={q.id} className="space-y-4 border-0 p-0 m-0">
              <legend className="text-lg sm:text-xl font-bold text-stone-900 flex gap-3 w-full">
                <span className="text-emerald-500 shrink-0">{i + 1}.</span>
                {q.text}
              </legend>

              {q.questionType === 'MULTIPLE_CHOICE' && (
                <div className="grid grid-cols-1 gap-3 pl-4 sm:pl-8">
                  {q.options?.map((opt) => (
                    <label
                      key={opt}
                      className={cn(
                        'flex items-center gap-3 p-4 rounded-2xl border transition-all cursor-pointer hover:bg-emerald-50',
                        answers[q.id!] === opt
                          ? 'bg-emerald-50 border-emerald-500 shadow-sm'
                          : 'bg-stone-50 border-stone-100'
                      )}
                    >
                      <input
                        type="radio"
                        name={q.id}
                        required
                        className="w-5 h-5 accent-emerald-600 shrink-0"
                        checked={answers[q.id!] === opt}
                        onChange={() => handleAnswer(q.id!, opt)}
                      />
                      <span className="text-stone-700 font-medium text-sm sm:text-base">{opt}</span>
                    </label>
                  ))}
                </div>
              )}

              {q.questionType === 'CHECKBOX' && (
                <div className="grid grid-cols-1 gap-3 pl-4 sm:pl-8">
                  {q.options?.map((opt) => (
                    <label
                      key={opt}
                      className={cn(
                        'flex items-center gap-3 p-4 rounded-2xl border transition-all cursor-pointer hover:bg-emerald-50',
                        ((answers[q.id!] as string[]) ?? []).includes(opt)
                          ? 'bg-emerald-50 border-emerald-500 shadow-sm'
                          : 'bg-stone-50 border-stone-100'
                      )}
                    >
                      <input
                        type="checkbox"
                        className="w-5 h-5 accent-emerald-600 rounded shrink-0"
                        checked={((answers[q.id!] as string[]) ?? []).includes(opt)}
                        onChange={() => handleCheckbox(q.id!, opt)}
                      />
                      <span className="text-stone-700 font-medium text-sm sm:text-base">{opt}</span>
                    </label>
                  ))}
                </div>
              )}

              {(q.questionType === 'SHORT_TEXT' || q.questionType === 'LONG_TEXT') && (
                <div className="pl-4 sm:pl-8">
                  <textarea
                    required
                    className="w-full px-4 py-3 bg-stone-50 border border-stone-100 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none min-h-24 resize-y text-sm"
                    placeholder="Your answer..."
                    value={(answers[q.id!] as string) ?? ''}
                    onChange={(e) => handleAnswer(q.id!, e.target.value)}
                  />
                </div>
              )}

              {q.questionType === 'RATING' && (
                <div className="flex items-center gap-2 sm:gap-3 pl-4 sm:pl-8" role="group" aria-label={`Rating for: ${q.text}`}>
                  {[1, 2, 3, 4, 5].map((val) => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => handleAnswer(q.id!, val)}
                      aria-pressed={answers[q.id!] === val}
                      aria-label={`Rate ${val} out of 5`}
                      className={cn(
                        'w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center text-base sm:text-lg font-bold transition-all border cursor-pointer',
                        answers[q.id!] === val
                          ? 'bg-amber-400 border-amber-500 text-amber-900 shadow-lg shadow-amber-100'
                          : 'bg-stone-50 border-stone-100 text-stone-400 hover:border-amber-200'
                      )}
                    >
                      {val}
                    </button>
                  ))}
                </div>
              )}

              {q.questionType === 'YES_NO' && (
                <div className="flex items-center gap-3 sm:gap-4 pl-4 sm:pl-8">
                  {['Yes', 'No'].map((val) => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => handleAnswer(q.id!, val)}
                      aria-pressed={answers[q.id!] === val}
                      className={cn(
                        'flex-1 py-4 px-6 sm:px-8 rounded-2xl border font-bold transition-all cursor-pointer text-sm sm:text-base',
                        answers[q.id!] === val
                          ? 'bg-emerald-600 border-emerald-700 text-white shadow-xl shadow-emerald-100'
                          : 'bg-stone-50 border-stone-100 text-stone-500 hover:border-emerald-200'
                      )}
                    >
                      {val}
                    </button>
                  ))}
                </div>
              )}
            </fieldset>
          ))}

          <div className="pt-10 sm:pt-12 border-t border-stone-100 flex flex-col items-center gap-3">
            <button
              type="submit"
              disabled={submitting}
              className="w-full sm:w-auto px-10 sm:px-12 py-4 sm:py-5 bg-emerald-600 text-white font-black text-base sm:text-xl rounded-2xl hover:bg-emerald-700 shadow-2xl shadow-emerald-200 transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-3 uppercase tracking-wider cursor-pointer"
            >
              {submitting ? (
                'Submitting…'
              ) : (
                <>
                  <Send className="w-5 h-5 sm:w-6 sm:h-6" aria-hidden="true" />
                  Submit Survey
                </>
              )}
            </button>
            <p className="text-stone-400 text-xs sm:text-sm italic text-center">
              Completing this survey gives you 1 credit toward your own research.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
