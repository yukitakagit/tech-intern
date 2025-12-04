
export interface Company {
  id: string;
  name: string;
  logoUrl: string;
  location: string;
  mission?: string;
  description?: string;
  url?: string;
  members?: { name: string; role: string; image: string }[];
  address?: string;
  established?: string;
  representative?: string;
  industry?: string;
  coverImage?: string;
  employees?: string;
  businessContent?: string; // New field for Company Dashboard
}

export interface JobListing {
  id: string;
  title: string;
  company: Company;
  coverImageUrl: string;
  tags: string[];
  salary: string;
  type: 'Long-term' | 'Short-term';
  workStyle: 'Remote' | 'Hybrid' | 'On-site';
  description: string;
  requiredSkills: string[];
  status?: 'published' | 'draft'; // New field for draft functionality
  
  // Detailed fields
  businessContent?: string;
  jobDetail?: string;
  skillsGained?: string[];
  selectionFlow?: { step: number; title: string; description: string }[];
}

export interface Article {
  id: number;
  title: string;
  date: string;
  category: string;
  image: string;
  content: string; // Detailed content
  status?: 'published' | 'draft';
}

export interface FAQ {
  id: number;
  q: string;
  a: string;
  status?: 'published' | 'draft';
}

export interface FilterState {
  occupations: string[];
  languages: string[];
  industries: string[];
  areas: string[];
  characteristics: string[];
}

export interface UserProfile {
  name: string;
  gender: 'male' | 'female' | 'other' | '';
  phone: string;
  university: string;
  faculty: string;
  department: string;
  graduationYear: string;
  email: string;
  address: string;
  githubUrl: string;
  skills: string;
}

export type AppRoute = 
  | { name: 'HOME' }
  | { name: 'JOB_DETAIL'; id: string }
  | { name: 'COMPANY_DETAIL'; id: string; fromJobId?: string }
  | { name: 'COMPANY_LIST' }
  | { name: 'ARTICLE_DETAIL'; id: number }
  | { name: 'LOGIN' }
  | { name: 'REGISTER' }
  | { name: 'MYPAGE'; tab?: 'profile' | 'chat' | 'history' | 'status' | 'password' }
  | { name: 'APPLICATION'; jobId: string }
  | { name: 'COMPANY_PROFILE' }
  | { name: 'TERMS' }
  | { name: 'PRIVACY' }
  // Company Side Routes
  | { name: 'COMPANY_LP' }
  | { name: 'COMPANY_LOGIN' }
  | { name: 'COMPANY_REGISTER' }
  | { name: 'COMPANY_DASHBOARD' }
  | { name: 'ADMIN_DASHBOARD' };
