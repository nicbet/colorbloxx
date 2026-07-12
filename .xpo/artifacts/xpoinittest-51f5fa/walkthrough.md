## What was built

Screen shake on the canvas for line clears, scaled by the number of lines cleared.

## How the pieces fit together

- **`src/components/GameCanvas.tsx`** — `ShakeHandle` interface with a `trigger(intensity)` method. `shakeIntensity` ref holds current shake strength. The `shakeRef` prop lets the game loop register a handle. In the rAF loop, when intensity > 0.5, a random x/y offset is applied via `canvas.style.transform` and intensity decays by 0.85x per frame. Below threshold it resets to zero.

- **`src/hooks/useGameLoop.ts`** — `shakeRef` holds the handle. In `lockAndScore`, after creating a line clear effect, triggers shake with intensity scaled by line count: 1→2px, 2→4px, 3→6px, 4→8px. Hard drop does NOT shake (removed per user feedback).

- **`src/App.tsx`** — passes `shakeRef` to GameCanvas when playing.

## Key decisions

- **CSS transform over canvas translate** — doesn't affect the canvas coordinate system, so all drawing code stays unchanged.
- **No hard drop shake** — initially included but removed because it discouraged players from using hard drop. Shake is reserved for line clear celebrations where it adds to the reward feeling.
- **`Math.max` on trigger** — if a new shake fires while one is active, it takes the higher intensity rather than replacing it.