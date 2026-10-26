export type UserRole = 'Software Engineer' | 'Product Manager' | 'Founder / Exec';

export type TopicBeat = 'For you' | 'Following' | 'Agentic AI' | 'Cloud & Infra' | 'Product & Strategy';

export interface PersonaDetails {
  role: UserRole;
  title: string;
  icon: string;
  tagline: string;
  focusAreas: string[];
  sampleQuestion: string;
}

export interface Story {
  id: number | string;
  title: string;
  url: string;
  domain: string;
  author: string;
  timeAgo: string;
  score: number;
  commentsCount: number;
  isBreaking: boolean;
  isGrounded: boolean;
  beat: 'Agentic AI' | 'Cloud & Infra' | 'Product & Strategy';
  tldrBullets: string[];
  roleImpact: Record<UserRole, string>;
  fullSummary?: string;
  velocityScore?: number;
}

export interface UserProfile {
  name: string;
  email: string;
  avatar: string;
  role: UserRole;
  isSignedIn: boolean;
  notificationsEnabled: boolean;
  savedStoryIds: (number | string)[];
  joinedAt?: string;
}
