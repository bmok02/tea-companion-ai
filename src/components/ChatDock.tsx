"use client";

import { ReactNode, useEffect, useRef } from "react";

interface ChatDockProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  teaName: string;
  voiceMuted: boolean;
  voiceSpeaking: boolean;
  onToggleVoice: () => void;
  musicPlaying: boolean;
  onToggleMusic: () => void;
  musicVolume: number;
  onMusicVolume: (v: number) => void;
  children: ReactNode;
}

// The corner switch between the two things this app does: follow the brew
// (Guide) or ask a question (Chat). It floats bottom-right on every screen, so
// the way back is always in the same place, and chat opens as a compact card
// above it rather than covering the brew — the timer stays in view.
export default function ChatDock({
  open,
  onOpenChange,
  teaName,
  voiceMuted,
  voiceSpeaking,
  onToggleVoice,
  musicPlaying,
  onToggleMusic,
  musicVolume,
  onMusicVolume,
  children,
}: ChatDockProps) {
  const panelRef = useRef<HTMLDivElement>(null);

  // Lets wide layouts slide the brew aside so the card never covers the timer.
  useEffect(() => {
    document.body.dataset.chat = open ? "open" : "closed";
    return () => {
      delete document.body.dataset.chat;
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    panelRef.current?.querySelector<HTMLTextAreaElement>("textarea")?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onOpenChange(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onOpenChange]);

  return (
    <div className={`dock${open ? " dock-open" : ""}`}>
      <div
        ref={panelRef}
        className="dock-panel"
        role="region"
        aria-label="Chat with the Tea Companion"
        aria-hidden={!open}
        inert={!open}
      >
        <div className="dock-panel-head">
          <span className="dock-panel-title">Ask the Companion</span>
          {teaName && <span className="dock-panel-tea">{teaName}</span>}
          <button
            type="button"
            className={`dock-voice${voiceSpeaking ? " speaking" : ""}`}
            onClick={onToggleVoice}
            aria-pressed={voiceMuted}
            aria-label={voiceMuted ? "Turn on spoken replies" : "Turn off spoken replies"}
            title={voiceMuted ? "Spoken replies off" : "Spoken replies on"}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
              {voiceMuted ? (
                <>
                  <line x1="23" y1="9" x2="17" y2="15" />
                  <line x1="17" y1="9" x2="23" y2="15" />
                </>
              ) : (
                <>
                  <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
                  <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
                </>
              )}
            </svg>
          </button>
        </div>
        <div className="dock-panel-body">{children}</div>
      </div>

      {/* Volume: only offered while the music plays, so it isn't clutter otherwise */}
      <div className={`dock-volume${musicPlaying ? " on" : ""}`} inert={!musicPlaying}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M9 18V6l10-2v12" />
          <circle cx="6.5" cy="18" r="2.5" />
          <circle cx="16.5" cy="16" r="2.5" />
        </svg>
        <input
          type="range"
          min={0}
          max={1}
          step={0.05}
          value={musicVolume}
          onChange={(e) => onMusicVolume(Number(e.target.value))}
          aria-label="Music volume"
          style={{ ["--fill" as string]: `${musicVolume * 100}%` }}
        />
      </div>
      <div className="dock-row">
      <button
        type="button"
        className={`dock-music${musicPlaying ? " playing" : ""}`}
        onClick={onToggleMusic}
        aria-pressed={musicPlaying}
        aria-label={musicPlaying ? "Pause zen music" : "Play zen music"}
        title={musicPlaying ? "Pause zen music" : "Play zen music"}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M9 18V6l10-2v12" />
          <circle cx="6.5" cy="18" r="2.5" />
          <circle cx="16.5" cy="16" r="2.5" />
        </svg>
      </button>
      <div className="dock-switch" role="group" aria-label="Switch view">
        <span className="dock-thumb" aria-hidden="true" />
        <button
          type="button"
          className="dock-seg"
          aria-pressed={!open}
          onClick={() => onOpenChange(false)}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M4 10h13v4a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5z" />
            <path d="M17 11h1.5a2.5 2.5 0 0 1 0 5H17" />
            <path d="M8 3c-1 1.5 1 2.5 0 4M12 3c-1 1.5 1 2.5 0 4" />
          </svg>
          Guide
        </button>
        <button
          type="button"
          className="dock-seg"
          aria-pressed={open}
          onClick={() => onOpenChange(true)}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12z" />
          </svg>
          Chat
        </button>
      </div>
      </div>
    </div>
  );
}
