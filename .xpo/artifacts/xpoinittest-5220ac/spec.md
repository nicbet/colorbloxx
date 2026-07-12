## What

Add a game state machine so the game doesn't start until the player clicks a START GAME button. On load, the board is empty, no pieces fall, and keyboard controls are inactive. A prominent retro-styled button overlays the board.

## Why

Currently the game auto-starts on mount — pieces fall immediately before the player is ready. A start screen gives the player control over when to begin and sets the stage for the game-over/restart flow later.

## Acceptance Criteria

- On load, board is empty, no pieces, no gravity
- A large START GAME button is displayed, centered over or near the board
- Clicking the button starts the game (spawns first piece, starts gravity, enables keyboard)
- The button fits the retro neon aesthetic (matches the title style)
- The "Press START to play" hint updates or disappears once the game is running

## Flow

1. Add a `gameState` to `useGameLoop`: `"idle" | "playing"`
   - `idle`: no player, no gravity interval, keyboard actions are no-ops
   - `playing`: current behavior
2. Export a `startGame()` action from `useGameLoop` that transitions from idle to playing
3. Update `App.tsx`:
   - Show START GAME button when `gameState === "idle"`
   - Hide the "Press START to play" hint when playing
   - Pass `gameState` to `useKeyboard` so it ignores input when idle
4. Style the button in `App.css` with the retro neon look

## Decisions

- **Overlay on the board, not a separate screen** — the empty grid is a nice backdrop for the button. No need for a whole different view.
- **State in the game loop hook, not App** — keeps game state centralized; App just renders based on it.
- **No "paused" state yet** — just idle and playing for now. Pause can be added later if needed.