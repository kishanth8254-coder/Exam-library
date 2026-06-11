import { useState, FormEvent } from 'react';
import { Book as BookIcon, Award, Search, ArrowRight, GraduationCap } from 'lucide-react';
import { motion } from 'motion/react';
import { Book, PastPaper } from '../types';
import { translations } from '../utils/translations';

interface HomeProps {
  books: Book[];
  papers: PastPaper[];
  setCurrentTab: (tab: string) => void;
  setSearchKeyword: (kw: string) => void;
  lang: 'ta' | 'en';
}

export default function Home({ books, papers, setCurrentTab, setSearchKeyword, lang }: HomeProps) {
  const [localSearch, setLocalSearch] = useState('');
  const t = translations[lang];

  // Handle homepage main search
  const handleSearchSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!localSearch.trim()) return;
    
    setSearchKeyword(localSearch);
    
    // Intelligently route based on search term
    if (localSearch.toLowerCase().includes('paper') || localSearch.toLowerCase().includes('வினா') || localSearch.toLowerCase().includes('20')) {
      setCurrentTab('papers');
    } else {
      setCurrentTab('books');
    }
  };

  return (
    <div className="space-y-16 pb-12">
      
      {/* 1. Hero Section with dynamic gaming RGB animation and lighting glow */}
      <section className="relative overflow-hidden bg-slate-900 border border-slate-800 dark:border-neon-purple/50 text-white rounded-3xl py-16 px-6 sm:px-12 dark:glow-purple dark:animate-pulse-purple">
        {/* Background ambient lighting balls */}
        <div className="absolute top-[-50px] right-[-50px] w-96 h-96 rounded-full bg-neon-purple opacity-30 blur-[130px] -z-10 pointer-events-none" />
        <div className="absolute bottom-[-100px] left-[-100px] w-96 h-96 rounded-full bg-neon-cyan opacity-25 blur-[120px] -z-10 pointer-events-none" />

        <div className="relative max-w-4xl mx-auto text-center space-y-6">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center space-x-2 bg-slate-800/85 backdrop-blur-md px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-widest border border-neon-cyan/40 dark:glow-cyan text-neon-cyan"
          >
            <span className="w-2 h-2 rounded-full bg-neon-pink animate-pulse" />
            <span>{t.freeEducationalPool} • Sri Lanka</span>
          </motion.div>

          {/* Heading with neon color split */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-3xl sm:text-5xl font-black tracking-tight leading-tight"
          >
            {t.heroTitle} <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-purple via-neon-pink to-neon-cyan text-glow-purple">
              {t.heroTitleAccent}
            </span>{' '}
            <span className="dark:text-white">{t.heroTitleSuffix}</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto font-medium"
          >
            {t.heroDesc}
          </motion.p>

          {/* Search Bar - styled like high tech console input */}
          <motion.form
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            onSubmit={handleSearchSubmit}
            className="max-w-xl mx-auto mt-8 flex flex-col sm:flex-row gap-2"
          >
            <div className="relative flex-grow">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                value={localSearch}
                onChange={(e) => setLocalSearch(e.target.value)}
                placeholder={t.searchPlaceholder}
                className="w-full pl-12 pr-4 py-3.5 rounded-xl text-white placeholder-slate-400 bg-slate-950 border border-slate-750 dark:border-neon-cyan/40 focus:outline-none focus:ring-2 focus:ring-neon-cyan text-sm font-semibold transition"
              />
            </div>
            <button
              type="submit"
              className="px-6 py-3.5 bg-gradient-to-r from-neon-purple to-neon-cyan hover:from-neon-cyan hover:to-neon-pink text-slate-950 font-black text-xs uppercase tracking-widest rounded-xl transition-all duration-300 flex items-center justify-center space-x-1.5 shrink-0 shadow-lg cursor-pointer transform hover:scale-102"
            >
              <span>{t.searchBtn}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </motion.form>
        </div>
      </section>

      {/* 2. Platform Introduction Advantages - Styled with sleek neon hover cards */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white dark:bg-gaming-card p-6 rounded-2xl shadow-md border border-slate-100 dark:border-neon-purple/20 transition-all hover:border-neon-purple/80 hover:scale-[1.02] duration-300">
          <div className="p-3 bg-blue-105 dark:bg-neon-purple/10 text-blue-600 dark:text-neon-purple w-fit rounded-xl mb-4 border border-transparent dark:border-neon-purple/40">
            <BookIcon className="w-6 h-6" />
          </div>
          <h3 className="font-extrabold text-base text-slate-900 dark:text-white dark:text-glow-purple mb-2">
            {t.allTextbooks}
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-semibold">
            {t.allTextbooksDesc}
          </p>
        </div>

        <div className="bg-white dark:bg-gaming-card p-6 rounded-2xl shadow-md border border-slate-100 dark:border-neon-pink/20 transition-all hover:border-neon-pink/80 hover:scale-[1.02] duration-300">
          <div className="p-3 bg-green-150 dark:bg-neon-pink/10 text-green-600 dark:text-neon-pink w-fit rounded-xl mb-4 border border-transparent dark:border-neon-pink/40">
            <Award className="w-6 h-6" />
          </div>
          <h3 className="font-extrabold text-base text-slate-900 dark:text-white dark:text-glow-pink mb-2">
            {t.papersAndAnswers}
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-semibold">
            {t.papersAndAnswersDesc}
          </p>
        </div>

        <div className="bg-white dark:bg-gaming-card p-6 rounded-2xl shadow-md border border-slate-100 dark:border-neon-cyan/20 transition-all hover:border-neon-cyan/80 hover:scale-[1.02] duration-300">
          <div className="p-3 bg-amber-105 dark:bg-neon-cyan/10 text-amber-600 dark:text-neon-cyan w-fit rounded-xl mb-4 border border-transparent dark:border-neon-cyan/40">
            <GraduationCap className="w-6 h-6" />
          </div>
          <h3 className="font-extrabold text-base text-slate-900 dark:text-white dark:text-glow-cyan mb-2">
            {t.freeDownload}
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-semibold">
            {t.freeDownloadDesc}
          </p>
        </div>
      </section>

      {/* 5. Resource Statistics Counter section - styled cleanly with simple panels */}
      <section className="bg-white dark:bg-gaming-card p-8 rounded-3xl border border-slate-200 dark:border-neon-purple/20">
        <div className="max-w-3xl mx-auto text-center space-y-4">
          <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white uppercase tracking-wider">
            {lang === 'ta' ? 'பரீட்சை நூலகக் கண்காணிப்பு' : 'Exam Library Resources Overview'}
          </h2>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed max-w-2xl mx-auto font-semibold">
            {lang === 'ta' 
              ? 'எமது தளம் இலங்கை கல்வி திணைக்கள பாடத்திட்ட விதிகளுக்கு அமைய, மாணவர்களின் பிரவேச சுலபத்தன்மையை அதிகரிக்க பிரத்தியேகமாக தயாரிக்கப்பட்ட கல்வி வள களஞ்சியமாகும்.'
              : 'Our platform is a custom digital library compiled specifically according to the national syllabus framework to offer quick direct study access.'
            }
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-6 dark:divide-x dark:divide-neon-purple/20">
            <div>
              <span className="block text-2xl sm:text-3xl font-black text-blue-600 dark:text-neon-purple text-glow-purple">100+</span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 block font-bold uppercase tracking-wider pt-1">{lang === 'ta' ? 'அரசு பாடநூல்கள்' : 'Government Books'}</span>
            </div>
            <div>
              <span className="block text-2xl sm:text-3xl font-black text-purple-600 dark:text-neon-pink text-glow-pink">150+</span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 block font-bold uppercase tracking-wider pt-1">{lang === 'ta' ? 'கடந்த கால வினாத்தாள்கள்' : 'Past Papers'}</span>
            </div>
            <div>
              <span className="block text-2xl sm:text-3xl font-black text-green-600 dark:text-neon-cyan text-glow-cyan">20+</span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 block font-bold uppercase tracking-wider pt-1">{lang === 'ta' ? 'கற்பிக்கும் பாடங்கள்' : 'Curricular Subjects'}</span>
            </div>
            <div>
              <span className="block text-2xl sm:text-3xl font-black text-amber-500 dark:text-white">100%</span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 block font-bold uppercase tracking-wider pt-1">{t.freeService}</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
