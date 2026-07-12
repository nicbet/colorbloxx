## What

When gravity moves a piece down and it can't descend further, instead of locking immediately, start a 500ms lock delay timer. During this window the player can still move left/right (and rotate, once that story is done). If the move puts the piece back into a non-landed state (it can move down again), cancel the timer. If the timer expires, lock the piece. Hard drop always locks immediately, bypassing the delay.

## Why

Immediate locking feels punishing — the player has no time to slide a piece into a gap after it lands on a ledge. A short delay is standard in modern COLORBLOXX and makes the game significantly more playable.

## Acceptance Criteria

- Gravity landing starts a 500ms lock delay instead of locking immediately
- Player can move left/right during the delay
- If a move during the delay means the piece can now fall further, the delay cancels and gravity resumes
- If the delay expires, the piece locks and a new one spawns
- Hard drop bypasses the delay entirely (locks instantly)
- The delay timer resets on each successful move during the delay window

## Flow

1. In `useGameLoop.ts`:
   - Add a `lockDelayRef` (timeout ID) to track the pending lock timer
   - When gravity tick finds the piece can't move down: if no lock delay is active, start a 500ms timeout that calls `lock()`
   - In `tryMove`: after a successful move, check if the piece can now move down. If yes, clear `lockDelayRef`. If no (still landed), reset the timer to a fresh 500ms.
   - In `hardDrop`: clear any active lock delay before locking
   - On `lock()`: clear the lock delay ref

## Decisions

- **500ms delay** — standard modern COLORBLOXX lock delay. Long enough to be useful, short enough to keep pace.
- **Reset on move, not extend** — each move during the delay resets the full 500ms window. This is the "move reset" lock delay variant used in modern guideline COLORBLOXX.
- **No max reset count** — some implementations cap lock delay resets (e.g., 15 moves). Keeping it unlimited for simplicity; with only 4 piece types the abuse potential is low.

## Assumptions

- Rotation is not yet implemented — the delay will naturally support it once rotation is added, since rotation calls the same `tryMove`-style collision check.