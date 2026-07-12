## What

Two looping chiptune soundtracks generated via Web Audio API:
1. **Attract/idle theme** — mellow, chill loop that plays on the start screen behind the AI demo
2. **Gameplay theme** — upbeat, driving melody that plays during the game with tempo scaling by level

## Why

Music transforms the feel of the game. The attract screen needs an inviting, ambient vibe. Gameplay needs energy and tension that builds with speed.

## Acceptance Criteria

- Both tracks generated programmatically via Web Audio API (no audio files)
- Square, triangle, and sawtooth waves for authentic 8-bit NES sound
- **Attract theme:** mellow, slower tempo, loops seamlessly, plays during idle state
- **Gameplay theme:** upbeat, energetic, loops seamlessly, plays during playing state
- Gameplay tempo increases with level
- Music stops on game over (sfxGameOver plays instead)
- Music transitions cleanly between idle → playing → gameover → idle
- Mutable via `muteMusic` localStorage flag (separate from `muteSound`)
- Music resumes from the start when re-entering a state

## Flow

1. Create `src/game/music.ts`:
   - `MusicEngine` class that manages an AudioContext and scheduled oscillator notes
   - Two song definitions: attract theme and gameplay theme, each as arrays of `{note, duration}` patterns for melody + bass tracks
   - `playAttract()` / `playGame(level)` — start the respective loop
   - `stop()` — stop all music
   - `setTempo(level)` — adjust playback speed for gameplay theme
   - Checks `muteMusic` localStorage flag
2. Update `App.tsx` or `useGameLoop`:
   - Start attract music when entering idle state
   - Start gameplay music when game starts
   - Stop music on game over
   - Update tempo on level change

## Decisions

- **Separate from sfx AudioContext** — music needs its own gain node for independent volume/mute control
- **Schedule-ahead pattern** — schedule notes ~200ms ahead of playback position to avoid gaps. Use a scheduling loop with `setTimeout` that checks current time and queues upcoming notes.
- **Two distinct songs** — attract is in a minor key, slower. Gameplay is major key, faster. Clear mood shift when you press Enter.
- **`muteMusic` separate from `muteSound`** — players may want sfx but no music, or vice versa.

## Song Ideas

### Attract theme
- Key: A minor, ~100 BPM
- Dreamy arpeggiated chords, triangle wave melody, sparse bass
- 8-bar loop

### Gameplay theme
- Key: C major, ~140 BPM (base), scales up with level
- Driving bass line, square wave melody, NES-style
- 8-bar loop with a B section for variety (16 bars total)