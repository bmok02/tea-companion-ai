// The teaware a brew is built around. Steps, cues, the animated scene and the
// "before you start" checklist all read from the drinker's two answers —
// which set, and loose leaves or a bag — so the guide never asks for a
// vessel or a technique that doesn't match what's on the table.
//
// Full set:     gaiwan (bowl + lid + saucer) → sharing pitcher → tasting cups,
//               over a slatted tea tray that drains the waste water.
// Portable set: filter teapot (lid + built-in strainer) → glass pitcher → cups,
//               packed in a carry case. No tray, so waste water goes in a bowl.
//               Modelled on TeaTsy's travel sets (e.g. "Nomad").

import type { Tea } from "./knowledgeBase";

export type TeawareIcon =
  | "gaiwan"
  | "filterpot"
  | "pitcher"
  | "glasspitcher"
  | "cups"
  | "tray"
  | "kettle"
  | "bowl"
  | "case"
  | "leaves"
  | "teabag";

export interface TeawareItem {
  id: string;
  icon: TeawareIcon;
  name: string;
  nameZh: string;
  note: string;
  noteZh: string;
  // Drop a product photo at public/teaware/<file> and set it here; until then
  // the item shows its drawn icon.
  image?: string;
}

export type TeaSetId = "full" | "portable";

export interface TeaSet {
  id: TeaSetId;
  label: string;
  labelZh: string;
  blurb: string;
  blurbZh: string;
  // What the brewing vessel / pitcher / waste are called in step text.
  vessel: string;
  vesselZh: string;
  pitcher: string;
  pitcherZh: string;
  // Where warming and rinse water get poured away.
  discard: string;
  discardZh: string;
  // Gaiwans strain by leaving the lid ajar; filter teapots strain on their own.
  strainsItself: boolean;
  items: TeawareItem[];
}

export const TEA_SETS: TeaSet[] = [
  {
    id: "full",
    label: "Full tea set",
    labelZh: "全套茶具",
    blurb: "Gaiwan, sharing pitcher and tasting cups on a tea tray.",
    blurbZh: "盖碗、公道杯和品茗杯，放在茶盘上。",
    vessel: "gaiwan",
    vesselZh: "盖碗",
    pitcher: "sharing pitcher",
    pitcherZh: "公道杯",
    discard: "onto the tray",
    discardZh: "倒在茶盘上",
    strainsItself: false,
    items: [
      { id: "gaiwan", icon: "gaiwan", name: "Gaiwan", nameZh: "盖碗", note: "Bowl, lid and saucer. You brew in this.", noteZh: "碗、盖和托，用来泡茶。" },
      { id: "pitcher", icon: "pitcher", name: "Sharing pitcher", nameZh: "公道杯", note: "The tea goes in here first, so every cup tastes the same.", noteZh: "茶先倒进这里，每杯味道一致。" },
      { id: "cups", icon: "cups", name: "Tasting cups", nameZh: "品茗杯", note: "Small cups, one for each person.", noteZh: "小杯，每人一个。" },
      { id: "tray", icon: "tray", name: "Tea tray", nameZh: "茶盘", note: "Slatted tray. Waste water is poured onto it.", noteZh: "带格栅的茶盘，废水直接倒在上面。" },
      { id: "kettle", icon: "kettle", name: "Kettle of hot water", nameZh: "一壶热水", note: "Heated to the temperature for your tea.", noteZh: "按茶的要求烧到合适的水温。" },
    ],
  },
  {
    id: "portable",
    label: "Portable set",
    labelZh: "便携茶具",
    blurb: "Filter teapot, glass pitcher and cups from a travel case.",
    blurbZh: "过滤茶壶、玻璃公道杯和茶杯，收在旅行盒里。",
    vessel: "teapot",
    vesselZh: "茶壶",
    pitcher: "glass pitcher",
    pitcherZh: "玻璃公道杯",
    discard: "into a bowl or the sink",
    discardZh: "倒进碗里或水槽",
    strainsItself: true,
    items: [
      { id: "pot", icon: "filterpot", name: "Filter teapot", nameZh: "过滤茶壶", note: "Lid on top, strainer built in. You brew in this.", noteZh: "带盖，内置滤网，用来泡茶。" },
      { id: "pitcher", icon: "glasspitcher", name: "Glass pitcher", nameZh: "玻璃公道杯", note: "The tea goes in here first, then into the cups.", noteZh: "茶先倒进这里，再分到杯中。" },
      { id: "cups", icon: "cups", name: "Cups", nameZh: "茶杯", note: "The small cups that come in the set.", noteZh: "套装里的小茶杯。" },
      { id: "bowl", icon: "bowl", name: "A bowl, or a sink nearby", nameZh: "一个碗或附近的水槽", note: "There's no tray, so waste water goes here.", noteZh: "没有茶盘，废水倒在这里。" },
      { id: "kettle", icon: "kettle", name: "Kettle or flask of hot water", nameZh: "热水壶或保温瓶", note: "Heated to the temperature for your tea.", noteZh: "按茶的要求准备合适水温的热水。" },
      { id: "case", icon: "case", name: "Carry case", nameZh: "收纳盒", note: "Just for storage. You don't need it to brew.", noteZh: "仅用于收纳，泡茶时用不到。" },
    ],
  },
];

export const DEFAULT_TEA_SET_ID: TeaSetId = "full";

export function getTeaSet(id: string | null | undefined): TeaSet {
  return TEA_SETS.find((s) => s.id === id) ?? TEA_SETS[0];
}

// Tea Chapter sells some teas as pre-portioned bags (name carries "Teabags");
// everything else is loose leaf. This is only the default answer — the
// drinker says which they actually have.
export function isTeabag(tea: Pick<Tea, "name"> | { name: string }): boolean {
  return /tea\s?bags?/i.test(tea.name);
}

// "Leaf amount: Use approximately 5–7g of tea leaves (…)" → "5–7g".
// Only the gram figure is kept: the catalogue's wording around it varies too
// much to drop into a sentence of our own.
export function leafGrams(brewingInstructions: string | undefined): string | null {
  const m = brewingInstructions?.match(/leaf amount:[^.]*?(\d+(?:\s*[–-]\s*\d+)?\s*g)\b/i);
  return m ? m[1].replace(/\s+/g, "") : null;
}

export function ingredientItem(bag: boolean, grams: string | null): TeawareItem {
  return bag
    ? {
        id: "tea",
        icon: "teabag",
        name: "One tea bag",
        nameZh: "一包茶",
        note: "Already the right amount.",
        noteZh: "分量已经配好。",
      }
    : {
        id: "tea",
        icon: "leaves",
        name: grams ? `${grams} of loose tea leaves` : "Loose tea leaves",
        nameZh: grams ? `${grams.replace(/g$/, "克")}散装茶叶` : "散装茶叶",
        note: grams ? "A small scale helps. About one or two teaspoons." : "About one teaspoon, roughly 3g.",
        noteZh: grams ? "最好用小秤称量，大约一到两茶匙。" : "大约一茶匙，约3克。",
      };
}
