import { BrewStep } from "./teaBrewing";

export type Lang = "en" | "zh";

function zhTime(secs: number): string {
  if (secs < 60) return `${secs}秒`;
  const m = Math.floor(secs / 60);
  const s = secs % 60;
  return s > 0 ? `${m}分${s}秒` : `${m}分钟`;
}

// Chinese for each step's title and instruction. Steps are English in the data
// (parsed from the catalogue), so this is keyed by step kind + steep number
// and rebuilt from the same timings.
export function zhStep(step: BrewStep): { label: string; sub: string } {
  switch (step.kind) {
    case "warm":
      return { label: "温杯", sub: "倒入热水，轻轻转动盖碗，然后把水倒掉。" };
    case "measure":
      return { label: "放入一包茶", sub: "把一包茶放入盖碗，分量刚刚好。" };
    case "rinse":
      return { label: "快速洗茶", sub: "用热水冲过茶包，随即倒掉，这一泡不喝。" };
    case "steep":
      return {
        label: `第${step.num ?? 1}泡`,
        sub:
          step.num === 1
            ? `倒入热水，盖上盖子，等待${zhTime(step.seconds)}。`
            : `再次倒入热水，等待${zhTime(step.seconds)}。留意味道的变化。`,
      };
    case "pour":
      return { label: "倒茶品饮", sub: "把茶倒入杯中，闻一闻茶香，再慢慢啜饮。" };
    default:
      return { label: step.label, sub: step.sub };
  }
}

export const ZH_UI = {
  poured: (rinse: boolean) =>
    rinse ? "用热水冲过茶包，然后点击开始。" : "倒入热水，盖上盖子，然后点击开始。",
  waiting: "盖上盖子，深呼吸，静静等待。",
  paused: "已暂停。准备好后点击继续。",
  done: (rinse: boolean) => (rinse ? "时间到。把水倒掉，这一泡不喝。" : "时间到。把茶倒入杯中，慢慢品尝。"),
  last: "茶已准备好。轻轻倒出，慢慢品味。",
  start: "开始计时",
  pause: "暂停",
  resume: "继续",
  next: "下一步",
  skip: "跳过",
  awake: "冲泡期间屏幕将保持常亮。",
  welcomeBack: "欢迎回来，您的冲泡进度已保留。",
  voiceOff: "语音已关闭：",
};
