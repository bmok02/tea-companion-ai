"use client";

import { memo } from "react";
import { LiquorTheme } from "@/lib/teaVisuals";
import BrewCup from "./BrewCup";

interface BrewMiniProps {
  visible: boolean;
  stepLabel: string;
  timeLabel: string;
  fillPct: number; // 0–100, elapsed share of the current step
  steaming: boolean;
  urgent: boolean;
  theme: LiquorTheme;
  onClick: () => void;
}

function BrewMini({
  visible,
  stepLabel,
  timeLabel,
  fillPct,
  steaming,
  urgent,
  theme,
  onClick,
}: BrewMiniProps) {
  return (
    <div
      className={`brew-mini${visible ? " visible" : ""}`}
      onClick={onClick}
      title="Return to brew session"
    >
      <BrewCup fillPct={fillPct} theme={theme} steaming={steaming} urgent={urgent} />
      <div className="brew-mini-text">
        <div className="brew-mini-step">{stepLabel}</div>
        <div className={`brew-mini-time${urgent ? " urgent" : ""}`}>{timeLabel}</div>
      </div>
    </div>
  );
}

// Mirrors BrewModal's memoization: while the big modal is open, this floating
// pill sits invisible (display: none via `visible`), but its step/time/fill
// props still get recomputed every tick by the same brew-timer interval —
// skip the reconcile whenever `visible` was false on both the last render
// and this one, so only whichever of the two is actually on screen does real
// per-second work.
export default memo(BrewMini, (prev, next) => {
  if (!prev.visible && !next.visible) return true;
  return false;
});
