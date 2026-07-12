## What was built

Lock delay polish and a reworked control scheme: down arrow for soft drop (accelerated gravity while held), space bar for hard drop (instant lock), and a 500ms lock delay on gravity/soft-drop landing.

## How the pieces fit together

- **`src/hooks/useGameLoop.ts`** — added `softDropping` boolean state. The gravity `useEffect` depends on it: when true, the interval runs at 50ms instead of 800ms. `startSoftDrop`/`stopSoftDrop` toggle this state. The lock delay (500ms timeout calling `lock()`) starts when gravity detects a landed piece. During the delay, `tryMove` checks if a move un-lands the piece (cancels delay) or keeps it landed (resets delay timer). Hard drop clears any active lock delay before locking.

- **`src/hooks/useKeyboard.ts`** — now listens to both `keydown` and `keyup`. ArrowDown keydown (non-repeat) calls `startSoftDrop`, keyup calls `stopSoftDrop`. Space calls `hardDrop`. The actions object is destructured eagerly in the effect so the closure captures stable references.

- **`src/App.tsx`** — passes the expanded actions set to `useKeyboard` and shows updated control instructions including Soft Drop and Hard Drop.

## Key decisions

- **50ms soft drop interval** — ~16x faster than normal gravity. Fast enough to feel like acceleration, slow enough to track visually and react to.
- **`!e.repeat` guard on soft drop** — keyboard auto-repeat would call `startSoftDrop` repeatedly, toggling the state unnecessarily. Only the initial keydown triggers it.
- **Lock delay resets on move** — the "move reset" variant used in modern guideline COLORBLOXX. Each successful move during the delay window resets the full 500ms timer.