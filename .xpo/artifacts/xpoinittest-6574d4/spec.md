## What

Track score and level, award points on line clears, increase gravity speed every 1000 points, and display score/level on screen.

## Why

Scoring gives the game an objective. Speed progression creates tension and challenge over time.

## Acceptance Criteria

- Score starts at 0, displayed on screen
- Points awarded on line clear: 1=50, 2=100, 3=200, 4=500
- Level starts at 1, increases every 1000 points
- Gravity interval decreases each level: `800 - (level - 1) * 75` ms, floored at 100ms
- Level displayed on screen
- Score and level reset on new game

## Flow

1. Add `score` and `level` state to `useGameLoop`
2. After `clearLines`, if `linesCleared > 0`, compute points from scoring table and add to score
3. Derive level from score: `Math.floor(score / 1000) + 1`
4. Gravity interval uses level: `Math.max(100, 800 - (level - 1) * 75)`
5. Display score and level in `App.tsx` beside the board
6. Style the score/level panel to match the retro aesthetic
7. Reset score on `startGame()`

## Decisions

- **Level derived from score, not stored separately** — avoids sync issues. `floor(score / 1000) + 1` is deterministic.
- **75ms reduction per level** — at level 1: 800ms, level 5: 500ms, level 10: 125ms, level 11+: 100ms floor. Smooth ramp.
- **Score panel beside the board** — keeps the board centered, info to the side. On narrow screens it can stack above/below.