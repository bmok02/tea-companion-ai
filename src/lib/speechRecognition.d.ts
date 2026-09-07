// Minimal ambient types for the Web Speech API's SpeechRecognition — not
// part of TypeScript's shipped lib.dom.d.ts, so the mic dictation button in
// TeaCompanion.tsx declares just the shape it actually uses.

interface SpeechRecognitionResultEvent {
  transcript: string;
}

interface SpeechRecognitionEvent extends Event {
  readonly results: ArrayLike<ArrayLike<SpeechRecognitionResultEvent>>;
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: Event) => void) | null;
  onend: (() => void) | null;
}

interface Window {
  SpeechRecognition?: { new (): SpeechRecognition };
  webkitSpeechRecognition?: { new (): SpeechRecognition };
}
