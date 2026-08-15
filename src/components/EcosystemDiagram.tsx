import { useEffect, useRef } from 'react';

type Node = { x: number; y: number; label: string; color: string; angle: number };

const SERVICES = [
  'Ecommerce', 'Marketing', 'Branding', 'Development',
  'Automation', 'Creative', 'SEO', 'Analytics',
];

export default function EcosystemDiagram({ size = 400 }: { size?: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);
  const phaseRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let dpr = window.devicePixelRatio || 1;
    const resize = () => {
      dpr = window.devicePixelRatio || 1;
      canvas.width = size * dpr;
      canvas.height = size * dpr;
      canvas.style.width = `${size}px`;
      canvas.style.height = `${size}px`;
    };
    resize();

    const nodes: Node[] = SERVICES.map((label, i) => {
      const angle = (i / SERVICES.length) * Math.PI * 2 - Math.PI / 2;
      return {
        x: 0.5 + Math.cos(angle) * 0.36,
        y: 0.5 + Math.sin(angle) * 0.36,
        label,
        color: i % 2 === 0 ? '#22c7e3' : '#4ab4ff',
        angle,
      };
    });

    const draw = () => {
      const w = size;
      const h = size;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);
      phaseRef.current += 0.01;

      const cx = w / 2;
      const cy = h / 2;

      // Outer ring
      ctx.beginPath();
      ctx.arc(cx, cy, w * 0.38, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(100,210,240,0.08)';
      ctx.lineWidth = 1;
      ctx.stroke();

      // Animated rotating ring
      ctx.beginPath();
      ctx.arc(cx, cy, w * 0.42, phaseRef.current, phaseRef.current + Math.PI * 0.6);
      ctx.strokeStyle = 'rgba(34,199,227,0.25)';
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(cx, cy, w * 0.42, phaseRef.current + Math.PI, phaseRef.current + Math.PI + Math.PI * 0.4);
      ctx.strokeStyle = 'rgba(74,180,255,0.18)';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Connection lines from nodes to center
      for (const n of nodes) {
        const nx = n.x * w;
        const ny = n.y * h;

        // Data flow pulse
        const t = (phaseRef.current * 0.5 + n.angle) % (Math.PI * 2);
        const pulseT = (Math.sin(t) + 1) / 2;
        const px = cx + (nx - cx) * pulseT;
        const py = cy + (ny - cy) * pulseT;

        // Line
        const lineGrd = ctx.createLinearGradient(cx, cy, nx, ny);
        lineGrd.addColorStop(0, 'rgba(34,199,227,0.4)');
        lineGrd.addColorStop(1, 'rgba(34,199,227,0.05)');
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(nx, ny);
        ctx.strokeStyle = lineGrd;
        ctx.lineWidth = 1.2;
        ctx.stroke();

        // Pulse dot
        const pg = ctx.createRadialGradient(px, py, 0, px, py, 8);
        pg.addColorStop(0, 'rgba(101,230,244,0.8)');
        pg.addColorStop(1, 'rgba(101,230,244,0)');
        ctx.fillStyle = pg;
        ctx.beginPath();
        ctx.arc(px, py, 8, 0, Math.PI * 2);
        ctx.fill();
      }

      // Outer nodes
      for (const n of nodes) {
        const nx = n.x * w;
        const ny = n.y * h;
        const r = 5;

        // Glow
        const ng = ctx.createRadialGradient(nx, ny, 0, nx, ny, 20);
        ng.addColorStop(0, n.color + 'aa');
        ng.addColorStop(0.5, n.color + '22');
        ng.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = ng;
        ctx.beginPath();
        ctx.arc(nx, ny, 20, 0, Math.PI * 2);
        ctx.fill();

        // Core
        ctx.fillStyle = n.color;
        ctx.beginPath();
        ctx.arc(nx, ny, r, 0, Math.PI * 2);
        ctx.fill();

        // Ring
        ctx.beginPath();
        ctx.arc(nx, ny, r + 4, 0, Math.PI * 2);
        ctx.strokeStyle = n.color + '40';
        ctx.lineWidth = 1;
        ctx.stroke();

        // Label
        ctx.fillStyle = '#a0d8ee';
        ctx.font = '10px ui-sans-serif, system-ui';
        ctx.textAlign = 'center';
        const labelOffset = 16;
        const dx = Math.cos(n.angle);
        const dy = Math.sin(n.angle);
        ctx.fillText(n.label, nx + dx * labelOffset, ny + dy * labelOffset + 3);
      }

      // Center node — Results
      const pulse = 1 + Math.sin(Date.now() * 0.003) * 0.12;
      const cr = 10 * pulse;

      // Outer glow
      const cg = ctx.createRadialGradient(cx, cy, 0, cx, cy, cr * 5);
      cg.addColorStop(0, 'rgba(101,230,244,0.6)');
      cg.addColorStop(0.3, 'rgba(34,199,227,0.25)');
      cg.addColorStop(1, 'rgba(14,165,217,0)');
      ctx.fillStyle = cg;
      ctx.beginPath();
      ctx.arc(cx, cy, cr * 5, 0, Math.PI * 2);
      ctx.fill();

      // Core
      const cg2 = ctx.createRadialGradient(cx - 3, cy - 3, 0, cx, cy, cr);
      cg2.addColorStop(0, '#e9fbff');
      cg2.addColorStop(0.6, '#65e6f4');
      cg2.addColorStop(1, '#0ea5d9');
      ctx.fillStyle = cg2;
      ctx.beginPath();
      ctx.arc(cx, cy, cr, 0, Math.PI * 2);
      ctx.fill();

      // Ring around center
      ctx.beginPath();
      ctx.arc(cx, cy, cr + 8, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(101,230,244,0.3)';
      ctx.lineWidth = 1;
      ctx.stroke();

      ctx.fillStyle = '#e9fbff';
      ctx.font = 'bold 10px ui-sans-serif, system-ui';
      ctx.textAlign = 'center';
      ctx.fillText('RESULTS', cx, cy + cr + 18);

      rafRef.current = requestAnimationFrame(draw);
    };

    rafRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(rafRef.current);
  }, [size]);

  return (
    <div className="ecosystem-wrap" style={{ width: size, height: size }}>
      <canvas ref={canvasRef} />
    </div>
  );
}
