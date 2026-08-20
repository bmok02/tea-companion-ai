"use client";

import { LiquorTheme } from "@/lib/teaVisuals";

interface BrewCupProps {
  fillPct: number; // 0–100, elapsed share of the current step
  theme: LiquorTheme;
  steaming: boolean;
  urgent: boolean;
}

// Interior of the cup outline below, in the same 0–60 viewBox — the rim
// sits at y=14, the floor at y=46.
const RIM_Y = 14;
const FLOOR_Y = 46;

export default function BrewCup({ fillPct, theme, steaming, urgent }: BrewCupProps) {
  const pct = Math.max(0, Math.min(100, fillPct));
  const liquidY = FLOOR_Y - ((FLOOR_Y - RIM_Y) * pct) / 100;

  return (
    <div className={`brew-cup${urgent ? " urgent" : ""}`}>
      <svg viewBox="0 0 64 60" width="88" height="82" aria-hidden="true">
        <defs>
          <clipPath id="brewCupInterior">
            <path d="M12 14 L52 14 L47 46 Q32 50 17 46 Z" />
          </clipPath>
        </defs>
        <g clipPath="url(#brewCupInterior)">
          <rect
            className="brew-cup-liquid"
            x="10"
            y={liquidY}
            width="44"
            height={FLOOR_Y - liquidY + 6}
            fill={theme.liquid}
          />
          <rect x="10" y={liquidY} width="44" height="2.5" fill={theme.liquidLight} opacity="0.7" />
        </g>
        <path
          d="M12 14 L52 14 L47 46 Q32 50 17 46 Z"
          fill="none"
          stroke="var(--ink-muted)"
          strokeWidth="1.4"
          strokeLinejoin="round"
        />
        <ellipse cx="32" cy="14" rx="20" ry="3.2" fill="none" stroke="var(--ink-muted)" strokeWidth="1.2" />
        <ellipse cx="32" cy="52" rx="9" ry="2" fill="none" stroke="var(--border)" strokeWidth="1" />
      </svg>
      {steaming && (
        <div className="brew-cup-steam" aria-hidden="true">
          <span className="brew-cup-wisp brew-cup-wisp-1" />
          <span className="brew-cup-wisp brew-cup-wisp-2" />
          <span className="brew-cup-wisp brew-cup-wisp-3" />
        </div>
      )}
    </div>
  );
}
