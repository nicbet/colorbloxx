import { ROWS, COLS } from "./constants";

export type CellValue = string | 0;
export type Board = CellValue[][];

export function createBoard(): Board {
  return Array.from({ length: ROWS }, () => Array(COLS).fill(0));
}

export function clearLines(board: Board): { board: Board; linesCleared: number; clearedRows: number[] } {
  const clearedRows: number[] = [];
  const kept: CellValue[][] = [];
  for (let r = 0; r < ROWS; r++) {
    if (board[r].every((cell) => cell)) {
      clearedRows.push(r);
    } else {
      kept.push(board[r]);
    }
  }
  const linesCleared = clearedRows.length;
  const empty = Array.from({ length: linesCleared }, () => Array(COLS).fill(0) as CellValue[]);
  return { board: [...empty, ...kept], linesCleared, clearedRows };
}
