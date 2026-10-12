import { BrewStep } from "./teaBrewing";
import { BrewContext, stepText } from "./brewCues";

export type Lang = "en" | "zh";

// Chinese for each step's title and instruction. Steps are English in the data
// (parsed from the catalogue), so this rebuilds them from the step kind and
// the same equipment the English came from.
export function zhStep(step: BrewStep, ctx: BrewContext): { label: string; sub: string } {
  if (!step.kind) return { label: step.label, sub: step.sub };
  return stepText(step.kind, ctx, "zh", { num: step.num, seconds: step.seconds });
}

export const ZH_UI = {
  start: "开始计时",
  pause: "暂停",
  resume: "继续",
  next: "下一步",
  skip: "跳过",
  awake: "冲泡期间屏幕将保持常亮。",
  welcomeBack: "欢迎回来，您的冲泡进度已保留。",
  voiceOff: "语音已关闭：",
};
