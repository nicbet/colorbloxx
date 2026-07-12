import { useRef, useEffect } from "react";
import { BOARD_WIDTH, BOARD_HEIGHT, COLS, ROWS, CELL_SIZE } from "../game/constants";
import type { Board } from "../game/board";

interface Props {
  board: Board;
}

function drawCell(ctx: CanvasRenderingContext2D, x: number, y: number, color: string) {
  const s = CELL_SIZE;
  const bevel = 3;

  ctx.fillStyle = color;
  ctx.fillRect(x, y, s, s);

  // lighter top & left edge
  ctx.fillStyle = "rgba(255,255,255,0.3)";
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x + s, y);
  ctx.lineTo(x + s - bevel, y + bevel);
  ctx.lineTo(x + bevel, y + bevel);
  ctx.lineTo(x + bevel, y + s - bevel);
  ctx.lineTo(x, y + s);
  ctx.closePath();
  ctx.fill();

  // darker bottom & right edge
  ctx.fillStyle = "rgba(0,0,0,0.3)";
  ctx.beginPath();
  ctx.moveTo(x + s, y);
  ctx.lineTo(x + s, y + s);
  ctx.lineTo(x, y + s);
  ctx.lineTo(x + bevel, y + s - bevel);
  ctx.lineTo(x + s - bevel, y + s - bevel);
  ctx.lineTo(x + s - bevel, y + bevel);
  ctx.closePath();
  ctx.fill();
}

function drawBoard(ctx: CanvasRenderingContext2D, board: Board) {
  ctx.fillStyle = "#0f0f23";
  ctx.fillRect(0, 0, BOARD_WIDTH, BOARD_HEIGHT);

  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      const cell = board[r][c];
      const x = c * CELL_SIZE;
      const y = r * CELL_SIZE;

      if (cell) {
        drawCell(ctx, x, y, cell);
      } else {
        ctx.strokeStyle = "#1a1a3e";
        ctx.lineWidth = 0.5;
        ctx.strokeRect(x, y, CELL_SIZE, CELL_SIZE);
      }
    }
  }
}

export default function GameCanvas({ board }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    drawBoard(ctx, board);
  }, [board]);

  return (
    <canvas
      ref={canvasRef}
      width={BOARD_WIDTH}
      height={BOARD_HEIGHT}
      style={{ border: "2px solid #333" }}
    />
  );
}
