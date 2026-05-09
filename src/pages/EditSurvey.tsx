import React, { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../lib/api';
import { Question, SurveyStatus } from '../types';
import {
  Plus,
  Trash2,
  Save,
  X,
  Clock,
  Tag,
  Users,
  Eye,
  Pencil,
  ChevronLeft,
  CheckSquare,
  List,
  Hash,
  Type,
  MessageSquare,
} from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { cn } from '../lib/utils';
import toast from 'react-hot-toast';

type Mode = 'edit' | 'preview';

const STATUS_STYLES: Record<SurveyStatus, string> = {
  DRAFT:  'bg-amber-100 text-amber-700',
  ACTIVE: 'bg-emerald-100 text-emerald-700',
  CLOSED: 'bg-stone-100 text-stone-500',
};

// ─── Preview renderer ───────────────────────────────────────────────────────

function SurveyPreview({
  title,
  description,
  category,
  estimatedTime,
  questions,
}: {
  title: string;
  description: string;
  category: string;
  estimatedTime: number;
  questions: Question[];
}) {
  const [answers, setAnswers] = useState<Record<string, unknown>>({});

  const handleAnswer = (qid: string, value: unknown) =>
    setAnswers((prev) => ({ ...prev, [qid]: value }));

  const handleCheckbox = (qid: string, opt: string) => {
    const cur = (answers[qid] as string[]) ?? [];
    setAnswers((prev) => ({
      ...prev,
      [qid]: cur.includes(opt) ? cur.filter((v) => v !== opt) : [...cur, opt],
    }));
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Preview banner */}
      <div className="mb-6 flex items-center gap-3 px-5 py-3 bg-amber-50 border border-amber-200 rounded-2xl">
        <Eye className="w-4 h-4 text-amber-600 shrink-0" />
        <p className="text-xs font-bold text-amber-700">
          Preview mode — this is how respondents will see your survey. Responses are not submitted.
        </p>
      </div>

      <div className="bg-white rounded-3xl border border-stone-200 shadow-sm overflow-hidden">
        <div className="h-2 bg-emerald-600" />
        <div className="p-8 md:p-10">
          <header className="mb-10">
            {category && (
              <span className="inline-block mb-4 px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold uppercase rounded-md tracking-wider border border-emerald-100 italic">
                {category}
              </span>
            )}
            <h1 className="text-3xl font-extrabold text-stone-900 mb-3">
              {title || <span className="text-stone-300 italic">Untitled survey</span>}
            </h1>
            {description && (
              <p className="text-stone-600 text-lg leading-relaxed">{description}</p>
            )}
            {estimatedTime > 0 && (
              <p className="mt-4 text-sm text-stone-400 font-medium flex items-center gap-1.5">
                <Clock className="w-4 h-4" />
                ~{estimatedTime} mins
              </p>
            )}
          </header>

          {questions.length === 0 ? (
            <div className="py-16 text-center border-2 border-dashed border-stone-200 rounded-2xl">
              <p className="text-stone-400 text-sm font-medium">No questions yet — switch to Edit to add some.</p>
            </div>
          ) : (
            <div className="space-y-10">
              {questions.map((q, i) => (
                <div key={i} className="space-y-4">
                  <h3 className="text-xl font-bold text-stone-900 flex gap-3">
                    <span className="text-emerald-500 shrink-0">{i + 1}.</span>
                    {q.text || <span className="text-stone-300 italic">Untitled question</span>}
                  </h3>

                  {q.questionType === 'MULTIPLE_CHOICE' && (
                    <div className="space-y-3 pl-7">
                      {(q.options ?? []).map((opt) => (
                        <label
                          key={opt}
                          className={cn(
                            'flex items-center gap-3 p-4 rounded-2xl border cursor-pointer transition-all hover:bg-emerald-50',
                            answers[String(i)] === opt
                              ? 'bg-emerald-50 border-emerald-500'
                              : 'bg-stone-50 border-stone-100'
                          )}
                        >
                          <input
                            type="radio"
                            name={`q-${i}`}
                            className="w-4 h-4 accent-emerald-600"
                            checked={answers[String(i)] === opt}
                            onChange={() => handleAnswer(String(i), opt)}
                          />
                          <span className="text-stone-700 font-medium">{opt}</span>
                        </label>
                      ))}
                      {(q.options ?? []).length === 0 && (
                        <p className="text-stone-400 text-xs italic pl-1">No options added yet</p>
                      )}
                    </div>
                  )}

                  {q.questionType === 'CHECKBOX' && (
                    <div className="space-y-3 pl-7">
                      {(q.options ?? []).map((opt) => (
                        <label
                          key={opt}
                          className={cn(
                            'flex items-center gap-3 p-4 rounded-2xl border cursor-pointer transition-all hover:bg-emerald-50',
                            ((answers[String(i)] as string[]) ?? []).includes(opt)
                              ? 'bg-emerald-50 border-emerald-500'
                              : 'bg-stone-50 border-stone-100'
                          )}
                        >
                          <input
                            type="checkbox"
                            className="w-4 h-4 accent-emerald-600"
                            checked={((answers[String(i)] as string[]) ?? []).includes(opt)}
                            onChange={() => handleCheckbox(String(i), opt)}
                          />
                          <span className="text-stone-700 font-medium">{opt}</span>
                        </label>
                      ))}
                      {(q.options ?? []).length === 0 && (
                        <p className="text-stone-400 text-xs italic pl-1">No options added yet</p>
                      )}
                    </div>
                  )}

                  {(q.questionType === 'SHORT_TEXT' || q.questionType === 'LONG_TEXT') && (
                    <div className="pl-7">
                      <textarea
                        className="w-full px-4 py-3 bg-stone-50 border border-stone-100 rounded-2xl outline-none min-h-[90px] text-sm"
                        placeholder="Your answer..."
                        value={(answers[String(i)] as string) ?? ''}
                        onChange={(e) => handleAnswer(String(i), e.target.value)}
                      />
                    </div>
                  )}

                  {q.questionType === 'RATING' && (
                    <div className="flex items-center gap-3 pl-7">
                      {[1, 2, 3, 4, 5].map((val) => (
                        <button
                          key={val}
                          type="button"
                          onClick={() => handleAnswer(String(i), val)}
                          className={cn(
                            'w-11 h-11 rounded-xl border font-bold transition-all',
                            answers[String(i)] === val
                              ? 'bg-amber-400 border-amber-500 text-amber-900'
                              : 'bg-stone-50 border-stone-100 text-stone-400 hover:border-amber-200'
                          )}
                        >
                          {val}
                        </button>
                      ))}
                    </div>
                  )}

                  {q.questionType === 'YES_NO' && (
                    <div className="flex gap-4 pl-7">
                      {['Yes', 'No'].map((val) => (
                        <button
                          key={val}
                          type="button"
                          onClick={() => handleAnswer(String(i), val)}
                          className={cn(
                            'flex-1 py-4 rounded-2xl border font-bold transition-all',
                            answers[String(i)] === val
                              ? 'bg-emerald-600 border-emerald-700 text-white'
                              : 'bg-stone-50 border-stone-100 text-stone-500 hover:border-emerald-200'
                          )}
                        >
                          {val}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              <div className="pt-8 border-t border-stone-100 flex flex-col items-center gap-3">
                <button
                  type="button"
                  disabled
                  className="px-10 py-4 bg-stone-200 text-stone-400 font-black text-sm rounded-2xl uppercase tracking-wider cursor-not-allowed"
                >
                  Submit Survey (preview only)
                </button>
                <p className="text-stone-400 text-xs italic">
                  Submission is disabled in preview mode
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Main page ───────────────────────────────────────────────────────────────

export default function EditSurvey() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [mode, setMode] = useState<Mode>('edit');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<SurveyStatus>('DRAFT');
  const [showFloatingAdd, setShowFloatingAdd] = useState(false);
  const addButtonRowRef = useRef<HTMLDivElement>(null);

  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Academic');
  const [estimatedTime, setEstimatedTime] = useState(5);
  const [targetResponses, setTargetResponses] = useState<number | ''>(50);
  const [questions, setQuestions] = useState<Question[]>([]);

  useEffect(() => {
    const loadSurvey = async () => {
      try {
        const res = await api.get(`/surveys/${id}`);
        const s = res.data;
        setTitle(s.title ?? '');
        setDescription(s.description ?? '');
        setCategory(s.category ?? 'Academic');
        setEstimatedTime(s.estimatedTime ?? 5);
        setTargetResponses(s.targetResponses ?? 50);
        setQuestions(
          (s.questions ?? []).sort(
            (a: Question, b: Question) => (a.orderIndex ?? 0) - (b.orderIndex ?? 0)
          )
        );
        if (s.status) setStatus(s.status);
      } catch {
        toast.error('Failed to load survey');
        navigate('/dashboard');
      } finally {
        setLoading(false);
      }
    };
    loadSurvey();
  }, [id]);

  useEffect(() => {
    if (loading) return;
    const el = addButtonRowRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setShowFloatingAdd(!entry.isIntersecting),
      { rootMargin: '-80px 0px 0px 0px' }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [loading]);

  // ── Question helpers ──────────────────────────────────────────────────────

  const addQuestion = () => {
    setQuestions((prev) => [
      ...prev,
      { text: '', questionType: 'MULTIPLE_CHOICE', options: ['Option 1', 'Option 2'], orderIndex: prev.length },
    ]);
  };

  const removeQuestion = (idx: number) =>
    setQuestions((prev) => prev.filter((_, i) => i !== idx));

  const updateQuestion = (idx: number, field: string, value: unknown) =>
    setQuestions((prev) => {
      const next = [...prev];
      next[idx] = { ...next[idx], [field]: value };
      return next;
    });

  const addOption = (qIdx: number) =>
    setQuestions((prev) => {
      const next = [...prev];
      const opts = next[qIdx].options ?? [];
      next[qIdx] = { ...next[qIdx], options: [...opts, `Option ${opts.length + 1}`] };
      return next;
    });

  const removeOption = (qIdx: number, oIdx: number) =>
    setQuestions((prev) => {
      const next = [...prev];
      next[qIdx] = { ...next[qIdx], options: next[qIdx].options!.filter((_, i) => i !== oIdx) };
      return next;
    });

  const updateOption = (qIdx: number, oIdx: number, value: string) =>
    setQuestions((prev) => {
      const next = [...prev];
      const opts = [...next[qIdx].options!];
      opts[oIdx] = value;
      next[qIdx] = { ...next[qIdx], options: opts };
      return next;
    });

  // ── Save ─────────────────────────────────────────────────────────────────

  const handleSave = async () => {
    if (questions.length === 0) {
      toast.error('Please add at least one question');
      return;
    }
    setSaving(true);
    try {
      await api.put(`/surveys/${id}`, {
        title,
        description,
        category,
        estimatedTime,
        targetResponses: Number(targetResponses),
        questions: questions.map((q, i) => ({
          text: q.text,
          questionType: q.questionType,
          options: q.options,
          required: q.required ?? true,
          orderIndex: i,
        })),
      });
      toast.success('Survey saved');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to save survey');
    } finally {
      setSaving(false);
    }
  };

  // ── Loading ───────────────────────────────────────────────────────────────

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16 sm:py-20 flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-stone-100 border-t-emerald-800 rounded-full animate-spin" />
        <p className="text-stone-400 text-sm animate-pulse">Loading survey…</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-4 sm:pt-6 pb-24">

      {/* Sticky header */}
      <div className="sticky top-16 z-40 bg-stone-50 border-b border-stone-200 py-3 mb-8 flex items-center gap-2 md:gap-4 flex-wrap">
        <Link
          to="/dashboard"
          className="flex items-center gap-1.5 text-stone-400 hover:text-stone-700 transition-colors shrink-0"
        >
          <ChevronLeft className="w-4 h-4" />
          <span className="text-xs font-bold uppercase tracking-widest">Dashboard</span>
        </Link>

        <div className="grow min-w-0">
          <p className="text-sm font-bold text-stone-700 truncate">{title || 'Untitled survey'}</p>
        </div>

        <span className={cn('px-2.5 py-1 rounded-full text-[11px] font-black uppercase tracking-widest', STATUS_STYLES[status])}>
          {status}
        </span>

        {/* Edit / Preview toggle */}
        <div className="flex items-center gap-1 bg-stone-200/60 p-0.5 rounded-lg">
          <button
            onClick={() => setMode('edit')}
            className={cn(
              'flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-bold uppercase tracking-widest transition-all',
              mode === 'edit' ? 'bg-white text-stone-900 shadow-sm' : 'text-stone-500 hover:text-stone-700'
            )}
          >
            <Pencil className="w-3 h-3" />
            Edit
          </button>
          <button
            onClick={() => setMode('preview')}
            className={cn(
              'flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-bold uppercase tracking-widest transition-all',
              mode === 'preview' ? 'bg-white text-stone-900 shadow-sm' : 'text-stone-500 hover:text-stone-700'
            )}
          >
            <Eye className="w-3 h-3" />
            Preview
          </button>
        </div>

        {mode === 'edit' && (
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-1.5 px-5 py-2 bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs uppercase tracking-widest rounded-xl transition-all disabled:opacity-50 shadow-md shadow-emerald-900/10 shrink-0"
          >
            <Save className="w-3.5 h-3.5" />
            {saving ? 'Saving…' : 'Save Changes'}
          </button>
        )}
      </div>

      {/* Content area */}
      <AnimatePresence mode="wait">
        {mode === 'preview' ? (
          <motion.div
            key="preview"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
          >
            <SurveyPreview
              title={title}
              description={description}
              category={category}
              estimatedTime={estimatedTime}
              questions={questions}
            />
          </motion.div>
        ) : (
          <motion.div
            key="edit"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="space-y-8"
          >
            {/* Metadata */}
            <section className="bg-white rounded-3xl p-8 shadow-sm border border-stone-100">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-stone-700 mb-2 uppercase tracking-wide">
                    Survey Title
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all text-xl font-bold"
                    placeholder="e.g., Student Perception of AI in Education"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-stone-700 mb-2 uppercase tracking-wide">
                    Description
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={3}
                    className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
                    placeholder="Briefly explain what your survey is about…"
                  />
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-bold text-stone-700 mb-2 uppercase tracking-wide">
                    <Tag className="w-4 h-4" />
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none"
                  >
                    <option>Academic</option>
                    <option>Social</option>
                    <option>Market Research</option>
                    <option>Technology</option>
                    <option>Health</option>
                  </select>
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-bold text-stone-700 mb-2 uppercase tracking-wide">
                    <Clock className="w-4 h-4" />
                    Est. Time (minutes)
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={estimatedTime}
                    onChange={(e) => setEstimatedTime(parseInt(e.target.value) || 1)}
                    className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="flex items-center gap-2 text-sm font-bold text-stone-700 mb-2 uppercase tracking-wide">
                    <Users className="w-4 h-4" />
                    Target Responses
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={targetResponses}
                    onChange={(e) =>
                      setTargetResponses(e.target.value === '' ? '' : parseInt(e.target.value))
                    }
                    className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                </div>
              </div>
            </section>

            {/* Questions */}
            <div className="space-y-6">
              <div ref={addButtonRowRef} className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-stone-900">
                  Questions
                  <span className="ml-2 text-sm font-medium text-stone-400">({questions.length})</span>
                </h2>
                <button
                  type="button"
                  onClick={addQuestion}
                  className="px-4 py-2 bg-stone-100 text-stone-700 rounded-xl hover:bg-emerald-50 hover:text-emerald-700 transition-all font-bold flex items-center gap-2 text-sm"
                >
                  <Plus className="w-4 h-4" />
                  Add Question
                </button>
              </div>

              <AnimatePresence>
                {questions.map((q, qIdx) => (
                  <motion.div
                    key={qIdx}
                    initial={{ opacity: 0, scale: 0.97 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.97 }}
                    className="bg-white rounded-3xl p-8 shadow-sm border border-stone-100 relative"
                  >
                    <button
                      type="button"
                      onClick={() => removeQuestion(qIdx)}
                      aria-label={`Remove question ${qIdx + 1}`}
                      className="absolute top-4 right-4 p-2 text-stone-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" aria-hidden="true" />
                    </button>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="md:col-span-2">
                        <label className="block text-xs font-black text-stone-400 uppercase tracking-widest mb-1">
                          Question {qIdx + 1}
                        </label>
                        <input
                          type="text"
                          value={q.text}
                          onChange={(e) => updateQuestion(qIdx, 'text', e.target.value)}
                          className="w-full px-0 py-2 border-b-2 border-transparent focus:border-emerald-500 bg-transparent outline-none transition-all text-lg font-semibold"
                          placeholder="Type your question here…"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-black text-stone-400 uppercase tracking-widest mb-1">
                          Type
                        </label>
                        <select
                          value={q.questionType}
                          onChange={(e) => updateQuestion(qIdx, 'questionType', e.target.value)}
                          className="w-full py-2 bg-transparent outline-none border-b-2 border-transparent focus:border-emerald-500 font-semibold cursor-pointer"
                        >
                          <option value="MULTIPLE_CHOICE">Multiple Choice</option>
                          <option value="CHECKBOX">Checkboxes</option>
                          <option value="SHORT_TEXT">Short Text</option>
                          <option value="LONG_TEXT">Long Text</option>
                          <option value="RATING">Rating (1–5)</option>
                          <option value="YES_NO">Yes / No</option>
                        </select>
                      </div>
                    </div>

                    {(q.questionType === 'MULTIPLE_CHOICE' || q.questionType === 'CHECKBOX') && (
                      <div className="mt-8 space-y-3">
                        <label className="block text-xs font-black text-stone-400 uppercase tracking-widest mb-2">
                          Options
                        </label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {q.options?.map((opt, oIdx) => (
                            <div key={oIdx} className="flex items-center gap-2">
                              <input
                                type="text"
                                value={opt}
                                aria-label={`Option ${oIdx + 1} for question ${qIdx + 1}`}
                                onChange={(e) => updateOption(qIdx, oIdx, e.target.value)}
                                className="grow px-4 py-2 bg-stone-50 border border-stone-100 rounded-xl focus:ring-1 focus:ring-emerald-500 outline-none text-sm"
                              />
                              {q.options!.length > 1 && (
                                <button
                                  type="button"
                                  onClick={() => removeOption(qIdx, oIdx)}
                                  aria-label={`Remove option ${oIdx + 1}`}
                                  className="p-1.5 text-stone-300 hover:text-red-500 transition-all shrink-0 cursor-pointer"
                                >
                                  <X className="w-4 h-4" aria-hidden="true" />
                                </button>
                              )}
                            </div>
                          ))}
                        </div>
                        <button
                          type="button"
                          onClick={() => addOption(qIdx)}
                          className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1.5 mt-3"
                        >
                          <Plus className="w-3 h-3" />
                          Add Option
                        </button>
                      </div>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>

              {questions.length === 0 && (
                <div className="bg-stone-50 rounded-3xl p-12 text-center border-2 border-dashed border-stone-200">
                  <p className="text-stone-400 text-sm">No questions yet. Click "Add Question" to start.</p>
                </div>
              )}
            </div>

            {/* Bottom save bar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center sm:justify-end gap-3 pt-4">
              <Link
                to="/dashboard"
                className="px-6 py-3 text-stone-500 font-bold hover:text-stone-900 transition-all text-sm text-center sm:text-left"
              >
                Back to Dashboard
              </Link>
              <button
                type="button"
                onClick={handleSave}
                disabled={saving || questions.length === 0}
                className="flex items-center justify-center gap-2 px-8 py-3 bg-emerald-600 text-white font-bold rounded-2xl hover:bg-emerald-700 shadow-xl shadow-emerald-200 transition-all disabled:opacity-50"
              >
                <Save className="w-5 h-5" />
                {saving ? 'Saving…' : 'Save Changes'}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating "Add Question" button — appears when the header row scrolls out of view */}
      <AnimatePresence>
        {mode === 'edit' && showFloatingAdd && (
          <motion.button
            type="button"
            onClick={addQuestion}
            initial={{ opacity: 0, scale: 0.8, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 16 }}
            transition={{ type: 'spring', stiffness: 400, damping: 28 }}
            className="fixed bottom-8 right-8 z-50 flex items-center gap-2 px-5 py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm rounded-2xl shadow-xl shadow-emerald-900/25 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Add Question
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
