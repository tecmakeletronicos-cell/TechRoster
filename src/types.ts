import { Timestamp } from 'firebase/firestore';

export type UserRole = 'developer' | 'company' | 'admin';

export type Seniority = 'Junior' | 'Pleno' | 'Senior' | 'Specialist';

export type DevStatus = 'Available' | 'Open to Offers' | 'Hired' | 'Inactive';

export interface Developer {
  id: string;
  uid: string;
  nome: string;
  email: string;
  photoURL?: string;
  skills: string[];
  experienceYears: number;
  seniority: Seniority;
  portfolioURL?: string;
  githubURL?: string;
  linkedinURL?: string;
  bio: string;
  status: DevStatus;
  isPremium: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface Company {
  id: string;
  uid: string;
  nome: string;
  email: string;
  logoURL?: string;
  website?: string;
  description: string;
  contactPerson: string;
  createdAt: Timestamp;
}

export interface Job {
  id: string;
  companyId: string;
  companyName: string;
  title: string;
  description: string;
  requirements: string[];
  salaryRange?: string;
  location: string;
  type: 'Remote' | 'Hybrid' | 'On-site';
  seniority: Seniority;
  status: 'Open' | 'Closed';
  createdAt: Timestamp;
}

export interface Application {
  id: string;
  jobId: string;
  developerId: string;
  status: 'Pending' | 'Reviewing' | 'Accepted' | 'Rejected';
  appliedAt: Timestamp;
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: Timestamp;
  isRead: boolean;
}
