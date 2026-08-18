# 茶渊 · Tea Companion

A Next.js (App Router + TypeScript) port of the original single-file
`tea_companion.html` app — a mindful brewing companion for Tea Chapter's
teas, with an AI chat guide and a guided step-by-step brew timer.

## What changed from the static HTML version

- **Structure**: split into React components (`src/components`) and data/
  logic modules (`src/lib`) instead of one big `<script>` block.
- **Knowledge base**: the embedded tea catalogue now lives in
  `src/lib/knowledgeBase.ts` (typed) and `src/lib/teaOptions.ts` (the
  dropdown list), generated from the original data.
- **API key handling**: the original page either called
  `api.anthropic.com` directly from the browser (exposing your API key) or
  pointed at an external Render proxy (`PROXY_URL`). This port replaces
  both with a same-origin API route, [`src/app/api/chat/route.ts`](src/app/api/chat/route.ts),
  which holds the Anthropic key server-side only.
- Everything else — the tea selector, quick prompts, chat UI, and the
  guided brew timer (with its floating mini-timer) — is a behavioral
  1:1 port of the original vanilla JS.

## Setup

```bash
npm install
cp .env.local.example .env.local
# then edit .env.local and set ANTHROPIC_API_KEY
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project layout

```
src/
  app/
    api/chat/route.ts   # server-side proxy to the Anthropic Messages API
    layout.tsx           # fonts + metadata
    page.tsx              # renders <TeaCompanion />
    globals.css           # ported 1:1 from the original <style> block
  components/
    TeaCompanion.tsx      # top-level state + layout
    ChatArea.tsx           # message list, welcome state, typing indicator
    BrewModal.tsx           # guided brew timer modal
    BrewMini.tsx            # floating mini-timer (shown when modal is closed)
  lib/
    knowledgeBase.ts       # Tea Chapter catalogue (typed)
    teaOptions.ts            # <select> options for the tea dropdown
    teaBrewing.ts             # KB lookup, system-prompt builder, brew-step parser
    formatText.ts              # lightweight markdown -> HTML for chat bubbles
    playBeep.ts                  # WebAudio chime on timer completion
    types.ts
```
