import React from 'react';
import { RefreshCw, Volume2, Square } from 'lucide-react';

interface BriefingHeaderProps {
  onRefresh: () => void;
  isRefreshing: boolean;
  isLiveApi: boolean;
  onPlayBriefing: () => void;
  isAudioPlaying: boolean;
}

export const BriefingHeader: React.FC<BriefingHeaderProps> = ({
  onRefresh,
  isRefreshing,
  isLiveApi,
  onPlayBriefing,
  isAudioPlaying,
}) => {
  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  });

  return (
    <div className="max-w-6xl mx-auto px-6 pt-6 pb-4 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
      {/* Left: Large "Your briefing" title + current date + green Live HN badge */}
      <div>
        <h1 className="text-[28px] font-bold text-[#202124] tracking-tight leading-tight">
          Your briefing
        </h1>
        <div className="flex items-center gap-2.5 mt-1 text-sm text-[#5F6368]">
          <span>{currentDate}</span>
          <span className="text-[#DADCE0]">•</span>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#E6F4EA] text-[#137333] border border-[#CEEAD6]">
            <span className={`w-2 h-2 rounded-full ${isLiveApi ? 'bg-[#188038] animate-pulse' : 'bg-[#F2994A]'}`} />
            {isLiveApi ? '● Live HackerNews API Active' : '● Curated Feed'}
          </span>
        </div>
      </div>

      {/* Right: "Refresh Feed" pill button + Google Blue "Listen to Daily Brief (60s)" */}
      <div className="flex items-center gap-2.5 shrink-0 self-start sm:self-auto">
        <button
          onClick={onRefresh}
          disabled={isRefreshing}
          className="bg-white hover:bg-[#F1F3F4] text-[#5F6368] hover:text-[#202124] border border-[#DADCE0] rounded-full px-3.5 py-2 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
          title="Sync with latest live stories"
          aria-label="Refresh Feed"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-[#1A73E8]' : ''}`} />
          <span>{isRefreshing ? 'Syncing...' : 'Refresh Feed'}</span>
        </button>

        <button
          onClick={onPlayBriefing}
          className={`rounded-full px-4 py-2 text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer shadow-sm ${
            isAudioPlaying
              ? 'bg-[#D93025] hover:bg-[#B31412] text-white ring-2 ring-[#FAD2CF]'
              : 'bg-[#1A73E8] hover:bg-[#1557B0] text-white'
          }`}
          title={isAudioPlaying ? 'Stop playback' : 'Play 60-second audio summary'}
          aria-label={isAudioPlaying ? 'Stop briefing' : 'Listen to daily brief 60 seconds'}
        >
          {isAudioPlaying ? (
            <>
              <Square className="w-3.5 h-3.5 fill-current" />
              <span>Stop Briefing</span>
            </>
          ) : (
            <>
              <Volume2 className="w-3.5 h-3.5" />
              <span>🔊 Listen to Daily Brief (60s)</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
