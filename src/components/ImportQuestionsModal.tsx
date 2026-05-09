import { useEffect, useRef, useState } from 'react';
import * as XLSX from 'xlsx';
import {
  X, Download, Upload, AlertCircle, CheckCircle2, FileSpreadsheet,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Question, QuestionType } from '../types';
import { cn } from '../lib/utils';

const TEMPLATE_URL =
  'https://res.cloudinary.com/dfbctgvvq/raw/upload/v1778307069/Survey_Questions_Template_yo06be.xlsx';

const TYPE_MAP: Record<string, QuestionType> = {
  multiple_choice: 'MULTIPLE_CHOICE',
  checkbox:        'CHECKBOX',
  short_text:      'SHORT_TEXT',
  long_text:       'LONG_TEXT',
  rating:          'RATING',
  yes_no:          'YES_NO',
};

const VALID_TYPES = Object.keys(TYPE_MAP).join(', ');
const TYPES_NEEDING_OPTIONS = new Set<QuestionType>(['MULTIPLE_CHOICE', 'CHECKBOX']);

interface RowError {
  row: number;
  message: string;
}

function parseWorkbook(workbook: XLSX.WorkBook): { questions: Question[]; errors: RowError[] } {
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const raw: Record<string, unknown>[] = XLSX.utils.sheet_to_json(sheet, { defval: '' });

  const errors: RowError[] = [];
  const questions: Question[] = [];

  if (raw.length === 0) {
    errors.push({ row: 0, message: 'The spreadsheet contains no data rows.' });
    return { questions, errors };
  }

  // Normalize keys to lowercase + trim
  const rows = raw.map(r => {
    const out: Record<string, string> = {};
    for (const [k, v] of Object.entries(r)) {
      out[k.toLowerCase().trim()] = String(v ?? '').trim();
    }
    return out;
  });

  // Column presence check (header is row 1; data starts at row 2)
  const required = ['order', 'type', 'question', 'required'];
  const sample = rows[0];
  const missing = required.filter(c => !(c in sample));
  if (missing.length > 0) {
    errors.push({
      row: 1,
      message: `Missing column${missing.length > 1 ? 's' : ''}: ${missing.map(c => `"${c}"`).join(', ')}. Required: order, type, question, options, required.`,
    });
    return { questions, errors };
  }

  for (let i = 0; i < rows.length; i++) {
    const rowNum = i + 2; // spreadsheet row (1-based header + 1)
    const row = rows[i];

    // order
    const orderVal = parseInt(row.order ?? '');
    if (isNaN(orderVal) || orderVal < 1) {
      errors.push({ row: rowNum, message: `Row ${rowNum}: "order" must be a positive integer (got "${row.order}").` });
      continue;
    }

    // type
    const typeKey = (row.type ?? '').toLowerCase().replace(/\s+/g, '_');
    const questionType = TYPE_MAP[typeKey];
    if (!questionType) {
      errors.push({ row: rowNum, message: `Row ${rowNum}: Unknown type "${row.type}". Accepted: ${VALID_TYPES}.` });
      continue;
    }

    // question text
    if (!row.question) {
      errors.push({ row: rowNum, message: `Row ${rowNum}: "question" cannot be empty.` });
      continue;
    }

    // options
    let options: string[] | undefined;
    if (TYPES_NEEDING_OPTIONS.has(questionType)) {
      if (!row.options) {
        errors.push({ row: rowNum, message: `Row ${rowNum}: "options" is required for type "${row.type}". Separate values with semicolons.` });
        continue;
      }
      options = row.options.split(';').map(o => o.trim()).filter(Boolean);
      if (options.length < 2) {
        errors.push({ row: rowNum, message: `Row ${rowNum}: "${row.type}" needs at least 2 options (got ${options.length}).` });
        continue;
      }
    }

    // required
    const reqRaw = (row.required ?? '').toLowerCase();
    if (reqRaw !== 'true' && reqRaw !== 'false') {
      errors.push({ row: rowNum, message: `Row ${rowNum}: "required" must be "true" or "false" (got "${row.required}").` });
      continue;
    }

    questions.push({
      text: row.question,
      questionType,
      options,
      required: reqRaw === 'true',
      orderIndex: orderVal - 1,
    });
  }

  return { questions, errors };
}

interface Props {
  onClose: () => void;
  onImport: (questions: Question[]) => void;
}

export default function ImportQuestionsModal({ onClose, onImport }: Props) {
  const [file, setFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<RowError[]>([]);
  const [preview, setPreview] = useState<Question[] | null>(null);
  const [dragging, setDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [onClose]);

  const processFile = (f: File) => {
    setFile(f);
    setErrors([]);
    setPreview(null);

    const reader = new FileReader();
    reader.onload = e => {
      try {
        const wb = XLSX.read(e.target?.result, { type: 'array' });
        const { questions, errors: errs } = parseWorkbook(wb);
        if (errs.length > 0) {
          setErrors(errs);
        } else {
          setPreview(questions);
        }
      } catch {
        setErrors([{ row: 0, message: 'Could not read file. Ensure it is a valid .xlsx or .csv.' }]);
      }
    };
    reader.readAsArrayBuffer(f);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const f = e.dataTransfer.files[0];
    if (f) processFile(f);
  };

  const handleImport = () => {
    if (!preview?.length) return;
    onImport([...preview].sort((a, b) => (a.orderIndex ?? 0) - (b.orderIndex ?? 0)));
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="import-modal-title"
    >
      {/* Backdrop */}
      <motion.div
        className="absolute inset-0 bg-stone-900/40 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel */}
      <motion.div
        className="relative w-full sm:max-w-lg bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl z-10 flex flex-col max-h-[90dvh] sm:max-h-[85vh]"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 40 }}
        transition={{ type: 'spring', stiffness: 380, damping: 30 }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-stone-100 shrink-0">
          <div>
            <h2 id="import-modal-title" className="text-lg font-extrabold text-stone-900">
              Import Questions
            </h2>
            <p className="text-xs text-stone-500 mt-0.5">Bulk-add questions from a spreadsheet</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-stone-100 transition-colors text-stone-400 hover:text-stone-700 cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto px-6 py-5 space-y-5 grow">
          {/* Step 1 */}
          <div>
            <p className="text-[11px] font-black text-stone-400 uppercase tracking-widest mb-3">
              Step 1 — Download the template
            </p>
            <a
              href={TEMPLATE_URL}
              download
              className="flex items-center gap-3 px-4 py-3 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-800 hover:bg-emerald-100 transition-colors group"
            >
              <div className="w-9 h-9 bg-emerald-100 group-hover:bg-emerald-200 rounded-xl flex items-center justify-center shrink-0 transition-colors">
                <Download className="w-4 h-4" aria-hidden="true" />
              </div>
              <div>
                <p className="font-bold text-sm">Survey_Questions_Template.xlsx</p>
                <p className="text-xs text-emerald-600">Fill this in, then upload it below</p>
              </div>
            </a>
          </div>

          {/* Format hint */}
          <div className="bg-stone-50 border border-stone-100 rounded-2xl px-4 py-3 text-xs text-stone-500 space-y-1">
            <p className="font-black text-[11px] uppercase tracking-widest text-stone-400 mb-2">
              Column reference
            </p>
            <p>
              <span className="font-bold text-stone-700">type</span>
              {' — '}
              {VALID_TYPES}
            </p>
            <p>
              <span className="font-bold text-stone-700">options</span>
              {' — '}semicolon-separated, e.g.{' '}
              <code className="bg-stone-100 px-1 rounded text-stone-600">100;200;300</code>
              {' '}(required for <em>multiple_choice</em> & <em>checkbox</em>)
            </p>
            <p>
              <span className="font-bold text-stone-700">required</span>
              {' — '}
              <code className="bg-stone-100 px-1 rounded text-stone-600">true</code>
              {' '}or{' '}
              <code className="bg-stone-100 px-1 rounded text-stone-600">false</code>
            </p>
          </div>

          {/* Step 2 */}
          <div>
            <p className="text-[11px] font-black text-stone-400 uppercase tracking-widest mb-3">
              Step 2 — Upload your filled file
            </p>
            <div
              role="button"
              tabIndex={0}
              aria-label="Upload spreadsheet"
              onClick={() => fileInputRef.current?.click()}
              onKeyDown={e => e.key === 'Enter' && fileInputRef.current?.click()}
              onDragOver={e => { e.preventDefault(); setDragging(true); }}
              onDragLeave={() => setDragging(false)}
              onDrop={handleDrop}
              className={cn(
                'border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all select-none',
                dragging
                  ? 'border-emerald-400 bg-emerald-50'
                  : file
                  ? 'border-stone-200 bg-stone-50 hover:border-emerald-300'
                  : 'border-stone-200 hover:border-emerald-400 hover:bg-emerald-50/40'
              )}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".xlsx,.xls,.csv"
                className="sr-only"
                onChange={e => { const f = e.target.files?.[0]; if (f) processFile(f); }}
              />
              {file ? (
                <div className="flex items-center justify-center gap-3">
                  <FileSpreadsheet className="w-8 h-8 text-emerald-600 shrink-0" aria-hidden="true" />
                  <div className="text-left min-w-0">
                    <p className="font-bold text-stone-800 text-sm truncate">{file.name}</p>
                    <p className="text-xs text-stone-400 mt-0.5">
                      {(file.size / 1024).toFixed(1)} KB — click to replace
                    </p>
                  </div>
                </div>
              ) : (
                <>
                  <Upload className="w-7 h-7 text-stone-300 mx-auto mb-2" aria-hidden="true" />
                  <p className="font-bold text-stone-600 text-sm">
                    Drop file here or click to browse
                  </p>
                  <p className="text-xs text-stone-400 mt-1">Accepts .xlsx, .xls, .csv</p>
                </>
              )}
            </div>
          </div>

          {/* Validation errors */}
          <AnimatePresence>
            {errors.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="bg-red-50 border border-red-100 rounded-2xl p-4"
              >
                <div className="flex items-center gap-2 mb-2.5">
                  <AlertCircle className="w-4 h-4 text-red-500 shrink-0" aria-hidden="true" />
                  <p className="text-[11px] font-black text-red-600 uppercase tracking-widest">
                    {errors.length} {errors.length === 1 ? 'Error' : 'Errors'} Found
                  </p>
                </div>
                <ul className="space-y-1.5">
                  {errors.map((err, i) => (
                    <li key={i} className="text-xs text-red-600">{err.message}</li>
                  ))}
                </ul>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Success preview */}
          <AnimatePresence>
            {preview && preview.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="bg-emerald-50 border border-emerald-100 rounded-2xl p-4"
              >
                <div className="flex items-center gap-2 mb-3">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" aria-hidden="true" />
                  <p className="text-[11px] font-black text-emerald-700 uppercase tracking-widest">
                    {preview.length} {preview.length === 1 ? 'Question' : 'Questions'} Ready
                  </p>
                </div>
                <ul className="space-y-1.5">
                  {preview.map((q, i) => (
                    <li key={i} className="flex items-center gap-2 text-xs">
                      <span className="font-mono text-stone-400 shrink-0 w-5 text-right">{i + 1}.</span>
                      <span className="text-stone-700 truncate grow">{q.text}</span>
                      <span className="shrink-0 text-[10px] bg-white border border-emerald-200 text-emerald-700 px-1.5 py-0.5 rounded font-bold uppercase">
                        {q.questionType.replace(/_/g, ' ')}
                      </span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-stone-100 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 text-stone-600 font-bold text-sm hover:text-stone-900 transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleImport}
            disabled={!preview || preview.length === 0}
            className="px-5 py-2.5 bg-emerald-700 text-white font-bold text-sm rounded-2xl hover:bg-emerald-800 transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2 cursor-pointer"
          >
            <Upload className="w-4 h-4" aria-hidden="true" />
            {preview?.length
              ? `Import ${preview.length} Question${preview.length !== 1 ? 's' : ''}`
              : 'Import Questions'}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
