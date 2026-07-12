## What was built

localStorage-backed high score persistence with a leaderboard displayed on both the game-over and start screens.

## How the pieces fit together

- **`src/game/highscores.ts`** — stores scores under `"colorbloxx-highscores"` in localStorage as JSON. `getHighScores()` parses, sorts descending, and returns top 10. `saveHighScore(initials, score)` appends a new entry with today's date (ISO YYYY-MM-DD), sorts, trims to 10, saves, and returns the rank (index) of the new entry for highlighting. Both functions catch errors gracefully (corrupted data, full storage).

- **`src/components/Leaderboard.tsx`** — a reusable table showing rank, name, score, date. Accepts an optional `highlightRank` prop; matching row gets the `.highlight` class (yellow glow). Returns null if scores array is empty.

- **`src/components/GameOver.tsx`** — now a two-step flow. Initially shows the initials form with a SUBMIT button. On submit, calls `saveHighScore`, stores the returned scores and rank, and flips to `submitted` state showing the leaderboard with the new entry highlighted and a PLAY AGAIN button.

- **`src/App.tsx`** — holds `idleScores` state initialized from `getHighScores()`. On the start screen, the leaderboard renders below the START GAME button inside `.start-content`. `handlePlayAgain` refreshes `idleScores` before transitioning to idle, so newly saved scores appear on the start screen.

## Key decisions

- **Reusable Leaderboard component** — shared between GameOver and the start screen overlay. Same component, different highlight state.
- **Two-step game over** — submit first, then see leaderboard. Avoids showing the leaderboard while the player is still typing initials.
- **Rank returned from save** — `saveHighScore` returns the index so the caller can highlight without re-scanning.