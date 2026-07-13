# Walkthrough: Centering the "Press Enter to Play" prompt

## What was built
The attract-screen prompt `PRESS ENTER TO PLAY` (rendered by `<p class="press-enter">` in `src/App.tsx`) now sits horizontally centered over the game board, on a single line, with comfortable side margins. Previously it was pinned to the board's left edge and wrapped to two lines.

## Why it was broken
`.press-enter` is `position: absolute`, living inside `.start-overlay` — a CSS grid with `justify-items: center`. That's the trap: grid alignment properties only position **in-flow** grid items. An absolutely-positioned child is removed from grid flow, so `justify-items` never applies to it. With both `left` and `right` left at `auto`, the browser falls back to the element's static position, which resolves to the containing block's left content edge. Hence: hard against the left.

This was latent from the moment the attract screen was introduced (commit `9172c1d`); it only became visible once the surrounding 3-column layout and leaderboard filled the space around it.

## How the fix works
Two independent concerns, two independent changes — both in the `.press-enter` rule in `src/App.css`:

1. **Centering.** The canonical abspos-centering idiom:
   ```css
   left: 50%;
   transform: translateX(-50%);
   ```
   `left: 50%` puts the element's left edge at the board's horizontal midpoint; `translateX(-50%)` pulls it back by half of *its own* width. Because the offset is relative to the element's width (not the parent's), it stays centered no matter how wide the text renders. `white-space: nowrap` and `text-align: center` keep it a single centered line.

2. **Side margins.** After centering, the text was still as wide as the board and touching both edges. The clean move was **not** padding — the element has no background or border, so padding would add no visible gap. Instead the text's intrinsic width was trimmed: `font-size` 20→18px and `letter-spacing` 4→3px. That leaves ~18px of clearance on each side while keeping it on one line.

## Non-obvious things for future readers
- Don't "fix" this by adding `padding` to `.press-enter` expecting side margin — with no background it does nothing visible. Margin here comes from making the text narrower than its container.
- The centering is width-independent by design. If the copy ever changes length (e.g. "PRESS START"), it stays centered automatically; only the side-clearance (font-size/letter-spacing) would need re-checking against the board width.
- Verified by driving the running app in headless Chromium and screenshotting the attract screen — not just by inspecting CSS.
