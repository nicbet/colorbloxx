## What

Add L and J tetrominoes to `pieces.ts`. Both are 3x3 matrices with 4 rotation states.

## Why

The original spec listed 4 pieces but missed the L/J pair. Without them the game lacks variety — L and J are essential for filling corners and creating flat surfaces.

## Acceptance Criteria

- L-piece (orange) and J-piece (blue) added with all 4 rotation states
- Both appear in random selection
- Existing rotation/wall-kick logic works without changes (3x3 matrix like Z and T)

## Flow

1. Add `L` and `J` constants to `src/game/pieces.ts` with 4 rotation states each
2. Add both to the `TETROMINOES` array

## Piece Definitions

**L-piece** (orange `#f0a000`):
```
Rot 0:    Rot 1:    Rot 2:    Rot 3:
. X .     . X X     . . .     X . .
. X .     . X .     . X .     . X .
. X X     . X .     X X .     X X .
```

**J-piece** (blue `#0000f0`):
```
Rot 0:    Rot 1:    Rot 2:    Rot 3:
. X .     . X .     . . .     X X .
. X .     . X .     . X .     . X .
X X .     . X X     . X X     . X .
```

## Assumptions

- No other code changes needed — rotation, collision, rendering, and wall kicks all operate on the shape matrices generically.