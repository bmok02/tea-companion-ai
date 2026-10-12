// Every instruction the brew guide shows or speaks, in both languages, built
// from the drinker's equipment. Keeping it in one place means the step list,
// the live cue under the scene, and narration can't disagree about whether
// it's a gaiwan or a teapot, leaves or a bag.

import type { TeaSet } from "./teaware";

export type Lang = "en" | "zh";

export interface BrewContext {
  set: TeaSet;
  bag: boolean;
  grams: string | null; // loose leaf amount from the catalogue, e.g. "5–7g"
}

type StepKind = "prep" | "warm" | "measure" | "rinse" | "steep" | "pour";

function ordinal(n: number): string {
  return n === 1 ? "1st" : n === 2 ? "2nd" : n === 3 ? "3rd" : `${n}th`;
}

export function formatTime(secs: number, lang: Lang): string {
  if (lang === "zh") {
    if (secs < 60) return `${secs}秒`;
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return s > 0 ? `${m}分${s}秒` : `${m}分钟`;
  }
  if (secs < 60) return `${secs} seconds`;
  const m = Math.floor(secs / 60);
  const s = secs % 60;
  return s > 0 ? `${m} min ${s} sec` : `${m} minute${m > 1 ? "s" : ""}`;
}

// Title + one-line instruction for a step, as listed and first spoken.
export function stepText(
  kind: StepKind,
  ctx: BrewContext,
  lang: Lang,
  opts: { num?: number; seconds?: number } = {}
): { label: string; sub: string } {
  const { set, bag, grams } = ctx;
  const zh = lang === "zh";
  const v = zh ? set.vesselZh : set.vessel;
  const p = zh ? set.pitcherZh : set.pitcher;
  const away = zh ? set.discardZh : set.discard;
  const what = bag ? (zh ? "茶包" : "the bag") : zh ? "茶叶" : "the leaves";
  const gramsZh = grams ? grams.replace(/g$/, "克") : "约3克";

  switch (kind) {
    case "prep":
      return zh
        ? { label: "开始之前", sub: "选择您用的是散茶还是茶包，以及哪套茶具，然后准备好下面这些。" }
        : {
            label: "Before you start",
            sub: "Choose loose leaves or a tea bag, and which tea set you have. Then gather everything below.",
          };
    case "warm":
      return zh
        ? { label: `温${v}`, sub: `往${v}里倒热水，轻轻转一转，再把水${away}。` }
        : { label: `Warm the ${v}`, sub: `Pour hot water into the ${v}, swirl it around, then pour it out ${away}.` };
    case "measure":
      if (bag) {
        return zh
          ? { label: "放入一包茶", sub: `打开盖子，把一包茶放进${v}里。分量刚刚好。` }
          : { label: "Add one tea bag", sub: `Lift the lid and put one tea bag in the ${v}. It's already the right amount.` };
      }
      if (set.strainsItself) {
        return zh
          ? { label: "放入茶叶", sub: `打开盖子，把${gramsZh}茶叶放进${v}的滤网里。` }
          : {
              label: "Add the tea leaves",
              sub: `Lift the lid and put ${grams ?? "about 3g"} of leaves into the ${v}'s strainer.`,
            };
      }
      return zh
        ? { label: "放入茶叶", sub: `打开盖子，把${gramsZh}茶叶放进${v}里。` }
        : { label: "Add the tea leaves", sub: `Lift the lid and put ${grams ?? "about 3g"} of leaves in the ${v}.` };
    case "rinse":
      return zh
        ? { label: "快速洗茶", sub: `用热水冲一下${what}，盖上盖子，随即把水${away}。这一泡不喝。` }
        : {
            label: "Quick rinse",
            sub: `Pour hot water over ${what}, put the lid on, then pour it straight out ${away}. Don't drink this one.`,
          };
    case "steep": {
      const num = opts.num ?? 1;
      const t = formatTime(opts.seconds ?? 0, lang);
      if (zh) {
        return {
          label: `第${num}泡`,
          sub:
            num === 1
              ? `往${v}里倒热水，盖上盖子，等待${t}。`
              : `再往${v}里倒热水，盖上盖子，等待${t}。留意味道的变化。`,
        };
      }
      return {
        label: `${ordinal(num)} steep`,
        sub:
          num === 1
            ? `Pour hot water into the ${v}, put the lid on, and wait ${t}.`
            : `Pour hot water into the ${v} again, lid on, and wait ${t}. Notice how the flavour shifts.`,
      };
    }
    case "pour":
      return zh
        ? { label: "分茶品饮", sub: `从${p}把茶分到每个杯里。先闻香，再慢慢啜饮。` }
        : { label: "Pour & enjoy", sub: `Pour from the ${p} into the cups. Breathe in the aroma, then sip slowly.` };
  }
}

// The live cue for a timed step (rinse or steep) at each phase.
export function timedCue(
  phase: "pour-in" | "wait" | "paused" | "done",
  rinse: boolean,
  ctx: BrewContext,
  lang: Lang
): string {
  const { set, bag } = ctx;
  const zh = lang === "zh";
  const v = zh ? set.vesselZh : set.vessel;
  const what = bag ? (zh ? "茶包" : "the bag") : zh ? "茶叶" : "the leaves";

  switch (phase) {
    case "pour-in":
      return rinse
        ? zh
          ? `用热水冲一下${what}，盖上盖子，然后点击开始。`
          : `Pour hot water over ${what}, put the lid on, then tap Start.`
        : zh
          ? `往${v}里倒热水，盖上盖子，然后点击开始。`
          : `Pour hot water into the ${v}, put the lid on, then tap Start.`;
    case "wait":
      return zh ? "盖上盖子，深呼吸，静静等待。" : "Lid on. Just breathe and wait.";
    case "paused":
      return zh ? "已暂停。准备好后点击继续。" : "Paused. Tap Resume when you're ready.";
    case "done":
      return doneCue(rinse, ctx, lang);
  }
}

// Time's up: how to hold the lid while tipping, where it goes, and what
// stays behind. A gaiwan only pours through a gap between lid and bowl; the
// filter teapot pours from its spout with the lid on.
function doneCue(rinse: boolean, { set, bag }: BrewContext, lang: Lang): string {
  const gaiwan = !set.strainsItself;
  if (lang === "zh") {
    const v = set.vesselZh;
    const lid = gaiwan ? "把盖子稍微推开一条缝，" : "盖子不用打开，";
    const stays = bag ? `茶包留在${v}里` : gaiwan ? "从缝里倒，茶叶会留在碗里" : "滤网会挡住茶叶";
    return rinse
      ? `时间到。${lid}把水${set.discardZh}，${stays}。这一泡不喝。`
      : `时间到。${lid}把茶倒进${set.pitcherZh}，${stays}。再分到杯里品尝。`;
  }
  const lid = gaiwan ? "Slide the lid back a little and" : "Keep the lid on and";
  const where = rinse ? `pour the water out ${set.discard}` : `pour the tea into the ${set.pitcher}`;
  const stays = bag
    ? `; the bag stays in the ${set.vessel}.`
    : gaiwan
      ? " through the gap, so the leaves stay in."
      : "; the strainer holds the leaves back.";
  const after = rinse ? " Don't drink this one." : " Then share it into the cups.";
  return `Time's up. ${lid} ${where}${stays}${after}`;
}
