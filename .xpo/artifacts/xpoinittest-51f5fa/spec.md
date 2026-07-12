## What

Add a brief screen shake to the canvas on hard drop and multi-line clears. The shake is cosmetic — CSS transform on the canvas element, no impact on game logic.

## Why

Screen shake is the easiest way to add physical weight to impacts. Hard drops feel heavy, big line clears feel explosive.

## Acceptance Criteria

- Hard drop triggers a brief vertical shake (~80ms, 3-4px)
- Line clears trigger shake scaled by count (1 line: subtle, 4 lines: strong)
- Shake is CSS transform on the canvas, does not affect collision/rendering
- Shake decays naturally (not abrupt stop)

## Flow

1. Add a `shakeRef` to GameCanvas — holds current shake intensity
2. Expose a `triggerShake(intensity)` function via a callback ref passed from the game loop
3. In `useGameLoop`, call `triggerShake` on hard drop and line clears
4. In the rAF loop, apply a random offset via `canvas.style.transform` and decay the intensity each frame

## Decisions

- **CSS transform, not canvas translate** — transform doesn't affect the canvas coordinate system, so drawing code stays unchanged.
- **Decay per frame** — multiply intensity by ~0.85 each frame for a natural ease-out. Reset to 0 when below threshold.
- **Intensity scaling** — hard drop: 3px, 1 line: 2px, 2 lines: 4px, 3 lines: 6px, 4 lines: 8px.