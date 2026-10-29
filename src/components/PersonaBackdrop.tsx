"use client";

import type { PersonaId } from "@/lib/personas";

// One faint motif behind the brew for each companion, in the same stroke
// language as the tea scene and tinted by the companion's accent (see the
// [data-persona] rules in globals.css). It stays in the screen's margins so
// it never sits under the instructions. `waiting` is true while a steep runs,
// which is when each one does its one bit of motion. Original draws nothing.

interface PersonaBackdropProps {
  persona: PersonaId;
  waiting: boolean;
}

export default function PersonaBackdrop({ persona, waiting }: PersonaBackdropProps) {
  if (persona === "original") return null;
  return (
    <div className={`persona-bg persona-bg-${persona}${waiting ? " waiting" : ""}`} aria-hidden="true">
      {persona === "master" && <MasterBg />}
      {persona === "hyrox" && <HyroxBg />}
      {persona === "exam" && <ExamBg />}
      {persona === "tease" && <TeaseBg />}
    </div>
  );
}

// Ink-wash ridges along the foot of the screen, and a stick of incense whose
// smoke rises while the tea steeps.
function MasterBg() {
  return (
    <>
      <svg className="pb-ridges" viewBox="0 0 1200 260" preserveAspectRatio="xMidYMax slice">
        <defs>
          <filter id="pbInk" x="-10%" y="-30%" width="120%" height="160%">
            <feGaussianBlur stdDeviation="6" />
          </filter>
        </defs>
        <path
          className="pb-ridge far"
          filter="url(#pbInk)"
          d="M0 170 C90 120 150 95 230 130 C300 160 340 80 420 70 C500 60 540 140 620 150 C700 160 760 90 850 85 C930 80 990 150 1060 140 C1120 132 1170 110 1200 115 L1200 260 L0 260 Z"
        />
        <path
          className="pb-ridge near"
          filter="url(#pbInk)"
          d="M0 220 C80 190 140 160 210 185 C280 210 330 170 400 165 C480 160 520 215 610 210 C690 205 740 170 820 175 C900 180 960 220 1040 205 C1110 192 1160 180 1200 185 L1200 260 L0 260 Z"
        />
      </svg>
      <svg className="pb-incense" viewBox="0 0 80 260">
        <path className="pb-smoke s1" d="M40 168 C28 140 52 120 38 96 C26 74 50 56 40 30 C34 16 42 6 46 0" />
        <path className="pb-smoke s2" d="M40 168 C52 146 30 126 44 104 C56 84 34 66 44 42 C50 28 40 14 36 4" />
        <line className="pb-stick" x1="40" y1="168" x2="40" y2="236" />
        <circle className="pb-ember" cx="40" cy="168" r="2.6" />
        <path className="pb-holder" d="M22 236 h36 l-6 14 h-24 Z" />
      </svg>
    </>
  );
}

// A heart-rate trace that slows down while the tea steeps ("heart rate
// down, focus up").
function HyroxBg() {
  return (
    <svg className="pb-ecg" viewBox="0 0 600 80" preserveAspectRatio="none">
      <path d="M0 40 H160 L176 40 L186 14 L198 66 L210 26 L220 40 H360 L376 40 L386 14 L398 66 L410 26 L420 40 H600" />
    </svg>
  );
}

// The faint rules and margin line of a notebook page.
function ExamBg() {
  return <div className="pb-paper" />;
}

// Doodles in the margins, and a pair of eyes that keep watch while you wait.
function TeaseBg() {
  return (
    <>
      <svg className="pb-doodles left" viewBox="0 0 200 600">
        <path d="M40 80 l8 18 l20 2 l-15 13 l5 20 l-18 -11 l-18 11 l5 -20 l-15 -13 l20 -2 Z" />
        <path d="M30 230 q20 -30 40 0 t40 0 t40 0" />
        <path d="M60 380 c-24 -22 -52 2 -26 28 l26 24 l26 -24 c26 -26 -2 -50 -26 -28 Z" />
        <path d="M120 520 l10 -10 M130 520 l-10 -10 M150 470 a6 6 0 1 0 0.1 0" />
      </svg>
      <svg className="pb-doodles right" viewBox="0 0 200 600">
        <path d="M110 120 c20 -40 60 -10 30 20 c-20 20 10 50 30 20" />
        <path d="M60 300 l14 30 l30 4 l-22 20 l6 30 l-28 -16 l-28 16 l6 -30 l-22 -20 l30 -4 Z" />
        <path d="M40 470 q30 20 60 0 q30 -20 60 0" />
      </svg>
      <svg className="pb-eyes" viewBox="0 0 96 48">
        <ellipse className="pb-eye" cx="26" cy="24" rx="18" ry="20" />
        <ellipse className="pb-eye" cx="70" cy="24" rx="18" ry="20" />
        <g className="pb-pupils">
          <circle cx="26" cy="30" r="7" />
          <circle cx="70" cy="30" r="7" />
        </g>
      </svg>
    </>
  );
}
