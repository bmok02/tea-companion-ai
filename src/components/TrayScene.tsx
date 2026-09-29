"use client";

import { LiquorTheme } from "@/lib/teaVisuals";

interface TraySceneProps {
  theme?: LiquorTheme;
  steaming?: boolean;
  /** 0–1 — how "loaded" the tray reads: dim and empty at 0 (no tea chosen
      yet), fully warm and poured at 1. Lets the same illustration serve the
      empty home screen and an active brew without becoming two assets. */
  presence?: number;
  /** 0–100 — the current step's elapsed share, same meaning as BrewCup's
      own fillPct. The gaiwan is the one vessel that tracks it now; nothing
      else on screen needs its own separate cup. */
  fillPct?: number;
  /** The current step's kind (see BrewStep in teaBrewing.ts). "steep" and
      "rinse" already explain themselves through fillPct + steam; "warm",
      "measure", and "pour" are untimed and otherwise show no motion at
      all, which is exactly what read as unclear — each gets its own
      explanatory action cue here instead. */
  action?: "warm" | "measure" | "rinse" | "steep" | "pour";
  className?: string;
}

const DEFAULT_LIQUID = "#b5522f";

// The instrument tray itself: a gongfu tea session's own tool layout — a
// slatted bamboo tray over a stone drip reservoir, a gaiwan at its centre,
// two aroma cups, a tea pick laid across the corner. This is the app's one
// illustrated world; every step of a brew is a position on this same tray
// rather than a floating card, so the scene is built to be looked at once
// and recomposed (see BrewModal's full-screen companion), not redrawn.
export default function TrayScene({
  theme,
  steaming = false,
  presence = 1,
  fillPct,
  action,
  className,
}: TraySceneProps) {
  const liquid = theme?.liquid ?? DEFAULT_LIQUID;
  const liquidLight = theme?.liquidLight ?? "#d9744a";
  const dim = 0.35 + presence * 0.65;
  // The gaiwan's interior spans roughly y=110 (rim) to y=144 (floor) in its
  // own path above — same rise-as-it-steeps technique as BrewCup.
  const hasFill = typeof fillPct === "number";
  const pct = Math.max(0, Math.min(100, fillPct ?? 0));
  const liquidY = 144 - (144 - 110) * (pct / 100);
  // The lid comes off to swirl water or add leaves — dimmed rather than
  // removed, so the gaiwan's silhouette stays recognisable throughout.
  const lidOpacity = action === "warm" || action === "measure" ? 0.2 : 1;

  return (
    <svg
      className={`tray-scene${className ? ` ${className}` : ""}`}
      viewBox="0 0 320 180"
      role="img"
      aria-label="The instrument tray, set and ready"
    >
      <defs>
        <radialGradient id="trayPool" cx="50%" cy="55%" r="60%">
          <stop offset="0%" stopColor="var(--brass)" stopOpacity="0.16" />
          <stop offset="100%" stopColor="var(--brass)" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="potBody" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={liquidLight} />
          <stop offset="100%" stopColor={liquid} />
        </linearGradient>
        <clipPath id="gaiwanInterior">
          <path d="M103 110 L120 142 Q140 147 160 142 L177 110 Z" />
        </clipPath>
      </defs>

      {/* Stone reservoir beneath the slats */}
      <rect x="18" y="26" width="284" height="132" rx="14" fill="var(--paper-dark)" />
      <ellipse cx="160" cy="120" rx="92" ry="30" fill="url(#trayPool)" />

      {/* Bamboo slatted top */}
      <g stroke="var(--border)" strokeWidth="1">
        {Array.from({ length: 11 }).map((_, i) => (
          <line key={i} x1={28 + i * 26} y1="34" x2={28 + i * 26} y2="150" />
        ))}
      </g>
      <rect
        x="18"
        y="26"
        width="284"
        height="132"
        rx="14"
        fill="none"
        stroke="var(--brass)"
        strokeOpacity="0.55"
        strokeWidth="1.5"
      />

      {/* Tea pick, laid across the near corner */}
      <g opacity="0.8" transform="translate(238,132) rotate(-32)">
        <line x1="0" y1="0" x2="52" y2="0" stroke="var(--brass)" strokeWidth="2" strokeLinecap="round" />
        <path d="M50 0 q6 -5 4 -10" stroke="var(--brass)" strokeWidth="2" fill="none" strokeLinecap="round" />
      </g>

      {/* Aroma cups */}
      <g opacity={0.75 + presence * 0.25}>
        <path d="M226 118 h26 l-3 16 q-10 4 -20 0 z" fill="var(--bamboo)" stroke="var(--brass)" strokeWidth="1.3" />
        <path d="M258 108 h24 l-2.6 14 q-9 3.5 -18.4 0 z" fill="var(--bamboo)" stroke="var(--brass)" strokeWidth="1.3" />
      </g>

      {/* The gaiwan — saucer, bowl, nested lid, and the steam it gives up
          mid-steep. A real gaiwan's bowl is wide at the mouth and tapers to
          a narrower foot (a shallow cone, not a bulging pot), and its lid
          sits nested just inside that mouth rather than capping it like a
          hat — both corrected here from the first pass. With no fillPct
          given (the home hero) it reads as already poured, warm and
          ambient; given one, the bowl starts empty clay and the liquid
          rises inside it exactly as BrewCup's cup used to, in its place. */}
      <g opacity={dim}>
        {/* Saucer */}
        <ellipse cx="140" cy="148" rx="54" ry="8" fill="var(--paper-dark)" stroke="var(--brass)" strokeOpacity="0.6" strokeWidth="1.2" />
        <ellipse cx="140" cy="145" rx="40" ry="6" fill="black" opacity="0.16" />

        {/* Bowl — wide mouth tapering to a narrower foot */}
        <path
          d="M100 108 L118 142 Q140 148 162 142 L180 108 Z"
          fill={hasFill ? "var(--bamboo)" : "url(#potBody)"}
          fillOpacity={hasFill ? 0.3 : 1}
          stroke="var(--gold-deep)"
          strokeWidth="1.4"
          strokeLinejoin="round"
        />
        {hasFill && (
          <g clipPath="url(#gaiwanInterior)">
            <rect x="98" y={liquidY} width="84" height={144 - liquidY + 8} fill="url(#potBody)" />
            <rect x="98" y={liquidY} width="84" height="2.2" fill={liquidLight} opacity="0.75" />
          </g>
        )}
        {/* The mouth — a thin rim ellipse marks the opening itself */}
        <ellipse
          cx="140"
          cy="108"
          rx="40"
          ry="8.5"
          fill={hasFill ? "var(--paper-dark)" : liquidLight}
          stroke="var(--gold-deep)"
          strokeWidth="1.4"
        />

        {/* Lid — nested just inside the mouth, not stacked above it */}
        <g opacity={lidOpacity}>
          <ellipse cx="140" cy="105" rx="33" ry="6.5" fill="var(--bamboo)" stroke="var(--brass)" strokeWidth="1.2" />
          <path
            d="M112 103.5 Q140 91 168 103.5 Q140 99 112 103.5 Z"
            fill="var(--paper-dark)"
            stroke="var(--brass)"
            strokeWidth="1.2"
          />
          <circle cx="140" cy="93" r="4" fill="var(--brass)" />
        </g>
      </g>

      {/* Warm your teaware: the lid is off (see lidOpacity above) and the
          water swirls around the bowl — an explicit "swirl it" cue where
          otherwise nothing on screen would move at all. */}
      {action === "warm" && (
        <g className="tray-scene-swirl" opacity={presence}>
          <path d="M140 111 A16 16 0 1 1 126.1 118.9" fill="none" stroke={liquidLight} strokeWidth="2.2" strokeLinecap="round" />
          <path d="M126.1 118.9 l-5.5 1.2 l2.6 4.9 z" fill={liquidLight} />
        </g>
      )}

      {/* Measure your leaves: the lid is off and leaves drop into the
          bowl, looping until the drinker moves on. */}
      {action === "measure" && (
        <g className="tray-scene-leaves" opacity={presence}>
          <g className="tray-scene-leaf tray-scene-leaf-1">
            <path d="M124,83 Q128,88 124,93 Q120,88 124,83 Z" fill="#7d8a52" />
            <path d="M124,83 L124,93" stroke="#5f6b3d" strokeWidth="0.6" />
          </g>
          <g className="tray-scene-leaf tray-scene-leaf-2">
            <path d="M140,81 Q144,86 140,91 Q136,86 140,81 Z" fill="#7d8a52" />
            <path d="M140,81 L140,91" stroke="#5f6b3d" strokeWidth="0.6" />
          </g>
          <g className="tray-scene-leaf tray-scene-leaf-3">
            <path d="M154,83 Q158,88 154,93 Q150,88 154,83 Z" fill="#7d8a52" />
            <path d="M154,83 L154,93" stroke="#5f6b3d" strokeWidth="0.6" />
          </g>
        </g>
      )}

      {/* Pour & enjoy: tea streams from the gaiwan into each aroma cup,
          which settle full — the payoff frame, and the fix for cups that
          otherwise never visibly received anything. */}
      {action === "pour" && (
        <g opacity={presence}>
          <path className="tray-scene-stream tray-scene-stream-1" d="M178 112 Q205 100 239 122" fill="none" stroke={liquidLight} strokeWidth="2.4" strokeLinecap="round" />
          <path className="tray-scene-stream tray-scene-stream-2" d="M178 108 Q222 90 270 112" fill="none" stroke={liquidLight} strokeWidth="2.4" strokeLinecap="round" />
          <path className="tray-scene-cup-fill tray-scene-cup-fill-1" d="M226 118 h26 l-3 16 q-10 4 -20 0 z" fill="url(#potBody)" />
          <path className="tray-scene-cup-fill tray-scene-cup-fill-2" d="M258 108 h24 l-2.6 14 q-9 3.5 -18.4 0 z" fill="url(#potBody)" />
        </g>
      )}

      {steaming && (
        <g className="tray-scene-steam" opacity={presence}>
          <path className="tray-scene-wisp tray-scene-wisp-1" d="M124 90 q-6 -14 2 -24" />
          <path className="tray-scene-wisp tray-scene-wisp-2" d="M140 86 q4 -16 -4 -28" />
          <path className="tray-scene-wisp tray-scene-wisp-3" d="M156 90 q6 -14 -2 -24" />
        </g>
      )}
    </svg>
  );
}
