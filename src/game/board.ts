import { ROWS, COLS } from "./constants";

export type CellValue = string | 0;
export type Board = CellValue[][];

export function createBoard(): Board {
  return Array.from({ length: ROWS }, () => Array(COLS).fill(0));
}
