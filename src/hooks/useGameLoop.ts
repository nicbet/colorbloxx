import { useState, useCallback, useEffect, useRef } from "react";
import { createBoard, clearLines, type Board } from "../game/board";
import { spawnPlayer, getShape, type Player } from "../game/player";
import { randomTetromino, type Tetromino } from "../game/pieces";
import { isValidPosition } from "../game/collision";
import { lockPiece } from "../game/lock";
import { sfxMove, sfxRotate, sfxHardDrop, sfxLock, sfxLineClear, sfxGameOver } from "../game/audio";

const BASE_GRAVITY_MS = 800;
const SPEED_REDUCTION_PER_LEVEL = 75;
const MIN_GRAVITY_MS = 100;
const SOFT_DROP_MS = 50;
const LOCK_DELAY_MS = 500;

const SCORE_TABLE: Record<number, number> = { 1: 50, 2: 100, 3: 200, 4: 500 };

function gravityInterval(level: number): number {
  return Math.max(MIN_GRAVITY_MS, BASE_GRAVITY_MS - (level - 1) * SPEED_REDUCTION_PER_LEVEL);
}

export type GameState = "idle" | "playing" | "gameover";

export function useGameLoop() {
  const [gameState, setGameState] = useState<GameState>("idle");
  const [board, setBoard] = useState<Board>(createBoard);
  const [player, setPlayer] = useState<Player | null>(null);
  const [softDropping, setSoftDropping] = useState(false);
  const [score, setScore] = useState(0);
  const [lines, setLines] = useState(0);
  const [nextTetromino, setNextTetromino] = useState<Tetromino | null>(null);
  const nextTetrominoRef = useRef(nextTetromino);
  const playerRef = useRef(player);
  const boardRef = useRef(board);
  const gameStateRef = useRef(gameState);
  const scoreRef = useRef(score);
  const lockDelayRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  playerRef.current = player;
  boardRef.current = board;
  gameStateRef.current = gameState;
  scoreRef.current = score;
  nextTetrominoRef.current = nextTetromino;

  const level = Math.floor(score / 1000) + 1;

  const clearLockDelay = useCallback(() => {
    if (lockDelayRef.current !== null) {
      clearTimeout(lockDelayRef.current);
      lockDelayRef.current = null;
    }
  }, []);

  const lockAndScore = useCallback((b: Board, p: Player, isHardDrop = false) => {
    const locked = lockPiece(b, p);
    const { board: cleared, linesCleared } = clearLines(locked);
    setBoard(cleared);
    if (linesCleared > 0) {
      const points = SCORE_TABLE[linesCleared] ?? 0;
      setScore((prev) => prev + points);
      setLines((prev) => prev + linesCleared);
      sfxLineClear(linesCleared);
    } else if (!isHardDrop) {
      sfxLock();
    }
    const next = spawnPlayer(nextTetrominoRef.current ?? undefined);
    const nextShape = getShape(next);
    setNextTetromino(randomTetromino());
    if (!isValidPosition(cleared, nextShape, next.pos)) {
      setPlayer(null);
      setGameState("gameover");
      sfxGameOver();
    } else {
      setPlayer(next);
    }
  }, []);

  const lock = useCallback(() => {
    clearLockDelay();
    const p = playerRef.current;
    if (!p) return;
    const b = boardRef.current;
    lockAndScore(b, p);
  }, [clearLockDelay, lockAndScore]);

  const startLockDelay = useCallback(() => {
    clearLockDelay();
    lockDelayRef.current = setTimeout(() => {
      lockDelayRef.current = null;
      lock();
    }, LOCK_DELAY_MS);
  }, [clearLockDelay, lock]);

  const isLanded = useCallback((p: Player, b: Board): boolean => {
    const shape = getShape(p);
    return !isValidPosition(b, shape, { x: p.pos.x, y: p.pos.y + 1 });
  }, []);

  const tryMove = useCallback((dx: number, dy: number): boolean => {
    if (gameStateRef.current !== "playing") return false;
    const p = playerRef.current;
    if (!p) return false;
    const b = boardRef.current;
    const shape = getShape(p);
    const newPos = { x: p.pos.x + dx, y: p.pos.y + dy };

    if (isValidPosition(b, shape, newPos)) {
      const movedPlayer = { ...p, pos: newPos };
      setPlayer(movedPlayer);
      playerRef.current = movedPlayer;
      sfxMove();

      if (lockDelayRef.current !== null) {
        if (isLanded(movedPlayer, b)) {
          startLockDelay();
        } else {
          clearLockDelay();
        }
      }
      return true;
    }
    return false;
  }, [isLanded, startLockDelay, clearLockDelay]);

  const moveLeft = useCallback(() => tryMove(-1, 0), [tryMove]);
  const moveRight = useCallback(() => tryMove(1, 0), [tryMove]);

  const hardDropCooldownRef = useRef(false);

  const hardDrop = useCallback(() => {
    if (gameStateRef.current !== "playing") return;
    if (hardDropCooldownRef.current) return;
    const p = playerRef.current;
    if (!p) return;
    hardDropCooldownRef.current = true;
    setTimeout(() => { hardDropCooldownRef.current = false; }, 150);
    clearLockDelay();
    const b = boardRef.current;
    const shape = getShape(p);
    let dropY = p.pos.y;

    while (isValidPosition(b, shape, { x: p.pos.x, y: dropY + 1 })) {
      dropY++;
    }

    const dropped = { ...p, pos: { ...p.pos, y: dropY } };
    sfxHardDrop();
    lockAndScore(b, dropped, true);
  }, [clearLockDelay, lockAndScore]);

  const KICK_OFFSETS = [
    { x: -1, y: 0 }, { x: 1, y: 0 },
    { x: -2, y: 0 }, { x: 2, y: 0 },
  ];

  const rotate = useCallback(() => {
    if (gameStateRef.current !== "playing") return;
    const p = playerRef.current;
    if (!p) return;
    const b = boardRef.current;
    const nextIndex = (p.rotationIndex + 1) % p.tetromino.rotations.length;
    const nextShape = p.tetromino.rotations[nextIndex];

    const tryPosition = (pos: { x: number; y: number }): boolean => {
      if (isValidPosition(b, nextShape, pos)) {
        const rotated = { ...p, rotationIndex: nextIndex, pos };
        setPlayer(rotated);
        playerRef.current = rotated;

        if (lockDelayRef.current !== null) {
          if (isLanded(rotated, b)) {
            startLockDelay();
          } else {
            clearLockDelay();
          }
        }
        return true;
      }
      return false;
    };

    if (tryPosition(p.pos)) { sfxRotate(); return; }
    for (const offset of KICK_OFFSETS) {
      if (tryPosition({ x: p.pos.x + offset.x, y: p.pos.y + offset.y })) { sfxRotate(); return; }
    }
  }, [isLanded, startLockDelay, clearLockDelay]);

  const startSoftDrop = useCallback(() => {
    if (gameStateRef.current !== "playing") return;
    setSoftDropping(true);
  }, []);

  const stopSoftDrop = useCallback(() => {
    setSoftDropping(false);
  }, []);

  const startGame = useCallback(() => {
    clearLockDelay();
    setSoftDropping(false);
    setScore(0);
    setLines(0);
    setBoard(createBoard());
    setPlayer(spawnPlayer());
    setNextTetromino(randomTetromino());
    setGameState("playing");
  }, [clearLockDelay]);

  const playAgain = useCallback(() => {
    startGame();
  }, [startGame]);

  useEffect(() => {
    if (gameState !== "playing") return;

    const interval = softDropping ? SOFT_DROP_MS : gravityInterval(level);

    const id = setInterval(() => {
      const p = playerRef.current;
      if (!p) return;
      const b = boardRef.current;

      if (isLanded(p, b)) {
        if (lockDelayRef.current === null) {
          startLockDelay();
        }
      } else {
        const newPos = { x: p.pos.x, y: p.pos.y + 1 };
        setPlayer((prev) => prev ? { ...prev, pos: newPos } : prev);
      }
    }, interval);

    return () => clearInterval(id);
  }, [gameState, softDropping, level, isLanded, startLockDelay]);

  return {
    board, player, gameState, score, level, lines, nextTetromino,
    moveLeft, moveRight, hardDrop, rotate,
    startSoftDrop, stopSoftDrop,
    startGame, playAgain,
  };
}
