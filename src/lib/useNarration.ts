"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Lang } from "./brewZh";

// Reads brew-step instructions aloud via /api/narrate (ElevenLabs). One
// <audio> element and one blob-URL cache live here for the whole modal
// session — narration is a nice-to-have, so every failure mode (missing
// server key, quota, a browser refusing autoplay) is swallowed quietly
// rather than surfaced as an error the brewing flow has to handle.
const MUTED_STORAGE_KEY = "teaCompanion.narration.muted";
const REPLY_MUTED_STORAGE_KEY = "teaCompanion.narration.replyMuted";
const LANG_STORAGE_KEY = "teaCompanion.narration.lang";

export function useNarration() {
  // Preferences live in localStorage, so they can only be read after mount —
  // reading them in the initial state would make the first client render
  // differ from the server's and break hydration.
  // Two independent switches: `muted` silences the guide's step instructions,
  // `replyMuted` silences the chat's spoken replies. Muting one never touches
  // the other.
  const [muted, setMuted] = useState(false);
  const [replyMuted, setReplyMuted] = useState(false);
  const mutedRef = useRef(false);
  const replyMutedRef = useRef(false);
  // Which of the two the shared <audio> element is currently voicing.
  const kindRef = useRef<"guide" | "reply">("guide");
  const [speakingKind, setSpeakingKind] = useState<"guide" | "reply" | null>(null);
  // Step text and narration share one language, switched from the brew screen.
  const [lang, setLang] = useState<Lang>("en");
  const langRef = useRef<Lang>("en");
  // Set when the server refuses to narrate (missing key, free-tier voice,
  // quota) so the UI can say why instead of staying mysteriously silent.
  const [problem, setProblem] = useState<string | null>(null);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const cacheRef = useRef<Map<string, string>>(new Map());
  const currentTextRef = useRef<string | null>(null);

  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    try {
      if (localStorage.getItem(MUTED_STORAGE_KEY) === "1") {
        mutedRef.current = true;
        setMuted(true);
      }
      if (localStorage.getItem(REPLY_MUTED_STORAGE_KEY) === "1") {
        replyMutedRef.current = true;
        setReplyMuted(true);
      }
      if (localStorage.getItem(LANG_STORAGE_KEY) === "zh") {
        langRef.current = "zh";
        setLang("zh");
      }
    } catch {
      // Storage unavailable — defaults stand.
    }
  }, []);
  /* eslint-enable react-hooks/set-state-in-effect */

  useEffect(() => {
    const audio = new Audio();
    audio.onplay = () => setSpeakingKind(kindRef.current);
    audio.onpause = () => setSpeakingKind(null);
    audio.onended = () => setSpeakingKind(null);
    audio.onerror = () => setSpeakingKind(null);
    audioRef.current = audio;
    return () => {
      audio.pause();
      audioRef.current = null;
    };
  }, []);

  async function play(
    text: string,
    kind: "guide" | "reply",
    langOverride?: Lang,
    force = false
  ) {
    const audio = audioRef.current;
    if (!audio) return;
    currentTextRef.current = text;
    kindRef.current = kind;

    let url = cacheRef.current.get(text);
    if (!url) {
      try {
        const res = await fetch("/api/narrate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text, lang: langOverride ?? langRef.current }),
        });
        if (!res.ok) {
          const data = await res.json().catch(() => null);
          const detail = data?.error?.message ?? data?.detail?.message ?? data?.detail;
          setProblem(typeof detail === "string" ? detail : `Narration failed (${res.status}).`);
          return;
        }
        setProblem(null);
        const blob = await res.blob();
        url = URL.createObjectURL(blob);
        cacheRef.current.set(text, url);
      } catch {
        setProblem("Couldn't reach the narration service.");
        return;
      }
    }

    // A step change (or replay) that happened while this fetch was in
    // flight already moved on — don't talk over it.
    if (currentTextRef.current !== text) return;
    // Muted while the audio was being fetched.
    if (!force && (kind === "guide" ? mutedRef.current : replyMutedRef.current)) return;
    try {
      audio.src = url;
      await audio.play();
    } catch {
      // Autoplay refused (e.g. Safari before any gesture on the page) — the
      // replay button covers this.
    }
  }

  const speak = useCallback((text: string) => {
    if (muted || !text || currentTextRef.current === text) return;
    play(text, "guide");
  }, [muted]);

  // Chat replies: always English (the assistant answers in English whatever
  // the step language is), stripped of markdown and capped so one long answer
  // doesn't burn through the monthly character quota. Tapping a bubble's
  // speaker button bypasses `replyMuted` — asking to hear it is explicit.
  const speakReply = useCallback((raw: string, force = false) => {
    if (replyMuted && !force) return;
    const text = forSpeech(raw);
    if (!text) return;
    audioRef.current?.pause();
    play(text, "reply", "en", force);
  }, [replyMuted]);

  const replay = useCallback(() => {
    const text = currentTextRef.current;
    if (!text) return;
    // Force a re-play even though this text is already "current".
    audioRef.current?.pause();
    play(text, kindRef.current);
  }, []);

  const toggleLang = useCallback(() => {
    const next: Lang = langRef.current === "zh" ? "en" : "zh";
    langRef.current = next;
    setLang(next);
    audioRef.current?.pause();
    try {
      localStorage.setItem(LANG_STORAGE_KEY, next);
    } catch {
      // Preference just won't persist.
    }
  }, []);

  const toggleMute = useCallback(() => {
    setMuted((prev) => {
      const next = !prev;
      mutedRef.current = next;
      if (next && kindRef.current === "guide") audioRef.current?.pause();
      try {
        localStorage.setItem(MUTED_STORAGE_KEY, next ? "1" : "0");
      } catch {
        // Private mode or full storage — the preference just won't persist.
      }
      return next;
    });
  }, []);

  const toggleReplyMute = useCallback(() => {
    setReplyMuted((prev) => {
      const next = !prev;
      replyMutedRef.current = next;
      if (next && kindRef.current === "reply") audioRef.current?.pause();
      try {
        localStorage.setItem(REPLY_MUTED_STORAGE_KEY, next ? "1" : "0");
      } catch {
        // Preference just won't persist.
      }
      return next;
    });
  }, []);

  // Browsers only let audio start after a tap on the page. Playing a silent
  // clip from the "Begin brew" click unlocks the shared <audio> element, so
  // later step changes can speak on their own (Safari is the strict one).
  const prime = useCallback(() => {
    const audio = audioRef.current;
    if (!audio || audio.src) return;
    audio.src =
      "data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQAAAAA=";
    audio.play().catch(() => {});
  }, []);

  return {
    muted,
    replyMuted,
    lang,
    guideSpeaking: speakingKind === "guide",
    replySpeaking: speakingKind === "reply",
    problem,
    speak,
    speakReply,
    replay,
    toggleMute,
    toggleReplyMute,
    toggleLang,
    prime,
  };
}

const REPLY_SPEECH_CHARS = 700;

// Plain spoken text from a lightly-markdown'd reply, cut at a sentence end.
function forSpeech(raw: string): string {
  const plain = raw
    .replace(/_\(connection interrupted\)_/g, "")
    .replace(/[*_#`]/g, "")
    .replace(/\s+/g, " ")
    .trim();
  if (plain.length <= REPLY_SPEECH_CHARS) return plain;
  const cut = plain.slice(0, REPLY_SPEECH_CHARS);
  const end = Math.max(cut.lastIndexOf(". "), cut.lastIndexOf("? "), cut.lastIndexOf("! "));
  return end > 200 ? cut.slice(0, end + 1) : cut;
}
