import React from 'react';
import { Bookmark, ArrowRight, Trash2, ExternalLink } from 'lucide-react';
import { Story } from '../types';

interface SavedReadingListCardProps {
  savedStories: Story[];
  onRemoveSaved: (storyId: number | string) => void;
  onViewAllSaved: () => void;
}

export const SavedReadingListCard: React.FC<SavedReadingListCardProps> = ({
  savedStories,
  onRemoveSaved,
  onViewAllSaved,
}) => {
  return (
    <div className="bg-white rounded-2xl border border-[#DADCE0] p-5 shadow-none">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-[#E8EAED]">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-[#E8F0FE] text-[#1A73E8] flex items-center justify-center">
            <Bookmark className="w-4 h-4 fill-current" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-[#202124]">
              Saved for later
            </h3>
            <span className="text-[11px] text-[#5F6368]">
              {savedStories.length} {savedStories.length === 1 ? 'article' : 'articles'} synced
            </span>
          </div>
        </div>

        {savedStories.length > 0 && (
          <button
            onClick={onViewAllSaved}
            className="text-xs text-[#1A73E8] hover:underline font-semibold flex items-center gap-1 cursor-pointer"
            aria-label="View all saved stories"
          >
            <span>View tab</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Bookmarked articles */}
      <div className="mt-3 space-y-2.5">
        {savedStories.length === 0 ? (
          <div className="py-4 text-center">
            <p className="text-xs text-[#5F6368] mb-2">
              No saved articles yet.
            </p>
            <p className="text-[11px] text-[#80868B]">
              Click "Save for later" on any story to read it during your morning focus block.
            </p>
          </div>
        ) : (
          savedStories.slice(0, 4).map((story) => (
            <div
              key={story.id}
              className="group p-2 rounded-xl border border-transparent hover:border-[#E8EAED] hover:bg-[#F8F9FA] transition-all flex items-start justify-between gap-2"
            >
              <div className="flex-1 min-w-0">
                <div className="text-[11px] text-[#5F6368] font-medium mb-0.5">
                  {story.domain}
                </div>
                <a
                  href={story.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-semibold text-[#202124] group-hover:text-[#1A73E8] transition-colors line-clamp-1 block hover:underline"
                >
                  {story.title}
                </a>
              </div>

              <div className="flex items-center gap-1 shrink-0 pt-1">
                <a
                  href={story.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#5F6368] hover:text-[#1A73E8] p-1 rounded-full transition-colors"
                  title="Open article"
                  aria-label={`Open "${story.title}" link`}
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
                <button
                  onClick={() => onRemoveSaved(story.id)}
                  className="text-[#5F6368] hover:text-[#D93025] p-1 rounded-full transition-colors cursor-pointer"
                  title="Remove from saved"
                  aria-label={`Remove "${story.title}" from saved`}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
