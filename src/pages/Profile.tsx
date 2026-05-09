import React, { useEffect, useState } from 'react';
import api from '../lib/api';
import { useAuthStore } from '../store/authStore';
import {
  ACADEMIC_LEVEL_OPTIONS,
  AGE_RANGE_OPTIONS,
  GENDER_OPTIONS,
} from '../lib/constants';
import type { AcademicLevel, AgeRange, Gender, CreditTransaction, Survey } from '../types';
import { cn } from '../lib/utils';
import { ChevronDown, Save, Coins, BookOpen, Users, TrendingUp, TrendingDown } from 'lucide-react';
import { format } from 'date-fns';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'react-hot-toast';

const YEAR_OF_STUDY_LEVELS: AcademicLevel[] = [
  'UNDERGRADUATE',
  'POSTGRADUATE_MASTERS',
  'POSTGRADUATE_PHD',
];

const selectClass =
  'w-full pl-4 pr-8 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-emerald-600/20 focus:border-emerald-600 outline-none transition-all text-sm font-medium appearance-none';
const inputClass =
  'w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-emerald-600/20 focus:border-emerald-600 outline-none transition-all text-sm font-medium';
const labelClass = 'block text-xs font-black text-stone-400 uppercase tracking-widest mb-2';

interface ProfileForm {
  institution: string;
  fieldOfStudy: string;
  academicLevel: AcademicLevel | '';
  yearOfStudy: number | '';
  gender: Gender | '';
  ageRange: AgeRange | '';
}

interface Stats {
  surveysCreated: number;
  surveysAnswered: number;
  creditsEarned: number;
  creditsSpent: number;
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

export default function Profile() {
  const { user, updateProfile } = useAuthStore();
  const [form, setForm] = useState<ProfileForm>({
    institution: user?.institution ?? '',
    fieldOfStudy: user?.fieldOfStudy ?? '',
    academicLevel: user?.academicLevel ?? '',
    yearOfStudy: user?.yearOfStudy ?? '',
    gender: user?.gender ?? '',
    ageRange: user?.ageRange ?? '',
  });
  const [stats, setStats] = useState<Stats | null>(null);
  const [loadingStats, setLoadingStats] = useState(true);
  const [saving, setSaving] = useState(false);
  const [optionalOpen, setOptionalOpen] = useState(false);

  const showYearOfStudy = YEAR_OF_STUDY_LEVELS.includes(form.academicLevel as AcademicLevel);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const [surveysRes, historyRes, profileRes] = await Promise.all([
          api.get('/surveys/mine'),
          api.get('/credits/history?size=100'),
          api.get('/users/me'),
        ]);

        // Populate form from latest profile data (once backend returns full profile)
        const profileData = profileRes.data;
        setForm({
          institution: profileData.institution ?? '',
          fieldOfStudy: profileData.fieldOfStudy ?? '',
          academicLevel: profileData.academicLevel ?? '',
          yearOfStudy: profileData.yearOfStudy ?? '',
          gender: profileData.gender ?? '',
          ageRange: profileData.ageRange ?? '',
        });
        if (profileData.creditBalance != null) {
          updateProfile(profileData);
        }

        const transactions: CreditTransaction[] =
          historyRes.data.content ?? historyRes.data ?? [];
        const mySurveys: Survey[] = surveysRes.data ?? [];

        setStats({
          surveysCreated: mySurveys.length,
          surveysAnswered: transactions.filter((t) => t.type === 'SURVEY_REWARD').length,
          creditsEarned: transactions
            .filter((t) => t.amount > 0)
            .reduce((sum, t) => sum + t.amount, 0),
          creditsSpent: Math.abs(
            transactions
              .filter((t) => t.amount < 0)
              .reduce((sum, t) => sum + t.amount, 0)
          ),
        });
      } catch {
        // stats are best-effort
      } finally {
        setLoadingStats(false);
      }
    };

    loadStats();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload: Record<string, unknown> = {};
      if (form.institution) payload.institution = form.institution;
      if (form.fieldOfStudy) payload.fieldOfStudy = form.fieldOfStudy;
      if (form.academicLevel) payload.academicLevel = form.academicLevel;
      if (showYearOfStudy && form.yearOfStudy !== '') {
        payload.yearOfStudy = Number(form.yearOfStudy);
      }
      if (form.gender) payload.gender = form.gender;
      if (form.ageRange) payload.ageRange = form.ageRange;

      const res = await api.patch('/users/me', payload);
      updateProfile(res.data);
      toast.success('Profile updated');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const levelLabel = ACADEMIC_LEVEL_OPTIONS.find(
    (o) => o.value === (user?.academicLevel ?? form.academicLevel)
  )?.label;
  const yearLabel =
    (user?.yearOfStudy ?? (form.yearOfStudy || undefined))
      ? `Year ${user?.yearOfStudy ?? form.yearOfStudy}`
      : null;
  const academicSummary = [levelLabel, yearLabel].filter(Boolean).join(' · ');
  const initials = user ? getInitials(user.name) : '?';
  const memberSince =
    user?.createdAt ? format(new Date(user.createdAt), 'MMMM yyyy') : null;

  const statCards = [
    {
      label: 'Surveys Created',
      value: stats?.surveysCreated ?? '—',
      icon: <BookOpen className="w-5 h-5" />,
      color: 'text-emerald-700',
      bg: 'bg-emerald-50',
    },
    {
      label: 'Surveys Answered',
      value: stats?.surveysAnswered ?? '—',
      icon: <Users className="w-5 h-5" />,
      color: 'text-stone-700',
      bg: 'bg-stone-50',
    },
    {
      label: 'Credits Earned',
      value: stats ? `+${stats.creditsEarned}` : '—',
      icon: <TrendingUp className="w-5 h-5" />,
      color: 'text-green-600',
      bg: 'bg-green-50',
    },
    {
      label: 'Credits Spent',
      value: stats ? `${stats.creditsSpent}` : '—',
      icon: <TrendingDown className="w-5 h-5" />,
      color: 'text-red-500',
      bg: 'bg-red-50',
    },
  ];

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-6 sm:space-y-8">

      {/* Header card */}
      <div className="bg-emerald-900 rounded-3xl p-8 flex flex-col sm:flex-row items-start sm:items-center gap-6 shadow-xl shadow-emerald-900/20">
        <div className="w-20 h-20 bg-white/10 rounded-2xl border border-white/20 flex items-center justify-center text-white text-2xl font-black shrink-0">
          {initials}
        </div>
        <div className="flex-grow min-w-0">
          <h1 className="text-2xl font-black text-white tracking-tight">{user?.name}</h1>
          {(user?.institution || user?.fieldOfStudy) && (
            <p className="text-emerald-300 text-sm font-medium mt-0.5">
              {[user.institution, user.fieldOfStudy].filter(Boolean).join(' · ')}
            </p>
          )}
          <div className="flex flex-wrap items-center gap-3 mt-3">
            {academicSummary && (
              <span className="px-3 py-1 bg-white/10 border border-white/20 rounded-full text-[11px] font-black text-emerald-200 uppercase tracking-widest">
                {academicSummary}
              </span>
            )}
            {memberSince && (
              <span className="text-emerald-500 text-[11px] font-bold uppercase tracking-widest">
                Member since {memberSince}
              </span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2 bg-white/10 border border-white/20 rounded-2xl px-5 py-3 shrink-0">
          <Coins className="w-4 h-4 text-emerald-300" />
          <span className="text-2xl font-black font-mono text-white">{user?.creditBalance}</span>
          <span className="text-emerald-400 text-[11px] font-black uppercase tracking-widest">CR</span>
        </div>
      </div>

      {/* Stats bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {statCards.map((card) => (
          <div
            key={card.label}
            className="bg-white rounded-2xl border border-stone-200 p-5 shadow-sm"
          >
            <div className={cn('w-9 h-9 rounded-xl flex items-center justify-center mb-3', card.bg, card.color)}>
              {card.icon}
            </div>
            <p className={cn('text-2xl font-black font-mono', loadingStats ? 'opacity-30' : '', card.color)}>
              {loadingStats ? '—' : card.value}
            </p>
            <p className="text-xs font-black text-stone-400 uppercase tracking-widest mt-1">
              {card.label}
            </p>
          </div>
        ))}
      </div>

      {/* Academic profile form */}
      <form onSubmit={handleSave} className="bg-white rounded-3xl border border-stone-200 shadow-sm overflow-hidden">
        <div className="px-8 py-5 border-b border-stone-100 bg-stone-50">
          <h2 className="text-sm font-black text-stone-900 uppercase tracking-widest">
            Academic Profile
          </h2>
        </div>

        <div className="p-8 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className={labelClass}>Institution</label>
              <input
                type="text"
                name="institution"
                value={form.institution}
                onChange={handleChange}
                className={inputClass}
                placeholder="University of Ghana"
              />
            </div>
            <div>
              <label className={labelClass}>Field of Study</label>
              <input
                type="text"
                name="fieldOfStudy"
                value={form.fieldOfStudy}
                onChange={handleChange}
                className={inputClass}
                placeholder="Computer Science"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className={labelClass}>Academic Level</label>
              <div className="relative">
                <select
                  name="academicLevel"
                  value={form.academicLevel}
                  onChange={handleChange}
                  className={cn(selectClass, !form.academicLevel && 'text-stone-400')}
                >
                  <option value="">Select level</option>
                  {ACADEMIC_LEVEL_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400 pointer-events-none" />
              </div>
            </div>

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
                      value={form.yearOfStudy}
                      onChange={handleChange}
                      className={cn(selectClass, !form.yearOfStudy && 'text-stone-400')}
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
          </div>

          {/* Optional personal info */}
          <div className="border border-stone-100 rounded-2xl overflow-hidden">
            <button
              type="button"
              onClick={() => setOptionalOpen((p) => !p)}
              className="w-full flex items-center justify-between px-5 py-3.5 bg-stone-50 hover:bg-stone-100 transition-colors text-left cursor-pointer"
            >
              <span className="text-xs font-black uppercase tracking-widest text-stone-500">
                Personal Info (optional)
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
                  <div className="px-5 py-5 grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className={labelClass}>Gender</label>
                      <div className="relative">
                        <select
                          name="gender"
                          value={form.gender}
                          onChange={handleChange}
                          className={cn(selectClass, !form.gender && 'text-stone-400')}
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
                          value={form.ageRange}
                          onChange={handleChange}
                          className={cn(selectClass, !form.ageRange && 'text-stone-400')}
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
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 px-6 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs uppercase tracking-widest rounded-xl transition-all shadow-md shadow-emerald-900/10 disabled:opacity-50 cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" />
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      </form>

      {/* Account details (read-only) */}
      <div className="bg-white rounded-3xl border border-stone-200 shadow-sm overflow-hidden">
        <div className="px-8 py-5 border-b border-stone-100 bg-stone-50">
          <h2 className="text-sm font-black text-stone-900 uppercase tracking-widest">
            Account
          </h2>
        </div>
        <div className="divide-y divide-stone-100">
          <div className="px-8 py-4 flex items-center justify-between">
            <span className="text-xs font-black text-stone-400 uppercase tracking-widest">
              Email
            </span>
            <span className="text-sm font-medium text-stone-700">{user?.email}</span>
          </div>
          {memberSince && (
            <div className="px-8 py-4 flex items-center justify-between">
              <span className="text-xs font-black text-stone-400 uppercase tracking-widest">
                Member Since
              </span>
              <span className="text-sm font-medium text-stone-700">{memberSince}</span>
            </div>
          )}
          <div className="px-8 py-4 flex items-center justify-between">
            <span className="text-xs font-black text-stone-400 uppercase tracking-widest">
              Account ID
            </span>
            <span className="text-xs font-mono text-stone-400">
              {user?.id?.slice(0, 8)}…
            </span>
          </div>
        </div>
      </div>

    </div>
  );
}
