## What was built

Two looping 8-bit chiptune soundtracks generated via Web Audio API, with a music engine that handles browser autoplay restrictions and tempo scaling.

## How the pieces fit together

- **`src/game/music.ts`** — `MusicEngine` singleton manages an AudioContext with a master gain node (0.04 volume). Songs are defined as arrays of `[frequency, beats]` tuples for melody (square wave) and bass (triangle wave) tracks. The engine uses a schedule-ahead pattern: a `setTimeout` loop running every 50ms looks 200ms ahead and schedules oscillator notes via `scheduleNote()`. Each note gets an envelope (sustain then exponential decay).

  **Attract theme:** Original bright C major arpeggiated melody at 150 BPM with pulsing octave bass.

  **Gameplay theme:** Grieg's "In the Hall of the Mountain King" — the creeping A-B-C-D ascending motif, E-C-E three-note figures, Eb/D variations, resolving to A via the Ab-E-Ab-E figure. First pass resolves up (A5), second down (A4). Bass pulses on A minor roots. Tempo starts at 130 BPM, increases 8 BPM per level, caps at 220.

  **Autoplay handling:** `startLoop` always sets `pendingTrack` and `playing = true`. If the AudioContext is not suspended, scheduling begins immediately. If suspended (no user interaction yet), the track waits. `init()` calls `ctx.resume()` and on resolution starts scheduling the pending track. A one-time click/keydown listener in App calls `init()`.

- **`src/App.tsx`** — `useEffect` on `gameState` starts attract music on idle, game music on playing, stops on gameover. A separate effect updates tempo on level change. A one-time effect registers click/keydown listeners that call `music.init()` then remove themselves.

## Key decisions

- **Schedule-ahead pattern** — scheduling notes ~200ms ahead prevents gaps from setTimeout jitter. The scheduler runs every 50ms, well within the look-ahead window.
- **Separate `muteMusic` flag** — independent from `muteSound` so players can have sfx without music or vice versa.
- **Grieg is public domain** — composed 1875, well past copyright. Safe to use the actual melody.
- **Pending track pattern** — solves the chicken-and-egg of wanting music on idle load but needing user interaction for AudioContext. The track is "armed" immediately and fires once the context unlocks.