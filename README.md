# 茶渊 · The Tea Companion

A mindful brewing companion built for Tea Chapter (9 Neil Road, Chinatown) —
Singapore's oldest traditional Chinese teahouse, established 1989. The goal
isn't "a chatbot that knows about tea." It's to slow someone down for the
few minutes it takes to steep a cup: to turn brewing from a thing you wait
out into a small ritual you actually notice.

## What it's trying to do

Most tea-brewing tools stop at temperature and timing. This one treats the
steep itself as the point:

- **A guided brew ritual, not just a timer.** Picking a tea and hitting
  "Begin Brew Session" walks through warming the teaware, measuring leaves,
  rinsing, and each steep in sequence — with an animated cup ([`BrewCup.tsx`](src/components/BrewCup.tsx))
  that fills and steams as the seconds count down, so there's something to
  watch instead of a bare number. A floating mini-timer ([`BrewMini.tsx`](src/components/BrewMini.tsx))
  keeps the ritual visible even after you close the modal to read something
  or chat.
- **Real dead time, used deliberately.** During an actual steep — the
  minute where there's genuinely nothing to do but wait — the modal
  surfaces four prompts: a guided mindful-session narration, the tea's
  history, a fun fact, and its health benefits (see `STEEP_PROMPTS` in
  [`TeaCompanion.tsx`](src/components/TeaCompanion.tsx)). They exist
  specifically for that gap, not as generic chat suggestions bolted onto
  the top of the screen.
- **A companion grounded in one specific place.** The AI guide isn't a
  generic tea encyclopedia — its system prompt ([`teaBrewing.ts`](src/lib/teaBrewing.ts))
  is built from Tea Chapter's own catalogue and business knowledge base
  ([`knowledgeBase.ts`](src/lib/knowledgeBase.ts)): ~58 teas with category,
  origin, aroma, taste, brewing instructions, and a `mindfulness_note` per
  tea, plus the teahouse's own history (founded 1989, visited by Queen
  Elizabeth II in 1989, its three distinct seating rooms). It's instructed
  to guide attention to sensory detail — colour, aroma, warmth, taste —
  and to keep mindfulness grounded and practical rather than reaching for
  spiritual jargon.
- **A flavour profile you can actually read.** For catalogue teas with
  enough structured data, a six-axis chart ([`TeaProfileChart.tsx`](src/components/TeaProfileChart.tsx),
  derived in [`teaVisuals.ts`](src/lib/teaVisuals.ts)) sketches body,
  sweetness, floral, earthy, astringency, and brightness — alongside a
  liquor colour theme that tints the brew cup and mini-timer to roughly
  match what's actually in the pot.
- **Protecting a brew already in progress.** Switching teas mid-steep asks
  first, rather than silently discarding a timer that's running — small,
  but it's the same instinct: the session in progress matters more than
  a fast UI shortcut.

## Setup

```bash
npm install
cp .env.local.example .env.local
# then edit .env.local and set ANTHROPIC_API_KEY
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## How it's built

A Next.js (App Router + TypeScript) port of the original single-file
`tea_companion.html` prototype, split into components and data/logic
modules instead of one big `<script>` block. The chat companion streams
its replies through a same-origin API route
([`src/app/api/chat/route.ts`](src/app/api/chat/route.ts)), which is the
only place the Anthropic API key ever lives — the browser never sees it.

```
src/
  app/
    api/chat/route.ts   # server-side streaming proxy to the Anthropic Messages API
    layout.tsx           # fonts + metadata
    page.tsx              # renders <TeaCompanion />
    globals.css           # app styling
  components/
    TeaCompanion.tsx      # top-level state + layout
    ChatArea.tsx           # message list, welcome state, typing indicator
    BrewModal.tsx           # guided brew ritual modal
    BrewMini.tsx             # floating mini-timer (shown when modal is closed)
    BrewCup.tsx               # animated filling/steaming cup
    TeaProfileChart.tsx        # six-axis flavour profile chart
  lib/
    knowledgeBase.ts       # Tea Chapter's catalogue + business info (typed)
    teaOptions.ts            # catalogue combobox options
    teaBrewing.ts             # KB lookup, system-prompt builder, brew-step parser
    teaVisuals.ts              # liquor colour + flavour profile derivation
    formatText.ts               # lightweight markdown -> HTML for chat bubbles
    playBeep.ts                  # WebAudio chime on timer completion
    types.ts
```
