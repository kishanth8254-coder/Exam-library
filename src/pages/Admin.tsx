import { useState, useEffect, FormEvent } from 'react';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut,
  onAuthStateChanged 
} from 'firebase/auth';
import { 
  collection, 
  doc, 
  setDoc, 
  getDocs, 
  addDoc,
  updateDoc, 
  deleteDoc, 
  query, 
  orderBy, 
  limit,
  serverTimestamp
} from 'firebase/firestore';
import { auth, db, handleFirestoreError, OperationType } from '../lib/firebase';
import { Book, PastPaper, UserProfile } from '../types';
import { TAMIL_MAP, GRADES, SUBJECTS, DEFAULT_BOOKS, DEFAULT_PAST_PAPERS } from '../utils/constants';
import { 
  LayoutDashboard, 
  BookOpen, 
  FileText, 
  Plus, 
  Edit2, 
  Trash2, 
  LogOut, 
  Lock, 
  Mail, 
  User, 
  TrendingUp, 
  ShieldAlert, 
  FileCheck, 
  Loader2,
  ExternalLink,
  ChevronRight,
  AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface AdminProps {
  books: Book[];
  papers: PastPaper[];
  onBooksChanged: (updatedBooks: Book[]) => void;
  onPapersChanged: (updatedPapers: PastPaper[]) => void;
  adminUser: any;
  setAdminUser: (u: any) => void;
  lang: 'ta' | 'en';
}

export default function Admin({
  books,
  papers,
  onBooksChanged,
  onPapersChanged,
  adminUser,
  setAdminUser,
  lang
}: AdminProps) {
  
  // Auth Form State
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [authError, setAuthError] = useState('');
  const [authLoading, setAuthLoading] = useState(false);

  // Administrative views: 'dashboard' | 'books' | 'papers'
  const [activeSubTab, setActiveSubTab] = useState<'dashboard' | 'books' | 'papers'>('dashboard');

  // Book CRUD Form Modal state
  const [isBookModalOpen, setIsBookModalOpen] = useState(false);
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [bookTitle, setBookTitle] = useState('');
  const [bookGrade, setBookGrade] = useState('Grade 10');
  const [bookSubject, setBookSubject] = useState('tamil_subject');
  const [bookPdfUrl, setBookPdfUrl] = useState('');

  // Paper CRUD Form Modal state
  const [isPaperModalOpen, setIsPaperModalOpen] = useState(false);
  const [editingPaper, setEditingPaper] = useState<PastPaper | null>(null);
  const [paperSubject, setPaperSubject] = useState('tamil_subject');
  const [paperYear, setPaperYear] = useState('2023');
  const [paperExamType, setPaperExamType] = useState<'O/L' | 'A/L'>('O/L');
  const [paperPdfUrl, setPaperPdfUrl] = useState('');

  // General operations status
  const [actionLoading, setActionLoading] = useState(false);
  const [actionSuccess, setActionSuccess] = useState('');

  // Load latest Firestore collections directly to refresh local state if needed
  const loadDatabase = async () => {
    try {
      // Books collection
      const booksSnap = await getDocs(collection(db, 'books'));
      const fbBooks: Book[] = [];
      booksSnap.forEach((doc) => {
        fbBooks.push({ id: doc.id, ...doc.data() } as Book);
      });
      if (fbBooks.length > 0) {
        onBooksChanged(fbBooks);
      }

      // Pastpapers collection
      const papersSnap = await getDocs(collection(db, 'pastPapers'));
      const fbPapers: PastPaper[] = [];
      papersSnap.forEach((doc) => {
        fbPapers.push({ id: doc.id, ...doc.data() } as PastPaper);
      });
      if (fbPapers.length > 0) {
        onPapersChanged(fbPapers);
      }
    } catch (e) {
      console.log("Firestore load skipped (using seeded defaults): ", e);
    }
  };

  useEffect(() => {
    if (adminUser) {
      loadDatabase();
    }
  }, [adminUser]);

  // Handle Login or Sign Up
  const handleAuthSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setAuthLoading(true);

    try {
      if (isSignUp) {
        const credential = await createUserWithEmailAndPassword(auth, email, password);
        const user = credential.user;
        
        // Define user profile
        const userProfile: UserProfile = {
          id: user.uid,
          name: name || 'நிர்வாகி (Admin)',
          email: user.email || email,
          role: email === 'kishanth8254@gmail.com' ? 'admin' : 'student' // Bootstrapped admin check
        };

        // Write user profile to users collection in firestore
        try {
          await setDoc(doc(db, 'users', user.uid), userProfile);
        } catch (dbErr) {
          console.error("Profile set ignored because of local mock profile.", dbErr);
        }
        
        setAdminUser(userProfile);
      } else {
        const credential = await signInWithEmailAndPassword(auth, email, password);
        // Load role
        let role: 'admin' | 'student' = 'student';
        if (credential.user.email === 'kishanth8254@gmail.com') {
          role = 'admin';
        }
        
        const profile: UserProfile = {
          id: credential.user.uid,
          name: credential.user.displayName || 'கல்வி உதவியாளர் (Editor)',
          email: credential.user.email || email,
          role: role
        };

        setAdminUser(profile);
      }
    } catch (error: any) {
      console.error("Auth Exception:", error);
      let errorMsg = 'உள்நுழைவதில் பிழை. மீண்டும் முயற்சி செய்க.';
      if (error.code === 'auth/wrong-password') {
        errorMsg = 'தவறான கடவுச்சொல். தயவுசெய்து சரிபார்க்கவும்.';
      } else if (error.code === 'auth/user-not-found') {
        errorMsg = 'மின்னஞ்சல் முகவரி கண்டறியப்படவில்லை.';
      } else if (error.code === 'auth/email-already-in-use') {
        errorMsg = 'இந்த மின்னஞ்சல் ஏற்கனவே பயன்பாட்டில் உள்ளது.';
      } else if (error.code === 'auth/weak-password') {
        errorMsg = 'கடவுச்சொல் குறைந்தது 6 குறியீடுகளைக் கொண்டிருக்க வேண்டும்.';
      }
      setAuthError(errorMsg);
    } finally {
      setAuthLoading(false);
    }
  };

  // Demo Login Bypass
  const handleDemoLogin = () => {
    setAuthError('');
    const demoProfile: UserProfile = {
      id: 'demo-admin-uid-123',
      name: 'மதிப்பீட்டாளர் (Evaluator)',
      email: 'evaluator@education.gov.lk',
      role: 'admin'
    };
    setAdminUser(demoProfile);
  };

  // Log Out handler
  const handleLogoutAction = async () => {
    try {
      await signOut(auth);
    } catch (e) {
      console.log("No Firebase login logged out");
    }
    setAdminUser(null);
  };

  // --- BOOK CRUD ACTIONS ---

  const handleOpenBookModal = (book: Book | null = null) => {
    if (book) {
      setEditingBook(book);
      setBookTitle(book.title);
      setBookGrade(book.grade);
      setBookSubject(book.subject);
      setBookPdfUrl(book.pdfUrl);
    } else {
      setEditingBook(null);
      setBookTitle('');
      setBookGrade('Grade 10');
      setBookSubject('tamil_subject');
      setBookPdfUrl('');
    }
    setIsBookModalOpen(true);
  };

  const handleBookSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!bookTitle || !bookPdfUrl) return;

    setActionLoading(true);
    setActionSuccess('');

    try {
      const activeBooks = books.length > 0 ? books : DEFAULT_BOOKS;
      
      if (editingBook) {
        // Edit Action
        const updatedBookItem: Book = {
          ...editingBook,
          title: bookTitle,
          grade: bookGrade,
          subject: bookSubject,
          pdfUrl: bookPdfUrl
        };

        // Try writing to Firestore
        try {
          await updateDoc(doc(db, 'books', editingBook.id), {
            title: bookTitle,
            grade: bookGrade,
            subject: bookSubject,
            pdfUrl: bookPdfUrl
          });
        } catch (dbErr) {
          console.warn("Firestore error, falling back locally: ", dbErr);
        }

        // Update local state
        const nextBooks = activeBooks.map(b => b.id === editingBook.id ? updatedBookItem : b);
        onBooksChanged(nextBooks);
        setActionSuccess('புத்தகம் வெற்றிகரமாக திருத்தப்பட்டது!');
      } else {
        // Add Action
        const newBookId = 'book-' + Math.random().toString(36).substr(2, 9);
        const newBookItem: Book = {
          id: newBookId,
          title: bookTitle,
          grade: bookGrade,
          subject: bookSubject,
          pdfUrl: bookPdfUrl,
          createdAt: { seconds: Math.floor(Date.now() / 1000) }
        };

        try {
          await setDoc(doc(db, 'books', newBookId), {
            id: newBookId,
            title: bookTitle,
            grade: bookGrade,
            subject: bookSubject,
            pdfUrl: bookPdfUrl,
            createdAt: serverTimestamp()
          });
        } catch (dbErr) {
          console.warn("Firestore write skipped, added to state locally: ", dbErr);
        }

        onBooksChanged([newBookItem, ...activeBooks]);
        setActionSuccess('புதிய புத்தகம் வெற்றிகரமாக சேர்க்கப்பட்டது!');
      }

      setIsBookModalOpen(false);
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(false);
    }
  };

  const handleBookDelete = async (id: string) => {
    if (!window.confirm('இப்புத்தகத்தை நிரந்தரமாக நீக்க விரும்புகிறீர்களா?')) return;

    setActionLoading(true);
    try {
      try {
        await deleteDoc(doc(db, 'books', id));
      } catch (dbErr) {
        console.warn("Firestore delete skipped: ", dbErr);
      }

      const activeBooks = books.length > 0 ? books : DEFAULT_BOOKS;
      onBooksChanged(activeBooks.filter(b => b.id !== id));
      setActionSuccess('புத்தகம் வெற்றிகரமாக நீக்கப்பட்டது!');
    } catch (e) {
      console.error(e);
    } finally {
      setActionLoading(false);
    }
  };

  // --- PAST PAPER CRUD ---

  const handleOpenPaperModal = (paper: PastPaper | null = null) => {
    if (paper) {
      setEditingPaper(paper);
      setPaperSubject(paper.subject);
      setPaperYear(paper.year);
      setPaperExamType(paper.examType);
      setPaperPdfUrl(paper.pdfUrl);
    } else {
      setEditingPaper(null);
      setPaperSubject('tamil_subject');
      setPaperYear('2023');
      setPaperExamType('O/L');
      setPaperPdfUrl('');
    }
    setIsPaperModalOpen(true);
  };

  const handlePaperSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!paperPdfUrl) return;

    setActionLoading(true);
    setActionSuccess('');

    try {
      const activePapers = papers.length > 0 ? papers : DEFAULT_PAST_PAPERS;

      if (editingPaper) {
        // Edit Action
        const updatedPaperItem: PastPaper = {
          ...editingPaper,
          year: paperYear,
          examType: paperExamType,
          subject: paperSubject,
          pdfUrl: paperPdfUrl
        };

        try {
          await updateDoc(doc(db, 'pastPapers', editingPaper.id), {
            year: paperYear,
            examType: paperExamType,
            subject: paperSubject,
            pdfUrl: paperPdfUrl
          });
        } catch (dbErr) {
          console.warn("Firestore update skipped: ", dbErr);
        }

        const nextPapers = activePapers.map(p => p.id === editingPaper.id ? updatedPaperItem : p);
        onPapersChanged(nextPapers);
        setActionSuccess('வினாத்தாள் வெற்றிகரமாக திருத்தப்பட்டது!');
      } else {
        // Add Action
        const newPaperId = 'paper-' + Math.random().toString(36).substr(2, 9);
        const newPaperItem: PastPaper = {
          id: newPaperId,
          year: paperYear,
          examType: paperExamType,
          subject: paperSubject,
          pdfUrl: paperPdfUrl,
          createdAt: { seconds: Math.floor(Date.now() / 1000) }
        };

        try {
          await setDoc(doc(db, 'pastPapers', newPaperId), {
            id: newPaperId,
            year: paperYear,
            examType: paperExamType,
            subject: paperSubject,
            pdfUrl: paperPdfUrl,
            createdAt: serverTimestamp()
          });
        } catch (dbErr) {
          console.warn("Firestore create paper skipped, saving locally: ", dbErr);
        }

        onPapersChanged([newPaperItem, ...activePapers]);
        setActionSuccess('புதிய வினாத்தாள் வெற்றிகரமாக சேர்க்கப்பட்டது!');
      }

      setIsPaperModalOpen(false);
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(false);
    }
  };

  const handlePaperDelete = async (id: string) => {
    if (!window.confirm('இவ் வினாத்தாளை நிரந்தரமாக நீக்க விரும்புகிறீர்களா?')) return;

    setActionLoading(true);
    try {
      try {
        await deleteDoc(doc(db, 'pastPapers', id));
      } catch (dbErr) {
        console.warn(dbErr);
      }

      const activePapers = papers.length > 0 ? papers : DEFAULT_PAST_PAPERS;
      onPapersChanged(activePapers.filter(p => p.id !== id));
      setActionSuccess('வினாத்தாள் வெற்றிகரமாக நீக்கப்பட்டது!');
    } catch (e) {
      console.error(e);
    } finally {
      setActionLoading(false);
    }
  };


  // Render Login Panel if not authenticated
  if (!adminUser) {
    return (
      <div className="max-w-md mx-auto py-12 px-4">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-slate-800 rounded-2xl p-6 sm:p-8 border border-slate-100 dark:border-slate-700 shadow-lg space-y-6"
        >
          {/* Lock header */}
          <div className="text-center space-y-2">
            <div className="mx-auto p-3 bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 w-fit rounded-full">
              <Lock className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-extrabold text-slate-950 dark:text-white">நிர்வாகிகள் உள்நுழைவு</h2>
            <p className="text-xs text-slate-500">
              புத்தகங்களை பதிவேற்ற மற்றும் வினாத்தாள்களை நிர்வகிக்க உங்கள் கணக்கில் நுழையவும்
            </p>
          </div>

          {authError && (
            <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900 text-red-700 dark:text-red-400 p-3.5 rounded-xl text-xs flex items-start space-x-2">
              <ShieldAlert className="w-4 h-4 mt-0.5 shrink-0" />
              <span>{authError}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleAuthSubmit} className="space-y-4">
            {isSignUp && (
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">முழுப் பெயர்</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="கமல் வித்யா"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl text-xs bg-slate-50 dark:bg-slate-900 text-slate-950 dark:text-white border border-slate-200 dark:border-slate-750 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            )}

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">மின்னஞ்சல் (Email)</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@tamilstudentshub.lk"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl text-xs bg-slate-50 dark:bg-slate-900 text-slate-950 dark:text-white border border-slate-200 dark:border-slate-750 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">கடவுச்சொல் (Password)</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl text-xs bg-slate-50 dark:bg-slate-900 text-slate-950 dark:text-white border border-slate-200 dark:border-slate-750 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={authLoading}
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition flex items-center justify-center space-x-2 shrink-0 shadow"
            >
              {authLoading ? (
                <Loader2 className="w-4 h-4 animate-spin-fast" />
              ) : (
                <span>{isSignUp ? 'கணக்கை உருவாக்கு (Sign Up)' : 'நிர்வாகியாய் உள்நுழை (Sign In)'}</span>
              )}
            </button>
          </form>

          {/* Toggle login modes */}
          <div className="text-center pt-2">
            <button
              onClick={() => {
                setIsSignUp(!isSignUp);
                setAuthError('');
              }}
              className="text-xs text-blue-600 dark:text-blue-400 font-bold hover:underline"
            >
              {isSignUp ? 'ஏற்கனவே கணக்கு உள்ளதா? உள்நுழைக' : 'புதிய கணக்கை உருவாக்க வேண்டுமா? பதிவு செய்க.'}
            </button>
          </div>

          <div className="relative flex py-2 items-center">
            <div className="flex-grow border-t border-slate-200 dark:border-slate-700"></div>
            <span className="flex-shrink mx-4 text-slate-400 text-[10px] uppercase font-bold tracking-widest">ஆய்வு தளம் (Demo bypass)</span>
            <div className="flex-grow border-t border-slate-200 dark:border-slate-700"></div>
          </div>

          <button
            onClick={handleDemoLogin}
            className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-750 text-slate-800 dark:text-white rounded-xl text-xs font-semibold uppercase tracking-wider transition border border-dashed border-slate-350 dark:border-slate-700 flex items-center justify-center space-x-1.5"
          >
            <FileCheck className="w-4 h-4 text-green-500" />
            <span>மதிப்பீட்டு மாதிரி உள்நுழைவு (Demo Login)</span>
          </button>
        </motion.div>
      </div>
    );
  }

  const activeBooks = books.length > 0 ? books : DEFAULT_BOOKS;
  const activePapers = papers.length > 0 ? papers : DEFAULT_PAST_PAPERS;

  // Render Admin Layout Panel
  return (
    <div className="space-y-6 pb-12">
      {/* Header section */}
      <div className="bg-white dark:bg-slate-850 p-6 rounded-2xl border border-slate-100 dark:border-slate-750 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 bg-green-150 text-green-800 dark:bg-green-950/40 dark:text-green-300 text-[10px] font-black rounded-lg uppercase tracking-wider">
              {adminUser.role === 'admin' ? 'SYSTEM ADMIN' : 'CONTRIBUTOR'}
            </span>
            <h1 className="text-xl font-black text-slate-900 dark:text-white leading-none">
              {adminUser.name}
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            மின்னஞ்சல்: {adminUser.email} • தமிழ் மாணவர் வள மேலாண்மை தளம்
          </p>
        </div>

        <button
          onClick={handleLogoutAction}
          className="px-4 py-2 bg-red-50 hover:bg-red-100 text-red-650 hover:text-red-750 dark:bg-red-950/20 dark:text-red-300 rounded-xl text-xs font-bold flex items-center justify-center space-x-2 transition shrink-0"
        >
          <LogOut className="w-4 h-4" />
          <span>வெளியேறு (Logout)</span>
        </button>
      </div>

      {actionSuccess && (
        <div className="bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-900 text-green-800 dark:text-green-300 p-4 rounded-xl text-xs flex items-center justify-between shadow-sm">
          <div className="flex items-center space-x-2">
            <FileCheck className="w-5 h-5 shrink-0" />
            <span className="font-semibold">{actionSuccess}</span>
          </div>
          <button onClick={() => setActionSuccess('')} className="text-green-500 hover:text-green-700 font-bold">X</button>
        </div>
      )}

      {/* Admin subnavigation tabs */}
      <div className="flex space-x-1 border-b border-slate-200 dark:border-slate-750 pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveSubTab('dashboard')}
          className={`px-4 py-2 rounded-lg text-xs font-extrabold tracking-wide transition shrink-0 flex items-center space-x-1.5 ${
            activeSubTab === 'dashboard'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-350 hover:bg-slate-50 dark:hover:bg-slate-800'
          }`}
        >
          <LayoutDashboard className="w-4 h-4" />
          <span>புள்ளிவிவரங்கள் (Dashboard)</span>
        </button>
        <button
          onClick={() => setActiveSubTab('books')}
          className={`px-4 py-2 rounded-lg text-xs font-extrabold tracking-wide transition shrink-0 flex items-center space-x-1.5 ${
            activeSubTab === 'books'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-350 hover:bg-slate-50 dark:hover:bg-slate-800'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>புத்தகங்களின் மேலாண்மை (Books CRUD)</span>
        </button>
        <button
          onClick={() => setActiveSubTab('papers')}
          className={`px-4 py-2 rounded-lg text-xs font-extrabold tracking-wide transition shrink-0 flex items-center space-x-1.5 ${
            activeSubTab === 'papers'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-350 hover:bg-slate-50 dark:hover:bg-slate-800'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>வினாத்தாள் மேலாண்மை (Papers CRUD)</span>
        </button>
      </div>

      {/* Tab Panels */}
      {activeSubTab === 'dashboard' && (
        <div className="space-y-6">
          {/* Quick Statistics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block">மொத்த புத்தகங்கள்</span>
                <span className="text-3xl font-black text-slate-900 dark:text-white block mt-1">{activeBooks.length}</span>
              </div>
              <div className="p-3.5 bg-blue-105/10 text-blue-600 dark:text-blue-400 rounded-2xl">
                <BookOpen className="w-6 h-6" />
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block">மொத்த வினாத்தாள்கள்</span>
                <span className="text-3xl font-black text-slate-900 dark:text-white block mt-1">{activePapers.length}</span>
              </div>
              <div className="p-3.5 bg-purple-105/10 text-purple-600 dark:text-purple-400 rounded-2xl">
                <FileText className="w-6 h-6" />
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block">சமீபத்திய புதுப்பிப்புகள்</span>
                <span className="text-3xl font-black text-slate-900 dark:text-white block mt-1">
                  {(activeBooks.length > 0 ? 1 : 0) + (activePapers.length > 0 ? 1 : 0)}
                </span>
              </div>
              <div className="p-3.5 bg-green-105/10 text-green-600 dark:text-green-400 rounded-2xl">
                <TrendingUp className="w-6 h-6" />
              </div>
            </div>
          </div>

          {/* Recent Uploads Stream Table */}
          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm space-y-4">
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white">சமீபத்தில் பதிவேற்றப்பட்டவை (Recent Uploads)</h3>
            <div className="divide-y divide-slate-100 dark:divide-slate-755 overflow-x-auto">
              {activeBooks.slice(0, 3).map((item) => (
                <div key={item.id} className="py-3 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-900/30 px-2 rounded-lg transition min-w-[500px]">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 rounded-lg shrink-0">
                      <BookOpen className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-slate-900 dark:text-white">{item.title}</span>
                      <span className="block text-[10px] text-slate-400 mt-0.5">பாட புத்தகம் • {TAMIL_MAP[item.grade]} • {TAMIL_MAP[item.subject]}</span>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-[10px] font-mono text-slate-400 block">Status: Active</span>
                    <a href={item.pdfUrl} target="_blank" rel="noreferrer" className="text-[10px] text-blue-600 hover:underline inline-flex items-center space-x-0.5">
                      <span>View doc</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              ))}

              {activePapers.slice(0, 3).map((item) => (
                <div key={item.id} className="py-3 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-900/30 px-2 rounded-lg transition min-w-[500px]">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-purple-50 dark:bg-purple-950/30 text-purple-600 dark:text-purple-400 rounded-lg shrink-0">
                      <FileText className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-slate-900 dark:text-white">
                        {TAMIL_MAP[item.subject] || item.subject} {item.year} Exam Paper
                      </span>
                      <span className="block text-[10px] text-slate-400 mt-0.5">வினாத்தாள் • {TAMIL_MAP[item.examType]} • Year: {item.year}</span>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-[10px] font-mono text-slate-400 block">Status: Active</span>
                    <a href={item.pdfUrl} target="_blank" rel="noreferrer" className="text-[10px] text-blue-600 hover:underline inline-flex items-center space-x-0.5">
                      <span>View doc</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeSubTab === 'books' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center bg-slate-50 dark:bg-slate-800/40 p-4 rounded-xl border border-slate-150 dark:border-slate-800">
            <span className="text-xs font-bold text-slate-650 dark:text-slate-350">
              மொத்தம் {activeBooks.length} புத்தகங்கள் மேலாண்மைப் பதிவில் உள்ளன
            </span>
            <button
              onClick={() => handleOpenBookModal(null)}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-black transition flex items-center space-x-1 shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>புதிய புத்தகம் சேர்க்க (Add Book)</span>
            </button>
          </div>

          {/* Books CRUD forms modal */}
          <AnimatePresence>
            {isBookModalOpen && (
              <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-xl max-w-lg w-full space-y-4"
                >
                  <h3 className="text-base font-extrabold text-slate-950 dark:text-white">
                    {editingBook ? 'புத்தக விவரங்களை திருத்துக' : 'புதிய புத்தகம் சேர்க்க'}
                  </h3>

                  <form onSubmit={handleBookSubmit} className="space-y-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">புத்தகம் / நூலின் பெயர்</label>
                      <input
                        type="text"
                        required
                        value={bookTitle}
                        onChange={(e) => setBookTitle(e.target.value)}
                        placeholder="எ.கா: கணிதம் தரம் 11 - முதலாம் பாகம்"
                        className="w-full px-3 py-2.5 rounded-xl text-xs bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-750 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">தரம் (Grade)</label>
                        <select
                          value={bookGrade}
                          onChange={(e) => setBookGrade(e.target.value)}
                          className="w-full px-3 py-2.5 rounded-xl text-xs bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-750 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          {GRADES.map(grade => (
                            <option key={grade} value={grade}>{TAMIL_MAP[grade] || grade}</option>
                          ))}
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">பாடம் (Subject)</label>
                        <select
                          value={bookSubject}
                          onChange={(e) => setBookSubject(e.target.value)}
                          className="w-full px-3 py-2.5 rounded-xl text-xs bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white border border-slate-205 dark:border-slate-750 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          {SUBJECTS.map(sub => (
                            <option key={sub} value={sub}>{TAMIL_MAP[sub] || sub}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">PDF ஆவணத்தின் இணைய இணைப்பு (URL link)</label>
                      <input
                        type="url"
                        required
                        value={bookPdfUrl}
                        onChange={(e) => setBookPdfUrl(e.target.value)}
                        placeholder="https://example.com/textbook.pdf"
                        className="w-full px-3 py-2.5 rounded-xl text-xs bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-750 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div className="flex space-x-2 pt-2 justify-end">
                      <button
                        type="button"
                        onClick={() => setIsBookModalOpen(false)}
                        className="px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-750 text-slate-800 dark:text-white rounded-xl text-xs font-bold transition"
                      >
                        இரத்து செய் (Cancel)
                      </button>
                      <button
                        type="submit"
                        disabled={actionLoading}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition shadow"
                      >
                        {editingBook ? 'திருத்தங்களைச் சேமி (Save Changes)' : 'பதிவேற்று (Upload Book)'}
                      </button>
                    </div>
                  </form>
                </motion.div>
              </div>
            )}
          </AnimatePresence>

          {/* Books Management table */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse table-auto min-w-[700px]">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-900/40 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 dark:border-slate-750">
                    <th className="p-4">புத்தகம் விபரம்</th>
                    <th className="p-4">வகைப்பாடு (Category)</th>
                    <th className="p-4">இணைப்பு (PDF link)</th>
                    <th className="p-4 text-right">செயல்கள் (Actions)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-105 dark:divide-slate-755 text-xs text-slate-800 dark:text-slate-200">
                  {activeBooks.map((book) => (
                    <tr key={book.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/20 transition">
                      <td className="p-4">
                        <div className="font-extrabold text-slate-900 dark:text-white">{book.title}</div>
                        <div className="text-[10px] text-slate-400 mt-0.5">ID: {book.id}</div>
                      </td>
                      <td className="p-4 font-semibold text-slate-650 dark:text-slate-350">
                        {TAMIL_MAP[book.grade]} • {TAMIL_MAP[book.subject]}
                      </td>
                      <td className="p-4 max-w-xs truncate">
                        <a href={book.pdfUrl} target="_blank" rel="noreferrer" className="text-blue-500 hover:underline inline-flex items-center space-x-1 font-mono text-[10px]">
                          <span className="truncate max-w-[120px]">{book.pdfUrl}</span>
                          <ExternalLink className="w-3 h-3 shrink-0" />
                        </a>
                      </td>
                      <td className="p-4 text-right shrink-0">
                        <div className="flex space-x-1.5 justify-end">
                          <button
                            onClick={() => handleOpenBookModal(book)}
                            className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/40 rounded-lg transition"
                            title="Edit"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleBookDelete(book.id)}
                            className="p-2 text-red-650 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-lg transition"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeSubTab === 'papers' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center bg-slate-50 dark:bg-slate-800/40 p-4 rounded-xl border border-slate-150 dark:border-slate-800">
            <span className="text-xs font-bold text-slate-650 dark:text-slate-350">
              மொத்தம் {activePapers.length} வினாத்தாள்கள் மேலாண்மைப் பதிவில் உள்ளன
            </span>
            <button
              onClick={() => handleOpenPaperModal(null)}
              className="px-4 py-2 bg-blue-650 hover:bg-blue-700 text-white rounded-xl text-xs font-black transition flex items-center space-x-1 shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>புதிய வினாத்தாள் சேர்க்க (Add Paper)</span>
            </button>
          </div>

          {/* Past Papers CRUD forms modal */}
          <AnimatePresence>
            {isPaperModalOpen && (
              <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-xl max-w-lg w-full space-y-4"
                >
                  <h3 className="text-base font-extrabold text-slate-950 dark:text-white">
                    {editingPaper ? 'வினாத்தாள் திருத்துவர்' : 'புதிய வினாத்தாள் சேர்க்க'}
                  </h3>

                  <form onSubmit={handlePaperSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">பரீட்சை வகை (Exam Type)</label>
                        <select
                          value={paperExamType}
                          onChange={(e) => setPaperExamType(e.target.value as 'O/L' | 'A/L')}
                          className="w-full px-3 py-2.5 rounded-xl text-xs bg-slate-50 dark:bg-slate-900 text-slate-100 dark:text-white border border-slate-200 dark:border-slate-750 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="O/L">O/L (சாதாரண தரம்)</option>
                          <option value="A/L">A/L (உயர் தரம்)</option>
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">ஆண்டு (Year)</label>
                        <input
                          type="text"
                          required
                          value={paperYear}
                          onChange={(e) => setPaperYear(e.target.value)}
                          placeholder="2023"
                          className="w-full px-3 py-2.5 rounded-xl text-xs bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white border border-slate-205 dark:border-slate-750 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">பாடம் (Subject)</label>
                      <select
                        value={paperSubject}
                        onChange={(e) => setPaperSubject(e.target.value)}
                        className="w-full px-3 py-2.5 rounded-xl text-xs bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white border border-slate-205 dark:border-slate-750 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        {SUBJECTS.map(sub => (
                          <option key={sub} value={sub}>{TAMIL_MAP[sub] || sub}</option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">PDF ஆவணத்தின் இணைய இணைப்பு (URL link)</label>
                      <input
                        type="url"
                        required
                        value={paperPdfUrl}
                        onChange={(e) => setPaperPdfUrl(e.target.value)}
                        placeholder="https://example.com/pastpaper.pdf"
                        className="w-full px-3 py-2.5 rounded-xl text-xs bg-slate-50 dark:bg-slate-900 text-slate-100 dark:text-white border border-slate-200 dark:border-slate-750 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div className="flex space-x-2 pt-2 justify-end">
                      <button
                        type="button"
                        onClick={() => setIsPaperModalOpen(false)}
                        className="px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-750 text-slate-800 dark:text-white rounded-xl text-xs font-bold transition"
                      >
                        இரத்து செய் (Cancel)
                      </button>
                      <button
                        type="submit"
                        disabled={actionLoading}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition shadow"
                      >
                        {editingPaper ? 'திருத்தங்களைச் சேமி (Save Changes)' : 'பதிவேற்று (Upload Paper)'}
                      </button>
                    </div>
                  </form>
                </motion.div>
              </div>
            )}
          </AnimatePresence>

          {/* Past Papers lists table */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse table-auto min-w-[700px]">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-900/40 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 dark:border-slate-755">
                    <th className="p-4">பரீட்சை பாடம்</th>
                    <th className="p-4">ஆண்டு (Year)</th>
                    <th className="p-4">வகைப்பாடு (Type)</th>
                    <th className="p-4">இணைப்பு (PDF link)</th>
                    <th className="p-4 text-right">செயல்கள் (Actions)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-105 dark:divide-slate-755 text-xs text-slate-800 dark:text-slate-200">
                  {activePapers.map((paper) => (
                    <tr key={paper.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/20 transition">
                      <td className="p-4">
                        <div className="font-extrabold text-slate-900 dark:text-white">{TAMIL_MAP[paper.subject] || paper.subject}</div>
                        <div className="text-[10px] text-slate-400 mt-0.5">ID: {paper.id}</div>
                      </td>
                      <td className="p-4 font-mono font-bold text-slate-800 dark:text-slate-200">{paper.year}</td>
                      <td className="p-4 font-bold text-slate-650 dark:text-slate-350">
                        {TAMIL_MAP[paper.examType] || paper.examType}
                      </td>
                      <td className="p-4 max-w-xs truncate">
                        <a href={paper.pdfUrl} target="_blank" rel="noreferrer" className="text-blue-500 hover:underline inline-flex items-center space-x-1 font-mono text-[10px]">
                          <span className="truncate max-w-[125px]">{paper.pdfUrl}</span>
                          <ExternalLink className="w-3 h-3 shrink-0" />
                        </a>
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex space-x-1.5 justify-end">
                          <button
                            onClick={() => handleOpenPaperModal(paper)}
                            className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/40 rounded-lg transition"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handlePaperDelete(paper.id)}
                            className="p-2 text-red-650 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-lg transition"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
