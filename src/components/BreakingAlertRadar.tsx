import React, { useState } from 'react';
import { Radio, Bell, BellOff, Sparkles, Flame, Send, Zap, Loader2 } from 'lucide-react';
import { Story, UserRole, UserProfile } from '../types';

interface BreakingAlertRadarProps {
  breakingStories: Story[];
  notificationsEnabled: boolean;
  userProfile: UserProfile;
  activeRole: UserRole;
  onToggleNotifications: () => void;
  onSelectStory: (story: Story) => void;
  onDetectBreakingTopic: (topic: string) => Promise<void>;
  isDetectingBreaking: boolean;
}

export const BreakingAlertRadar: React.FC<BreakingAlertRadarProps> = ({
  breakingStories,
  notificationsEnabled,
  userProfile,
  activeRole,
  onToggleNotifications,
  onSelectStory,
  onDetectBreakingTopic,
  isDetectingBreaking,
}) => {
  const [topicInput, setTopicInput] = useState('');

  const quickTopics = [
    'Gemini 3.8 Flash Native Voice Live API GA',
    'DeepSeek-V3 Reasoning Architecture Whitepaper',
    'Kubernetes 1.33 GPU Dynamic Resource GA',
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topicInput.trim() || isDetectingBreaking) return;
    const query = topicInput.trim();
    setTopicInput('');
    await onDetectBreakingTopic(query);
  };

  const handleQuickTopicClick = async (topic: string) => {
    if (isDetectingBreaking) return;
    await onDetectBreakingTopic(topic);
  };

  return (
    <div className="bg-white rounded-2xl border border-[#DADCE0] p-5 shadow-none space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-[#E8EAED]">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-[#FCE8E6] text-[#C5221F] flex items-center justify-center">
            <Radio className="w-4 h-4 animate-pulse" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-[#202124]">
              Breaking Alert Radar
            </h3>
            <span className="text-[11px] text-[#5F6368]">Live AI detector & push alerts</span>
          </div>
        </div>

        {/* Desktop notification toggle */}
        <button
          onClick={onToggleNotifications}
          className={`p-1.5 rounded-full border transition-colors cursor-pointer ${
            notificationsEnabled
              ? 'bg-[#E6F4EA] border-[#CEEAD6] text-[#137333]'
              : 'bg-[#F1F3F4] border-[#DADCE0] text-[#5F6368] hover:text-[#202124]'
          }`}
          title={notificationsEnabled ? 'Desktop alerts enabled' : 'Click to enable desktop notifications'}
          aria-label={notificationsEnabled ? 'Desktop alerts enabled' : 'Click to enable desktop notifications'}
        >
          {notificationsEnabled ? (
            <Bell className="w-3.5 h-3.5" />
          ) : (
            <BellOff className="w-3.5 h-3.5" />
          )}
        </button>
      </div>

      {/* FEATURE 2: LIVE BREAKING NEWS DETECTOR FORM */}
      <div className="bg-[#FFF8F0] border border-[#FEEBD0] rounded-xl p-3.5">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-bold text-[#B06000] uppercase tracking-wider flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-[#E37400]" />
            Live Breaking Shift Detector
          </span>
          <span className="text-[10px] text-[#5F6368]">
            {userProfile.isSignedIn ? `Target: ${userProfile.email}` : 'Signed in target'}
          </span>
        </div>

        <form onSubmit={handleSubmit} className="space-y-2">
          <div className="flex items-center gap-1.5">
            <input
              type="text"
              value={topicInput}
              onChange={(e) => setTopicInput(e.target.value)}
              placeholder="Enter breaking model, paper, or infra shift..."
              className="flex-1 bg-white border border-[#DADCE0] rounded-lg px-2.5 py-1.5 text-xs text-[#202124] placeholder-[#5F6368] outline-none focus:ring-1 focus:ring-[#1A73E8]"
              disabled={isDetectingBreaking}
            />
            <button
              type="submit"
              disabled={!topicInput.trim() || isDetectingBreaking}
              className="bg-[#D93025] hover:bg-[#B31412] disabled:opacity-50 text-white rounded-lg px-3 py-1.5 text-xs font-semibold cursor-pointer transition-colors shrink-0 flex items-center gap-1"
              aria-label="Broadcast breaking alert"
            >
              {isDetectingBreaking ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Send className="w-3 h-3" />
              )}
              <span>Broadcast</span>
            </button>
          </div>

          {/* Quick clickable suggestions */}
          <div className="pt-1">
            <div className="text-[10px] font-medium text-[#70757A] mb-1">Quick trigger test:</div>
            <div className="flex flex-wrap gap-1">
              {quickTopics.map((topic, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => handleQuickTopicClick(topic)}
                  disabled={isDetectingBreaking}
                  className="bg-white hover:bg-[#FEEFC3] text-[#202124] border border-[#FEEBD0] hover:border-[#F2994A] rounded-md px-2 py-0.5 text-[10px] transition-colors cursor-pointer text-left truncate max-w-full"
                >
                  ⚡ {topic}
                </button>
              ))}
            </div>
          </div>
        </form>

        <div className="mt-2 text-[10px] text-[#5F6368] flex items-center justify-between border-t border-[#FEEBD0]/80 pt-1.5">
          <span>🔔 Desktop push to {userProfile.email || 'browser'}</span>
          <span>✨ Gemini {activeRole} lens</span>
        </div>
      </div>

      {/* Stories list */}
      <div>
        <div className="text-[11px] font-semibold text-[#5F6368] uppercase tracking-wider mb-2">
          High-Velocity Live Feed ({breakingStories.length})
        </div>

        <div className="space-y-2.5">
          {breakingStories.length === 0 ? (
            <p className="text-xs text-[#5F6368] py-2">
              Radar scanning live feed. No high-velocity alerts detected in the last hour.
            </p>
          ) : (
            breakingStories.slice(0, 3).map((story) => (
              <div
                key={story.id}
                onClick={() => onSelectStory(story)}
                className="group p-2.5 rounded-xl border border-[#E8EAED] hover:border-[#1A73E8] hover:bg-[#F8F9FA] transition-all cursor-pointer"
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onSelectStory(story);
                  }
                }}
                aria-label={`Select breaking story: ${story.title}`}
              >
                <div className="flex items-center justify-between gap-1 mb-1">
                  <span className="text-[11px] font-semibold text-[#1A73E8] truncate">
                    {story.domain}
                  </span>
                  <span className="text-[11px] text-[#C5221F] font-bold flex items-center gap-0.5 shrink-0">
                    <Flame className="w-3 h-3" />
                    {story.velocityScore || 90}% velocity
                  </span>
                </div>
                <h4 className="text-xs font-semibold text-[#202124] group-hover:text-[#1A73E8] line-clamp-2 transition-colors leading-snug">
                  {story.title}
                </h4>
                <div className="mt-2 flex items-center justify-between text-[11px] text-[#5F6368]">
                  <span>{story.score} upvotes</span>
                  <span className="text-[#1A73E8] font-medium flex items-center gap-1 group-hover:underline">
                    <Sparkles className="w-3 h-3" />
                    Explain impact
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
