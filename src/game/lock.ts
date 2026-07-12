import type { Board } from "./board";
import { type Player, getShape } from "./player";

export function lockPiece(board: Board, player: Player): Board {
  const newBoard = board.map((row) => [...row]);
  const shape = getShape(player);
  const { color } = player.tetromino;

  for (let r = 0; r < shape.length; r++) {
    for (let c = 0; c < shape[r].length; c++) {
      if (!shape[r][c]) continue;
      const boardY = player.pos.y + r;
      const boardX = player.pos.x + c;
      if (boardY >= 0) {
        newBoard[boardY][boardX] = color;
      }
    }
  }
  return newBoard;
}
