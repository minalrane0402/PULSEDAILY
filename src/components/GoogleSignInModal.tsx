import React, { useState, useEffect } from 'react';
import { X, Check, ArrowRight, ShieldCheck, Sparkles, Mail, User } from 'lucide-react';
import { UserRole, UserProfile } from '../types';
import { PERSONA_DEFINITIONS, isValidGmailAddress, formatInitials } from '../services/authAndPersona';

interface GoogleSignInModalProps {
  isOpen: boolean;
  initialStep?: 1 | 2;
  currentUser: UserProfile;
  onClose: () => void;
  onSuccess: (updatedProfile: UserProfile) => void;
}

export const GoogleSignInModal: React.FC<GoogleSignInModalProps> = ({
  isOpen,
  initialStep = 1,
  currentUser,
  onClose,
  onSuccess,
}) => {
  const [step, setStep] = useState<1 | 2>(initialStep);
  const [fullName, setFullName] = useState(currentUser.name || 'Alex Rivera');
  const [gmailAddress, setGmailAddress] = useState(
    currentUser.email && currentUser.email.endsWith('@gmail.com')
      ? currentUser.email
      : 'rminal0402@gmail.com'
  );
  const [selectedRole, setSelectedRole] = useState<UserRole>(currentUser.role || 'Software Engineer');
  const [emailError, setEmailError] = useState<string>('');
  const [nameError, setNameError] = useState<string>('');

  useEffect(() => {
    if (isOpen) {
      setStep(initialStep);
      setFullName(currentUser.name || 'Alex Rivera');
      setGmailAddress(
        currentUser.email && currentUser.email.endsWith('@gmail.com')
          ? currentUser.email
          : 'rminal0402@gmail.com'
      );
      setSelectedRole(currentUser.role || 'Software Engineer');
      setEmailError('');
      setNameError('');
    }
  }, [isOpen, initialStep, currentUser]);

  if (!isOpen) return null;

  const handleStep1Submit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    let hasError = false;

    if (!fullName.trim()) {
      setNameError('Please enter your full name');
      hasError = true;
    } else {
      setNameError('');
    }

    if (!isValidGmailAddress(gmailAddress)) {
      setEmailError('Please enter a valid @gmail.com address');
      hasError = true;
    } else {
      setEmailError('');
    }

    if (!hasError) {
      setStep(2);
    }
  };

  const handleCompleteOnboarding = () => {
    const updated: UserProfile = {
      ...currentUser,
      name: fullName.trim(),
      email: gmailAddress.trim().toLowerCase(),
      avatar: formatInitials(fullName),
      role: selectedRole,
      isSignedIn: true,
      joinedAt: currentUser.joinedAt || 'October 2026',
    };
    onSuccess(updated);
  };

  const quickFillPreset = (name: string, email: string) => {
    setFullName(name);
    setGmailAddress(email);
    setEmailError('');
    setNameError('');
  };

  const roles: UserRole[] = ['Founder / Exec', 'Software Engineer', 'Product Manager'];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="signin-modal-title"
    >
      <div className="bg-white rounded-3xl border border-[#DADCE0] shadow-2xl max-w-xl w-full overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Top Header with 4-Color Google Logo */}
        <div className="px-6 py-4 border-b border-[#E8EAED] flex items-center justify-between bg-white shrink-0">
          <div className="flex items-center gap-2.5">
            <svg className="w-6 h-6 shrink-0" viewBox="0 0 48 48">
              <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
              <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
              <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
              <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
            </svg>
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm text-[#202124]">PulseDaily Account</span>
              <span className="text-[11px] font-semibold text-[#1A73E8] bg-[#E8F0FE] px-2 py-0.5 rounded-full">
                Step {step} of 2: {step === 1 ? 'Gmail Authentication' : 'Choose Persona'}
              </span>
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

        {/* Modal Content Body */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1">
          {step === 1 ? (
            /* STEP 1: GMAIL SIGN IN */
            <div className="space-y-5">
              <div>
                <h2 id="signin-modal-title" className="text-xl font-bold text-[#202124] tracking-tight">
                  Sign in with your Google Account
                </h2>
                <p className="text-xs text-[#5F6368] mt-1">
                  Connect your Gmail address to customize breaking news delivery, synchronize saved reading lists across devices, and unlock AI-tailored role insights.
                </p>
              </div>

              {/* One-Click Quick Sign-In Chip (Recommended) */}
              <div className="bg-[#E8F0FE] border border-[#D2E3FC] rounded-2xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-bold text-[#174EA6] uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    Recommended One-Click Sign In
                  </span>
                  <span className="text-[11px] text-[#188038] font-semibold flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Verified Session
                  </span>
                </div>

                <div className="flex items-center justify-between gap-3 bg-white p-3 rounded-xl border border-[#DADCE0] hover:border-[#1A73E8] transition-colors">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-full bg-[#1A73E8] text-white flex items-center justify-center font-bold text-sm shrink-0">
                      RM
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-[#202124] truncate">rminal0402</div>
                      <div className="text-[11px] text-[#5F6368] truncate">rminal0402@gmail.com</div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      quickFillPreset('rminal0402', 'rminal0402@gmail.com');
                      setStep(2);
                    }}
                    className="bg-[#1A73E8] hover:bg-[#1557B0] text-white text-xs font-semibold px-4 py-2 rounded-full cursor-pointer transition-colors shadow-sm whitespace-nowrap flex items-center gap-1"
                  >
                    <span>Continue as rminal0402</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Divider */}
              <div className="flex items-center gap-3">
                <div className="h-px bg-[#E8EAED] flex-1" />
                <span className="text-xs text-[#5F6368] font-medium">Or enter your Gmail details</span>
                <div className="h-px bg-[#E8EAED] flex-1" />
              </div>

              {/* Manual Form */}
              <form onSubmit={handleStep1Submit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-[#202124] mb-1.5">
                    Full Name or Display Name
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-[#5F6368] absolute left-3.5 top-3" />
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => {
                        setFullName(e.target.value);
                        if (nameError) setNameError('');
                      }}
                      placeholder="e.g. Alex Rivera"
                      className={`w-full pl-10 pr-4 py-2.5 bg-[#F8F9FA] rounded-xl text-xs text-[#202124] border outline-none transition-all focus:bg-white focus:ring-2 focus:ring-[#1A73E8] ${
                        nameError ? 'border-[#D93025]' : 'border-[#DADCE0]'
                      }`}
                    />
                  </div>
                  {nameError && <p className="text-[11px] text-[#D93025] mt-1">{nameError}</p>}
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#202124] mb-1.5">
                    Gmail Address
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-[#5F6368] absolute left-3.5 top-3" />
                    <input
                      type="email"
                      value={gmailAddress}
                      onChange={(e) => {
                        setGmailAddress(e.target.value);
                        if (emailError) setEmailError('');
                      }}
                      placeholder="you@gmail.com"
                      className={`w-full pl-10 pr-4 py-2.5 bg-[#F8F9FA] rounded-xl text-xs text-[#202124] border outline-none transition-all focus:bg-white focus:ring-2 focus:ring-[#1A73E8] ${
                        emailError ? 'border-[#D93025]' : 'border-[#DADCE0]'
                      }`}
                    />
                  </div>
                  {emailError && <p className="text-[11px] text-[#D93025] mt-1">{emailError}</p>}
                  <p className="text-[11px] text-[#5F6368] mt-1">
                    Must be a valid @gmail.com address to receive verified breaking alerts.
                  </p>
                </div>

                <div className="pt-2 flex items-center justify-end gap-2.5">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 text-xs font-semibold text-[#5F6368] hover:text-[#202124] cursor-pointer rounded-full"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-[#1A73E8] hover:bg-[#1557B0] text-white rounded-full px-5 py-2.5 text-xs font-semibold cursor-pointer transition-colors shadow-sm flex items-center gap-1.5"
                  >
                    <span>Next: Choose Persona</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </form>
            </div>
          ) : (
            /* STEP 2: CHOOSE YOUR PROFESSIONAL PERSONA BASED ON RELEVANCE */
            <div className="space-y-4">
              <div>
                <h2 className="text-xl font-bold text-[#202124] tracking-tight">
                  Choose Your Professional Persona
                </h2>
                <p className="text-xs text-[#5F6368] mt-1">
                  Gemini structures every story's TL;DR, impact synthesis, and breaking radar according to the lens most relevant to your daily objectives:
                </p>
              </div>

              {/* 3 Persona Cards */}
              <div className="space-y-3">
                {roles.map((role) => {
                  const details = PERSONA_DEFINITIONS[role];
                  const isSelected = selectedRole === role;
                  return (
                    <div
                      key={role}
                      onClick={() => setSelectedRole(role)}
                      className={`p-4 rounded-2xl border-2 transition-all cursor-pointer text-left relative ${
                        isSelected
                          ? 'border-[#1A73E8] bg-[#E8F0FE]/60 ring-2 ring-[#1A73E8]/20 shadow-sm'
                          : 'border-[#DADCE0] hover:border-[#BDC1C6] bg-white hover:bg-[#F8F9FA]'
                      }`}
                      role="radio"
                      aria-checked={isSelected}
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === ' ' || e.key === 'Enter') {
                          e.preventDefault();
                          setSelectedRole(role);
                        }
                      }}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-2.5">
                          <span className="text-2xl">{details.icon}</span>
                          <div>
                            <h3 className="text-sm font-bold text-[#202124] flex items-center gap-2">
                              <span>{details.title}</span>
                              {isSelected && (
                                <span className="text-[10px] uppercase font-bold text-[#1A73E8] bg-[#E8F0FE] px-2 py-0.5 rounded-full border border-[#D2E3FC]">
                                  Active Lens
                                </span>
                              )}
                            </h3>
                            <p className="text-xs text-[#5F6368] mt-0.5">{details.tagline}</p>
                          </div>
                        </div>

                        <div
                          className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                            isSelected
                              ? 'bg-[#1A73E8] border-[#1A73E8] text-white'
                              : 'border-[#BDC1C6] bg-white'
                          }`}
                        >
                          {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                        </div>
                      </div>

                      {/* Focus areas pills */}
                      <div className="mt-3 pt-2.5 border-t border-[#E8EAED] grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                        {details.focusAreas.map((area, i) => (
                          <div key={i} className="flex items-center gap-1.5 text-[11px] text-[#3C4043]">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#1A73E8] shrink-0" />
                            <span className="truncate">{area}</span>
                          </div>
                        ))}
                      </div>

                      {/* Sample focus callout */}
                      <div className="mt-2.5 text-[11px] text-[#174EA6] bg-white/70 px-2.5 py-1.5 rounded-lg border border-[#D2E3FC] flex items-center gap-1.5">
                        <Sparkles className="w-3 h-3 text-[#1A73E8] shrink-0" />
                        <span className="italic">{details.sampleQuestion}</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex items-center justify-between border-t border-[#E8EAED]">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-3 py-1.5 text-xs font-semibold text-[#5F6368] hover:text-[#202124] cursor-pointer"
                >
                  ← Back to Account
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 text-xs font-semibold text-[#5F6368] hover:text-[#202124] cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleCompleteOnboarding}
                    className="bg-[#1A73E8] hover:bg-[#1557B0] text-white rounded-full px-5 py-2.5 text-xs font-semibold cursor-pointer transition-colors shadow-sm flex items-center gap-1.5"
                  >
                    <span>Complete Setup & Personalize Feed</span>
                    <Check className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
