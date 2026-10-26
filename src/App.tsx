import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { UserRole, TopicBeat, Story, UserProfile } from './types';
import { fetchLiveNews, FALLBACK_STORIES } from './services/hnApi';
import { briefingAudio } from './services/audioBriefing';
import { detectBreakingStoryWithGemini } from './services/geminiService';
import {
  STORAGE_SAVED_KEY,
  STORAGE_ROLE_KEY,
  STORAGE_USER_KEY,
  DEFAULT_USER_PROFILE,
} from './services/authAndPersona';
import { TopAppBar } from './components/TopAppBar';
import { GoogleNewsTabBar } from './components/GoogleNewsTabBar';
import { BriefingHeader } from './components/BriefingHeader';
import { BreakingNewsBanner } from './components/BreakingNewsBanner';
import { StoryCard } from './components/StoryCard';
import { BreakingAlertRadar } from './components/BreakingAlertRadar';
import { AudioBriefCard } from './components/AudioBriefCard';
import { SavedReadingListCard } from './components/SavedReadingListCard';
import { GeminiImpactModal } from './components/GeminiImpactModal';
import { GoogleSignInModal } from './components/GoogleSignInModal';
import { Newspaper } from 'lucide-react';

export const App: React.FC = () => {
  // 1. Stories State
  const [stories, setStories] = useState<Story[]>(FALLBACK_STORIES);
  const [isLiveApi, setIsLiveApi] = useState<boolean>(false);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [isDetectingBreaking, setIsDetectingBreaking] = useState<boolean>(false);

  // 2. Navigation & Filter State
  const [activeTab, setActiveTab] = useState<TopicBeat>('For you');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeRole, setActiveRole] = useState<UserRole>('Software Engineer');

  // 3. User & Google SSO State
  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_USER_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        return {
          ...DEFAULT_USER_PROFILE,
          ...parsed,
          notificationsEnabled:
            typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted',
        };
      }
    } catch (e) {
      console.warn('Failed to load user profile from storage', e);
    }
    return DEFAULT_USER_PROFILE;
  });

  const [savedStoryIds, setSavedStoryIds] = useState<(number | string)[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_SAVED_KEY);
      return stored ? JSON.parse(stored) : [101, 103];
    } catch {
      return [101, 103];
    }
  });

  const [dismissedBannerId, setDismissedBannerId] = useState<number | string | null>(null);

  // 4. Modal States
  const [selectedStoryForModal, setSelectedStoryForModal] = useState<Story | null>(null);
  const [isSignInModalOpen, setIsSignInModalOpen] = useState<boolean>(false);
  const [signInModalInitialStep, setSignInModalInitialStep] = useState<1 | 2>(1);

  // 5. Audio Briefing State
  const [isAudioPlaying, setIsAudioPlaying] = useState<boolean>(false);
  const [audioProgress, setAudioProgress] = useState<number>(0);

  // Load saved preferences from localStorage on mount
  useEffect(() => {
    try {
      const storedRole = localStorage.getItem(STORAGE_ROLE_KEY) as UserRole | null;
      if (storedRole && (storedRole === 'Software Engineer' || storedRole === 'Product Manager' || storedRole === 'Founder / Exec')) {
        setActiveRole(storedRole);
        setUserProfile((prev) => ({ ...prev, role: storedRole }));
      }
      if ('Notification' in window && Notification.permission === 'granted') {
        setUserProfile((prev) => ({ ...prev, notificationsEnabled: true }));
      }
    } catch (e) {
      console.warn('Could not read from localStorage', e);
    }
  }, []);

  // Save bookmarks and user state to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_SAVED_KEY, JSON.stringify(savedStoryIds));
      localStorage.setItem(STORAGE_USER_KEY, JSON.stringify({ ...userProfile, savedStoryIds, role: activeRole }));
    } catch (e) {
      console.warn('Could not save to localStorage', e);
    }
  }, [savedStoryIds, activeRole, userProfile]);

  // Handle Role Change
  const handleRoleChange = useCallback((newRole: UserRole) => {
    setActiveRole(newRole);
    setUserProfile((prev) => ({ ...prev, role: newRole }));
    try {
      localStorage.setItem(STORAGE_ROLE_KEY, newRole);
    } catch (e) {
      console.warn(e);
    }
  }, []);

  // Handle Sign In & Onboarding Success
  const handleSignInSuccess = useCallback((updatedProfile: UserProfile) => {
    setUserProfile(updatedProfile);
    setActiveRole(updatedProfile.role);
    setIsSignInModalOpen(false);

    try {
      localStorage.setItem(STORAGE_ROLE_KEY, updatedProfile.role);
      localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(updatedProfile));
    } catch (e) {
      console.warn(e);
    }

    // Trigger welcoming desktop notification if enabled
    if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
      try {
        new Notification(`Welcome to PulseDaily, ${updatedProfile.name.split(' ')[0]}!`, {
          body: `Feed personalized for ${updatedProfile.role}. Breaking alerts synced to ${updatedProfile.email}.`,
          icon: '/favicon.ico',
        });
      } catch {
        // Notification error ignored
      }
    }
  }, []);

  // Handle Sign Out
  const handleSignOut = useCallback(() => {
    setUserProfile((prev) => ({
      ...prev,
      name: 'Guest Reader',
      email: '',
      avatar: 'GR',
      isSignedIn: false,
    }));
  }, []);

  // Load Live HackerNews Stories
  const loadNews = useCallback(async () => {
    setIsRefreshing(true);
    const { stories: loadedStories, isLive } = await fetchLiveNews();
    setStories(loadedStories);
    setIsLiveApi(isLive);
    setIsRefreshing(false);

    // If current saved IDs don't match any loaded stories, seed with first 2 live stories
    setSavedStoryIds((prev) => {
      const hasMatch = loadedStories.some((s) => prev.includes(s.id));
      if (!hasMatch && loadedStories.length >= 2) {
        return [loadedStories[0].id, loadedStories[2]?.id || loadedStories[1].id];
      }
      return prev;
    });

    // Browser Notification trigger for breaking story
    if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
      const topBreaking = loadedStories.find((s) => s.isBreaking);
      if (topBreaking) {
        try {
          new Notification(`PulseDaily Alert: ${topBreaking.domain}`, {
            body: topBreaking.title,
            icon: '/favicon.ico',
          });
        } catch {
          // notification silently ignored
        }
      }
    }
  }, []);

  useEffect(() => {
    loadNews();
  }, [loadNews]);

  // Set up Audio Briefing listener
  useEffect(() => {
    briefingAudio.setListener((playing, progress) => {
      setIsAudioPlaying(playing);
      setAudioProgress(progress);
    });
    return () => {
      briefingAudio.stop();
    };
  }, []);

  // Notification Permission Toggle
  const handleToggleNotifications = useCallback(async () => {
    if (!('Notification' in window)) {
      console.warn('Desktop notifications are not supported in this browser.');
      return;
    }

    if (Notification.permission === 'granted') {
      setUserProfile((prev) => ({ ...prev, notificationsEnabled: !prev.notificationsEnabled }));
    } else {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        setUserProfile((prev) => ({ ...prev, notificationsEnabled: true }));
        try {
          const target = userProfile.email || 'your device';
          new Notification('PulseDaily AI Alerts Activated', {
            body: `Breaking news radar alerts are now active for ${userProfile.role} (${target}).`,
          });
        } catch {
          // notification permission ignored
        }
      } else {
        setUserProfile((prev) => ({ ...prev, notificationsEnabled: false }));
      }
    }
  }, [userProfile.email, userProfile.role]);

  // FEATURE 2: Live Breaking News Detector Trigger
  const handleDetectBreakingTopic = useCallback(async (topic: string) => {
    setIsDetectingBreaking(true);
    try {
      const breakingStory = await detectBreakingStoryWithGemini(
        topic,
        activeRole,
        userProfile.name
      );

      // Prepend breaking story to stories feed
      setStories((prev) => [breakingStory, ...prev.filter((s) => s.id !== breakingStory.id)]);
      setDismissedBannerId(null);

      // Trigger browser desktop push notification
      if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
        try {
          const emailTarget = userProfile.isSignedIn && userProfile.email ? ` [${userProfile.email}]` : '';
          new Notification(`🚨 PULSE BREAKING: ${breakingStory.domain}${emailTarget}`, {
            body: `${breakingStory.title} — Impact for ${activeRole}: ${breakingStory.tldrBullets[0] || ''}`,
            icon: '/favicon.ico',
          });
        } catch (err) {
          console.warn('Desktop notification failed:', err);
        }
      }
    } catch (e) {
      console.error('Error detecting breaking topic:', e);
    } finally {
      setIsDetectingBreaking(false);
    }
  }, [activeRole, userProfile.name, userProfile.isSignedIn, userProfile.email]);

  // Bookmark Toggle
  const handleToggleSave = useCallback((storyId: number | string) => {
    setSavedStoryIds((prev) =>
      prev.includes(storyId) ? prev.filter((id) => id !== storyId) : [...prev, storyId]
    );
  }, []);

  // Audio briefing toggle from header
  const handleAudioHeaderClick = useCallback(() => {
    if (isAudioPlaying) {
      briefingAudio.stop();
    } else {
      briefingAudio.playBriefing(stories);
    }
  }, [isAudioPlaying, stories]);

  // Filtered stories calculation
  const breakingStories = useMemo(() => stories.filter((s) => s.isBreaking), [stories]);

  const activeBannerStory = useMemo(() => {
    if (dismissedBannerId !== null) {
      return breakingStories.find((s) => s.id !== dismissedBannerId) || null;
    }
    return breakingStories[0] || null;
  }, [breakingStories, dismissedBannerId]);

  const savedStoriesList = useMemo(
    () => stories.filter((s) => savedStoryIds.includes(s.id)),
    [stories, savedStoryIds]
  );

  const filteredStories = useMemo(() => {
    return stories.filter((story) => {
      // 1. Tab filtering
      if (activeTab === 'Following') {
        if (!savedStoryIds.includes(story.id)) return false;
      } else if (
        activeTab === 'Agentic AI' ||
        activeTab === 'Cloud & Infra' ||
        activeTab === 'Product & Strategy'
      ) {
        if (story.beat !== activeTab) return false;
      }

      // 2. Search query filtering
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = story.title.toLowerCase().includes(query);
        const matchesDomain = story.domain.toLowerCase().includes(query);
        const matchesBullet = story.tldrBullets.some((b) => b.toLowerCase().includes(query));
        if (!matchesTitle && !matchesDomain && !matchesBullet) return false;
      }

      return true;
    });
  }, [stories, activeTab, searchQuery, savedStoryIds]);

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-[#202124] flex flex-col font-sans">
      {/* ROW 1: TOP GOOGLE APP BAR WITH GOOGLE SIGN IN & PERSONA BADGE */}
      <TopAppBar
        activeRole={activeRole}
        onRoleChange={handleRoleChange}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        hasBreakingStories={breakingStories.length > 0}
        userProfile={userProfile}
        onToggleNotifications={handleToggleNotifications}
        onOpenSignInModal={(step) => {
          setSignInModalInitialStep(step || 1);
          setIsSignInModalOpen(true);
        }}
        onSignOut={handleSignOut}
      />

      {/* ROW 2: HORIZONTAL GOOGLE NEWS TAB BAR */}
      <GoogleNewsTabBar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        savedCount={savedStoriesList.length}
      />

      <main className="flex-1">
        {/* ZONE 3: "YOUR BRIEFING" HEADER ROW */}
        <BriefingHeader
          onRefresh={loadNews}
          isRefreshing={isRefreshing}
          isLiveApi={isLiveApi}
          onPlayBriefing={handleAudioHeaderClick}
          isAudioPlaying={isAudioPlaying}
        />

        {/* BREAKING NEWS BANNER (Pulsing crimson on high-velocity alerts) */}
        <BreakingNewsBanner
          story={activeBannerStory}
          activeRole={activeRole}
          userName={userProfile.name}
          onExplainWithGemini={(story) => setSelectedStoryForModal(story)}
          onDismiss={() => {
            if (activeBannerStory) setDismissedBannerId(activeBannerStory.id);
          }}
        />

        {/* ZONE 4: 12-COLUMN GOOGLE NEWS GRID */}
        <div className="max-w-6xl mx-auto px-6 pb-12 grid grid-cols-12 gap-6 items-start">
          {/* LEFT 8 COLUMNS: Single White 16px Rounded Container ("Top stories") */}
          <section className="col-span-12 lg:col-span-8 bg-white rounded-2xl border border-[#DADCE0] overflow-hidden shadow-none">
            {/* Top stories container header */}
            <div className="px-6 pt-5 pb-3 border-b border-[#E8EAED] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Newspaper className="w-5 h-5 text-[#1A73E8]" />
                <h2 className="font-bold text-lg text-[#202124]">
                  {activeTab === 'Following' ? 'Your saved reading list' : 'Top stories'}
                </h2>
              </div>
              <span className="text-xs font-medium text-[#5F6368]">
                {filteredStories.length} {filteredStories.length === 1 ? 'story' : 'stories'}
              </span>
            </div>

            {/* Stories List with divide-y divide-[#E8EAED] */}
            {filteredStories.length === 0 ? (
              <div className="py-16 px-6 text-center">
                <div className="w-12 h-12 bg-[#F1F3F4] text-[#5F6368] rounded-full flex items-center justify-center mx-auto mb-3">
                  <Newspaper className="w-6 h-6" />
                </div>
                <h3 className="text-sm font-semibold text-[#202124] mb-1">
                  {activeTab === 'Following' ? 'No saved stories yet' : 'No stories found matching your filter'}
                </h3>
                <p className="text-xs text-[#5F6368] max-w-sm mx-auto mb-4">
                  {activeTab === 'Following'
                    ? 'Save stories from the "For you" feed to build your customized offline reading list.'
                    : 'Try clearing your search query or selecting a different topic beat.'}
                </p>
                {activeTab === 'Following' ? (
                  <button
                    onClick={() => setActiveTab('For you')}
                    className="bg-[#1A73E8] text-white rounded-full px-4 py-2 text-xs font-semibold hover:bg-[#1557B0] transition-colors cursor-pointer"
                  >
                    Browse Top Stories
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setActiveTab('For you');
                    }}
                    className="bg-[#1A73E8] text-white rounded-full px-4 py-2 text-xs font-semibold hover:bg-[#1557B0] transition-colors cursor-pointer"
                  >
                    Reset Filters
                  </button>
                )}
              </div>
            ) : (
              <div className="divide-y divide-[#E8EAED]">
                {filteredStories.map((story) => (
                  <StoryCard
                    key={story.id}
                    story={story}
                    activeRole={activeRole}
                    userName={userProfile.name}
                    isSaved={savedStoryIds.includes(story.id)}
                    onToggleSave={handleToggleSave}
                    onAnalyzeWithGemini={(s) => setSelectedStoryForModal(s)}
                  />
                ))}
              </div>
            )}
          </section>

          {/* RIGHT 4 COLUMNS: Clean White 16px Rounded Sidebar Cards */}
          <aside className="col-span-12 lg:col-span-4 space-y-5">
            {/* 1. Breaking Alert Radar + Live Breaking Shift Detector */}
            <BreakingAlertRadar
              breakingStories={breakingStories}
              notificationsEnabled={userProfile.notificationsEnabled}
              userProfile={userProfile}
              activeRole={activeRole}
              onToggleNotifications={handleToggleNotifications}
              onSelectStory={(story) => setSelectedStoryForModal(story)}
              onDetectBreakingTopic={handleDetectBreakingTopic}
              isDetectingBreaking={isDetectingBreaking}
            />

            {/* 2. 60-Second Executive Audio Brief */}
            <AudioBriefCard
              stories={stories}
              isPlaying={isAudioPlaying}
              progress={audioProgress}
              onPlay={() => briefingAudio.playBriefing(stories)}
              onPause={() => briefingAudio.pause()}
              onStop={() => briefingAudio.stop()}
            />

            {/* 3. Saved Reading List */}
            <SavedReadingListCard
              savedStories={savedStoriesList}
              onRemoveSaved={handleToggleSave}
              onViewAllSaved={() => setActiveTab('Following')}
            />
          </aside>
        </div>
      </main>

      {/* GEMINI IMPACT MODAL */}
      <GeminiImpactModal
        story={selectedStoryForModal}
        activeRole={activeRole}
        onClose={() => setSelectedStoryForModal(null)}
      />

      {/* 2-STEP GOOGLE SIGN IN & CHOOSE PERSONA ONBOARDING MODAL */}
      <GoogleSignInModal
        isOpen={isSignInModalOpen}
        initialStep={signInModalInitialStep}
        currentUser={userProfile}
        onClose={() => setIsSignInModalOpen(false)}
        onSuccess={handleSignInSuccess}
      />
    </div>
  );
};

export default App;
