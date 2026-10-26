import { PersonaDetails, UserRole, UserProfile, Story } from '../types';

export const STORAGE_USER_KEY = 'pulsedaily_user_profile';
export const STORAGE_SAVED_KEY = 'pulsedaily_saved_stories';
export const STORAGE_ROLE_KEY = 'pulsedaily_active_role';

export const PERSONA_DEFINITIONS: Record<UserRole, PersonaDetails> = {
  'Founder / Exec': {
    role: 'Founder / Exec',
    title: 'Founder / Exec',
    icon: '🚀',
    tagline: 'High-level market positioning & business economics',
    focusAreas: [
      'Unit economics & inference margins',
      'Enterprise ROI & pricing leverage',
      'Competitive moats vs Big Tech',
      'Build-vs-buy engineering velocity',
    ],
    sampleQuestion: 'How does this shift our customer acquisition & gross margins?',
  },
  'Software Engineer': {
    role: 'Software Engineer',
    title: 'Software Engineer',
    icon: '💻',
    tagline: 'Technical architecture, SDK patterns & reliability',
    focusAreas: [
      'System architecture & latency budgets',
      '@google/genai SDK implementation patterns',
      'Deterministic schemas & token efficiency',
      'Cloud Run & container scalability',
    ],
    sampleQuestion: 'What APIs, schemas, and breaking contracts do I need to refactor?',
  },
  'Product Manager': {
    role: 'Product Manager',
    title: 'Product Manager',
    icon: '🧭',
    tagline: 'User engagement loops, adoption & feature roadmaps',
    focusAreas: [
      'Autonomous user task completion rates',
      'Feature prioritization & roadmap impact',
      'Agentic workflow UX & error recovery',
      'Retention metrics & customer onboarding',
    ],
    sampleQuestion: 'How will this improve user retention and task velocity?',
  },
};

export function isValidGmailAddress(email: string): boolean {
  if (!email || typeof email !== 'string') return false;
  const trimmed = email.trim().toLowerCase();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(trimmed)) return false;
  // Accept standard @gmail.com or Google-hosted domain addresses
  return trimmed.endsWith('@gmail.com') || trimmed.endsWith('@google.com') || trimmed.includes('.google.');
}

export function formatInitials(name: string): string {
  if (!name) return 'U';
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
}

export function formatWhyThisMattersTitle(name: string, role: UserRole): string {
  const displayName = name ? name.split(' ')[0] : 'You';
  return `✨ Why this matters for ${displayName} (${role})`;
}

export function createDefaultBreakingStory(
  topic: string,
  activeRole: UserRole,
  userName: string = 'Leader'
): Story {
  const cleanTopic = topic.trim() || 'Urgent AI Architecture Announcement';
  const id = `breaking-${Date.now()}`;
  const firstName = userName ? userName.split(' ')[0] : 'Team';

  let beat: 'Agentic AI' | 'Cloud & Infra' | 'Product & Strategy' = 'Agentic AI';
  const lower = cleanTopic.toLowerCase();
  if (lower.includes('cloud') || lower.includes('infra') || lower.includes('gpu') || lower.includes('postgres') || lower.includes('kubernetes')) {
    beat = 'Cloud & Infra';
  } else if (lower.includes('product') || lower.includes('pricing') || lower.includes('startup') || lower.includes('loop')) {
    beat = 'Product & Strategy';
  }

  return {
    id,
    title: `BREAKING: ${cleanTopic}`,
    url: 'https://news.ycombinator.com',
    domain: 'breaking.pulse.internal',
    author: 'live_detector',
    timeAgo: 'Just now',
    score: 520,
    commentsCount: 148,
    isBreaking: true,
    isGrounded: true,
    beat,
    velocityScore: 99,
    tldrBullets: [
      `Immediate industry alert detected regarding "${cleanTopic.slice(0, 50)}".`,
      `Sudden spike in engineering discussion across developer forums with 99% velocity momentum.`,
      `Critical immediate implications for AI roadmap, tooling decisions, and infrastructure commitments.`
    ],
    roleImpact: {
      'Founder / Exec': `Executive Takeaway for ${firstName}: Assess competitive exposure immediately. This announcement directly impacts unit economics and customer expectations for enterprise software.`,
      'Software Engineer': `Engineering Takeaway for ${firstName}: Review current microservice dependencies and prepare integration benchmarks against these new specifications to avoid architectural debt.`,
      'Product Manager': `Product Takeaway for ${firstName}: Re-evaluate the active quarter roadmap. Key competitor and user expectations will shift toward this standard within weeks.`
    }
  };
}

export const DEFAULT_USER_PROFILE: UserProfile = {
  name: 'Alex Rivera',
  email: 'alex.rivera@corp.pulse.internal',
  avatar: 'AR',
  role: 'Software Engineer',
  isSignedIn: false,
  notificationsEnabled: false,
  savedStoryIds: [101, 103],
  joinedAt: 'October 2026',
};
