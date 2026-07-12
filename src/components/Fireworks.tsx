import { useRef, useEffect, useImperativeHandle, forwardRef } from "react";

export interface FireworksHandle {
  trigger: (lines: number) => void;
}

interface Spark {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  life: number;
  maxLife: number;
  size: number;
}

const COLORS = [
  "#ff1744", "#ff9100", "#ffea00", "#00e676",
  "#2979ff", "#d500f9", "#00f0f0", "#f0a000",
];

function randomColor(): string {
  return COLORS[Math.floor(Math.random() * COLORS.length)];
}

function createBurst(x: number, y: number, count: number): Spark[] {
  const sparks: Spark[] = [];
  for (let i = 0; i < count; i++) {
    const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.3;
    const speed = 2 + Math.random() * 4;
    const life = 1200 + Math.random() * 800;
    sparks.push({
      x, y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - 2,
      color: randomColor(),
      life, maxLife: life,
      size: 2 + Math.random() * 3,
    });
  }
  return sparks;
}

function createSparkles(count: number): Spark[] {
  const w = window.innerWidth;
  const h = window.innerHeight;
  const sparks: Spark[] = [];
  for (let i = 0; i < count; i++) {
    const life = 900 + Math.random() * 600;
    sparks.push({
      x: w * 0.1 + Math.random() * w * 0.8,
      y: h * 0.5 + Math.random() * h * 0.4,
      vx: (Math.random() - 0.5) * 1,
      vy: -(0.5 + Math.random() * 2),
      color: randomColor(),
      life, maxLife: life,
      size: 1.5 + Math.random() * 2,
    });
  }
  return sparks;
}

function createStreaks(count: number): Spark[] {
  const w = window.innerWidth;
  const h = window.innerHeight;
  const sparks: Spark[] = [];
  for (let i = 0; i < count; i++) {
    const life = 1000 + Math.random() * 600;
    const angle = -Math.PI / 2 + (Math.random() - 0.5) * 1.2;
    const speed = 1.5 + Math.random() * 3;
    sparks.push({
      x: w * 0.15 + Math.random() * w * 0.7,
      y: h * 0.6 + Math.random() * h * 0.3,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      color: randomColor(),
      life, maxLife: life,
      size: 2 + Math.random() * 2.5,
    });
  }
  return sparks;
}

const Fireworks = forwardRef<FireworksHandle>((_props, ref) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sparksRef = useRef<Spark[]>([]);
  const activeRef = useRef(false);
  const rafRef = useRef<number>(0);

  useImperativeHandle(ref, () => ({
    trigger: (lines: number) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const w = window.innerWidth;
      const h = window.innerHeight;
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
      }

      if (lines === 1) {
        sparksRef.current.push(...createSparkles(8));
      } else if (lines === 2) {
        sparksRef.current.push(...createSparkles(12));
        sparksRef.current.push(...createStreaks(6));
      } else if (lines === 3) {
        for (let i = 0; i < 2; i++) {
          const x = w * 0.25 + Math.random() * w * 0.5;
          const y = h * 0.25 + Math.random() * h * 0.3;
          sparksRef.current.push(...createBurst(x, y, 15));
        }
        sparksRef.current.push(...createSparkles(8));
      } else if (lines >= 4) {
        for (let i = 0; i < 3; i++) {
          const x = w * 0.2 + Math.random() * w * 0.6;
          const y = h * 0.2 + Math.random() * h * 0.4;
          sparksRef.current.push(...createBurst(x, y, 25));
        }
        sparksRef.current.push(...createSparkles(12));
        sparksRef.current.push(...createStreaks(8));
      }

      if (!activeRef.current) {
        activeRef.current = true;
        renderLoop();
      }
    },
  }));

  const renderLoop = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const sparks = sparksRef.current;
    let alive = 0;

    for (const s of sparks) {
      if (s.life <= 0) continue;
      alive++;

      s.x += s.vx;
      s.y += s.vy;
      s.vy += 0.08;
      s.vx *= 0.99;
      s.life -= 16;

      const alpha = Math.max(0, s.life / s.maxLife);
      const size = s.size * (0.5 + alpha * 0.5);

      ctx.globalAlpha = alpha;
      ctx.fillStyle = s.color;
      ctx.fillRect(s.x - size / 2, s.y - size / 2, size, size);
    }
    ctx.globalAlpha = 1;

    if (alive > 0) {
      rafRef.current = requestAnimationFrame(renderLoop);
    } else {
      sparksRef.current = [];
      activeRef.current = false;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  };

  useEffect(() => {
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        inset: 0,
        pointerEvents: "none",
        zIndex: 1000,
      }}
    />
  );
});

Fireworks.displayName = "Fireworks";

export default Fireworks;
