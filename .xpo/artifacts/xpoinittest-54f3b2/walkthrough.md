## What was built

A stable 3-column layout with the board centered and supplemental info in symmetric side panels.

## How the pieces fit together

- **`src/App.tsx`** — `.game-layout` is a 3-column flex row: `.aside-left` (Level), `.board-wrapper` (board + overlays), `.aside-right` (Score). Instructions sit below the game-layout in `.game-container`. The start overlay contains the leaderboard at top and START button at bottom via `justify-content: space-between`. The "Press START to play" hint uses `visibility: hidden/visible` instead of conditional rendering to prevent layout shift.

- **`src/App.css`** — asides have `min-width: 100px` and `flex-shrink: 0` for stable sizing. `.game-layout` uses `gap: 12px` to keep asides close to the board. `.start-content` uses `justify-content: space-between` to push leaderboard to top and button to bottom.

- **`src/components/Leaderboard.tsx`** — simplified to 3 columns (Name, Score, Date), no rank column. Headers are uniform 13px / weight 500. Name left-aligned, Score right-aligned, Date right-aligned.

## Key decisions

- **Instructions outside game-layout** — the controls bar is wider than the board; keeping it inside the center column pushed the asides away.
- **`visibility: hidden` over conditional render** — the hint text always occupies space, preventing the board from jumping when transitioning from idle to playing.