import React, { useState, useRef, useEffect } from 'react';
import { Search, Bell, ChevronDown, Check, X, ShieldCheck, LogIn, LogOut, SlidersHorizontal } from 'lucide-react';
import { UserRole, UserProfile } from '../types';
import { PERSONA_DEFINITIONS } from '../services/authAndPersona';

interface TopAppBarProps {
  activeRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  hasBreakingStories: boolean;
  userProfile: UserProfile;
  onToggleNotifications: () => void;
  onOpenSignInModal: (step?: 1 | 2) => void;
  onSignOut: () => void;
}

export const TopAppBar: React.FC<TopAppBarProps> = ({
  activeRole,
  onRoleChange,
  searchQuery,
  onSearchChange,
  hasBreakingStories,
  userProfile,
  onToggleNotifications,
  onOpenSignInModal,
  onSignOut,
}) => {
  const [roleMenuOpen, setRoleMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const roleRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  const roles: UserRole[] = [
    'Founder / Exec',
    'Software Engineer',
    'Product Manager',
  ];

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (roleRef.current && !roleRef.current.contains(event.target as Node)) {
        setRoleMenuOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setProfileMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const personaMeta = PERSONA_DEFINITIONS[activeRole];

  return (
    <header className="h-16 bg-white px-6 flex items-center justify-between gap-4 border-b border-[#DADCE0] sticky top-0 z-40 select-none">
      {/* Left: Official 4-color Google dots/G mark + PulseDaily */}
      <div className="shrink-0 flex items-center gap-2.5 cursor-pointer">
        <svg className="w-6 h-6 shrink-0" viewBox="0 0 48 48">
          <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
          <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
          <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
          <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
        </svg>
        <span className="text-xl font-bold text-[#202124] tracking-tight whitespace-nowrap">
          PulseDaily
        </span>
      </div>

      {/* Center: Wide pill search bar */}
      <div className="flex-1 max-w-xl mx-4">
        <div className="bg-[#F1F3F4] hover:bg-[#EAECEF] focus-within:bg-white focus-within:ring-2 focus-within:ring-[#1A73E8] focus-within:shadow-sm rounded-full px-4 py-2 flex items-center gap-2.5 transition-all">
          <Search className="w-4 h-4 text-[#5F6368] shrink-0" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search AI topics, models, or sources..."
            className="bg-transparent border-none outline-none text-sm text-[#202124] placeholder-[#5F6368] w-full"
            aria-label="Search stories"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="text-[#5F6368] hover:text-[#202124] p-0.5 rounded-full"
              title="Clear search"
              aria-label="Clear search"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Right Actions: Persona Lens + Breaking Bell + Google SSO */}
      <div className="shrink-0 flex items-center gap-2.5">
        {/* Compact Role Lens selector pill */}
        <div className="relative" ref={roleRef}>
          <button
            onClick={() => setRoleMenuOpen(!roleMenuOpen)}
            className="bg-[#E8F0FE] text-[#1A73E8] hover:bg-[#D2E3FC] rounded-full px-3 py-1.5 text-xs font-semibold whitespace-nowrap cursor-pointer transition-colors flex items-center gap-1.5 border border-[#D2E3FC]"
            aria-label={`Current role: ${activeRole}. Click to switch role lens.`}
          >
            <span>{personaMeta.icon}</span>
            <span>{activeRole}</span>
            <ChevronDown className="w-3.5 h-3.5" />
          </button>

          {roleMenuOpen && (
            <div className="absolute right-0 mt-2 w-60 bg-white rounded-2xl shadow-xl border border-[#DADCE0] py-2 z-50">
              <div className="px-3.5 py-1.5 text-[11px] font-bold text-[#5F6368] uppercase tracking-wider border-b border-[#E8EAED] flex items-center justify-between">
                <span>Select Persona Lens</span>
                <button
                  onClick={() => {
                    setRoleMenuOpen(false);
                    onOpenSignInModal(2);
                  }}
                  className="text-[#1A73E8] hover:underline font-semibold lowercase flex items-center gap-1"
                >
                  <SlidersHorizontal className="w-3 h-3" />
                  <span>details</span>
                </button>
              </div>

              {roles.map((r) => {
                const meta = PERSONA_DEFINITIONS[r];
                return (
                  <button
                    key={r}
                    onClick={() => {
                      onRoleChange(r);
                      setRoleMenuOpen(false);
                    }}
                    className={`w-full text-left px-3.5 py-2.5 text-xs font-medium flex items-center justify-between hover:bg-[#F1F3F4] transition-colors ${
                      activeRole === r ? 'text-[#1A73E8] bg-[#E8F0FE]' : 'text-[#202124]'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span>{meta.icon}</span>
                      <div>
                        <div className="font-semibold">{r}</div>
                        <div className="text-[10px] text-[#5F6368] line-clamp-1">{meta.tagline}</div>
                      </div>
                    </div>
                    {activeRole === r && <Check className="w-3.5 h-3.5 text-[#1A73E8] shrink-0" />}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Breaking Alert Bell icon button */}
        <button
          onClick={onToggleNotifications}
          className="w-9 h-9 rounded-full flex items-center justify-center text-[#5F6368] hover:bg-[#F1F3F4] transition-colors relative cursor-pointer"
          title={userProfile.notificationsEnabled ? 'Desktop notifications active' : 'Click to enable Breaking News notifications'}
          aria-label="Breaking news alerts"
        >
          <Bell className="w-4 h-4" />
          {hasBreakingStories && (
            <span className="absolute top-2 right-2 w-2 h-2 bg-[#D93025] rounded-full ring-2 ring-white animate-pulse" />
          )}
        </button>

        {/* Google SSO Button or Profile Chip */}
        {!userProfile.isSignedIn ? (
          <button
            onClick={() => onOpenSignInModal(1)}
            className="flex items-center gap-2 bg-white hover:bg-[#F8F9FA] text-[#202124] border border-[#DADCE0] hover:border-[#BDC1C6] rounded-full px-3.5 py-1.5 text-xs font-semibold cursor-pointer transition-all shadow-sm"
            aria-label="Sign in with Google"
          >
            <svg className="w-4 h-4" viewBox="0 0 48 48">
              <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
              <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
              <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
              <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
            </svg>
            <span>Sign in with Google</span>
          </button>
        ) : (
          <div className="relative" ref={profileRef}>
            <button
              onClick={() => setProfileMenuOpen(!profileMenuOpen)}
              className="flex items-center gap-2 bg-white hover:bg-[#F8F9FA] border border-[#DADCE0] rounded-full pl-1.5 pr-3 py-1 cursor-pointer transition-colors whitespace-nowrap"
              aria-label="Google user profile menu"
            >
              <div className="w-6 h-6 rounded-full bg-[#1A73E8] text-white flex items-center justify-center text-xs font-semibold ring-1 ring-[#DADCE0]">
                {userProfile.avatar || 'AR'}
              </div>
              <span className="text-xs font-medium text-[#202124] max-w-[120px] truncate">
                {userProfile.name}
              </span>
            </button>

            {profileMenuOpen && (
              <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-[#DADCE0] p-4 z-50">
                <div className="flex items-center gap-3 pb-3 border-b border-[#E8EAED]">
                  <div className="w-10 h-10 rounded-full bg-[#1A73E8] text-white flex items-center justify-center font-bold text-sm shrink-0">
                    {userProfile.avatar || 'AR'}
                  </div>
                  <div className="overflow-hidden">
                    <div className="text-xs font-bold text-[#202124] truncate">
                      {userProfile.name}
                    </div>
                    <div className="text-[11px] text-[#5F6368] truncate">
                      {userProfile.email}
                    </div>
                  </div>
                </div>

                <div className="pt-3 text-[11px] text-[#5F6368] space-y-2">
                  <div className="flex items-center gap-1.5 text-[#188038] font-semibold">
                    <ShieldCheck className="w-4 h-4 shrink-0" />
                    <span>Google Account Verified</span>
                  </div>

                  <div className="bg-[#F8F9FA] p-2.5 rounded-xl border border-[#E8EAED]">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-semibold text-[#202124]">Active Persona:</span>
                      <button
                        onClick={() => {
                          setProfileMenuOpen(false);
                          onOpenSignInModal(2);
                        }}
                        className="text-[#1A73E8] hover:underline font-semibold text-[11px] cursor-pointer"
                      >
                        Edit Persona
                      </button>
                    </div>
                    <div className="text-xs font-bold text-[#1A73E8] flex items-center gap-1">
                      <span>{personaMeta.icon}</span>
                      <span>{userProfile.role}</span>
                    </div>
                    <div className="text-[10px] text-[#5F6368] mt-0.5">
                      {personaMeta.tagline}
                    </div>
                  </div>

                  <div className="flex justify-between items-center px-1">
                    <span>Saved Bookmarks:</span>
                    <span className="font-semibold text-[#202124]">{userProfile.savedStoryIds.length}</span>
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t border-[#E8EAED] flex items-center justify-between">
                  <button
                    onClick={() => {
                      setProfileMenuOpen(false);
                      onOpenSignInModal(2);
                    }}
                    className="text-xs text-[#1A73E8] hover:underline font-semibold cursor-pointer"
                  >
                    Change Persona Lens
                  </button>
                  <button
                    onClick={() => {
                      setProfileMenuOpen(false);
                      onSignOut();
                    }}
                    className="text-xs text-[#D93025] hover:underline font-semibold flex items-center gap-1 cursor-pointer"
                  >
                    <LogOut className="w-3 h-3" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
};
