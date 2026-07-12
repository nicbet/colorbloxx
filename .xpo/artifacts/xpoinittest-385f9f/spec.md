## What is the problem

Two related issues with hard drop:

1. **Delayed rendering** — after pressing space, the piece visually stays at its current position for a frame or two before snapping to the bottom and locking. This makes it feel like the input was missed.
2. **Double hard drop** — because of the visual delay, the player presses space again. The second press hard-drops the *next* spawned piece immediately, which is not intentional.

## Why

The root cause is that `hardDrop` reads from `playerRef.current` which may be stale during the React render cycle. The state updates (`setBoard`, `setPlayer`) are batched and don't take effect until the next render. If the keyboard fires a second space before React re-renders, `playerRef.current` is already the new player (set synchronously in `lockAndScore`? — need to verify), or the timing allows a double-fire.

Additionally, the canvas only redraws when React re-renders with new state via `useEffect`. There's no immediate visual feedback on hard drop.

## How to fix

1. **Use `requestAnimationFrame` for canvas rendering** — instead of relying on `useEffect` with state dependencies, use rAF to draw every frame. This ensures the canvas is always in sync with the latest refs.
2. **Guard against double hard drop** — after a hard drop, ignore space presses for a short window, or check that the player has actually changed since the last hard drop.

## Acceptance Criteria

- Hard drop renders instantly (no visible delay)
- Pressing space twice quickly does not hard-drop the next piece
- Game feel is snappy and responsive