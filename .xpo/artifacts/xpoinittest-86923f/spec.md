## What

Bootstrap a React application using Vite and set up HTML5 Canvas as the 2D rendering layer for the COLORBLOXX game. No external game framework — Canvas API is sufficient for a tile-based game like COLORBLOXX and avoids unnecessary dependency weight.

## Why

This is the foundation story for the Browser COLORBLOXX epic. Every subsequent story depends on the project structure, build tooling, and rendering approach chosen here.

## Acceptance Criteria

- React + TypeScript app created via Vite
- Dev server runs with hot reload (`npm run dev`)
- HTML5 Canvas element renders inside a React component
- Basic project structure in place:
  - `src/components/` — React UI components
  - `src/game/` — game logic (board, pieces, collision, scoring)
  - `src/hooks/` — custom React hooks (game loop, keyboard input)
- A placeholder canvas renders on screen (confirms rendering pipeline works)

## Flow

1. Scaffold with `npm create vite@latest . -- --template react-ts`
2. Clean out default boilerplate (App.css demo content, assets)
3. Create directory structure: `src/components/`, `src/game/`, `src/hooks/`
4. Create `src/components/GameCanvas.tsx` — a React component that renders a `<canvas>` element and acquires a 2D context via `useRef`
5. Mount `GameCanvas` in `App.tsx`
6. Verify dev server starts and canvas renders

## Decisions

- **Vite, not CRA** — CRA is deprecated; Vite is the current standard for React projects. Fast HMR, minimal config.
- **HTML5 Canvas, not a game framework (PixiJS, Phaser)** — COLORBLOXX is a grid of colored rectangles. Canvas `fillRect` is all we need. A framework would add ~200KB+ of bundle for no benefit.
- **TypeScript** — type safety for game state (board grid, piece definitions, collision logic) prevents a class of bugs cheaply.

## Assumptions

- Node.js and npm are available on the system
- No SSR or routing needed — single-page game