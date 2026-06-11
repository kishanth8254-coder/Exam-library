import { useState, useMemo } from 'react';
import { Book as BookType } from '../types';
import { DEFAULT_BOOKS, GRADES, SUBJECTS, TAMIL_MAP } from '../utils/constants';
import { Search, Download, BookOpen, AlertCircle, RefreshCw } from 'lucide-react';
import { motion } from 'motion/react';
import { translations } from '../utils/translations';

interface BooksProps {
  books: BookType[];
  initialSearch?: string;
  clearInitialSearch?: () => void;
  lang: 'ta' | 'en';
}

export default function Books({ books, initialSearch = '', clearInitialSearch, lang }: BooksProps) {
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [selectedGrade, setSelectedGrade] = useState<string>('All');
  const [selectedSubject, setSelectedSubject] = useState<string>('All');
  const t = translations[lang];

  // Sync initialSearch if any from Home Page
  const handleClearFilter = () => {
    setSearchTerm('');
    setSelectedGrade('All');
    setSelectedSubject('All');
    if (clearInitialSearch) {
      clearInitialSearch();
    }
  };

  const activeBooks = books.length > 0 ? books : DEFAULT_BOOKS;

  // Filter Logic
  const filteredBooks = useMemo(() => {
    return activeBooks.filter((book) => {
      const matchesSearch =
        book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (TAMIL_MAP[book.subject] || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.grade.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesGrade = selectedGrade === 'All' || book.grade === selectedGrade;
      const matchesSubject = selectedSubject === 'All' || book.subject === selectedSubject;

      return matchesSearch && matchesGrade && matchesSubject;
    });
  }, [activeBooks, searchTerm, selectedGrade, selectedSubject]);

  return (
    <div className="space-y-8 pb-12">
      {/* Header section */}
      <div className="border-b border-slate-200 dark:border-neon-purple/20 pb-4">
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white uppercase tracking-wide">
          {t.booksTitle}
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          {t.booksDesc}
        </p>
      </div>

      {/* Filters Bench */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        
        {/* Left Side: Filter Sidebar with Neon lights */}
        <div className="bg-white dark:bg-gaming-card p-6 rounded-2xl border border-slate-205 dark:border-neon-purple/20 shadow-sm space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="font-extrabold text-slate-900 dark:text-white text-xs uppercase tracking-wider">{lang === 'ta' ? 'தேடல் வடிகட்டி' : 'Filter Control'}</h3>
            <button
              onClick={handleClearFilter}
              className="text-[10px] font-black text-blue-600 dark:text-neon-cyan hover:underline flex items-center space-x-1 uppercase tracking-wider"
            >
              <RefreshCw className="w-3 h-3 animate-spin duration-1000" />
              <span>{lang === 'ta' ? 'மீட்டமைக்க' : 'Reset'}</span>
            </button>
          </div>

          {/* Search Input */}
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 block">{lang === 'ta' ? 'சொதித் தேடல்' : 'Keyword Search'}</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={t.searchBooksPlaceholder}
                className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white placeholder-slate-450 border border-slate-200 dark:border-neon-purple/20 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-neon-purple transition"
              />
            </div>
          </div>

          {/* Grade Selector */}
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 block">{t.filterByGrade}</label>
            <div className="flex flex-wrap gap-1.5 max-h-48 overflow-y-auto pr-1">
              <button
                onClick={() => setSelectedGrade('All')}
                className={`px-3 py-1.5 rounded-lg text-[10px] font-extrabold uppercase tracking-wide transition-all ${
                  selectedGrade === 'All'
                    ? 'bg-blue-600 text-white dark:bg-neon-cyan dark:text-slate-950 shadow-sm'
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-700 dark:bg-slate-950 dark:text-slate-400 dark:hover:bg-slate-800'
                }`}
              >
                {t.allGrades}
              </button>
              {GRADES.map((grade) => (
                <button
                  key={grade}
                  onClick={() => setSelectedGrade(grade)}
                  className={`px-3 py-1.5 rounded-lg text-[10px] font-extrabold uppercase tracking-wide transition-all ${
                    selectedGrade === grade
                      ? 'bg-blue-600 text-white dark:bg-neon-cyan dark:text-slate-950 shadow-sm'
                      : 'bg-slate-50 hover:bg-slate-100 text-slate-700 dark:bg-slate-950 dark:text-slate-400 dark:hover:bg-slate-800'
                  }`}
                >
                  {lang === 'ta' ? TAMIL_MAP[grade] || grade : grade}
                </button>
              ))}
            </div>
          </div>

          {/* Subject Selector */}
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 block">{t.filterBySubject}</label>
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white border border-slate-200 dark:border-neon-purple/20 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-neon-purple transition"
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

        {/* Right Side: Books list results */}
        <div className="lg:col-span-3 space-y-4">
          <div className="flex justify-between items-center bg-slate-100 dark:bg-slate-950/80 p-4 rounded-xl border border-slate-200 dark:border-neon-cyan/10">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-600 dark:text-neon-cyan">
              {filteredBooks.length} {lang === 'ta' ? 'புத்தகங்கள் உள்ளன' : 'Textbooks matches'}
            </span>
            <div className="text-[9px] text-slate-400 uppercase font-bold tracking-widest">
              Sri Lankan Government Library pool
            </div>
          </div>

          {filteredBooks.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {filteredBooks.map((book) => (
                <motion.div
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  key={book.id}
                  className="bg-white dark:bg-gaming-card p-5 rounded-2xl border border-slate-205 dark:border-neon-purple/10 shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5 duration-300 flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex justify-between items-start gap-2">
                      <span className="px-2 py-0.5 bg-blue-50 text-blue-700 dark:bg-neon-purple/15 dark:text-neon-purple text-[9px] font-extrabold uppercase tracking-widest rounded">
                        {TAMIL_MAP[book.grade] || book.grade}
                      </span>
                      <span className="px-2 py-0.5 bg-slate-100 text-slate-705 dark:bg-slate-900 dark:text-neon-cyan text-[8px] font-black rounded uppercase tracking-wider">
                        {TAMIL_MAP[book.subject] || book.subject}
                      </span>
                    </div>

                    <div className="flex space-x-3 items-start pt-1">
                      <div className="p-2 bg-indigo-50 dark:bg-neon-purple/10 text-indigo-650 dark:text-neon-purple rounded-xl shrink-0 mt-0.5 border dark:border-neon-purple/20">
                        <BookOpen className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-extrabold text-slate-900 dark:text-white text-sm line-clamp-2 leading-snug">
                          {book.title}
                        </h3>
                        <p className="text-[9px] text-slate-400 mt-1 uppercase font-bold tracking-wider">
                          {lang === 'ta' ? 'அரசாங்க வெளியீடு (NIE Sri Lanka)' : 'Official Resource (NIE Sri Lanka)'}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-5 pt-3.5 border-t border-slate-100 dark:border-slate-800/60 flex items-center justify-between">
                    <span className="text-[9px] font-mono text-neon-pink tracking-widest font-black uppercase text-glow-pink">FREE PDF</span>
                    <a
                      href={book.pdfUrl}
                      target="_blank"
                      referrerPolicy="no-referrer"
                      rel="noreferrer"
                      className="px-4 py-2 bg-slate-950 dark:bg-neon-purple hover:bg-neon-pink dark:hover:bg-neon-pink text-white dark:text-slate-950 text-xs font-black rounded-xl uppercase tracking-widest transition-all shadow-sm hover:shadow flex items-center space-x-1.5 whitespace-nowrap"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>{lang === 'ta' ? 'பதிவிறக்கு' : 'Download'}</span>
                    </a>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="border border-dashed border-slate-300 dark:border-neon-purple/30 p-12 text-center rounded-2xl flex flex-col items-center justify-center space-y-3 bg-white dark:bg-gaming-card">
              <AlertCircle className="w-8 h-8 text-slate-400 dark:text-neon-pink" />
              <h3 className="font-extrabold text-slate-900 dark:text-white text-sm">{t.noBooksFound}</h3>
              <p className="text-xs text-slate-500 max-w-sm">
                {lang === 'ta' ? 'தேடல் சொற்களை மாற்றி அனைத்து பாடங்களையும் பார்வையிடுங்கள்.' : 'Try changing your keyword select triggers to see general textbooks.'}
              </p>
              <button
                onClick={handleClearFilter}
                className="px-4 py-2.5 bg-slate-900 dark:bg-neon-cyan hover:bg-neon-purple dark:hover:bg-neon-purple text-white dark:text-slate-950 rounded-xl text-xs font-black uppercase tracking-widest transition-all"
              >
                {lang === 'ta' ? 'அனைத்தும் காட்டு' : 'Show All'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
