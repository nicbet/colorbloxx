## What was built

A React + TypeScript project scaffolded with Vite and bun, providing the foundation for a browser-based COLORBLOXX game. The app renders an HTML5 Canvas grid (10x20) with a retro-styled UI.

## How the pieces fit together

- **`index.html`** — Vite entry point, mounts `#root`
- **`src/main.tsx`** — React root render into `#root`
- **`src/App.tsx`** — Top-level layout: neon title, canvas, and control instructions
- **`src/App.css`** — Retro styling: per-letter neon glow colors, keyboard key icons, pulsing hint
- **`src/components/GameCanvas.tsx`** — Acquires a `<canvas>` ref, draws the 10x20 empty grid with cell borders using Canvas 2D API
- **`src/game/constants.ts`** — Shared constants: `COLS=10`, `ROWS=20`, `CELL_SIZE=30`, derived `BOARD_WIDTH` and `BOARD_HEIGHT`
- **`src/hooks/`** — Empty directory, reserved for `useGameLoop` and `useKeyboard` hooks in later stories

## Key decisions

- **HTML5 Canvas over a game framework** — COLORBLOXX is a grid of colored rectangles. `fillRect`/`strokeRect` is all that's needed; adding PixiJS or Phaser would bring ~200KB+ for no benefit.
- **30px cell size** — Board renders at 300x600px. Large enough to play comfortably without scrolling on most screens.
- **Dark theme only** — A game doesn't need light mode. The `#1a1a2e` background suits the retro neon aesthetic.
- **No flicker animation on title** — Initially added a neon flicker effect but removed it per user feedback (distracting). The static glow with per-letter rainbow colors was kept.