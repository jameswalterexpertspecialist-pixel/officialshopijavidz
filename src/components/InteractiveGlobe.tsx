import { useEffect, useRef, useCallback } from 'react';

type Vec3 = [number, number, number];

const NODES: { pos: Vec3; label: string; color: string }[] = [
  { pos: [0, 1, 0], label: 'Store', color: '#22c7e3' },
  { pos: [0.78, 0.52, 0.35], label: 'Marketing', color: '#65e6f4' },
  { pos: [-0.78, 0.52, 0.35], label: 'Branding', color: '#4ab4ff' },
  { pos: [0.72, -0.38, -0.52], label: 'Technology', color: '#22c7e3' },
  { pos: [-0.72, -0.38, -0.52], label: 'Creative', color: '#168cff' },
  { pos: [0.38, 0.82, -0.42], label: 'Business', color: '#65e6f4' },
  { pos: [-0.38, 0.82, -0.42], label: 'Strategy', color: '#4ab4ff' },
  { pos: [0, -0.95, 0.31], label: 'Growth', color: '#22c7e3' },
];

const ARCS = NODES.map((_, i) => i);

const LAT_LINES = 7;
const LON_LINES = 12;

function latLonToVec3(lat: number, lon: number, r: number): Vec3 {
  const phi = (lat * Math.PI) / 180;
  const theta = (lon * Math.PI) / 180;
  return [r * Math.cos(phi) * Math.cos(theta), r * Math.sin(phi), r * Math.cos(phi) * Math.sin(theta)];
}

function rotateY([x, y, z]: Vec3, a: number): Vec3 {
  const c = Math.cos(a), s = Math.sin(a);
  return [x * c + z * s, y, -x * s + z * c];
}
function rotateX([x, y, z]: Vec3, a: number): Vec3 {
  const c = Math.cos(a), s = Math.sin(a);
  return [x, y * c - z * s, y * s + z * c];
}

function project([x, y, z]: Vec3, w: number, h: number, scale: number) {
  const persp = 500 / (500 + z * scale);
  return { x: w / 2 + x * scale * persp, y: h / 2 + y * scale * persp, z, scale: persp };
}

export default function InteractiveGlobe({ size = 420 }: { size?: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rotY = useRef(0.3);
  const rotX = useRef(-0.25);
  const velY = useRef(0.004);
  const velX = useRef(0);
  const dragging = useRef(false);
  const lastX = useRef(0);
  const lastY = useRef(0);
  const glowPhase = useRef(0);
  const rafRef = useRef<number>(0);

  const onDown = useCallback((clientX: number, clientY: number) => {
    dragging.current = true;
    lastX.current = clientX;
    lastY.current = clientY;
    velY.current = 0;
    velX.current = 0;
  }, []);

  const onMove = useCallback((clientX: number, clientY: number) => {
    if (!dragging.current) return;
    const dx = clientX - lastX.current;
    const dy = clientY - lastY.current;
    velY.current = dx * 0.008;
    velX.current = -dy * 0.008;
    rotY.current += velY.current;
    rotX.current += velX.current;
    rotX.current = Math.max(-1.2, Math.min(1.2, rotX.current));
    lastX.current = clientX;
    lastY.current = clientY;
  }, []);

  const onUp = useCallback(() => { dragging.current = false; }, []);

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

    const draw = () => {
      const w = size;
      const h = size;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);

      const scale = w * 0.38;
      const R = 1;

      // Background glow
      const grd = ctx.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, w * 0.5);
      grd.addColorStop(0, 'rgba(14,165,217,0.12)');
      grd.addColorStop(0.5, 'rgba(14,165,217,0.04)');
      grd.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = grd;
      ctx.fillRect(0, 0, w, h);

      // Globe sphere fill
      const sphereGrd = ctx.createRadialGradient(w * 0.42, h * 0.38, 0, w / 2, h / 2, scale);
      sphereGrd.addColorStop(0, 'rgba(20,50,80,0.45)');
      sphereGrd.addColorStop(0.7, 'rgba(8,20,35,0.55)');
      sphereGrd.addColorStop(1, 'rgba(4,10,20,0.7)');
      ctx.beginPath();
      ctx.arc(w / 2, h / 2, scale, 0, Math.PI * 2);
      ctx.fillStyle = sphereGrd;
      ctx.fill();

      // Latitude/longitude grid
      const gridLines: { pts: { x: number; y: number; z: number }[]; alpha: number }[] = [];
      for (let lat = -80; lat <= 80; lat += 160 / LAT_LINES) {
        const pts: { x: number; y: number; z: number }[] = [];
        for (let lon = 0; lon <= 360; lon += 6) {
          const v = rotateX(rotateY(latLonToVec3(lat, lon, R), rotY.current), rotX.current);
          const p = project(v, w, h, scale);
          pts.push(p);
        }
        gridLines.push({ pts, alpha: 1 });
      }
      for (let lon = 0; lon < 360; lon += 360 / LON_LINES) {
        const pts: { x: number; y: number; z: number }[] = [];
        for (let lat = -90; lat <= 90; lat += 6) {
          const v = rotateX(rotateY(latLonToVec3(lat, lon, R), rotY.current), rotX.current);
          const p = project(v, w, h, scale);
          pts.push(p);
        }
        gridLines.push({ pts, alpha: 1 });
      }

      // Draw grid lines sorted by average z (back to front)
      gridLines.sort((a, b) => {
        const az = a.pts.reduce((s, p) => s + p.z, 0) / a.pts.length;
        const bz = b.pts.reduce((s, p) => s + p.z, 0) / b.pts.length;
        return bz - az;
      });
      for (const line of gridLines) {
        const avgZ = line.pts.reduce((s, p) => s + p.z, 0) / line.pts.length;
        const alpha = avgZ > 0 ? 0.06 : 0.16;
        ctx.beginPath();
        line.pts.forEach((p, i) => { if (i === 0) ctx.moveTo(p.x, p.y); else ctx.lineTo(p.x, p.y); });
        ctx.strokeStyle = `rgba(100,210,240,${alpha})`;
        ctx.lineWidth = 0.8;
        ctx.stroke();
      }

      // Connection arcs between nodes (through center)
      const projectedNodes = NODES.map(n => {
        const v = rotateX(rotateY(n.pos, rotY.current), rotX.current);
        return { ...n, proj: project(v, w, h, scale), raw: v };
      });

      // Draw arcs from each node to center (Results)
      for (const n of projectedNodes) {
        const opacity = n.proj.z > 0.3 ? 0.08 : 0.25;
        ctx.beginPath();
        ctx.moveTo(w / 2, h / 2);
        ctx.lineTo(n.proj.x, n.proj.y);
        ctx.strokeStyle = `rgba(100,210,240,${opacity})`;
        ctx.lineWidth = 0.6;
        ctx.stroke();
      }

      // Traveling glow pulse along a random arc
      glowPhase.current += 0.012;
      const glowIdx = Math.floor(glowPhase.current) % ARCS.length;
      const glowT = glowPhase.current - Math.floor(glowPhase.current);
      const glowNode = projectedNodes[glowIdx];
      const gx = w / 2 + (glowNode.proj.x - w / 2) * glowT;
      const gy = h / 2 + (glowNode.proj.y - h / 2) * glowT;
      const glowGrd = ctx.createRadialGradient(gx, gy, 0, gx, gy, 18);
      glowGrd.addColorStop(0, 'rgba(101,230,244,0.9)');
      glowGrd.addColorStop(0.4, 'rgba(34,199,227,0.4)');
      glowGrd.addColorStop(1, 'rgba(14,165,217,0)');
      ctx.fillStyle = glowGrd;
      ctx.beginPath();
      ctx.arc(gx, gy, 18, 0, Math.PI * 2);
      ctx.fill();

      // Draw nodes
      const sorted = [...projectedNodes].sort((a, b) => b.proj.z - a.proj.z);
      for (const n of sorted) {
        const r = 4 * n.proj.scale;
        const opacity = n.proj.z > 0.4 ? 0.35 : 1;
        // Glow
        const ng = ctx.createRadialGradient(n.proj.x, n.proj.y, 0, n.proj.x, n.proj.y, r * 4);
        ng.addColorStop(0, n.color + 'cc');
        ng.addColorStop(0.5, n.color + '33');
        ng.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.globalAlpha = opacity;
        ctx.fillStyle = ng;
        ctx.beginPath();
        ctx.arc(n.proj.x, n.proj.y, r * 4, 0, Math.PI * 2);
        ctx.fill();
        // Core
        ctx.fillStyle = n.color;
        ctx.beginPath();
        ctx.arc(n.proj.x, n.proj.y, r, 0, Math.PI * 2);
        ctx.fill();
        // Label
        if (n.proj.z < 0.2) {
          ctx.globalAlpha = Math.max(0, 1 - n.proj.z * 3);
          ctx.fillStyle = '#cdefff';
          ctx.font = `${10 * n.proj.scale}px ui-sans-serif, system-ui`;
          ctx.textAlign = 'center';
          ctx.fillText(n.label, n.proj.x, n.proj.y - r - 6);
        }
        ctx.globalAlpha = 1;
      }

      // Center "Results" node
      const pulse = 1 + Math.sin(Date.now() * 0.003) * 0.15;
      const cr = 7 * pulse;
      const cg = ctx.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, cr * 5);
      cg.addColorStop(0, 'rgba(101,230,244,1)');
      cg.addColorStop(0.3, 'rgba(34,199,227,0.5)');
      cg.addColorStop(1, 'rgba(14,165,217,0)');
      ctx.fillStyle = cg;
      ctx.beginPath();
      ctx.arc(w / 2, h / 2, cr * 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#e9fbff';
      ctx.beginPath();
      ctx.arc(w / 2, h / 2, cr, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#cdefff';
      ctx.font = 'bold 11px ui-sans-serif, system-ui';
      ctx.textAlign = 'center';
      ctx.fillText('RESULTS', w / 2, h / 2 + cr + 16);

      // Momentum
      if (!dragging.current) {
        rotY.current += velY.current;
        rotX.current += velX.current;
        velY.current *= 0.96;
        velX.current *= 0.96;
        // Gentle auto-rotation when nearly stopped
        if (Math.abs(velY.current) < 0.002) velY.current += 0.0003;
        rotX.current *= 0.99;
        if (Math.abs(rotX.current) < 0.01) rotX.current = 0;
      }

      rafRef.current = requestAnimationFrame(draw);
    };

    rafRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(rafRef.current);
  }, [size]);

  return (
    <div
      className="globe-container"
      style={{ width: size, height: size, touchAction: 'none' }}
      onPointerDown={(e) => { e.currentTarget.setPointerCapture(e.pointerId); onDown(e.clientX, e.clientY); }}
      onPointerMove={(e) => onMove(e.clientX, e.clientY)}
      onPointerUp={(e) => { e.currentTarget.releasePointerCapture(e.pointerId); onUp(); }}
      onPointerLeave={() => onUp()}
    >
      <canvas ref={canvasRef} />
      <p className="globe-hint">Drag to rotate</p>
    </div>
  );
}
