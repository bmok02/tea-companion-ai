export interface ChatApiMessage {
  role: "user" | "assistant";
  content: string;
}

export interface UiMessage {
  id: string;
  role: "user" | "assistant";
  text: string;
}
