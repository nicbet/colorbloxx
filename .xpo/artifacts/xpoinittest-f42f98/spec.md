## What

Save scores to localStorage when the player submits initials after game over. Display a top-10 leaderboard on the game-over screen and on the idle/start screen. Highlight the just-submitted score.

## Why

High scores give the game replayability — players compete against themselves and others on the same machine.

## Acceptance Criteria

- On game over, after submitting initials, the score is saved to localStorage
- Leaderboard shows top 10 entries: rank, initials, score, date
- Leaderboard shown on the game-over screen after submitting
- Leaderboard also visible on the start/idle screen
- The just-submitted entry is highlighted
- Scores persist across page reloads
- Graceful handling if localStorage is unavailable or corrupted

## Flow

1. Create `src/game/highscores.ts`:
   - `HighScore` type: `{ initials: string, score: number, date: string }`
   - `getHighScores(): HighScore[]` — read from localStorage, parse, return sorted top 10
   - `saveHighScore(initials, score): number` — add entry, sort, trim to 10, save, return the rank (index) of the new entry
2. Update `GameOver.tsx`:
   - After submitting initials, call `saveHighScore` and show the leaderboard
   - Highlight the new entry's rank
3. Update `App.tsx`:
   - On idle screen, show leaderboard below the start button (if any scores exist)
4. Style the leaderboard table to match the retro aesthetic

## Decisions

- **Date stored as ISO string** — `new Date().toISOString().slice(0, 10)` gives a clean YYYY-MM-DD.
- **Top 10 limit** — keeps the list scannable. Entries beyond 10 are discarded on save.
- **Leaderboard in GameOver, not a separate view** — the game-over overlay already has the right context. No need for a separate screen.
- **localStorage key: `"colorbloxx-highscores"`** — namespaced to avoid collisions.