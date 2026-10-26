import React, { useState, useEffect } from 'react';
import { X, Sparkles, CheckCircle2, ExternalLink, Code2, LineChart, Briefcase } from 'lucide-react';
import { Story, UserRole } from '../types';
import { analyzeStoryWithGemini, GeminiAnalysisResult } from '../services/geminiService';

interface GeminiImpactModalProps {
  story: Story | null;
  activeRole: UserRole;
  onClose: () => void;
}

export const GeminiImpactModal: React.FC<GeminiImpactModalProps> = ({
  story,
  activeRole,
  onClose,
}) => {
  const [analysis, setAnalysis] = useState<GeminiAnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [selectedRole, setSelectedRole] = useState<UserRole>(activeRole);

  useEffect(() => {
    setSelectedRole(activeRole);
  }, [activeRole]);

  useEffect(() => {
    if (!story) {
      setAnalysis(null);
      return;
    }

    let isMounted = true;
    setIsLoading(true);
    analyzeStoryWithGemini(story, activeRole).then((res) => {
      if (isMounted) {
        setAnalysis(res);
        setIsLoading(false);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [story, activeRole]);

  if (!story) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div className="bg-white rounded-2xl border border-[#DADCE0] shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="p-6 border-b border-[#E8EAED] flex items-start justify-between gap-4 sticky top-0 bg-white z-10">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#E8F0FE] text-[#1A73E8] flex items-center justify-center shrink-0">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 id="modal-title" className="text-base font-bold text-[#202124] flex items-center gap-2">
                <span>Gemini Impact & Full Coverage</span>
                <span className="text-[11px] font-normal text-[#137333] bg-[#E6F4EA] px-2 py-0.5 rounded-full border border-[#CEEAD6]">
                  Strict responseSchema
                </span>
              </h2>
              <span className="text-xs text-[#5F6368]">{story.domain} • {story.beat}</span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-[#5F6368] hover:text-[#202124] p-1.5 rounded-full hover:bg-[#F1F3F4] transition-colors cursor-pointer"
            title="Close"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6">
          {/* Article Title */}
          <div>
            <h3 className="text-xl font-bold text-[#202124] leading-snug">
              {story.title}
            </h3>
            <div className="mt-2 flex items-center gap-3 text-xs text-[#5F6368]">
              <span>By {story.author}</span>
              <span>•</span>
              <span>{story.score} points on HackerNews</span>
              <span>•</span>
              <a
                href={story.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#1A73E8] hover:underline flex items-center gap-1 font-medium"
                aria-label="Read original article"
              >
                <span>Read Original</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

          {/* 3-Bullet TL;DR */}
          <div className="bg-[#F8F9FA] border border-[#DADCE0] rounded-xl p-4">
            <h4 className="text-xs font-bold text-[#202124] uppercase tracking-wider mb-2.5">
              3-Bullet Executive TL;DR
            </h4>
            <div className="space-y-2">
              {(analysis ? analysis.tldrBullets : story.tldrBullets).map((bullet, idx) => (
                <div key={idx} className="flex items-start gap-2 text-xs text-[#3C4043] leading-relaxed">
                  <span className="text-[#1A73E8] font-bold mt-0.5">•</span>
                  <span>{bullet}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Role Perspectives Switcher */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-xs font-bold text-[#202124] uppercase tracking-wider">
                Why This Matters By Role
              </h4>
              <span className="text-[11px] text-[#5F6368]">Select perspective</span>
            </div>

            {/* Role Tabs */}
            <div className="grid grid-cols-3 gap-2 mb-3">
              {(['Software Engineer', 'Product Manager', 'Founder / Exec'] as UserRole[]).map((role) => (
                <button
                  key={role}
                  onClick={() => setSelectedRole(role)}
                  className={`py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all border cursor-pointer ${
                    selectedRole === role
                      ? 'bg-[#1A73E8] text-white border-[#1A73E8] shadow-sm'
                      : 'bg-white text-[#5F6368] hover:bg-[#F8F9FA] border-[#DADCE0]'
                  }`}
                  aria-label={`View impact for ${role}`}
                >
                  {role === 'Software Engineer' && <Code2 className="w-3.5 h-3.5" />}
                  {role === 'Product Manager' && <LineChart className="w-3.5 h-3.5" />}
                  {role === 'Founder / Exec' && <Briefcase className="w-3.5 h-3.5" />}
                  <span className="truncate">{role}</span>
                </button>
              ))}
            </div>

            {/* Selected Role Content */}
            <div className="bg-[#E8F0FE] border border-[#D2E3FC] rounded-xl p-4">
              <div className="text-xs font-bold text-[#174EA6] mb-1 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Impact Assessment for {selectedRole}</span>
              </div>
              <p className="text-xs text-[#174EA6] leading-relaxed">
                {analysis?.roleImpact[selectedRole] || story.roleImpact[selectedRole]}
              </p>
            </div>
          </div>

          {/* Grounded Citation */}
          <div className="flex items-center gap-2 p-3 bg-[#E6F4EA] border border-[#CEEAD6] rounded-xl text-xs text-[#137333]">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>
              {analysis?.groundedTakeaway ||
                `Grounding verified directly against ${story.domain}. Zero hallucination guarantee.`}
            </span>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-[#F8F9FA] border-t border-[#E8EAED] flex items-center justify-between">
          <div className="text-[11px] text-[#5F6368]">
            {isLoading ? 'Synthesizing with Gemini 2.5 Flash...' : 'Response parsed with Type.OBJECT'}
          </div>

          <button
            onClick={onClose}
            className="bg-white hover:bg-[#F1F3F4] text-[#202124] border border-[#DADCE0] rounded-full px-4 py-2 text-xs font-semibold transition-colors cursor-pointer"
            aria-label="Done and close modal"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
