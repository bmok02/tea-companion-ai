---
target: this page (src/app/page.tsx)
total_score: 22
max_score: 40
na_heuristics: 
p0_count: 1
p1_count: 3
p2_count: 1
timestamp: 2026-08-18T07-36-14Z
slug: src-app-page-tsx
---
### Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 3 | Typing dots/badge/progress bar/mini-timer all work; generic 3-dot loader wastes a branding opportunity |
| 2 | Match System / Real World | 4 | Ordinal steeps, warm-teaware ritual, mindful copy genuinely match real gongfu brewing |
| 3 | User Control and Freedom | 2 | No undo for the tea-switch reset (see P0); no way to cancel a sent message |
| 4 | Consistency and Standards | 2 | "Begin Brew Session" blocks with no tea selected; quick-prompt pills don't apply the same guard |
| 5 | Error Prevention | 1 | Typing in the free-text tea field silently wipes an in-progress timed brew, zero confirmation |
| 6 | Recognition Rather Than Recall | 3 | Persistent tea badge + step list (active/done states) reduce recall burden |
| 7 | Flexibility and Efficiency | 2 | Enter-to-send and quick prompts help; no favorites/recents in a 58-item list, no session persistence |
| 8 | Aesthetic and Minimalist Design | 3 | Restrained palette/type is strong, undercut by the flat 58-option dropdown |
| 9 | Error Recovery | 1 | API failures get a plain inline message; the more damaging silent brew-reset produces no error at all |
| 10 | Help and Documentation | 1 | No affordance explains "Begin Brew Session" before commit; no onboarding for dual tea-select/type inputs |
| **Total** | | **22/40** | **Acceptable — significant improvements needed** |

### Design Specificity Verdict

**LLM assessment**: Genuinely product-specific in copy and one strong ambient detail — a shared `--breath` motion cadence (2.6s) reused across the countdown, mini-timer dot, and "ready for next step" glow, reinforcing "mindful, unhurried" as a felt quality rather than stated copy. The brewing ritual (ordinal steeps, warm-teaware step, "notice how the flavour shifts," the done-state "Pour gently and savour 🍵") is grounded in real gongfu practice. But the chat shell itself — header, selector, pill row, scrolling bubbles, composer — is an interchangeable AI-chat template that any product could reuse unchanged; only the brew modal's step list and countdown carry the tea-specific soul. Net: a specific product wearing a generic chatbot skeleton.

**Deterministic scan**: `detect.mjs --json` on the six markup files (`page.tsx`, `layout.tsx`, `TeaCompanion.tsx`, `ChatArea.tsx`, `BrewModal.tsx`, `BrewMini.tsx`) exited 0 (clean structural scan, no anti-patterns at that layer). The live-page browser injection found **6 anti-patterns**, reproduced identically at desktop and mobile (375×812) viewports:
1. `low-contrast` 2.8:1 (need 4.5:1) — `#b5892a` on `#f5efe6`
2. `all-caps-body` — `text-transform: uppercase` on the 32-char subtitle "Brewing · Mindfulness · Heritage"
3. `low-contrast` 3.2:1 (need 4.5:1) — `#ffffff` on `#b5892a` (button text)
4. `wide-tracking` — `letter-spacing: 0.08em` on body/UI text
5. `undersized-ui-text` — 10px "Steeping" label, below the 11px floor
6. `low-contrast` 2.8:1 (need 3:1) — same gold pair evaluated at the UI-component threshold

Source cross-check confirmed every finding against `globals.css`, `TeaCompanion.tsx`, and `BrewMini.tsx` — exact color values, exact string length, exact font-size and letter-spacing all matched. **Zero false positives.** This corroborates and broadens the LLM review's own P3 note about gold-on-cream contrast: the detector shows it recurs in at least three separate places (chat-bubble emphasis, the primary CTA button, and the mini-timer/header), not one edge case.

**Visual overlays**: Browser mutation/injection succeeded (title + script-tag preflight both worked), and the detector ran live in the page via an injected `detect.js`, but the actual on-screen overlay could not be screenshotted this session ("the Browser pane is not displayed, so the page is not compositing frames"). No user-visible overlay is available in a **[Human]** tab; the findings above come from the injected script's console output, not a visual highlight.

### Overall Impression

This is a well-considered brewing companion with real craft in its motion language and copy, let down by one severe functional bug and a cluster of confirmed accessibility gaps. The single biggest opportunity: the free-text tea field silently destroying an active timed brew is the kind of defect that undoes all the mindfulness the rest of the product works hard to build — fix that first, then close the accessibility gaps the detector confirmed with zero false positives.

### What's Working

1. **The `--breath` motion vocabulary** — one shared cadence reused across the countdown, mini-timer, and ready-glow instead of several unrelated animations; a systemic decision that reinforces the product's "unhurried" identity.
2. **Context continuity without exposing internals** — every chat message secretly carries `[Currently brewing: {tea}]` to the model without ever showing that bracketed text to the user. Clean separation of what the model needs vs. what the user sees.
3. **Domain-authentic done-state and step sequence** — the warm-teaware/measure/rinse/steep flow and "Your tea is ready. Pour gently and savour. 🍵" close read as written by someone who understands gongfu brewing, not a generic step wizard.

### Priority Issues

**[P0] Free-text tea input silently destroys an in-progress timed brew, with zero warning.**
- **Why it matters**: `onTeaInputChange` calls `setCurrentTea(trimmed)` on every keystroke, and `setCurrentTea` calls `resetBrew()` whenever the value differs from the current tea — which is true of every partial keystroke. Confirmed live: started a 45s steep timer on Tie Guan Yin, closed the modal (mini-timer showing "0:43" and counting), typed a single character into the free-text field, and the mini-timer vanished instantly. This is the app's core feature destroying itself via an incidental, easily-triggered action, with no confirm dialog, no toast, no undo.
- **Fix**: Commit `setCurrentTea` on blur/submit of the free-text field rather than on every keystroke, and/or guard `resetBrew()` behind a confirmation whenever a timer is `started` and unfinished.
- **Suggested command**: `/impeccable harden`

**[P1] 58-option flat, ungrouped tea dropdown at a single decision point.**
- **Why it matters**: `teaOptions.ts` lists 58 teas with no `optgroup` by category, exceeding the ≤4-choices cognitive-load guideline by more than 10x. A first-timer with no idea what tea they're holding has no category- or scent-based way to narrow down; at mobile width (375px) the control also truncates to "Tie G▾", making the app's single most important input illegible on its majority-share viewport.
- **Fix**: Group with `optgroup` by the `category` field already present in `knowledgeBase.ts`, or replace with a searchable/typeahead combobox; give the selector a real mobile layout (stacked, not `flex-wrap`) below ~480px.
- **Suggested command**: `/impeccable layout`

**[P1] Confirmed accessibility failures: contrast, unlabeled control, all-caps, undersized text.**
- **Why it matters**: The detector's 6 findings are all true positives, confirmed against source: gold-on-cream text (`#b5892a` on `#f5efe6`, 2.8:1) is used for `<strong>` emphasis inside assistant chat bubbles — and the system prompt tells the model to "be specific" with temperatures/times, which it will very likely bold, making this a recurring failure in normal use, not an edge case. The same gold pair also fails on the primary "Begin Brew Session" button (white-on-gold, 3.2:1) and the mini-timer/header. Separately, `<label>Your tea</label>` has no `htmlFor` linking it to either the select or the text input, so screen-reader users get no accessible name on the app's most important control.
- **Fix**: Add a separate `--gold-text` token darkened for AA compliance on text-on-light use, keep the lighter gold for decorative accents; add `htmlFor="teaSelect"` (or `aria-labelledby`) to the label; bump the 10px "Steeping" label to at least 11-12px.
- **Suggested command**: `/impeccable audit`

**[P1] Inconsistent error-prevention policy between "Begin Brew Session" and the quick-prompt pills.**
- **Why it matters**: `openBrewModal()` blocks and shows a chat message when no tea is selected, but `quickPrompt()` (used by all 5 pills) has no such guard — confirmed live: clicking "How to brew" with nothing selected fired a full API round trip that ended in the assistant asking which tea to describe. This wastes latency and tokens and breaks the expectation set one row above that tea-selection is a precondition.
- **Fix**: Apply the same "select a tea first" guard to quick prompts, or drop the guard app-wide and let the assistant always ask — pick one consistent policy.
- **Suggested command**: `/impeccable clarify`

**[P2] Tea selector becomes illegible at 375px mobile width.**
- **Why it matters**: The `<select>` truncates to roughly 90px ("Tie G▾") once squeezed between the "or" divider and the tea badge — the one piece of state a user most needs to recognize becomes unreadable on the dominant real-world viewport.
- **Fix**: Stack selector, free-text input, and badge vertically below ~480px rather than relying on `flex-wrap` alone.
- **Suggested command**: `/impeccable adapt`

### Persona Red Flags

**Jordan (First-Timer)**: Lands on a 58-item unsorted dropdown with no category guidance. Their first interaction with a quick-prompt pill (before selecting a tea) can trigger a real LLM call that comes back asking them to name their tea — a confusing detour the UI could resolve directly. The "Please select a tea first" guard message is injected as an assistant chat turn, which can read as the bot being terse on a first visit.

**Riley (Stress-Tester)**: The single-keystroke brew-reset bug (P0) is exactly what a stress-tester finds in seconds — select a tea, start a timer, click into the adjacent free-text field, type one character, session gone with no error and no recovery path. Rapid switching between the select and free-text field also flickers the current-tea badge with no debounce.

**Sam (Accessibility-Dependent)**: The app's most important control (tea select/input) has no accessible name (`label` missing `htmlFor`). Gold-on-cream `<strong>` emphasis fails WCAG AA contrast inside normal chat content, not just chrome — confirmed by the detector and independently recomputed (2.79:1 and 3.19:1). On the positive side, decorative steam wisps and the breathing glyph are correctly `aria-hidden`, and `prefers-reduced-motion` stops looping cues specifically while keeping state-change animations — this persona is not uniformly badly served.

### Minor Observations

- Quick-prompt pills render at roughly 30px tall (`padding: 5px 13px`, `font-size: 13px`), under the 44px comfortable touch target, tight for a mobile user where five pills wrap into two rows.
- API error messages surface as raw text ("Something went wrong: {err.message}. Please try again.") with no retry button — the user must retype the whole question.
- `formatText.ts`'s header-stripping regex (`/^#{1,3} (.+)$/gm`) only matches `#` followed by a space, so a stray `#tag`-like model output would pass through unformatted — low risk given the system prompt discourages markdown, but worth a defensive check.
- The welcome copy's second sentence ("This companion draws from Tea Chapter's own catalogue and heritage.") is rendered at lower opacity and reads like a legal footnote rather than a second beat of the same story.

### Questions to Consider

- If the free-text tea field and the dropdown both exist to solve "what if my tea isn't listed," why do they present as two unrelated systems instead of one? What would a single searchable input that also accepts free entry look like?
- The countdown/step-list UI is meticulously tea-specific, but the surrounding chat shell is a commodity AI-chat layout — what would it mean to let the tea itself (its color, its steep count, its category) visually skin the session?
- Given that a real gongfu session runs multiple short, high-stakes timers back to back, is a modal-plus-floating-mini-timer the right model — or should the timer be the permanent primary surface during an active brew, with chat relegated to a drawer?
