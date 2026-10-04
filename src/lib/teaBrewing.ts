// Ported 1:1 from the original tea_companion.html <script> logic:
// KB lookup, system-prompt construction, and the brew-step-timer parser.

import { KNOWLEDGE_BASE, Tea } from "./knowledgeBase";

export function findTea(name: string): Tea | null {
  if (!name) return null;
  const q = name.toLowerCase();
  const teas = KNOWLEDGE_BASE.teas;
  // Exact name first: the looser first-word fallback below would otherwise
  // let an earlier entry sharing a first word ("Jin Jun Mei") shadow
  // "Jin Xuan".
  return (
    teas.find((t) => t.name.toLowerCase() === q) ||
    teas.find((t) => t.name.toLowerCase().includes(q)) ||
    teas.find((t) => q.includes(t.name.toLowerCase().split(" ")[0])) ||
    null
  );
}

export function buildTeaContext(name: string): string {
  const tea = findTea(name);
  if (!tea) {
    return `The user is drinking: "${name}". Not in Tea Chapter catalogue — answer from general knowledge.`;
  }
  if (tea.category || tea.origin) {
    return `CURRENT TEA (Tea Chapter catalogue):
Name: ${tea.name} (${tea.chinese_name || ""})
Category: ${tea.category || ""}  Origin: ${tea.origin || ""}
Aroma: ${tea.aroma || ""}  Colour: ${tea.colour || ""}  Taste: ${tea.taste || ""}
Description: ${tea.description || ""}
Brewing Instructions: ${tea.brewing_instructions || ""}
Mindfulness Note: ${tea.mindfulness_note || ""}
Product page: ${tea.url || ""}`;
  }
  return `CURRENT TEA (Tea Chapter catalogue):
Name: ${tea.name}
${tea.description || ""}`;
}

export function buildSystemPrompt(currentTea: string): string {
  const biz = JSON.stringify(KNOWLEDGE_BASE.business, null, 2);
  const teaCtx = currentTea
    ? `\n\nCURRENT SESSION TEA:\n${buildTeaContext(currentTea)}`
    : "";
  return `You are the Tea Companion — a warm, knowledgeable, and mindful guide created by Tea Chapter (茶渊), Singapore's oldest traditional Chinese teahouse, established 1989 at 9 Neil Road, Chinatown.

You help people brewing Tea Chapter's teas at home. You are:
- An expert on Chinese tea (history, culture, ceremony, brewing, health)
- A gentle mindfulness guide for the tea session
- A knowledgeable source on Tea Chapter's heritage and philosophy

TONE: Warm, poetic but never pretentious. Grounded and practical. Like a knowledgeable friend who loves tea.

KNOWLEDGE PRIORITY:
1. Tea Chapter knowledge base (provided below)
2. Your general knowledge on Chinese tea culture and mindfulness
3. For anything beyond: say so honestly, suggest teachapter.com

ABOUT TEA CHAPTER:
${biz}

BREWING FORMAT: Be specific — temperatures, quantities, steeping times, re-steep count. Keep it sequential and practical.

MINDFULNESS: Guide attention to sensory details (colour, aroma, warmth, taste). Offer reflective questions. Keep grounded, not spiritual jargon.

MINDFULNESS QUESTION: When asked for a mindfulness question, reply with only a two-part question and nothing else: no greeting, no explanation, no follow-up offer. The two parts should flow into one another and invite the people sharing the table to each share a few things aloud (what they notice in the cup, what the moment brings up). Keep it short enough to be read aloud in one breath or two.

CITATION: Reference Tea Chapter naturally when drawing from their catalogue (e.g. "Tea Chapter notes…").

NARRATOR AWARENESS: Your responses may be read aloud. Avoid using markdown symbols like ** or # in ways that sound awkward when spoken. Use natural spoken language flow.${teaCtx}`;
}

export interface BrewStep {
  label: string;
  sub: string;
  seconds: number;
  // Each kind drives its own animated scene (see BrewScene.tsx). Timings are
  // fixed: Tea Chapter's tea bags are pre-portioned, so nothing to tune.
  kind?: "warm" | "measure" | "rinse" | "steep" | "pour";
  num?: number;
}

function steepSub(num: number, secs: number): string {
  const timeStr = formatBrewTime(secs);
  return num === 1
    ? `Pour hot water in, put the lid on, and wait ${timeStr}.`
    : `Pour hot water in again and wait ${timeStr}. Notice how the flavour shifts.`;
}

export function parseBrewSteps(tea: Tea | { description: string; name: string }): BrewStep[] | null {
  if (!tea) return null;
  const steps: BrewStep[] = [];
  const src = (
    ("brewing_instructions" in tea ? tea.brewing_instructions : "") ||
    tea.description ||
    ""
  ).toLowerCase();

  const hasRinse = src.includes("rinse") && !src.includes("no rinsing");
  const isGreen =
    ("category" in tea ? tea.category || "" : "").toLowerCase().includes("green") ||
    src.includes("no rinsing needed");

  // Preheat
  steps.push({
    label: "Warm the gaiwan",
    sub: "Pour in hot water, swirl it around, then pour it out.",
    seconds: 0,
    kind: "warm",
  });

  // Tea bag — Tea Chapter's bags are pre-portioned, so no weighing.
  steps.push({
    label: "Add one tea bag",
    sub: "Drop one tea bag into the gaiwan. It's already the right amount.",
    seconds: 0,
    kind: "measure",
  });

  // Rinse
  if (hasRinse && !isGreen) {
    steps.push({
      label: "Quick rinse",
      sub: "Pour hot water over the bag, then pour it straight out. Don't drink this one.",
      seconds: 8,
      kind: "rinse",
    });
  }

  // Also try the simple "Time — X seconds" format from manually-saved entries
  const simpleTime = src.match(/time[\s—-]+([\d]+)\s*(seconds?|minutes?)/i);

  let steepTimes: { num: number; secs: number }[] = [];

  // Try extracting per-brew instructions
  const brewMatches = [
    ...src.matchAll(/(\d+)(?:st|nd|rd|th)\s+brew[:\s]+([\d]+(?:[–-][\d]+)?)\s*(seconds?|minutes?)/gi),
  ];
  if (brewMatches.length > 0) {
    for (const m of brewMatches) {
      const num = parseInt(m[1]);
      const rawTime = m[2].split(/[–-]/)[0]; // take lower bound
      const unit = m[3].toLowerCase();
      const secs = unit.startsWith("min") ? parseInt(rawTime) * 60 : parseInt(rawTime);
      steepTimes.push({ num, secs });
    }
    // Extrapolate a few more steeps (adding ~10s each)
    const last = steepTimes[steepTimes.length - 1];
    for (let i = last.num + 1; i <= last.num + 3; i++) {
      steepTimes.push({ num: i, secs: Math.min(last.secs + 10 * (i - last.num), 180) });
    }
  } else if (simpleTime) {
    const secs = simpleTime[2].startsWith("min")
      ? parseInt(simpleTime[1]) * 60
      : parseInt(simpleTime[1]);
    for (let i = 1; i <= 4; i++) {
      steepTimes.push({ num: i, secs: Math.round(secs * (1 + (i - 1) * 0.2)) });
    }
  } else {
    // Generic fallback
    steepTimes = [
      { num: 1, secs: 40 },
      { num: 2, secs: 30 },
      { num: 3, secs: 45 },
      { num: 4, secs: 60 },
    ];
  }

  for (const { num, secs } of steepTimes) {
    const ordinal = num === 1 ? "1st" : num === 2 ? "2nd" : num === 3 ? "3rd" : `${num}th`;
    const label = `${ordinal} steep`;
    const sub = steepSub(num, secs);
    steps.push({ label, sub, seconds: secs, kind: "steep", num });
  }

  steps.push({
    label: "Pour & enjoy",
    sub: "Pour into your cups. Breathe in the aroma, then sip slowly.",
    seconds: 0,
    kind: "pour",
  });
  return steps;
}

export function formatBrewTime(secs: number): string {
  if (secs === 0) return "";
  if (secs < 60) return `${secs} seconds`;
  const m = Math.floor(secs / 60),
    s = secs % 60;
  return s > 0 ? `${m} min ${s} sec` : `${m} minute${m > 1 ? "s" : ""}`;
}

export function countdownDisplay(secs: number): string {
  const m = Math.floor(secs / 60),
    s = secs % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

// Shared by BrewModal's big countdown fill and BrewMini's ring so both read
// the same progress from the same numbers instead of drifting apart.
export function fillPercent(secondsLeft: number, totalSeconds: number): number {
  if (totalSeconds <= 0) return 0;
  return ((totalSeconds - secondsLeft) / totalSeconds) * 100;
}
