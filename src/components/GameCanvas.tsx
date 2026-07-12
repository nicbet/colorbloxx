import { useRef, useEffect } from "react";
import { BOARD_WIDTH, BOARD_HEIGHT, COLS, ROWS, CELL_SIZE } from "../game/constants";
import type { Board } from "../game/board";
import { type Player, getShape } from "../game/player";
import { isValidPosition } from "../game/collision";

interface Props {
  board: Board;
  player: Player | null;
}

function drawCell(ctx: CanvasRenderingContext2D, x: number, y: number, color: string) {
  const s = CELL_SIZE;
  const bevel = 3;

  ctx.fillStyle = color;
  ctx.fillRect(x, y, s, s);

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

function drawPlayer(ctx: CanvasRenderingContext2D, player: Player) {
  const shape = getShape(player);
  const { color } = player.tetromino;

  for (let r = 0; r < shape.length; r++) {
    for (let c = 0; c < shape[r].length; c++) {
      if (shape[r][c]) {
        const x = (player.pos.x + c) * CELL_SIZE;
        const y = (player.pos.y + r) * CELL_SIZE;
        drawCell(ctx, x, y, color);
      }
    }
  }
}

function drawGhost(ctx: CanvasRenderingContext2D, board: Board, player: Player) {
  const shape = getShape(player);
  let ghostY = player.pos.y;

  while (isValidPosition(board, shape, { x: player.pos.x, y: ghostY + 1 })) {
    ghostY++;
  }

  if (ghostY === player.pos.y) return;

  const { color } = player.tetromino;
  ctx.globalAlpha = 0.25;
  for (let r = 0; r < shape.length; r++) {
    for (let c = 0; c < shape[r].length; c++) {
      if (shape[r][c]) {
        const x = (player.pos.x + c) * CELL_SIZE;
        const y = (ghostY + r) * CELL_SIZE;
        ctx.fillStyle = color;
        ctx.fillRect(x, y, CELL_SIZE, CELL_SIZE);
      }
    }
  }
  ctx.globalAlpha = 1;
}

const showGhost = (() => {
  try { return localStorage.getItem("showGhosts") === "true"; }
  catch { return false; }
})();

export default function GameCanvas({ board, player }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const boardRef = useRef(board);
  const playerRef = useRef(player);

  boardRef.current = board;
  playerRef.current = player;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let rafId: number;

    const render = () => {
      drawBoard(ctx, boardRef.current);
      if (playerRef.current) {
        if (showGhost) drawGhost(ctx, boardRef.current, playerRef.current);
        drawPlayer(ctx, playerRef.current);
      }
      rafId = requestAnimationFrame(render);
    };

    rafId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(rafId);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      width={BOARD_WIDTH}
      height={BOARD_HEIGHT}
      style={{ border: "2px solid #333" }}
    />
  );
}
