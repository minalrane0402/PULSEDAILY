import { Story } from '../types';

export class AudioBriefingManager {
  private synth: SpeechSynthesis | null = null;
  private isPlaying: boolean = false;
  private isPaused: boolean = false;
  private currentStoryIndex: number = 0;
  private stories: Story[] = [];
  private onStateChange: ((isPlaying: boolean, progress: number, currentStoryId: number | string | null) => void) | null = null;

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.synth = window.speechSynthesis;
    }
  }

  public setListener(listener: (isPlaying: boolean, progress: number, currentStoryId: number | string | null) => void) {
    this.onStateChange = listener;
  }

  public playBriefing(storiesToRead: Story[]) {
    if (!this.synth) {
      console.warn("Text-to-speech is not supported in this browser environment.");
      return;
    }

    if (this.isPaused && this.isPlaying) {
      this.synth.resume();
      this.isPaused = false;
      this.notifyState();
      return;
    }

    this.stop();
    this.stories = storiesToRead.slice(0, 4);
    if (this.stories.length === 0) return;

    this.isPlaying = true;
    this.isPaused = false;
    this.currentStoryIndex = 0;
    this.speakCurrentStory();
  }

  private speakCurrentStory() {
    if (!this.synth || this.currentStoryIndex >= this.stories.length) {
      this.stop();
      return;
    }

    const story = this.stories[this.currentStoryIndex];
    const prefix = this.currentStoryIndex === 0
      ? "Good morning. Here is your 60-second PulseDaily AI briefing. First story from " + story.domain + ": "
      : "Next story from " + story.domain + ": ";

    const textToSpeak = `${prefix}${story.title}. TL;DR: ${story.tldrBullets[0] || ''}`;

    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.rate = 1.05;
    utterance.pitch = 1.0;

    // Pick an English voice if available
    try {
      const voices = this.synth.getVoices();
      const naturalVoice = voices.find(v => v.lang.startsWith('en') && (v.name.includes('Google') || v.name.includes('Natural') || v.name.includes('Samantha')));
      if (naturalVoice) utterance.voice = naturalVoice;
    } catch {
      // voice selection fallback
    }

    utterance.onend = () => {
      this.currentStoryIndex++;
      if (this.currentStoryIndex < this.stories.length && this.isPlaying) {
        this.speakCurrentStory();
      } else {
        this.stop();
      }
    };

    utterance.onerror = (e) => {
      console.warn("Speech synthesis error", e);
      this.stop();
    };

    this.synth.speak(utterance);
    this.notifyState();
  }

  public pause() {
    if (this.synth && this.isPlaying) {
      this.synth.pause();
      this.isPaused = true;
      this.notifyState();
    }
  }

  public resume() {
    if (this.synth && this.isPaused) {
      this.synth.resume();
      this.isPaused = false;
      this.notifyState();
    }
  }

  public stop() {
    if (this.synth) {
      try {
        this.synth.cancel();
      } catch (e) {
        console.warn("Speech cancel error", e);
      }
    }
    this.isPlaying = false;
    this.isPaused = false;
    this.currentStoryIndex = 0;
    this.notifyState();
  }

  private notifyState() {
    if (this.onStateChange) {
      const progress = this.stories.length > 0 ? Math.round(((this.currentStoryIndex) / this.stories.length) * 100) : 0;
      const currentId = this.stories[this.currentStoryIndex]?.id || null;
      this.onStateChange(this.isPlaying && !this.isPaused, progress, currentId);
    }
  }
}

export const briefingAudio = new AudioBriefingManager();
