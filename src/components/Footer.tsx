import { GraduationCap, Mail, Phone, MapPin, Globe, Facebook, Youtube, Share2 } from 'lucide-react';
import { translations } from '../utils/translations';

interface FooterProps {
  setCurrentTab: (tab: string) => void;
  lang: 'ta' | 'en';
}

export default function Footer({ setCurrentTab, lang }: FooterProps) {
  const currentYear = new Date().getFullYear();
  const t = translations[lang];

  return (
    <footer className="bg-slate-900 border-t border-slate-800 dark:border-neon-purple/20 text-slate-350 mt-12">
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Hub Info */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center space-x-2">
              <div className="p-1.5 text-white bg-blue-600 dark:bg-gradient-to-br dark:from-neon-purple dark:to-neon-cyan rounded-lg">
                <GraduationCap className="w-6 h-6" />
              </div>
              <span className="text-base sm:text-lg font-black text-white dark:text-glow-purple tracking-tight">
                {lang === 'ta' ? 'பரீட்சை நூலகம்' : 'Exam Library'}
              </span>
            </div>
            <p className="text-xs text-slate-400 max-w-sm leading-relaxed font-semibold">
              {lang === 'ta'
                ? 'இலங்கைத் தமிழ் மாணவர்களின் கல்வி மேம்பாட்டிற்காக தரமான பாடப்புத்தகங்கள், கடந்த கால வினாத்தாள்கள் மற்றும் கற்றல் வளங்களை இலகுவாக ஒரே இடத்தில் பெற்றுக்கொள்ள உதவும் ஓர் இலவச டிஜிட்டல் நூலகம்.'
                : 'Free direct-access digital storage for Sri Lankan Tamil medium secondary students, hosting official curriculum textbooks, exam schemes, and resources.'
              }
            </p>
            <div className="flex space-x-4 pt-1">
              <a href="https://facebook.com" target="_blank" rel="noreferrer" className="p-2 bg-slate-800 hover:bg-neon-purple hover:text-slate-950 rounded-full text-slate-400 transition-colors">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="https://youtube.com" target="_blank" rel="noreferrer" className="p-2 bg-slate-800 hover:bg-neon-pink hover:text-slate-950 rounded-full text-slate-400 transition-colors">
                <Youtube className="w-4 h-4" />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="p-2 bg-slate-800 hover:bg-neon-cyan hover:text-slate-950 rounded-full text-slate-400 transition-colors">
                <Share2 className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-white font-extrabold text-xs tracking-wider uppercase">{lang === 'ta' ? 'கல்வி வழிகாட்டி' : 'SITEMAP RESOURCES'}</h3>
            <ul className="space-y-2 text-xs text-slate-400 font-semibold uppercase tracking-wider">
              <li>
                <button onClick={() => setCurrentTab('books')} className="hover:text-neon-cyan transition text-left cursor-pointer">
                  {t.books}
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentTab('papers')} className="hover:text-neon-cyan transition text-left cursor-pointer">
                  {t.papers}
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentTab('about')} className="hover:text-neon-cyan transition text-left cursor-pointer">
                  {t.about}
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentTab('contact')} className="hover:text-neon-cyan transition text-left cursor-pointer">
                  {t.contact}
                </button>
              </li>
            </ul>
          </div>

          {/* Contacts Section */}
          <div className="space-y-3 text-xs text-slate-400">
            <h3 className="text-white font-extrabold text-xs tracking-wider uppercase">{lang === 'ta' ? 'தொடர்புகளுக்கு' : 'CONTACT INFO'}</h3>
            <div className="space-y-3 font-semibold pb-1">
              <div className="flex items-start space-x-2">
                <Mail className="w-4 h-4 text-neon-purple mt-0.5" />
                <span>support@tamilstudentshub.lk</span>
              </div>
              <div className="flex items-start space-x-2">
                <Phone className="w-4 h-4 text-neon-pink mt-0.5" />
                <span>+94 21 222 2324 (யாழ்ப்பாணம்)</span>
              </div>
              <div className="flex items-start space-x-2">
                <MapPin className="w-4 h-4 text-neon-cyan mt-0.5" />
                <span>{lang === 'ta' ? 'பரீட்சை நூலகம், இலங்கை.' : 'Exam Library, Sri Lanka.'}</span>
              </div>
              <div className="flex items-start space-x-2">
                <Globe className="w-4 h-4 text-neon-purple mt-0.5" />
                <span>www.tamilstudentshub.lk</span>
              </div>
            </div>
          </div>

        </div>

        <div className="border-t border-slate-800 dark:border-slate-850 mt-12 pt-8 flex flex-col sm:flex-row justify-between items-center text-[10px] uppercase font-bold text-slate-500 tracking-wider gap-4">
          <p>© {currentYear} {lang === 'ta' ? 'பரீட்சை நூலகம் (Exam Library).' : 'Exam Library.'} {t.allRightsReserved}</p>
          <div className="flex space-x-4">
            <span>{t.freeService}</span>
            <span>•</span>
            <span>Sri Lanka Tamil Medium Education</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
