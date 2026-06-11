import { useState } from 'react';
import { Menu, X, Sun, Moon, GraduationCap, User, LogOut, Languages } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { auth } from '../lib/firebase';
import { translations } from '../utils/translations';

interface NavbarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  darkMode: boolean;
  setDarkMode: (dark: boolean) => void;
  adminUser: any;
  handleLogout: () => void;
  lang: 'ta' | 'en';
  setLang: (l: 'ta' | 'en') => void;
}

export default function Navbar({
  currentTab,
  setCurrentTab,
  darkMode,
  setDarkMode,
  adminUser,
  handleLogout,
  lang,
  setLang
}: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const t = translations[lang];

  const navItems = [
    { id: 'home', label: t.home },
    { id: 'books', label: t.books },
    { id: 'papers', label: t.papers },
    { id: 'about', label: t.about },
    { id: 'contact', label: t.contact },
  ];

  return (
    <nav className="sticky top-0 z-50 transition-all duration-300 bg-white dark:bg-gaming-bg border-b border-slate-200 dark:border-neon-purple/40 shadow-md dark:shadow-neon-purple/20">
      
      {/* Dynamic ambient background light glow */}
      <div className="absolute top-0 left-1/4 w-96 h-1 bg-gradient-to-r from-neon-purple via-neon-cyan to-neon-pink opacity-80 blur-sm dark:block hidden" />

      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          
          {/* Logo Section */}
          <div className="flex items-center space-x-2 cursor-pointer group" onClick={() => { setCurrentTab('home'); setIsOpen(false); }}>
            <div className="p-2 text-white bg-blue-600 dark:bg-gradient-to-br dark:from-neon-purple dark:to-neon-cyan rounded-lg transition-transform group-hover:scale-105 glow-purple">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <span className="text-base sm:text-lg font-black tracking-tight text-slate-900 dark:text-white dark:text-glow-purple leading-tight block">
                {lang === 'ta' ? 'பரீட்சை நூலகம்' : 'Exam Library'}
              </span>
              <span className="text-[10px] font-bold text-slate-500 dark:text-neon-cyan -mt-1 block uppercase tracking-widest leading-none">
                {lang === 'ta' ? 'கற்றல் வளக் களஞ்சியம்' : 'Tamil Medium Educational Hub'}
              </span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-3">
            <div className="flex space-x-1 lg:space-x-1.5 mr-2">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setCurrentTab(item.id)}
                  className={`px-3 py-2 rounded-xl text-xs font-extrabold tracking-wide transition-all ${
                    currentTab === item.id
                      ? 'bg-blue-50 text-blue-600 dark:bg-neon-purple/10 dark:text-neon-purple border dark:border-neon-purple/40 glow-purple'
                      : 'text-slate-600 hover:text-slate-950 hover:bg-slate-55 dark:text-slate-300 dark:hover:text-white dark:hover:bg-slate-800/40'
                  }`}
                >
                  <span className="block text-center uppercase tracking-wider">{item.label}</span>
                </button>
              ))}
            </div>

            {/* Language Selector Indicator */}
            <div className="flex items-center space-x-1 bg-slate-100 dark:bg-slate-900/80 p-1.5 rounded-xl border border-slate-200 dark:border-neon-cyan/20">
              <Languages className="w-3.5 h-3.5 text-slate-500 dark:text-neon-cyan" />
              <button
                onClick={() => setLang('ta')}
                className={`px-2 py-1 text-[10px] font-black rounded-lg transition-all ${
                  lang === 'ta'
                    ? 'bg-blue-600 text-white dark:bg-neon-cyan dark:text-slate-950 shadow-sm'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-850 dark:hover:text-slate-200'
                }`}
              >
                தமிழ்
              </button>
              <button
                onClick={() => setLang('en')}
                className={`px-2 py-1 text-[10px] font-black rounded-lg transition-all ${
                  lang === 'en'
                    ? 'bg-blue-600 text-white dark:bg-neon-cyan dark:text-slate-950 shadow-sm'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-850 dark:hover:text-slate-200'
                }`}
              >
                EN
              </button>
            </div>

            {/* Dark Mode Toggle */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-all border border-transparent dark:hover:border-neon-purple/30"
              aria-label="Toggle Theme"
            >
              {darkMode ? <Sun className="w-5 h-5 text-yellow-400 drop-shadow-[0_0_6px_rgba(250,204,21,0.5)]" /> : <Moon className="w-5 h-5 text-slate-600" />}
            </button>

            {/* Admin and login features removed */}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center space-x-1.5 md:hidden">
            {/* Quick Lang Toggle Mobile */}
            <button
              onClick={() => setLang(lang === 'ta' ? 'en' : 'ta')}
              className="p-2 text-slate-500 dark:text-slate-300 text-xs font-extrabold uppercase bg-slate-100 dark:bg-slate-850 rounded-lg border dark:border-neon-cyan/20"
            >
              {lang === 'ta' ? 'EN' : 'தமிழ்'}
            </button>

            {/* Dark Mode Toggle */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            >
              {darkMode ? <Sun className="w-4 h-4 text-yellow-500" /> : <Moon className="w-4 h-4 text-slate-600" />}
            </button>

            {/* Menu Trigger */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 text-slate-500 rounded-lg hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-800 focus:outline-none transition"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-slate-200 dark:border-neon-purple/30 bg-white dark:bg-gaming-bg transition-all overflow-hidden"
          >
            <div className="px-2 pt-2 pb-4 space-y-1">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setCurrentTab(item.id);
                    setIsOpen(false);
                  }}
                  className={`flex justify-between items-center w-full px-4 py-2.5 rounded-xl text-left text-xs font-black ${
                    currentTab === item.id
                      ? 'bg-blue-600 text-white dark:bg-neon-purple/20 dark:text-neon-purple dark:border dark:border-neon-purple/30'
                      : 'text-slate-700 hover:bg-slate-105 dark:text-slate-300 dark:hover:bg-slate-800/40'
                  }`}
                >
                  <span>{item.label}</span>
                </button>
              ))}

              {/* Admin and mobile login features removed */}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
