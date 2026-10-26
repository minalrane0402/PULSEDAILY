import React from 'react';
import { Play, Pause, Square, Headphones } from 'lucide-react';
import { Story } from '../types';

interface AudioBriefCardProps {
  stories: Story[];
  isPlaying: boolean;
  progress: number;
  onPlay: () => void;
  onPause: () => void;
  onStop: () => void;
}

export const AudioBriefCard: React.FC<AudioBriefCardProps> = ({
  stories,
  isPlaying,
  progress,
  onPlay,
  onPause,
  onStop,
}) => {
  const briefStories = stories.slice(0, 4);

  return (
    <div className="bg-white rounded-2xl border border-[#DADCE0] p-5 shadow-none">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-[#E8EAED]">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-[#E8F0FE] text-[#1A73E8] flex items-center justify-center">
            <Headphones className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-[#202124]">
              60-Second Executive Audio Brief
            </h3>
            <span className="text-[11px] text-[#5F6368]">Hands-free commute digest</span>
          </div>
        </div>

        <span className="text-[11px] font-bold text-[#1A73E8] bg-[#E8F0FE] px-2 py-0.5 rounded-full">
          Web Speech TTS
        </span>
      </div>

      {/* Progress & Controls */}
      <div className="mt-4">
        {/* Progress bar */}
        <div className="w-full bg-[#F1F3F4] rounded-full h-1.5 overflow-hidden mb-3">
          <div
            className="bg-[#1A73E8] h-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="text-[11px] text-[#5F6368]">
            {isPlaying ? 'Playing briefing...' : 'Ready to stream'}
          </div>

          <div className="flex items-center gap-1.5">
            {isPlaying ? (
              <>
                <button
                  onClick={onPause}
                  className="w-8 h-8 rounded-full bg-[#F1F3F4] hover:bg-[#E8EAED] text-[#202124] flex items-center justify-center transition-colors cursor-pointer"
                  title="Pause"
                  aria-label="Pause audio briefing"
                >
                  <Pause className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={onStop}
                  className="w-8 h-8 rounded-full bg-[#FCE8E6] hover:bg-[#FAD2CF] text-[#C5221F] flex items-center justify-center transition-colors cursor-pointer"
                  title="Stop"
                  aria-label="Stop audio briefing"
                >
                  <Square className="w-3.5 h-3.5 fill-current" />
                </button>
              </>
            ) : (
              <button
                onClick={onPlay}
                className="bg-[#1A73E8] hover:bg-[#1557B0] text-white rounded-full px-3.5 py-1.5 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm"
                aria-label="Play 60-second audio brief"
              >
                <Play className="w-3 h-3 fill-current" />
                <span>Play Brief (60s)</span>
              </button>
            )}
          </div>
        </div>

        {/* Story list preview */}
        <div className="mt-4 pt-3 border-t border-[#E8EAED] space-y-2">
          <div className="text-[11px] font-semibold text-[#5F6368] uppercase tracking-wider">
            Queue ({briefStories.length} stories)
          </div>
          {briefStories.map((story, i) => (
            <div key={story.id} className="text-xs text-[#3C4043] flex items-start gap-1.5">
              <span className="text-[#1A73E8] font-bold shrink-0">{i + 1}.</span>
              <span className="line-clamp-1">{story.title}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
