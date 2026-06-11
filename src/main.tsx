import { db } from './lib/firebase';
import { collection, getDocs, doc, getDocFromServer } from 'firebase/firestore';
import './index.css';

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

// Interfaces identical to App levels
interface Book {
  id: string;
  title: string;
  grade: string;
  subject: string;
  pdfUrl: string;
}

interface PastPaper {
  id: string;
  year: string;
  examType: 'O/L' | 'A/L';
  subject: string;
  pdfUrl: string;
}

// Standard data fallback structures
const GRADES = [
  'Grade 6', 'Grade 7', 'Grade 8', 'Grade 9', 'Grade 10', 'Grade 11', 'Grade 12', 'Grade 13'
];

const TAMIL_MAP: Record<string, string> = {
  'Grade 6': 'தரம் 6',
  'Grade 7': 'தரம் 7',
  'Grade 8': 'தரம் 8',
  'Grade 9': 'தரம் 9',
  'Grade 10': 'தரம் 10',
  'Grade 11': 'தரம் 11 (O/L)',
  'Grade 12': 'தரம் 12',
  'Grade 13': 'தரம் 13 (A/L)',
  'All': 'அனைத்தும்',
  'O/L': 'சாதாரண தரம் (O/L)',
  'A/L': 'உயர் தரம் (A/L)',
  'tamil_subject': 'தமிழ் மொழியும் இலக்கியமும்',
  'maths_subject': 'கணிதம்',
  'science_subject': 'விஞ்ஞானம்',
  'history_subject': 'வரலாறு',
  'geo_subject': 'புவியியல்',
  'ict_subject': 'தகவல் தொழில்நுட்பம் (ICT)',
  'comb_maths': 'இணைந்த கணிதம்',
  'physics_subject': 'பௌதிகவியல்',
  'chem_subject': 'இரசாயனவியல்',
  'bio_subject': 'உயிரியல்',
  'commerce_subject': 'வர்த்தகம்',
  'econ_subject': 'பொருளியல்',
  'acc_subject': 'கணக்கியல்'
};

const DEFAULT_BOOKS: Book[] = [
  { id: 'book-math-11', title: 'விஞ்ஞானம் தரம் 11 - முதலாம் பாகம்', grade: 'Grade 11', subject: 'science_subject', pdfUrl: 'http://www.nie.lk/pdffiles/tg/tGr11tg%20Science%20I.pdf' },
  { id: 'book-math-10', title: 'கணிதம் தரம் 10 - முதலாம் பாகம்', grade: 'Grade 10', subject: 'maths_subject', pdfUrl: 'http://www.nie.lk/pdffiles/tg/tGr10tg%20Maths%20I.pdf' },
  { id: 'book-tamil-11', title: 'தமிழ் மொழியும் இலக்கியமும் தரம் 11', grade: 'Grade 11', subject: 'tamil_subject', pdfUrl: 'http://www.nie.lk/pdffiles/tg/tGr11tg%2520Tamil.pdf' },
  { id: 'book-ict-10', title: 'தொடர்பாடல் தொழில்நுட்பம் தரம் 10', grade: 'Grade 10', subject: 'ict_subject', pdfUrl: 'http://www.nie.lk/pdffiles/tg/tGr10tg%20ICT.pdf' },
  { id: 'book-comb-12', title: 'Combined Mathematics Grade 12', grade: 'Grade 12', subject: 'comb_maths', pdfUrl: 'http://www.nie.lk/pdffiles/tg/tGr12tg%20CombinedMaths%20I.pdf' },
  { id: 'book-physics-13', title: 'பௌதிகவியல் தரம் 13 - அலகு 4,5', grade: 'Grade 13', subject: 'physics_subject', pdfUrl: 'http://www.nie.lk/pdffiles/tg/tGr13tg%20Physics.pdf' }
];

const DEFAULT_PAST_PAPERS: PastPaper[] = [
  { id: 'paper-math-11-2023', year: '2023', examType: 'O/L', subject: 'maths_subject', pdfUrl: 'https://pastpapers.wiki/wp-content/uploads/2024/01/2023-OL-Mathematics-Paper-Tamil-Medium.pdf' },
  { id: 'paper-science-11-2023', year: '2023', examType: 'O/L', subject: 'science_subject', pdfUrl: 'https://pastpapers.wiki/wp-content/uploads/2024/01/2023-OL-Science-Paper-Tamil-Medium.pdf' },
  { id: 'paper-comb-13-2023', year: '2023', examType: 'A/L', subject: 'comb_maths', pdfUrl: 'https://pastpapers.wiki/wp-content/uploads/2023/12/2023-AL-Combined-Maths-Paper-Tamil-Medium.pdf' },
  { id: 'paper-physics-13-2022', year: '2022', examType: 'A/L', subject: 'physics_subject', pdfUrl: 'https://pastpapers.wiki/wp-content/uploads/2023/02/2022-AL-Physics-Paper-Tamil-Medium.pdf' },
  { id: 'paper-chem-13-2022', year: '2022', examType: 'A/L', subject: 'chem_subject', pdfUrl: 'https://pastpapers.wiki/wp-content/uploads/2023/02/2022-AL-Chemistry-Paper-Tamil-Medium.pdf' }
];

// Translations dictionary
const TRANSLATIONS = {
  ta: {
    home: 'முகப்பு',
    books: 'பாடப்புத்தகங்கள்',
    papers: 'கடந்தகால வினாத்தாள்கள்',
    about: 'எங்களைப் பற்றி',
    contact: 'தொடர்புகளுக்கு',
    freeEducationalPool: 'இலவச கற்றல் தளம்',
    heroTitle: 'தமிழ் மாணவர்களுக்கான',
    heroTitleAccent: 'அனைத்து கற்றல் வளங்களும்',
    heroTitleSuffix: 'ஒரே இடத்தில்!',
    heroDesc: 'பாடசாலைத் தரம் 6 முதல் உயர்தர (A/L) மாணவர்களுக்கான பாடப்புத்தகங்கள், மார்க்கிங் ஸ்கீம்கள் மற்றும் கடந்தகால வினாத்தாள்களை இலவசமாக இலகுவில் பதிவிறக்கம் செய்யுங்கள்.',
    searchPlaceholder: 'வினாத்தாள்கள், பாடப்புத்தகங்கள் அல்லது பாடங்களை தேடுக...',
    searchBtn: 'தேடுக',
    allTextbooks: 'அனைத்து பாடப்புத்தகங்கள்',
    allTextbooksDesc: 'கல்வி வெளியீட்டுத் திணைக்களத்தின் தரம் 6 தொடக்கம் உயர்தரம் வரையிலான தமிழ்மொழி மூலப் பாடப் புத்தகங்கள் ஒழுங்கமைக்கப்பட்டுள்ளன.',
    papersAndAnswers: 'வினாத்தாள்கள் & விடைகள்',
    papersAndAnswersDesc: 'முக்கியமான க.பொ.த சாதாரண தரம் (O/L) மற்றும் உயர்தர (A/L) முந்தைய வருட கடந்தகால வினாத்தாள்கள் விடைகளுடன் தொகுக்கப்பட்டுள்ளன.',
    freeDownload: 'இலவச பதிவிறக்கம்',
    freeDownloadDesc: 'உறுதியான PDF வடிவத்தில் எந்நேரமும், எவ்வித பதிவுக்கட்டணமும் இன்றி நேரடியாக உங்களது கணினி அல்லது மொபைல் போனுக்கு பதிவிறக்கிப் படியுங்கள்.',
    filterByGrade: 'தரம்:',
    filterBySubject: 'பாடம்:',
    filterByExamType: 'பரீட்சை வகை:',
    searchBooksPlaceholder: 'புத்தகத்தின் பெயர்...',
    searchPapersPlaceholder: 'ஆண்டு அல்லது பாடம்...',
    noBooksFound: 'எதுவும் கண்டறியப்படவில்லை. தயவுசெய்து வேறொரு சொல்லில் முயலவும்.',
    noPapersFound: 'வினாத்தாள்கள் கண்டறியப்படவில்லை.',
    booksTitle: 'அனைத்து தமிழ் மூல பாடப்புத்தகங்கள்',
    booksDesc: 'தரம் 6 முதல் உயர்தரம் வரையிலான இலங்கை பாடப்புத்தகங்கள்',
    papersTitle: 'கடந்த கால வினாத்தாள்கள் (Past Papers)',
    papersDesc: 'மாணவர்கள் பரீட்சைக்குத் தங்களைத் தயார்படுத்துவதற்கான வினாத்தாள்கள்',
    aboutBannerDesc: 'அனைத்து வளங்களும் உத்தியோகபூர்வ வெளியீடுகளை அடிப்படையாகக் கொண்டவை.',
    value1Desc: 'விளம்பரங்களோ அல்லது பிரத்தியேகக் கட்டணங்களோ இன்றி மாணவர்களுக்காய் உழைத்தல்.',
    aboutTitle: 'எம்மைப் பற்றி',
    aboutDesc: 'பரீட்சை நூலகத்தின் கல்விச் சேவைப் பார்வை',
    aboutHeroTitle: 'தமிழ் மாணவர்களின் சிறந்த கல்வித் துணைவன்!',
    aboutHeroDesc: 'இலங்கையில் தமிழ் மொழி மூலம் கல்வி கற்கும் தரம் 6 முதல் தரம் 13 வரையிலான பள்ளி மாணவர்களுக்கான அத்தியாவசிய கையேடுகள் மற்றும் வினாத்தாள்களை ஒரே கைத்தொலைபேசி செயலி வடிவில் வழங்குவதே எமதின் இலக்காகும்.',
    missionTitle: 'எமது இலக்கு',
    missionDesc: 'பொருளாதார ரீதியில் பின்தங்கிய அல்லது கல்வி வளங்கள் தாராளமாக கிடைக்காத பிரதேசங்களில் வாழ்கின்ற தமிழ் மாணவர்களுக்கும் சமவள வாய்ப்புகளை வழங்கி, நவீன இணையத் தொழில்நுட்பங்களின் துணையுடன் கல்விசார் இடைவெளிகளைக் குறைப்பது எங்களது முதன்மை பணியாகும்.',
    contactTitle: 'தொடர்புகளுக்கு',
    contactDesc: 'உங்கள் கருத்துக்கள் அல்லது பாடசாலை வளங்கள் பற்றிய பதிவேற்றக் கோரிக்கைகளை எமக்கு அனுப்புங்கள்.',
    nameLabel: 'முழுப் பெயர்',
    emailLabel: 'மின்னஞ்சல் முகவரி',
    messageLabel: 'உங்களது செய்தி அல்லது வளங்கள் பற்றிய கோரிக்கை',
    sendMsg: 'செய்தியை அனுப்பு',
    msgSuccess: 'உங்களது செய்தி வெற்றிகரமாக அனுப்பப்பட்டது! விரைவில் தொடர்பு கொள்வோம்.',
    allGrades: 'அனைத்து தரங்களும்',
    allSubjects: 'அனைத்து பாடங்களும்',
    allExamTypes: 'அனைத்து பரீட்சைகளும்',
    downloadPdf: 'இலவச PDF பதிவிறக்கம்',
    viewDoc: 'பார்வையிடு',
    close: 'மூடு',
    allRightsReserved: 'அனைத்து உரிமைகளும் பாதுகாக்கப்பட்டவை.',
    videos: 'காணொளிகள்',
    videosTitle: 'நவீன காணொளிப் பாடங்கள்',
    videosDesc: 'இலங்கைப் பாடத்திட்டத்தின் கீழ் தரம் மற்றும் பாடம் வாரியாக கற்பிக்கப்படும் காணொளிப் பாடங்கள்.',
    searchVideosPlaceholder: 'காணொளிகளை தேடுக...',
    noVideosFound: 'காணொளிப் பாடங்கள் எதுவும் கண்டறியப்படவில்லை.'
  },
  en: {
    home: 'Home',
    books: 'Textbooks',
    papers: 'Past Papers',
    about: 'About Us',
    contact: 'Contact',
    freeEducationalPool: 'Free Educational Pool',
    heroTitle: 'All Educational Resources',
    heroTitleAccent: 'For Tamil Medium',
    heroTitleSuffix: 'In One Place!',
    heroDesc: 'Download free educational textbooks, marking schemes, and past papers tailored for Grade 6 to Advanced Level (A/L) students in Sri Lanka.',
    searchPlaceholder: 'Search papers, textbooks, or subjects...',
    searchBtn: 'Search',
    allTextbooks: 'All Textbooks',
    allTextbooksDesc: 'Completely organized Sri Lankan curriculum textbooks from Grade 6 to Advanced Level for Tamil medium instruction.',
    papersAndAnswers: 'Past Papers & Answers',
    papersAndAnswersDesc: 'Important GCE Ordinary Level (O/L) and Advanced Level (A/L) examination papers organized with marking schemes.',
    freeDownload: 'Free Direct Download',
    freeDownloadDesc: 'Access robust educational PDF materials anytime instantly without registration fees or logins.',
    filterByGrade: 'Grade:',
    filterBySubject: 'Subject:',
    filterByExamType: 'Exam Type:',
    searchBooksPlaceholder: 'Search book by name...',
    searchPapersPlaceholder: 'Search by year or subject...',
    noBooksFound: 'No textbooks found matching your search. Please try a different query.',
    noPapersFound: 'No past papers found.',
    booksTitle: 'All Tamil Medium Textbooks',
    booksDesc: 'Curriculum textbooks from Grade 6 to Advanced Level (A/L)',
    papersTitle: 'Past Papers & Marking Schemes',
    papersDesc: 'Official exam papers and answer keys to help students prepare',
    aboutBannerDesc: 'All academic materials are sourced from official national publications.',
    value1Desc: 'Absolutely ad-free platform built strictly for student growth.',
    aboutTitle: 'About Us',
    aboutDesc: 'Education service perspectives of the Exam Library',
    aboutHeroTitle: 'Empowering Tamil Medium Students!',
    aboutHeroDesc: 'Our primary goal is to gather and organize essential textbooks, handbooks, and past papers under a single mobile app interface, enabling students from Grade 6 to Grade 13 to study with ease.',
    missionTitle: 'Our Mission',
    missionDesc: 'To provide equal educational opportunities to Tamil-medium students living in rural or underprivileged areas, leveraging modern technology to bridge educational divides.',
    contactTitle: 'Contact Support',
    contactDesc: 'Send us your questions, feedback, or curriculum resource contribution requests.',
    nameLabel: 'Full Name',
    emailLabel: 'Email Address',
    messageLabel: 'Your Message or Resource Request',
    sendMsg: 'Send Message',
    msgSuccess: 'Your message has been sent successfully! We will get back to you shortly.',
    allGrades: 'All Grades',
    allSubjects: 'All Subjects',
    allExamTypes: 'All Exam Types',
    downloadPdf: 'Free PDF Download',
    viewDoc: 'View Paper',
    close: 'Close',
    allRightsReserved: 'All rights reserved.',
    videos: 'Videos',
    videosTitle: 'Video Lessons',
    videosDesc: 'Detailed educational videos categorized by grade and subject.',
    searchVideosPlaceholder: 'Search video lessons...',
    noVideosFound: 'No video lessons found.'
  }
};

interface VideoLesson {
  id: string;
  title: string;
  grade: string;
  subject: string;
  lessonName: string;
  youtubeId: string;
}

const DEFAULT_VIDEOS: VideoLesson[] = [
  { id: 'vid-1', title: 'தரம் 10 கணிதம் - மெய்யெண்கள்', grade: 'Grade 10', subject: 'maths_subject', lessonName: 'மெய்யெண்கள் தொடர்பான அறிமுகம்', youtubeId: '8iAgbRutHTE' },
  { id: 'vid-2', title: 'தரம் 11 விஞ்ஞானம் - கலவட்டங்கள்', grade: 'Grade 11', subject: 'science_subject', lessonName: 'உயிரினங்களின் வாழ்க்கைக் வட்டம்', youtubeId: '8iAgbRutHTE' },
  { id: 'vid-3', title: 'தரம் 13 பௌதிகவியல் - அளவீடு', grade: 'Grade 13', subject: 'physics_subject', lessonName: 'அளவீட்டு உபகரணங்கள் மற்றும் வழுக்கள்', youtubeId: '8iAgbRutHTE' },
  { id: 'vid-4', title: 'தரம் 12 இரசாயனவியல் - வாயுவகை', grade: 'Grade 12', subject: 'chem_subject', lessonName: 'வாயு அலகு அடிப்படைக் கோட்பாடுகள்', youtubeId: '8iAgbRutHTE' }
];

// Global App State
let currentTab: 'home' | 'books' | 'papers' | 'videos' | 'about' | 'contact' = 'home';
let lang: 'ta' | 'en' = 'ta';
let darkMode = true;
let searchKeyword = '';
let selectedGrade = 'All';
let selectedSubject = 'All';
let selectedExamType = 'All';
let timeString = '12:00 PM';
let books: Book[] = [...DEFAULT_BOOKS];
let papers: PastPaper[] = [...DEFAULT_PAST_PAPERS];
let videos: VideoLesson[] = [...DEFAULT_VIDEOS];
let activeVideoId = '8iAgbRutHTE';
let activeVideoTitle = 'தரம் 10 கணிதம் - மாதிரி காணொளிப் பாடம்';
let activePdfUrl: string | null = null;
let activePdfTitle: string | null = null;
let contactSuccess = false;

// Format Subjects nicely
const SUBJECT_MAP: Record<string, string> = {
  tamil_subject: 'Tamil',
  maths_subject: 'Mathematics',
  science_subject: 'Science',
  history_subject: 'History',
  geo_subject: 'Geography',
  ict_subject: 'ICT',
  comb_maths: 'Combined Maths',
  physics_subject: 'Physics',
  chem_subject: 'Chemistry',
  bio_subject: 'Biology',
  commerce_subject: 'Commerce',
  econ_subject: 'Economics',
  acc_subject: 'Accounting'
};

// Advanced translation mapping arrays to dynamically resolve raw Tamil, raw English, or Key values
const SUBJECTS_DATABASE_MAP = [
  {
    key: 'tamil_subject',
    en: 'Tamil',
    ta: 'தமிழ் மொழியும் இலக்கியமும்',
    matches: ['tamil', 'tamil_subject', 'தமிழ் மொழியும் இலக்கியமும்', 'தமிழ்', 'tamil subject']
  },
  {
    key: 'maths_subject',
    en: 'Mathematics',
    ta: 'கணிதம்',
    matches: ['maths', 'mathematics', 'maths_subject', 'கணிதம்', 'math', 'math subject']
  },
  {
    key: 'science_subject',
    en: 'Science',
    ta: 'விஞ்ஞானம்',
    matches: ['science', 'science_subject', 'விஞ்ஞானம்', 'science subject']
  },
  {
    key: 'history_subject',
    en: 'History',
    ta: 'வரலாறு',
    matches: ['history', 'history_subject', 'வரலாறு']
  },
  {
    key: 'geo_subject',
    en: 'Geography',
    ta: 'புவியியல்',
    matches: ['geography', 'geo_subject', 'புவியியல்', 'geo']
  },
  {
    key: 'ict_subject',
    en: 'ICT',
    ta: 'தகவல் தொழில்நுட்பம் (ICT)',
    matches: ['ict', 'ict_subject', 'தகவல் தொழில்நுட்பம் (ict)', 'தகவல் தொழில்நுட்பம்', 'தொடர்பாடல் தொழில்நுட்பம்', 'தொடர்பாடல் தொழினுட்பம்', 'ict subject', 'information and communication technology']
  },
  {
    key: 'comb_maths',
    en: 'Combined Maths',
    ta: 'இணைந்த கணிதம்',
    matches: ['combined maths', 'combined mathematics', 'comb_maths', 'இணைந்த கணிதம்']
  },
  {
    key: 'physics_subject',
    en: 'Physics',
    ta: 'பௌதிகவியல்',
    matches: ['physics', 'physics_subject', 'பௌதிகவியல்']
  },
  {
    key: 'chem_subject',
    en: 'Chemistry',
    ta: 'இரசாயனவியல்',
    matches: ['chemistry', 'chem', 'chem_subject', 'இரசாயனவியல்']
  },
  {
    key: 'bio_subject',
    en: 'Biology',
    ta: 'உயிரியல்',
    matches: ['biology', 'bio', 'bio_subject', 'உயிரியல்']
  },
  {
    key: 'commerce_subject',
    en: 'Commerce',
    ta: 'வர்த்தகம்',
    matches: ['commerce', 'commerce_subject', 'வர்த்தகம்']
  },
  {
    key: 'econ_subject',
    en: 'Economics',
    ta: 'பொருளியல்',
    matches: ['economics', 'econ', 'econ_subject', 'பொருளியல்']
  },
  {
    key: 'acc_subject',
    en: 'Accounting',
    ta: 'கணக்கியல்',
    matches: ['accounting', 'accounts', 'acc_subject', 'கணக்கியல்']
  }
];

const GRADES_DATABASE_MAP = [
  { key: 'Grade 6', ta: 'தரம் 6', en: 'Grade 6', matches: ['தரம் 6', 'grade 6', '6'] },
  { key: 'Grade 7', ta: 'தரம் 7', en: 'Grade 7', matches: ['தரம் 7', 'grade 7', '7'] },
  { key: 'Grade 8', ta: 'தரம் 8', en: 'Grade 8', matches: ['தரம் 8', 'grade 8', '8'] },
  { key: 'Grade 9', ta: 'தரம் 9', en: 'Grade 9', matches: ['தரம் 9', 'grade 9', '9'] },
  { key: 'Grade 10', ta: 'தரம் 10', en: 'Grade 10', matches: ['தரம் 10', 'grade 10', '10'] },
  { key: 'Grade 11', ta: 'தரம் 11 (O/L)', en: 'Grade 11 (O/L)', matches: ['தரம் 11', 'தரம் 11 (o/l)', 'grade 11', 'grade 11 (o/l)', '11', 'o/l', 'ol'] },
  { key: 'Grade 12', ta: 'தரம் 12', en: 'Grade 12', matches: ['தரம் 12', 'grade 12', '12'] },
  { key: 'Grade 13', ta: 'தரம் 13 (A/L)', en: 'Grade 13 (A/L)', matches: ['தரம் 13', 'தரம் 13 (a/l)', 'grade 13', 'grade 13 (a/l)', '13', 'a/l', 'al'] },
];

function getSubjectDisplayName(subjectInput: string, currentLang: 'ta' | 'en'): string {
  if (!subjectInput) return '';
  const searchStr = subjectInput.trim().toLowerCase();
  
  const match = SUBJECTS_DATABASE_MAP.find(item => 
    item.key.toLowerCase() === searchStr || 
    item.matches.some(m => m.toLowerCase() === searchStr) ||
    item.en.toLowerCase() === searchStr ||
    item.ta.toLowerCase() === searchStr
  );

  if (match) {
    return currentLang === 'ta' ? match.ta : match.en;
  }
  
  if (currentLang === 'ta') {
    return TAMIL_MAP[subjectInput] || SUBJECT_MAP[subjectInput] || subjectInput;
  } else {
    return SUBJECT_MAP[subjectInput] || subjectInput;
  }
}

function getGradeDisplayName(gradeInput: string, currentLang: 'ta' | 'en'): string {
  if (!gradeInput) return '';
  const searchStr = gradeInput.trim().toLowerCase();
  
  const match = GRADES_DATABASE_MAP.find(item => 
    item.key.toLowerCase() === searchStr || 
    item.matches.some(m => m.toLowerCase() === searchStr) ||
    item.ta.toLowerCase() === searchStr ||
    item.en.toLowerCase() === searchStr
  );

  if (match) {
    return currentLang === 'ta' ? match.ta : match.en;
  }
  
  if (currentLang === 'ta') {
    return TAMIL_MAP[gradeInput] || gradeInput;
  } else {
    return gradeInput;
  }
}

function translateTitleDynamically(titleStr: string, targetLang: 'ta' | 'en'): string {
  if (!titleStr) return '';
  
  let result = titleStr;
  
  if (targetLang === 'en') {
    // Replace Tamil terms with English equivalents
    const replacements: [RegExp, string][] = [
      [/விஞ்ஞானம்/g, 'Science'],
      [/கணிதம்/g, 'Mathematics'],
      [/தமிழ் மொழியும் இலக்கியமும்/g, 'Tamil Language & Literature'],
      [/தமிழ் மொழி/g, 'Tamil Language'],
      [/தமிழ்/g, 'Tamil'],
      [/தகவல் தொழில்நுட்பம்/g, 'ICT'],
      [/தொடர்பாடல் தொழில்நுட்பம்/g, 'Communication Technology'],
      [/தொடர்பாடல் தொழினுட்பம்/g, 'Communication Technology'],
      [/பௌதிகவியல்/g, 'Physics'],
      [/இரசாயனவியல்/g, 'Chemistry'],
      [/உயிரியல்/g, 'Biology'],
      [/வரலாறு/g, 'History'],
      [/புவியியல்/g, 'Geography'],
      [/வர்த்தகம்/g, 'Commerce'],
      [/பொருளியல்/g, 'Economics'],
      [/கணக்கியல்/g, 'Accounting'],
      [/இணைந்த கணிதம்/g, 'Combined Mathematics'],
      [/தரம்\s*(\d+)/g, 'Grade $1'],
      [/முதலாம் பாகம்/gi, 'Part I'],
      [/இரண்டாம் பாகம்/gi, 'Part II'],
      [/அலகு\s*([\d,\s+]+)/gi, 'Unit $1'],
      [/மெய்யெண்கள்/g, 'Real Numbers'],
      [/கலவட்டங்கள்/g, 'Life Cycles'],
      [/அளவீடு/g, 'Measurement'],
      [/வாயுவகை/g, 'Gaseous State'],
      [/மெய்யெண்கள் தொடர்பான அறிமுகம்/g, 'Introduction to Real Numbers'],
      [/உயிரினங்களின் வாழ்க்கைக் வட்டம்/g, 'Life cycles of organisms'],
      [/அளவீட்டு உபகரணங்கள் மற்றும் வழுக்கள்/g, 'Measuring instruments and errors'],
      [/வாயு அலகு அடிப்படைக் கோட்பாடுகள்/g, 'Basic concepts of gases'],
    ];
    
    for (const [regex, replacement] of replacements) {
      result = result.replace(regex, replacement);
    }
  } else {
    // Replace English terms with Tamil equivalents
    const replacements: [RegExp, string][] = [
      [/Combined Mathematics/gi, 'இணைந்த கணிதம்'],
      [/Combined Maths/gi, 'இணைந்த கணிதம்'],
      [/Mathematics/gi, 'கணிதம்'],
      [/Maths/gi, 'கணிதம்'],
      [/Science/gi, 'விஞ்ஞானம்'],
      [/Tamil Language & Literature/gi, 'தமிழ் மொழியும் இலக்கியமும்'],
      [/Tamil/gi, 'தமிழ்'],
      [/Communication Technology/gi, 'தொடர்பாடல் தொழில்நுட்பம்'],
      [/ICT/gi, 'தகவல் தொழில்நுட்பம் (ICT)'],
      [/Physics/gi, 'பௌதிகவியல்'],
      [/Chemistry/gi, 'இரசாயனவியல்'],
      [/Biology/gi, 'உயிரியல்'],
      [/History/gi, 'வரலாறு'],
      [/Geography/gi, 'புவியியல்'],
      [/Commerce/gi, 'வர்த்தகம்'],
      [/Economics/gi, 'பொருளியல்'],
      [/Accounting/gi, 'கணக்கியல்'],
      [/Grade\s*(\d+)/gi, 'தரம் $1'],
      [/Part\s*I\b/gi, 'முதலாம் பாகம்'],
      [/Part\s*II\b/gi, 'இரண்டாம் பாகம்'],
      [/Unit\s*([\d,\s+]+)/gi, 'அலகு $1'],
    ];
    
    for (const [regex, replacement] of replacements) {
      result = result.replace(regex, replacement);
    }
  }
  
  return result;
}

// Load Dynamic Data from Firestore seamlessly
async function loadData() {
  testConnection();

  try {
    const booksSnap = await getDocs(collection(db, 'books'));
    const fBooks: Book[] = [];
    booksSnap.forEach((doc) => {
      fBooks.push({ id: doc.id, ...doc.data() } as Book);
    });
    if (fBooks.length > 0) {
      books = fBooks;
    }
  } catch (e) {
    console.log("No custom books found inside Firestore, mounting dynamic fallbacks perfectly");
  }

  try {
    const papersSnap = await getDocs(collection(db, 'pastPapers'));
    const fPapers: PastPaper[] = [];
    papersSnap.forEach((doc) => {
      fPapers.push({ id: doc.id, ...doc.data() } as PastPaper);
    });
    if (fPapers.length > 0) {
      papers = fPapers;
    }
  } catch (e) {
    console.log("No custom papers found inside Firestore, mounting dynamic fallbacks perfectly");
  }

  try {
    const videosSnap = await getDocs(collection(db, 'videos'));
    const fVideos: VideoLesson[] = [];
    videosSnap.forEach((doc) => {
      fVideos.push({ id: doc.id, ...doc.data() } as VideoLesson);
    });
    if (fVideos.length > 0) {
      videos = fVideos;
      activeVideoId = videos[0].youtubeId;
      activeVideoTitle = videos[0].title;
    }
  } catch (e) {
    console.log("No custom videos found inside Firestore, mounting dynamic fallbacks perfectly");
  }

  renderApp();
}

// Clock updates
function startClock() {
  const updateTime = () => {
    const now = new Date();
    let hours = now.getHours();
    const mins = now.getMinutes().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12;
    timeString = `${hours}:${mins} ${ampm}`;
    
    // Update local clock DOM part specifically so we don't redraw the whole app and reset selections
    const clockElement = document.getElementById('smartphone-clock');
    if (clockElement) {
      clockElement.innerText = timeString;
    }
  };
  updateTime();
  setInterval(updateTime, 10000);
}

// Global Core Viewport Generator
function renderApp() {
  const rootElement = document.getElementById('root');
  if (!rootElement) return;

  const t = TRANSLATIONS[lang];

  // Set standard body theme class
  if (darkMode) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }

  // Filter lists based on state
  const filteredBooks = books.filter((b) => {
    const matchesGrade = selectedGrade === 'All' || b.grade === selectedGrade;
    const matchesSubject = selectedSubject === 'All' || b.subject === selectedSubject;
    const matchesSearch = !searchKeyword.trim() || b.title.toLowerCase().includes(searchKeyword.toLowerCase()) || (TAMIL_MAP[b.subject] || '').toLowerCase().includes(searchKeyword.toLowerCase()) || (SUBJECT_MAP[b.subject] || '').toLowerCase().includes(searchKeyword.toLowerCase());
    return matchesGrade && matchesSubject && matchesSearch;
  });

  const filteredPapers = papers.filter((p) => {
    const matchesType = selectedExamType === 'All' || p.examType === selectedExamType;
    const matchesSubject = selectedSubject === 'All' || p.subject === selectedSubject;
    const matchesSearch = !searchKeyword.trim() || p.year.includes(searchKeyword) || (TAMIL_MAP[p.subject] || '').toLowerCase().includes(searchKeyword.toLowerCase()) || (SUBJECT_MAP[p.subject] || '').toLowerCase().includes(searchKeyword.toLowerCase());
    return matchesType && matchesSubject && matchesSearch;
  });

  const filteredVideos = videos.filter((v) => {
    const matchesGrade = selectedGrade === 'All' || v.grade === selectedGrade;
    const matchesSubject = selectedSubject === 'All' || v.subject === selectedSubject;
    const matchesSearch = !searchKeyword.trim() || v.title.toLowerCase().includes(searchKeyword.toLowerCase()) || v.lessonName.toLowerCase().includes(searchKeyword.toLowerCase()) || (TAMIL_MAP[v.subject] || '').toLowerCase().includes(searchKeyword.toLowerCase()) || (SUBJECT_MAP[v.subject] || '').toLowerCase().includes(searchKeyword.toLowerCase());
    return matchesGrade && matchesSubject && matchesSearch;
  });

  // Render full HTML markup
  rootElement.innerHTML = `
    <div class="h-[100dvh] sm:min-h-screen w-full bg-[#050811] text-slate-800 dark:text-slate-100 flex flex-col items-center justify-center font-sans p-0 sm:p-4 overflow-hidden relative">
      
      <!-- Ambient Backlights -->
      <div class="absolute top-1/4 left-1/4 w-[400px] h-[400px] rounded-full bg-neon-purple/10 blur-[130px] pointer-events-none -z-10 hidden md:block"></div>
      <div class="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-neon-cyan/10 blur-[130px] pointer-events-none -z-10 hidden md:block"></div>

      <!-- App Container (Constrained max-width on computers, full-bleed immersive screen on real mobile phones) -->
      <div class="w-full max-w-md bg-white dark:bg-[#070b14] sm:rounded-3xl sm:border sm:border-slate-150 sm:dark:border-[#1a2333] sm:shadow-[0_25px_60px_-15px_rgba(0,0,0,0.85)] flex flex-col h-[100dvh] sm:h-[840px] relative overflow-hidden shrink-0 z-10 transition-colors duration-300">
        
        <!-- COMPACT HEADER -->
        <div class="bg-slate-50 dark:bg-[#111827] px-4 py-3.5 flex justify-between items-center border-b border-slate-200 dark:border-slate-900 shadow-sm shrink-0 transition-colors duration-300">
          <div class="flex items-center space-x-2">
            <div class="p-1 px-1.5 text-white bg-blue-600 dark:bg-gradient-to-br dark:from-neon-purple dark:to-neon-cyan rounded-lg glow-purple flex items-center justify-center">
              <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222"></path>
              </svg>
            </div>
            <div>
              <h1 class="text-xs sm:text-xs font-black tracking-tight text-slate-950 dark:text-white uppercase leading-none block">
                ${lang === 'ta' ? 'பரீட்சை நூலகம்' : 'Exam Library'}
              </h1>
              <span class="text-[7.5px] font-bold text-slate-500 dark:text-neon-cyan block uppercase tracking-widest mt-1">
                ${lang === 'ta' ? 'கற்றல் வளக் களஞ்சியம்' : 'Tamil Resource Pool'}
              </span>
            </div>
          </div>

          <div class="flex items-center space-x-1.5">
            <!-- Language Pill selectors -->
            <div class="flex items-center bg-slate-200 dark:bg-slate-900 p-0.5 rounded-lg border dark:border-slate-800 transition">
              <button id="lang-ta-btn" class="px-1.5 py-0.5 text-[8px] font-black rounded-md transition-all ${lang === 'ta' ? 'bg-blue-600 text-white dark:bg-neon-cyan dark:text-slate-950 shadow-sm' : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'}">தமிழ்</button>
              <button id="lang-en-btn" class="px-1.5 py-0.5 text-[8px] font-black rounded-md transition-all ${lang === 'en' ? 'bg-blue-600 text-white dark:bg-neon-cyan dark:text-slate-950 shadow-sm' : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'}">EN</button>
            </div>

            <!-- Theme toggle icon -->
            <button id="theme-toggle-btn" class="p-1 px-1.5 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white rounded-lg bg-slate-150 dark:bg-slate-900 border dark:border-slate-850 hover:bg-slate-200 transition">
              ${darkMode ? `
                <svg class="w-3.5 h-3.5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fill-rule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 110 2v-1a1 1 0 110-1zm-5.05-1.464l-.707.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 111.414 1.414zm0-8.486a1 1 0 00-1.414 1.414l.707.707a1 1 0 001.414-1.414l-.707-.707zM3 11a1 1 0 100-2H2a1 1 0 100 2h1z" clip-rule="evenodd"></path>
                </svg>
              ` : `
                <svg class="w-3.5 h-3.5 text-slate-600" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"></path>
                </svg>
              `}
            </button>
          </div>
        </div>

        <!-- SCROLLABLE INTERACTIVE DYNAMIC CONTENT AREA -->
        <div class="flex-1 overflow-y-auto px-4 py-4 bg-slate-50 dark:bg-[#060812] scroll-smooth transition-colors duration-300">
          
          ${currentTab === 'home' ? `
            <!-- TAB 1: HOME PAGE -->
            <div class="space-y-6">
              
              <!-- Hero interactive search card with glow and dynamic animations -->
              <section class="relative overflow-hidden bg-slate-900 border border-slate-800 dark:border-neon-purple/40 text-white rounded-2xl p-5 dark:glow-purple">
                <div class="absolute top-[-30px] right-[-30px] w-48 h-48 rounded-full bg-neon-purple opacity-20 blur-[60px] pointer-events-none"></div>
                <div class="absolute bottom-[-50px] left-[-50px] w-48 h-48 rounded-full bg-neon-cyan opacity-15 blur-[55px] pointer-events-none"></div>

                <div class="relative space-y-4 text-center">
                  <div class="inline-flex items-center space-x-1.5 bg-slate-800/80 backdrop-blur-md px-3 py-1 rounded-full text-[9px] font-semibold uppercase tracking-wider text-neon-cyan border border-neon-cyan/20">
                    <span class="w-1.5 h-1.5 rounded-full bg-neon-pink animate-pulse"></span>
                    <span>${t.freeEducationalPool}</span>
                  </div>

                  <h2 class="text-xl sm:text-2xl font-black tracking-tight leading-tight uppercase">
                    ${t.heroTitle} <br/>
                    <span class="text-transparent bg-clip-text bg-gradient-to-r from-neon-purple via-neon-pink to-neon-cyan text-glow-purple">
                      ${t.heroTitleAccent}
                    </span>
                    <span>${t.heroTitleSuffix}</span>
                  </h2>

                  <p class="text-[10px] text-slate-350 leading-relaxed font-semibold max-w-xs mx-auto">
                    ${t.heroDesc}
                  </p>

                  <!-- Direct Search mechanism -->
                  <form id="home-search-form" class="mt-4 flex gap-1.5 max-w-xs mx-auto">
                    <div class="relative flex-grow">
                      <input 
                        type="text" 
                        id="home-search-input" 
                        value="${searchKeyword}" 
                        placeholder="${t.searchPlaceholder}" 
                        class="w-full pl-3 pr-3 py-2.5 rounded-xl text-[11px] text-white placeholder-slate-400 bg-slate-950 border border-slate-750 dark:border-neon-cyan/30 focus:outline-none focus:ring-1 focus:ring-neon-cyan font-bold"
                      />
                    </div>
                    <button type="submit" class="px-4 py-2.5 bg-gradient-to-r from-neon-purple to-neon-cyan hover:from-neon-cyan hover:to-neon-pink text-slate-950 font-black text-[10px] uppercase tracking-wider rounded-xl transition flex items-center justify-center space-x-1 shrink-0">
                      <span>${t.searchBtn}</span>
                    </button>
                  </form>
                </div>
              </section>

              <!-- Statistics counter grids -->
              <div class="grid grid-cols-2 gap-3.5">
                <div class="bg-white dark:bg-[#111827] p-3 rounded-xl border border-slate-200 dark:border-neon-purple/10 text-center flex flex-col justify-center">
                  <span class="text-xl font-black text-blue-600 dark:text-neon-purple text-glow-purple">100+</span>
                  <span class="text-[8px] text-slate-500 dark:text-slate-450 uppercase font-black tracking-wider mt-1">
                    ${lang === 'ta' ? 'அரசு பாடநூல்கள்' : 'Government Textbooks'}
                  </span>
                </div>
                <div class="bg-white dark:bg-[#111827] p-3 rounded-xl border border-slate-200 dark:border-neon-cyan/10 text-center flex flex-col justify-center">
                  <span class="text-xl font-black text-cyan-500 dark:text-neon-cyan text-glow-cyan">50+</span>
                  <span class="text-[8px] text-slate-500 dark:text-slate-450 uppercase font-black tracking-wider mt-1">
                    ${lang === 'ta' ? 'கடந்தகாலத்தாள்கள்' : 'Verified Past Papers'}
                  </span>
                </div>
              </div>

              <!-- Sleek Information Bento blocks -->
              <section class="space-y-3">
                <div class="bg-white dark:bg-[#111827] p-4 rounded-xl border border-slate-150 dark:border-neon-purple/10 transition flex items-start space-x-3">
                  <div class="p-2.5 bg-blue-100 dark:bg-neon-purple/10 text-blue-600 dark:text-neon-purple rounded-xl shrink-0">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
                    </svg>
                  </div>
                  <div>
                    <h4 class="font-extrabold text-xs text-slate-900 dark:text-white dark:text-glow-purple">${t.allTextbooks}</h4>
                    <p class="text-[9.5px] text-slate-500 dark:text-slate-400 mt-1 leading-relaxed font-semibold">${t.allTextbooksDesc}</p>
                  </div>
                </div>

                <div class="bg-white dark:bg-[#111827] p-4 rounded-xl border border-slate-150 dark:border-neon-pink/10 transition flex items-start space-x-3">
                  <div class="p-2.5 bg-pink-100 dark:bg-neon-pink/10 text-pink-600 dark:text-neon-pink rounded-xl shrink-0">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 011.414 0 3.42 3.42 0 001.946.806 3.42 3.42 0 010 1.946 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 1.414 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 010 1.414 3.42 3.42 0 00.806 1.946 3.42 3.42 0 01-1.414 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-1.414 0 3.42 3.42 0 00-1.946.806 3.42 3.42 0 010-1.946 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-1.414z"></path>
                    </svg>
                  </div>
                  <div>
                    <h4 class="font-extrabold text-xs text-slate-900 dark:text-white dark:text-glow-pink">${t.papersAndAnswers}</h4>
                    <p class="text-[9.5px] text-slate-500 dark:text-slate-400 mt-1 leading-relaxed font-semibold">${t.papersAndAnswersDesc}</p>
                  </div>
                </div>

                <div class="bg-white dark:bg-[#111827] p-4 rounded-xl border border-slate-150 dark:border-neon-cyan/10 transition flex items-start space-x-3">
                  <div class="p-2.5 bg-cyan-100 dark:bg-neon-cyan/10 text-cyan-600 dark:text-neon-cyan rounded-xl shrink-0">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
                    </svg>
                  </div>
                  <div>
                    <h4 class="font-extrabold text-xs text-slate-900 dark:text-white dark:text-glow-cyan">${t.freeDownload}</h4>
                    <p class="text-[9.5px] text-slate-500 dark:text-slate-400 mt-1 leading-relaxed font-semibold">${t.freeDownloadDesc}</p>
                  </div>
                </div>
              </section>

              <!-- Prompt to browse books or papers directly -->
              <div class="p-4 bg-blue-600/10 dark:bg-[#111827] border border-blue-600/30 dark:border-neon-cyan/25 rounded-xl flex items-center justify-between">
                <div>
                  <span class="text-[10px] font-black uppercase text-blue-600 dark:text-neon-cyan block leading-tight">
                    ${lang === 'ta' ? 'அனைத்து பாடநூல்களும்' : 'Filter by Grades'}
                  </span>
                  <span class="text-[8px] text-slate-500 dark:text-slate-400 font-bold block mt-0.5">
                    ${lang === 'ta' ? 'தரம் 6 - தரம் 13 வரையிலான பாடநூல்கள்' : 'Over 13 grades structured accurately'}
                  </span>
                </div>
                <button id="home-explore-books-btn" class="p-2 px-3.5 text-[10px] font-black text-slate-950 bg-gradient-to-r from-neon-purple to-neon-cyan hover:scale-[1.03] transition-all rounded-lg">
                  ${lang === 'ta' ? 'பார்வையிடு' : 'Browse'}
                </button>
              </div>

            </div>
          ` : currentTab === 'books' ? `
            <!-- TAB 2: BOOKS PAGE (Full Filtering + Search) -->
            <div class="space-y-4">
              <div class="space-y-1">
                <h2 class="text-base font-black text-slate-950 dark:text-white tracking-tight uppercase">${t.booksTitle}</h2>
                <p class="text-[9px] text-slate-500 dark:text-slate-400 font-semibold leading-tight">${t.booksDesc}</p>
              </div>

              <!-- Search filters container -->
              <div class="bg-white dark:bg-[#111827] p-3 rounded-xl border border-slate-200 dark:border-neon-purple/15 space-y-3 shadow-sm">
                <!-- Text box search -->
                <div class="relative">
                  <input 
                    type="text"
                    id="book-filter-search"
                    placeholder="${t.searchBooksPlaceholder}"
                    value="${searchKeyword}"
                    class="w-full pl-3 pr-3 py-2 rounded-lg text-[10px] placeholder-slate-400 bg-slate-100 dark:bg-slate-950 font-bold text-slate-950 dark:text-white border dark:border-slate-800 focus:outline-none focus:ring-1 focus:ring-neon-purple"
                  />
                </div>

                <div class="grid grid-cols-2 gap-2">
                  <!-- Grade filter droplist -->
                  <div>
                    <label class="block text-[8px] font-extrabold uppercase tracking-wide text-slate-500 dark:text-slate-400 mb-1">${t.filterByGrade}</label>
                    <select id="book-grade-select" class="w-full bg-slate-100 dark:bg-slate-950 text-[10px] text-slate-950 dark:text-white border dark:border-slate-800 rounded-lg p-2 font-bold focus:outline-none">
                      <option value="All" ${selectedGrade === 'All' ? 'selected' : ''}>${t.allGrades}</option>
                      ${GRADES.map(g => `<option value="${g}" ${selectedGrade === g ? 'selected' : ''}>${lang === 'ta' ? (TAMIL_MAP[g] || g) : g}</option>`).join('')}
                    </select>
                  </div>

                  <!-- Subject filter droplist -->
                  <div>
                    <label class="block text-[8px] font-extrabold uppercase tracking-wide text-slate-500 dark:text-slate-400 mb-1">${t.filterBySubject}</label>
                    <select id="book-subject-select" class="w-full bg-slate-100 dark:bg-slate-950 text-[10px] text-slate-950 dark:text-white border dark:border-slate-800 rounded-lg p-2 font-bold focus:outline-none">
                      <option value="All" ${selectedSubject === 'All' ? 'selected' : ''}>${t.allSubjects}</option>
                      ${Object.keys(SUBJECT_MAP).map(subKey => `<option value="${subKey}" ${selectedSubject === subKey ? 'selected' : ''}>${getSubjectDisplayName(subKey, lang)}</option>`).join('')}
                    </select>
                  </div>
                </div>
              </div>

              <!-- List grid of books -->
              <div id="books-grid-renderer" class="grid grid-cols-1 gap-3.5">
                ${filteredBooks.length === 0 ? `
                  <div class="p-8 text-center bg-white dark:bg-[#111827] rounded-xl border border-slate-200 dark:border-slate-900">
                    <p class="text-[10px] text-slate-500 dark:text-slate-400 font-bold leading-relaxed">${t.noBooksFound}</p>
                  </div>
                ` : filteredBooks.map((b) => `
                  <div class="bg-white dark:bg-[#111827] rounded-xl border border-slate-150 dark:border-slate-850 shadow-sm p-3.5 flex items-start space-x-3 hover:scale-[1.01] transition duration-250">
                    <!-- Fake cover representation -->
                    <div class="w-11 h-14 bg-gradient-to-br from-indigo-600 via-blue-500 to-indigo-700 text-white rounded-lg p-1.5 flex flex-col justify-between shrink-0 select-none shadow">
                      <span class="text-[7px] font-black uppercase text-cyan-200 tracking-wider">NIE</span>
                      <div class="w-full h-0.5 bg-white/20"></div>
                      <span class="text-[7.5px] font-black tracking-tighter leading-none">${getGradeDisplayName(b.grade, lang)}</span>
                    </div>

                    <div class="flex-grow min-w-0 flex flex-col justify-between h-14">
                      <div>
                        <h4 class="font-extrabold text-[11px] text-slate-950 dark:text-white truncate leading-snug">${translateTitleDynamically(b.title, lang)}</h4>
                        <div class="flex flex-wrap gap-1 mt-1">
                          <span class="bg-blue-100 text-blue-800 dark:bg-neon-purple/10 dark:text-neon-purple text-[8px] font-black tracking-wide px-1.5 py-0.5 rounded-md leading-none uppercase">
                            ${getGradeDisplayName(b.grade, lang)}
                          </span>
                          <span class="bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-350 text-[8px] font-black tracking-wide px-1.5 py-0.5 rounded-md leading-none uppercase truncate max-w-[100px]">
                            ${getSubjectDisplayName(b.subject, lang)}
                          </span>
                        </div>
                      </div>

                      <button class="pdf-trigger-btn flex items-center space-x-1 text-blue-600 dark:text-neon-cyan hover:underline text-[9px] font-black self-start" data-url="${b.pdfUrl}" data-title="${translateTitleDynamically(b.title, lang)}">
                        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                        </svg>
                        <span>${t.downloadPdf}</span>
                      </button>
                    </div>
                  </div>
                `).join('')}
              </div>
            </div>
          ` : currentTab === 'papers' ? `
            <!-- TAB 3: PAST PAPERS PAGE (Filtering + Search) -->
            <div class="space-y-4">
              <div class="space-y-1">
                <h2 class="text-base font-black text-slate-950 dark:text-white tracking-tight uppercase">${t.papersTitle}</h2>
                <p class="text-[9px] text-slate-500 dark:text-slate-400 font-semibold leading-tight">${t.papersDesc}</p>
              </div>

              <!-- Filter blocks -->
              <div class="bg-white dark:bg-[#111827] p-3 rounded-xl border border-slate-200 dark:border-neon-purple/15 space-y-3 shadow-sm">
                <!-- Text box search -->
                <div class="relative">
                  <input 
                    type="text"
                    id="paper-filter-search"
                    placeholder="${t.searchPapersPlaceholder}"
                    value="${searchKeyword}"
                    class="w-full pl-3 pr-3 py-2 rounded-lg text-[10px] placeholder-slate-400 bg-slate-100 dark:bg-slate-950 font-bold text-slate-950 dark:text-white border dark:border-slate-800 focus:outline-none focus:ring-1 focus:ring-neon-cyan"
                  />
                </div>

                <div class="grid grid-cols-2 gap-2">
                  <!-- Exam Type filter -->
                  <div>
                    <label class="block text-[8px] font-extrabold uppercase tracking-wide text-slate-500 dark:text-slate-400 mb-1">${t.filterByExamType}</label>
                    <select id="paper-examtype-select" class="w-full bg-slate-100 dark:bg-slate-950 text-[10px] text-slate-950 dark:text-white border dark:border-slate-800 rounded-lg p-2 font-bold focus:outline-none">
                      <option value="All" ${selectedExamType === 'All' ? 'selected' : ''}>${t.allExamTypes}</option>
                      <option value="O/L" ${selectedExamType === 'O/L' ? 'selected' : ''}>${lang === 'ta' ? (TAMIL_MAP['O/L'] || 'O/L') : 'O/L'}</option>
                      <option value="A/L" ${selectedExamType === 'A/L' ? 'selected' : ''}>${lang === 'ta' ? (TAMIL_MAP['A/L'] || 'A/L') : 'A/L'}</option>
                    </select>
                  </div>

                  <!-- Subject filter -->
                  <div>
                    <label class="block text-[8px] font-extrabold uppercase tracking-wide text-slate-500 dark:text-slate-400 mb-1">${t.filterBySubject}</label>
                    <select id="paper-subject-select" class="w-full bg-slate-100 dark:bg-slate-950 text-[10px] text-slate-950 dark:text-white border dark:border-slate-800 rounded-lg p-2 font-bold focus:outline-none">
                      <option value="All" ${selectedSubject === 'All' ? 'selected' : ''}>${t.allSubjects}</option>
                      ${Object.keys(SUBJECT_MAP).map(subKey => `<option value="${subKey}" ${selectedSubject === subKey ? 'selected' : ''}>${getSubjectDisplayName(subKey, lang)}</option>`).join('')}
                    </select>
                  </div>
                </div>
              </div>

              <!-- List grid of verified papers -->
              <div id="papers-grid-renderer" class="grid grid-cols-1 gap-3.5">
                ${filteredPapers.length === 0 ? `
                  <div class="p-8 text-center bg-white dark:bg-[#111827] rounded-xl border border-slate-200 dark:border-slate-900">
                    <p class="text-[10px] text-slate-500 dark:text-slate-400 font-bold leading-relaxed">${t.noPapersFound}</p>
                  </div>
                ` : filteredPapers.map((p) => `
                  <div class="bg-white dark:bg-[#111827] rounded-xl border border-slate-150 dark:border-slate-850 shadow-sm p-3.5 flex items-start space-x-3 hover:scale-[1.01] transition duration-250">
                    <!-- Paper Icon cover tag -->
                    <div class="w-11 h-14 bg-gradient-to-br from-pink-600 via-rose-500 to-rose-700 text-white rounded-lg p-1.5 flex flex-col justify-between shrink-0 select-none shadow">
                      <span class="text-[7px] font-black uppercase text-rose-100 tracking-wider">EXAM</span>
                      <div class="w-full h-0.5 bg-white/20"></div>
                      <span class="text-[9px] font-black tracking-tight leading-tight">${p.year}</span>
                    </div>

                    <div class="flex-grow min-w-0 flex flex-col justify-between h-14">
                      <div>
                        <h4 class="font-extrabold text-[11px] text-slate-950 dark:text-white truncate leading-snug">
                          ${p.year} - ${getSubjectDisplayName(p.subject, lang)}
                        </h4>
                        <div class="flex flex-wrap gap-1 mt-1">
                          <span class="bg-pink-100 text-pink-800 dark:bg-neon-pink/10 dark:text-neon-pink text-[8px] font-black tracking-wide px-1.5 py-0.5 rounded-md leading-none uppercase">
                            ${p.examType}
                          </span>
                          <span class="bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-350 text-[8px] font-black tracking-wide px-1.5 py-0.5 rounded-md leading-none uppercase truncate max-w-[100px]">
                            ${getSubjectDisplayName(p.subject, lang)}
                          </span>
                        </div>
                      </div>

                      <button class="pdf-trigger-btn flex items-center space-x-1 text-blue-600 dark:text-neon-cyan hover:underline text-[9px] font-black self-start" data-url="${p.pdfUrl}" data-title="${p.year} ${getSubjectDisplayName(p.subject, lang)}">
                        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
                        </svg>
                        <span>${t.viewDoc}</span>
                      </button>
                    </div>
                  </div>
                `).join('')}
              </div>
            </div>
          ` : currentTab === 'videos' ? `
            <!-- TAB 6: VIDEOS PAGE -->
            <div class="space-y-4">
              <div class="space-y-1">
                <h2 class="text-base font-black text-slate-950 dark:text-white tracking-tight uppercase">${t.videosTitle}</h2>
                <p class="text-[9px] text-slate-500 dark:text-slate-400 font-semibold leading-tight">${t.videosDesc}</p>
              </div>

              <!-- Sleek Active YouTube Player Frame -->
              <div class="bg-white dark:bg-[#111827] rounded-2xl border border-slate-150 dark:border-slate-850 p-2 shadow-sm space-y-2">
                <div class="aspect-video w-full rounded-xl overflow-hidden bg-black relative">
                  <iframe 
                    class="absolute inset-0 w-full h-full" 
                    src="https://www.youtube.com/embed/${activeVideoId}?autoplay=0&rel=0" 
                    title="${activeVideoTitle}" 
                    frameborder="0" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                    allowfullscreen
                  ></iframe>
                </div>
                <div class="px-1.5 py-1">
                  <span class="inline-block bg-blue-100 text-blue-800 dark:bg-neon-cyan/15 dark:text-neon-cyan text-[8px] font-black uppercase tracking-wider px-2 py-0.5 rounded mb-1">
                    ${lang === 'ta' ? 'தற்போது ஒளிபரப்பாகிறது' : 'Currently Playing'}
                  </span>
                  <h4 class="font-extrabold text-[11px] text-slate-950 dark:text-white leading-snug">${translateTitleDynamically(activeVideoTitle, lang)}</h4>
                </div>
              </div>

              <!-- Filters identical to books and papers -->
              <div class="bg-white dark:bg-[#111827] p-3 rounded-xl border border-slate-200 dark:border-neon-purple/15 space-y-3 shadow-sm">
                <!-- Text box search -->
                <div class="relative">
                  <input 
                    type="text"
                    id="video-filter-search"
                    placeholder="${t.searchVideosPlaceholder}"
                    value="${searchKeyword}"
                    class="w-full pl-3 pr-3 py-2 rounded-lg text-[10px] placeholder-slate-400 bg-slate-100 dark:bg-slate-950 font-bold text-slate-950 dark:text-white border dark:border-slate-800 focus:outline-none focus:ring-1 focus:ring-neon-pink"
                  />
                </div>

                <div class="grid grid-cols-2 gap-2">
                  <!-- Grade select -->
                  <div>
                    <label class="block text-[8px] font-extrabold uppercase tracking-wide text-slate-500 dark:text-slate-400 mb-1">${t.filterByGrade}</label>
                    <select id="video-grade-select" class="w-full bg-slate-100 dark:bg-slate-950 text-[10px] text-slate-950 dark:text-white border dark:border-slate-800 rounded-lg p-2 font-bold focus:outline-none">
                      <option value="All" ${selectedGrade === 'All' ? 'selected' : ''}>${t.allGrades}</option>
                      ${GRADES.map(g => `<option value="${g}" ${selectedGrade === g ? 'selected' : ''}>${lang === 'ta' ? (TAMIL_MAP[g] || g) : g}</option>`).join('')}
                    </select>
                  </div>

                  <!-- Subject select -->
                  <div>
                    <label class="block text-[8px] font-extrabold uppercase tracking-wide text-slate-500 dark:text-slate-400 mb-1">${t.filterBySubject}</label>
                    <select id="video-subject-select" class="w-full bg-slate-100 dark:bg-slate-950 text-[10px] text-slate-950 dark:text-white border dark:border-slate-800 rounded-lg p-2 font-bold focus:outline-none">
                      <option value="All" ${selectedSubject === 'All' ? 'selected' : ''}>${t.allSubjects}</option>
                      ${Object.keys(SUBJECT_MAP).map(subKey => `<option value="${subKey}" ${selectedSubject === subKey ? 'selected' : ''}>${getSubjectDisplayName(subKey, lang)}</option>`).join('')}
                    </select>
                  </div>
                </div>
              </div>

              <!-- List grid of videos -->
              <div id="videos-grid-renderer" class="grid grid-cols-1 gap-2.5">
                ${filteredVideos.length === 0 ? `
                  <div class="p-8 text-center bg-white dark:bg-[#111827] rounded-xl border border-slate-200 dark:border-slate-900">
                    <p class="text-[10px] text-slate-500 dark:text-slate-400 font-bold leading-relaxed">${t.noVideosFound}</p>
                  </div>
                ` : filteredVideos.map((v) => `
                  <div class="video-trigger-btn bg-white dark:bg-[#111827] rounded-xl border ${activeVideoId === v.youtubeId && activeVideoTitle === v.title ? 'border-blue-500 dark:border-neon-cyan shadow-sm bg-blue-500/5' : 'border-slate-150 dark:border-slate-850'} p-3 flex items-start space-x-3 hover:scale-[1.01] transition duration-250 cursor-pointer" data-ytid="${v.youtubeId}" data-title="${v.title}">
                    <!-- Video Play Thumbnail Simulation -->
                    <div class="w-16 h-10 bg-slate-950 rounded-lg relative flex items-center justify-center shrink-0 overflow-hidden shadow">
                      <img class="absolute inset-0 w-full h-full object-cover opacity-60" src="https://img.youtube.com/vi/${v.youtubeId}/hqdefault.jpg" alt="thumbnail" referrerPolicy="no-referrer" />
                      <div class="w-6 h-6 bg-blue-600/90 dark:bg-neon-cyan/90 text-white dark:text-slate-900 rounded-full flex items-center justify-center relative z-10 shadow">
                        <svg class="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z"/>
                        </svg>
                      </div>
                    </div>

                    <div class="flex-grow min-w-0">
                      <h4 class="font-extrabold text-[10px] text-slate-950 dark:text-white leading-snug truncate">${translateTitleDynamically(v.title, lang)}</h4>
                      <p class="text-[8px] text-slate-400 dark:text-slate-400 font-bold mt-0.5 truncate">${translateTitleDynamically(v.lessonName, lang)}</p>
                      <div class="flex gap-1 mt-1">
                        <span class="bg-blue-100 text-blue-800 dark:bg-neon-purple/15 dark:text-neon-purple text-[7px] font-black tracking-wide px-1.5 py-0.2 rounded uppercase">
                          ${getGradeDisplayName(v.grade, lang)}
                        </span>
                        <span class="bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-350 text-[7px] font-black tracking-wide px-1.5 py-0.2 rounded uppercase truncate">
                          ${getSubjectDisplayName(v.subject, lang)}
                        </span>
                      </div>
                    </div>
                  </div>
                `).join('')}
              </div>
            </div>
          ` : currentTab === 'about' ? `
            <!-- TAB 4: ABOUT PAGE -->
            <div class="space-y-4">
              <div class="space-y-1">
                <h2 class="text-base font-black text-slate-950 dark:text-white tracking-tight uppercase">${t.aboutTitle}</h2>
                <p class="text-[9px] text-slate-500 dark:text-slate-400 font-semibold leading-tight">${t.aboutDesc}</p>
              </div>

              <!-- Mission Board -->
              <section class="bg-white dark:bg-[#111827] rounded-xl p-4 border border-slate-150 dark:border-slate-850 shadow-sm space-y-3">
                <div class="flex items-center space-x-2 text-blue-600 dark:text-neon-cyan">
                  <svg class="w-4 h-4 text-glow-cyan" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                  </svg>
                  <h4 class="font-extrabold text-xs uppercase tracking-wider">${t.aboutHeroTitle}</h4>
                </div>
                <p class="text-[10px] text-slate-600 dark:text-slate-300 leading-relaxed font-semibold">
                  ${t.aboutHeroDesc}
                </p>
                <div class="h-px bg-slate-100 dark:bg-slate-800"></div>
                <p class="text-[9.5px] text-slate-500 dark:text-slate-400 leading-relaxed italic font-bold">
                  * ${t.aboutBannerDesc}
                </p>
              </section>

              <!-- Goals Grid -->
              <div class="grid grid-cols-1 gap-3">
                <div class="bg-white dark:bg-[#111827] p-4 rounded-xl border border-slate-150 dark:border-slate-850 shadow-sm">
                  <h4 class="font-black text-xs text-slate-950 dark:text-white dark:text-glow-purple uppercase tracking-wider mb-1.5">${t.missionTitle}</h4>
                  <p class="text-[10px] text-slate-600 dark:text-slate-450 leading-relaxed font-semibold">${t.missionDesc}</p>
                </div>
                
                <div class="bg-white dark:bg-[#111827] p-4 rounded-xl border border-slate-150 dark:border-slate-850 shadow-sm">
                  <h4 class="font-black text-xs text-slate-950 dark:text-white dark:text-glow-pink uppercase tracking-wider mb-1.5">${lang === 'ta' ? 'எங்கள் தாரக மந்திரம்' : 'Platform Nature'}</h4>
                  <p class="text-[10px] text-slate-600 dark:text-slate-450 leading-relaxed font-semibold">${t.value1Desc}</p>
                </div>
              </div>

            </div>
          ` : currentTab === 'contact' ? `
            <!-- TAB 5: CONTACT PAGE (Strict Offline form + Success dialog integration) -->
            <div class="space-y-4">
              <div class="space-y-1">
                <h2 class="text-base font-black text-slate-950 dark:text-white tracking-tight uppercase">${t.contactTitle}</h2>
                <p class="text-[9px] text-slate-500 dark:text-slate-400 font-semibold leading-tight">${t.contactDesc}</p>
              </div>

              ${contactSuccess ? `
                <div class="bg-green-100 border border-green-300 dark:bg-neon-pink/10 dark:border-neon-pink/30 p-4 rounded-xl text-center space-y-3">
                  <div class="mx-auto w-10 h-10 bg-green-200 dark:bg-neon-pink/20 rounded-full flex items-center justify-center text-green-700 dark:text-neon-pink">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"></path>
                    </svg>
                  </div>
                  <p class="text-[10.5px] font-black text-green-800 dark:text-neon-pink leading-snug">${t.msgSuccess}</p>
                  <button id="contact-reset-btn" class="px-4 py-1.5 bg-slate-950 dark:bg-slate-900 border dark:border-slate-800 text-white rounded-lg text-[9px] font-black uppercase">Ok</button>
                </div>
              ` : `
                <form id="contact-form-renderer" class="bg-white dark:bg-[#111827] p-4 rounded-xl border border-slate-150 dark:border-slate-850 shadow-sm space-y-3.5">
                  <div>
                    <label class="block text-[8.5px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">${t.nameLabel}</label>
                    <input 
                      type="text" 
                      id="form-name-input" 
                      required 
                      placeholder="சரவணன் குமார்" 
                      class="w-full px-3 py-2.5 rounded-lg text-[10px] font-bold text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-950 border dark:border-slate-800 focus:outline-none focus:ring-1 focus:ring-neon-purple"
                    />
                  </div>

                  <div>
                    <label class="block text-[8.5px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">${t.emailLabel}</label>
                    <input 
                      type="email" 
                      id="form-email-input" 
                      required 
                      placeholder="saravanan@gmail.com" 
                      class="w-full px-3 py-2.5 rounded-lg text-[10px] font-bold text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-950 border dark:border-slate-800 focus:outline-none focus:ring-1 focus:ring-neon-purple"
                    />
                  </div>

                  <div>
                    <label class="block text-[8.5px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">${t.messageLabel}</label>
                    <textarea 
                      id="form-message-input" 
                      rows="3" 
                      required 
                      placeholder="அன்புடன், எனக்கு தரம் 11 கணித வினாத்தாள் தேவைப்படுகிறது..." 
                      class="w-full px-3 py-2.5 rounded-lg text-[10px] font-bold text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-950 border dark:border-slate-800 focus:outline-none focus:ring-1 focus:ring-neon-purple"
                    ></textarea>
                  </div>

                  <button type="submit" class="w-full py-2.5 bg-gradient-to-r from-neon-purple to-neon-cyan hover:from-neon-cyan hover:to-neon-pink text-slate-950 font-black text-[10.5px] uppercase tracking-wider rounded-lg transition-all shadow-md">
                    ${t.sendMsg}
                  </button>
                </form>
              `}

              <!-- Help details -->
              <section class="bg-slate-100 dark:bg-[#111827] rounded-xl p-4 border border-slate-200 dark:border-slate-900 flex flex-col space-y-2">
                <div class="flex items-center space-x-2 text-[10px] text-slate-600 dark:text-slate-300 font-bold">
                  <svg class="w-4 h-4 text-neon-cyan" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                  </svg>
                  <span>${lang === 'ta' ? 'அமைவிடம்: முல்லைதீவு, இலங்கை.' : 'Location: Mullaitivu, Sri Lanka.'}</span>
                </div>
                <div class="flex items-center space-x-2 text-[10px] text-slate-600 dark:text-slate-300 font-bold">
                  <svg class="w-4 h-4 text-neon-purple" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                  </svg>
                  <span>mrmpbsofficel@gmail.com</span>
                </div>
              </section>
            </div>
          ` : ''}
          
        </div>

        <!-- STYLISH SMARTPHONE BOTTON BAR (DYNAMIC CHROME TABS) -->
        <div class="bg-slate-50 dark:bg-[#0c1221] border-t border-slate-200 dark:border-slate-900 pt-1.5 pb-4.5 sm:pb-1.5 px-1 flex justify-around items-center shrink-0 shadow-inner relative transition-colors duration-300">
          
          <!-- Tab Item 1: Home -->
          <button id="nav-tab-home" class="flex flex-col items-center justify-center p-0.5 rounded-xl transition duration-300 cursor-pointer select-none" style="width: 58px;">
            <div id="nav-tab-home-box" class="p-1 px-3 rounded-lg transition ${currentTab === 'home' ? 'bg-blue-100 dark:bg-neon-cyan/15 text-blue-600 dark:text-neon-cyan border border-blue-200/40 dark:border-neon-cyan/25' : 'text-slate-400 dark:text-slate-500'}">
              <svg class="w-4 h-4 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
              </svg>
            </div>
            <span class="text-[7px] font-black uppercase mt-1 tracking-wider text-center truncate w-full">${t.home}</span>
          </button>

          <!-- Tab Item 2: Books -->
          <button id="nav-tab-books" class="flex flex-col items-center justify-center p-0.5 rounded-xl transition duration-300 cursor-pointer select-none" style="width: 58px;">
            <div id="nav-tab-books-box" class="p-1 px-3 rounded-lg transition ${currentTab === 'books' ? 'bg-blue-100 dark:bg-neon-cyan/15 text-blue-600 dark:text-neon-cyan border border-blue-200/40 dark:border-neon-cyan/25' : 'text-slate-400 dark:text-slate-500'}">
              <svg class="w-4 h-4 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
              </svg>
            </div>
            <span class="text-[7px] font-black uppercase mt-1 tracking-wider text-center truncate w-full">${t.books}</span>
          </button>

          <!-- Tab Item 3: Papers -->
          <button id="nav-tab-papers" class="flex flex-col items-center justify-center p-0.5 rounded-xl transition duration-300 cursor-pointer select-none" style="width: 58px;">
            <div id="nav-tab-papers-box" class="p-1 px-3 rounded-lg transition ${currentTab === 'papers' ? 'bg-blue-100 dark:bg-neon-cyan/15 text-blue-600 dark:text-neon-cyan border border-blue-200/40 dark:border-neon-cyan/25' : 'text-slate-400 dark:text-slate-500'}">
              <svg class="w-4 h-4 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
              </svg>
            </div>
            <span class="text-[7px] font-black uppercase mt-1 tracking-wider text-center truncate w-full">${t.papers}</span>
          </button>

          <!-- Tab Item 4: Videos -->
          <button id="nav-tab-videos" class="flex flex-col items-center justify-center p-0.5 rounded-xl transition duration-300 cursor-pointer select-none" style="width: 58px;">
            <div id="nav-tab-videos-box" class="p-1 px-3 rounded-lg transition ${currentTab === 'videos' ? 'bg-blue-100 dark:bg-neon-cyan/15 text-blue-600 dark:text-neon-cyan border border-blue-200/40 dark:border-neon-cyan/25' : 'text-slate-400 dark:text-slate-500'}">
              <svg class="w-4 h-4 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
              </svg>
            </div>
            <span class="text-[7px] font-black uppercase mt-1 tracking-wider text-center truncate w-full">${t.videos}</span>
          </button>

          <!-- Tab Item 5: About -->
          <button id="nav-tab-about" class="flex flex-col items-center justify-center p-0.5 rounded-xl transition duration-300 cursor-pointer select-none" style="width: 58px;">
            <div id="nav-tab-about-box" class="p-1 px-3 rounded-lg transition ${currentTab === 'about' ? 'bg-blue-100 dark:bg-neon-cyan/15 text-blue-600 dark:text-neon-cyan border border-blue-200/40 dark:border-neon-cyan/25' : 'text-slate-400 dark:text-slate-500'}">
              <svg class="w-4 h-4 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <span class="text-[7px] font-black uppercase mt-1 tracking-wider text-center truncate w-full">${t.about}</span>
          </button>

          <!-- Tab Item 6: Contact -->
          <button id="nav-tab-contact" class="flex flex-col items-center justify-center p-0.5 rounded-xl transition duration-300 cursor-pointer select-none" style="width: 58px;">
            <div id="nav-tab-contact-box" class="p-1 px-3 rounded-lg transition ${currentTab === 'contact' ? 'bg-blue-100 dark:bg-neon-cyan/15 text-blue-600 dark:text-neon-cyan border border-blue-200/40 dark:border-neon-cyan/25' : 'text-slate-400 dark:text-slate-500'}">
              <svg class="w-4 h-4 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
              </svg>
            </div>
            <span class="text-[7px] font-black uppercase mt-1 tracking-wider text-center truncate w-full">${t.contact}</span>
          </button>

        </div>

      </div>

      <!-- ACTIVE STYLISH NATIVE PDF DRAWER PREVIEW POPUP OVERLAY -->
      ${activePdfUrl ? `
        <div class="fixed inset-0 bg-slate-900/85 backdrop-blur-sm flex items-center justify-center p-4 z-[9999]">
          <div class="bg-white dark:bg-[#0e1626] rounded-2xl w-full max-w-sm border dark:border-neon-cyan/40 p-4 space-y-4 shadow-2xl relative animate-in fade-in zoom-in duration-200">
            <div class="flex justify-between items-start">
              <div class="flex items-center space-x-2">
                <div class="p-1 bg-red-100 dark:bg-neon-pink/10 text-red-600 dark:text-neon-pink rounded-lg">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
                  </svg>
                </div>
                <div class="min-w-0">
                  <h4 class="font-black text-[11px] text-slate-950 dark:text-white truncate leading-tight">${activePdfTitle}</h4>
                  <span class="text-[7.5px] text-slate-400 font-bold block uppercase tracking-widest mt-0.5">${lang === 'ta' ? 'கல்வி ஆவணம் சிப்பம்' : 'Standard PDF Format'}</span>
                </div>
              </div>
              
              <!-- Close overlay button -->
              <button id="pdf-close-btn" class="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-md transition hover:bg-slate-100 dark:hover:bg-slate-900">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>

            <!-- Smart document loader mock screen -->
            <div class="bg-slate-100 dark:bg-slate-950 rounded-xl p-6 text-center border border-slate-200 dark:border-slate-900 flex flex-col justify-center items-center space-y-3.5 select-none">
              <svg class="w-9 h-9 text-blue-500 dark:text-neon-cyan animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
              </svg>
              <div>
                <p class="text-[10px] font-extrabold text-slate-700 dark:text-slate-200 leading-tight">${lang === 'ta' ? 'அரசு தாள்கள் வாசிப்புத் திரையகம்' : 'Direct Document Access System'}</p>
                <p class="text-[8px] text-slate-400 font-bold block mt-1">${lang === 'ta' ? 'சிறந்த முறையில் படித்து வெற்றி பெறுங்கள்!' : 'Please click below to read or save this file'}</p>
              </div>
            </div>

            <!-- Action launchers -->
            <div class="grid grid-cols-2 gap-2">
              <a href="${activePdfUrl}" target="_blank" download="${activePdfTitle}.pdf" class="p-2.5 bg-blue-600 dark:bg-neon-cyan text-white dark:text-slate-950 font-black text-[10px] uppercase text-center rounded-xl transition shadow hover:opacity-90 flex items-center justify-center space-x-1.5 cursor-pointer">
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
                </svg>
                <span>${lang === 'ta' ? 'பதிவிறக்கு' : 'Download PDF'}</span>
              </a>
              <button id="pdf-copy-btn" class="p-2.5 bg-slate-100 dark:bg-slate-900 border dark:border-slate-800 text-slate-700 dark:text-slate-300 font-black text-[10px] uppercase text-center rounded-xl transition hover:bg-slate-200 dark:hover:bg-slate-800 flex items-center justify-center space-x-1.5">
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"></path>
                </svg>
                <span id="copy-btn-text">${lang === 'ta' ? 'இணைப்பை நகலெடு' : 'Copy link'}</span>
              </button>
            </div>
          </div>
        </div>
      ` : ''}

    </div>
  `;

  // REGISTER AND BIND DETAILED INTERACTIVE CLICK HANDLERS
  bindEvents();
}

function bindEvents() {
  // Navigation tabs
  const tabs = ['home', 'books', 'papers', 'videos', 'about', 'contact'];
  tabs.forEach((tab) => {
    const tabBtn = document.getElementById(`nav-tab-${tab}`);
    if (tabBtn) {
      tabBtn.onclick = () => {
        currentTab = tab as any;
        contactSuccess = false;
        // Clean search keyword on home switch if not looking with keyword
        if (tab !== 'books' && tab !== 'papers' && tab !== 'videos') {
          searchKeyword = '';
        }
        renderApp();
      };
    }
  });

  // Language buttons
  const taBtn = document.getElementById('lang-ta-btn');
  if (taBtn) {
    taBtn.onclick = () => {
      lang = 'ta';
      renderApp();
    };
  }

  const enBtn = document.getElementById('lang-en-btn');
  if (enBtn) {
    enBtn.onclick = () => {
      lang = 'en';
      renderApp();
    };
  }

  // Theme switch button
  const themeBtn = document.getElementById('theme-toggle-btn');
  if (themeBtn) {
    themeBtn.onclick = () => {
      darkMode = !darkMode;
      renderApp();
    };
  }

  // Home interactive features
  const homeSearchForm = document.getElementById('home-search-form');
  if (homeSearchForm) {
    homeSearchForm.onsubmit = (e) => {
      e.preventDefault();
      const input = document.getElementById('home-search-input') as HTMLInputElement | null;
      if (input) {
        searchKeyword = input.value;
        // Intelligently direct to papers or books
        if (searchKeyword.toLowerCase().includes('paper') || searchKeyword.toLowerCase().includes('வினா') || searchKeyword.includes('20')) {
          currentTab = 'papers';
        } else {
          currentTab = 'books';
        }
        renderApp();
      }
    };
  }

  const exploreBooksBtn = document.getElementById('home-explore-books-btn');
  if (exploreBooksBtn) {
    exploreBooksBtn.onclick = () => {
      currentTab = 'books';
      selectedGrade = 'All';
      selectedSubject = 'All';
      searchKeyword = '';
      renderApp();
    };
  }

  // Filter bindings on Books tab
  const bookSearch = document.getElementById('book-filter-search') as HTMLInputElement | null;
  if (bookSearch) {
    bookSearch.oninput = (e: any) => {
      searchKeyword = e.target.value;
      // Filter directly inside of the view update list
      const booksGrid = document.getElementById('books-grid-renderer');
      if (booksGrid) renderApp();
    };
  }

  const bookGrade = document.getElementById('book-grade-select') as HTMLSelectElement | null;
  if (bookGrade) {
    bookGrade.onchange = (e: any) => {
      selectedGrade = e.target.value;
      renderApp();
    };
  }

  const bookSub = document.getElementById('book-subject-select') as HTMLSelectElement | null;
  if (bookSub) {
    bookSub.onchange = (e: any) => {
      selectedSubject = e.target.value;
      renderApp();
    };
  }

  // Filter bindings on Papers tab
  const paperSearch = document.getElementById('paper-filter-search') as HTMLInputElement | null;
  if (paperSearch) {
    paperSearch.oninput = (e: any) => {
      searchKeyword = e.target.value;
      renderApp();
    };
  }

  const paperExam = document.getElementById('paper-examtype-select') as HTMLSelectElement | null;
  if (paperExam) {
    paperExam.onchange = (e: any) => {
      selectedExamType = e.target.value;
      renderApp();
    };
  }

  const paperSub = document.getElementById('paper-subject-select') as HTMLSelectElement | null;
  if (paperSub) {
    paperSub.onchange = (e: any) => {
      selectedSubject = e.target.value;
      renderApp();
    };
  }

  // Filter bindings on Videos tab
  const videoSearch = document.getElementById('video-filter-search') as HTMLInputElement | null;
  if (videoSearch) {
    videoSearch.oninput = (e: any) => {
      searchKeyword = e.target.value;
      renderApp();
    };
  }

  const videoGrade = document.getElementById('video-grade-select') as HTMLSelectElement | null;
  if (videoGrade) {
    videoGrade.onchange = (e: any) => {
      selectedGrade = e.target.value;
      renderApp();
    };
  }

  const videoSub = document.getElementById('video-subject-select') as HTMLSelectElement | null;
  if (videoSub) {
    videoSub.onchange = (e: any) => {
      selectedSubject = e.target.value;
      renderApp();
    };
  }

  // Video play trigger buttons
  const videoTriggers = document.querySelectorAll('.video-trigger-btn');
  videoTriggers.forEach((btn: any) => {
    btn.onclick = () => {
      const ytid = btn.getAttribute('data-ytid');
      const title = btn.getAttribute('data-title');
      if (ytid) {
        activeVideoId = ytid;
        activeVideoTitle = title || '';
        renderApp();
      }
    };
  });

  // PDF Preview click launchers
  const pdfTriggers = document.querySelectorAll('.pdf-trigger-btn');
  pdfTriggers.forEach((btn: any) => {
    btn.onclick = () => {
      const url = btn.getAttribute('data-url');
      const title = btn.getAttribute('data-title');
      if (url) {
        activePdfUrl = url;
        activePdfTitle = title;
        renderApp();
      }
    };
  });

  // Modal actions
  const pdfClose = document.getElementById('pdf-close-btn');
  if (pdfClose) {
    pdfClose.onclick = () => {
      activePdfUrl = null;
      activePdfTitle = null;
      renderApp();
    };
  }

  const pdfCopy = document.getElementById('pdf-copy-btn');
  if (pdfCopy && activePdfUrl) {
    pdfCopy.onclick = () => {
      navigator.clipboard.writeText(activePdfUrl || '').then(() => {
        const copyText = document.getElementById('copy-btn-text');
        if (copyText) {
          copyText.innerText = lang === 'ta' ? 'நகலெடுக்கப்பட்டது!' : 'Copied link!';
          setTimeout(() => {
            if (copyText) copyText.innerText = lang === 'ta' ? 'இணைப்பை நகலெடு' : 'Copy link';
          }, 2000);
        }
      });
    };
  }

  // Contact tab Form Submit Handler
  const contactForm = document.getElementById('contact-form-renderer');
  if (contactForm) {
    contactForm.onsubmit = (e) => {
      e.preventDefault();
      contactSuccess = true;
      renderApp();
    };
  }

  const contactReset = document.getElementById('contact-reset-btn');
  if (contactReset) {
    contactReset.onclick = () => {
      contactSuccess = false;
      renderApp();
    };
  }
}

// Global bootstrap bootup
document.addEventListener('DOMContentLoaded', () => {
  startClock();
  loadData();
});

// Fallback if DOMContentLoaded has already fired
if (document.readyState === 'complete' || document.readyState === 'interactive') {
  startClock();
  loadData();
}
