import { ROWS, COLS } from "./constants";
import type { Board } from "./board";

export function isValidPosition(
  board: Board,
  shape: boolean[][],
  pos: { x: number; y: number },
): boolean {
  for (let r = 0; r < shape.length; r++) {
    for (let c = 0; c < shape[r].length; c++) {
      if (!shape[r][c]) continue;

      const boardX = pos.x + c;
      const boardY = pos.y + r;

      if (boardX < 0 || boardX >= COLS || boardY >= ROWS) return false;
      if (boardY < 0) continue;
      if (board[boardY][boardX]) return false;
    }
  }
  return true;
}
