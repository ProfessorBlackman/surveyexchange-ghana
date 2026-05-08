import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../lib/api';
import { Plus, Trash2, Save, X, List, Hash, Type, CheckSquare, MessageSquare, Clock, Tag } from 'lucide-react';
import { Question } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';

export default function CreateSurvey() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Academic');
  const [estimatedTime, setEstimatedTime] = useState(5);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const addQuestion = () => {
    const newQuestion: Question = {
      text: '',
      questionType: 'MULTIPLE_CHOICE',
      options: ['Option 1', 'Option 2'],
      order: questions.length
    };
    setQuestions([...questions, newQuestion]);
  };

  const removeQuestion = (index: number) => {
    setQuestions(questions.filter((_, i) => i !== index));
  };

  const updateQuestion = (index: number, field: string, value: any) => {
    const updated = [...questions];
    updated[index] = { ...updated[index], [field]: value };
    setQuestions(updated);
  };

  const addOption = (qIndex: number) => {
    const updated = [...questions];
    if (!updated[qIndex].options) updated[qIndex].options = [];
    updated[qIndex].options!.push(`Option ${updated[qIndex].options!.length + 1}`);
    setQuestions(updated);
  };

  const removeOption = (qIndex: number, oIndex: number) => {
    const updated = [...questions];
    updated[qIndex].options = updated[qIndex].options!.filter((_, i) => i !== oIndex);
    setQuestions(updated);
  };

  const updateOption = (qIndex: number, oIndex: number, value: string) => {
    const updated = [...questions];
    updated[qIndex].options![oIndex] = value;
    setQuestions(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (questions.length === 0) {
      alert('Please add at least one question');
      return;
    }
    setLoading(true);
    try {
      await api.post('/surveys', {
        title,
        description,
        category,
        estimatedTime: estimatedTime,
        questions
      });
      navigate('/dashboard');
    } catch (err) {
      console.error('Failed to create survey');
    } finally {
      setLoading(false);
    }
  };

  const questionTypeIcons = {
    MULTIPLE_CHOICE: <List className="w-4 h-4" />,
    CHECKBOX: <CheckSquare className="w-4 h-4" />,
    SHORT_TEXT: <Type className="w-4 h-4" />,
    LONG_TEXT: <Type className="w-4 h-4" />,
    RATING: <Hash className="w-4 h-4" />,
    YES_NO: <MessageSquare className="w-4 h-4" />
  };

  return (
    <div className="max-w-4xl mx-auto px-4 pb-20">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Create New Survey</h1>
        <p className="text-gray-500 mt-2">Design your research tool and start gathering insights.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Info */}
        <section className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">Survey Title</label>
              <input
                type="text"
                required
                value={title}
                onChange={e => setTitle(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all text-xl font-bold"
                placeholder="e.g., Student Perception of AI in Education"
              />
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">Description</label>
              <textarea
                required
                value={description}
                onChange={e => setDescription(e.target.value)}
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
                onChange={e => setCategory(e.target.value)}
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
                onChange={e => setEstimatedTime(parseInt(e.target.value))}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>
          </div>
        </section>

        {/* Questions */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
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
                      <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Question {qIndex + 1}</label>
                      <input
                        type="text"
                        required
                        value={q.text}
                        onChange={e => updateQuestion(qIndex, 'text', e.target.value)}
                        className="w-full px-0 py-2 border-b-2 border-transparent focus:border-emerald-500 bg-transparent outline-none transition-all text-lg font-semibold"
                        placeholder="Type your question here..."
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Type</label>
                      <select
                        value={q.questionType}
                        onChange={e => updateQuestion(qIndex, 'questionType', e.target.value)}
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

                  {/* Options for choices */}
                  {(q.questionType === 'MULTIPLE_CHOICE' || q.questionType === 'CHECKBOX') && (
                    <div className="mt-8 space-y-3">
                      <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Options</label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {q.options?.map((opt, oIndex) => (
                          <div key={oIndex} className="flex items-center gap-2 group/opt">
                            <input
                              type="text"
                              required
                              value={opt}
                              onChange={e => updateOption(qIndex, oIndex, e.target.value)}
                              className="flex-grow px-4 py-2 bg-gray-50 border border-gray-100 rounded-xl focus:ring-1 focus:ring-emerald-500 outline-none text-sm"
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
                <p className="text-gray-400">Click "Add Question" to start building your survey.</p>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center justify-end gap-4 pt-8">
          <button
            type="button"
            onClick={() => navigate('/')}
            className="px-6 py-3 text-gray-600 font-bold hover:text-gray-900 transition-all"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading || questions.length === 0}
            className="px-8 py-3 bg-emerald-600 text-white font-bold rounded-2xl hover:bg-emerald-700 shadow-xl shadow-emerald-200 transition-all disabled:opacity-50 flex items-center gap-2 text-lg"
          >
            <Save className="w-5 h-5" />
            {loading ? 'Publishing...' : 'Publish Survey'}
          </button>
        </div>
      </form>
    </div>
  );
}
