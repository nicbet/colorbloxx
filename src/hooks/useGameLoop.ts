import { useState, useCallback, useEffect, useRef } from "react";
import { createBoard, type Board } from "../game/board";
import { spawnPlayer, getShape, type Player } from "../game/player";
import { isValidPosition } from "../game/collision";
import { lockPiece } from "../game/lock";

const INITIAL_GRAVITY_MS = 800;

export function useGameLoop() {
  const [board, setBoard] = useState<Board>(createBoard);
  const [player, setPlayer] = useState<Player>(spawnPlayer);
  const playerRef = useRef(player);
  const boardRef = useRef(board);

  playerRef.current = player;
  boardRef.current = board;

  const tryMove = useCallback((dx: number, dy: number): boolean => {
    const p = playerRef.current;
    const b = boardRef.current;
    const shape = getShape(p);
    const newPos = { x: p.pos.x + dx, y: p.pos.y + dy };

    if (isValidPosition(b, shape, newPos)) {
      setPlayer((prev) => ({ ...prev, pos: newPos }));
      return true;
    }
    return false;
  }, []);

  const lock = useCallback(() => {
    const p = playerRef.current;
    const b = boardRef.current;
    const newBoard = lockPiece(b, p);
    setBoard(newBoard);
    setPlayer(spawnPlayer());
  }, []);

  const moveLeft = useCallback(() => tryMove(-1, 0), [tryMove]);
  const moveRight = useCallback(() => tryMove(1, 0), [tryMove]);

  const hardDrop = useCallback(() => {
    const p = playerRef.current;
    const b = boardRef.current;
    const shape = getShape(p);
    let dropY = p.pos.y;

    while (isValidPosition(b, shape, { x: p.pos.x, y: dropY + 1 })) {
      dropY++;
    }

    setPlayer((prev) => ({ ...prev, pos: { ...prev.pos, y: dropY } }));
    const dropped = { ...p, pos: { ...p.pos, y: dropY } };
    const newBoard = lockPiece(b, dropped);
    setBoard(newBoard);
    setPlayer(spawnPlayer());
  }, []);

  useEffect(() => {
    const id = setInterval(() => {
      const p = playerRef.current;
      const b = boardRef.current;
      const shape = getShape(p);
      const newPos = { x: p.pos.x, y: p.pos.y + 1 };

      if (isValidPosition(b, shape, newPos)) {
        setPlayer((prev) => ({ ...prev, pos: newPos }));
      } else {
        lock();
      }
    }, INITIAL_GRAVITY_MS);

    return () => clearInterval(id);
  }, [lock]);

  return { board, player, moveLeft, moveRight, hardDrop };
}
