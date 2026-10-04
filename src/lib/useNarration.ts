"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Lang } from "./brewZh";

// Reads brew-step instructions and chat replies aloud via /api/narrate
// (ElevenLabs). Two lanes, two <audio> elements:
//  - the guide (step instructions), one clip at a time, cached by text;
//  - the chat reply, spoken sentence by sentence *while it is still
//    streaming in*, so the voice starts after the first sentence rather than
//    after the whole answer.
// The lanes never overlap: while chat is talking the guide is paused (it
// keeps its place and picks up where it left off once chat finishes), so only
// the chime and the chat voice are heard. Narration is a nice-to-have, so
// every failure mode (missing server key, quota, a browser refusing autoplay)
// is swallowed quietly rather than surfaced as an error the brewing flow has
// to handle.
const MUTED_STORAGE_KEY = "teaCompanion.narration.muted";
// v2: spoken chat replies are on by default — the bump drops any "off" saved
// by the earlier opt-in-style toggle so everyone starts hearing replies.
const REPLY_MUTED_STORAGE_KEY = "teaCompanion.narration.replyMuted.v2";
const LANG_STORAGE_KEY = "teaCompanion.narration.lang";

// One spoken-reply session: text is fed in as it streams, cut into sentence
// chunks, fetched one at a time (a clip or two ahead of playback) and played
// in order on the shared reply element.
interface ReplySession {
  consumed: number; // chars of the cleaned text already turned into chunks
  pending: string[]; // chunks waiting to be fetched
  ready: string[]; // fetched clip URLs waiting to play
  fetching: boolean;
  playing: boolean;
  started: boolean; // first clip has played (guide is paused from then on)
  ended: boolean; // no more text is coming
  currentUrl: string | null;
}

const SILENT_WAV =
  "data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQAAAAA=";

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
  const [guideSpeaking, setGuideSpeaking] = useState(false);
  // True from the first reply clip until the last one finishes (including the
  // gaps between sentences), so the music stays ducked and the guide stays
  // paused for the whole reply.
  const [replySpeaking, setReplySpeaking] = useState(false);
  // Step text and narration share one language, switched from the brew screen.
  const [lang, setLang] = useState<Lang>("en");
  const langRef = useRef<Lang>("en");
  // Set when the server refuses to narrate (missing key, free-tier voice,
  // quota) so the UI can say why instead of staying mysteriously silent.
  const [problem, setProblem] = useState<string | null>(null);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const replyAudioRef = useRef<HTMLAudioElement | null>(null);
  const cacheRef = useRef<Map<string, string>>(new Map());
  const currentTextRef = useRef<string | null>(null);
  const sessionRef = useRef<ReplySession | null>(null);
  // The guide has something to say (mid-clip, or a clip ready to start) but
  // chat is talking, so it's waiting for its turn.
  const guideHeldRef = useRef(false);
  const replyActiveRef = useRef(false);

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
    audio.onplay = () => setGuideSpeaking(true);
    audio.onpause = () => setGuideSpeaking(false);
    audio.onended = () => setGuideSpeaking(false);
    audio.onerror = () => setGuideSpeaking(false);
    audioRef.current = audio;
    replyAudioRef.current = new Audio();
    return () => {
      audio.pause();
      audioRef.current = null;
      const reply = replyAudioRef.current;
      reply?.pause();
      replyAudioRef.current = null;
      sessionRef.current = null;
    };
  }, []);

  // POST the text to /api/narrate and return a playable blob URL (or null,
  // with `problem` set, if the service said no).
  async function fetchClip(text: string, language: Lang): Promise<string | null> {
    try {
      const res = await fetch("/api/narrate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, lang: language }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        const detail = data?.error?.message ?? data?.detail?.message ?? data?.detail;
        setProblem(typeof detail === "string" ? detail : `Narration failed (${res.status}).`);
        return null;
      }
      setProblem(null);
      return URL.createObjectURL(await res.blob());
    } catch {
      setProblem("Couldn't reach the narration service.");
      return null;
    }
  }

  // ── Guide lane ────────────────────────────────────────────────────────
  async function playGuide(text: string) {
    const audio = audioRef.current;
    if (!audio) return;
    currentTextRef.current = text;

    let url = cacheRef.current.get(text);
    if (!url) {
      const fetched = await fetchClip(text, langRef.current);
      if (!fetched) return;
      url = fetched;
      cacheRef.current.set(text, url);
    }

    // A step change (or replay) that happened while this fetch was in
    // flight already moved on — don't talk over it.
    if (currentTextRef.current !== text) return;
    // Muted while the audio was being fetched.
    if (mutedRef.current) return;
    audio.src = url;
    // Chat has the floor: park the clip and let it start once chat is done.
    if (replyActiveRef.current) {
      guideHeldRef.current = true;
      return;
    }
    guideHeldRef.current = false;
    try {
      await audio.play();
    } catch {
      // Autoplay refused (e.g. Safari before any gesture on the page) — the
      // replay button covers this.
    }
  }

  const speak = useCallback((text: string) => {
    if (muted || !text || currentTextRef.current === text) return;
    playGuide(text);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [muted]);

  const replay = useCallback(() => {
    const text = currentTextRef.current;
    if (!text) return;
    // Force a re-play even though this text is already "current".
    audioRef.current?.pause();
    playGuide(text);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function pauseGuideForReply() {
    const audio = audioRef.current;
    if (audio && !audio.paused && !audio.ended) {
      audio.pause();
      guideHeldRef.current = true;
    }
  }

  function resumeGuide() {
    const audio = audioRef.current;
    if (!audio || !guideHeldRef.current) return;
    guideHeldRef.current = false;
    if (mutedRef.current) return;
    audio.play().catch(() => {});
  }

  // ── Reply lane ────────────────────────────────────────────────────────
  function setReplyActive(on: boolean) {
    replyActiveRef.current = on;
    setReplySpeaking(on);
  }

  // Everything has been fetched and played: hand the floor back to the guide.
  function finishIfDone(session: ReplySession) {
    if (sessionRef.current !== session) return;
    if (!session.ended || session.playing || session.fetching) return;
    if (session.pending.length || session.ready.length) return;
    sessionRef.current = null;
    setReplyActive(false);
    resumeGuide();
  }

  function playNextClip(session: ReplySession) {
    const audio = replyAudioRef.current;
    if (!audio || sessionRef.current !== session || session.playing) return;
    const url = session.ready.shift();
    if (!url) {
      finishIfDone(session);
      return;
    }
    session.playing = true;
    session.currentUrl = url;
    if (!session.started) {
      session.started = true;
      setReplyActive(true);
      pauseGuideForReply();
    }
    audio.onended = audio.onerror = () => {
      if (sessionRef.current !== session) return;
      if (session.currentUrl) URL.revokeObjectURL(session.currentUrl);
      session.currentUrl = null;
      session.playing = false;
      pumpFetch(session);
      playNextClip(session);
    };
    audio.src = url;
    audio.play().catch(() => {
      // Autoplay refused — skip this clip and keep the queue moving so the
      // session still finishes (and the guide isn't stuck paused).
      audio.onended?.(new Event("ended"));
    });
  }

  // Keep one clip fetched ahead of whatever is playing, one request at a time.
  function pumpFetch(session: ReplySession) {
    if (sessionRef.current !== session || session.fetching) return;
    if (session.ready.length >= 2) return;
    const text = session.pending.shift();
    if (!text) {
      finishIfDone(session);
      return;
    }
    session.fetching = true;
    fetchClip(text, "en").then((url) => {
      session.fetching = false;
      if (sessionRef.current !== session) {
        if (url) URL.revokeObjectURL(url);
        return;
      }
      if (url) {
        session.ready.push(url);
        playNextClip(session);
      }
      pumpFetch(session);
    });
  }

  // Stop whatever chat is saying. `resume` hands the floor back to the guide.
  const cancelReply = useCallback((resume = true) => {
    const session = sessionRef.current;
    sessionRef.current = null;
    if (session) {
      session.ready.forEach((u) => URL.revokeObjectURL(u));
      if (session.currentUrl) URL.revokeObjectURL(session.currentUrl);
    }
    const audio = replyAudioRef.current;
    if (audio) {
      audio.onended = audio.onerror = null;
      audio.pause();
    }
    replyActiveRef.current = false;
    setReplySpeaking(false);
    if (resume) resumeGuide();
  }, []);

  // Feed the reply-so-far (the whole text each time, as it streams in).
  // Complete sentences are queued for speech as soon as they exist; `final`
  // flushes whatever is left. Chat replies are always English, whatever the
  // step language is.
  function feed(text: string, final: boolean, force: boolean) {
    if (replyMutedRef.current && !force) return;
    let session = sessionRef.current;
    if (!session || session.ended) {
      if (!text.trim()) return;
      session = {
        consumed: 0,
        pending: [],
        ready: [],
        fetching: false,
        playing: false,
        started: false,
        ended: false,
        currentUrl: null,
      };
      sessionRef.current = session;
    }

    const { view, capped } = spokenView(text);
    const last = final || capped;
    const first = session.consumed === 0 && session.pending.length === 0 && !session.started;
    let from = session.consumed;
    let min = first ? FIRST_CHUNK_MIN : CHUNK_MIN;
    for (;;) {
      const rest = view.slice(from);
      const m = findBoundary(rest, min);
      let end = m;
      if (end < 0 && rest.length > CHUNK_MAX) {
        // A very long run with no stop: cut at a comma or space instead.
        const cut = rest.lastIndexOf(", ", CHUNK_MAX);
        end = cut > 0 ? cut + 2 : rest.lastIndexOf(" ", CHUNK_MAX) + 1;
      }
      if (end <= 0) break;
      const chunk = rest.slice(0, end).trim();
      if (chunk) session.pending.push(chunk);
      from += end;
      min = CHUNK_MIN;
    }
    if (last) {
      const tail = view.slice(from).trim();
      if (tail) session.pending.push(tail);
      from = view.length;
      session.ended = true;
    }
    session.consumed = from;
    pumpFetch(session);
    if (last) finishIfDone(session);
  }

  // While the reply is still streaming in.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const feedReply = useCallback((text: string) => feed(text, false, false), []);
  // The reply is complete (or the stream broke): speak what's left.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const endReply = useCallback((text: string) => feed(text, true, false), []);
  // Tapping a bubble's speaker button bypasses `replyMuted` — asking to hear
  // it is explicit — and replaces anything already being said.
  const speakReply = useCallback(
    (text: string, force = false) => {
      if (replyMutedRef.current && !force) return;
      cancelReply(false);
      feed(text, true, force);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [cancelReply]
  );

  const toggleLang = useCallback(() => {
    const next: Lang = langRef.current === "zh" ? "en" : "zh";
    langRef.current = next;
    setLang(next);
    audioRef.current?.pause();
    guideHeldRef.current = false;
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
      if (next) {
        audioRef.current?.pause();
        guideHeldRef.current = false;
      }
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
      if (next) cancelReply(true);
      try {
        localStorage.setItem(REPLY_MUTED_STORAGE_KEY, next ? "1" : "0");
      } catch {
        // Preference just won't persist.
      }
      return next;
    });
  }, [cancelReply]);

  // Browsers only let audio start after a tap on the page. Playing a silent
  // clip from a tap ("Begin brew", sending a chat message) unlocks each
  // <audio> element, so later speech can start on its own (Safari is the
  // strict one).
  const prime = useCallback(() => {
    [audioRef.current, replyAudioRef.current].forEach((audio) => {
      if (!audio || audio.src) return;
      audio.src = SILENT_WAV;
      audio.play().catch(() => {});
    });
  }, []);

  return {
    muted,
    replyMuted,
    lang,
    guideSpeaking,
    replySpeaking,
    problem,
    speak,
    feedReply,
    endReply,
    cancelReply,
    speakReply,
    replay,
    toggleMute,
    toggleReplyMute,
    toggleLang,
    prime,
  };
}

const REPLY_SPEECH_CHARS = 700;
// Chunks short enough to start quickly, long enough not to sound choppy.
const FIRST_CHUNK_MIN = 24;
const CHUNK_MIN = 40;
const CHUNK_MAX = 240;

// Plain spoken text from a lightly-markdown'd reply.
function cleanForSpeech(raw: string): string {
  return raw
    .replace(/_\(connection interrupted\)_/g, "")
    .replace(/^\s*(?:[-*•]|\d+\.)\s+/gm, "")
    .replace(/[*_#`]/g, "")
    // A line break ends a thought even when the line has no full stop.
    .replace(/([^.!?:\s])[ \t]*\n+\s*/g, "$1. ")
    .replace(/\s+/g, " ")
    .trim();
}

// The part of the reply worth speaking so far: capped so one long answer
// doesn't burn through the monthly character quota, cut at a sentence end.
// Below the cap the view only ever grows, so chunks already queued stay valid
// as more text streams in; once past it the cut point no longer moves.
function spokenView(raw: string): { view: string; capped: boolean } {
  const plain = cleanForSpeech(raw);
  if (plain.length <= REPLY_SPEECH_CHARS) return { view: plain, capped: false };
  const cut = plain.slice(0, REPLY_SPEECH_CHARS);
  const end = Math.max(cut.lastIndexOf(". "), cut.lastIndexOf("? "), cut.lastIndexOf("! "));
  return { view: end > 200 ? cut.slice(0, end + 1) : cut, capped: true };
}

// Index just past the first sentence end (stop punctuation plus the space
// that confirms it) at least `min` chars in, or -1. A stop with no space after
// it yet might be a decimal or abbreviation still arriving, so it waits.
function findBoundary(text: string, min: number): number {
  const re = /[.!?…。！？]+["')\]”’]*\s+/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text))) {
    const end = m.index + m[0].length;
    if (end >= min) return end;
  }
  return -1;
}
