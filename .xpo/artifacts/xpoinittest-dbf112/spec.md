## What

Evolve the placeholder canvas into a proper game board with a data-driven rendering pipeline. The board state is a 2D array that the canvas draws from, so subsequent stories (pieces, locking, clearing) just mutate the array and trigger a redraw.

## Why

Story #1 drew a static grid. This story introduces the board data model and a render loop that draws it, which every subsequent story depends on.

## Acceptance Criteria

- Board state is a `ROWS x COLS` 2D array (0 = empty, string = color)
- Canvas re-renders from board state on every frame
- Empty cells draw as dark with subtle grid lines
- Filled cells draw with color, a beveled/3D look (lighter top-left edge, darker bottom-right edge) for the classic COLORBLOXX aesthetic
- Board is centered on screen with the title above and instructions below (already in place)

## Flow

1. Create `src/game/board.ts` — exports `createBoard()` returning a `ROWS x COLS` 2D array of `string | 0`
2. Update `src/components/GameCanvas.tsx`:
   - Accept board state as a prop
   - Implement `drawBoard(ctx, board)` that iterates the grid, drawing empty cells and filled cells differently
   - Filled cells get a beveled 3D look (lighten top/left edges, darken bottom/right edges)
3. Lift board state into `App.tsx` via `useState` so it can later be managed by the game loop

## Decisions

- **Board as `(string | 0)[][]`** — 0 for empty, color string for filled. Simple, no enum overhead, and the color is stored directly so pieces retain their color after locking.
- **Bevel effect on filled cells** — `fillRect` the base color, then draw lighter/darker trapezoids on edges. Gives the classic 1980s COLORBLOXX tile look without sprites or images.
- **Board state lifted to App** — The canvas is a pure renderer; game logic will live in hooks/game modules that update state, and the canvas just draws whatever it receives.

## Assumptions

- No piece rendering yet — that's story #3. This story only renders the static board grid.