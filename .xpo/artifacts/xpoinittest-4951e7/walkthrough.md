## What was built

An arcade-style attract screen: an AI plays COLORBLOXX in the background while high scores and "Press Enter to Play" overlay the board.

## How the pieces fit together

- **`src/hooks/useAttractMode.ts`** — a self-contained hook with its own board/player state. Uses a 3-phase animation state machine: `plan` (evaluate all rotation×column placements using a scoring heuristic), `moveRotate` (visibly rotate and slide the piece one step per tick), `drop` (fall one row per tick until landing). On lock, clears lines and spawns a new piece. On board-full, resets. The heuristic scores placements by: `linesCleared*100 - holes*40 - aggregateHeight*2 - bumpiness*3`.

- **`src/App.tsx`** — when `gameState === "idle"`, passes `attract.board` and `attract.player` to GameCanvas instead of the game's state. An Enter key listener (via `useEffect`) starts the game from idle. The start overlay shows high scores at the top and "Press Enter to Play" text positioned at 45% from top.

- **`src/App.css`** — `.start-overlay` uses a CSS grid with a gradient from fully opaque black at top to 30% at bottom, letting the AI demo show through. `.press-enter` is absolutely positioned with a glow-only pulse animation (no opacity change).

## Key decisions

- **AI heuristic over random play** — random placement looks incompetent and makes the game look bad. The simple heuristic (holes, height, bumpiness, line clears) plays well enough to impress without being perfect.
- **Step-by-step animation** — the AI doesn't instantly place pieces. It visibly rotates, moves, and drops one step per 80ms tick, so viewers can follow the action.
- **Enter key instead of button** — more arcade-authentic. The pulsing text is a classic attract screen element.