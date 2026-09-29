"use client";

import { memo, useCallback, useEffect, useRef } from "react";
import { formatText } from "@/lib/formatText";
import { UiMessage } from "@/lib/types";

interface ChatMessageProps {
  message: UiMessage;
  registerRef: (id: string, el: HTMLDivElement | null) => void;
  onSpeak: (text: string) => void;
}

// Streaming means `messages` now updates once per token-chunk instead of
// once per reply — memoized so only the bubble whose own text actually
// changed re-runs formatText and re-renders, not every earlier message in
// the conversation on every chunk.
const ChatMessage = memo(function ChatMessage({ message, registerRef, onSpeak }: ChatMessageProps) {
  return (
    <div
      className={`msg ${message.role}`}
      ref={(el) => registerRef(message.id, el)}
    >
      <div className="msg-avatar">{message.role === "assistant" ? "茶" : "人"}</div>
      <div className="msg-bubble">
        <div dangerouslySetInnerHTML={{ __html: formatText(message.text) }} />
        {message.role === "assistant" && (
          <button
            type="button"
            className="msg-listen"
            onClick={() => onSpeak(message.text)}
            aria-label="Listen to this reply"
            title="Listen"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
              <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
});

interface ChatAreaProps {
  messages: UiMessage[];
  isLoading: boolean;
  onSpeak: (text: string) => void;
}

function ChatArea({ messages, isLoading, onSpeak }: ChatAreaProps) {
  const bottomRef = useRef<HTMLDivElement>(null);
  const messageRefs = useRef<Map<string, HTMLDivElement>>(new Map());
  const lastMessageId = messages[messages.length - 1]?.id;

  // Stable across renders (messageRefs is a ref, not state) so it doesn't
  // itself invalidate ChatMessage's memoization on every parent re-render.
  const registerRef = useCallback((id: string, el: HTMLDivElement | null) => {
    if (el) messageRefs.current.set(id, el);
    else messageRefs.current.delete(id);
  }, []);

  // Scroll to the top of the newest message instead of the bottom of the
  // chat, so a long reply starts in view rather than requiring a scroll-up.
  useEffect(() => {
    if (lastMessageId) {
      messageRefs.current
        .get(lastMessageId)
        ?.scrollIntoView({ block: "start", behavior: "smooth" });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lastMessageId]);

  useEffect(() => {
    if (isLoading) {
      bottomRef.current?.scrollIntoView({ block: "nearest", behavior: "smooth" });
    }
  }, [isLoading]);

  return (
    <div
      className={`chat-area${messages.length === 0 ? " chat-area--empty" : ""}`}
      id="chatArea"
    >
      {messages.length === 0 && (
        <div className="welcome" id="welcomeMsg">
          <div className="welcome-glyph-wrap">
            <span className="steam-wisp steam-wisp-1" aria-hidden="true" />
            <span className="steam-wisp steam-wisp-2" aria-hidden="true" />
            <span className="steam-wisp steam-wisp-3" aria-hidden="true" />
            <div className="welcome-glyph">茶</div>
          </div>
          <h2>Settle in. The water is warming.</h2>
          <p>
            Select your tea above, then ask me anything — how to brew it, its
            story, a mindful practice, or simply what this cup holds.
          </p>
          <p style={{ opacity: 0.7 }}>
            This companion draws from Tea Chapter&apos;s own catalogue and
            heritage.
          </p>
        </div>
      )}

      {messages.map((m) => (
        <ChatMessage key={m.id} message={m} registerRef={registerRef} onSpeak={onSpeak} />
      ))}

      {isLoading && (
        <div className="msg assistant">
          <div className="msg-avatar">茶</div>
          <div className="msg-bubble">
            <div className="typing-dots">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        </div>
      )}

      <div ref={bottomRef} />
    </div>
  );
}

// The brew timer ticks TeaCompanion's state every second while a session is
// active; memoized so that tick doesn't re-render (and re-diff) the whole
// message list when neither `messages` nor `isLoading` actually changed.
export default memo(ChatArea);
