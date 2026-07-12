## What was built

Full-page particle celebrations for all line clear tiers, rendered on a viewport-sized canvas overlay.

## How the pieces fit together

- **`src/components/Fireworks.tsx`** — a `forwardRef` component exposing a `FireworksHandle` with `trigger(lines)`. Three particle generators:
  - `createSparkles(count)` — particles spawning across the lower screen, drifting upward with slight horizontal wander
  - `createStreaks(count)` — particles shooting upward at varied angles from the lower screen
  - `createBurst(x, y, count)` — radial explosion from a point, particles spread evenly with slight randomness
  
  Each tier composes these generators at different counts. The overlay canvas is `position: fixed; pointer-events: none; z-index: 1000` so it floats above everything without blocking input. Canvas is sized once on trigger (not per-frame). The rAF loop runs only while particles are alive — it starts on trigger and self-terminates when all particles expire. Particles are simple `fillRect` squares (no arcs, no shadowBlur) for performance.

- **`src/hooks/useGameLoop.ts`** — `fireworksRef` holds the handle. `lockAndScore` calls `fireworksRef.current?.trigger(linesCleared)` for every line clear.

- **`src/App.tsx`** — renders `<Fireworks ref={fireworksRef} />` at the bottom of the component tree.

## Key decisions

- **`fillRect` over `arc` + `shadowBlur`** — `shadowBlur` is GPU-composited per-element and tanks FPS with many particles. Simple square pixels look retro and render fast.
- **Canvas sized once, not per-frame** — setting `canvas.width`/`canvas.height` resets the entire canvas state and is expensive at viewport size. Size on trigger, `clearRect` per frame.
- **Conservative particle counts** — reduced from initial design (300+ total for 4-line) to ~100 total. Still visually impactful without FPS drops.
- **Self-terminating rAF loop** — the fireworks loop only runs while particles are alive. No idle overhead when no celebration is active.