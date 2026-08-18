"use client";

interface BrewMiniProps {
  visible: boolean;
  stepLabel: string;
  timeLabel: string;
  paused: boolean;
  onClick: () => void;
}

export default function BrewMini({
  visible,
  stepLabel,
  timeLabel,
  paused,
  onClick,
}: BrewMiniProps) {
  return (
    <div
      className={`brew-mini${visible ? " visible" : ""}`}
      onClick={onClick}
      title="Return to brew session"
    >
      <div className={`brew-mini-dot${paused ? " paused" : ""}`} />
      <div className="brew-mini-text">
        <div className="brew-mini-step">{stepLabel}</div>
        <div className="brew-mini-time">{timeLabel}</div>
      </div>
    </div>
  );
}
