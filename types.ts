
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
  businessContent?: string;
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
  status?: 'published' | 'draft';
  
  // Detailed fields
  businessContent?: string;
  jobDetail?: string;
  skillsGained?: string[];
  skillsGainedDescription?: string;
  onboardingProcess?: string;
  selectionFlow?: { step: number; title: string; description: string }[];

  // New Detailed Fields
  alumniDestinations?: string; // インターン卒業生の内定先企業
  salaryDetail?: string; // 給与詳細
  probationPeriod?: string; // 試用期間
  probationSalary?: string; // 使用期間の給与
  transportationAllowance?: string; // 交通費の支給
  requirements?: string; // 応募資格
  workDays?: string; // 勤務曜日
  workFrequency?: string; // 勤務日数
  workHours?: string; // 勤務時間
  otherConditions?: string; // その他勤務条件 (Added)
  targetGrade?: string; // 対象学年
  numberOfHires?: string; // 募集人数
  workLocation?: string; // 勤務地
  nearestStation?: string; // 最寄り駅
}

export interface Article {
  id: number;
  title: string;
  date: string;
  category: string;
  image: string;
  content: string;
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
  | { name: 'ALL_JOBS' }
  | { name: 'JOB_DETAIL'; id: string }
  | { name: 'COMPANY_DETAIL'; id: string; fromJobId?: string }
  | { name: 'COMPANY_LIST' }
  | { name: 'ARTICLE_LIST' }
  | { name: 'ARTICLE_DETAIL'; id: number }
  | { name: 'LOGIN' }
  | { name: 'REGISTER' }
  | { name: 'MYPAGE'; tab?: 'profile' | 'chat' | 'history' | 'status' | 'password' }
  | { name: 'APPLICATION'; jobId: string }
  | { name: 'COMPANY_PROFILE' }
  | { name: 'TERMS' }
  | { name: 'PRIVACY' }
  | { name: 'TOKUSHO' }
  // Company Side Routes
  | { name: 'COMPANY_LP' }
  | { name: 'COMPANY_LOGIN' }
  | { name: 'COMPANY_REGISTER' }
  | { name: 'COMPANY_DASHBOARD' }
  | { name: 'ADMIN_DASHBOARD' };
