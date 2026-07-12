## What was built

A data-driven rendering pipeline: the board is a 2D array, the canvas draws whatever is in it.

## How the pieces fit together

- **`src/game/board.ts`** — `Board` is a `ROWS x COLS` array of `string | 0`. `createBoard()` returns an empty board (all zeros). The string value is a CSS color, so when a piece locks, its color is stored directly in the cell.
- **`src/components/GameCanvas.tsx`** — accepts `board` as a prop. On every change:
  - `drawBoard()` clears the canvas, iterates every cell
  - Empty cells get a subtle `#1a1a3e` grid line
  - Filled cells call `drawCell()` which paints the base color, then overlays two trapezoid shapes for a beveled 3D effect (lighter top-left, darker bottom-right) — the classic COLORBLOXX tile look
- **`src/App.tsx`** — owns `board` via `useState(createBoard)` and passes it down. Future stories will add a game loop hook that updates this state.

## Key decisions

- **`string | 0` over an enum** — storing the color directly means the renderer doesn't need a color lookup table. Zero is falsy, which makes empty-cell checks trivial.
- **Bevel via trapezoid overlays** — two `beginPath` shapes with semi-transparent white and black. No sprites, no images, pure Canvas 2D. Looks retro and renders fast.
- **`useEffect` dependency on `board`** — redraws only when board state changes. For the game loop, this will be triggered by setting new board state on each tick.