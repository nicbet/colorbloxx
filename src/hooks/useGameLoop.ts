import { useState, useCallback, useEffect, useRef } from "react";
import { createBoard, type Board } from "../game/board";
import { spawnPlayer, getShape, type Player } from "../game/player";
import { isValidPosition } from "../game/collision";
import { lockPiece } from "../game/lock";

const INITIAL_GRAVITY_MS = 800;

export type GameState = "idle" | "playing";

export function useGameLoop() {
  const [gameState, setGameState] = useState<GameState>("idle");
  const [board, setBoard] = useState<Board>(createBoard);
  const [player, setPlayer] = useState<Player | null>(null);
  const playerRef = useRef(player);
  const boardRef = useRef(board);
  const gameStateRef = useRef(gameState);

  playerRef.current = player;
  boardRef.current = board;
  gameStateRef.current = gameState;

  const tryMove = useCallback((dx: number, dy: number): boolean => {
    if (gameStateRef.current !== "playing") return false;
    const p = playerRef.current;
    if (!p) return false;
    const b = boardRef.current;
    const shape = getShape(p);
    const newPos = { x: p.pos.x + dx, y: p.pos.y + dy };

    if (isValidPosition(b, shape, newPos)) {
      setPlayer((prev) => prev ? { ...prev, pos: newPos } : prev);
      return true;
    }
    return false;
  }, []);

  const lock = useCallback(() => {
    const p = playerRef.current;
    if (!p) return;
    const b = boardRef.current;
    const newBoard = lockPiece(b, p);
    setBoard(newBoard);
    setPlayer(spawnPlayer());
  }, []);

  const moveLeft = useCallback(() => tryMove(-1, 0), [tryMove]);
  const moveRight = useCallback(() => tryMove(1, 0), [tryMove]);

  const hardDrop = useCallback(() => {
    if (gameStateRef.current !== "playing") return;
    const p = playerRef.current;
    if (!p) return;
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
  }, []);

  const startGame = useCallback(() => {
    setBoard(createBoard());
    setPlayer(spawnPlayer());
    setGameState("playing");
  }, []);

  useEffect(() => {
    if (gameState !== "playing") return;

    const id = setInterval(() => {
      const p = playerRef.current;
      if (!p) return;
      const b = boardRef.current;
      const shape = getShape(p);
      const newPos = { x: p.pos.x, y: p.pos.y + 1 };

      if (isValidPosition(b, shape, newPos)) {
        setPlayer((prev) => prev ? { ...prev, pos: newPos } : prev);
      } else {
        lock();
      }
    }, INITIAL_GRAVITY_MS);

    return () => clearInterval(id);
  }, [gameState, lock]);

  return { board, player, gameState, moveLeft, moveRight, hardDrop, startGame };
}
