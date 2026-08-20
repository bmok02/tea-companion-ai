"use client";

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

export default function BrewMini({
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
