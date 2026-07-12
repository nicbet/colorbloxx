import { useState, useEffect, useRef, useCallback } from "react";
import { createBoard, clearLines, type Board } from "../game/board";
import { type Player, getShape } from "../game/player";
import { randomTetromino } from "../game/pieces";
import { isValidPosition } from "../game/collision";
import { lockPiece } from "../game/lock";
import { COLS, ROWS } from "../game/constants";

const ATTRACT_TICK_MS = 80;

function spawnAttractPiece(): Player {
  const tetromino = randomTetromino();
  const shape = tetromino.rotations[0];
  const pieceWidth = shape[0].length;
  return {
    tetromino,
    rotationIndex: 0,
    pos: {
      x: Math.floor((COLS - pieceWidth) / 2),
      y: 0,
    },
  };
}

function countHoles(board: Board): number {
  let holes = 0;
  for (let c = 0; c < COLS; c++) {
    let blocked = false;
    for (let r = 0; r < ROWS; r++) {
      if (board[r][c]) {
        blocked = true;
      } else if (blocked) {
        holes++;
      }
    }
  }
  return holes;
}

function aggregateHeight(board: Board): number {
  let total = 0;
  for (let c = 0; c < COLS; c++) {
    for (let r = 0; r < ROWS; r++) {
      if (board[r][c]) {
        total += ROWS - r;
        break;
      }
    }
  }
  return total;
}

function bumpiness(board: Board): number {
  const heights: number[] = [];
  for (let c = 0; c < COLS; c++) {
    let h = 0;
    for (let r = 0; r < ROWS; r++) {
      if (board[r][c]) { h = ROWS - r; break; }
    }
    heights.push(h);
  }
  let bump = 0;
  for (let i = 0; i < heights.length - 1; i++) {
    bump += Math.abs(heights[i] - heights[i + 1]);
  }
  return bump;
}

interface Placement {
  rotationIndex: number;
  x: number;
}

function findBestPlacement(board: Board, player: Player): Placement {
  let bestScore = -Infinity;
  let best: Placement = { rotationIndex: 0, x: player.pos.x };

  for (let rot = 0; rot < player.tetromino.rotations.length; rot++) {
    const shape = player.tetromino.rotations[rot];
    const pieceWidth = shape[0].length;

    for (let x = -1; x <= COLS - pieceWidth + 1; x++) {
      if (!isValidPosition(board, shape, { x, y: 0 })) continue;

      let dropY = 0;
      while (isValidPosition(board, shape, { x, y: dropY + 1 })) {
        dropY++;
      }

      const testPlayer: Player = { ...player, rotationIndex: rot, pos: { x, y: dropY } };
      const locked = lockPiece(board, testPlayer);
      const { board: cleared, linesCleared } = clearLines(locked);

      const score =
        linesCleared * 100
        - countHoles(cleared) * 40
        - aggregateHeight(cleared) * 2
        - bumpiness(cleared) * 3;

      if (score > bestScore) {
        bestScore = score;
        best = { rotationIndex: rot, x };
      }
    }
  }

  return best;
}

type AnimState =
  | { phase: "plan"; player: Player }
  | { phase: "moveRotate"; player: Player; target: Placement }
  | { phase: "drop"; player: Player };

export function useAttractMode(active: boolean) {
  const [board, setBoard] = useState<Board>(createBoard);
  const [player, setPlayer] = useState<Player | null>(null);
  const boardRef = useRef(board);
  const stateRef = useRef<AnimState | null>(null);

  boardRef.current = board;

  const reset = useCallback(() => {
    setBoard(createBoard());
    setPlayer(null);
    stateRef.current = null;
  }, []);

  useEffect(() => {
    if (!active) {
      reset();
      return;
    }

    const spawn = () => {
      const piece = spawnAttractPiece();
      const shape = getShape(piece);
      if (!isValidPosition(boardRef.current, shape, piece.pos)) {
        const fresh = createBoard();
        boardRef.current = fresh;
        setBoard(fresh);
        const newPiece = spawnAttractPiece();
        stateRef.current = { phase: "plan", player: newPiece };
        setPlayer(newPiece);
      } else {
        stateRef.current = { phase: "plan", player: piece };
        setPlayer(piece);
      }
    };

    spawn();

    const id = setInterval(() => {
      const st = stateRef.current;
      if (!st) return;

      if (st.phase === "plan") {
        const target = findBestPlacement(boardRef.current, st.player);
        stateRef.current = { phase: "moveRotate", player: st.player, target };
        return;
      }

      if (st.phase === "moveRotate") {
        const p = st.player;
        const t = st.target;

        if (p.rotationIndex !== t.rotationIndex) {
          const nextRot = (p.rotationIndex + 1) % p.tetromino.rotations.length;
          const updated = { ...p, rotationIndex: nextRot };
          stateRef.current = { phase: "moveRotate", player: updated, target: t };
          setPlayer(updated);
          return;
        }

        if (p.pos.x !== t.x) {
          const dx = p.pos.x < t.x ? 1 : -1;
          const newPos = { x: p.pos.x + dx, y: p.pos.y };
          const shape = getShape(p);
          if (isValidPosition(boardRef.current, shape, newPos)) {
            const updated = { ...p, pos: newPos };
            stateRef.current = { phase: "moveRotate", player: updated, target: t };
            setPlayer(updated);
          } else {
            stateRef.current = { phase: "drop", player: p };
          }
          return;
        }

        stateRef.current = { phase: "drop", player: p };
        return;
      }

      if (st.phase === "drop") {
        const p = st.player;
        const shape = getShape(p);
        const newPos = { x: p.pos.x, y: p.pos.y + 1 };

        if (isValidPosition(boardRef.current, shape, newPos)) {
          const updated = { ...p, pos: newPos };
          stateRef.current = { phase: "drop", player: updated };
          setPlayer(updated);
        } else {
          const locked = lockPiece(boardRef.current, p);
          const { board: cleared } = clearLines(locked);
          boardRef.current = cleared;
          setBoard(cleared);
          spawn();
        }
      }
    }, ATTRACT_TICK_MS);

    return () => clearInterval(id);
  }, [active, reset]);

  return { board, player };
}
