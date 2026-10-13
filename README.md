# 茶渊 · The Tea Companion

A guided, spoken tea-brewing companion for **Tea Chapter** (9 Neil Road,
Chinatown), Singapore's oldest traditional Chinese teahouse, founded in 1989.

**Live site:** <https://tea-companion-ai.vercel.app/>

It's for someone brewing Tea Chapter tea at home. The aim is to make the few
minutes of a steep something you pay attention to instead of something you
wait through. It isn't a tea encyclopedia chatbot and it isn't a bare timer.

## Features

- **Guided brew ritual.** Pick one of the ~58 teas in the catalogue and you're
  walked through each step in order: warm the teaware, add the tea, rinse,
  then each timed steep, and finally pour. Every step has an animated
  illustration. A chime plays when a timer finishes.
- **Matched to your setup.** Before you start, it asks which teaware you have
  (a full gaiwan set or a portable filter-teapot set) and whether you're using
  loose leaves or a tea bag. The steps, the illustrations and the checklist of
  what you'll need all follow from those two answers.
- **Spoken guidance.** A calm Singaporean narrator (ElevenLabs) reads each
  step aloud. It works in English and Chinese (中文).
- **Ambient music.** Optional soft music generated live in the browser with
  the Web Audio API, so the app ships no audio files. It gets quieter while
  the narrator is speaking.
- **Something to do while it steeps.** During each steep you can tap a
  prompt: a mindfulness question, the tea's history, a fun fact, or its
  health benefits.
- **A chat companion that knows the teahouse.** Claude answers questions from
  Tea Chapter's own catalogue and history, and steers you toward colour,
  aroma, warmth and taste instead of spiritual jargon. You can type or
  dictate questions, and replies are read aloud as they stream in.
- **Flavour profile and liquor colour.** A six-axis chart shows each tea's
  body, sweetness, floral notes, earthiness, astringency and brightness. The
  scene is tinted to match the colour of the brewed tea.
- **Your brew is protected.** A brew in progress survives a page refresh. The
  screen stays on while you brew. Switching teas partway through a steep asks
  you to confirm first.
- **First-visit tour.** New visitors are offered a short spotlight
  walkthrough.

## Setup

```bash
npm install
cp .env.local.example .env.local
npm run dev
```

Then open <http://localhost:3000>. Set these in `.env.local`:

| Variable | Required | Purpose |
| --- | --- | --- |
| `ANTHROPIC_API_KEY` | Yes | Chat companion |
| `ANTHROPIC_MODEL` | No | Override the default Claude model |
| `ELEVENLABS_API_KEY` | No | Spoken narration. Without it, the app runs silently. |
| `ELEVENLABS_VOICE_ID` | No | Override the default voice. The default needs a paid ElevenLabs plan; on the free tier, use a premade voice. |

Both keys are used only on the server, in the API routes. The browser never
receives them.

## Architecture

The app is built with Next.js 16 (App Router), React 19 and TypeScript, and
has no other runtime dependencies.

```
src/
  app/
    api/chat/route.ts     streaming proxy to the Anthropic Messages API
    api/narrate/route.ts  proxy to ElevenLabs text-to-speech
  components/
    TeaCompanion.tsx      top-level state, home screen, steep prompts
    BrewModal.tsx         guided brew ritual (steps, timer, teaware checklist)
    BrewScene.tsx         animated per-step SVG scene
    TrayScene.tsx         home-screen tea tray illustration
    BrewMini.tsx          floating mini-timer when the ritual is minimised
    ChatDock.tsx          Guide/Chat switch, voice and music controls
    ChatArea.tsx          chat messages and dictation input
    TeaProfileChart.tsx   six-axis flavour chart
    Tour.tsx              first-visit welcome and spotlight tour
  lib/
    knowledgeBase.ts      Tea Chapter catalogue and business facts
    teaBrewing.ts         tea lookup, system prompt, brew-step parser
    teaware.ts            teaware sets and what each one needs
    brewCues.ts           step instructions in English and Chinese
    teaVisuals.ts         liquor colour and flavour-profile derivation
    useNarration.ts       narration hook (guide and chat-reply lanes)
    useAmbient.ts         Web Audio ambient music
    useWakeLock.ts        keeps the screen on while brewing
```

`PRODUCT.md` covers the product principles. `DESIGN.md` covers the visual
system, called "The Instrument Tray".
