"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";

// First-visit onboarding: a welcome question, then a spotlight tour. The page
// is dimmed everywhere except the one control being introduced, which is shown
// but not tappable: the only way forward is the Next button, bottom-right.

export interface TourStep {
  // CSS selector of the element to light up.
  target: string;
  title: string;
  body: string;
}

export const TOUR_STEPS: TourStep[] = [
  {
    target: ".tea-selector",
    title: "Choose your tea",
    body: "Search Tea Chapter’s catalogue and pick what you’re brewing. For this walk-through we’ll choose one for you.",
  },
  {
    target: "#brewNowBtn",
    title: "Begin your brew",
    body: "This opens the guided ritual. We’ll open it for you.",
  },
  {
    target: ".brew-cue",
    title: "One step at a time",
    body: "Every step appears here and is read aloud in a calm voice. Timed steps have a Start timer button, and a soft chime when time is up.",
  },
  {
    target: "#brewNextBtn",
    title: "Move on when you’re ready",
    body: "This moves you on to the following step. On a timed step it becomes Skip, in case you’d rather not wait.",
  },
  {
    target: ".brew-modal-header-actions",
    title: "Voice and language",
    body: "Mute the spoken guide, or switch the whole ritual between English and 中文, from here.",
  },
  {
    target: ".dock-switch",
    title: "Guide or Chat",
    body: "Chat is one tap away and never hides your timer. We’ll open it for you.",
  },
  {
    target: ".dock-panel .input-area",
    title: "Ask anything",
    body: "Type, or tap the mic to speak. Replies are read aloud as they appear — the speaker at the top of the panel turns that off. While a timer runs you’ll also find quick questions here, including a mindfulness question for the table.",
  },
  {
    target: ".dock-music",
    title: "Zen music",
    body: "Soft, endless ambient music to settle into. A volume slider appears once it’s playing.",
  },
];

// ── Welcome question ────────────────────────────────────────────────────

export function TourWelcome({ onAnswer }: { onAnswer: (firstTime: boolean) => void }) {
  const yesRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    yesRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onAnswer(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onAnswer]);

  return (
    <div className="tour-welcome-backdrop">
      <div
        className="tour-welcome"
        role="dialog"
        aria-modal="true"
        aria-labelledby="tourWelcomeTitle"
      >
        <span className="tour-welcome-mark" aria-hidden="true">
          茶渊
        </span>
        <h2 id="tourWelcomeTitle">Welcome to the Tea Companion</h2>
        <p>Are you using the Tea Companion for the first time?</p>
        <div className="tour-welcome-actions">
          <button ref={yesRef} className="tour-btn tour-btn-primary" onClick={() => onAnswer(true)}>
            Yes, show me around
          </button>
          <button className="tour-btn" onClick={() => onAnswer(false)}>
            No, I’ve been here before
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Spotlight ───────────────────────────────────────────────────────────

interface Box {
  top: number;
  left: number;
  width: number;
  height: number;
}

const PAD = 8; // breathing room around the lit element
const GAP = 14; // between the lit element and the card
const BAR_RESERVE = 96; // keep the card clear of the bottom-right Next button
const CARD_W = 340;

function sameBox(a: Box | null, b: Box | null) {
  if (a === b) return true;
  if (!a || !b) return false;
  return (
    Math.abs(a.top - b.top) < 0.5 &&
    Math.abs(a.left - b.left) < 0.5 &&
    Math.abs(a.width - b.width) < 0.5 &&
    Math.abs(a.height - b.height) < 0.5
  );
}

export function TourSpotlight({
  step,
  index,
  total,
  onNext,
}: {
  step: TourStep;
  index: number;
  total: number;
  onNext: () => void;
}) {
  const [box, setBox] = useState<Box | null>(null);
  const [cardH, setCardH] = useState(180);
  const [vp, setVp] = useState({ w: 0, h: 0 });
  const cardRef = useRef<HTMLDivElement>(null);

  // Follow the target every frame: panels slide, the page scrolls, windows
  // resize — measuring each frame keeps the light on the right spot through
  // all of it, and it's a handful of reads that bail out when nothing moved.
  useEffect(() => {
    let raf = 0;
    let scrolledTo: Element | null = null;
    const tick = () => {
      const el = document.querySelector(step.target);
      let next: Box | null = null;
      if (el) {
        const r = el.getBoundingClientRect();
        if (r.width > 0 && r.height > 0) {
          if (scrolledTo !== el) {
            scrolledTo = el;
            if (r.top < 0 || r.bottom > window.innerHeight) {
              el.scrollIntoView({ block: "center", behavior: "smooth" });
            }
          }
          next = {
            top: r.top - PAD,
            left: r.left - PAD,
            width: r.width + PAD * 2,
            height: r.height + PAD * 2,
          };
        }
      }
      setBox((prev) => (sameBox(prev, next) ? prev : next));
      setVp((prev) =>
        prev.w === window.innerWidth && prev.h === window.innerHeight
          ? prev
          : { w: window.innerWidth, h: window.innerHeight }
      );
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [step.target]);

  // The card's real height decides whether it fits above or below the target.
  useLayoutEffect(() => {
    const h = cardRef.current?.offsetHeight;
    if (h) setCardH(h);
  }, [index, vp.w, vp.h]);

  // Keep the page itself out of reach: the lit control is for looking at, and
  // Next is the only thing that can be pressed. Clicks are caught by the panes
  // below; this covers the keyboard (Tab / Enter / Space on a page control).
  const nextRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    nextRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      const inTour = (e.target as Element | null)?.closest?.(".tour-root");
      if (inTour) return;
      if (e.key === "Enter" || e.key === " " || e.key === "Tab") {
        e.preventDefault();
        e.stopPropagation();
        nextRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey, true);
    return () => window.removeEventListener("keydown", onKey, true);
  }, []);

  const { w: vw, h: vh } = vp;
  const cardW = Math.min(CARD_W, Math.max(0, vw - 24));
  const clamp = (n: number, lo: number, hi: number) => Math.max(lo, Math.min(n, hi));

  let card: { top: number; left: number } | null = null;
  if (vw > 0) {
    if (!box) {
      card = { top: Math.max(12, (vh - cardH) / 2), left: (vw - cardW) / 2 };
    } else {
      const below = box.top + box.height + GAP;
      const above = box.top - cardH - GAP;
      const left = clamp(box.left + box.width / 2 - cardW / 2, 12, vw - cardW - 12);
      if (below + cardH <= vh - BAR_RESERVE) card = { top: below, left };
      else if (above >= 12) card = { top: above, left };
      else {
        // A big target with no room above or below: go alongside it.
        const top = clamp(box.top + box.height / 2 - cardH / 2, 12, vh - BAR_RESERVE - cardH);
        const right = box.left + box.width + GAP;
        const leftSide = box.left - cardW - GAP;
        if (right + cardW <= vw - 12) card = { top, left: right };
        else if (leftSide >= 12) card = { top, left: leftSide };
        else card = { top: 12, left };
      }
    }
  }

  const last = index === total - 1;
  const bottom = box ? box.top + box.height : 0;
  const right = box ? box.left + box.width : 0;

  return (
    <div className="tour-root">
      {/* Four transparent panes around the lit element swallow stray clicks;
          the hole between them is open, so the highlighted control works. */}
      {box ? (
        <>
          <div className="tour-block" style={{ top: 0, left: 0, right: 0, height: Math.max(0, box.top) }} />
          <div className="tour-block" style={{ top: Math.max(0, bottom), left: 0, right: 0, bottom: 0 }} />
          <div
            className="tour-block"
            style={{ top: Math.max(0, box.top), left: 0, width: Math.max(0, box.left), height: box.height }}
          />
          <div
            className="tour-block"
            style={{ top: Math.max(0, box.top), left: Math.max(0, right), right: 0, height: box.height }}
          />
          <div
            className="tour-hole"
            style={{ top: box.top, left: box.left, width: box.width, height: box.height }}
          />
        </>
      ) : (
        <div className="tour-block tour-block-full" />
      )}

      {card && (
        <div
          ref={cardRef}
          className="tour-card"
          role="status"
          aria-live="polite"
          style={{ top: card.top, left: card.left, width: cardW }}
        >
          <span className="tour-card-count">
            Step {index + 1} of {total}
          </span>
          <h3>{step.title}</h3>
          <p>{step.body}</p>
          <span className="tour-card-hint">
            {last ? "Press Done to finish" : "Press Next to continue"}
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <line x1="7" y1="7" x2="17" y2="17" />
              <polyline points="17 8 17 17 8 17" />
            </svg>
          </span>
        </div>
      )}

      <div className="tour-bar">
        <button ref={nextRef} className="tour-btn tour-btn-primary tour-next" onClick={onNext}>
          {last ? "Done" : "Next"}
          {!last && (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <polyline points="9 5 16 12 9 19" />
            </svg>
          )}
        </button>
      </div>
    </div>
  );
}
