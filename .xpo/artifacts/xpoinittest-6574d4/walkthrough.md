## What was built

Point scoring on line clears, level progression, and speed ramp with a side panel UI.

## How the pieces fit together

- **`src/hooks/useGameLoop.ts`** — `score` is React state, `level` is derived: `floor(score / 1000) + 1`. A `SCORE_TABLE` maps lines cleared to points (1→50, 2→100, 3→200, 4→500). `lockAndScore(board, player)` handles lock → clearLines → score update → spawn, shared by both `lock()` and `hardDrop()`. The gravity effect uses `gravityInterval(level)` which computes `max(100, 800 - (level-1) * 75)`, and depends on `level` so it recreates the interval when the level changes. `startGame()` resets score to 0.

- **`src/App.tsx`** — wraps board and side panel in `.game-layout` (flexbox row). Side panel shows Score (with `toLocaleString()` for comma formatting) and Level.

- **`src/App.css`** — `.game-layout` is a flex row with 24px gap. `.side-panel` stacks stat boxes vertically. `.stat` has a dark background, bordered box with uppercase label and neon-green value matching the start button aesthetic.

## Key decisions

- **Level derived, not stored** — `floor(score / 1000) + 1` avoids sync issues between score and level state.
- **`lockAndScore` extracted** — both gravity-lock and hard-drop need the same lock→clear→score→spawn sequence. Sharing it eliminates duplication and ensures consistent scoring.