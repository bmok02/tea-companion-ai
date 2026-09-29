"use client";

import { LiquorTheme } from "@/lib/teaVisuals";

export type BrewSceneMode =
  | "warm" // pour water in, swirl, pour it out
  | "measure" // drop the tea bag in
  | "pour-in" // kettle poised over the gaiwan: pour water now
  | "wait" // lid on, tea steeping
  | "pour-out" // time's up: tip the gaiwan out
  | "serve"; // pour into the cup, lift it

interface BrewSceneProps {
  mode: BrewSceneMode;
  theme?: LiquorTheme;
  /** 0–100 — the running steep's elapsed share; deepens the liquor colour. */
  fillPct?: number;
  /** What pour-out empties into: the rinse is discarded, a steep is tea. */
  outIsTea?: boolean;
}

const ARIA: Record<BrewSceneMode, string> = {
  warm: "A kettle pours hot water into the gaiwan, it is swirled, then poured out",
  measure: "A tea bag drops into the gaiwan",
  "pour-in": "A kettle pours hot water into the gaiwan",
  wait: "The gaiwan sits with its lid on while the tea steeps",
  "pour-out": "The gaiwan tips and pours the tea out",
  serve: "The gaiwan pours tea into a cup, which is lifted to sip",
};

const WATER = "#bcd3d8";
const DEFAULT_LIQUID = "#b5522f";
const DEFAULT_LIGHT = "#d9744a";

// One tabletop, seen from the side, that every brew step re-stages: a kettle
// on the right, the gaiwan in the middle, a waste bowl on the left. Each step
// is one short physical action the drinker can copy — tilt the kettle, swirl,
// drop the bag, lid on, tip it out. All motion is CSS (see .bs-* in
// globals.css) and keyed off data-mode, so the SVG stays declarative and the
// loop timings live next to their keyframes.
export default function BrewScene({ mode, theme, fillPct = 0, outIsTea = false }: BrewSceneProps) {
  const liquid = theme?.liquid ?? DEFAULT_LIQUID;
  const liquidLight = theme?.liquidLight ?? DEFAULT_LIGHT;
  const showBag = mode === "measure" || mode === "pour-in" || mode === "wait" || mode === "pour-out";
  const lidOn = mode === "wait" || mode === "pour-out" || mode === "serve";
  const showKettle = mode !== "serve";
  // Rinse and warming water go in the waste bowl; a real steep is tea, so it
  // goes into a cup the drinker then lifts and drinks.
  const showVessel = mode === "warm" || (mode === "pour-out" && !outIsTea);
  const showDrinkCup = mode === "pour-out" && outIsTea;
  const showCup = mode === "serve";
  // Steeping water starts pale and takes on the tea's colour as time passes.
  const deepen =
    mode === "wait" || mode === "pour-out"
      ? 0.18 + 0.82 * (fillPct / 100)
      : mode === "serve"
        ? 1
        : mode === "pour-in"
          ? 0.12
          : 0;
  const outFill = outIsTea ? "url(#bsLiquor)" : WATER;

  return (
    <svg
      className="bscene"
      data-mode={mode}
      viewBox="0 24 400 216"
      role="img"
      aria-label={ARIA[mode]}
    >
      <defs>
        <linearGradient id="bsLiquor" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={liquidLight} />
          <stop offset="100%" stopColor={liquid} />
        </linearGradient>
        <linearGradient id="bsIron" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#3b342d" />
          <stop offset="100%" stopColor="#1d1915" />
        </linearGradient>
        <clipPath id="bsInterior">
          <path d="M96 140 L113 180 Q135 185 157 180 L174 140 Z" />
        </clipPath>
        <clipPath id="bsAboveMouth">
          <rect x="0" y="0" width="400" height="149" />
        </clipPath>
        <clipPath id="bsCupInterior">
          <path d="M208 172 h40 l-4 16 q-16 5 -32 0 z" />
        </clipPath>
        <clipPath id="bsDrinkInterior">
          <path d="M32 172 h40 l-4 16 q-16 5 -32 0 z" />
        </clipPath>
        <clipPath id="bsVesselInterior">
          <path d="M23 174 h58 l-5 13 q-24 6 -48 0 z" />
        </clipPath>
      </defs>

      {/* Tray: bamboo slats over dark stone */}
      <rect x="6" y="186" width="388" height="46" rx="10" fill="var(--paper-dark)" />
      <g stroke="var(--border)" strokeWidth="1">
        {Array.from({ length: 15 }).map((_, i) => (
          <line key={i} x1={22 + i * 26} y1="192" x2={22 + i * 26} y2="226" />
        ))}
      </g>
      <rect x="6" y="186" width="388" height="46" rx="10" fill="none" stroke="var(--brass)" strokeOpacity="0.55" strokeWidth="1.4" />

      {/* Waste bowl, left — where warming water and the rinse are poured out */}
      {showVessel && (
        <g className="bs-vessel">
          <ellipse cx="52" cy="188" rx="34" ry="5" fill="black" opacity="0.25" />
          <path d="M20 172 h64 l-6 16 q-26 6 -52 0 z" fill="var(--bamboo)" fillOpacity="0.35" stroke="var(--brass)" strokeWidth="1.3" strokeLinejoin="round" />
          <g clipPath="url(#bsVesselInterior)">
            <rect className="bs-vessel-fill" x="20" y="176" width="64" height="14" fill={outFill} />
          </g>
          <ellipse cx="52" cy="172" rx="32" ry="4.5" fill="none" stroke="var(--brass)" strokeWidth="1.3" />
        </g>
      )}

      {/* Drinking cup, left — a steep is tea: pour it here, then sip */}
      {showDrinkCup && (
        <g className="bs-drink">
          <ellipse cx="52" cy="189" rx="26" ry="4" fill="black" opacity="0.25" />
          <path d="M32 172 h40 l-4 16 q-16 5 -32 0 z" fill="var(--bamboo)" fillOpacity="0.4" stroke="var(--brass)" strokeWidth="1.4" strokeLinejoin="round" />
          <g clipPath="url(#bsDrinkInterior)">
            <rect className="bs-vessel-fill" x="30" y="172" width="44" height="18" fill="url(#bsLiquor)" />
          </g>
          <ellipse cx="52" cy="172" rx="20" ry="4" fill="none" stroke="var(--brass)" strokeWidth="1.4" />
          <g className="bs-steam bs-steam-drink">
            <path className="bs-wisp bs-wisp-1" d="M44 166 q-5 -12 2 -22" />
            <path className="bs-wisp bs-wisp-2" d="M53 164 q5 -14 -3 -26" />
            <path className="bs-wisp bs-wisp-3" d="M61 166 q5 -12 -2 -22" />
          </g>
        </g>
      )}

      {/* Saucer stays put while the gaiwan moves */}
      <ellipse cx="135" cy="189" rx="58" ry="8" fill="var(--paper-dark)" stroke="var(--brass)" strokeOpacity="0.6" strokeWidth="1.2" />

      {/* Lid resting beside the gaiwan whenever it's off */}
      {!lidOn && (
        <g className="bs-lid bs-lid-rest">
          <Lid />
        </g>
      )}

      {/* The gaiwan — everything that tips with it lives in this group */}
      <g className="bs-gaiwan">
        <path d="M93 140 L111 182 Q135 188 159 182 L177 140 Z" fill="var(--bamboo)" fillOpacity="0.3" stroke="var(--gold-deep)" strokeWidth="1.5" strokeLinejoin="round" />
        <ellipse cx="135" cy="140" rx="42" ry="9" fill="var(--paper-dark)" />

        {showBag && (
          <g clipPath="url(#bsAboveMouth)">
            <g className="bs-bag">
              <path className="bs-bag-string" d="M135 142 Q152 118 180 128" fill="none" stroke="var(--ink-muted)" strokeWidth="1.2" />
              <g className="bs-bag-tag">
                <rect x="177" y="126" width="12" height="17" rx="1.5" fill="var(--bamboo-pale)" stroke="var(--brass)" strokeWidth="1" />
                <line x1="180" y1="132" x2="186" y2="132" stroke="var(--brass)" strokeWidth="1" />
                <line x1="180" y1="136" x2="186" y2="136" stroke="var(--brass)" strokeWidth="1" />
              </g>
              <path d="M122 143 Q124 137 135 136 Q146 137 148 143 L146 163 Q135 168 124 163 Z" fill="#d8caa4" stroke="#8d7c55" strokeWidth="1.2" strokeLinejoin="round" />
              <path d="M124 146 Q135 150 146 146" fill="none" stroke="#8d7c55" strokeWidth="1" strokeDasharray="2 2" />
              <path d="M129 152 L131 162 M136 153 L136 164 M142 152 L140 162" stroke="#a89670" strokeWidth="0.8" />
            </g>
          </g>
        )}

        <g clipPath="url(#bsInterior)">
          <g className="bs-liquid">
            <rect x="90" y="146" width="90" height="44" fill={WATER} fillOpacity="0.85" />
            <rect
              className="bs-liquor"
              x="90"
              y="146"
              width="90"
              height="44"
              fill="url(#bsLiquor)"
              style={{ opacity: deepen }}
            />
            <rect x="90" y="146" width="90" height="2" fill="white" opacity="0.35" />
          </g>
        </g>

        <ellipse cx="135" cy="140" rx="42" ry="9" fill="none" stroke="var(--gold-deep)" strokeWidth="1.5" />

        {lidOn && (
          <g className="bs-lid bs-lid-on">
            <Lid />
          </g>
        )}
      </g>

      {/* Swirl hint: a ring around the mouth turning the way to swirl */}
      {mode === "warm" && (
        <g className="bs-swirl">
          <path d="M135 121 A34 12 0 1 1 101 134" fill="none" stroke={WATER} strokeWidth="2.4" strokeLinecap="round" />
          <path d="M101 134 l-1 -8 l8 3 z" fill={WATER} />
        </g>
      )}

      {/* Kettle */}
      {showKettle && (
        <g className="bs-kettle">
          <g transform="translate(320 186)">
            <ellipse cx="0" cy="2" rx="46" ry="5" fill="black" opacity="0.28" />
            <path d="M-36 -22 Q-52 -28 -58 -48 L-65 -50 Q-62 -22 -38 -10 Z" fill="url(#bsIron)" stroke="var(--brass)" strokeWidth="1.3" strokeLinejoin="round" />
            <path d="M-40 -8 Q-44 -46 -14 -54 L14 -54 Q44 -46 40 -8 Q40 0 30 0 L-30 0 Q-40 0 -40 -8 Z" fill="url(#bsIron)" stroke="var(--brass)" strokeWidth="1.5" strokeLinejoin="round" />
            <path d="M-30 -40 Q-26 -20 -28 -8" fill="none" stroke="white" strokeOpacity="0.14" strokeWidth="3" strokeLinecap="round" />
            <ellipse cx="0" cy="-54" rx="16" ry="4" fill="#2a251f" stroke="var(--brass)" strokeWidth="1.2" />
            <circle cx="0" cy="-60" r="4" fill="var(--brass)" />
            <path d="M-24 -52 Q4 -92 38 -46" fill="none" stroke="var(--brass)" strokeWidth="3" strokeLinecap="round" />
          </g>
        </g>
      )}

      {/* Water falling from the spout into the gaiwan */}
      {(mode === "warm" || mode === "pour-in") && (
        <g className="bs-stream bs-stream-in">
          <path d="M150 124 C152 134 150 142 147 150" fill="none" stroke={WATER} strokeWidth="3.6" strokeLinecap="round" />
          <path className="bs-stream-flow" d="M150 124 C152 134 150 142 147 150" fill="none" stroke="white" strokeOpacity="0.55" strokeWidth="1.4" strokeLinecap="round" strokeDasharray="4 7" />
          <ellipse className="bs-splash" cx="147" cy="147" rx="6" ry="1.8" fill="none" stroke="white" strokeOpacity="0.7" strokeWidth="1" />
        </g>
      )}

      {/* Water falling out of the tipped gaiwan */}
      {(mode === "warm" || mode === "pour-out") && (
        <g className="bs-stream bs-stream-out">
          <path d="M78 163 Q70 166 64 175" fill="none" stroke={outFill} strokeWidth="3.4" strokeLinecap="round" />
          <path className="bs-stream-flow" d="M78 163 Q70 166 64 175" fill="none" stroke="white" strokeOpacity="0.5" strokeWidth="1.2" strokeLinecap="round" strokeDasharray="3 6" />
        </g>
      )}

      {/* Serving cup, right of the gaiwan */}
      {showCup && (
        <g className="bs-cup">
          <ellipse cx="228" cy="189" rx="26" ry="4" fill="black" opacity="0.25" />
          <path d="M208 172 h40 l-4 16 q-16 5 -32 0 z" fill="var(--bamboo)" fillOpacity="0.4" stroke="var(--brass)" strokeWidth="1.4" strokeLinejoin="round" />
          <g clipPath="url(#bsCupInterior)">
            <rect className="bs-cup-fill" x="206" y="174" width="44" height="18" fill="url(#bsLiquor)" />
          </g>
          <ellipse cx="228" cy="172" rx="20" ry="4" fill="none" stroke="var(--brass)" strokeWidth="1.4" />
          <g className="bs-steam bs-steam-cup">
            <path className="bs-wisp bs-wisp-1" d="M220 166 q-5 -12 2 -22" />
            <path className="bs-wisp bs-wisp-2" d="M229 164 q5 -14 -3 -26" />
            <path className="bs-wisp bs-wisp-3" d="M237 166 q5 -12 -2 -22" />
          </g>
        </g>
      )}
      {mode === "serve" && (
        <g className="bs-stream bs-stream-cup">
          <path d="M192 163 Q206 166 226 178" fill="none" stroke="url(#bsLiquor)" strokeWidth="3.4" strokeLinecap="round" />
        </g>
      )}

      {/* Steam off the gaiwan whenever it holds hot water */}
      {(mode === "wait" || mode === "pour-in" || mode === "warm") && (
        <g className={`bs-steam bs-steam-gaiwan`}>
          <path className="bs-wisp bs-wisp-1" d="M118 128 q-6 -14 2 -26" />
          <path className="bs-wisp bs-wisp-2" d="M135 124 q5 -16 -4 -30" />
          <path className="bs-wisp bs-wisp-3" d="M152 128 q6 -14 -2 -26" />
        </g>
      )}
    </svg>
  );
}

function Lid() {
  return (
    <>
      <ellipse cx="135" cy="137" rx="36" ry="7" fill="var(--bamboo)" stroke="var(--brass)" strokeWidth="1.2" />
      <path d="M103 136 Q135 116 167 136 Q135 131 103 136 Z" fill="var(--paper-dark)" stroke="var(--brass)" strokeWidth="1.2" />
      <circle cx="135" cy="123" r="4.5" fill="var(--brass)" />
    </>
  );
}
