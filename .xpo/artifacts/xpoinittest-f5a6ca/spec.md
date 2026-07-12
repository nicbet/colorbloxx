## What

Render a ghost/shadow of the active piece at its hard-drop landing position. The ghost shows where the piece would end up if the player presses space, helping with placement accuracy.

## Why

Ghost pieces are standard in modern COLORBLOXX. Without them players have to mentally project where a piece will land, which is especially hard at higher speeds.

## Acceptance Criteria

- Ghost rendered at the lowest valid Y position for the current piece
- Ghost uses the piece's color at ~30% opacity (no bevel, just flat fill)
- Ghost updates instantly on move, rotate, or gravity tick (free via rAF loop)
- Ghost is purely visual — no impact on collision or game logic
- Ghost is hidden when the piece is already at the landing position (no overlap flicker)

## Flow

1. Add a `getGhostY(board, player)` function to compute the lowest valid Y
2. In `GameCanvas.tsx`, add a `drawGhost()` function that draws the piece shape at ghost Y with reduced opacity
3. Call `drawGhost()` between `drawBoard()` and `drawPlayer()` in the render loop

## Decisions

- **Flat fill, no bevel** — the ghost should be subtle, not compete visually with the active piece. A simple semi-transparent fill is enough.
- **Computed in the render loop** — since the canvas reads from refs via rAF, the ghost position is recomputed every frame. No need to store it in state.
- **Drawn between board and player** — ghost renders on top of the grid but under the active piece, so the real piece always takes visual priority.