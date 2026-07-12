## What was built

A start screen that prevents the game from auto-starting. The board shows empty with a glowing START GAME button overlaid until the player clicks it.

## How the pieces fit together

- **`src/hooks/useGameLoop.ts`** — added `GameState` type (`"idle" | "playing"`) and a `gameStateRef` for interval closure access. In idle state: `player` is `null`, gravity interval doesn't start, and `tryMove`/`hardDrop` early-return. `startGame()` resets the board, spawns a player, and transitions to playing. The gravity `useEffect` depends on `gameState` so it only creates the interval when playing.

- **`src/hooks/useKeyboard.ts`** — now accepts `Actions | null`. When `null`, the effect returns immediately without registering any listener. The actions are destructured inside the effect to keep closure references stable.

- **`src/App.tsx`** — wraps the canvas in a `.board-wrapper` (relative positioned) so the `.start-overlay` (absolute, full-bleed) can sit on top. The overlay and hint are conditionally rendered based on `gameState`.

- **`src/App.css`** — `.start-overlay` is a semi-transparent dark backdrop. `.start-button` uses the same Impact font as the title, with a neon green glow (matching the "E" in COLORBLOXX). Hover deepens the glow. 24px horizontal padding on the overlay keeps the button away from edges.

## Key decisions

- **Overlay on the board, not a separate view** — the empty grid behind the dark overlay looks good and avoids layout shifts when transitioning to playing.
- **`player` is `null` when idle** — cleaner than a dummy player that's hidden. The canvas simply skips `drawPlayer` when player is null (already handled by the existing `if (player)` guard).