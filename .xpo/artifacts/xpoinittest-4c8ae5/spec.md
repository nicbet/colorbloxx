## What

Replace the table-based leaderboard with a retro arcade-style high score list. No dates, just rank + initials + score in a monospace neon-styled display with gold/silver/bronze for the top 3.

## Why

The current table with dates looks like a spreadsheet, not an arcade cabinet. A stylized display matches the 1980s neon aesthetic.

## Acceptance Criteria

- Remove date from display (can keep in storage for future use, but don't show it)
- Each row: rank number, initials, score — all monospace, fixed-width aligned
- Top 3 ranks in distinct colors: gold (#FFD700), silver (#C0C0C0), bronze (#CD7F32)
- Remaining ranks in a dimmer color
- Scores zero-padded or dot-separated for consistent width
- Highlighted entry (just-submitted) still visually distinct
- Works in both the start overlay and game-over overlay

## Flow

1. Update `src/components/Leaderboard.tsx` — replace table with styled divs/spans
2. Update `src/App.css` — replace `.leaderboard` table styles with new arcade-style rules
3. Optionally add a "HIGH SCORES" header in the arcade style

## Decisions

- **Keep date in storage** — no reason to break the data model; just don't render it.
- **Zero-padded scores** — pad to 7 digits (max 9,999,999) for clean alignment. E.g., `0000500`.
- **Monospace font** — `ui-monospace, Consolas, monospace` for alignment.