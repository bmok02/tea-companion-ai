# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Home drinkers who've bought (or are curious about) tea from Tea Chapter —
Singapore's oldest traditional Chinese teahouse, established 1989, at 9 Neil
Road, Chinatown. They brew that tea alone at home, phone or laptop nearby,
during the few minutes a steep actually takes.

## Product Purpose

Turn brewing tea from idle waiting into a noticed, mindful ritual — not "a
chatbot that knows about tea," and not a bare countdown timer. Success means
the steep itself becomes something the drinker actually pays attention to,
not something they wait out.

## Positioning

Grounded in one specific real teahouse's own catalogue (~58 teas) and
business knowledge (founded 1989, visited by Queen Elizabeth II in 1989,
three distinct seating rooms) rather than generic tea-encyclopedia content —
a companion a generic tea app could not truthfully copy. As of this session,
the direction shifts further: the guided visual-and-spoken companion itself
— not the chat — is the product's main feature.

## Operating Context

A solo, unhurried moment: pick a tea, then move through a multi-step guided
brew ritual (warm teaware → measure leaves → rinse → steep(s) → pour &
enjoy), with real dead time during each timed steep. Historically the
ritual lived in a small modal reached from a chat-first home screen. This
session's direction flips that: the guided companion (visual + narrated
instruction) is the first thing seen on load, and takes over the full
screen once brewing starts. Chat and the tea knowledge-base move behind a
one-tap toggle rather than being the default view.

## Capabilities and Constraints

- Tea catalogue combobox (58 teas); animated SVG brew cup (`BrewCup.tsx`)
  tinted by tea category; per-step guided timer (fixed timings — Tea Chapter tea bags are pre-portioned, so no tuning UI)
  ; six-axis flavour-profile chart; streaming chat via the Anthropic
  API (server-side key only).
- Spoken step narration via ElevenLabs (server-side key only). The
  configured account is currently on ElevenLabs' free tier, which blocks
  all text-to-speech API calls outright — narration silently stays off
  until the account is upgraded to a paid tier; the app must keep degrading
  gracefully rather than erroring when that's the case.
- Narration voice: a Singaporean-accented ElevenLabs voice ("iHoo — Calm,
  Warm & Friendly") has been chosen specifically to match the real
  Singapore teahouse this app is grounded in.
- No brand imagery, logo, or photography exists in the repo (`public/` is
  empty) and none is coming. The visual world must be built entirely from
  illustration (SVG), typography, color, and motion — extending the spirit
  of the existing animated cup — never photography or fabricated assets.
- An in-progress brew persists across a page refresh (localStorage) and a
  tea switch mid-steep asks for confirmation before discarding it — both
  are load-bearing product behavior, not incidental implementation detail.

## Brand Commitments

Name: "茶渊 · The Tea Companion" (header shows "茶渊 · Tea Chapter"). Display
type stays IM Fell English (serif, Western display) paired with Noto Serif
SC (CJK) — carried forward through the visual redesign below. Established
tone: calm, unhurried, mindful, and explicitly non-spiritual-jargon — the
chat system prompt already instructs sensory grounding (colour, aroma,
warmth, taste) over abstraction.

The app's visual world was replaced in this pass, deliberately, not
preserved: see `DESIGN.md` ("The Instrument Tray") for the full system. In
short — the earlier cream-paper, gold-serif "heritage zen" look is gone;
the app now stages every screen as a gongfu tea tool tray (wet stone,
zisha clay, bamboo, brass) on a near-black ground, with the tray/companion
as the main feature and chat demoted to an on-demand drawer. Any future
visual work should treat *this* system as the committed brand, not the
cream-paper one — DESIGN.md, not this file, owns those details.

## Evidence on Hand

`README.md` documents the product rationale and architecture in detail.
Tea Chapter's real-world facts (founded 1989, Queen Elizabeth II's 1989
visit, three seating rooms, 9 Neil Road Chinatown) live in
`src/lib/knowledgeBase.ts` — treat these as real and do not embellish beyond
what's recorded there. No photography, logo files, or other brand assets
exist in the repo; never fabricate or imply their existence.

## Product Principles

1. The ritual is the product — brewing is something to notice, not wait out.
2. Specific beats generic — every fact and voice choice traces back to Tea
   Chapter itself, never invented tea lore.
3. Mindful, not mystical — sensory and practical, never spiritual jargon.
4. Protect the session in progress — a running brew is treated as something
   real to interrupt, not disposable UI state.
5. The companion (visual + voice) is the primary interface now; chat is a
   secondary tool reachable on demand, not the default view.

## Accessibility & Inclusion

No formal standard has been mandated. Existing code already carries ARIA
roles/labels on the combobox, live regions on alerts, etc. — preserve this
level of care; no additional requirement established beyond it.
