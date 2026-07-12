import { useRef, useEffect } from "react";
import type { Tetromino } from "../game/pieces";

const PREVIEW_CELL = 16;
const PREVIEW_CELLS = 4;
const PREVIEW_SIZE = PREVIEW_CELLS * PREVIEW_CELL;

interface Props {
  tetromino: Tetromino | null;
}

function drawCell(ctx: CanvasRenderingContext2D, x: number, y: number, color: string, s: number) {
  const bevel = 2;

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

export default function NextPiece({ tetromino }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.fillStyle = "#0f0f23";
    ctx.fillRect(0, 0, PREVIEW_SIZE, PREVIEW_SIZE);

    if (!tetromino) return;

    const shape = tetromino.rotations[0];
    const rows = shape.length;
    const cols = shape[0].length;
    const offsetX = Math.floor((PREVIEW_CELLS - cols) / 2) * PREVIEW_CELL;
    const offsetY = Math.floor((PREVIEW_CELLS - rows) / 2) * PREVIEW_CELL;

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (shape[r][c]) {
          drawCell(ctx, offsetX + c * PREVIEW_CELL, offsetY + r * PREVIEW_CELL, tetromino.color, PREVIEW_CELL);
        }
      }
    }
  }, [tetromino]);

  return (
    <canvas
      ref={canvasRef}
      width={PREVIEW_SIZE}
      height={PREVIEW_SIZE}
      style={{ borderRadius: "4px" }}
    />
  );
}
