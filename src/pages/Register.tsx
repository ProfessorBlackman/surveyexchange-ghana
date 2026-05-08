import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../lib/api';
import { useAuthStore } from '../store/authStore';
import { Mail, Lock, User, School, BookOpen, AlertCircle, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import {
  ACADEMIC_LEVEL_OPTIONS,
  GENDER_OPTIONS,
  AGE_RANGE_OPTIONS,
  REFERRAL_SOURCE_OPTIONS,
} from '../lib/constants';
import type { AcademicLevel, AgeRange, Gender, ReferralSource } from '../types';

const YEAR_OF_STUDY_LEVELS: AcademicLevel[] = [
  'UNDERGRADUATE',
  'POSTGRADUATE_MASTERS',
  'POSTGRADUATE_PHD',
];

const inputClass =
  'w-full pl-10 pr-4 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-emerald-600/20 focus:border-emerald-600 outline-none transition-all text-sm font-medium';
const selectClass =
  'w-full pl-4 pr-8 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-emerald-600/20 focus:border-emerald-600 outline-none transition-all text-sm font-medium appearance-none';
const labelClass = 'block text-[10px] font-black text-stone-400 uppercase tracking-widest mb-2';

export default function Register() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    institution: '',
    fieldOfStudy: '',
    academicLevel: '' as AcademicLevel | '',
    yearOfStudy: '' as number | '',
    gender: '' as Gender | '',
    ageRange: '' as AgeRange | '',
    referralSource: '' as ReferralSource | '',
  });
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [optionalOpen, setOptionalOpen] = useState(false);
  const setAuth = useAuthStore((state) => state.setAuth);
  const navigate = useNavigate();

  const showYearOfStudy = YEAR_OF_STUDY_LEVELS.includes(
    formData.academicLevel as AcademicLevel
  );

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (fieldErrors[name]) {
      setFieldErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setFieldErrors({});

    const payload: Record<string, unknown> = {
      fullName: formData.fullName,
      email: formData.email,
      password: formData.password,
      institution: formData.institution,
      fieldOfStudy: formData.fieldOfStudy,
      academicLevel: formData.academicLevel,
    };

    if (showYearOfStudy && formData.yearOfStudy !== '') {
      payload.yearOfStudy = Number(formData.yearOfStudy);
    }
    if (formData.gender) payload.gender = formData.gender;
    if (formData.ageRange) payload.ageRange = formData.ageRange;
    if (formData.referralSource) payload.referralSource = formData.referralSource;

    try {
      const res = await api.post('/auth/register', payload);
      setAuth(res.data.user, res.data.accessToken);
      navigate('/');
    } catch (err: any) {
      const data = err.response?.data;
      const status = err.response?.status;
      if ((status === 422 || status === 400) && data?.errors) {
        setFieldErrors(data.errors);
      } else if (status === 409) {
        setError('An account with this email already exists');
      } else {
        setError(data?.message || 'Registration failed');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white p-10 rounded-3xl shadow-xl shadow-stone-200/50 border border-stone-200"
      >
        <div className="flex flex-col items-center mb-10">
          <div className="w-12 h-12 bg-emerald-800 flex items-center justify-center text-white font-bold rounded-lg mb-4 text-xl shadow-lg shadow-emerald-900/20">
            S
          </div>
          <h2 className="text-2xl font-black text-stone-900 leading-tight uppercase tracking-tight">
            New Researcher
          </h2>
          <p className="text-stone-400 text-xs font-bold uppercase tracking-widest mt-2">
            SurveyExchange Ghana
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl flex items-center gap-3 text-red-700 text-xs font-bold">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Name + Email */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className={labelClass}>Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-300" />
                <input
                  type="text"
                  name="fullName"
                  required
                  value={formData.fullName}
                  onChange={handleChange}
                  className={inputClass}
                  placeholder="Kwame Mensah"
                />
              </div>
            </div>
            <div>
              <label className={labelClass}>Academic Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-300" />
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className={inputClass}
                  placeholder="kwame@ug.edu.gh"
                />
              </div>
            </div>
          </div>

          {/* Institution */}
          <div>
            <label className={labelClass}>Institution</label>
            <div className="relative">
              <School className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-300" />
              <input
                type="text"
                name="institution"
                required
                value={formData.institution}
                onChange={handleChange}
                className={inputClass}
                placeholder="University of Ghana"
              />
            </div>
          </div>

          {/* Field of Study */}
          <div>
            <label className={labelClass}>Field of Study</label>
            <div className="relative">
              <BookOpen className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-300" />
              <input
                type="text"
                name="fieldOfStudy"
                required
                value={formData.fieldOfStudy}
                onChange={handleChange}
                className={inputClass}
                placeholder="Computer Science"
              />
            </div>
          </div>

          {/* Academic Level (required) */}
          <div>
            <label className={labelClass}>
              Academic Level <span className="text-red-400">*</span>
            </label>
            <div className="relative">
              <select
                name="academicLevel"
                required
                value={formData.academicLevel}
                onChange={handleChange}
                className={cn(
                  selectClass,
                  !formData.academicLevel && 'text-stone-400',
                  fieldErrors.academicLevel && 'border-red-400 focus:border-red-400'
                )}
              >
                <option value="" disabled>
                  Select your level
                </option>
                {ACADEMIC_LEVEL_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400 pointer-events-none" />
            </div>
            {fieldErrors.academicLevel && (
              <p className="mt-1.5 text-xs text-red-500 font-semibold">
                {fieldErrors.academicLevel}
              </p>
            )}
          </div>

          {/* Year of Study (conditional) */}
          <AnimatePresence>
            {showYearOfStudy && (
              <motion.div
                key="yearOfStudy"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <label className={labelClass}>Year of Study</label>
                <div className="relative">
                  <select
                    name="yearOfStudy"
                    value={formData.yearOfStudy}
                    onChange={handleChange}
                    className={cn(
                      selectClass,
                      !formData.yearOfStudy && 'text-stone-400'
                    )}
                  >
                    <option value="">Select year</option>
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                      <option key={n} value={n}>
                        Year {n}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400 pointer-events-none" />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Password */}
          <div>
            <label className={labelClass}>Secure Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-300" />
              <input
                type="password"
                name="password"
                required
                value={formData.password}
                onChange={handleChange}
                className={inputClass}
                placeholder="••••••••"
              />
            </div>
          </div>

          {/* Optional analytics fields */}
          <div className="border border-stone-100 rounded-2xl overflow-hidden">
            <button
              type="button"
              onClick={() => setOptionalOpen((prev) => !prev)}
              className="w-full flex items-center justify-between px-5 py-3.5 bg-stone-50 hover:bg-stone-100 transition-colors text-left"
            >
              <span className="text-[10px] font-black uppercase tracking-widest text-stone-500">
                Help us match you better (optional)
              </span>
              <ChevronDown
                className={cn(
                  'w-4 h-4 text-stone-400 transition-transform',
                  optionalOpen && 'rotate-180'
                )}
              />
            </button>
            <AnimatePresence>
              {optionalOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="px-5 py-5 space-y-4">
                    <div>
                      <label className={labelClass}>Gender</label>
                      <div className="relative">
                        <select
                          name="gender"
                          value={formData.gender}
                          onChange={handleChange}
                          className={cn(
                            selectClass,
                            !formData.gender && 'text-stone-400'
                          )}
                        >
                          <option value="">Prefer not to say</option>
                          {GENDER_OPTIONS.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                              {opt.label}
                            </option>
                          ))}
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400 pointer-events-none" />
                      </div>
                    </div>

                    <div>
                      <label className={labelClass}>Age Range</label>
                      <div className="relative">
                        <select
                          name="ageRange"
                          value={formData.ageRange}
                          onChange={handleChange}
                          className={cn(
                            selectClass,
                            !formData.ageRange && 'text-stone-400'
                          )}
                        >
                          <option value="">Prefer not to say</option>
                          {AGE_RANGE_OPTIONS.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                              {opt.label}
                            </option>
                          ))}
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400 pointer-events-none" />
                      </div>
                    </div>

                    <div>
                      <label className={labelClass}>How did you hear about us?</label>
                      <div className="relative">
                        <select
                          name="referralSource"
                          value={formData.referralSource}
                          onChange={handleChange}
                          className={cn(
                            selectClass,
                            !formData.referralSource && 'text-stone-400'
                          )}
                        >
                          <option value="">Select source</option>
                          {REFERRAL_SOURCE_OPTIONS.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                              {opt.label}
                            </option>
                          ))}
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400 pointer-events-none" />
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-emerald-800 hover:bg-emerald-900 text-white font-bold uppercase tracking-widest text-xs rounded-xl transition-all shadow-lg shadow-emerald-900/20 disabled:opacity-50 flex items-center justify-center gap-2 mt-4"
          >
            {loading ? 'Creating account...' : 'Finalize Registration'}
          </button>
        </form>

        <p className="mt-10 text-center text-xs font-bold text-stone-400 uppercase tracking-widest">
          Already registered?{' '}
          <Link to="/login" className="text-emerald-700 hover:underline">
            Sign in
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
