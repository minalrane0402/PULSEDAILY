import React from 'react';
import { Sparkles, X, Flame, Radio } from 'lucide-react';
import { Story, UserRole } from '../types';

interface BreakingNewsBannerProps {
  story: Story | null;
  activeRole: UserRole;
  userName?: string;
  onExplainWithGemini: (story: Story) => void;
  onDismiss: () => void;
}

export const BreakingNewsBanner: React.FC<BreakingNewsBannerProps> = ({
  story,
  activeRole,
  userName = 'You',
  onExplainWithGemini,
  onDismiss,
}) => {
  if (!story) return null;

  const isUltraHighVelocity = (story.velocityScore || 90) >= 95;

  return (
    <div className="max-w-6xl mx-auto px-6 mb-4">
      <div
        className={`rounded-2xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-sm transition-all border ${
          isUltraHighVelocity
            ? 'bg-[#FCE8E6] border-[#FAD2CF] ring-1 ring-[#EA4335]/30'
            : 'bg-[#FEF7E0] border-[#FEEFC3]'
        }`}
      >
        <div className="flex items-start gap-3">
          <div
            className={`w-9 h-9 rounded-full text-white flex items-center justify-center shrink-0 mt-0.5 shadow-sm ${
              isUltraHighVelocity ? 'bg-[#D93025] animate-pulse' : 'bg-[#EA4335]'
            }`}
          >
            {isUltraHighVelocity ? (
              <Radio className="w-4 h-4 animate-spin" />
            ) : (
              <Flame className="w-4 h-4" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span
                className={`text-xs font-bold uppercase tracking-wider ${
                  isUltraHighVelocity ? 'text-[#C5221F]' : 'text-[#B06000]'
                }`}
              >
                ⚡ Live Breaking News Alert
              </span>
              <span className="text-xs text-[#5F6368]">• {story.domain} • {story.timeAgo}</span>
              {story.velocityScore && (
                <span className="text-[10px] font-bold text-[#D93025] bg-white px-2 py-0.5 rounded-full border border-[#FAD2CF]">
                  {story.velocityScore}% Velocity
                </span>
              )}
            </div>
            <h3 className="text-sm font-semibold text-[#202124] mt-0.5 line-clamp-1">
              {story.title}
            </h3>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0 md:self-center pl-12 md:pl-0">
          <button
            onClick={() => onExplainWithGemini(story)}
            className="bg-[#1A73E8] hover:bg-[#1557B0] text-white text-xs font-semibold px-4 py-2 rounded-full flex items-center gap-1.5 cursor-pointer transition-colors shadow-sm whitespace-nowrap"
            aria-label={`Explain Impact for ${activeRole} with Gemini`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Explain Impact for {activeRole} with Gemini</span>
          </button>
          <button
            onClick={onDismiss}
            className="text-[#5F6368] hover:text-[#202124] p-1.5 rounded-full hover:bg-black/5 transition-colors cursor-pointer"
            title="Dismiss alert"
            aria-label="Dismiss breaking alert"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
