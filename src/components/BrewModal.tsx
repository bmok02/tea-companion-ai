"use client";

import { BrewStep, countdownDisplay, fillPercent, formatBrewTime } from "@/lib/teaBrewing";
import { LiquorTheme } from "@/lib/teaVisuals";
import BrewCup from "./BrewCup";

interface SteepPrompt {
  icon: string;
  label: string;
  text: string;
}

interface BrewModalProps {
  open: boolean;
  title: string;
  steps: BrewStep[];
  currentStep: number;
  secondsLeft: number;
  totalSeconds: number;
  started: boolean;
  paused: boolean;
  finished: boolean;
  liquorTheme: LiquorTheme;
  onClose: () => void;
  onStart: () => void;
  onPauseResume: () => void;
  onNext: () => void;
  onPrev: () => void;
  onJumpToStep: (i: number) => void;
  steepPrompts: SteepPrompt[];
  onSteepPrompt: (text: string) => void;
}

export default function BrewModal({
  open,
  title,
  steps,
  currentStep,
  secondsLeft,
  totalSeconds,
  started,
  paused,
  finished,
  liquorTheme,
  onClose,
  onStart,
  onPauseResume,
  onNext,
  onPrev,
  onJumpToStep,
  steepPrompts,
  onSteepPrompt,
}: BrewModalProps) {
  const step = currentStep >= 0 ? steps[currentStep] : undefined;
  const isTimed = !!step && step.seconds > 0;
  const isLastStep = currentStep === steps.length - 1 && steps.length > 0;

  // Countdown panel content
  let countdownVisible = false;
  let stepLabel = "—";
  let timeLabel = "—";
  let urgent = false;
  let fillPct = 0;
  let doneMsgVisible = false;

  if (step) {
    if (isTimed) {
      countdownVisible = true;
      stepLabel = step.label.toUpperCase();
      timeLabel = countdownDisplay(secondsLeft);
      urgent = started && secondsLeft <= 10;
      fillPct = fillPercent(secondsLeft, totalSeconds);
    } else if (isLastStep) {
      countdownVisible = true;
      stepLabel = "✦";
      timeLabel = "🍵";
      fillPct = 100;
      doneMsgVisible = true;
    }
  }

  // Main (pause/resume/start) button
  let mainBtnVisible = false;
  let mainBtnText = "";
  let mainBtnClass = "";
  let mainBtnOnClick = onPauseResume;
  if (isTimed && !finished) {
    mainBtnVisible = true;
    if (!started) {
      mainBtnText = "▶ Start timer";
      mainBtnClass = "start-ready";
      mainBtnOnClick = onStart;
    } else {
      mainBtnText = paused ? "▶ Resume" : "⏸ Pause";
      mainBtnClass = paused ? "paused" : "";
      mainBtnOnClick = onPauseResume;
    }
  }

  // Next / Skip button
  const nextDisabled = isLastStep;
  let nextText = "Skip →";
  let nextReady = false;
  if (!isTimed && step && !isLastStep) {
    nextText = "Continue →";
    nextReady = true;
  } else if (isTimed && finished) {
    nextText = "Ready for next step →";
    nextReady = true;
  }

  return (
    <div className={`brew-overlay${open ? " open" : ""}`} id="brewOverlay">
      <div className="brew-modal">
        <div className="brew-modal-header">
          <span className="brew-modal-title" id="brewModalTitle">
            {title}
          </span>
          <button className="brew-modal-close" onClick={onClose}>
            ✕
          </button>
        </div>

        <div
          // Remount (and so replay the settle-in) only when the step itself
          // changes, never on the once-a-second countdown tick.
          key={currentStep}
          className="brew-modal-countdown"
          id="brewModalCountdown"
          style={{ display: countdownVisible ? "flex" : "none" }}
        >
          <div className="brew-modal-step-label" id="brewModalStepLabel">
            {stepLabel}
          </div>
          <div className="brew-modal-time-row">
            {isTimed && (
              <BrewCup
                fillPct={fillPct}
                theme={liquorTheme}
                steaming={started && !paused && !finished}
                urgent={urgent}
              />
            )}
            <div
              className={`brew-modal-time${urgent ? " urgent" : ""}`}
              id="brewModalTime"
            >
              {timeLabel}
            </div>
          </div>
          <div className="brew-modal-progress">
            <div
              className="brew-modal-progress-fill"
              id="brewModalFill"
              style={{ transform: `scaleX(${fillPct / 100})` }}
            />
          </div>
          <div
            className={`brew-modal-done-msg${doneMsgVisible ? " visible" : ""}`}
            id="brewModalDone"
          >
            Your tea is ready. Pour gently and savour. 🍵
          </div>
        </div>

        {mainBtnVisible && (
          <button
            className={`brew-modal-main-btn${mainBtnClass ? ` ${mainBtnClass}` : ""}`}
            id="brewMainBtn"
            onClick={mainBtnOnClick}
          >
            {mainBtnText}
          </button>
        )}

        {/* Only while there's an actual countdown running (a rinse or a
            steep) — that's real dead time, unlike the untimed "measure your
            leaves" or "pour & enjoy" steps, which are hands-on rather than
            waiting. Picking one sends it to chat and hands off to the
            floating mini-timer so the countdown keeps going underneath. */}
        {isTimed && (
          <div className="brew-modal-steep-prompts">
            <span className="brew-modal-steep-prompts-label">While you steep, ask me</span>
            <div className="brew-modal-steep-prompts-row">
              {steepPrompts.map((sp) => (
                <button className="qp-btn" key={sp.text} onClick={() => onSteepPrompt(sp.text)}>
                  <span aria-hidden="true">{sp.icon}</span>
                  <span>{sp.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="brew-modal-nav">
          <button
            className="brew-nav-btn"
            id="brewPrevBtn"
            onClick={onPrev}
            disabled={currentStep <= 0}
          >
            ← Previous
          </button>
          <button
            className={`brew-nav-btn${nextReady ? " brew-ready-next" : ""}`}
            id="brewNextBtn"
            onClick={onNext}
            disabled={nextDisabled}
          >
            {nextText}
          </button>
        </div>

        <div className="brew-modal-steps" id="brewSteps">
          {steps.map((s, i) => (
            <div
              key={i}
              className={`brew-step${i === currentStep ? " active" : ""}${
                i < currentStep ? " done" : ""
              }`}
              id={`brewStep${i}`}
              onClick={() => onJumpToStep(i)}
            >
              <div className="brew-step-num">{i + 1}</div>
              <div className="brew-step-info">
                <div className="brew-step-label">{s.label}</div>
                {s.sub && <div className="brew-step-sub">{s.sub}</div>}
              </div>
              <div className="brew-step-dur">
                {s.seconds > 0 ? formatBrewTime(s.seconds) : ""}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
