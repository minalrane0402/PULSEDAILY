# ⚡ Google PulseDaily

> **Executive AI News & Briefing Digest** powered by Live HackerNews feeds, Google Material Design 3, Web Speech commute TTS, and Gemini structured intelligence (`@google/genai`).

[![React](https://img.shields.io/badge/React-19-blue.svg)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue.svg)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-v4-38bdf8.svg)](https://tailwindcss.com/)
[![Gemini API](https://img.shields.io/badge/Gemini-2.5%20Flash-4285F4.svg)](https://ai.google.dev/)
[![License](https://img.shields.io/badge/License-Apache%202.0-green.svg)](LICENSE)

---

## 🌟 Overview

**PulseDaily** delivers high-density, real-time tech intelligence curated for technical leaders and developers. It synthesizes live HackerNews discussions into deterministic 3-bullet executive takeaways and role-specific impact assessments using Google's Gemini models with strict structured schemas (`Type.OBJECT`).

---

## ✨ Key Features

### 1. 🔐 "Sign in with Google" & Persona Onboarding
- **Google Identity / Gmail Sign-in**: Authenticate with verified `@gmail.com` accounts or use convenient one-click session sign-in.
- **3 Professional Persona Lenses**:
  - **🚀 Founder / Exec**: Focuses on unit economics, enterprise ROI, competitive moats, and build-vs-buy engineering strategy.
  - **💻 Software Engineer**: Focuses on system architecture, `@google/genai` SDK patterns, latency budgets, and Cloud Run container scalability.
  - **🧭 Product Manager**: Focuses on user adoption loops, roadmap prioritization, autonomous task completion, and retention metrics.
- **Dynamic Feed Personalization**: Every article's callout box instantly updates to:
  > *"✨ Why this matters for [User Name] ([Chosen Persona])"*

### 2. ⚡ Live HackerNews API & Grounded Verification
- Real-time synchronization with HackerNews Firebase API (`v0/topstories.json`).
- Auto-categorization into **Agentic AI**, **Cloud & Infra**, and **Product & Strategy**.
- Grounded verification tag direct against publisher domains with zero hallucination.

### 3. 🚨 Live Breaking Shift Detector & Push Notification Radar
- High-velocity AI alert detector with one-click trigger chips.
- Dispatches browser `Notification` push alerts directly to the signed-in Gmail address.
- Broadcasts a pulsing crimson **Live Breaking News Alert Banner** at the top of the feed with 99% velocity momentum.

### 4. 🎧 60-Second Executive Audio Brief (Commute Digest)
- Native Web Speech API Text-to-Speech (TTS) synthesized commute summary.
- Plays top 4 high-velocity stories hands-free with pause, stop, and real-time progress indicators.

### 5. 📑 Synced Offline Reading List ("Saved for Later")
- Instant bookmarking persisted to browser `localStorage`.
- Dedicated "Following" filter tab with real-time story counter badges.

---

## 🏗️ Architecture

```
├── src/
│   ├── components/
│   │   ├── TopAppBar.tsx            # Google 4-color header, search bar, role lens, SSO profile
│   │   ├── GoogleNewsTabBar.tsx     # Horizontal category tabs (For you, Following, beats)
│   │   ├── BriefingHeader.tsx       # Live HN status, sync button, commute audio digest trigger
│   │   ├── BreakingNewsBanner.tsx   # Crimson high-velocity alert banner with Gemini action
│   │   ├── StoryCard.tsx            # Material 3 story card with personalized "Why this matters"
│   │   ├── BreakingAlertRadar.tsx   # Live breaking detector form & push notification manager
│   │   ├── AudioBriefCard.tsx       # 60s commute audio briefing player
│   │   ├── SavedReadingListCard.tsx # Synced reading list sidebar card
│   │   ├── GeminiImpactModal.tsx    # Modal with 3-bullet TL;DR & role switchers
│   │   └── GoogleSignInModal.tsx    # 2-step Gmail login and Persona onboarding flow
│   ├── services/
│   │   ├── hnApi.ts                 # Live HackerNews API integration & fallback stories
│   │   ├── geminiService.ts         # Client bridge to server Gemini endpoints
│   │   ├── audioBriefing.ts         # Web Speech TTS manager
│   │   └── authAndPersona.ts        # Persona definitions, Gmail validation, & storage
│   ├── types/
│   │   └── index.ts                 # TypeScript types (Story, UserRole, UserProfile, etc.)
│   ├── App.tsx                      # Root application state & layout orchestrator
│   └── main.tsx                     # React 19 entry point
├── vite.config.ts                   # Vite config + Server-side Gemini API proxy plugin
└── package.json
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** >= 18.0.0
- **npm** or **bun** / **yarn** / **pnpm**
- **Gemini API Key** from [Google AI Studio](https://aistudio.google.com/)

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/pulsedaily.git
cd pulsedaily
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Add your Gemini API key in `.env`:
```env
GEMINI_API_KEY="your-gemini-api-key-here"
```

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🧪 Testing

PulseDaily includes deterministic unit tests for classification, timestamp formatting, and persona logic using Node's native test runner (`node:test`):

```bash
# Run all unit tests
npx tsx --test src/services/*.test.ts

# Typecheck and lint
npm run lint
```

---

## 🔒 Security & Privacy

- **Server-Side API Key Isolation**: All `@google/genai` SDK invocations run strictly inside server-side Node.js endpoints (`/api/gemini/analyze` and `/api/gemini/detect-breaking`). The API key is never exposed to the client bundle.
- **Deterministic Schemas**: Uses Gemini `Type.OBJECT` responseSchema to enforce strict JSON contracts without prompt injection risk.

---

## 📄 License

This project is licensed under the Apache 2.0 License. See [LICENSE](LICENSE) for details.
