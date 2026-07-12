## What

Up arrow rotates the current piece 90° clockwise through its pre-defined rotation states. If the rotated position collides, try a series of wall-kick offsets before giving up.

## Why

Rotation is a core COLORBLOXX mechanic. Without it the game is unplayable — the player can't fit pieces into gaps.

## Acceptance Criteria

- Up arrow rotates piece clockwise (rotation index cycles 0→1→2→3→0)
- If the rotated position is invalid, try wall-kick offsets: (±1, 0), (±2, 0) for the I-piece
- If no offset works, the rotation is rejected (piece stays in current rotation)
- O-piece has only one rotation state so it's a visual no-op
- Rotation during lock delay resets the delay if the piece is still landed, or cancels it if the piece is no longer landed

## Flow

1. Add `rotate()` to `useGameLoop.ts`:
   - Compute next rotation index: `(current + 1) % rotations.length`
   - Get the rotated shape
   - Try the rotated shape at the current position — if valid, apply
   - If not, try offsets `[(-1,0), (1,0), (-2,0), (2,0)]` — apply the first valid one
   - If none work, reject the rotation
   - If rotation succeeds and lock delay is active, reset or cancel it (same logic as `tryMove`)
2. Wire `rotate` into the keyboard hook (ArrowUp)
3. Wire `rotate` into App's actions object

## Decisions

- **Simple wall-kick table, not SRS** — the game has 4 pieces, not 7. A simple horizontal offset table is sufficient. SRS (Super Rotation System) is overkill.
- **No vertical kicks** — only horizontal offsets. Keeps the behavior predictable.
- **Clockwise only** — no counter-clockwise rotation key. Matches the original spec (mirror/space was dropped).