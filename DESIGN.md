---
name: The Tea Companion
description: A guided brewing ritual for Tea Chapter's own teas, staged as a gongfu instrument tray
colors:
  ink: "#f1ead9"
  ink-faint: "#d9cdb0"
  ink-muted: "#ad9c85"
  ground: "#211d19"
  ground-deep: "#17140f"
  surface-raised: "#2c2721"
  clay: "#b5522f"
  clay-light: "#d9744a"
  clay-text: "#e08a5f"
  clay-deep: "#8a3d22"
  brass: "#9c7a3e"
  bamboo: "#c9a86a"
  bamboo-pale: "#e8dcc0"
  border: "rgba(156, 122, 62, 0.28)"
  steam-wash: "rgba(181, 82, 47, 0.14)"
typography:
  countdown:
    fontFamily: "'IM Fell English', serif"
    fontSize: "80px"
    letterSpacing: "0.02em"
  display:
    fontFamily: "'IM Fell English', serif"
    fontStyle: "italic"
    fontWeight: 400
    fontSize: "18px"
    letterSpacing: "0.02em"
  display-lg:
    fontFamily: "'IM Fell English', serif"
    fontStyle: "italic"
    fontSize: "22px"
  mark:
    fontFamily: "'Noto Serif SC', serif"
    fontStyle: "normal"
  body:
    fontFamily: "'Cormorant Garamond', Georgia, serif"
    fontSize: "16px"
    lineHeight: 1.65
  body-sm:
    fontFamily: "'Cormorant Garamond', serif"
    fontSize: "14px"
    lineHeight: 1.5
  label:
    fontFamily: "'Cormorant Garamond', serif"
    fontSize: "12px"
    letterSpacing: "0.15em"
    textTransform: "uppercase"
  label-xs:
    fontFamily: "'Cormorant Garamond', serif"
    fontSize: "11px"
    letterSpacing: "0.1em"
    textTransform: "uppercase"
rounded:
  sm: "4px"
  md: "8px"
  lg: "18px"
  pill: "20px"
spacing:
  xs: "6px"
  sm: "10px"
  md: "16px"
  lg: "20px"
  xl: "24px"
components:
  button-primary:
    backgroundColor: "{colors.clay-deep}"
    textColor: "#ffffff"
    rounded: "{rounded.sm}"
    padding: "14px 24px"
  button-primary-hover:
    backgroundColor: "{colors.clay-deep}"
  button-secondary:
    backgroundColor: "transparent"
    textColor: "{colors.ink-faint}"
    rounded: "{rounded.sm}"
    padding: "9px 16px"
  icon-button:
    backgroundColor: "transparent"
    textColor: "{colors.ink-muted}"
    rounded: "{rounded.sm}"
    width: "34px"
    height: "34px"
  pill-tag:
    backgroundColor: "{colors.surface-raised}"
    textColor: "{colors.ink-faint}"
    rounded: "{rounded.pill}"
    padding: "8px 18px"
---

# Design System: The Tea Companion

## Overview

**Creative North Star: "The Instrument Tray"**

Every screen is a position on a gongfu tea session's own tool tray — a wet
stone reservoir under a slatted bamboo top, a gaiwan at its centre, aroma
cups and a tea pick laid beside it. The tray is the interface: home is the
tray set and waiting, a brew in progress is the same tray full-screen with
the gaiwan tracking the actual pour, and stepping through a brew is moving
attention across positions on one surface rather than paging through cards.
This replaces the app's earlier cream-paper, gold-serif "heritage zen" look
outright — that world was evidence of what the product is (a real, specific
Singapore Chinese teahouse's own ritual), not a rendition to keep polishing.

The palette is deliberately wet and dim rather than bright and papery: a
near-black stone ground, unglazed zisha-clay red-brown as the one active
accent, pale bamboo and brass as secondary warm materials. This is a
solo, unhurried, evening-adjacent scene — someone steeping real leaves at
home, phone or laptop nearby — not a daylight retail catalogue.

**Key characteristics:**
- One illustrated world (`TrayScene.tsx`), reused as the home hero and the
  full-screen brew's own backdrop — never a second, competing illustration
  style.
- No emoji standing in for icons anywhere in the product chrome; every icon
  is an authored stroke-SVG in one consistent weight.
- No kicker/eyebrow labels above headings — a heading carries its own
  weight, or the visual carries it instead.
- Chat and steep-time prompts are secondary, reached through a one-tap
  "Notes & chat" drawer — never the default view.

## Colors

Two clay grades carry every accent role, mirroring how the retired gold
pair worked: `clay-text` is a lightened clay for readable accent text on
the dark ground (6.3:1), `clay-deep` a darkened clay so a solid fill still
clears 4.5:1 under white button text. `clay`/`clay-light` stay decorative
only — borders, dots, fills with no text on them. `brass` is icon/hardware
only (4.2:1, below body-text contrast on purpose) — never body copy.
`bamboo`/`bamboo-pale` are the tray's own warm-neutral materials (aroma
cups, secondary surfaces), not accent colors.

## Typography

Display type (`IM Fell English`, italic) carries the tea name, step
titles, and any moment that should read as a plaque or placard resting on
the tray. `Noto Serif SC` is reserved for the CJK mark ("茶渊") only —
never mixed mid-sentence elsewhere. Body copy is `Cormorant Garamond`
throughout, at a size and line-height built for a phone held at arm's
length, not a dense reading column. Labels (form labels, section labels)
are small, tracked, uppercase — functional metadata, not a design flourish,
which is why they're allowed to exist even though a kicker-above-a-heading
is banned.

The documented steps above (11/12/14/16/18/22/80) are the ramp for new
work. A handful of in-between legacy sizes (13px, 15px, 17px) remain from
the pre-redesign implementation in places the redesign didn't touch —
accepted as-is rather than drift to chase; round to the nearest documented
step when next editing that rule.

## Layout

Home: a full-bleed tray hero leads, before any form field — "greeted by
visual straight away." The tea search/selector sits below it as how you
"load" a tea onto the tray. A brew in progress takes the entire screen
(`.brew-overlay`/`.brew-modal`), not a centred card with a dimmed backdrop
— the same tray world, not a dialog interrupting it. Chat, steep-time
prompts, and the welcome state live in `NotesDrawer.tsx`, a bottom sheet on
mobile that becomes a docked floating panel at ≥720px — reached by a tab,
never shown by default, and dismissible without breaking focus on the
brew underneath it.

## Elevation & Depth

Mostly flat and tonal — bands of `ground` vs `surface-raised` (the
companion/countdown panels) do the separating, not shadows. Shadows are
reserved for things that genuinely float above the tray plane: the notes
drawer (`0 -18px 48px rgba(0,0,0,.45)`) and the floating mini-timer pill.
All shadows carry real offset and blur; no zero-offset colored halos except
the intentional pulse rings (`mic-pulse`, `pulse-gold`), which are state
indicators, not elevation.

## Shapes

Small radii throughout (`4px` for buttons/inputs, `18px` for the notes
sheet's leading corners, full pill for tags and the current-tea badge) —
nothing sharp, nothing showily rounded. The tray illustration itself
supplies the one large soft-cornered shape (`rx="14"`) everything else sits
inside conceptually.

## Components

- **Primary action** (`Begin Brew Session`, `Start timer`): solid
  `clay-deep`, white text, no icon — the tray illustration above already
  carries the "teapot" imagery, so the button stays plain and confident.
- **Icon buttons** (mute, replay, notes, close): 34px square, transparent,
  a hairline brass-tinted border, single-weight stroke icon — the same
  visual family everywhere they appear (header, companion, drawer).
- **Pills** (steep-time prompts, tea-switch actions): text-only now — no
  emoji, no icon slot. Short, direct verbs/nouns.
- **The companion** (`TrayScene` + caption + mute/replay): the one
  recurring, load-bearing composition — cup state on the left/above, the
  actual instruction text beside it, controls at the far edge. Every brew
  step is this same composition with different content, never a bespoke
  layout per step.

## Do's and Don'ts

- **Do** keep the tray illustration as the single visual world; a new
  screen recomposes it, it never introduces a second illustration style.
- **Do** use `clay-text`/`clay-deep` for any new accent text or filled
  button; never `clay`/`clay-light`/`brass` under text that must be read.
- **Don't** reach for an emoji as an icon, a kicker above a heading, or a
  same-size icon+heading+text card — all three were explicitly designed
  out of this app in this pass.
- **Don't** reintroduce a centred, backdrop-dimmed modal for the brew
  session — it is a full-screen surface now, by product decision, not a
  temporary implementation shortcut.
- **Don't** show chat or steep-time prompts by default on any screen — they
  route through `NotesDrawer` or nothing.
