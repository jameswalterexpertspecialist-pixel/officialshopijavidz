import { useEffect, useRef, useCallback } from 'react';

type Vec3 = [number, number, number];

// ─── Simplified continent outlines [lat, lon] ───────────────────────
const CONTINENTS: [number, number][][] = [
  // North America
  [[71,-156],[68,-140],[65,-120],[60,-100],[55,-82],[48,-75],[44,-65],[40,-72],[35,-78],[30,-82],[26,-80],[24,-88],[22,-98],[25,-106],[28,-114],[35,-120],[40,-124],[48,-127],[55,-132],[60,-148],[65,-160],[71,-156]],
  // Central America
  [[18,-92],[15,-88],[12,-83],[10,-78],[14,-84],[18,-92]],
  // South America
  [[12,-72],[8,-62],[2,-50],[-8,-42],[-18,-42],[-25,-48],[-32,-55],[-40,-62],[-50,-68],[-54,-70],[-48,-73],[-35,-72],[-22,-70],[-12,-77],[-2,-79],[5,-77],[12,-72]],
  // Europe
  [[70,28],[66,22],[60,18],[56,8],[53,2],[50,-5],[46,-4],[44,1],[42,8],[40,14],[42,28],[46,35],[52,38],[58,35],[64,32],[68,30],[70,28]],
  // Africa
  [[35,-8],[33,3],[32,12],[30,22],[27,30],[22,36],[16,40],[12,43],[8,48],[2,46],[-5,42],[-12,40],[-18,37],[-25,33],[-32,28],[-35,20],[-33,15],[-28,16],[-22,14],[-15,12],[-8,10],[-2,6],[4,2],[10,-2],[18,-10],[25,-12],[30,-10],[35,-8]],
  // Asia (mainland)
  [[72,28],[70,40],[68,55],[66,70],[68,85],[70,100],[70,115],[68,130],[65,145],[60,160],[55,165],[50,158],[45,145],[42,135],[38,128],[35,122],[30,120],[25,115],[20,108],[15,102],[10,98],[8,100],[12,103],[16,98],[20,92],[24,88],[22,78],[26,72],[30,65],[34,55],[38,48],[42,42],[46,38],[50,35],[55,33],[60,35],[65,38],[70,33],[72,28]],
  // Japan
  [[45,143],[42,141],[37,138],[34,134],[33,131],[35,133],[38,137],[42,140],[45,143]],
  // UK + Ireland
  [[58,-2],[56,-5],[53,-5],[51,-2],[50,1],[53,2],[56,0],[58,-2]],
  // Australia
  [[-11,131],[-13,138],[-16,145],[-22,150],[-30,152],[-37,150],[-38,142],[-35,136],[-34,128],[-32,122],[-28,116],[-23,113],[-18,118],[-14,123],[-11,131]],
  // Greenland
  [[83,-30],[80,-18],[75,-18],[70,-25],[64,-38],[68,-48],[75,-55],[80,-45],[83,-30]],
  // Madagascar
  [[-12,47],[-15,48],[-20,47],[-24,45],[-25,43],[-22,41],[-18,42],[-14,44],[-12,47]],
  // New Zealand North
  [[-34,173],[-36,175],[-39,176],[-41,174],[-39,172],[-36,172],[-34,173]],
  // New Zealand South
  [[-42,170],[-44,172],[-46,168],[-45,166],[-43,167],[-42,170]],
  // Indonesia / Borneo / Philippines (simplified)
  [[6,95],[3,98],[-2,103],[-4,108],[-2,114],[1,118],[3,125],[6,122],[5,115],[3,110],[5,104],[6,95]],
  // Sri Lanka
  [[9,80],[7,81],[6,80],[8,79],[9,80]],
  // Antarctica
  [[-62,-178],[-64,-150],[-68,-125],[-70,-100],[-73,-75],[-75,-50],[-78,-25],[-80,0],[-78,25],[-75,50],[-72,75],[-70,100],[-68,125],[-65,150],[-62,178],[-90,178],[-90,-178],[-62,-178]],
  // Iceland
  [[66,-14],[64,-22],[65,-13],[66,-14]],
  // Cuba / Caribbean (simplified)
  [[22,-78],[20,-76],[21,-74],[23,-80],[22,-78]],
  // New Guinea
  [[-1,131],[-3,136],[-8,142],[-10,148],[-8,150],[-3,144],[0,138],[-1,131]],
  // Scandinavia (merged with Europe but extra definition)
  [[70,22],[68,15],[63,8],[58,6],[58,12],[62,18],[66,20],[70,22]],
];

// ─── Grid precomputation ────────────────────────────────────────────
const STEP = 2.5; // degrees
interface Cell { lat: number; lon: number; land: boolean; }
const GRID: Cell[] = [];

function pointInPoly(lat: number, lon: number, poly: [number, number][]): boolean {
  let inside = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const [lati, loni] = poly[i];
    const [latj, lonj] = poly[j];
    if (((lati > lat) !== (latj > lat)) &&
        (lon < (lonj - loni) * (lat - lati) / (latj - lati) + loni)) {
      inside = !inside;
    }
  }
  return inside;
}

for (let lat = -90; lat <= 90; lat += STEP) {
  for (let lon = -180; lon <= 180; lon += STEP) {
    let land = false;
    for (const c of CONTINENTS) {
      if (pointInPoly(lat, lon, c)) { land = true; break; }
    }
    GRID.push({ lat, lon, land });
  }
}

// ─── 3D math ────────────────────────────────────────────────────────
function latLonToVec3(lat: number, lon: number, r: number): Vec3 {
  const phi = (lat * Math.PI) / 180;
  const theta = (lon * Math.PI) / 180;
  return [r * Math.cos(phi) * Math.cos(theta), r * Math.sin(phi), r * Math.cos(phi) * Math.sin(theta)];
}
function rotY([x, y, z]: Vec3, a: number): Vec3 {
  const c = Math.cos(a), s = Math.sin(a);
  return [x * c + z * s, y, -x * s + z * c];
}
function rotX([x, y, z]: Vec3, a: number): Vec3 {
  const c = Math.cos(a), s = Math.sin(a);
  return [x, y * c - z * s, y * s + z * c];
}

// Light direction (normalized) — upper-left-front
const LIGHT: Vec3 = ((): Vec3 => {
  const v: Vec3 = [-0.45, -0.55, -0.7];
  const m = Math.hypot(v[0], v[1], v[2]);
  return [v[0] / m, v[1] / m, v[2] / m];
})();

function landColor(lat: number): [number, number, number] {
  const a = Math.abs(lat);
  if (a > 68) return [200, 215, 225]; // polar snow
  if (a > 55) return [120, 140, 115]; // tundra
  if (a > 35) return [85, 115, 70];   // temperate
  if (a > 15) return [110, 135, 65];  // subtropical / mixed
  return [55, 105, 55];               // tropical
}

export default function InteractiveGlobe({ size = 420 }: { size?: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rotYRef = useRef(0);
  const rotXRef = useRef(-0.35);
  const velYRef = useRef(0.003);
  const velXRef = useRef(0);
  const draggingRef = useRef(false);
  const lastXRef = useRef(0);
  const lastYRef = useRef(0);
  const rafRef = useRef(0);

  const onDown = useCallback((cx: number, cy: number) => {
    draggingRef.current = true;
    lastXRef.current = cx;
    lastYRef.current = cy;
    velYRef.current = 0;
    velXRef.current = 0;
  }, []);

  const onMove = useCallback((cx: number, cy: number) => {
    if (!draggingRef.current) return;
    const dx = cx - lastXRef.current;
    const dy = cy - lastYRef.current;
    velYRef.current = dx * 0.006;
    velXRef.current = -dy * 0.006;
    rotYRef.current += velYRef.current;
    rotXRef.current += velXRef.current;
    rotXRef.current = Math.max(-1.2, Math.min(1.2, rotXRef.current));
    lastXRef.current = cx;
    lastYRef.current = cy;
  }, []);

  const onUp = useCallback(() => { draggingRef.current = false; }, []);

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

      const scale = w * 0.40;
      const R = 1;
      const cx = w / 2;
      const cy = h / 2;

      // ── Atmosphere glow (outer) ──
      const atmoGrd = ctx.createRadialGradient(cx, cy, scale * 0.95, cx, cy, scale * 1.25);
      atmoGrd.addColorStop(0, 'rgba(74,144,217,0.25)');
      atmoGrd.addColorStop(0.4, 'rgba(40,110,190,0.12)');
      atmoGrd.addColorStop(1, 'rgba(10,40,80,0)');
      ctx.fillStyle = atmoGrd;
      ctx.beginPath();
      ctx.arc(cx, cy, scale * 1.25, 0, Math.PI * 2);
      ctx.fill();

      // ── Ocean base sphere ──
      const oceanGrd = ctx.createRadialGradient(cx - scale * 0.3, cy - scale * 0.3, 0, cx, cy, scale);
      oceanGrd.addColorStop(0, 'rgba(20,75,120,1)');
      oceanGrd.addColorStop(0.5, 'rgba(10,50,85,1)');
      oceanGrd.addColorStop(1, 'rgba(4,25,50,1)');
      ctx.fillStyle = oceanGrd;
      ctx.beginPath();
      ctx.arc(cx, cy, scale, 0, Math.PI * 2);
      ctx.fill();

      // ── Draw land/ocean grid points ──
      const dotSize = (scale * 2 * Math.PI * STEP) / 360 / 2;
      for (const cell of GRID) {
        const v = rotX(rotY(latLonToVec3(cell.lat, cell.lon, R), rotYRef.current), rotXRef.current);
        if (v[2] >= 0) continue; // back face culling (z>0 is behind)

        const persp = 1; // orthographic-ish; sphere already provides depth
        const px = cx + v[0] * scale;
        const py = cy + v[1] * scale;

        // Lambertian lighting
        const normal: Vec3 = [v[0], v[1], v[2]];
        const nm = Math.hypot(normal[0], normal[1], normal[2]);
        const dot = (normal[0] / nm) * LIGHT[0] + (normal[1] / nm) * LIGHT[1] + (normal[2] / nm) * LIGHT[2];
        const bright = Math.max(0.08, Math.min(1, dot * 0.85 + 0.25));

        // Edge fade (atmospheric perspective near rim)
        const edgeFade = 1 - v[2] * 0.8; // v[2] ranges [-1,0] on front face; closer to 0 = near edge
        const alpha = Math.max(0, Math.min(1, edgeFade));

        if (cell.land) {
          const [r, g, b] = landColor(cell.lat);
          ctx.fillStyle = `rgba(${(r * bright) | 0},${(g * bright) | 0},${(b * bright) | 0},${alpha})`;
        } else {
          const r = 12 * bright + 8;
          const g = 55 * bright + 15;
          const b = 95 * bright + 20;
          ctx.fillStyle = `rgba(${r | 0},${g | 0},${b | 0},${alpha * 0.85})`;
        }
        ctx.fillRect(px - dotSize, py - dotSize, dotSize * 2.1, dotSize * 2.1);
      }

      // ── Subtle latitude lines ──
      ctx.strokeStyle = 'rgba(100,160,210,0.08)';
      ctx.lineWidth = 0.6;
      for (let lat = -60; lat <= 60; lat += 30) {
        ctx.beginPath();
        for (let lon = 0; lon <= 360; lon += 4) {
          const v = rotX(rotY(latLonToVec3(lat, lon, R), rotYRef.current), rotXRef.current);
          if (v[2] > 0) { ctx.stroke(); ctx.beginPath(); continue; }
          const px = cx + v[0] * scale;
          const py = cy + v[1] * scale;
          if (lon === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
        }
        ctx.stroke();
      }

      // ── Equator (slightly more visible) ──
      ctx.strokeStyle = 'rgba(100,180,220,0.12)';
      ctx.lineWidth = 0.8;
      ctx.beginPath();
      for (let lon = 0; lon <= 360; lon += 4) {
        const v = rotX(rotY(latLonToVec3(0, lon, R), rotYRef.current), rotXRef.current);
        if (v[2] > 0) { ctx.stroke(); ctx.beginPath(); continue; }
        const px = cx + v[0] * scale;
        const py = cy + v[1] * scale;
        if (lon === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
      }
      ctx.stroke();

      // ── Rim highlight (atmosphere edge) ──
      ctx.strokeStyle = 'rgba(120,190,240,0.4)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(cx, cy, scale, 0, Math.PI * 2);
      ctx.stroke();

      // Inner rim glow
      const rimGrd = ctx.createRadialGradient(cx, cy, scale * 0.82, cx, cy, scale);
      rimGrd.addColorStop(0, 'rgba(0,0,0,0)');
      rimGrd.addColorStop(1, 'rgba(40,120,200,0.3)');
      ctx.fillStyle = rimGrd;
      ctx.beginPath();
      ctx.arc(cx, cy, scale, 0, Math.PI * 2);
      ctx.fill();

      // ── Rotation physics ──
      if (!draggingRef.current) {
        rotYRef.current += velYRef.current;
        rotXRef.current += velXRef.current;
        velYRef.current *= 0.96;
        velXRef.current *= 0.96;
        // Resume gentle auto-rotation
        if (Math.abs(velYRef.current) < 0.003) velYRef.current += 0.0003;
        // Return tilt to default slowly
        rotXRef.current += (-0.35 - rotXRef.current) * 0.01;
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
