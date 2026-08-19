"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import ChatArea from "./ChatArea";
import BrewModal from "./BrewModal";
import BrewMini from "./BrewMini";
import { TEA_OPTIONS, TeaOption } from "@/lib/teaOptions";
import { findTea, buildSystemPrompt, parseBrewSteps, countdownDisplay, BrewStep } from "@/lib/teaBrewing";
import { playBeep } from "@/lib/playBeep";
import { ChatApiMessage, UiMessage } from "@/lib/types";

const QUICK_PROMPTS = [
  { icon: "🫖", label: "How to brew", text: "How do I brew this tea?" },
  { icon: "🧘", label: "Mindful session", text: "Guide me through a mindful tea session" },
  { icon: "📜", label: "History & origins", text: "Tell me the history and origins of this tea" },
  { icon: "✨", label: "Fun fact", text: "Share a fun fact or story about this tea" },
  { icon: "🌿", label: "Health benefits", text: "What are the health benefits of this tea?" },
];

export default function TeaCompanion() {
  // ── Tea selection ──────────────────────────────────────────────────────
  // teaQuery is the catalogue combobox's own text — a search string while
  // open, the chosen option's label once committed. It replaces a 58-item
  // flat <select> that forced either scrolling a wall of options or
  // truncating illegibly at mobile widths.
  const [teaQuery, setTeaQuery] = useState("");
  const [comboOpen, setComboOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const comboRootRef = useRef<HTMLDivElement>(null);
  const [teaInputValue, setTeaInputValue] = useState("");
  const [currentTea, setCurrentTeaState] = useState("");
  // A tea change that would end an in-progress brew waits here for the
  // drinker to confirm, instead of discarding their steep silently.
  const [pendingTeaChange, setPendingTeaChange] = useState<{
    name: string;
    source: "combobox" | "input";
  } | null>(null);
  const confirmKeepBtnRef = useRef<HTMLButtonElement>(null);

  // A keyboard user who just committed a tea change (Enter) has their focus
  // sitting on a field that's about to blur, with nowhere else to land —
  // move it onto the confirmation's safe default action instead of
  // dropping it. "Keep brewing" (not "Switch tea") gets the focus because
  // it's the non-destructive choice; Enter here should preserve the brew,
  // not require an extra Tab past it.
  useEffect(() => {
    if (pendingTeaChange) confirmKeepBtnRef.current?.focus();
  }, [pendingTeaChange]);

  // ── Chat ───────────────────────────────────────────────────────────────
  const [messages, setMessages] = useState<UiMessage[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const historyRef = useRef<ChatApiMessage[]>([]);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // ── Brew timer ─────────────────────────────────────────────────────────
  const [brewSteps, setBrewSteps] = useState<BrewStep[]>([]);
  const [currentStep, setCurrentStep] = useState(-1); // -1 = not started
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [totalSeconds, setTotalSeconds] = useState(0);
  const [started, setStarted] = useState(false);
  const [paused, setPaused] = useState(false);
  const [finished, setFinished] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    textareaRef.current?.focus();
  }, []);

  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 140) + "px";
  }, [inputValue]);

  // ── Assistant message helper ──────────────────────────────────────────
  function addAssistantMessage(text: string) {
    setMessages((prev) => [...prev, { id: crypto.randomUUID(), role: "assistant", text }]);
  }

  // ── Tea selection ──────────────────────────────────────────────────────
  // A brew is "in progress" once its timer has actually run (started,
  // paused, or just finished counting down — `finished` recurs on every
  // timed step, not only the last one, so it still means "mid-session")
  // or the drinker has stepped past the first step. Reaching the final
  // step (the untimed "pour & enjoy") means the ritual is already
  // complete, so nothing is left to protect there. That's the line
  // between what's worth an accidental-tea-switch warning and what isn't.
  const isOnFinalBrewStep = brewSteps.length > 0 && currentStep === brewSteps.length - 1;
  const hasActiveBrewProgress =
    brewSteps.length > 0 &&
    !isOnFinalBrewStep &&
    (started || paused || finished || currentStep > 0);

  function commitTeaChange(name: string) {
    if (name !== currentTea) resetBrew();
    setCurrentTeaState(name);
    setPendingTeaChange(null);
  }

  function requestTeaChange(name: string, source: "combobox" | "input") {
    if (name === currentTea) return;
    if (hasActiveBrewProgress) {
      setPendingTeaChange({ name, source });
    } else {
      commitTeaChange(name);
    }
  }

  function confirmTeaChange() {
    if (pendingTeaChange) commitTeaChange(pendingTeaChange.name);
  }

  function cancelTeaChange() {
    if (!pendingTeaChange) return;
    // Roll back only the field that proposed the change — currentTea (and
    // the badge showing it) never moved, so there's nothing else to restore.
    if (pendingTeaChange.source === "combobox") setTeaQuery("");
    else setTeaInputValue("");
    setPendingTeaChange(null);
  }

  // ── Tea catalogue combobox ──────────────────────────────────────────────
  // Search-to-filter over the same 58 teas a flat <select> used to dump in
  // one unscannable list — type a few letters to narrow it, or arrow/Enter
  // through the full list when browsing. Every row renders its full label,
  // so nothing truncates the way the native control did on mobile.
  const catalogueOptions = useMemo(() => TEA_OPTIONS.filter((o) => o.value), []);
  const filteredTeaOptions = useMemo(() => {
    const q = teaQuery.trim().toLowerCase();
    if (!q) return catalogueOptions;
    return catalogueOptions.filter((o) => o.label.toLowerCase().includes(q));
  }, [catalogueOptions, teaQuery]);

  function openCombo() {
    setComboOpen(true);
    setActiveIndex(filteredTeaOptions.length > 0 ? 0 : -1);
  }

  function selectComboOption(opt: TeaOption) {
    setTeaQuery(opt.label);
    setComboOpen(false);
    setActiveIndex(-1);
    setTeaInputValue("");
    requestTeaChange(opt.value, "combobox");
  }

  function onComboChange(e: React.ChangeEvent<HTMLInputElement>) {
    setTeaQuery(e.target.value);
    setComboOpen(true);
    setActiveIndex(0);
  }

  function onComboKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      if (!comboOpen) return openCombo();
      setActiveIndex((i) => Math.min(i + 1, filteredTeaOptions.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (!comboOpen) return openCombo();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (comboOpen && activeIndex >= 0 && filteredTeaOptions[activeIndex]) {
        selectComboOption(filteredTeaOptions[activeIndex]);
      }
    } else if (e.key === "Escape") {
      if (comboOpen) {
        e.stopPropagation(); // let this Escape close the list, not also cancel a pending switch
        setComboOpen(false);
      }
    }
  }

  // Click (or tab) outside the combobox closes its list without selecting.
  useEffect(() => {
    if (!comboOpen) return;
    function onPointerDown(e: MouseEvent) {
      if (comboRootRef.current && !comboRootRef.current.contains(e.target as Node)) {
        setComboOpen(false);
      }
    }
    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, [comboOpen]);

  // Keep the keyboard-highlighted option scrolled into view as arrow keys
  // move past the edge of the visible list.
  useEffect(() => {
    if (!comboOpen || activeIndex < 0) return;
    document
      .getElementById(`tea-option-${activeIndex}`)
      ?.scrollIntoView({ block: "nearest" });
  }, [comboOpen, activeIndex]);

  // The free-text field only stages a value as the drinker types; it
  // commits (and can trip the confirmation above) on blur or Enter, not on
  // every keystroke — a single stray character used to be enough to reset
  // an active timed brew with no warning at all.
  function onTeaInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    setTeaInputValue(e.target.value);
  }

  function commitTeaInput() {
    const trimmed = teaInputValue.trim();
    if (!trimmed) return;
    setTeaQuery("");
    requestTeaChange(trimmed, "input");
  }

  function onTeaInputKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      e.preventDefault();
      commitTeaInput();
      e.currentTarget.blur();
    }
  }

  // Escape backs out of a pending tea-switch confirmation from anywhere —
  // the combobox, the text field, or the confirmation bar's own buttons.
  useEffect(() => {
    if (!pendingTeaChange) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") cancelTeaChange();
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pendingTeaChange]);

  // ── Sending messages ──────────────────────────────────────────────────
  async function sendMessage(overrideText?: string) {
    if (isLoading) return;
    const text = (overrideText ?? inputValue).trim();
    if (!text) return;

    setMessages((prev) => [...prev, { id: crypto.randomUUID(), role: "user", text }]);
    setInputValue("");

    const userContent = currentTea ? `[Currently brewing: ${currentTea}]\n\n${text}` : text;
    historyRef.current = [...historyRef.current, { role: "user", content: userContent }];

    setIsLoading(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          system: buildSystemPrompt(currentTea),
          messages: historyRef.current,
        }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error?.message || `Error ${res.status}`);
      }

      const data = await res.json();
      const replyText = data.content?.[0]?.text || "(No response)";
      historyRef.current = [...historyRef.current, { role: "assistant", content: replyText }];
      addAssistantMessage(replyText);
    } catch (err) {
      addAssistantMessage(
        `Something went wrong: ${err instanceof Error ? err.message : "unknown error"}. Please try again.`
      );
    } finally {
      setIsLoading(false);
    }
  }

  function quickPrompt(text: string) {
    sendMessage(text);
  }

  function handleKey(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  // ── Brew timer ─────────────────────────────────────────────────────────
  function resetBrew() {
    setBrewSteps([]);
    setCurrentStep(-1);
    setStarted(false);
    setPaused(false);
    setFinished(false);
    setSecondsLeft(0);
    setTotalSeconds(0);
    setModalOpen(false);
  }

  function jumpToStep(i: number, stepsOverride?: BrewStep[]) {
    const steps = stepsOverride ?? brewSteps;
    if (i < 0 || i >= steps.length) return;
    setCurrentStep(i);
    setPaused(false);
    setStarted(false);
    setFinished(false);
    const step = steps[i];
    setSecondsLeft(step.seconds > 0 ? step.seconds : 0);
    setTotalSeconds(step.seconds > 0 ? step.seconds : 0);
  }

  function openBrewModal() {
    if (!currentTea) {
      addAssistantMessage("Please select a tea first — I need to know what you are brewing.");
      return;
    }
    if (currentStep === -1) {
      const tea = findTea(currentTea);
      const steps = parseBrewSteps(tea || { description: "", name: currentTea });
      if (!steps) return;
      setBrewSteps(steps);
      jumpToStep(0, steps);
    }
    setModalOpen(true);
  }

  function closeBrewModal() {
    setModalOpen(false);
  }

  function startBrewTimer() {
    setStarted(true);
  }

  function brewPauseResume() {
    setPaused((p) => !p);
  }

  function brewNextStep() {
    jumpToStep(currentStep + 1);
  }

  function brewPrevStep() {
    jumpToStep(currentStep - 1);
  }

  // secondsLeftRef mirrors secondsLeft so the interval tick (an async
  // callback, not the effect body itself) can read the latest value
  // without setState's functional-updater form.
  const secondsLeftRef = useRef(0);
  useEffect(() => {
    secondsLeftRef.current = secondsLeft;
  }, [secondsLeft]);

  // Ticking interval — active only while a timed step has been started,
  // isn't paused, and hasn't finished yet.
  useEffect(() => {
    if (!started || paused || finished) return;
    const step = brewSteps[currentStep];
    if (!step || step.seconds <= 0) return;

    const id = setInterval(() => {
      const next = secondsLeftRef.current - 1;
      if (next <= 0) {
        clearInterval(id);
        setSecondsLeft(0);
        playBeep();
        setFinished(true);
        // If a timed step were ever the very last step, auto-advance past
        // it — mirrors the original's isLast branch. In practice the last
        // step is always the zero-second "Pour & enjoy" step, so this
        // never fires, but it stays here for parity with the source.
        if (currentStep === brewSteps.length - 1) {
          jumpToStep(currentStep + 1);
        }
      } else {
        setSecondsLeft(next);
      }
    }, 1000);

    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [started, paused, finished, currentStep]);

  // ── Derived brew-mini state ───────────────────────────────────────────
  const miniActive = currentStep >= 0 && currentStep < brewSteps.length;
  const miniVisible = !modalOpen && miniActive;
  const miniStep = miniActive ? brewSteps[currentStep] : undefined;
  const miniStepLabel = miniStep?.label ?? "Steeping";
  const miniTimeLabel = miniStep && miniStep.seconds > 0 ? countdownDisplay(secondsLeft) : "—";

  return (
    <div className="app">
      {/* Header */}
      <div className="header">
        <div className="header-logo">茶渊 · Tea Chapter</div>
        <h1>The Tea Companion</h1>
        <div className="header-sub">Brewing · Mindfulness · Heritage</div>
      </div>

      {/* Tea Selector */}
      <div className="tea-selector">
        <label id="teaSelectorLabel">Your tea</label>
        <div className="tea-combobox" ref={comboRootRef}>
          <input
            type="text"
            id="teaSelect"
            role="combobox"
            aria-expanded={comboOpen}
            aria-controls="teaOptionList"
            aria-autocomplete="list"
            aria-activedescendant={activeIndex >= 0 ? `tea-option-${activeIndex}` : undefined}
            aria-labelledby="teaSelectorLabel"
            placeholder="Search the catalogue…"
            autoComplete="off"
            value={teaQuery}
            onFocus={(e) => {
              e.currentTarget.select();
              openCombo();
            }}
            onChange={onComboChange}
            onKeyDown={onComboKeyDown}
          />
          {comboOpen && (
            <ul className="tea-combobox-list" id="teaOptionList" role="listbox">
              {filteredTeaOptions.length === 0 ? (
                <li className="tea-combobox-empty" role="presentation">
                  No catalogue matches — try the name field instead.
                </li>
              ) : (
                filteredTeaOptions.map((opt, i) => (
                  <li
                    key={opt.value}
                    id={`tea-option-${i}`}
                    role="option"
                    aria-selected={i === activeIndex}
                    className={`tea-combobox-option${i === activeIndex ? " active" : ""}`}
                    onMouseDown={(e) => e.preventDefault()}
                    onMouseEnter={() => setActiveIndex(i)}
                    onClick={() => selectComboOption(opt)}
                  >
                    {opt.label}
                  </li>
                ))
              )}
            </ul>
          )}
        </div>
        <span className="or-divider">or</span>
        <input
          type="text"
          id="teaInput"
          aria-labelledby="teaSelectorLabel"
          placeholder="type tea name…"
          value={teaInputValue}
          onChange={onTeaInputChange}
          onBlur={commitTeaInput}
          onKeyDown={onTeaInputKeyDown}
        />
        <span className={`current-tea-badge${currentTea ? " visible" : ""}`} id="teaBadge">
          {currentTea || "—"}
        </span>
      </div>

      {/* Tea-switch confirmation — only surfaces while a brew is actually
          in progress; an idle or just-loaded session switches instantly. */}
      {pendingTeaChange && (
        // role="alert" (not "alertdialog" — this never traps focus or blocks
        // the rest of the page, so it shouldn't claim modal-dialog semantics)
        // gets it announced the moment it appears; the effect above still
        // moves real keyboard focus onto it since an alert alone doesn't.
        <div className="tea-switch-confirm" role="alert">
          <span className="tea-switch-confirm-text">
            Switch to <strong>{pendingTeaChange.name}</strong>? Your {currentTea} brew is still
            going — this will end it.
          </span>
          <div className="tea-switch-confirm-actions">
            <button
              ref={confirmKeepBtnRef}
              className="tea-switch-btn tea-switch-keep"
              onClick={cancelTeaChange}
            >
              Keep brewing {currentTea}
            </button>
            <button className="tea-switch-btn tea-switch-confirm-btn" onClick={confirmTeaChange}>
              Switch tea
            </button>
          </div>
        </div>
      )}

      {/* Quick Prompts */}
      <div className="quick-prompts">
        {QUICK_PROMPTS.map((qp) => (
          <button className="qp-btn" key={qp.text} onClick={() => quickPrompt(qp.text)}>
            <span aria-hidden="true">{qp.icon}</span>
            <span>{qp.label}</span>
          </button>
        ))}
      </div>

      {/* Brew Now button */}
      <div className="brew-now-row">
        <button className="brew-now-btn" id="brewNowBtn" onClick={openBrewModal}>
          <span>🫖</span> Begin Brew Session
        </button>
      </div>

      <BrewModal
        open={modalOpen}
        title={brewSteps.length > 0 ? currentTea : "Guided Brew Session"}
        steps={brewSteps}
        currentStep={currentStep}
        secondsLeft={secondsLeft}
        totalSeconds={totalSeconds}
        started={started}
        paused={paused}
        finished={finished}
        onClose={closeBrewModal}
        onStart={startBrewTimer}
        onPauseResume={brewPauseResume}
        onNext={brewNextStep}
        onPrev={brewPrevStep}
        onJumpToStep={(i) => jumpToStep(i)}
      />

      <BrewMini
        visible={miniVisible}
        stepLabel={miniStepLabel}
        timeLabel={miniTimeLabel}
        paused={paused}
        onClick={openBrewModal}
      />

      {/* Chat Area */}
      <ChatArea messages={messages} isLoading={isLoading} />

      {/* Input */}
      <div className="input-area">
        <div className="input-row">
          <textarea
            ref={textareaRef}
            className="msg-input"
            id="msgInput"
            placeholder="Ask about brewing, history, mindfulness…"
            rows={1}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKey}
          />
          <button
            className="send-btn"
            id="sendBtn"
            onClick={() => sendMessage()}
            disabled={isLoading}
            title="Send"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="22" y1="2" x2="11" y2="13"></line>
              <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
