"use client";

import { useEffect, useRef } from "react";
import { formatText } from "@/lib/formatText";
import { UiMessage } from "@/lib/types";

interface ChatAreaProps {
  messages: UiMessage[];
  isLoading: boolean;
}

export default function ChatArea({ messages, isLoading }: ChatAreaProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }, [messages, isLoading]);

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
        <div className={`msg ${m.role}`} key={m.id}>
          <div className="msg-avatar">{m.role === "assistant" ? "茶" : "人"}</div>
          <div
            className="msg-bubble"
            dangerouslySetInnerHTML={{ __html: formatText(m.text) }}
          />
        </div>
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
