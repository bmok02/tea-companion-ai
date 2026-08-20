// Per-tea visual identity, derived from the same catalogue data the chat
// companion already reads (category/aroma/taste/description) — no new data
// source, just new ways of looking at what's there.
//
// Both pieces below only produce output for the catalogue's richly-structured
// entries (the ones with a `category` field). The ~48 "manually_saved"
// entries have nothing to derive a liquor colour or flavour profile from
// beyond a free-text description, and guessing at those would be more
// misleading than useful — they fall back to the app's existing gold accent
// and simply don't get a flavour-profile panel, rather than showing a chart
// built on air.

import { Tea } from "./knowledgeBase";

export interface LiquorTheme {
  liquid: string;
  liquidLight: string;
}

const DEFAULT_THEME: LiquorTheme = { liquid: "#c9a13b", liquidLight: "#e0bd63" };

// Order matters — more specific categories (rock tea, pu'er) are checked
// before the generic "oolong"/"black tea" they'd otherwise also match.
const CATEGORY_THEMES: { match: RegExp; theme: LiquorTheme }[] = [
  { match: /pu.?er|dark tea/i, theme: { liquid: "#6b3a26", liquidLight: "#8a4f34" } },
  { match: /rock tea|wuyi|yancha/i, theme: { liquid: "#8a5a30", liquidLight: "#ad7a44" } },
  { match: /black tea|red tea/i, theme: { liquid: "#a8502e", liquidLight: "#c06f45" } },
  { match: /green tea/i, theme: { liquid: "#93a75a", liquidLight: "#b0c47c" } },
  { match: /white tea/i, theme: { liquid: "#e3d5a0", liquidLight: "#efe4bf" } },
  { match: /floral/i, theme: { liquid: "#d8b96a", liquidLight: "#e8ce8f" } },
  { match: /oolong/i, theme: { liquid: "#d4a94a", liquidLight: "#e6c26e" } },
];

export function getLiquorTheme(tea: Tea | null): LiquorTheme {
  if (!tea?.category) return DEFAULT_THEME;
  const hit = CATEGORY_THEMES.find((c) => c.match.test(tea.category!));
  return hit ? hit.theme : DEFAULT_THEME;
}

export interface FlavorAxis {
  key: string;
  label: string;
  value: number; // 0–5
}

// A heuristic reading of category/aroma/taste/description text into six
// rough axes — not a lab measurement, but a genuinely tea-specific sketch
// rather than a generic placeholder chart.
export function getFlavorProfile(tea: Tea | null): FlavorAxis[] | null {
  if (!tea || !tea.category) return null;

  const text = [tea.category, tea.aroma, tea.taste, tea.colour, tea.description]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
  const has = (...words: string[]) => words.some((w) => text.includes(w));
  const clamp = (n: number) => Math.max(0, Math.min(5, n));

  let body = 2;
  if (has("pu'er", "pu-er", "dark tea")) body = 4.5;
  else if (has("rock tea", "wuyi")) body = 4;
  else if (has("black tea", "red tea")) body = 3.5;
  else if (has("oolong")) body = 2.5;
  else if (has("green tea")) body = 1.5;
  else if (has("white tea")) body = 1;
  if (has("full-bodied", "rich", "robust", "deep")) body += 0.5;
  if (has("light", "delicate", "gentle", "subtle")) body -= 0.5;

  let sweetness = 2;
  if (has("sweet", "honey", "honeyed")) sweetness += 1.5;
  if (has("sugar", "malt", "caramel")) sweetness += 1;

  let floral = 0.5;
  if (has("floral", "jasmine", "orchid", "osmanthus", "flower")) floral += 3;

  let earthy = 0.5;
  if (has("pu'er", "pu-er", "dark tea")) earthy += 3.5;
  if (has("earthy", "woody", "forest", "wood", "mineral", "roasted", "smoky", "charcoal")) earthy += 2;

  let astringency = 2;
  if (has("green tea", "black tea", "red tea")) astringency = 2.5;
  if (has("white tea")) astringency = 1;
  if (has("bitter", "astringent", "tannic")) astringency += 1;
  if (has("smooth", "no bitterness", "gentle", "creamy")) astringency -= 1;

  let brightness = 2;
  if (has("green tea", "white tea")) brightness = 4;
  if (has("fresh", "grassy", "bright", "crisp", "vegetal")) brightness += 0.5;
  if (has("pu'er", "pu-er", "dark tea", "roasted", "aged")) brightness -= 1.5;

  return [
    { key: "body", label: "Body", value: clamp(body) },
    { key: "sweetness", label: "Sweetness", value: clamp(sweetness) },
    { key: "floral", label: "Floral", value: clamp(floral) },
    { key: "earthy", label: "Earthy", value: clamp(earthy) },
    { key: "astringency", label: "Astringency", value: clamp(astringency) },
    { key: "brightness", label: "Brightness", value: clamp(brightness) },
  ];
}
