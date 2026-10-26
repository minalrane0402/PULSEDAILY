import { Story, UserRole } from '../types';

export const FALLBACK_STORIES: Story[] = [
  {
    id: 101,
    title: "Google DeepMind unveils Gemini 2.5 with native tool-use and sub-agent coordination",
    url: "https://deepmind.google/technologies/gemini/",
    domain: "deepmind.google",
    author: "demishassabis",
    timeAgo: "23m ago",
    score: 412,
    commentsCount: 184,
    isBreaking: true,
    isGrounded: true,
    beat: "Agentic AI",
    velocityScore: 98,
    tldrBullets: [
      "Native agentic framework enables recursive tool orchestration with zero prompt bloat.",
      "Achieves 42% lower latency in multi-turn reasoning and code generation tasks.",
      "Introduces deterministic schema enforcement (responseSchema) directly into the token sampler."
    ],
    roleImpact: {
      "Software Engineer": "Enables building multi-agent architectures directly via @google/genai SDK without fragile custom JSON repair pipelines.",
      "Product Manager": "Dramatically cuts time-to-market for complex assistant workflows with built-in tool verification and lower unit economics.",
      "Founder / Exec": "Compresses team engineering cycles by 30%, unlocking automated enterprise workflows that previously required custom fine-tuned models."
    }
  },
  {
    id: 102,
    title: "Kubernetes 1.32 introduces dynamic resource allocation for distributed GPU clusters",
    url: "https://kubernetes.io/blog/2026/k8s-gpu-allocator/",
    domain: "kubernetes.io",
    author: "k8s_sig_node",
    timeAgo: "1h ago",
    score: 289,
    commentsCount: 97,
    isBreaking: false,
    isGrounded: true,
    beat: "Cloud & Infra",
    velocityScore: 74,
    tldrBullets: [
      "Dynamic Resource Allocation (DRA) graduated to GA for multi-node accelerator pools.",
      "Automates GPU slicing and fractional memory scheduling across heterogeneous AI chips.",
      "Reduces idle cluster spend by dynamically reallocating idle VRAM to inference microservices."
    ],
    roleImpact: {
      "Software Engineer": "No more manual CUDA device pinning or custom DaemonSet patches for mixed A100/H100/L4 workloads.",
      "Product Manager": "Lower compute infrastructure costs translate directly into higher gross margins for AI-powered SaaS features.",
      "Founder / Exec": "Cuts cloud GPU spend by up to 35% without degrading high-throughput SLA guarantees for real-time customer queries."
    }
  },
  {
    id: 103,
    title: "The Agentic Shift: How AI-First Startups are Redesigning the Modern Product Loop",
    url: "https://stratechery.com/2026/agentic-product-design/",
    domain: "stratechery.com",
    author: "benthompson",
    timeAgo: "2h ago",
    score: 356,
    commentsCount: 142,
    isBreaking: true,
    isGrounded: true,
    beat: "Product & Strategy",
    velocityScore: 91,
    tldrBullets: [
      "Traditional CRUD SaaS dashboards are being replaced by proactive background agents.",
      "User retention now correlates with agent task completion rates rather than daily screen time.",
      "New monetization models shift from seat-based pricing to verified task-outcome milestones."
    ],
    roleImpact: {
      "Software Engineer": "Shift engineering focus from complex form UI components to idempotent background task execution engines.",
      "Product Manager": "Reframe core North Star metrics from Daily Active Minutes to Autonomous Job Success Rate.",
      "Founder / Exec": "Rethink sales pitch and revenue architecture: outcome-based contracts command 2.4x higher ARR with lower churn."
    }
  },
  {
    id: 104,
    title: "Stitch and Material Design 3 introduce strict zero-blur design guidelines for enterprise apps",
    url: "https://stitch.withgoogle.com/guidelines/zero-blur",
    domain: "stitch.withgoogle.com",
    author: "design_lead",
    timeAgo: "3h ago",
    score: 198,
    commentsCount: 65,
    isBreaking: false,
    isGrounded: true,
    beat: "Product & Strategy",
    velocityScore: 68,
    tldrBullets: [
      "Deprecates heavy backdrop-blur in high-density professional dashboards in favor of 100% solid contrast.",
      "Enforces Google News style 2-tier sticky headers with hairline 1px #DADCE0 borders.",
      "Improves accessibility and visual scanning speeds by 24% in data-heavy enterprise tools."
    ],
    roleImpact: {
      "Software Engineer": "Eliminates expensive CSS paint cycles caused by nested glassmorphism, improving rendering speed on mobile browsers.",
      "Product Manager": "Ensures design consistency and high legibility across all browser viewports without visual clutter.",
      "Founder / Exec": "Adopts enterprise-grade Google design standards that convey reliability, security, and polished craftsmanship to B2B buyers."
    }
  },
  {
    id: 105,
    title: "PostgreSQL 18 introduces native vector indexing with sub-millisecond similarity search",
    url: "https://postgresql.org/about/news/pg18-vector/",
    domain: "postgresql.org",
    author: "pg_core",
    timeAgo: "4h ago",
    score: 512,
    commentsCount: 231,
    isBreaking: false,
    isGrounded: true,
    beat: "Cloud & Infra",
    velocityScore: 82,
    tldrBullets: [
      "Native HNSW and DiskANN indexing built directly into Postgres core engine without external extensions.",
      "Supports billion-scale vector collections with SIMD-accelerated distance functions.",
      "Integrates relational constraints and transactions directly with vector similarity queries."
    ],
    roleImpact: {
      "Software Engineer": "Dramatically simplifies stack architecture by eliminating the need for standalone vector databases like Pinecone or Qdrant.",
      "Product Manager": "Simplifies data compliance and GDPR workflows since user data and vector embeddings live in one single ACID database.",
      "Founder / Exec": "Removes multi-vendor licensing costs and reduces engineering maintenance overhead for our RAG pipeline."
    }
  },
  {
    id: 106,
    title: "Autonomous Coding Agents benchmark reaches 89% on SWE-bench Verified",
    url: "https://github.com/features/agent-runtime",
    domain: "github.com",
    author: "swe_researcher",
    timeAgo: "5h ago",
    score: 420,
    commentsCount: 198,
    isBreaking: false,
    isGrounded: true,
    beat: "Agentic AI",
    velocityScore: 85,
    tldrBullets: [
      "New test-time compute loops verify git diffs across automated test suites before committing.",
      "Self-correcting compiler sandboxes drop syntax failure rates to near zero.",
      "Multi-agent code reviews catch subtle edge cases and race conditions automatically."
    ],
    roleImpact: {
      "Software Engineer": "Agents now successfully resolve complex multi-file bug reports and refactoring tasks with minimal human intervention.",
      "Product Manager": "Enables engineering teams to tackle technical debt backlogs and legacy migrations in days instead of quarters.",
      "Founder / Exec": "Increases software delivery throughput by 4x, allowing lean startups to compete with large engineering teams."
    }
  }
];

export function extractDomain(urlStr: string): string {
  try {
    const url = new URL(urlStr);
    return url.hostname.replace(/^www\./, '');
  } catch {
    return 'news.ycombinator.com';
  }
}

export function classifyBeat(title: string): 'Agentic AI' | 'Cloud & Infra' | 'Product & Strategy' {
  const lower = title.toLowerCase();
  if (
    lower.includes('cloud') ||
    lower.includes('infra') ||
    lower.includes('k8s') ||
    lower.includes('kubernetes') ||
    lower.includes('database') ||
    lower.includes('postgres') ||
    lower.includes('linux') ||
    lower.includes('gpu') ||
    lower.includes('server') ||
    lower.includes('devops') ||
    lower.includes('docker') ||
    lower.includes('cpu') ||
    lower.includes('network')
  ) {
    return 'Cloud & Infra';
  }
  if (
    lower.includes('strategy') ||
    lower.includes('startup') ||
    lower.includes('product') ||
    lower.includes('design') ||
    lower.includes('growth') ||
    lower.includes('business') ||
    lower.includes('market') ||
    lower.includes('saas') ||
    lower.includes('pricing') ||
    lower.includes('ui') ||
    lower.includes('ux')
  ) {
    return 'Product & Strategy';
  }
  return 'Agentic AI';
}

export function generateDynamicRoleImpact(title: string, beat: string): Record<UserRole, string> {
  if (beat === 'Agentic AI') {
    return {
      "Software Engineer": `Evaluate API SDK integration, prompt tokens, and structured response schema for "${title.slice(0, 40)}...".`,
      "Product Manager": `Assess impact on user workflow velocity and feature retention for automated agent capabilities.`,
      "Founder / Exec": `Capitalize on AI efficiency gains to outpace legacy competitors with lower operational overhead.`
    };
  } else if (beat === 'Cloud & Infra') {
    return {
      "Software Engineer": `Review infrastructure reliability, latency metrics, and deployment pipelines related to this release.`,
      "Product Manager": `Quantify compute budget efficiency, SLA commitments, and availability impact for end-users.`,
      "Founder / Exec": `Safeguard infrastructure scalability while keeping cloud margins healthy and predictable.`
    };
  } else {
    return {
      "Software Engineer": `Align architectural velocity with changing user experience paradigms and performance standards.`,
      "Product Manager": `Refine feature roadmaps and customer conversion loops around high-impact industry shifts.`,
      "Founder / Exec": `Position company brand and pricing models to capture emerging market demand.`
    };
  }
}

export function formatTimeAgo(timeSeconds: number): string {
  const now = Math.floor(Date.now() / 1000);
  const diffMinutes = Math.max(1, Math.floor((now - timeSeconds) / 60));
  if (diffMinutes < 60) return `${diffMinutes}m ago`;
  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  return `${Math.floor(diffHours / 24)}d ago`;
}

export async function fetchLiveNews(): Promise<{ stories: Story[]; isLive: boolean }> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);

    const res = await fetch('https://hacker-news.firebaseio.com/v0/topstories.json', {
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (!res.ok) throw new Error('HN API response error');

    const topIds: number[] = await res.json();
    const sliceIds = topIds.slice(0, 15);

    const itemPromises = sliceIds.map(async (id) => {
      try {
        const itemRes = await fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`);
        if (!itemRes.ok) return null;
        return await itemRes.json();
      } catch {
        return null;
      }
    });

    const items = (await Promise.all(itemPromises)).filter((item) => item && item.title);

    if (items.length < 3) {
      return { stories: FALLBACK_STORIES, isLive: false };
    }

    const parsedStories: Story[] = items.map((item, index) => {
      const beat = classifyBeat(item.title);
      const isBreaking = item.score > 150 || (index < 2 && item.score > 80);
      const domain = item.url ? extractDomain(item.url) : 'news.ycombinator.com';
      const timeAgo = item.time ? formatTimeAgo(item.time) : `${index * 15 + 10}m ago`;

      return {
        id: item.id,
        title: item.title,
        url: item.url || `https://news.ycombinator.com/item?id=${item.id}`,
        domain,
        author: item.by || 'hn_reporter',
        timeAgo,
        score: item.score || 100,
        commentsCount: item.descendants || 0,
        isBreaking,
        isGrounded: true,
        beat,
        velocityScore: Math.min(100, Math.floor((item.score || 50) / 3) + (isBreaking ? 25 : 10)),
        tldrBullets: [
          `Trending discussion on ${domain} regarding ${item.title.slice(0, 60)}.`,
          `High community engagement with ${item.score || 0} upvotes and ${item.descendants || 0} active comments.`,
          `Relevant to technical strategy and engineering decisions in the ${beat} sector.`
        ],
        roleImpact: generateDynamicRoleImpact(item.title, beat)
      };
    });

    return { stories: parsedStories, isLive: true };
  } catch (error) {
    console.warn('Live HackerNews API fetch failed, using curated fallback stories:', error);
    return { stories: FALLBACK_STORIES, isLive: false };
  }
}
