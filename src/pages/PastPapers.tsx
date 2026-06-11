import { useState, useMemo } from 'react';
import { PastPaper } from '../types';
import { DEFAULT_PAST_PAPERS, SUBJECTS, TAMIL_MAP } from '../utils/constants';
import { Search, Download, FileText, AlertCircle, RefreshCw, Calendar, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';
import { translations } from '../utils/translations';

interface PastPapersProps {
  papers: PastPaper[];
  initialSearch?: string;
  clearInitialSearch?: () => void;
  lang: 'ta' | 'en';
}

const AVAILABLE_YEARS = ['2023', '2022', '2021', '2020', '2019', '2018', '2017', '2016', '2015'];

export default function PastPapers({ papers, initialSearch = '', clearInitialSearch, lang }: PastPapersProps) {
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [selectedExam, setSelectedExam] = useState<'All' | 'O/L' | 'A/L'>('All');
  const [selectedYear, setSelectedYear] = useState<string>('All');
  const [selectedSubject, setSelectedSubject] = useState<string>('All');
  const t = translations[lang];

  const handleClearFilter = () => {
    setSearchTerm('');
    setSelectedExam('All');
    setSelectedYear('All');
    setSelectedSubject('All');
    if (clearInitialSearch) {
      clearInitialSearch();
    }
  };

  const activePapers = papers.length > 0 ? papers : DEFAULT_PAST_PAPERS;

  // Filter papers
  const filteredPapers = useMemo(() => {
    return activePapers.filter((paper) => {
      const matchesSearch =
        paper.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (TAMIL_MAP[paper.subject] || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        paper.year.includes(searchTerm) ||
        paper.examType.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesExam = selectedExam === 'All' || paper.examType === selectedExam;
      const matchesYear = selectedYear === 'All' || paper.year === selectedYear;
      const matchesSubject = selectedSubject === 'All' || paper.subject === selectedSubject;

      return matchesSearch && matchesExam && matchesYear && matchesSubject;
    });
  }, [activePapers, searchTerm, selectedExam, selectedYear, selectedSubject]);

  return (
    <div className="space-y-8 pb-12">
      {/* Page Header */}
      <div className="border-b border-slate-205 dark:border-neon-cyan/20 pb-4">
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white uppercase tracking-wide">
          {t.papersTitle}
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          {t.papersDesc}
        </p>
      </div>

      {/* Main Grid: Control Sidebar + List Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        
        {/* Sidebar Controls with neat cyberpunk glowing effects */}
        <div className="bg-white dark:bg-gaming-card p-6 rounded-2xl border border-slate-205 dark:border-neon-cyan/25 shadow-sm space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="font-extrabold text-slate-900 dark:text-white text-xs uppercase tracking-wider">{lang === 'ta' ? 'தேடல் காரணி' : 'Filters'}</h3>
            <button
              onClick={handleClearFilter}
              className="text-[10px] font-black text-blue-600 dark:text-neon-cyan hover:underline flex items-center space-x-1 uppercase tracking-wider"
            >
              <RefreshCw className="w-3 h-3 animate-spin duration-1000" />
              <span>{lang === 'ta' ? 'மீட்டமை' : 'Reset'}</span>
            </button>
          </div>

          {/* Keyword Search */}
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 block">{lang === 'ta' ? 'சொல் தேடல்' : 'Search'}</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={t.searchPapersPlaceholder}
                className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white placeholder-slate-450 border border-slate-250 dark:border-neon-cyan/20 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-neon-cyan transition"
              />
            </div>
          </div>

          {/* Exam Type Selector */}
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 block">{t.filterByExamType}</label>
            <div className="grid grid-cols-3 gap-1">
              <button
                onClick={() => setSelectedExam('All')}
                className={`py-2 rounded-lg text-[10px] font-black uppercase tracking-wide transition-all ${
                  selectedExam === 'All'
                    ? 'bg-blue-600 text-white dark:bg-neon-cyan dark:text-slate-950 shadow-sm'
                    : 'bg-slate-50 text-slate-705 dark:bg-slate-950 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                {t.allExamTypes}
              </button>
              <button
                onClick={() => setSelectedExam('O/L')}
                className={`py-2 rounded-lg text-[10px] font-black uppercase tracking-wide transition-all ${
                  selectedExam === 'O/L'
                    ? 'bg-blue-600 text-white dark:bg-neon-cyan dark:text-slate-950 shadow-sm'
                    : 'bg-slate-50 text-slate-705 dark:bg-slate-950 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                O/L
              </button>
              <button
                onClick={() => setSelectedExam('A/L')}
                className={`py-2 rounded-lg text-[10px] font-black uppercase tracking-wide transition-all ${
                  selectedExam === 'A/L'
                    ? 'bg-blue-600 text-white dark:bg-neon-cyan dark:text-slate-950 shadow-sm'
                    : 'bg-slate-50 text-slate-705 dark:bg-slate-950 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                A/L
              </button>
            </div>
          </div>

          {/* Year Filter */}
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 block">{lang === 'ta' ? 'தேர்வு வருடங்கள்' : 'Exam Year'}</label>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white border border-slate-200 dark:border-neon-cyan/20 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-neon-cyan transition"
            >
              <option value="All">{lang === 'ta' ? 'அனைத்து வருடங்கள்' : 'All Years'}</option>
              {AVAILABLE_YEARS.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>

          {/* Subject Filter */}
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 block">{t.filterBySubject}</label>
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white border border-slate-200 dark:border-neon-cyan/20 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-neon-cyan transition"
            >
              <option value="All">{t.allSubjects}</option>
              {SUBJECTS.map((sub) => (
                <option key={sub} value={sub}>
                  {TAMIL_MAP[sub] || sub}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Paper Results Display */}
        <div className="lg:col-span-3 space-y-4">
          <div className="flex justify-between items-center bg-slate-100 dark:bg-slate-950/80 p-4 rounded-xl border border-slate-200 dark:border-neon-cyan/10">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-600 dark:text-neon-cyan">
              {filteredPapers.length} {lang === 'ta' ? 'பரீட்சை வினாத்தாள்கள் உள்ளன' : 'Past Papers loaded'}
            </span>
            <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider flex items-center space-x-1 shrink-0">
              <Sparkles className="w-3 h-3 text-neon-pink" />
              <span>G.C.E EXAMINATIONS</span>
            </div>
          </div>

          {filteredPapers.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredPapers.map((paper) => (
                <motion.div
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.25 }}
                  key={paper.id}
                  className="bg-white dark:bg-gaming-card p-5 rounded-2xl border border-slate-205 dark:border-neon-cyan/10 shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5 duration-300 flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className={`px-2.5 py-0.5 text-[9px] font-extrabold rounded uppercase tracking-wider ${
                        paper.examType === 'A/L'
                          ? 'bg-purple-100 text-purple-700 dark:bg-neon-pink/15 dark:text-neon-pink'
                          : 'bg-orange-100 text-orange-700 dark:bg-neon-cyan/15 dark:text-neon-cyan'
                      }`}>
                        {TAMIL_MAP[paper.examType] || paper.examType}
                      </span>
                      <span className="text-[10px] font-bold text-slate-500 dark:text-neon-cyan flex items-center space-x-1 font-mono uppercase">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        <span>{paper.year}</span>
                      </span>
                    </div>

                    <div className="flex items-start space-x-3 pt-1">
                      <div className="p-2.5 bg-sky-50 dark:bg-neon-cyan/10 text-sky-655 dark:text-neon-cyan rounded-xl shrink-0 mt-0.5 border dark:border-neon-cyan/20">
                        <FileText className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-extrabold text-slate-900 dark:text-white text-sm leading-snug">
                          {TAMIL_MAP[paper.subject] || paper.subject} ({paper.year} Past Paper)
                        </h3>
                        <p className="text-[9px] text-slate-400 mt-1 uppercase font-bold tracking-wide">
                          {lang === 'ta' ? 'நிரல் விடை மற்றும் புள்ளித் திட்டம் உள்ளடங்கியது' : 'Includes answers and marking procedures'}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-5 pt-3.5 border-t border-slate-100 dark:border-slate-800/60 flex items-center justify-between">
                    <span className="text-[9px] font-mono text-neon-pink uppercase tracking-widest font-black text-glow-pink">SCHEME INCLUDED</span>
                    <a
                      href={paper.pdfUrl}
                      target="_blank"
                      referrerPolicy="no-referrer"
                      rel="noreferrer"
                      className="px-4 py-2 bg-slate-950 dark:bg-neon-cyan hover:bg-neon-purple dark:hover:bg-neon-purple text-white dark:text-slate-950 text-xs font-black rounded-xl uppercase tracking-widest transition-all shadow-sm hover:shadow flex items-center space-x-1.5 whitespace-nowrap"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>{lang === 'ta' ? 'பதிவிறக்கு' : 'Download Paper'}</span>
                    </a>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="border border-dashed border-slate-300 dark:border-neon-cyan/30 p-12 text-center rounded-2xl flex flex-col items-center justify-center space-y-3 bg-white dark:bg-gaming-card">
              <AlertCircle className="w-8 h-8 text-slate-400 dark:text-neon-pink" />
              <h3 className="font-extrabold text-slate-900 dark:text-white text-sm">{t.noPapersFound}</h3>
              <p className="text-xs text-slate-500 max-w-sm">
                {lang === 'ta' ? 'தேடப்பட்ட வருடத்திலோ அல்லது பாடத்திலோ வினாத்தாள்கள் இன்னும் பதிவேற்றப்படவில்லை.' : 'Past papers for the requested year or subject combo are not available yet.'}
              </p>
              <button
                onClick={handleClearFilter}
                className="px-4 py-2.5 bg-slate-900 dark:bg-neon-cyan hover:bg-neon-purple dark:hover:bg-neon-purple text-white dark:text-slate-950 rounded-xl text-xs font-black uppercase tracking-widest transition-all"
              >
                {lang === 'ta' ? 'அனைத்தும் காட்டு' : 'Show All Papers'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
