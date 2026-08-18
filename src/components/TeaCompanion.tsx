"use client";

import { useEffect, useRef, useState } from "react";
import ChatArea from "./ChatArea";
import BrewModal from "./BrewModal";
import BrewMini from "./BrewMini";
import { TEA_OPTIONS } from "@/lib/teaOptions";
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
  const [teaSelectValue, setTeaSelectValue] = useState("");
  const [teaInputValue, setTeaInputValue] = useState("");
  const [currentTea, setCurrentTeaState] = useState("");

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
  function setCurrentTea(name: string) {
    if (name !== currentTea) resetBrew();
    setCurrentTeaState(name);
  }

  function onTeaSelectChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const val = e.target.value;
    setTeaSelectValue(val);
    if (val) {
      setTeaInputValue("");
      setCurrentTea(val);
    }
  }

  function onTeaInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const val = e.target.value;
    setTeaInputValue(val);
    const trimmed = val.trim();
    if (trimmed) {
      setTeaSelectValue("");
      setCurrentTea(trimmed);
    }
  }

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
        <label>Your tea</label>
        <select id="teaSelect" value={teaSelectValue} onChange={onTeaSelectChange}>
          {TEA_OPTIONS.map((opt) => (
            <option key={opt.value || "placeholder"} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <span className="or-divider">or</span>
        <input
          type="text"
          id="teaInput"
          placeholder="type tea name…"
          value={teaInputValue}
          onChange={onTeaInputChange}
        />
        <span className={`current-tea-badge${currentTea ? " visible" : ""}`} id="teaBadge">
          {currentTea || "—"}
        </span>
      </div>

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
