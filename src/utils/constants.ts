import { Book, PastPaper } from '../types';

export const GRADES = [
  'Grade 6',
  'Grade 7',
  'Grade 8',
  'Grade 9',
  'Grade 10',
  'Grade 11',
  'Grade 12',
  'Grade 13'
];

export const SUBJECTS = [
  'tamil_subject', // "தமிழ் மொழி"
  'maths_subject',  // "கணிதம்"
  'science_subject', // "விஞ்ஞானம்"
  'history_subject', // "வரலாறு"
  'geo_subject',     // "புவியியல்"
  'ict_subject',     // "தகவல் தொழில்நுட்பம்"
  'comb_maths',      // "இணைந்த கணிதம்"
  'physics_subject', // "பௌதிகவியல்"
  'chem_subject',    // "இரசாயனவியல்"
  'bio_subject',     // "உயிரியல்"
  'commerce_subject',// "வர்த்தகம்"
  'econ_subject',    // "பொருளியல்"
  'acc_subject',     // "கணக்கியல்"
];

// Human-readable Tamil translation mapping for grades, subjects, etc.
export const TAMIL_MAP: Record<string, string> = {
  // Grades
  'Grade 6': 'தரம் 6',
  'Grade 7': 'தரம் 7',
  'Grade 8': 'தரம் 8',
  'Grade 9': 'தரம் 9',
  'Grade 10': 'தரம் 10',
  'Grade 11': 'தரம் 11 (O/L)',
  'Grade 12': 'தரம் 12',
  'Grade 13': 'தரம் 13 (A/L)',
  'All': 'அனைத்தும்',

  // Exam Types
  'O/L': 'க.பொ.த (சாதாரண தரம்)',
  'A/L': 'க.பொ.த (உயர் தரம்)',

  // Subjects
  'tamil_subject': 'தமிழ் மொழியும் இலக்கியமும்',
  'maths_subject': 'கணிதம் (Mathematics)',
  'science_subject': 'விஞ்ஞானம் (Science)',
  'history_subject': 'வரலாறு (History)',
  'geo_subject': 'புவியியல் (Geography)',
  'ict_subject': 'தகவல் தொடர்பாடல் தொழில்நுட்பம் (ICT)',
  'comb_maths': 'இணைந்த கணிதம் (Combined Mathematics)',
  'physics_subject': 'பௌதிகவியல் (Physics)',
  'chem_subject': 'இரசாயனவியல் (Chemistry)',
  'bio_subject': 'உயிரியல் (Biology)',
  'commerce_subject': 'வர்த்தகக் கல்வி (Business Studies)',
  'econ_subject': 'பொருளியல் (Economics)',
  'acc_subject': 'கணக்கியல் (Accounting)',
  
  // Custom text fallback
  'Tamil': 'தமிழ் மொழி',
  'Mathematics': 'கணிதம்',
  'Science': 'விஞ்ஞானம்',
  'History': 'வரலாறு',
  'ICT': 'தகவல் தொழில்நுட்பம்',
  'Combined Mathematics': 'இணைந்த கணிதம்',
  'Physics': 'பௌதிகவியல்',
  'Chemistry': 'இரசாயனவியல்',
  'Biology': 'உயிரியல்',
  'Economics': 'பொருளியல்',
  'Accounting': 'கணக்கியல்'
};

export const DEFAULT_BOOKS: Book[] = [
  {
    id: 'book-math-11',
    title: 'விஞ்ஞானம் தரம் 11 - முதலாம் பாகம்',
    grade: 'Grade 11',
    subject: 'science_subject',
    pdfUrl: 'http://www/nie.lk/pdffiles/tg/tGr11tg%20Science%20I.pdf',
    createdAt: { seconds: 1774864000 }
  },
  {
    id: 'book-math-10',
    title: 'கணிதம் தரம் 10 - முதலாம் பாகம்',
    grade: 'Grade 10',
    subject: 'maths_subject',
    pdfUrl: 'http://www/nie.lk/pdffiles/tg/tGr10tg%20Maths%20I.pdf',
    createdAt: { seconds: 1774864100 }
  },
  {
    id: 'book-tamil-11',
    title: 'தமிழ் மொழியும் இலக்கியமும் தரம் 11',
    grade: 'Grade 11',
    subject: 'tamil_subject',
    pdfUrl: 'http://www/nie.lk/pdffiles/tg/tGr11tg%2520Tamil.pdf',
    createdAt: { seconds: 1774864200 }
  },
  {
    id: 'book-ict-10',
    title: 'தொடர்பாடல் தொழில்நுட்பம் தரம் 10',
    grade: 'Grade 10',
    subject: 'ict_subject',
    pdfUrl: 'http://www/nie.lk/pdffiles/tg/tGr10tg%20ICT.pdf',
    createdAt: { seconds: 1774864300 }
  },
  {
    id: 'book-comb-12',
    title: 'Combined Mathematics Grade 12',
    grade: 'Grade 12',
    subject: 'comb_maths',
    pdfUrl: 'http://www/nie.lk/pdffiles/tg/tGr12tg%20CombinedMaths%20I.pdf',
    createdAt: { seconds: 1774864400 }
  },
  {
    id: 'book-physics-13',
    title: 'பௌதிகவியல் தரம் 13 - அலகு 4,5',
    grade: 'Grade 13',
    subject: 'physics_subject',
    pdfUrl: 'http://www/nie.lk/pdffiles/tg/tGr13tg%20Physics.pdf',
    createdAt: { seconds: 1774864500 }
  }
];

export const DEFAULT_PAST_PAPERS: PastPaper[] = [
  {
    id: 'paper-math-11-2023',
    year: '2023',
    examType: 'O/L',
    subject: 'maths_subject',
    pdfUrl: 'https://pastpapers.wiki/wp-content/uploads/2024/01/2023-OL-Mathematics-Paper-Tamil-Medium.pdf',
    createdAt: { seconds: 1774863000 }
  },
  {
    id: 'paper-science-11-2023',
    year: '2023',
    examType: 'O/L',
    subject: 'science_subject',
    pdfUrl: 'https://pastpapers.wiki/wp-content/uploads/2024/01/2023-OL-Science-Paper-Tamil-Medium.pdf',
    createdAt: { seconds: 1774863100 }
  },
  {
    id: 'paper-comb-13-2023',
    year: '2023',
    examType: 'A/L',
    subject: 'comb_maths',
    pdfUrl: 'https://pastpapers.wiki/wp-content/uploads/2023/12/2023-AL-Combined-Maths-Paper-Tamil-Medium.pdf',
    createdAt: { seconds: 1774863200 }
  },
  {
    id: 'paper-physics-13-2022',
    year: '2022',
    examType: 'A/L',
    subject: 'physics_subject',
    pdfUrl: 'https://pastpapers.wiki/wp-content/uploads/2023/02/2022-AL-Physics-Paper-Tamil-Medium.pdf',
    createdAt: { seconds: 1774863300 }
  },
  {
    id: 'paper-chem-13-2022',
    year: '2022',
    examType: 'A/L',
    subject: 'chem_subject',
    pdfUrl: 'https://pastpapers.wiki/wp-content/uploads/2023/02/2022-AL-Chemistry-Paper-Tamil-Medium.pdf',
    createdAt: { seconds: 1774863400 }
  }
];
