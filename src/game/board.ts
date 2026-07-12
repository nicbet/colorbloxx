import { ROWS, COLS } from "./constants";

export type CellValue = string | 0;
export type Board = CellValue[][];

export function createBoard(): Board {
  return Array.from({ length: ROWS }, () => Array(COLS).fill(0));
}

export function clearLines(board: Board): { board: Board; linesCleared: number } {
  const kept = board.filter((row) => row.some((cell) => !cell));
  const linesCleared = ROWS - kept.length;
  const empty = Array.from({ length: linesCleared }, () => Array(COLS).fill(0) as CellValue[]);
  return { board: [...empty, ...kept], linesCleared };
}
