import { useState, useCallback, useEffect, useRef } from "react";
import { createBoard, type Board } from "../game/board";
import { spawnPlayer, getShape, type Player } from "../game/player";
import { isValidPosition } from "../game/collision";
import { lockPiece } from "../game/lock";

const INITIAL_GRAVITY_MS = 800;
const SOFT_DROP_MS = 50;
const LOCK_DELAY_MS = 500;

export type GameState = "idle" | "playing";

export function useGameLoop() {
  const [gameState, setGameState] = useState<GameState>("idle");
  const [board, setBoard] = useState<Board>(createBoard);
  const [player, setPlayer] = useState<Player | null>(null);
  const [softDropping, setSoftDropping] = useState(false);
  const playerRef = useRef(player);
  const boardRef = useRef(board);
  const gameStateRef = useRef(gameState);
  const lockDelayRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  playerRef.current = player;
  boardRef.current = board;
  gameStateRef.current = gameState;

  const clearLockDelay = useCallback(() => {
    if (lockDelayRef.current !== null) {
      clearTimeout(lockDelayRef.current);
      lockDelayRef.current = null;
    }
  }, []);

  const lock = useCallback(() => {
    clearLockDelay();
    const p = playerRef.current;
    if (!p) return;
    const b = boardRef.current;
    const newBoard = lockPiece(b, p);
    setBoard(newBoard);
    setPlayer(spawnPlayer());
  }, [clearLockDelay]);

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

  const hardDrop = useCallback(() => {
    if (gameStateRef.current !== "playing") return;
    const p = playerRef.current;
    if (!p) return;
    clearLockDelay();
    const b = boardRef.current;
    const shape = getShape(p);
    let dropY = p.pos.y;

    while (isValidPosition(b, shape, { x: p.pos.x, y: dropY + 1 })) {
      dropY++;
    }

    const dropped = { ...p, pos: { ...p.pos, y: dropY } };
    const newBoard = lockPiece(b, dropped);
    setBoard(newBoard);
    setPlayer(spawnPlayer());
  }, [clearLockDelay]);

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
    setBoard(createBoard());
    setPlayer(spawnPlayer());
    setGameState("playing");
  }, [clearLockDelay]);

  useEffect(() => {
    if (gameState !== "playing") return;

    const interval = softDropping ? SOFT_DROP_MS : INITIAL_GRAVITY_MS;

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
  }, [gameState, softDropping, isLanded, startLockDelay]);

  return {
    board, player, gameState,
    moveLeft, moveRight, hardDrop,
    startSoftDrop, stopSoftDrop,
    startGame,
  };
}
