import React from 'react';
import { Bookmark, ExternalLink, CheckCircle2, Sparkles, MessageSquare, ArrowUpRight } from 'lucide-react';
import { Story, UserRole } from '../types';
import { formatWhyThisMattersTitle } from '../services/authAndPersona';

interface StoryCardProps {
  story: Story;
  activeRole: UserRole;
  userName?: string;
  isSaved: boolean;
  onToggleSave: (storyId: number | string) => void;
  onAnalyzeWithGemini: (story: Story) => void;
}

export const StoryCard: React.FC<StoryCardProps> = ({
  story,
  activeRole,
  userName = 'You',
  isSaved,
  onToggleSave,
  onAnalyzeWithGemini,
}) => {
  const currentRoleImpact = story.roleImpact[activeRole] || story.roleImpact['Software Engineer'];
  const whyThisMattersTitle = formatWhyThisMattersTitle(userName, activeRole);

  return (
    <article className="p-6 transition-colors hover:bg-[#FAFAFA]">
      {/* Top Metadata Row: Publisher Domain + Grounded Chip + Beat + Time */}
      <div className="flex items-center justify-between gap-2 mb-2 flex-wrap">
        <div className="flex items-center gap-2">
          {/* Publisher Domain Badge */}
          <span className="font-semibold text-xs text-[#202124] tracking-tight bg-[#F1F3F4] px-2.5 py-0.5 rounded-md border border-[#E8EAED]">
            {story.domain}
          </span>

          {/* Green Grounded Pill */}
          {story.isGrounded && (
            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-[#137333] bg-[#E6F4EA] px-2 py-0.5 rounded-full border border-[#CEEAD6]">
              <CheckCircle2 className="w-3 h-3" />
              <span>✓ Grounded</span>
            </span>
          )}

          {/* Breaking badge if applicable */}
          {story.isBreaking && (
            <span className="text-[11px] font-bold text-[#C5221F] bg-[#FCE8E6] px-2 py-0.5 rounded-full border border-[#FAD2CF]">
              ⚡ High Velocity
            </span>
          )}
        </div>

        <div className="flex items-center gap-2 text-xs text-[#5F6368]">
          <span>{story.beat}</span>
          <span>•</span>
          <span>{story.timeAgo}</span>
        </div>
      </div>

      {/* Bold Headline */}
      <h3 className="text-lg font-bold text-[#202124] hover:text-[#1A73E8] transition-colors leading-snug mb-3">
        <a
          href={story.url}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:underline flex items-start gap-1 group"
        >
          <span>{story.title}</span>
          <ArrowUpRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity shrink-0 text-[#1A73E8] mt-0.5" />
        </a>
      </h3>

      {/* 3-Bullet Gemini TL;DR */}
      <div className="mb-4 space-y-1.5">
        {story.tldrBullets.map((bullet, idx) => (
          <div key={idx} className="flex items-start gap-2 text-xs text-[#3C4043] leading-relaxed">
            <span className="text-[#1A73E8] font-bold mt-0.5">•</span>
            <span>{bullet}</span>
          </div>
        ))}
      </div>

      {/* Soft Blue #E8F0FE Material 3 Tonal Box: Why This Matters For You (Personalized) */}
      <div className="bg-[#E8F0FE] border border-[#D2E3FC] rounded-xl p-3.5 mb-4">
        <div className="flex items-center gap-1.5 text-xs font-bold text-[#174EA6] mb-1">
          <Sparkles className="w-3.5 h-3.5" />
          <span>{whyThisMattersTitle}</span>
        </div>
        <p className="text-xs text-[#174EA6] leading-relaxed">
          {currentRoleImpact}
        </p>
      </div>

      {/* Bottom Action Pills: Save for later + Full coverage ↗ + Comments */}
      <div className="flex items-center justify-between pt-1">
        <div className="flex items-center gap-2">
          {/* Save for later pill */}
          <button
            onClick={() => onToggleSave(story.id)}
            className={`rounded-full px-3 py-1.5 text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer border ${
              isSaved
                ? 'bg-[#E8F0FE] text-[#1A73E8] border-[#1A73E8]'
                : 'bg-white text-[#5F6368] hover:text-[#202124] hover:bg-[#F1F3F4] border-[#DADCE0]'
            }`}
            aria-label={isSaved ? `Remove "${story.title}" from saved` : `Save "${story.title}" for later`}
          >
            <Bookmark className={`w-3.5 h-3.5 ${isSaved ? 'fill-current text-[#1A73E8]' : ''}`} />
            <span>{isSaved ? 'Saved' : 'Save for later'}</span>
          </button>

          {/* Full coverage ↗ pill */}
          <button
            onClick={() => onAnalyzeWithGemini(story)}
            className="bg-white hover:bg-[#F1F3F4] text-[#1A73E8] hover:text-[#174EA6] border border-[#DADCE0] rounded-full px-3 py-1.5 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            aria-label={`Full coverage with Gemini for "${story.title}"`}
          >
            <Sparkles className="w-3.5 h-3.5 text-[#1A73E8]" />
            <span>Full coverage ↗</span>
          </button>
        </div>

        <div className="flex items-center gap-3 text-xs text-[#5F6368]">
          <span className="flex items-center gap-1">
            <span className="font-semibold text-[#202124]">{story.score}</span> pts
          </span>
          {story.commentsCount > 0 && (
            <a
              href={`https://news.ycombinator.com/item?id=${story.id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 hover:text-[#1A73E8] transition-colors"
              title="View comments on HackerNews"
              aria-label={`${story.commentsCount} comments on HackerNews`}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>{story.commentsCount}</span>
            </a>
          )}
          <a
            href={story.url}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[#1A73E8] p-1 rounded-full transition-colors"
            title="Open original link"
            aria-label="Open original article link"
          >
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </article>
  );
};
