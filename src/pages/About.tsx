import { GraduationCap, Heart, Rocket, Target, Users } from 'lucide-react';
import { motion } from 'motion/react';
import { translations } from '../utils/translations';

interface AboutProps {
  lang: 'ta' | 'en';
}

export default function About({ lang }: AboutProps) {
  const t = translations[lang];

  return (
    <div className="space-y-12 pb-12">
      {/* 1. Page Header */}
      <div className="border-b border-slate-200 dark:border-neon-purple/20 pb-4">
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white uppercase tracking-wide">
          {t.aboutTitle}
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-semibold">
          {t.aboutDesc}
        </p>
      </div>

      {/* 2. Visual Intro Grid with cool modern gaming styles */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center bg-white dark:bg-gaming-card p-8 rounded-3xl border border-slate-200 dark:border-neon-purple/20">
        <div className="space-y-4">
          <div className="inline-flex items-center space-x-1.5 p-1 bg-blue-50 dark:bg-neon-purple/10 text-blue-700 dark:text-neon-purple rounded-lg text-xs font-bold leading-none pr-3 border dark:border-neon-purple/20">
            <span className="p-1.5 bg-blue-600 dark:bg-neon-purple rounded text-white dark:text-slate-950 font-mono uppercase text-[9px] scale-90 font-black">GOAL</span>
            <span className="uppercase tracking-widest text-[10px]">{t.aboutTarget}</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white leading-tight">
            {t.aboutHeroTitle}
          </h2>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-semibold">
            {t.aboutHeroDesc}
          </p>
        </div>
        <div className="p-8 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-neon-cyan/20 rounded-2xl shadow-sm text-center space-y-4">
          <div className="mx-auto p-4 bg-blue-105 dark:bg-neon-cyan/10 text-blue-650 dark:text-neon-cyan rounded-full w-fit border dark:border-neon-cyan/20">
            <GraduationCap className="w-10 h-10" />
          </div>
          <div className="space-y-1">
            <h4 className="font-black text-sm text-slate-900 dark:text-white">{lang === 'ta' ? 'பரீட்சை நூலகம்' : 'Exam Library'}</h4>
            <span className="text-[9px] text-slate-400 font-extrabold uppercase tracking-widest leading-none">ESTABLISHED 2026 • SRI LANKA</span>
          </div>
          <p className="text-xs text-slate-500 leading-relaxed font-medium">
            {t.aboutBannerDesc}
          </p>
        </div>
      </div>

      {/* 3. Vision & Mission Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Mission */}
        <div className="p-6 bg-white dark:bg-gaming-card rounded-2xl border border-slate-200 dark:border-neon-purple/20 shadow-sm hover:shadow-md transition">
          <div className="p-3 bg-blue-50 dark:bg-neon-purple/10 text-blue-600 dark:text-neon-purple w-fit rounded-xl mb-4 border dark:border-neon-purple/20">
            <Target className="w-6 h-6" />
          </div>
          <h3 className="font-extrabold text-base text-slate-900 dark:text-white mb-2 dark:text-glow-purple">{t.missionTitle}</h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-semibold">
            {t.missionDesc}
          </p>
        </div>

        {/* Vision */}
        <div className="p-6 bg-white dark:bg-gaming-card rounded-2xl border border-slate-205 dark:border-neon-pink/20 shadow-sm hover:shadow-md transition">
          <div className="p-3 bg-purple-50 dark:bg-neon-pink/10 text-purple-600 dark:text-neon-pink w-fit rounded-xl mb-4 border dark:border-neon-pink/20">
            <Rocket className="w-6 h-6" />
          </div>
          <h3 className="font-extrabold text-base text-slate-900 dark:text-white mb-2 dark:text-glow-pink">{t.visionTitle}</h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-semibold">
            {t.visionDesc}
          </p>
        </div>
      </div>

      {/* 4. Values */}
      <div className="space-y-6 pt-4 border-t border-slate-200 dark:border-neon-purple/20">
        <h3 className="text-base font-black text-slate-900 dark:text-white text-center uppercase tracking-wider">{t.valuesTitle}</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-5 text-center space-y-2 bg-white dark:bg-gaming-card rounded-2xl border dark:border-neon-purple/10">
            <div className="mx-auto p-2.5 bg-green-50 dark:bg-neon-purple/10 text-green-600 dark:text-neon-purple rounded-xl w-fit border dark:border-neon-purple/20">
              <Heart className="w-5 h-5" />
            </div>
            <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">{t.value1Title}</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 lg:leading-relaxed font-medium">
              {t.value1Desc}
            </p>
          </div>

          <div className="p-5 text-center space-y-2 bg-white dark:bg-gaming-card rounded-2xl border dark:border-neon-purple/10">
            <div className="mx-auto p-2.5 bg-yellow-50 dark:bg-neon-pink/10 text-yellow-600 dark:text-neon-pink rounded-xl w-fit border dark:border-neon-pink/20">
              <Users className="w-5 h-5" />
            </div>
            <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">{t.value2Title}</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 lg:leading-relaxed font-medium">
              {t.value2Desc}
            </p>
          </div>

          <div className="p-5 text-center space-y-2 bg-white dark:bg-gaming-card rounded-2xl border dark:border-neon-purple/10">
            <div className="mx-auto p-2.5 bg-indigo-50 dark:bg-neon-cyan/10 text-indigo-650 dark:text-neon-cyan rounded-xl w-fit border dark:border-neon-cyan/20">
              <Rocket className="w-5 h-5" />
            </div>
            <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">{t.value3Title}</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 lg:leading-relaxed font-medium">
              {t.value3Desc}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
