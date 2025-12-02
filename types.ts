
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
  employees?: string; // New field
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
}

export interface FilterState {
  occupation: string[];
  location: string[];
  skills: string[];
  characteristics: string[];
}
