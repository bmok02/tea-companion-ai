// Companions: the character who talks the drinker through the brew. Each one
// rewords the guide's English cues in its own voice (from the persona scripts
// sheet) without changing what to do, so every line is still built from the
// drinker's equipment like brewCues.ts. "original" keeps the plain guide and
// returns no lines, so the baseline cues stand. Chinese mode always uses the
// baseline cues; the scripts are English only.

import { BrewContext, formatTime } from "./brewCues";

export type PersonaId = "original" | "master" | "hyrox" | "exam" | "tease";

export interface Persona {
  id: PersonaId;
  name: string;
  nameZh: string;
  tagline: string;
  taglineZh: string;
  // Voice picked automatically with the persona (see voices.ts); the drinker
  // can still change it.
  voice: string;
  // Said when previewing the voice.
  hello: string;
  // Added to the chat system prompt so replies stay in character.
  chatTone: string | null;
}

export const PERSONAS: Persona[] = [
  {
    id: "original",
    name: "Original",
    nameZh: "原版",
    tagline: "The calm, plain guide. Just the steps.",
    taglineZh: "平静简洁的向导，只讲步骤。",
    voice: "default",
    hello: "Hello. I'll guide you through each step, one at a time.",
    chatTone: null,
  },
  {
    id: "master",
    name: "Tea Master",
    nameZh: "茶师",
    tagline: "Calm, warm, a little heritage in every steep.",
    taglineZh: "沉静温和，每一泡都有一段传统。",
    voice: "grandfather",
    hello: "Welcome. Sit with me a while; the tea will tell us when it's ready.",
    chatTone:
      "Speak as a traditional tea master: calm, warm and gently educational, weaving in heritage and story (Lu Yu, 醒茶, 茶七酒八, tapping two fingers to say thanks) where it fits.",
  },
  {
    id: "hyrox",
    name: "Hyrox",
    nameZh: "Hyrox 赛前伙伴",
    tagline: "Race is tomorrow. Today is recovery.",
    taglineZh: "明天比赛，今天恢复。",
    voice: "coach",
    hello: "Race is tomorrow. Today, we recover. Let's brew.",
    chatTone:
      "Speak as a high-energy race partner the day before a Hyrox race: motivating, using training language (warm-up, working set, taper), while steering the drinker toward calm and recovery.",
  },
  {
    id: "exam",
    name: "Exam Season",
    nameZh: "考试季",
    tagline: "A proper study break. Lock in, then let go.",
    taglineZh: "认真休息一下，再回去专心。",
    voice: "sarah",
    hello: "Study break, officially started. One pot, no flashcards.",
    chatTone:
      "Speak as an exam-season study buddy: encouraging and practical, framing the tea as a structured study break that helps the drinker go back in refreshed.",
  },
  {
    id: "tease",
    name: "Teasing Partner",
    nameZh: "损友",
    tagline: "Playful, cheeky, never mean.",
    taglineZh: "爱开玩笑，嘴贫但不刻薄。",
    voice: "ivy",
    hello: "Oh, you're making tea? Properly? This I have to see.",
    chatTone:
      "Speak as a teasing friend: playful and cheeky but never mean, with a light touch of Singlish kept classy.",
  },
];

export const DEFAULT_PERSONA_ID: PersonaId = "original";

export function getPersona(id: string | null | undefined): Persona {
  return PERSONAS.find((p) => p.id === id) ?? PERSONAS[0];
}

type Kind = "warm" | "measure" | "rinse" | "steep" | "pour";
export type PersonaPhase = "intro" | "wait" | "done";

interface Lines {
  warm: string;
  measure: string;
  rinseStart: string;
  rinseWait: string;
  rinseDone: string;
  steepStart: string;
  // 1st, 2nd, 3rd, 4th-and-on, and the last steep of the brew.
  steepWait: [string, string, string, string, string];
  steepDone: string;
  pour: string;
}

// The equipment-dependent pieces every persona's lines are built from.
function kit({ set, bag, grams }: BrewContext, seconds: number) {
  const v = set.vessel;
  const gaiwan = !set.strainsItself;
  const g = grams ?? "about 3g";
  const dose = bag ? "one tea bag" : `${g} of leaves${g === "5–7g" ? ", about one to two teaspoons" : ""}`;
  const t = formatTime(seconds, "en");
  return {
    v,
    p: set.pitcher,
    away: set.discard,
    what: bag ? "the bag" : "the leaves",
    bag,
    strainer: set.strainsItself && !bag,
    dose,
    Dose: dose[0].toUpperCase() + dose.slice(1),
    T: t[0].toUpperCase() + t.slice(1),
    // How to tip it out, and what stays behind.
    lid: gaiwan ? "Slide the lid back a little and pour" : "Keep the lid on and pour",
    keep: bag ? `The bag stays in the ${v}.` : gaiwan ? "The gap keeps the leaves in." : "The strainer holds the leaves back.",
  };
}

type Kit = ReturnType<typeof kit>;

const SCRIPTS: Record<Exclude<PersonaId, "original">, (k: Kit) => Lines> = {
  master: (k) => ({
    warm: `Before we welcome the tea, we warm its home. Pour hot water into the ${k.v}, swirl it gently, then pour it out ${k.away}. A cold ${k.v} startles the tea; a warm one invites it.`,
    measure: k.bag
      ? `Lift the lid and place one tea bag in the ${k.v}. Look at it for a moment; everything the tea will become is waiting inside.`
      : `Lift the lid.${k.strainer ? ` The strainer stays inside the ${k.v}.` : ""} Place ${k.dose} ${k.strainer ? "into it" : `in the ${k.v}`}. Look at them for a moment: tightly rolled, still asleep.`,
    rinseStart: `Now we wake the tea. In our tradition, this is called 醒茶. Pour hot water over ${k.what}, put the lid on, then tap Start.`,
    rinseWait: `Let ${k.what} stretch. Let your shoulders drop.`,
    rinseDone: `Enough. ${k.lid} this water ${k.away}. ${k.keep} The first water is for the tea, not for us.`,
    steepStart: "Pour hot water in again. Lid on. Tap Start.",
    steepWait: [
      "Over a thousand years ago, Lu Yu wrote an entire book about tea. You need only sit with one pot. Breathe in, and out.",
      "The leaves have opened now. Each steep tells a different part of their story.",
      "When someone pours tea for you, tap two fingers on the table. It is how we say thank you without interrupting.",
      "Notice where your mind wandered just now. Gently bring it back to the cup.",
      "The last steep is softer, like the end of a long conversation between old friends.",
    ],
    steepDone: `${k.lid} the tea into the ${k.p}. ${k.keep} Then share it evenly among the cups.`,
    pour: "Share it evenly among the cups, so no one's tea is stronger than another's. Fill each about seventy percent: 茶七酒八. Bring the cup to your nose first, then sip slowly.",
  }),
  hyrox: (k) => ({
    warm: `Race is TOMORROW, so today is recovery. Pour hot water into the ${k.v}, swirl it, dump it out ${k.away}. That's your warm-up.`,
    measure: k.bag
      ? `Lid off. One tea bag in the ${k.v}. Pre-measured, like your gels.`
      : `Lid off${k.strainer ? ", strainer stays in" : ""}. ${k.Dose}${k.strainer ? "" : ` in the ${k.v}`}. Precise dosing, like your electrolytes.`,
    rinseStart: `Warm-up set. Hot water over ${k.what}, lid on, hit Start.`,
    rinseWait: "Shake out your arms. Breathe.",
    rinseDone: `${k.lid} that water ${k.away}. ${k.keep} Don't drink it. It's just activating the tea.`,
    steepStart: "Working set. Hot water in, lid on, Start.",
    steepWait: [
      `${k.T}. No sled pushes, no wall balls. Your only job is to breathe. Rest is training too.`,
      "Round two. Heart rate down, focus up.",
      "Visualise tomorrow: calm start, steady pace.",
      "The strongest athletes are often the calmest before a race. Breathe.",
      "Final steep. Taper complete. Now go sleep early.",
    ],
    steepDone: `Time! ${k.lid} it into the ${k.p}. ${k.keep} Then split it into the cups.`,
    pour: "Split it evenly into the cups. Smell first, then sip slowly. Hydration, but make it heritage.",
  }),
  exam: (k) => ({
    warm: `Study break, officially started. Pour hot water into the ${k.v}, swirl it, then pour it out ${k.away}. Close the laptop while you're at it.`,
    measure: k.bag
      ? `Lift the lid and add one tea bag to the ${k.v}. That's the only measurement you have to remember today, I promise.`
      : `Lift the lid.${k.strainer ? ` The strainer stays in the ${k.v}.` : ""} Add ${k.dose}. That's the only measurement you have to remember today, I promise.`,
    rinseStart: `Pour hot water over ${k.what}, lid on, tap Start.`,
    rinseWait: "Eight seconds. Unclench your jaw. Yes, you were clenching it.",
    rinseDone: `${k.lid} it out ${k.away}. ${k.keep} Don't drink this one; it just wakes the tea up.`,
    steepStart: "Hot water in, lid on, Start.",
    steepWait: [
      `${k.T}, no notes, no flashcards. Your brain is still working in the background. Let it.`,
      "Quick check-in: shoulders down, deep breath in, and out.",
      "Scholars in imperial China drank tea through long nights of study for their exams. You're in good company.",
      "Think of one thing you've already understood well today. That counts.",
      "Last steep. Finish this cup, then go back in. You've got this.",
    ],
    steepDone: `${k.lid} the tea into the ${k.p}. ${k.keep} Then pour it into the cups.`,
    pour: "Pour it evenly into the cups. Smell it, then sip slowly. This cup is a reward, not a task.",
  }),
  tease: (k) => ({
    warm: `First step, and no, you can't skip it. Pour hot water into the ${k.v}, swirl it like you know what you're doing, then pour it out ${k.away}. Yes, we're washing the ${k.v} with water. Trust the process.`,
    measure: k.bag
      ? `Lid off. One tea bag in the ${k.v}. One. Not two "for flavour". I'm watching.`
      : `Lid off.${k.strainer ? ` The strainer stays IN the ${k.v}. I know you were about to take it out.` : ""} ${k.Dose}${k.strainer ? "" : ` in the ${k.v}`}. Not the whole packet. I'm watching.`,
    rinseStart: `Pour hot water over ${k.what}, lid on, tap Start. This is just the rinse.`,
    rinseWait: "Eight seconds. You can survive eight seconds without your phone. Probably.",
    rinseDone: `${k.lid} it all out ${k.away}. ${k.keep} Don't drink it. I said DON'T drink it.`,
    steepStart: "Okay, the real one now. Hot water in, lid on, Start.",
    steepWait: [
      `${k.T}. Yes, it feels long. That's the point. Let your scrolling thumb rest.`,
      "Round two. Admit it, you're starting to enjoy this.",
      "Fun fact while you wait: the English word 'tea' comes from Hokkien. Your ah gong would be proud.",
      "Still here? Respect. Deep breath.",
      "Last steep. Next time, you're making it for me.",
    ],
    steepDone: `${k.lid} it into the ${k.p}. ${k.keep} Look at you, actually brewing tea. Who even are you?`,
    pour: "Split it evenly between the cups. No favourites. Smell it first, then sip slowly, like a person with taste.",
  }),
};

// The persona's line for a step at a phase: "intro" when the step opens (for
// a timed step, the line asking to pour in and tap Start), "wait" while the
// timer runs, "done" when it rings. Null means use the baseline cue.
export function personaCue(
  id: PersonaId,
  kind: Kind,
  phase: PersonaPhase,
  ctx: BrewContext,
  opts: { num?: number; seconds?: number; lastSteep?: boolean } = {}
): string | null {
  if (id === "original") return null;
  const l = SCRIPTS[id](kit(ctx, opts.seconds ?? 0));
  if (kind === "rinse") return phase === "intro" ? l.rinseStart : phase === "wait" ? l.rinseWait : l.rinseDone;
  if (kind === "steep") {
    if (phase === "intro") return l.steepStart;
    if (phase === "done") return l.steepDone;
    return l.steepWait[opts.lastSteep ? 4 : Math.min((opts.num ?? 1) - 1, 3)];
  }
  if (phase !== "intro") return null;
  return l[kind];
}
