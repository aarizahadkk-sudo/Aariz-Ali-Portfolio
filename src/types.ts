export interface Profile {
  name: string;
  title: string;
  headline: string;
  bio: string;
  location: string;
  email: string;
  avatarUrl: string;
  githubUrl: string;
  linkedinUrl: string;
  yearsExperience: number;
  completedProjects: number;
  openForOpportunities: boolean;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  category: 'Enterprise' | 'Cloud & API' | 'Full-Stack' | 'Microservices';
  techStack: string[];
  imageUrl: string;
  liveDemoUrl: string;
  githubUrl: string;
  featured: boolean;
  order: number;
  dateCreated: string;
  metrics?: string;
}

export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface AdminCredentials {
  email: string;
  password: string;
  updatedAt: string;
}

export interface AdminSession {
  isAuthenticated: boolean;
  userEmail: string;
  loginTimestamp: number;
}
