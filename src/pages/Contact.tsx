import { useState, FormEvent } from 'react';
import { Mail, Phone, MapPin, Send, MessageSquare, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';
import { translations } from '../utils/translations';

interface ContactProps {
  lang: 'ta' | 'en';
}

export default function Contact({ lang }: ContactProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const t = translations[lang];

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) return;

    setIsLoading(true);
    // Simulate API form submission beautifully
    setTimeout(() => {
      setIsLoading(false);
      setIsSubmitted(true);
      // Reset fields
      setName('');
      setEmail('');
      setMessage('');
    }, 1200);
  };

  return (
    <div className="space-y-12 pb-12">
      {/* Page Header */}
      <div className="border-b border-slate-200 dark:border-neon-purple/20 pb-4">
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white uppercase tracking-wide">
          {t.contactTitle}
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-semibold">
          {t.contactDesc}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
        {/* Left 2 Cols: contact metadata cards */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-gradient-to-br from-slate-900 via-blue-950 to-slate-950 text-white p-6 rounded-2xl border border-neon-purple/30 dark:glow-purple space-y-6">
            <div className="space-y-2">
              <span className="text-[10px] font-black uppercase tracking-widest text-neon-cyan">{t.talkWithUs}</span>
              <h3 className="text-base font-black uppercase tracking-wider">{t.contactInfo}</h3>
              <p className="text-[11px] text-slate-350 leading-relaxed font-semibold">
                {lang === 'ta' 
                  ? 'ஆலோசனைகள் அல்லது புதிய வினாத்தாள்களை எங்களது வள மையத்தில் சேர்க்க விரும்பினால் தாராளமாக தொடர்பு கொள்ளலாம்.'
                  : 'Get in touch to share suggestions or request uploading educational source publications to our database.'
                }
              </p>
            </div>

            <div className="space-y-4 text-xs font-medium">
              <div className="flex items-center space-x-3 bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
                <Mail className="w-5 h-5 text-neon-purple shrink-0" />
                <div>
                  <span className="block text-[10px] uppercase font-bold text-slate-400">{t.emailLabel}</span>
                  <a href="mailto:support@tamilstudentshub.lk" className="font-extrabold underline text-neon-cyan text-xs">support@tamilstudentshub.lk</a>
                </div>
              </div>

              <div className="flex items-center space-x-3 bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
                <Phone className="w-5 h-5 text-neon-pink shrink-0" />
                <div>
                  <span className="block text-[10px] uppercase font-bold text-slate-400">{lang === 'ta' ? 'தொலைபேசி எண்' : 'Phone'}</span>
                  <span className="font-extrabold text-white text-xs">+94 21 222 2324</span>
                </div>
              </div>

              <div className="flex items-center space-x-3 bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
                <MapPin className="w-5 h-5 text-neon-cyan shrink-0" />
                <div>
                  <span className="block text-[10px] uppercase font-bold text-slate-400">{lang === 'ta' ? 'தலைமையகம்' : 'Headquarters'}</span>
                  <span className="font-extrabold text-white text-xs">{lang === 'ta' ? 'யாழ்ப்பாணம், இலங்கை.' : 'Jaffna, Sri Lanka.'}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gaming-card p-6 rounded-2xl border border-slate-200 dark:border-neon-teal/20 shadow-sm text-center">
            <h4 className="font-extrabold text-xs text-slate-900 dark:text-white mb-2 uppercase tracking-wide">{lang === 'ta' ? 'தன்னார்வலர்களின் பங்களிப்பு' : 'Collaborative Contributions'}</h4>
            <p className="text-[10px] text-slate-500 max-w-xs mx-auto leading-relaxed font-semibold">
              {lang === 'ta'
                ? 'இலங்கைத் தமிழ் மாணவர்களின் நலன் கருதி இயங்கும் தன்னார்வப் பட்டதாரிகள் மற்றும் ஆசிரியர்களின் பங்களிப்புடனான கல்விச் சேவையாகும்.'
                : 'A community dedication and voluntary academic project co-managed by graduated scholars and teachers.'
              }
            </p>
          </div>
        </div>

        {/* Right 3 Cols: Interactive contact form */}
        <div className="lg:col-span-3 bg-white dark:bg-gaming-card p-6 sm:p-8 rounded-2xl border border-slate-205 dark:border-neon-purple/20 shadow-sm space-y-6">
          <div className="space-y-1.5 border-b border-slate-200 dark:border-slate-800/60 pb-4">
            <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center space-x-1.5 uppercase tracking-wide">
              <MessageSquare className="w-5 h-5 text-neon-purple" />
              <span>{lang === 'ta' ? 'உதவிக்குறிப்பு மின்னஞ்சல் படிவம்' : 'Inquiry Feedback Form'}</span>
            </h3>
            <p className="text-xs text-slate-400 font-semibold">
              {lang === 'ta' ? 'உங்களது ஆவணக் கோரிக்கைகளை நேரடியாக அனுப்பி வையுங்கள்.' : 'Submit a direct request for textbooks, papers, or technical site query details.'}
            </p>
          </div>

          {isSubmitted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-green-50 dark:bg-neon-pink/10 border border-green-200 dark:border-neon-pink/30 text-green-800 dark:text-neon-pink p-6 rounded-2xl text-center space-y-3 dark:glow-pink"
            >
              <Sparkles className="w-8 h-8 text-neon-pink mx-auto animate-bounce" />
              <h4 className="font-extrabold text-sm uppercase tracking-wider">{t.msgSuccess}</h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 max-w-sm mx-auto leading-relaxed font-semibold">
                {lang === 'ta' 
                  ? 'எமது தமிழ் மாணவர் வள மையத்தைத் தொடர்பு கொண்டமைக்கு நன்றி. விரைவில் உங்கள் மின்னஞ்சல் முகவரிக்கு பதில் தகவல் அனுப்பி வைக்கப்படும்.'
                  : 'Thank you for writing. Our backend team coordinates database revisions and will correspond shortly.'
                }
              </p>
              <button
                onClick={() => setIsSubmitted(false)}
                className="px-4 py-2 bg-slate-950 dark:bg-neon-pink text-white dark:text-slate-950 rounded-xl text-xs font-black uppercase tracking-widest transition shadow cursor-pointer hover:scale-103"
              >
                {lang === 'ta' ? 'மறுபடி அனுப்பு' : 'Write Another Message'}
              </button>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-widest">{t.nameLabel}</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={t.namePlaceholder}
                    className="w-full px-4 py-2.5 rounded-xl text-xs bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white border border-slate-250 dark:border-neon-purple/20 focus:outline-none focus:ring-2 focus:ring-neon-purple transition font-semibold"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-widest">{t.emailLabel}</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={t.emailPlaceholder}
                    className="w-full px-4 py-2.5 rounded-xl text-xs bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white border border-slate-250 dark:border-neon-purple/20 focus:outline-none focus:ring-2 focus:ring-neon-purple transition font-semibold"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-widest">{lang === 'ta' ? 'உங்கள் கருத்துரை விபரம்' : 'Your message'}</label>
                <textarea
                  required
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder={t.messagePlaceholder}
                  className="w-full px-4 py-2.5 rounded-xl text-xs bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white border border-slate-250 dark:border-neon-purple/20 focus:outline-none focus:ring-2 focus:ring-neon-purple transition font-semibold"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-slate-950 dark:bg-neon-purple hover:bg-neon-pink dark:hover:bg-neon-pink text-white dark:text-slate-950 rounded-xl text-xs font-black uppercase tracking-widest transition flex items-center justify-center space-x-2 cursor-pointer shadow-md"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{isLoading ? (lang === 'ta' ? 'அனுப்பப்படுகிறது...' : 'Sending...') : t.sendMsg}</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
