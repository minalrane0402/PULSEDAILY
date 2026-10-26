import React from 'react';
import { TopicBeat } from '../types';

interface GoogleNewsTabBarProps {
  activeTab: TopicBeat;
  onTabChange: (tab: TopicBeat) => void;
  savedCount: number;
}

export const GoogleNewsTabBar: React.FC<GoogleNewsTabBarProps> = ({
  activeTab,
  onTabChange,
  savedCount,
}) => {
  const tabs: TopicBeat[] = [
    'For you',
    'Following',
    'Agentic AI',
    'Cloud & Infra',
    'Product & Strategy',
  ];

  return (
    <nav className="bg-white border-b border-[#DADCE0] px-6 overflow-x-auto select-none" aria-label="Topic categories">
      <div className="max-w-6xl mx-auto flex items-center justify-center gap-1 sm:gap-6 min-w-max">
        {tabs.map((tab) => {
          const isActive = activeTab === tab;
          return (
            <button
              key={tab}
              onClick={() => onTabChange(tab)}
              className={`relative py-3.5 px-3 text-sm font-medium transition-colors cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                isActive ? 'text-[#1A73E8] font-semibold' : 'text-[#5F6368] hover:text-[#202124]'
              }`}
              aria-current={isActive ? 'page' : undefined}
            >
              <span>{tab}</span>
              {tab === 'Following' && savedCount > 0 && (
                <span
                  className={`text-[11px] px-1.5 py-0.2 rounded-full font-semibold ${
                    isActive ? 'bg-[#1A73E8] text-white' : 'bg-[#E8EAED] text-[#5F6368]'
                  }`}
                >
                  {savedCount}
                </span>
              )}

              {/* 3px rounded Google Blue indicator bar */}
              {isActive && (
                <span className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#1A73E8] rounded-t-full" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
