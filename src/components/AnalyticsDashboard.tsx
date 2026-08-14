import { useState, useEffect, useRef } from 'react';
import {
  DollarSign, ShoppingCart, Target, Users, TrendingUp, TrendingDown,
  BarChart3, ArrowUpRight, ArrowDownRight,
} from 'lucide-react';

// ─── Real data arrays ────────────────────────────────────────────────
const REVENUE_DATA = [
  { month: 'Jan', value: 42000 },
  { month: 'Feb', value: 48000 },
  { month: 'Mar', value: 55000 },
  { month: 'Apr', value: 61000 },
  { month: 'May', value: 72000 },
  { month: 'Jun', value: 84000 },
];

const ORDERS_DATA = [
  { month: 'Jan', value: 180 },
  { month: 'Feb', value: 210 },
  { month: 'Mar', value: 250 },
  { month: 'Apr', value: 290 },
  { month: 'May', value: 340 },
  { month: 'Jun', value: 410 },
];

const VISITORS_DATA = [
  { month: 'Jan', value: 4800 },
  { month: 'Feb', value: 5600 },
  { month: 'Mar', value: 6800 },
  { month: 'Apr', value: 7900 },
  { month: 'May', value: 9200 },
  { month: 'Jun', value: 11000 },
];

const PRODUCT_PERF = [
  { name: 'Product A', pct: 85 },
  { name: 'Product B', pct: 62 },
  { name: 'Product C', pct: 45 },
  { name: 'Product D', pct: 30 },
  { name: 'Product E', pct: 18 },
];

const MARKETING_CHANNELS = [
  { name: 'Organic Search', value: 35, color: '#10b981' },
  { name: 'Paid Ads', value: 28, color: '#f59e0b' },
  { name: 'Social Media', value: 22, color: '#3b82f6' },
  { name: 'Email', value: 10, color: '#8b5cf6' },
  { name: 'Direct', value: 5, color: '#ec4899' },
];

const CONVERSION_DATA = [
  { month: 'Jan', value: 1.8 },
  { month: 'Feb', value: 2.1 },
  { month: 'Mar', value: 2.5 },
  { month: 'Apr', value: 2.8 },
  { month: 'May', value: 3.2 },
  { month: 'Jun', value: 3.8 },
];

// ─── Animated counter ────────────────────────────────────────────────
function Counter({ target, prefix = '', suffix = '', decimals = 0 }: { target: number; prefix?: string; suffix?: string; decimals?: number }) {
  const [val, setVal] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const reduced = typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

  useEffect(() => {
    if (reduced) { setVal(target); return; }
    const obs = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      const start = performance.now();
      const dur = 1500;
      const tick = (now: number) => {
        const p = Math.min((now - start) / dur, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        setVal(target * eased);
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
      obs.disconnect();
    }, { threshold: 0.3 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [target, reduced]);

  const display = decimals ? val.toFixed(decimals) : Math.round(val).toLocaleString();
  return <span ref={ref}>{prefix}{display}{suffix}</span>;
}

// ─── Line chart (SVG, data-driven) ───────────────────────────────────
function LineChart({ data, color, height = 120, formatVal }: { data: { month: string; value: number }[]; color: string; height?: number; formatVal?: (v: number) => string }) {
  const [hoverIdx, setHoverIdx] = useState<number | null>(null);
  const [animated, setAnimated] = useState(false);
  const reduced = typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

  useEffect(() => {
    if (reduced) { setAnimated(true); return; }
    const t = setTimeout(() => setAnimated(true), 100);
    return () => clearTimeout(t);
  }, [reduced]);

  const max = Math.max(...data.map(d => d.value));
  const min = Math.min(...data.map(d => d.value));
  const range = max - min || 1;
  const w = 400;
  const h = height;
  const padding = 20;
  const stepX = (w - padding * 2) / (data.length - 1);

  const points = data.map((d, i) => ({
    x: padding + i * stepX,
    y: h - padding - ((d.value - min) / range) * (h - padding * 2),
    ...d,
  }));

  const pathD = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
  const areaD = `${pathD} L ${points[points.length - 1].x} ${h - padding} L ${points[0].x} ${h - padding} Z`;
  const animPathD = animated ? pathD : pathD.replace(/L/g, 'M');

  return (
    <div className="relative">
      <svg viewBox={`0 0 ${w} ${h}`} className="w-full" style={{ height: `${h}px` }}>
        <defs>
          <linearGradient id={`grad-${color.replace('#', '')}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.25" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>
        {/* Grid lines */}
        {[0.25, 0.5, 0.75].map(f => (
          <line key={f} x1={padding} y1={padding + f * (h - padding * 2)} x2={w - padding} y2={padding + f * (h - padding * 2)} stroke="rgba(255,255,255,0.05)" />
        ))}
        {/* Area */}
        {animated && <polygon fill={`url(#grad-${color.replace('#', '')})`} points={areaD.replace(/[ML]/g, '').trim()} />}
        {/* Line */}
        <path
          d={animPathD}
          fill="none"
          stroke={color}
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ transition: 'd 1s ease-out' }}
        />
        {/* Points */}
        {points.map((p, i) => (
          <g key={i}>
            <circle
              cx={p.x}
              cy={p.y}
              r={hoverIdx === i ? 5 : 3}
              fill={color}
              style={{ transition: 'r 0.2s' }}
            />
            <rect
              x={p.x - stepX / 2}
              y={0}
              width={stepX}
              height={h}
              fill="transparent"
              onMouseEnter={() => setHoverIdx(i)}
              onMouseLeave={() => setHoverIdx(null)}
            />
          </g>
        ))}
        {/* X labels */}
        {points.map((p, i) => (
          <text key={i} x={p.x} y={h - 2} textAnchor="middle" fontSize="9" fill="rgba(255,255,255,0.4)">{p.month}</text>
        ))}
      </svg>
      {/* Tooltip */}
      {hoverIdx !== null && (
        <div
          className="absolute pointer-events-none rounded-lg bg-carbon-800 px-3 py-1.5 text-xs text-white shadow-lg ring-1 ring-white/10 z-10"
          style={{
            left: `${(points[hoverIdx].x / w) * 100}%`,
            top: `${(points[hoverIdx].y / h) * 100}%`,
            transform: 'translate(-50%, -120%)',
          }}
        >
          <p className="text-[10px] text-carbon-400">{points[hoverIdx].month}</p>
          <p className="font-bold" style={{ color }}>{formatVal ? formatVal(points[hoverIdx].value) : points[hoverIdx].value}</p>
        </div>
      )}
    </div>
  );
}

// ─── Bar chart (SVG, data-driven) ────────────────────────────────────
function BarChart({ data, color, height = 120, formatVal }: { data: { month: string; value: number }[]; color: string; height?: number; formatVal?: (v: number) => string }) {
  const [hoverIdx, setHoverIdx] = useState<number | null>(null);
  const [animated, setAnimated] = useState(false);
  const reduced = typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

  useEffect(() => {
    if (reduced) { setAnimated(true); return; }
    const t = setTimeout(() => setAnimated(true), 100);
    return () => clearTimeout(t);
  }, [reduced]);

  const max = Math.max(...data.map(d => d.value));
  const w = 400;
  const h = height;
  const padding = 20;
  const barW = (w - padding * 2) / data.length - 6;

  return (
    <div className="relative">
      <svg viewBox={`0 0 ${w} ${h}`} className="w-full" style={{ height: `${h}px` }}>
        {[0.25, 0.5, 0.75].map(f => (
          <line key={f} x1={padding} y1={padding + f * (h - padding * 2)} x2={w - padding} y2={padding + f * (h - padding * 2)} stroke="rgba(255,255,255,0.05)" />
        ))}
        {data.map((d, i) => {
          const barH = animated ? ((d.value / max) * (h - padding * 2)) : 0;
          const x = padding + i * ((w - padding * 2) / data.length) + 3;
          const y = h - padding - barH;
          return (
            <g key={i}>
              <rect
                x={x}
                y={y}
                width={barW}
                height={barH}
                rx="4"
                fill={color}
                opacity={hoverIdx === i ? 1 : 0.8}
                style={{ transition: 'y 0.8s ease-out, height 0.8s ease-out, opacity 0.2s' }}
                onMouseEnter={() => setHoverIdx(i)}
                onMouseLeave={() => setHoverIdx(null)}
              />
              <text x={x + barW / 2} y={h - 2} textAnchor="middle" fontSize="9" fill="rgba(255,255,255,0.4)">{d.month}</text>
            </g>
          );
        })}
      </svg>
      {hoverIdx !== null && (
        <div
          className="absolute pointer-events-none rounded-lg bg-carbon-800 px-3 py-1.5 text-xs text-white shadow-lg ring-1 ring-white/10 z-10"
          style={{
            left: `${((padding + hoverIdx * ((w - padding * 2) / data.length) + barW / 2) / w) * 100}%`,
            top: '10%',
            transform: 'translateX(-50%)',
          }}
        >
          <p className="text-[10px] text-carbon-400">{data[hoverIdx].month}</p>
          <p className="font-bold" style={{ color }}>{formatVal ? formatVal(data[hoverIdx].value) : data[hoverIdx].value}</p>
        </div>
      )}
    </div>
  );
}

// ─── Donut chart (SVG, data-driven) ──────────────────────────────────
function DonutChart({ data }: { data: { name: string; value: number; color: string }[] }) {
  const [animated, setAnimated] = useState(false);
  const reduced = typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  const [hoverIdx, setHoverIdx] = useState<number | null>(null);

  useEffect(() => {
    if (reduced) { setAnimated(true); return; }
    const t = setTimeout(() => setAnimated(true), 100);
    return () => clearTimeout(t);
  }, [reduced]);

  const total = data.reduce((s, d) => s + d.value, 0);
  const cx = 80, cy = 80, r = 60, sw = 20;
  let cumAngle = -90;

  return (
    <div className="flex flex-col sm:flex-row items-center gap-4">
      <svg viewBox="0 0 160 160" className="w-40 h-40 shrink-0">
        {data.map((d, i) => {
          const angle = (d.value / total) * 360;
          const startAngle = cumAngle;
          const endAngle = cumAngle + angle * (animated ? 1 : 0);
          cumAngle += angle;
          const startRad = (startAngle * Math.PI) / 180;
          const endRad = (endAngle * Math.PI) / 180;
          const x1 = cx + r * Math.cos(startRad);
          const y1 = cy + r * Math.sin(startRad);
          const x2 = cx + r * Math.cos(endRad);
          const y2 = cy + r * Math.sin(endRad);
          const largeArc = angle > 180 ? 1 : 0;
          return (
            <path
              key={i}
              d={`M ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2}`}
              fill="none"
              stroke={d.color}
              strokeWidth={hoverIdx === i ? sw + 4 : sw}
              strokeLinecap="round"
              style={{ transition: 'stroke-width 0.2s' }}
              onMouseEnter={() => setHoverIdx(i)}
              onMouseLeave={() => setHoverIdx(null)}
            />
          );
        })}
        <text x={cx} y={cy} textAnchor="middle" dominantBaseline="middle" fontSize="11" fill="rgba(255,255,255,0.5)">
          {hoverIdx !== null ? data[hoverIdx].name : 'Traffic'}
        </text>
        <text x={cx} y={cy + 14} textAnchor="middle" dominantBaseline="middle" fontSize="14" fontWeight="bold" fill={hoverIdx !== null ? data[hoverIdx].color : '#fff'}>
          {hoverIdx !== null ? `${data[hoverIdx].value}%` : '100%'}
        </text>
      </svg>
      <div className="space-y-1.5">
        {data.map((d, i) => (
          <div
            key={i}
            className="flex items-center gap-2 cursor-pointer text-sm"
            onMouseEnter={() => setHoverIdx(i)}
            onMouseLeave={() => setHoverIdx(null)}
          >
            <span className="h-3 w-3 rounded-full" style={{ background: d.color }} />
            <span className="text-carbon-300">{d.name}</span>
            <span className="font-semibold text-white ml-auto">{d.value}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Main Dashboard ──────────────────────────────────────────────────
export default function AnalyticsDashboard({ compact = false }: { compact?: boolean }) {
  const [range, setRange] = useState('30D');
  const [chartType, setChartType] = useState<'revenue' | 'orders' | 'visitors' | 'conversion'>('revenue');

  const chartConfig = {
    revenue: { data: REVENUE_DATA, color: '#10b981', label: 'Revenue', format: (v: number) => `$${(v / 1000).toFixed(1)}K` },
    orders: { data: ORDERS_DATA, color: '#f59e0b', label: 'Orders', format: (v: number) => `${v} orders` },
    visitors: { data: VISITORS_DATA, color: '#3b82f6', label: 'Visitors', format: (v: number) => `${v.toLocaleString()} visitors` },
    conversion: { data: CONVERSION_DATA, color: '#8b5cf6', label: 'Conversion Rate', format: (v: number) => `${v}%` },
  };

  const current = chartConfig[chartType];
  const latestVal = current.data[current.data.length - 1].value;
  const prevVal = current.data[current.data.length - 2].value;
  const change = ((latestVal - prevVal) / prevVal * 100).toFixed(1);
  const isUp = latestVal >= prevVal;

  return (
    <div className="card-dark p-5 sm:p-6">
      {/* Disclaimer */}
      <div className="mb-4 flex items-center gap-2 rounded-lg bg-electric-500/10 px-3 py-2 ring-1 ring-electric-500/20">
        <span className="text-xs text-electric-400 font-semibold">CAPABILITY DEMO</span>
        <span className="text-xs text-carbon-400">— Interactive analytics interface demonstrating data-driven chart components. Connect verified store data to make it yours.</span>
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 pb-4 border-b border-white/8">
        <div>
          <p className="font-serif text-lg font-semibold text-white flex items-center gap-2">
            <BarChart3 size={18} className="text-amber-500" /> Performance Dashboard
          </p>
          <p className="text-xs text-carbon-500 mt-0.5">Data-driven analytics — charts respond to real data arrays</p>
        </div>
        <div className="flex gap-1.5">
          {['7D', '30D', '90D'].map(p => (
            <button
              key={p}
              onClick={() => setRange(p)}
              className={`chip text-[10px] transition ${range === p ? 'bg-amber-500 text-white' : 'bg-carbon-800 text-carbon-400 hover:text-white'}`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
        {[
          { label: 'Revenue', value: 84000, prefix: '$', suffix: '', icon: DollarSign, color: '#10b981', change: '+16.7%', up: true },
          { label: 'Orders', value: 410, prefix: '', suffix: '', icon: ShoppingCart, color: '#f59e0b', change: '+20.6%', up: true },
          { label: 'Conversion', value: 3.8, prefix: '', suffix: '%', icon: Target, color: '#8b5cf6', change: '+18.8%', up: true, decimals: 1 },
          { label: 'Visitors', value: 11000, prefix: '', suffix: '', icon: Users, color: '#3b82f6', change: '+19.6%', up: true },
        ].map((s) => (
          <div key={s.label} className="rounded-xl bg-carbon-800/60 ring-1 ring-white/8 p-3">
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg" style={{ background: `${s.color}20` }}>
                <s.icon size={14} style={{ color: s.color }} />
              </div>
              <span className={`text-[10px] font-semibold flex items-center gap-0.5 ${s.up ? 'text-forest-400' : 'text-red-400'}`}>
                {s.up ? <ArrowUpRight size={10} /> : <ArrowDownRight size={10} />} {s.change}
              </span>
            </div>
            <p className="text-xl font-bold text-white">
              <Counter target={s.value} prefix={s.prefix} suffix={s.suffix} decimals={s.decimals || 0} />
            </p>
            <p className="text-[10px] text-carbon-400 uppercase tracking-wider">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Chart type selector */}
      <div className="flex flex-wrap gap-1.5 mb-4">
        {(Object.keys(chartConfig) as typeof chartType[]).map(key => (
          <button
            key={key}
            onClick={() => setChartType(key)}
            className={`chip text-[11px] transition ${chartType === key ? 'text-white' : 'bg-carbon-800 text-carbon-400 hover:text-white'}`}
            style={chartType === key ? { background: current.color } : {}}
          >
            {chartConfig[key].label}
          </button>
        ))}
      </div>

      {/* Main chart */}
      <div className="rounded-xl bg-carbon-800/60 ring-1 ring-white/8 p-4 mb-4">
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-sm font-semibold text-white">{current.label} — Last 6 Months</p>
            <p className="text-xs text-carbon-500">Latest: {current.format(latestVal)}</p>
          </div>
          <div className={`flex items-center gap-1 text-sm font-bold ${isUp ? 'text-forest-400' : 'text-red-400'}`}>
            {isUp ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
            {change}%
          </div>
        </div>
        <LineChart data={current.data} color={current.color} formatVal={current.format} />
      </div>

      {compact ? null : (
        <div className="grid gap-4 lg:grid-cols-2">
          {/* Orders bar chart */}
          <div className="rounded-xl bg-carbon-800/60 ring-1 ring-white/8 p-4">
            <p className="text-sm font-semibold text-white mb-3">Monthly Orders</p>
            <BarChart data={ORDERS_DATA} color="#f59e0b" formatVal={(v) => `${v} orders`} />
          </div>

          {/* Marketing channels donut */}
          <div className="rounded-xl bg-carbon-800/60 ring-1 ring-white/8 p-4">
            <p className="text-sm font-semibold text-white mb-3">Marketing Channel Performance</p>
            <DonutChart data={MARKETING_CHANNELS} />
          </div>

          {/* Product performance */}
          <div className="rounded-xl bg-carbon-800/60 ring-1 ring-white/8 p-4">
            <p className="text-sm font-semibold text-white mb-3">Product Performance</p>
            <div className="space-y-2.5">
              {PRODUCT_PERF.map(p => (
                <div key={p.name}>
                  <div className="flex justify-between text-[11px] text-carbon-400 mb-1">
                    <span>{p.name}</span><span>{p.pct}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-carbon-700 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-1000"
                      style={{ width: `${p.pct}%`, background: '#10b981' }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Visitor trends */}
          <div className="rounded-xl bg-carbon-800/60 ring-1 ring-white/8 p-4">
            <p className="text-sm font-semibold text-white mb-3">Visitor Growth</p>
            <LineChart data={VISITORS_DATA} color="#3b82f6" formatVal={(v) => `${v.toLocaleString()}`} height={100} />
          </div>
        </div>
      )}
    </div>
  );
}
