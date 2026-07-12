## What

Full-page celebration effects for 3+ line clears. Firework particles burst across the entire viewport, not just the game canvas. The canvas already has its own line clear animations — this adds a page-level overlay on top.

## Why

Big clears should feel like an event. Confining the celebration to the small canvas undersells the achievement. Full-page fireworks make 3-4 line clears feel epic.

## Acceptance Criteria

- 3-line clear: burst of colored sparks across the page
- 4-line clear (COLORBLOXX!): multiple firework bursts, more particles, longer duration
- Particles render on a full-viewport canvas overlay (pointer-events: none)
- Fireworks burst upward and outward, trail with gravity
- Effects fade out naturally (~1-1.5 seconds)
- Does not block gameplay or UI interaction
- Works alongside existing canvas line clear effects

## Flow

1. Create `src/components/Fireworks.tsx`:
   - Full-viewport canvas overlay, absolutely positioned, pointer-events: none
   - Manages its own rAF loop
   - Exposes a `trigger(intensity)` method via a ref
   - Intensity 1 = small burst (3 lines), intensity 2 = big celebration (4 lines)
   - Firework particles: burst from random positions, arc upward, scatter with gravity, fade by life
   - Uses bright neon colors matching the game palette
2. Add Fireworks component to `App.tsx`
3. Trigger from `useGameLoop` on 3+ line clears

## Decisions

- **Separate overlay canvas, not DOM particles** — canvas is performant for hundreds of particles, DOM elements would be sluggish.
- **pointer-events: none** — the overlay doesn't capture clicks or interfere with game input.
- **Separate from the game canvas effects** — the game canvas effects (flash, lightning) are board-local. Fireworks are page-level. Different concerns, different components.