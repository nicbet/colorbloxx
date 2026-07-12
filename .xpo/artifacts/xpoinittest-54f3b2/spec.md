## What

Restructure the layout to a three-column design:
- **Left aside:** High scores leaderboard
- **Center column:** Title, game board (with start/gameover overlays), controls instructions
- **Right aside:** Next piece preview (placeholder for now), Score, Level

This keeps the board and start button centered while giving supplemental info symmetrical side panels.

## Why

Currently the side panel (score/level) shifts the board off-center. The leaderboard on the start overlay clutters the board area. A symmetric three-column layout solves both issues.

## Acceptance Criteria

- Title centered above the board
- Board centered in the viewport with start/gameover overlays staying centered on it
- Left aside shows the high scores leaderboard (always visible during gameplay, not just on overlays)
- Right aside shows Score and Level (and later Next piece)
- Instructions centered below the board
- Layout is visually balanced/symmetric
- Start overlay no longer contains the leaderboard (it moves to the left aside)
- Responsive: on narrow screens the asides can stack or hide gracefully

## Flow

1. Restructure `App.tsx` layout:
   - Outer: `.game-container` (column, centered) with title on top
   - Middle: `.game-layout` (3-column flex row): left aside, board-wrapper, right aside
   - Bottom: instructions
2. Move leaderboard from start overlay to left aside (always visible when scores exist)
3. Update `App.css` for the 3-column layout with matching aside widths
4. Remove leaderboard from GameOver component's submitted state (it's already visible in the aside)

## Decisions

- **Asides match width** — both sides same `min-width` to keep the board truly centered.
- **Leaderboard always visible** — no need to toggle it; it's small and informative during gameplay.
- **GameOver still shows leaderboard** — since the overlay covers the left aside, the gameover submitted state should keep showing it.