export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'student';
}

export interface Book {
  id: string;
  title: string;
  grade: string; // "Grade 6" to "Grade 13"
  subject: string;
  pdfUrl: string;
  createdAt: any; // Firestore Timestamp
}

export interface PastPaper {
  id: string;
  year: string;
  examType: 'O/L' | 'A/L';
  subject: string;
  pdfUrl: string;
  createdAt: any; // Firestore Timestamp
}

export type GradeLevel = 
  | 'All' 
  | 'Grade 6' 
  | 'Grade 7' 
  | 'Grade 8' 
  | 'Grade 9' 
  | 'Grade 10' 
  | 'Grade 11' 
  | 'Grade 12' 
  | 'Grade 13';

export type ExamType = 'All' | 'O/L' | 'A/L';
export type SubjectFilter = 'All' | string;
