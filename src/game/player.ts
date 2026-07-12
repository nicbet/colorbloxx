import { COLS } from "./constants";
import { randomTetromino, type Tetromino } from "./pieces";

export interface Player {
  tetromino: Tetromino;
  rotationIndex: number;
  pos: { x: number; y: number };
}

export function spawnPlayer(tetromino?: Tetromino): Player {
  tetromino = tetromino ?? randomTetromino();
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

export function getShape(player: Player): boolean[][] {
  return player.tetromino.rotations[player.rotationIndex];
}
