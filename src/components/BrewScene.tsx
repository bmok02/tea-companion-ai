"use client";

import { LiquorTheme } from "@/lib/teaVisuals";
import type { TeaSetId } from "@/lib/teaware";

export type BrewSceneMode =
  | "warm" // pour water in, swirl, pour it away
  | "measure" // tea goes in: a bag, or leaves
  | "pour-in" // kettle poised over the vessel: pour water now
  | "wait" // lid on, tea steeping
  | "pour-out" // time's up: tip the vessel out
  | "serve"; // pitcher pours into the cups, one is lifted

interface BrewSceneProps {
  mode: BrewSceneMode;
  theme?: LiquorTheme;
  /** 0–100 — the running steep's elapsed share; deepens the liquor colour. */
  fillPct?: number;
  /** What pour-out empties into: the rinse is discarded, a steep is tea. */
  outIsTea?: boolean;
  /** Pre-portioned tea bag, or loose leaves. */
  bag?: boolean;
  /** Which teaware is on the table. */
  set?: TeaSetId;
}

const WATER = "#bcd3d8";
const DEFAULT_LIQUID = "#b5522f";
const DEFAULT_LIGHT = "#d9744a";

// Interiors the liquid is clipped to, one per vessel shape.
const INTERIOR = {
  gaiwan: "M96 140 L113 180 Q135 185 157 180 L174 140 Z",
  pot: "M100 143 Q90 166 108 180 Q135 187 162 180 Q180 166 170 143 Z",
  pitcher: "M103 142 L108 180 Q135 186 162 180 L167 142 Z",
};

function describe(mode: BrewSceneMode, full: boolean, bag: boolean, outIsTea: boolean): string {
  const vessel = full ? "gaiwan" : "filter teapot";
  const pitcher = full ? "sharing pitcher" : "glass pitcher";
  const away = full ? "onto the slatted tea tray" : "into a waste bowl";
  switch (mode) {
    case "warm":
      return `A kettle pours hot water into the ${vessel}; it is swirled, then poured out ${away}`;
    case "measure":
      return bag
        ? `A tea bag drops into the ${vessel}`
        : full
          ? "Loose tea leaves drop into the gaiwan"
          : "Loose tea leaves drop into the teapot's strainer";
    case "pour-in":
      return `A kettle pours hot water into the ${vessel}`;
    case "wait":
      return `The ${vessel} sits with its lid on while the tea steeps`;
    case "pour-out":
      if (!outIsTea) return `The ${vessel} tips and the rinse water is poured out ${away}`;
      return full
        ? `The gaiwan's lid is slid open a little and the tea is poured through the gap into the ${pitcher}`
        : `The teapot tips with its lid on, its strainer holding the ${bag ? "bag" : "leaves"} back, pouring tea into the ${pitcher}`;
    case "serve":
      return `The ${pitcher} pours tea into the cups, and one is lifted to sip`;
  }
}

// One tabletop, seen from the side, that every brew step re-stages: a kettle
// on the right, the brewing vessel in the middle, and on the left whatever
// the vessel empties into. The set decides what's drawn:
//   full     — slatted tray, gaiwan on its saucer, porcelain sharing pitcher,
//              pale tasting cups; waste water goes straight onto the tray.
//   portable — cloth mat (no tray), filter teapot with a spout and built-in
//              strainer, glass pitcher, the set's dark cups; waste water goes
//              into a bowl.
// Loose leaves vs. a bag changes what drops in, and on the gaiwan the lid is
// slid ajar to pour so the leaves stay behind. All motion is CSS (see .bs-* in
// globals.css) keyed off data-mode, so the SVG stays declarative.
export default function BrewScene({
  mode,
  theme,
  fillPct = 0,
  outIsTea = false,
  bag = true,
  set = "full",
}: BrewSceneProps) {
  const full = set === "full";
  const liquid = theme?.liquid ?? DEFAULT_LIQUID;
  const liquidLight = theme?.liquidLight ?? DEFAULT_LIGHT;
  const serve = mode === "serve";
  const showTea = mode === "measure" || mode === "pour-in" || mode === "wait" || mode === "pour-out";
  const lidOn = mode === "wait" || mode === "pour-out";
  // A gaiwan can only pour through a gap between lid and bowl; the filter
  // teapot pours from its spout with the lid fully on.
  const lidAjar = full && mode === "pour-out";
  const showKettle = !serve;
  // Waste water (warming, rinse): full set → onto the tray, portable → bowl.
  const discarding = mode === "warm" || (mode === "pour-out" && !outIsTea);
  const showBowl = discarding && !full;
  const showTrayDrain = discarding && full;
  const showPitcherTarget = mode === "pour-out" && outIsTea;
  // Steeping water starts pale and takes on the tea's colour as time passes.
  const deepen =
    mode === "wait" || mode === "pour-out"
      ? 0.18 + 0.82 * (fillPct / 100)
      : serve
        ? 1
        : mode === "pour-in"
          ? 0.12
          : 0;
  const outFill = outIsTea ? "url(#bsLiquor)" : WATER;
  const interior = serve ? INTERIOR.pitcher : full ? INTERIOR.gaiwan : INTERIOR.pot;
  // Where the tipped vessel's stream starts: the gaiwan's rim, or the pot's spout.
  const outStart = full ? "M78 163" : "M67 165";
  const outPath = showTrayDrain
    ? `${outStart} Q68 170 64 190`
    : showBowl
      ? `${outStart} Q60 168 56 174`
      : `${outStart} Q62 166 58 171`;

  return (
    <svg
      className="bscene"
      data-mode={mode}
      data-set={set}
      viewBox="0 24 400 216"
      role="img"
      aria-label={describe(mode, full, bag, outIsTea)}
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
          <path d={interior} />
        </clipPath>
        <clipPath id="bsAboveMouth">
          <rect x="0" y="0" width="400" height="149" />
        </clipPath>
        <clipPath id="bsVesselInterior">
          <path d="M23 174 h58 l-5 13 q-24 6 -48 0 z" />
        </clipPath>
        <clipPath id="bsPitcherInterior">
          <path d="M31 169 L34 186 Q52 190 70 186 L73 169 Z" />
        </clipPath>
        <clipPath id="bsPotBody">
          <path d="M97 142 Q86 166 106 182 Q135 190 164 182 Q184 166 173 142 Z" />
        </clipPath>
      </defs>

      {full ? <Tray /> : <Mat />}

      {/* Waste bowl, left — portable set only: there's no tray to drain into */}
      {showBowl && (
        <g className="bs-vessel">
          <ellipse cx="52" cy="188" rx="34" ry="5" fill="black" opacity="0.25" />
          <path d="M20 172 h64 l-6 16 q-26 6 -52 0 z" fill="var(--bamboo)" fillOpacity="0.35" stroke="var(--brass)" strokeWidth="1.3" strokeLinejoin="round" />
          <g clipPath="url(#bsVesselInterior)">
            <rect className="bs-vessel-fill" x="20" y="176" width="64" height="14" fill={outFill} />
          </g>
          <ellipse cx="52" cy="172" rx="32" ry="4.5" fill="none" stroke="var(--brass)" strokeWidth="1.3" />
        </g>
      )}

      {/* Full set: waste water splashes straight onto the slatted tray */}
      {showTrayDrain && (
        <g className="bs-drain">
          <ellipse className="bs-splash" cx="64" cy="190" rx="9" ry="2.2" fill="none" stroke={WATER} strokeWidth="1.3" />
          <ellipse cx="62" cy="191" rx="18" ry="2.6" fill={WATER} opacity="0.35" />
        </g>
      )}

      {/* A steep is tea: it goes into the pitcher, not straight into a cup */}
      {showPitcherTarget && (
        <g className="bs-pitcher-target">
          <ellipse cx="52" cy="189" rx="26" ry="4" fill="black" opacity="0.25" />
          <PitcherSmall full={full} />
          <g clipPath="url(#bsPitcherInterior)">
            <rect className="bs-vessel-fill" x="28" y="176" width="48" height="16" fill="url(#bsLiquor)" />
          </g>
          <ellipse cx="52" cy="169" rx="21" ry="3.5" fill="none" stroke={full ? "var(--brass)" : "var(--ink-muted)"} strokeWidth="1.3" />
        </g>
      )}

      {/* Saucer stays put while the gaiwan moves (gaiwan only) */}
      {full && !serve && (
        <ellipse cx="135" cy="189" rx="58" ry="8" fill="var(--paper-dark)" stroke="var(--brass)" strokeOpacity="0.6" strokeWidth="1.2" />
      )}
      {!full && !serve && <ellipse cx="135" cy="188" rx="40" ry="5" fill="black" opacity="0.25" />}

      {/* Lid resting beside the vessel whenever it's off */}
      {!lidOn && !serve && (
        <g className="bs-lid bs-lid-rest">{full ? <GaiwanLid /> : <PotLid />}</g>
      )}

      {/* The vessel — everything that tips with it lives in this group. In the
          serve step it's the pitcher, pouring into the cups. */}
      <g className="bs-gaiwan">
        {serve ? (
          <PitcherBody full={full} />
        ) : full ? (
          <>
            <path d="M93 140 L111 182 Q135 188 159 182 L177 140 Z" fill="var(--bamboo)" fillOpacity="0.3" stroke="var(--gold-deep)" strokeWidth="1.5" strokeLinejoin="round" />
            <ellipse cx="135" cy="140" rx="42" ry="9" fill="var(--paper-dark)" />
          </>
        ) : (
          <PotBody />
        )}

        {/* A bag sits mostly below the rim with its top showing */}
        {showTea && bag && (
          <g clipPath="url(#bsAboveMouth)">
            <g className="bs-bag">
              <TeaBag />
            </g>
          </g>
        )}

        <g clipPath="url(#bsInterior)">
          <g className="bs-liquid">
            <rect x="88" y="146" width="94" height="44" fill={WATER} fillOpacity="0.85" />
            <rect
              className="bs-liquor"
              x="88"
              y="146"
              width="94"
              height="44"
              fill="url(#bsLiquor)"
              style={{ opacity: deepen }}
            />
            <rect x="88" y="146" width="94" height="2" fill="white" opacity="0.35" />
          </g>
        </g>

        {/* Loose leaves settle on the bottom, seen through the water — and
            stay there when the vessel tips, which is the point */}
        {showTea && !bag && (
          <g className="bs-bag" opacity="0.92">
            <Leaves />
          </g>
        )}

        {/* Rim, strainer and band drawn over the liquid */}
        {serve ? (
          <ellipse cx="135" cy="141" rx="33" ry="6" fill="none" stroke={full ? "var(--gold-deep)" : "var(--ink-muted)"} strokeWidth="1.5" />
        ) : full ? (
          <ellipse cx="135" cy="140" rx="42" ry="9" fill="none" stroke="var(--gold-deep)" strokeWidth="1.5" />
        ) : (
          <PotDetail />
        )}

        {lidOn && (
          <g transform={lidAjar ? "translate(10 -3) rotate(5 135 137)" : undefined}>
            <g className="bs-lid bs-lid-on">{full ? <GaiwanLid /> : <PotLid />}</g>
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

      {/* Water falling from the kettle spout into the vessel */}
      {(mode === "warm" || mode === "pour-in") && (
        <g className="bs-stream bs-stream-in">
          <path d="M150 124 C152 134 150 142 147 150" fill="none" stroke={WATER} strokeWidth="3.6" strokeLinecap="round" />
          <path className="bs-stream-flow" d="M150 124 C152 134 150 142 147 150" fill="none" stroke="white" strokeOpacity="0.55" strokeWidth="1.4" strokeLinecap="round" strokeDasharray="4 7" />
          <ellipse className="bs-splash" cx="147" cy="147" rx="6" ry="1.8" fill="none" stroke="white" strokeOpacity="0.7" strokeWidth="1" />
        </g>
      )}

      {/* What falls out of the tipped vessel */}
      {(mode === "warm" || mode === "pour-out") && (
        <g className="bs-stream bs-stream-out">
          <path d={outPath} fill="none" stroke={outFill} strokeWidth="3.4" strokeLinecap="round" />
          <path className="bs-stream-flow" d={outPath} fill="none" stroke="white" strokeOpacity="0.5" strokeWidth="1.2" strokeLinecap="round" strokeDasharray="3 6" />
        </g>
      )}

      {/* Serve: the pitcher fills the cups — the first one is lifted to sip */}
      {serve && (
        <>
          <g className="bs-cup">
            <ellipse cx="228" cy="189" rx="24" ry="4" fill="black" opacity="0.25" />
            <Cup x={228} full={full} fillClass="bs-cup-fill" />
            <g className="bs-steam bs-steam-cup">
              <path className="bs-wisp bs-wisp-1" d="M220 166 q-5 -12 2 -22" />
              <path className="bs-wisp bs-wisp-2" d="M229 164 q5 -14 -3 -26" />
              <path className="bs-wisp bs-wisp-3" d="M237 166 q5 -12 -2 -22" />
            </g>
          </g>
          {[276, 324].map((x) => (
            <g key={x}>
              <ellipse cx={x} cy="189" rx="24" ry="4" fill="black" opacity="0.25" />
              <Cup x={x} full={full} fillClass="bs-cup-fill bs-cup-fill-done" />
            </g>
          ))}
          <g className="bs-stream bs-stream-cup">
            <path d="M196 161 Q208 165 226 178" fill="none" stroke="url(#bsLiquor)" strokeWidth="3.4" strokeLinecap="round" />
          </g>
        </>
      )}

      {/* Steam off the vessel whenever it holds hot water */}
      {(mode === "wait" || mode === "pour-in" || mode === "warm") && (
        <g className="bs-steam bs-steam-gaiwan">
          <path className="bs-wisp bs-wisp-1" d="M118 128 q-6 -14 2 -26" />
          <path className="bs-wisp bs-wisp-2" d="M135 124 q5 -16 -4 -30" />
          <path className="bs-wisp bs-wisp-3" d="M152 128 q6 -14 -2 -26" />
        </g>
      )}
    </svg>
  );
}

// ── Surfaces ──────────────────────────────────────────────────────────────
// Full set: bamboo slats over a drip reservoir, so waste water just goes on it.
function Tray() {
  return (
    <>
      <rect x="6" y="186" width="388" height="46" rx="10" fill="var(--paper-dark)" />
      <g stroke="var(--border)" strokeWidth="1">
        {Array.from({ length: 15 }).map((_, i) => (
          <line key={i} x1={22 + i * 26} y1="192" x2={22 + i * 26} y2="226" />
        ))}
      </g>
      <rect x="6" y="186" width="388" height="46" rx="10" fill="none" stroke="var(--brass)" strokeOpacity="0.55" strokeWidth="1.4" />
    </>
  );
}

// Portable set: a cloth mat on any table. Solid — nothing drains through it.
function Mat() {
  return (
    <>
      <rect x="10" y="186" width="380" height="40" rx="4" fill="var(--paper-dark)" opacity="0.8" />
      <rect x="16" y="190" width="368" height="32" rx="2" fill="none" stroke="var(--brass)" strokeOpacity="0.4" strokeWidth="1" strokeDasharray="3 3" />
    </>
  );
}

// ── Brewing vessels ───────────────────────────────────────────────────────
function GaiwanLid() {
  return (
    <>
      <ellipse cx="135" cy="137" rx="36" ry="7" fill="var(--bamboo)" stroke="var(--brass)" strokeWidth="1.2" />
      <path d="M103 136 Q135 116 167 136 Q135 131 103 136 Z" fill="var(--paper-dark)" stroke="var(--brass)" strokeWidth="1.2" />
      <circle cx="135" cy="123" r="4.5" fill="var(--brass)" />
    </>
  );
}

// Filter teapot: round stoneware body, short spout on the left, wooden band.
function PotBody() {
  return (
    <>
      <path d="M98 150 Q86 146 79 136 L84 134 Q92 142 101 144 Z" fill="url(#bsIron)" stroke="var(--brass)" strokeWidth="1.2" strokeLinejoin="round" />
      <path d="M97 142 Q86 166 106 182 Q135 190 164 182 Q184 166 173 142 Z" fill="url(#bsIron)" fillOpacity="0.45" stroke="var(--gold-deep)" strokeWidth="1.5" strokeLinejoin="round" />
      <ellipse cx="135" cy="142" rx="38" ry="7" fill="var(--paper-dark)" />
    </>
  );
}

function PotDetail() {
  return (
    <>
      {/* Built-in strainer: the leaves (or bag) sit inside it */}
      <path d="M110 145 Q108 170 135 175 Q162 170 160 145" fill="none" stroke="var(--brass)" strokeOpacity="0.7" strokeWidth="1.1" strokeDasharray="2 2.5" />
      {/* Wooden band */}
      <g clipPath="url(#bsPotBody)">
        <rect x="80" y="167" width="110" height="6" fill="#8a5a32" opacity="0.55" />
      </g>
      <ellipse cx="135" cy="142" rx="38" ry="7" fill="none" stroke="var(--gold-deep)" strokeWidth="1.5" />
    </>
  );
}

function PotLid() {
  return (
    <>
      <ellipse cx="135" cy="139" rx="34" ry="6" fill="#2a251f" stroke="var(--brass)" strokeWidth="1.2" />
      <path d="M106 138 Q135 118 164 138 Q135 133 106 138 Z" fill="url(#bsIron)" stroke="var(--brass)" strokeWidth="1.2" />
      <rect x="129" y="118" width="12" height="7" rx="2.5" fill="#8a5a32" stroke="var(--brass)" strokeWidth="1" />
    </>
  );
}

// ── Pitchers & cups ───────────────────────────────────────────────────────
// Full set: porcelain sharing pitcher. Portable: clear glass pitcher.
function PitcherBody({ full }: { full: boolean }) {
  return full ? (
    <>
      <path d="M170 140 L181 135 L177 146 Z" fill="var(--bamboo)" fillOpacity="0.5" stroke="var(--gold-deep)" strokeWidth="1.2" strokeLinejoin="round" />
      <path d="M100 140 L106 182 Q135 189 164 182 L170 140 Z" fill="var(--bamboo)" fillOpacity="0.3" stroke="var(--gold-deep)" strokeWidth="1.5" strokeLinejoin="round" />
    </>
  ) : (
    <>
      <path d="M170 140 L181 135 L177 146 Z" fill="white" fillOpacity="0.08" stroke="var(--ink-muted)" strokeWidth="1.2" strokeLinejoin="round" />
      <path d="M100 140 L106 182 Q135 189 164 182 L170 140 Z" fill="white" fillOpacity="0.06" stroke="var(--ink-muted)" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M106 148 L110 176" stroke="white" strokeOpacity="0.35" strokeWidth="2" strokeLinecap="round" />
    </>
  );
}

function PitcherSmall({ full }: { full: boolean }) {
  return full ? (
    <path d="M30 168 L33 187 Q52 192 71 187 L74 168 Z" fill="var(--bamboo)" fillOpacity="0.35" stroke="var(--brass)" strokeWidth="1.3" strokeLinejoin="round" />
  ) : (
    <>
      <path d="M30 168 L33 187 Q52 192 71 187 L74 168 Z" fill="white" fillOpacity="0.06" stroke="var(--ink-muted)" strokeWidth="1.3" strokeLinejoin="round" />
      <path d="M35 172 L37 184" stroke="white" strokeOpacity="0.35" strokeWidth="1.6" strokeLinecap="round" />
    </>
  );
}

// Full set: pale porcelain tasting cups. Portable: the set's dark stoneware cups.
function Cup({ x, full, fillClass }: { x: number; full: boolean; fillClass: string }) {
  const id = `bsCup${x}`;
  return (
    <>
      <clipPath id={id}>
        <path d={`M${x - 18} 174 h36 l-4 14 q-14 4 -28 0 z`} />
      </clipPath>
      <path
        d={`M${x - 20} 172 h40 l-4 16 q-16 5 -32 0 z`}
        fill={full ? "#efe6d6" : "url(#bsIron)"}
        fillOpacity={full ? 0.85 : 1}
        stroke="var(--brass)"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
      <g clipPath={`url(#${id})`}>
        <rect className={fillClass} x={x - 22} y="174" width="44" height="18" fill="url(#bsLiquor)" />
      </g>
      <ellipse cx={x} cy="172" rx="20" ry="4" fill="none" stroke={full ? "var(--brass)" : "#d8caa4"} strokeWidth="1.4" />
    </>
  );
}

// ── What goes in ──────────────────────────────────────────────────────────
function TeaBag() {
  return (
    <>
      <path className="bs-bag-string" d="M135 142 Q152 118 180 128" fill="none" stroke="var(--ink-muted)" strokeWidth="1.2" />
      <g className="bs-bag-tag">
        <rect x="177" y="126" width="12" height="17" rx="1.5" fill="var(--bamboo-pale)" stroke="var(--brass)" strokeWidth="1" />
        <line x1="180" y1="132" x2="186" y2="132" stroke="var(--brass)" strokeWidth="1" />
        <line x1="180" y1="136" x2="186" y2="136" stroke="var(--brass)" strokeWidth="1" />
      </g>
      <path d="M122 143 Q124 137 135 136 Q146 137 148 143 L146 163 Q135 168 124 163 Z" fill="#d8caa4" stroke="#8d7c55" strokeWidth="1.2" strokeLinejoin="round" />
      <path d="M124 146 Q135 150 146 146" fill="none" stroke="#8d7c55" strokeWidth="1" strokeDasharray="2 2" />
      <path d="M129 152 L131 162 M136 153 L136 164 M142 152 L140 162" stroke="#a89670" strokeWidth="0.8" />
    </>
  );
}

const LEAVES: [number, number, number][] = [
  [124, 158, -25],
  [131, 162, 10],
  [139, 159, 35],
  [146, 162, -10],
  [128, 153, 50],
  [142, 154, -40],
  [135, 156, 0],
  [120, 163, 20],
  [150, 157, -30],
];

function Leaves() {
  return (
    <>
      {LEAVES.map(([x, y, r], i) => (
        <path
          key={i}
          d="M-6 0 Q0 -5 6 0 Q0 5 -6 0 Z"
          transform={`translate(${x} ${y}) rotate(${r})`}
          fill={i % 2 ? "#6f7d3a" : "#59652c"}
          stroke="#3f4a1e"
          strokeWidth="0.6"
        />
      ))}
    </>
  );
}
