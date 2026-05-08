import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../lib/api';
import {
  Plus,
  Trash2,
  Save,
  X,
  List,
  Hash,
  Type,
  CheckSquare,
  MessageSquare,
  Clock,
  Tag,
  Users,
  FileText,
} from 'lucide-react';
import { Question } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import toast from 'react-hot-toast';

export default function CreateSurvey() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Academic');
  const [estimatedTime, setEstimatedTime] = useState(5);
  const [targetResponses, setTargetResponses] = useState<number | ''>(50);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [draftLoading, setDraftLoading] = useState(false);
  const [publishLoading, setPublishLoading] = useState(false);
  const [showFloatingAdd, setShowFloatingAdd] = useState(false);
  const addButtonRowRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const loading = draftLoading || publishLoading;

  useEffect(() => {
    const el = addButtonRowRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setShowFloatingAdd(!entry.isIntersecting),
      { rootMargin: '-80px 0px 0px 0px' }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const addQuestion = () => {
    setQuestions((prev) => [
      ...prev,
      {
        text: '',
        questionType: 'MULTIPLE_CHOICE',
        options: ['Option 1', 'Option 2'],
        orderIndex: prev.length,
      },
    ]);
  };

  const removeQuestion = (index: number) => {
    setQuestions((prev) => prev.filter((_, i) => i !== index));
  };

  const updateQuestion = (index: number, field: string, value: unknown) => {
    setQuestions((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const addOption = (qIndex: number) => {
    setQuestions((prev) => {
      const updated = [...prev];
      const opts = updated[qIndex].options ?? [];
      updated[qIndex] = {
        ...updated[qIndex],
        options: [...opts, `Option ${opts.length + 1}`],
      };
      return updated;
    });
  };

  const removeOption = (qIndex: number, oIndex: number) => {
    setQuestions((prev) => {
      const updated = [...prev];
      updated[qIndex] = {
        ...updated[qIndex],
        options: updated[qIndex].options!.filter((_, i) => i !== oIndex),
      };
      return updated;
    });
  };

  const updateOption = (qIndex: number, oIndex: number, value: string) => {
    setQuestions((prev) => {
      const updated = [...prev];
      const opts = [...updated[qIndex].options!];
      opts[oIndex] = value;
      updated[qIndex] = { ...updated[qIndex], options: opts };
      return updated;
    });
  };

  const buildPayload = (status: 'DRAFT' | 'ACTIVE') => ({
    title,
    description,
    category,
    estimatedTime,
    targetResponses: Number(targetResponses),
    status,
    questions: questions.map((q, i) => ({
      text: q.text,
      questionType: q.questionType,
      options: q.options,
      required: q.required ?? true,
      orderIndex: i,
    })),
  });

  const handleSaveDraft = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (questions.length === 0) {
      toast.error('Please add at least one question');
      return;
    }
    setDraftLoading(true);
    try {
      await api.post('/surveys', buildPayload('DRAFT'));
      toast.success('Survey saved as draft');
      navigate('/dashboard');
    } catch {
      toast.error('Failed to save draft');
    } finally {
      setDraftLoading(false);
    }
  };

  const handlePublish = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (questions.length === 0) {
      toast.error('Please add at least one question');
      return;
    }
    setPublishLoading(true);
    try {
      await api.post('/surveys', buildPayload('ACTIVE'));
      toast.success('Survey published!');
      navigate('/dashboard');
    } catch {
      toast.error('Failed to publish survey');
    } finally {
      setPublishLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 pb-20">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
          Create New Survey
        </h1>
        <p className="text-gray-500 mt-2">
          Design your research tool and start gathering insights.
        </p>
      </div>

      <form className="space-y-8">
        {/* Basic Info */}
        <section className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">
                Survey Title
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all text-xl font-bold"
                placeholder="e.g., Student Perception of AI in Education"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">
                Description
              </label>
              <textarea
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
                placeholder="Briefly explain what your survey is about..."
              />
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">
                <Tag className="w-4 h-4" />
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none"
              >
                <option>Academic</option>
                <option>Social</option>
                <option>Market Research</option>
                <option>Technology</option>
                <option>Health</option>
              </select>
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">
                <Clock className="w-4 h-4" />
                Est. Time (minutes)
              </label>
              <input
                type="number"
                required
                min={1}
                value={estimatedTime}
                onChange={(e) => setEstimatedTime(parseInt(e.target.value))}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>

            <div className="md:col-span-2">
              <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">
                <Users className="w-4 h-4" />
                Target Responses
              </label>
              <input
                type="number"
                required
                min={1}
                value={targetResponses}
                onChange={(e) =>
                  setTargetResponses(
                    e.target.value === '' ? '' : parseInt(e.target.value)
                  )
                }
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none"
                placeholder="e.g., 100"
              />
              <p className="mt-1.5 text-xs text-gray-400">
                How many responses do you want to collect?
              </p>
            </div>
          </div>
        </section>

        {/* Questions */}
        <div className="space-y-6">
          <div ref={addButtonRowRef} className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">Questions</h2>
            <button
              type="button"
              onClick={addQuestion}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-emerald-50 hover:text-emerald-700 transition-all font-bold flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Add Question
            </button>
          </div>

          <div className="space-y-6">
            <AnimatePresence>
              {questions.map((q, qIndex) => (
                <motion.div
                  key={qIndex}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 relative group"
                >
                  <button
                    type="button"
                    onClick={() => removeQuestion(qIndex)}
                    className="absolute top-4 right-4 p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="md:col-span-2">
                      <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-1">
                        Question {qIndex + 1}
                      </label>
                      <input
                        type="text"
                        required
                        value={q.text}
                        onChange={(e) =>
                          updateQuestion(qIndex, 'text', e.target.value)
                        }
                        className="w-full px-0 py-2 border-b-2 border-transparent focus:border-emerald-500 bg-transparent outline-none transition-all text-lg font-semibold"
                        placeholder="Type your question here..."
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-1">
                        Type
                      </label>
                      <select
                        value={q.questionType}
                        onChange={(e) =>
                          updateQuestion(qIndex, 'questionType', e.target.value)
                        }
                        className="w-full py-2 bg-transparent outline-none border-b-2 border-transparent focus:border-emerald-500 font-semibold cursor-pointer"
                      >
                        <option value="MULTIPLE_CHOICE">Multiple Choice</option>
                        <option value="CHECKBOX">Checkboxes</option>
                        <option value="SHORT_TEXT">Short Text</option>
                        <option value="LONG_TEXT">Long Text</option>
                        <option value="RATING">Rating (1-5)</option>
                        <option value="YES_NO">Yes/No</option>
                      </select>
                    </div>
                  </div>

                  {(q.questionType === 'MULTIPLE_CHOICE' ||
                    q.questionType === 'CHECKBOX') && (
                    <div className="mt-8 space-y-3">
                      <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">
                        Options
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {q.options?.map((opt, oIndex) => (
                          <div
                            key={oIndex}
                            className="flex items-center gap-2 group/opt"
                          >
                            <input
                              type="text"
                              required
                              value={opt}
                              onChange={(e) =>
                                updateOption(qIndex, oIndex, e.target.value)
                              }
                              className="grow px-4 py-2 bg-gray-50 border border-gray-100 rounded-xl focus:ring-1 focus:ring-emerald-500 outline-none text-sm"
                            />
                            {q.options!.length > 1 && (
                              <button
                                type="button"
                                onClick={() => removeOption(qIndex, oIndex)}
                                className="p-1.5 text-gray-300 hover:text-red-500 opacity-0 group-hover/opt:opacity-100 transition-all"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                      <button
                        type="button"
                        onClick={() => addOption(qIndex)}
                        className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1.5 mt-4"
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
              <div className="bg-gray-50 rounded-3xl p-12 text-center border-2 border-dashed border-gray-200">
                <p className="text-gray-400">
                  Click "Add Question" to start building your survey.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-4 pt-8">
          <button
            type="button"
            onClick={() => navigate('/')}
            className="px-6 py-3 text-gray-600 font-bold hover:text-gray-900 transition-all"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSaveDraft}
            disabled={loading}
            className="px-6 py-3 bg-stone-100 text-stone-700 font-bold rounded-2xl hover:bg-stone-200 transition-all disabled:opacity-50 flex items-center gap-2"
          >
            <FileText className="w-4 h-4" />
            {draftLoading ? 'Saving...' : 'Save as Draft'}
          </button>
          <button
            type="button"
            onClick={handlePublish}
            disabled={loading}
            className="px-8 py-3 bg-emerald-600 text-white font-bold rounded-2xl hover:bg-emerald-700 shadow-xl shadow-emerald-200 transition-all disabled:opacity-50 flex items-center gap-2 text-lg"
          >
            <Save className="w-5 h-5" />
            {publishLoading ? 'Publishing...' : 'Save & Publish'}
          </button>
        </div>
      </form>

      {/* Floating "Add Question" button — appears when the header row scrolls out of view */}
      <AnimatePresence>
        {showFloatingAdd && (
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
