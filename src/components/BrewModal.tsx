"use client";

import { memo, useEffect } from "react";
import { BrewStep, countdownDisplay, fillPercent, formatBrewTime } from "@/lib/teaBrewing";
import { LiquorTheme } from "@/lib/teaVisuals";
import { useNarration } from "@/lib/useNarration";
import { ZH_UI, zhStep } from "@/lib/brewZh";
import { TEA_SETS, TeaSetId, TeawareItem, ingredientItem } from "@/lib/teaware";
import { BrewContext, timedCue } from "@/lib/brewCues";
import BrewScene, { BrewSceneMode } from "./BrewScene";
import TeawareIconArt from "./TeawareIcon";

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
  brewCtx: BrewContext;
  onChangeEquipment: (next: { set?: TeaSetId; bag?: boolean }) => void;
  narration: ReturnType<typeof useNarration>;
  onClose: () => void;
  onStart: () => void;
  onPauseResume: () => void;
  onNext: () => void;
  onPrev: () => void;
  onJumpToStep: (i: number) => void;
  onExtend: () => void;
  extendSeconds: number;
  resumed: boolean;
  wakeLocked: boolean;
}

const ICON = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2.2,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

function BrewModal({
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
  brewCtx,
  onChangeEquipment,
  narration,
  onClose,
  onStart,
  onPauseResume,
  onNext,
  onPrev,
  onJumpToStep,
  onExtend,
  extendSeconds,
  resumed,
  wakeLocked,
}: BrewModalProps) {
  const step = currentStep >= 0 ? steps[currentStep] : undefined;
  const isTimed = !!step && step.seconds > 0;
  const isLastStep = currentStep === steps.length - 1 && steps.length > 0;
  const fillPct = isTimed ? fillPercent(secondsLeft, totalSeconds) : 0;
  const urgent = isTimed && started && !finished && secondsLeft <= 10;
  const zh = narration.lang === "zh";
  const text = step ? (zh ? zhStep(step, brewCtx) : { label: step.label, sub: step.sub }) : undefined;

  // What the scene shows, and the one sentence that says what to do about it.
  let mode: BrewSceneMode = "warm";
  let cue = text?.sub ?? "";
  if (step) {
    if (step.kind === "warm") mode = "warm";
    else if (step.kind === "measure") mode = "measure";
    else if (step.kind === "pour") mode = "serve";
    else if (finished) mode = "pour-out";
    else if (started) mode = "wait";
    else mode = "pour-in";

    const isRinse = step.kind === "rinse";
    const lang = zh ? "zh" : "en";
    if (mode === "pour-in") cue = timedCue("pour-in", isRinse, brewCtx, lang);
    else if (mode === "wait") cue = timedCue(paused ? "paused" : "wait", isRinse, brewCtx, lang);
    else if (mode === "pour-out") cue = timedCue("done", isRinse, brewCtx, lang);
  }

  // Speak the step when it starts, and again the moment the clock runs out —
  // that's the one instruction the drinker can't afford to miss.
  const { speak } = narration;
  useEffect(() => {
    if (!open || !step) return;
    const t = zhStep(step, brewCtx);
    speak(zh ? `${t.label}。${t.sub}` : `${step.label}. ${step.sub}`);
    // brewCtx is read for the Chinese wording only; the step object itself
    // is rebuilt whenever the equipment changes, which re-fires this.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, step, speak, zh]);
  useEffect(() => {
    if (!open || !step || !finished || !isTimed) return;
    speak(timedCue("done", step.kind === "rinse", brewCtx, zh ? "zh" : "en"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, step, finished, isTimed, speak, zh]);

  const isPrep = step?.kind === "prep";
  const { set: teaSet, bag } = brewCtx;
  const prepItems: TeawareItem[] = [ingredientItem(bag, brewCtx.grams), ...teaSet.items];

  const nextDisabled = isLastStep;
  const nextReady = (!isTimed && !!step && !isLastStep) || (isTimed && finished);
  const nextText = isTimed && !finished ? (zh ? ZH_UI.skip : "Skip") : zh ? ZH_UI.next : "Next step";

  return (
    <div className={`brew-overlay${open ? " open" : ""}`} id="brewOverlay">
      <div className="brew-modal">
        <div className="brew-modal-header">
          <span className="brew-modal-title" id="brewModalTitle">
            {title}
          </span>
          <div className="brew-modal-header-actions">
            <button
              type="button"
              className="brew-modal-lang-btn"
              onClick={narration.toggleLang}
              aria-label={zh ? "Switch to English" : "切换到中文"}
              title={zh ? "Switch to English" : "切换到中文"}
              lang={zh ? "en" : "zh"}
            >
              {zh ? "EN" : "中文"}
            </button>
            <button
              type="button"
              className="brew-modal-icon-btn"
              onClick={narration.toggleMute}
              aria-pressed={narration.muted}
              aria-label={narration.muted ? "Unmute narration" : "Mute narration"}
              title={narration.muted ? "Unmute narration" : "Mute narration"}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" {...ICON}>
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                {narration.muted ? (
                  <>
                    <line x1="23" y1="9" x2="17" y2="15" />
                    <line x1="17" y1="9" x2="23" y2="15" />
                  </>
                ) : (
                  <>
                    <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
                    <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
                  </>
                )}
              </svg>
            </button>
            <button type="button" className="brew-modal-icon-btn" onClick={onClose} aria-label="Close">
              <svg width="16" height="16" viewBox="0 0 24 24" {...ICON}>
                <line x1="5" y1="5" x2="19" y2="19" />
                <line x1="19" y1="5" x2="5" y2="19" />
              </svg>
            </button>
          </div>
        </div>

        {resumed && (
          <p className="brew-modal-note" role="status">
            {zh ? ZH_UI.welcomeBack : "Welcome back — your brew kept its place."}
          </p>
        )}

        <div className="brew-stage">
          <div className="brew-scene">
            {step && !isPrep && (
              <BrewScene
                // A fresh scene per step and phase, so its loop always starts
                // from the first frame of the action being asked for.
                key={`${currentStep}-${mode}`}
                mode={mode}
                theme={liquorTheme}
                fillPct={fillPct}
                outIsTea={step.kind === "steep"}
                bag={bag}
                set={teaSet.id}
              />
            )}
          </div>

          {isPrep && (
            <section className="prep" aria-label={zh ? "开始之前" : "Before you start"}>
              <fieldset className="prep-q">
                <legend>{zh ? "您用的是散茶还是茶包？" : "Are you using loose tea or a tea bag?"}</legend>
                <div className="prep-seg">
                  {[
                    { v: false, en: "Loose leaves", zh: "散茶" },
                    { v: true, en: "Tea bag", zh: "茶包" },
                  ].map((o) => (
                    <button
                      key={String(o.v)}
                      type="button"
                      aria-pressed={bag === o.v}
                      className={`prep-opt${bag === o.v ? " on" : ""}`}
                      onClick={() => onChangeEquipment({ bag: o.v })}
                    >
                      {zh ? o.zh : o.en}
                    </button>
                  ))}
                </div>
              </fieldset>
              <fieldset className="prep-q">
                <legend>{zh ? "您用哪套茶具？" : "Which tea set are you using?"}</legend>
                <div className="prep-seg">
                  {TEA_SETS.map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      aria-pressed={s.id === teaSet.id}
                      className={`prep-opt${s.id === teaSet.id ? " on" : ""}`}
                      onClick={() => onChangeEquipment({ set: s.id })}
                    >
                      {zh ? s.labelZh : s.label}
                    </button>
                  ))}
                </div>
                <p className="prep-blurb">{zh ? teaSet.blurbZh : teaSet.blurb}</p>
              </fieldset>
              <h2 className="prep-title">{zh ? "开始之前，请准备好：" : "Before you start, you should have:"}</h2>
              <ul className="prep-list">
                {prepItems.map((it) => (
                  <li key={it.id} className="prep-item">
                    <span className="prep-art">
                      {it.image ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={it.image} alt="" />
                      ) : (
                        <TeawareIconArt icon={it.icon} />
                      )}
                    </span>
                    <span className="prep-text">
                      <strong>{zh ? it.nameZh : it.name}</strong>
                      <span>{zh ? it.noteZh : it.note}</span>
                    </span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {step && !isPrep && (
            <div className="brew-cue" key={`${currentStep}-${mode}`} aria-live="polite">
              <div className="brew-cue-title">
                {text?.label}
                <span
                  className={`brew-cue-speaking${narration.guideSpeaking ? " on" : ""}`}
                  aria-hidden="true"
                />
              </div>
              <p className="brew-cue-line">{cue}</p>
              {narration.problem && !narration.muted && (
                <p className="brew-cue-problem" role="status">
                  {zh ? ZH_UI.voiceOff : "Voice is off: "}
                  {narration.problem}
                </p>
              )}
            </div>
          )}

          {isTimed && (
            <div className="brew-clock">
              <div className={`brew-clock-time${urgent ? " urgent" : ""}`} id="brewModalTime">
                {countdownDisplay(secondsLeft)}
              </div>
              <div className="brew-clock-bar">
                <div
                  className="brew-clock-fill"
                  id="brewModalFill"
                  style={{ transform: `scaleX(${fillPct / 100})` }}
                />
              </div>
            </div>
          )}

          <div className="brew-controls">
            {isTimed && !finished && (
              <>
                <button
                  className={`brew-main-btn${!started ? " start-ready" : ""}${paused ? " paused" : ""}`}
                  id="brewMainBtn"
                  onClick={!started ? onStart : onPauseResume}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" {...ICON} aria-hidden="true">
                    {started && !paused ? (
                      <>
                        <line x1="8" y1="5" x2="8" y2="19" />
                        <line x1="16" y1="5" x2="16" y2="19" />
                      </>
                    ) : (
                      <polygon points="7 4 19 12 7 20 7 4" fill="currentColor" />
                    )}
                  </svg>
                  {!started
                    ? zh
                      ? ZH_UI.start
                      : "Start timer"
                    : paused
                      ? zh
                        ? ZH_UI.resume
                        : "Resume"
                      : zh
                        ? ZH_UI.pause
                        : "Pause"}
                </button>
                <button
                  className="brew-extend-btn"
                  onClick={onExtend}
                  disabled={!started}
                  aria-label={`Extend this steep by ${extendSeconds} seconds`}
                  title={`Steep ${extendSeconds}s longer`}
                >
                  +{extendSeconds}{zh ? "秒" : "s"}
                </button>
              </>
            )}
            <button
              className="brew-nav-btn"
              id="brewPrevBtn"
              onClick={onPrev}
              disabled={currentStep <= 0}
              aria-label="Previous step"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" {...ICON} aria-hidden="true">
                <polyline points="15 5 8 12 15 19" />
              </svg>
            </button>
            <button
              className={`brew-nav-btn brew-nav-next${nextReady ? " brew-ready-next" : ""}`}
              id="brewNextBtn"
              onClick={onNext}
              disabled={nextDisabled}
            >
              {nextText}
              <svg width="16" height="16" viewBox="0 0 24 24" {...ICON} aria-hidden="true">
                <polyline points="9 5 16 12 9 19" />
              </svg>
            </button>
          </div>

          {wakeLocked && (
            <p className="brew-awake">{zh ? ZH_UI.awake : "Screen stays awake while you brew."}</p>
          )}

          <ol className="brew-rail" id="brewSteps" aria-label="Brew steps">
            {steps.map((s, i) => (
              <li key={i}>
                <button
                  type="button"
                  className={`brew-rail-dot${i === currentStep ? " active" : ""}${i < currentStep ? " done" : ""}`}
                  id={`brewStep${i}`}
                  onClick={() => onJumpToStep(i)}
                  aria-current={i === currentStep ? "step" : undefined}
                  title={`${s.label}${s.seconds > 0 ? ` · ${formatBrewTime(s.seconds)}` : ""}`}
                >
                  <span className="sr-only">{zh ? zhStep(s, brewCtx).label : s.label}</span>
                </button>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
}

// The brew timer ticks TeaCompanion's state every second the whole session
// through, including while this view sits closed behind the mini-timer
// (visibility: hidden, not unmounted, so it can fade in/out) — without this,
// every tick still rebuilds the full step list, tray SVG, and nav buttons for
// a subtree nothing is looking at. Skip that reconcile whenever `open` was
// false on both the last render and this one; the moment it actually opens
// (or starts closing), `open` itself differs and a fresh render still fires,
// so the frame shown is never stale.
export default memo(BrewModal, (prev, next) => {
  if (!prev.open && !next.open) return true;
  return false;
});
