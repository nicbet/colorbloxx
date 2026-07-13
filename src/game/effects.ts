import { CELL_SIZE, COLS } from "./constants";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  life: number;
  maxLife: number;
}

export interface LineClearEffect {
  type: "lineClear";
  startTime: number;
  duration: number;
  rows: number[];
  count: number;
  particles: Particle[];
  colors: string[][];
}

export interface LockFlashEffect {
  type: "lockFlash";
  startTime: number;
  duration: number;
  cells: { x: number; y: number }[];
}

export type Effect = LineClearEffect | LockFlashEffect;

const FLASH_DURATION = 300;
const PARTICLE_DURATION = 500;

export function createLineClearEffect(
  rows: number[],
  count: number,
  timestamp: number,
  rowColors: string[][],
): Effect {
  const particles: Particle[] = [];
  const duration = count >= 3 ? PARTICLE_DURATION : FLASH_DURATION;

  if (count >= 3) {
    for (const row of rows) {
      for (let c = 0; c < COLS; c++) {
        const color = rowColors[rows.indexOf(row)]?.[c] ?? "#fff";
        for (let i = 0; i < 3; i++) {
          particles.push({
            x: (c + 0.5) * CELL_SIZE,
            y: (row + 0.5) * CELL_SIZE,
            vx: (Math.random() - 0.5) * 8,
            vy: (Math.random() - 0.8) * 6,
            color,
            life: duration,
            maxLife: duration,
          });
        }
      }
    }
  }

  return {
    type: "lineClear",
    startTime: timestamp,
    duration,
    rows,
    count,
    particles,
    colors: rowColors,
  };
}

import { type Player, getShape } from "./player";

const LOCK_FLASH_DURATION = 150;

export function createLockFlashEffect(player: Player, timestamp: number): LockFlashEffect {
  const shape = getShape(player);
  const cells: { x: number; y: number }[] = [];
  for (let r = 0; r < shape.length; r++) {
    for (let c = 0; c < shape[r].length; c++) {
      if (shape[r][c]) {
        cells.push({ x: player.pos.x + c, y: player.pos.y + r });
      }
    }
  }
  return { type: "lockFlash", startTime: timestamp, duration: LOCK_FLASH_DURATION, cells };
}

export function drawEffect(
  ctx: CanvasRenderingContext2D,
  effect: Effect,
  now: number,
): boolean {
  const elapsed = now - effect.startTime;
  if (elapsed > effect.duration) return false;

  const progress = elapsed / effect.duration;

  if (effect.type === "lockFlash") {
    const alpha = (1 - progress) * 0.6;
    ctx.globalAlpha = alpha;
    ctx.fillStyle = "#fff";
    for (const cell of effect.cells) {
      ctx.fillRect(cell.x * CELL_SIZE, cell.y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
    }
    ctx.globalAlpha = 1;
    return true;
  }

  if (effect.count >= 4) {
    drawCOLORBLOXXFlash(ctx, effect, progress);
  } else if (effect.count >= 3) {
    drawFlash(ctx, effect.rows, progress, 0.7);
  } else if (effect.count >= 2) {
    drawColorBrighten(ctx, effect, progress);
  } else {
    drawFlash(ctx, effect.rows, progress, 0.5);
  }

  for (const p of effect.particles) {
    if (p.life <= 0) continue;
    p.x += p.vx;
    p.y += p.vy;
    p.vy += 0.2;
    p.life -= 16;
    const alpha = Math.max(0, p.life / p.maxLife);
    const size = 3 + alpha * 3;
    ctx.globalAlpha = alpha;
    ctx.fillStyle = p.color;
    ctx.fillRect(p.x - size / 2, p.y - size / 2, size, size);
  }
  ctx.globalAlpha = 1;

  if (effect.count >= 4 && progress < 0.6) {
    ctx.save();
    ctx.font = 'bold 36px "Impact", "Arial Black", sans-serif';
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    const centerY = (effect.rows[0] + effect.rows[effect.rows.length - 1] + 1) / 2 * CELL_SIZE;
    const centerX = (COLS * CELL_SIZE) / 2;
    const textAlpha = progress < 0.1 ? progress / 0.1 : progress > 0.4 ? (0.6 - progress) / 0.2 : 1;
    ctx.globalAlpha = textAlpha;
    ctx.fillStyle = "#ffea00";
    ctx.shadowColor = "#ffea00";
    ctx.shadowBlur = 20;
    ctx.fillText("COLORBLOXX!", centerX, centerY);
    ctx.shadowBlur = 0;
    ctx.globalAlpha = 1;
    ctx.restore();
  }

  return true;
}

function drawFlash(
  ctx: CanvasRenderingContext2D,
  rows: number[],
  progress: number,
  maxAlpha: number,
) {
  const alpha = (1 - progress) * maxAlpha;
  ctx.globalAlpha = alpha;
  ctx.fillStyle = "#fff";
  for (const row of rows) {
    ctx.fillRect(0, row * CELL_SIZE, COLS * CELL_SIZE, CELL_SIZE);
  }
  ctx.globalAlpha = 1;
}

function drawColorBrighten(
  ctx: CanvasRenderingContext2D,
  effect: LineClearEffect,
  progress: number,
) {
  const alpha = progress < 0.3 ? progress / 0.3 : (1 - progress) / 0.7;
  ctx.globalAlpha = alpha * 0.7;
  for (let ri = 0; ri < effect.rows.length; ri++) {
    const row = effect.rows[ri];
    for (let c = 0; c < COLS; c++) {
      const color = effect.colors[ri]?.[c] ?? "#fff";
      ctx.fillStyle = color;
      ctx.fillRect(c * CELL_SIZE, row * CELL_SIZE, CELL_SIZE, CELL_SIZE);
      ctx.fillStyle = "#fff";
      ctx.fillRect(c * CELL_SIZE, row * CELL_SIZE, CELL_SIZE, CELL_SIZE);
    }
  }
  ctx.globalAlpha = 1;
}

function drawCOLORBLOXXFlash(
  ctx: CanvasRenderingContext2D,
  effect: LineClearEffect,
  progress: number,
) {
  const boardWidth = COLS * CELL_SIZE;

  // Intense flash
  const flashAlpha = progress < 0.15 ? progress / 0.15 * 0.9 : Math.max(0, (1 - progress) * 0.6);
  ctx.globalAlpha = flashAlpha;
  ctx.fillStyle = "#ffea00";
  for (const row of effect.rows) {
    ctx.fillRect(0, row * CELL_SIZE, boardWidth, CELL_SIZE);
  }

  // Lightning bolts from edges
  if (progress < 0.5) {
    const boltAlpha = (0.5 - progress) / 0.5 * 0.7;
    ctx.globalAlpha = boltAlpha;
    ctx.strokeStyle = "#fff";
    ctx.lineWidth = 2;
    for (const row of effect.rows) {
      const y = (row + 0.5) * CELL_SIZE;
      ctx.beginPath();
      ctx.moveTo(0, y);
      for (let x = 0; x < boardWidth; x += 15) {
        ctx.lineTo(x, y + (Math.random() - 0.5) * 12);
      }
      ctx.lineTo(boardWidth, y);
      ctx.stroke();
    }
  }

  ctx.globalAlpha = 1;
}
