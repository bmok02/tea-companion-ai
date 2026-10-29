// Narration voices: one per companion, each picked to sound like that
// character (an old storyteller, a coach, a calm study buddy, a sassy
// friend), so switching companion is heard as well as read. The drinker can
// still mix them. Shared by the client (the picker) and /api/narrate, which
// only ever sends ElevenLabs an id from this list, so the browser can't ask
// for arbitrary voices. The character voices come from the ElevenLabs voice
// library, which needs a Creator plan or above.

export interface Voice {
  id: string;
  name: string;
  note: string;
  // null: the server's own default (ELEVENLABS_VOICE_ID, else Gabriel).
  elevenId: string | null;
}

export const VOICES: Voice[] = [
  { id: "default", name: "Original", note: "The house narrator", elevenId: null },
  { id: "grandfather", name: "Grandfather Joe", note: "Old, gentle, wise", elevenId: "0lp4RIz96WD1RUtvEu3Q" },
  { id: "coach", name: "Coach", note: "Deep, fired-up", elevenId: "84Fal4DSXWfp7nJ8emqQ" },
  { id: "sarah", name: "Sarah", note: "Soft, reassuring", elevenId: "EXAVITQu4vr4xnSDxMaL" },
  { id: "ivy", name: "Ivy", note: "Sassy, sharp", elevenId: "MClEFoImJXBTgLwdLI5n" },
];

export const DEFAULT_VOICE_ID = "default";

export function getVoice(id: string | null | undefined): Voice {
  return VOICES.find((v) => v.id === id) ?? VOICES[0];
}
