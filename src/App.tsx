import { useState, useEffect } from 'react';
import Home from './pages/Home';
import Books from './pages/Books';
import PastPapers from './pages/PastPapers';
import About from './pages/About';
import Contact from './pages/Contact';
import { Book, PastPaper } from './types';
import { db } from './lib/firebase';
import { collection, getDocs, doc, getDocFromServer } from 'firebase/firestore';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Home as HomeIcon, 
  BookOpen, 
  FileText, 
  Info, 
  Mail, 
  Sun, 
  Moon, 
  GraduationCap 
} from 'lucide-react';
import { translations } from './utils/translations';

// CRITICAL CONSTRAINT: When the application initially boots, call testConnection to satisfy Firebase skill.
async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.error("Please check your Firebase configuration.");
    }
  }
}

export default function App() {
  const [currentTab, setCurrentTab] = useState<string>('home');
  const [darkMode, setDarkMode] = useState<boolean>(true);
  const [lang, setLang] = useState<'ta' | 'en'>('ta');
  
  // Dynamic lists loaded from Firestore (with fallbacks inside sub-pages)
  const [books, setBooks] = useState<Book[]>([]);
  const [papers, setPapers] = useState<PastPaper[]>([]);
  
  // Search keyword preset (home search bar syncs this)
  const [searchKeyword, setSearchKeyword] = useState<string>('');

  // Native system device clock
  const [timeString, setTimeString] = useState<string>('12:00 PM');

  // Start connection test, load public datastores, and handle clock update
  useEffect(() => {
    testConnection();

    const updateTime = () => {
      const now = new Date();
      let hours = now.getHours();
      const mins = now.getMinutes().toString().padStart(2, '0');
      const ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12;
      hours = hours ? hours : 12; // 12-hour format
      setTimeString(`${hours}:${mins} ${ampm}`);
    };
    updateTime();
    const clockInterval = setInterval(updateTime, 15000);

    // Public asynchronous load
    const loadPublicData = async () => {
      try {
        const booksSnap = await getDocs(collection(db, 'books'));
        const fbBooks: Book[] = [];
        booksSnap.forEach((doc) => {
          fbBooks.push({ id: doc.id, ...doc.data() } as Book);
        });
        if (fbBooks.length > 0) {
          setBooks(fbBooks);
        }
      } catch (e) {
        console.log("No custom books in Firestore, displaying defaults");
      }

      try {
        const papersSnap = await getDocs(collection(db, 'pastPapers'));
        const fbPapers: PastPaper[] = [];
        papersSnap.forEach((doc) => {
          fbPapers.push({ id: doc.id, ...doc.data() } as PastPaper);
        });
        if (fbPapers.length > 0) {
          setPapers(fbPapers);
        }
      } catch (e) {
        console.log("No custom papers in Firestore, displaying defaults");
      }
    };

    loadPublicData();
    return () => clearInterval(clockInterval);
  }, []);

  // Sync Dark Mode state classes
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const t = translations[lang];

  // Bottom localized navigation tab items
  const bottomTabs = [
    { id: 'home', label: t.home, icon: HomeIcon },
    { id: 'books', label: t.books, icon: BookOpen },
    { id: 'papers', label: t.papers, icon: FileText },
    { id: 'about', label: t.about, icon: Info },
    { id: 'contact', label: t.contact, icon: Mail },
  ];

  // Switch renderer based on active tab
  const renderCurrentPage = () => {
    switch (currentTab) {
      case 'home':
        return (
          <Home
            books={books}
            papers={papers}
            setCurrentTab={setCurrentTab}
            setSearchKeyword={setSearchKeyword}
            lang={lang}
          />
        );
      case 'books':
        return (
          <Books
            books={books}
            initialSearch={searchKeyword}
            clearInitialSearch={() => setSearchKeyword('')}
            lang={lang}
          />
        );
      case 'papers':
        return (
          <PastPapers
            papers={papers}
            initialSearch={searchKeyword}
            clearInitialSearch={() => setSearchKeyword('')}
            lang={lang}
          />
        );
      case 'about':
        return <About lang={lang} />;
      case 'contact':
        return <Contact lang={lang} />;
      default:
        return (
          <Home
            books={books}
            papers={papers}
            setCurrentTab={setCurrentTab}
            setSearchKeyword={setSearchKeyword}
            lang={lang}
          />
        );
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#050811] text-slate-800 dark:text-slate-100 flex items-center justify-center font-sans transition-colors duration-300 p-0 sm:p-4 overflow-x-hidden relative">
      
      {/* Background ambient neon decorative accent lights behind phone */}
      <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] rounded-full bg-neon-purple/10 blur-[120px] pointer-events-none -translate-x-1/2 -translate-y-1/2 z-0 hidden md:block" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-neon-cyan/10 blur-[120px] pointer-events-none translate-x-1/2 translate-y-1/2 z-0 hidden md:block" />

      {/* Real-time native smartphone mockup container */}
      <div className="w-full max-w-md md:max-w-[425px] bg-white dark:bg-[#070b14] md:rounded-[44px] md:border-[10px] md:border-slate-900 md:dark:border-[#1a2333] md:shadow-[0_25px_60px_-15px_rgba(0,0,0,0.85)] flex flex-col h-screen md:h-[860px] relative overflow-hidden shrink-0 z-10">
        
        {/* TOP STATUS BAR (SIMULATED MOBILE HARDWARE & METADATA CHROME) */}
        <div className="bg-slate-150 dark:bg-[#0d1323] px-6 pt-3 pb-2 flex justify-between items-center text-[10px] font-bold text-slate-500 dark:text-slate-400 select-none shrink-0 border-b border-slate-200/40 dark:border-slate-900 relative">
          
          {/* Active dynamically updating native system clock */}
          <div className="font-mono tracking-tight font-black text-slate-700 dark:text-neon-cyan leading-none">
            {timeString}
          </div>
          
          {/* Hardware notch / Dynamic Island */}
          <div className="hidden md:block w-28 h-5 bg-slate-900 rounded-full shadow-inner absolute left-1/2 -translate-x-1/2 top-1.5 border border-slate-850 dark:border-slate-800 z-50">
            <div className="w-2.5 h-2.5 bg-slate-950 rounded-full absolute right-4 top-1/2 -translate-y-1/2 border border-slate-900 flex items-center justify-center">
              <span className="w-1 h-1 bg-[#1a457a] rounded-full animate-pulse" />
            </div>
          </div>
          
          {/* Status signals indicators */}
          <div className="flex items-center space-x-1.5 text-slate-500 dark:text-slate-400 leading-none">
            <span className="text-[8px] tracking-wider uppercase font-black text-slate-600 dark:text-neon-pink">5G</span>
            {/* Wi-Fi custom icon */}
            <svg className="w-3 h-3 fill-current text-slate-500 dark:text-neon-cyan" viewBox="0 0 24 24">
              <path d="M12 21l-12-11.6c.1-.1 5-4.4 12-4.4s11.9 4.3 12 4.4L12 21zm-10-11c1.8 1.4 6 4.7 10 4.7s8.2-3.3 10-4.7C20.5 8.9 16.7 6.6 12 6.6S3.5 8.9 2 10z" />
            </svg>
            <div className="flex items-center space-x-0.5 border border-slate-350 dark:border-slate-750 rounded px-0.5 py-0.2 shrink-0">
              <span className="text-[7px] scale-90 font-mono tracking-tighter leading-none dark:text-slate-300">100%</span>
              <div className="w-2.5 h-1.5 bg-green-500 rounded-sm" />
            </div>
          </div>
        </div>

        {/* COMPACT APP HEADER CHROME (With Title, Light theme trigger, Language Pill) */}
        <div className="bg-slate-50 dark:bg-gaming-card px-4 py-3 flex justify-between items-center border-b border-slate-200 dark:border-slate-900 shadow-sm shrink-0">
          <div className="flex items-center space-x-2">
            <div className="p-1 text-white bg-blue-600 dark:bg-gradient-to-br dark:from-neon-purple dark:to-neon-cyan rounded-lg glow-purple">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-sm font-black tracking-tight text-slate-900 dark:text-white dark:text-glow-purple uppercase">
                {lang === 'ta' ? 'பரீட்சை நூலகம்' : 'Exam Library'}
              </h1>
              <span className="text-[8px] font-bold text-slate-500 dark:text-neon-cyan block -mt-1.5 uppercase tracking-widest">
                {lang === 'ta' ? 'கற்றல் வளங்கள்' : 'Resource Pool'}
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-1.5">
            {/* Lang filter flag pills */}
            <div className="flex items-center bg-slate-150 dark:bg-slate-900 p-0.5 rounded-lg border dark:border-slate-800">
              <button
                onClick={() => setLang('ta')}
                className={`px-1.5 py-0.5 text-[8px] font-black rounded-md transition-all ${
                  lang === 'ta'
                    ? 'bg-blue-600 text-white dark:bg-neon-cyan dark:text-slate-950 shadow-sm font-bold'
                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                தமிழ்
              </button>
              <button
                onClick={() => setLang('en')}
                className={`px-1.5 py-0.5 text-[8px] font-black rounded-md transition-all ${
                  lang === 'en'
                    ? 'bg-blue-600 text-white dark:bg-neon-cyan dark:text-slate-950 shadow-sm font-bold'
                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                EN
              </button>
            </div>

            {/* Nice Dark Mode switch icon */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-1.5 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white rounded-lg bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 text-center flex items-center border dark:border-slate-800 transition"
              title="Toggle Theme"
            >
              {darkMode ? <Sun className="w-3.5 h-3.5 text-yellow-400" /> : <Moon className="w-3.5 h-3.5 text-slate-600" />}
            </button>
          </div>
        </div>

        {/* SCROLLABLE INTERACTIVE VIEWPORT AREA */}
        <div className="flex-1 overflow-y-auto px-4 py-4 scrollbar-thin dark:scrollbar-track-[#090d16] bg-slate-50 dark:bg-[#060812]">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentTab}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              {renderCurrentPage()}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* NATIVE BOTTOM NAVIGATION TAB MENU */}
        <div className="bg-slate-50 dark:bg-[#0c1221] border-t border-slate-200/60 dark:border-slate-900 py-2 px-3 flex justify-around items-center shrink-0 shadow-[0_-4px_12px_rgba(0,0,0,0.04)] relative">
          
          {bottomTabs.map((tab) => {
            const isActive = currentTab === tab.id;
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setCurrentTab(tab.id);
                  // Clean search cache on tab change
                  if (tab.id !== 'books' && tab.id !== 'papers') {
                    setSearchKeyword('');
                  }
                }}
                className={`flex flex-col items-center justify-center p-1 rounded-xl transition-all duration-300 select-none group cursor-pointer ${
                  isActive 
                    ? 'text-blue-600 dark:text-neon-cyan font-black scale-103' 
                    : 'text-slate-400 dark:text-slate-505 hover:text-slate-700 dark:hover:text-slate-300'
                }`}
                style={{ width: '68px' }}
              >
                {/* Simulated native dynamic active background state highlights */}
                <div className={`p-1.5 rounded-xl transition-all duration-200 ${
                  isActive 
                    ? 'bg-blue-100 dark:bg-neon-cyan/15 text-blue-600 dark:text-neon-cyan shadow-sm border border-blue-200/40 dark:border-neon-cyan/25' 
                    : 'bg-transparent text-slate-400 dark:text-slate-500 group-hover:scale-105'
                }`}>
                  <Icon className="w-4.5 h-4.5" />
                </div>
                
                {/* translated bottom tab menu tags */}
                <span className="text-[8px] font-black uppercase tracking-wider mt-1 block max-w-full truncate leading-none">
                  {tab.label}
                </span>

                {isActive && (
                  <span className="absolute -bottom-1.5 w-1 h-1 bg-blue-600 dark:bg-neon-cyan rounded-full" />
                )}
              </button>
            );
          })}
        </div>

        {/* APPLE-LIKE HOME SWIPE INDICATION PILL AT BOTTOM CHROME EDGE */}
        <div className="bg-slate-50 dark:bg-[#0c1221] pb-1.5 text-center select-none shrink-0 pointer-events-none hidden md:block">
          <div className="w-24 h-1 bg-slate-300 dark:bg-[#202c44] rounded-full mx-auto" />
        </div>
        
      </div>
    </div>
  );
}
