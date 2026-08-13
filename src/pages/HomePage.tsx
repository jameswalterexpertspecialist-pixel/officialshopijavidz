import { useEffect, useRef, useState } from 'react';
import {
  ArrowRight, TrendingUp, ShoppingBag, Globe, Package, Tag, Box, Store,
  Megaphone, Sparkles, Search, Compass, Briefcase, Palette, Target, Heart,
  Check, Users, DollarSign, ShoppingCart, BarChart3, ChevronRight, Award,
  ClipboardCheck, Hammer, Smartphone, CreditCard, FileText, Mail,
  Video, Scissors, Image, PenTool, Layout, Calculator, Folder, Lightbulb,
  MessageSquare, Network, Film, RefreshCw, Settings, RotateCcw, UserPlus,
  Calendar, Share2, Star,
} from 'lucide-react';
import { useHashRoute } from '../lib/router';
import {
  SERVICES, PLATFORMS, SERVICE_CATEGORIES, PROCESS_STEPS, TRUST_CARDS,
  MARQUEE_PLATFORMS, RESULT_JOURNEY, AGENCY_EMAIL, FOUNDED_YEAR,
} from '../lib/data';

// ─── Icon resolver ───────────────────────────────────────────────────
const iconMap: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  ShoppingBag, ShoppingCart, Globe, Package, Tag, Box, Store, Megaphone,
  Sparkles, Search, Compass, Briefcase, Palette, Target, Heart, TrendingUp,
  ClipboardCheck, Hammer, Smartphone, CreditCard, FileText, Mail, Video,
  Scissors, Image, PenTool, Layout, Calculator, Folder, Lightbulb,
  MessageSquare, Network, Film, RefreshCw, Settings, RotateCcw, UserPlus,
  Calendar, Share2, Star, Award, Users, DollarSign, BarChart3, ArrowRight,
};

function Icon({ name, size, className }: { name: string; size?: number; className?: string }) {
  const C = iconMap[name] || Sparkles;
  return <C size={size} className={className} />;
}

// ─── Animated counter ────────────────────────────────────────────────
function Counter({ target, suffix, prefix, decimals }: { target: number; suffix: string; prefix?: string; decimals?: number }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;

  useEffect(() => {
    if (reduced) { setCount(target); return; }
    const obs = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      let cur = 0;
      const dur = 1800;
      const start = performance.now();
      const tick = (now: number) => {
        const p = Math.min((now - start) / dur, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        cur = target * eased;
        setCount(cur);
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
      obs.disconnect();
    }, { threshold: 0.4 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [target, reduced]);

  const val = decimals ? count.toFixed(decimals) : Math.round(count);
  return <span ref={ref}>{prefix}{val}{suffix}</span>;
}

// ─── Reveal-on-scroll wrapper ────────────────────────────────────────
function Reveal({ children, delay = 0, className = '' }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;

  useEffect(() => {
    if (reduced) { setVisible(true); return; }
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setVisible(true); obs.disconnect(); }
    }, { threshold: 0.15 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [reduced]);

  return (
    <div
      ref={ref}
      className={`${className} transition-all duration-700 ease-out ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

// ─── Platform mockups for hero cycling ───────────────────────────────
const HERO_FRAMES = [
  { label: 'Shopify Store', color: '#96bf48' },
  { label: 'Wix Store', color: '#0c80ef' },
  { label: 'WooCommerce', color: '#7f54b3' },
  { label: 'Etsy Shop', color: '#f56400' },
  { label: 'Amazon Listing', color: '#ff9900' },
  { label: 'Marketing Dashboard', color: '#10b981' },
  { label: 'Sales Analytics', color: '#f59e0b' },
  { label: 'Customer Growth', color: '#3b82f6' },
];

function HeroMockup({ frame }: { frame: number }) {
  const f = HERO_FRAMES[frame];
  return (
    <div className="relative w-full max-w-lg mx-auto">
      {/* Browser chrome */}
      <div className="rounded-2xl bg-carbon-900 ring-1 ring-white/15 shadow-2xl overflow-hidden">
        <div className="flex items-center gap-1.5 px-4 py-3 border-b border-white/8">
          <span className="h-3 w-3 rounded-full bg-red-400/70" />
          <span className="h-3 w-3 rounded-full bg-amber-400/70" />
          <span className="h-3 w-3 rounded-full bg-forest-400/70" />
          <span className="ml-3 flex-1 rounded-md bg-carbon-800 px-3 py-1 text-[10px] text-carbon-500 font-mono">officialshopijavid.com/{f.label.toLowerCase().replace(/\s/g, '-')}</span>
        </div>

        {/* Content area — animated per frame type */}
        <div className="relative h-72 sm:h-80 overflow-hidden" style={{ background: `linear-gradient(135deg, ${f.color}08, transparent)` }}>
          {frame < 5 && <StorefrontMockup color={f.color} frame={frame} />}
          {frame === 5 && <DashboardMockup color={f.color} />}
          {frame === 6 && <SalesGraphMockup color={f.color} />}
          {frame === 7 && <GrowthMockup color={f.color} />}
        </div>
      </div>

      {/* Floating accent card */}
      <div className="absolute -bottom-4 -left-4 rounded-xl bg-carbon-800 ring-1 ring-white/15 p-3 shadow-lift animate-bounce-in hidden sm:block">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg" style={{ background: `${f.color}20` }}>
            <TrendingUp size={16} style={{ color: f.color }} />
          </div>
          <div>
            <p className="text-[10px] text-carbon-400 uppercase tracking-wider">Live</p>
            <p className="text-sm font-semibold text-white">{f.label}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function StorefrontMockup({ color, frame }: { color: string; frame: number }) {
  const products = [
    { name: 'Product One', price: '$49.99', badge: 'New' },
    { name: 'Product Two', price: '$89.00', badge: 'Sale' },
    { name: 'Product Three', price: '$24.50', badge: '' },
  ];
  return (
    <div className="animate-fade-in p-4">
      {/* Nav bar */}
      <div className="flex items-center justify-between mb-4">
        <div className="h-5 w-24 rounded-full" style={{ background: `${color}40` }} />
        <div className="flex gap-2">
          {[60, 50, 45].map((w, i) => <div key={i} className="h-3 rounded-full bg-white/10" style={{ width: w }} />)}
        </div>
        <div className="h-7 w-7 rounded-full" style={{ background: `${color}30` }} />
      </div>
      {/* Hero banner */}
      <div className="rounded-xl mb-4 h-16 flex items-center px-4" style={{ background: `linear-gradient(90deg, ${color}25, ${color}08)` }}>
        <div>
          <div className="h-2.5 w-32 rounded-full bg-white/20 mb-1.5" />
          <div className="h-2 w-20 rounded-full bg-white/10" />
        </div>
      </div>
      {/* Product grid */}
      <div className="grid grid-cols-3 gap-2">
        {products.map((p, i) => (
          <div key={i} className="rounded-lg bg-carbon-800/60 ring-1 ring-white/5 p-2 transition-all" style={{ animationDelay: `${i * 200}ms` }}>
            <div className="h-16 rounded-md mb-2" style={{ background: `linear-gradient(135deg, ${color}30, ${color}10)` }}>
              {p.badge && <span className="inline-block mt-1 ml-1 text-[8px] px-1.5 py-0.5 rounded-full text-white" style={{ background: color }}>{p.badge}</span>}
            </div>
            <div className="h-2 w-full rounded-full bg-white/15 mb-1" />
            <div className="h-2 w-2/3 rounded-full bg-white/10 mb-2" />
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-semibold text-white">{p.price}</span>
              <div className="h-4 w-4 rounded" style={{ background: `${color}50` }} />
            </div>
          </div>
        ))}
      </div>
      {/* CTA bar */}
      <div className="mt-3 flex gap-2">
        <div className="h-8 flex-1 rounded-lg" style={{ background: color }} />
        <div className="h-8 w-8 rounded-lg bg-carbon-700" />
      </div>
    </div>
  );
}

function DashboardMockup({ color }: { color: string }) {
  return (
    <div className="animate-fade-in p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="h-3 w-28 rounded-full bg-white/20" />
        <div className="flex gap-1.5">
          <div className="h-6 w-12 rounded-md" style={{ background: `${color}30` }} />
          <div className="h-6 w-12 rounded-md bg-white/10" />
        </div>
      </div>
      <div className="grid grid-cols-3 gap-2 mb-3">
        {['Revenue', 'Orders', 'CTR'].map((l, i) => (
          <div key={l} className="rounded-lg bg-carbon-800/60 ring-1 ring-white/5 p-2">
            <p className="text-[8px] text-carbon-400 uppercase">{l}</p>
            <p className="text-sm font-bold mt-0.5" style={{ color }}>
              {['$12.4K', '347', '3.8%'][i]}
            </p>
            <div className="mt-1 flex items-end gap-0.5 h-4">
              {[40, 60, 45, 80, 65, 90].map((h, j) => (
                <div key={j} className="flex-1 rounded-sm" style={{ height: `${h}%`, background: `${color}60` }} />
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="rounded-lg bg-carbon-800/60 ring-1 ring-white/5 p-3">
        <div className="h-2 w-20 rounded-full bg-white/15 mb-2" />
        <svg viewBox="0 0 200 50" className="w-full h-16">
          <polyline
            fill="none"
            stroke={color}
            strokeWidth="2"
            points="0,45 30,38 60,40 90,28 120,22 150,15 200,8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <polygon fill={`${color}20`} points="0,45 30,38 60,40 90,28 120,22 150,15 200,8 200,50 0,50" />
        </svg>
      </div>
    </div>
  );
}

function SalesGraphMockup({ color }: { color: string }) {
  return (
    <div className="animate-fade-in p-4 h-full flex flex-col">
      <div className="flex items-center justify-between mb-3">
        <div>
          <div className="h-3 w-32 rounded-full bg-white/20 mb-1" />
          <div className="h-2 w-20 rounded-full bg-white/10" />
        </div>
        <div className="flex items-center gap-1 text-[10px] font-semibold" style={{ color }}>
          <TrendingUp size={12} /> +24.7%
        </div>
      </div>
      <div className="flex-1 flex items-end gap-1.5 pb-2">
        {[35, 50, 42, 60, 55, 72, 65, 80, 75, 90, 85, 95].map((h, i) => (
          <div key={i} className="flex-1 rounded-t-md transition-all duration-500" style={{ height: `${h}%`, background: `linear-gradient(to top, ${color}, ${color}60)`, animationDelay: `${i * 50}ms` }} />
        ))}
      </div>
      <div className="flex justify-between text-[8px] text-carbon-500">
        {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'].map(m => <span key={m}>{m}</span>)}
      </div>
    </div>
  );
}

function GrowthMockup({ color }: { color: string }) {
  return (
    <div className="animate-fade-in p-4 h-full flex flex-col justify-center">
      <div className="grid grid-cols-2 gap-3">
        {[
          { label: 'Customers', value: '2,847', icon: Users },
          { label: 'New This Week', value: '183', icon: UserPlus },
          { label: 'Retention', value: '68%', icon: Heart },
          { label: 'Avg Order', value: '$67.40', icon: ShoppingCart },
        ].map((s, i) => (
          <div key={i} className="rounded-lg bg-carbon-800/60 ring-1 ring-white/5 p-3">
            <s.icon size={16} style={{ color }} />
            <p className="text-lg font-bold text-white mt-1">{s.value}</p>
            <p className="text-[8px] text-carbon-400 uppercase tracking-wider">{s.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Store demo tabs ─────────────────────────────────────────────────
const STORE_TABS = ['Shopify', 'Wix', 'WooCommerce', 'Etsy', 'Amazon'] as const;

function StoreDemo({ active }: { active: number }) {
  const platform = STORE_TABS[active];
  const colors = ['#96bf48', '#0c80ef', '#7f54b3', '#f56400', '#ff9900'];
  const c = colors[active];

  return (
    <div className="rounded-2xl bg-carbon-900 ring-1 ring-white/10 overflow-hidden shadow-lift">
      {/* Browser bar */}
      <div className="flex items-center gap-1.5 px-4 py-3 border-b border-white/8 bg-carbon-850">
        <span className="h-3 w-3 rounded-full bg-red-400/60" />
        <span className="h-3 w-3 rounded-full bg-amber-400/60" />
        <span className="h-3 w-3 rounded-full bg-forest-400/60" />
        <span className="ml-3 flex-1 rounded-md bg-carbon-800 px-3 py-1 text-[10px] text-carbon-500 font-mono truncate">
          {platform.toLowerCase()}.com/store — {platform} storefront
        </span>
      </div>

      {/* Storefront content */}
      <div className="p-4 sm:p-6 min-h-[320px]" key={active}>
        <div className="animate-fade-in">
          {/* Store header */}
          <div className="flex items-center justify-between mb-5 pb-4 border-b border-white/8">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg" style={{ background: c }} />
              <span className="font-serif text-lg font-semibold text-white">{platform} Store</span>
            </div>
            <div className="hidden sm:flex gap-3 text-[10px] text-carbon-400">
              <span>Home</span><span>Shop</span><span>About</span><span>Contact</span>
              <div className="flex items-center gap-1 text-white"><ShoppingCart size={12} /> 3</div>
            </div>
          </div>

          {/* Hero banner */}
          <div className="rounded-xl mb-5 h-20 sm:h-24 flex items-center px-5" style={{ background: `linear-gradient(120deg, ${c}22, ${c}05)` }}>
            <div>
              <p className="font-serif text-base sm:text-lg font-semibold text-white">New Collection</p>
              <p className="text-[10px] text-carbon-400">Premium products for modern customers</p>
            </div>
            <div className="ml-auto h-7 px-3 rounded-full flex items-center text-[10px] font-semibold text-white" style={{ background: c }}>
              Shop Now
            </div>
          </div>

          {/* Product cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {[
              { name: 'Premium Item', price: '$49.99', rating: 4.8, badge: 'Bestseller' },
              { name: 'Classic Set', price: '$89.00', rating: 4.9, badge: 'New' },
              { name: 'Signature Pro', price: '$129.50', rating: 4.7, badge: '' },
            ].map((p, i) => (
              <div key={i} className="rounded-xl bg-carbon-800/50 ring-1 ring-white/8 p-3 transition hover:ring-white/20 hover:-translate-y-0.5">
                <div className="relative h-20 rounded-lg mb-2" style={{ background: `linear-gradient(135deg, ${c}25, ${c}08)` }}>
                  {p.badge && <span className="absolute top-1 left-1 text-[8px] px-1.5 py-0.5 rounded-full text-white font-semibold" style={{ background: c }}>{p.badge}</span>}
                </div>
                <p className="text-xs font-semibold text-white truncate">{p.name}</p>
                <div className="flex items-center gap-0.5 mt-0.5">
                  <Star size={8} className="fill-amber-500 text-amber-500" />
                  <span className="text-[9px] text-carbon-400">{p.rating}</span>
                </div>
                <div className="flex items-center justify-between mt-1.5">
                  <span className="text-xs font-bold" style={{ color: c }}>{p.price}</span>
                  <div className="h-5 w-5 rounded flex items-center justify-center" style={{ background: `${c}30` }}>
                    <ShoppingCart size={10} style={{ color: c }} />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Trust row */}
          <div className="mt-5 flex flex-wrap gap-3 text-[9px] text-carbon-500">
            <span className="flex items-center gap-1"><Check size={10} style={{ color: c }} /> Secure Checkout</span>
            <span className="flex items-center gap-1"><Check size={10} style={{ color: c }} /> Free Shipping</span>
            <span className="flex items-center gap-1"><Check size={10} style={{ color: c }} /> 30-Day Returns</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main component ──────────────────────────────────────────────────
export default function HomePage() {
  const { navigate } = useHashRoute();
  const [heroFrame, setHeroFrame] = useState(0);
  const [storeTab, setStoreTab] = useState(0);
  const [serviceFilter, setServiceFilter] = useState('All');
  const [faqOpen, setFaqOpen] = useState<number | null>(null);
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [marqueeOffset, setMarqueeOffset] = useState(0);
  const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;

  // Hero frame cycling
  useEffect(() => {
    if (reduced) return;
    const t = setInterval(() => setHeroFrame(f => (f + 1) % HERO_FRAMES.length), 3500);
    return () => clearInterval(t);
  }, [reduced]);

  // Marquee
  useEffect(() => {
    if (reduced) return;
    const t = setInterval(() => setMarqueeOffset(o => o - 1), 30);
    return () => clearInterval(t);
  }, [reduced]);

  const featuredServices = SERVICES.slice(0, 6);

  const filterOptions = ['All', ...SERVICE_CATEGORIES.map(c => c.name.split(' ')[0])];
  const filteredCategories = serviceFilter === 'All'
    ? SERVICE_CATEGORIES
    : SERVICE_CATEGORIES.filter(c => c.name.startsWith(serviceFilter));

  return (
    <div className="overflow-x-hidden">
      {/* ═══════════════════════════════════════════════════════════════
          HERO SECTION — Animated commerce ecosystem
      ═══════════════════════════════════════════════════════════════ */}
      <section className="relative min-h-screen flex items-center pt-20 overflow-hidden bg-carbon-950">
        {/* Background grid */}
        <div className="absolute inset-0 grid-bg opacity-20" />
        <div className="absolute left-1/2 top-0 -translate-x-1/2 h-px w-3/4 bg-gradient-to-r from-transparent via-amber-500/30 to-transparent" />
        {/* Glow orbs */}
        <div className="absolute -left-32 top-1/4 h-96 w-96 rounded-full bg-forest-600/10 blur-3xl" />
        <div className="absolute -right-32 bottom-1/4 h-96 w-96 rounded-full bg-amber-500/8 blur-3xl" />

        <div className="container-page relative py-12 lg:py-0">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            {/* Left: text */}
            <div className="text-center lg:text-left">
              <span className="eyebrow animate-fade-in">Premium Digital Commerce Agency</span>
              <h1 className="mt-5 font-serif text-4xl font-semibold leading-[1.1] text-white sm:text-5xl lg:text-6xl">
                Building Better<br />
                <span className="amber-text">Digital Commerce</span><br />
                Experiences
              </h1>
              <p className="mx-auto lg:mx-0 mt-6 max-w-xl text-base sm:text-lg text-carbon-300 leading-relaxed">
                From ecommerce stores and digital branding to marketing, optimization and business solutions — Official Shopijavid helps businesses turn their ideas into stronger digital experiences and measurable growth.
              </p>
              <div className="mt-8 flex flex-wrap items-center justify-center lg:justify-start gap-3">
                <button onClick={() => navigate('/contact')} className="btn-amber">Start a Project <ArrowRight size={16} /></button>
                <button onClick={() => navigate('/services')} className="btn-ghost">Explore Our Services</button>
              </div>
              <p className="mt-6 text-xs font-semibold tracking-[0.3em] uppercase text-carbon-400">
                One ecosystem. Multiple solutions. <span className="text-amber-500">One objective — results.</span>
              </p>
            </div>

            {/* Right: animated mockup */}
            <div className="relative">
              <HeroMockup frame={heroFrame} />
              {/* Frame indicators */}
              <div className="mt-6 flex flex-wrap justify-center gap-1.5">
                {HERO_FRAMES.map((f, i) => (
                  <button
                    key={i}
                    onClick={() => setHeroFrame(i)}
                    className={`h-1.5 rounded-full transition-all ${i === heroFrame ? 'w-6 bg-amber-500' : 'w-1.5 bg-white/20'}`}
                    aria-label={f.label}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          SALES & GROWTH DASHBOARD — Illustrative
      ═══════════════════════════════════════════════════════════════ */}
      <section className="section bg-carbon-950">
        <div className="container-page">
          <Reveal className="mb-12 text-center">
            <span className="eyebrow">Illustrative Growth Dashboard</span>
            <h2 className="mt-4 section-title">Visualizing Business Growth</h2>
            <p className="mx-auto mt-4 max-w-lg text-carbon-400">An illustration of the metrics we help businesses track and improve. Numbers shown are illustrative, not actual client results.</p>
          </Reveal>

          <Reveal>
            <div className="card-dark p-6 sm:p-8">
              {/* Dashboard header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-white/8">
                <div>
                  <p className="font-serif text-xl font-semibold text-white">Performance Overview</p>
                  <p className="text-xs text-carbon-500 mt-0.5">Illustrative — not actual client data</p>
                </div>
                <div className="flex gap-2">
                  {['7D', '30D', '90D'].map((p, i) => (
                    <button key={p} className={`chip text-[10px] ${i === 1 ? 'bg-amber-500 text-white' : 'bg-carbon-800 text-carbon-400'}`}>{p}</button>
                  ))}
                </div>
              </div>

              {/* Stat cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                {[
                  { label: 'Revenue', value: 84.2, prefix: '$', suffix: 'K', icon: DollarSign, color: '#10b981' },
                  { label: 'Orders', value: 1247, prefix: '', suffix: '', icon: ShoppingCart, color: '#f59e0b' },
                  { label: 'Conversion', value: 3.8, prefix: '', suffix: '%', icon: Target, color: '#3b82f6', decimals: 1 },
                  { label: 'Customers', value: 2847, prefix: '', suffix: '', icon: Users, color: '#8b5cf6' },
                ].map((s, i) => (
                  <Reveal key={s.label} delay={i * 100}>
                    <div className="rounded-xl bg-carbon-800/60 ring-1 ring-white/8 p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg" style={{ background: `${s.color}20` }}>
                          <s.icon size={16} style={{ color: s.color }} />
                        </div>
                        <span className="text-[10px] font-semibold text-forest-400 flex items-center gap-0.5">
                          <TrendingUp size={10} /> +{[12, 8, 4, 15][i]}%
                        </span>
                      </div>
                      <p className="text-2xl font-bold text-white">
                        <Counter target={s.value} prefix={s.prefix} suffix={s.suffix} decimals={s.decimals} />
                      </p>
                      <p className="text-[10px] text-carbon-400 uppercase tracking-wider mt-0.5">{s.label}</p>
                    </div>
                  </Reveal>
                ))}
              </div>

              {/* Chart row */}
              <div className="grid gap-4 lg:grid-cols-3">
                {/* Main chart */}
                <Reveal className="lg:col-span-2" delay={200}>
                  <div className="rounded-xl bg-carbon-800/60 ring-1 ring-white/8 p-4">
                    <div className="flex items-center justify-between mb-4">
                      <p className="text-sm font-semibold text-white">Revenue Trend</p>
                      <div className="flex items-center gap-1 text-[10px] text-forest-400"><TrendingUp size={12} /> Illustrative</div>
                    </div>
                    <svg viewBox="0 0 400 120" className="w-full h-32">
                      <defs>
                        <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#10b981" stopOpacity="0.3" />
                          <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
                        </linearGradient>
                      </defs>
                      {/* Grid lines */}
                      {[20, 50, 80, 110].map(y => <line key={y} x1="0" y1={y} x2="400" y2={y} stroke="rgba(255,255,255,0.05)" />)}
                      <polygon fill="url(#revGrad)" points="0,110 0,90 40,85 80,75 120,70 160,55 200,50 240,38 280,30 320,22 360,15 400,10 400,110" />
                      <polyline fill="none" stroke="#10b981" strokeWidth="2.5" points="0,90 40,85 80,75 120,70 160,55 200,50 240,38 280,30 320,22 360,15 400,10" strokeLinecap="round" strokeLinejoin="round" />
                      {/* Dots */}
                      {[[0,90],[80,75],[160,55],[240,38],[320,22],[400,10]].map(([x,y],i) => <circle key={i} cx={x} cy={y} r="3" fill="#10b981" />)}
                    </svg>
                  </div>
                </Reveal>

                {/* Side stats */}
                <Reveal delay={300}>
                  <div className="rounded-xl bg-carbon-800/60 ring-1 ring-white/8 p-4 space-y-3">
                    <p className="text-sm font-semibold text-white mb-2">Product Performance</p>
                    {[
                      { name: 'Product A', pct: 85, color: '#10b981' },
                      { name: 'Product B', pct: 62, color: '#f59e0b' },
                      { name: 'Product C', pct: 45, color: '#3b82f6' },
                      { name: 'Product D', pct: 30, color: '#8b5cf6' },
                    ].map(p => (
                      <div key={p.name}>
                        <div className="flex justify-between text-[10px] text-carbon-400 mb-1">
                          <span>{p.name}</span><span>{p.pct}%</span>
                        </div>
                        <div className="h-1.5 rounded-full bg-carbon-700 overflow-hidden">
                          <div className="h-full rounded-full" style={{ width: `${p.pct}%`, background: p.color }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </Reveal>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          COMMERCE PLATFORMS — "Your Business. Every Opportunity."
      ═══════════════════════════════════════════════════════════════ */}
      <section className="section bg-carbon-900">
        <div className="container-page">
          <Reveal className="mb-12 text-center">
            <span className="eyebrow">Platforms We Work Across</span>
            <h2 className="mt-4 section-title">Your Business.<br />Every Opportunity.</h2>
            <p className="mx-auto mt-4 max-w-lg text-carbon-400">Official Shopijavid works across multiple ecommerce platforms and digital channels. We do not claim official partnerships — we work across these platforms to help your business grow.</p>
          </Reveal>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {PLATFORMS.map((p, i) => (
              <Reveal key={p.id} delay={i * 100}>
                <div className="group card-dark p-6 h-full transition-all hover:-translate-y-1.5 hover:shadow-lift">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl text-white font-bold text-lg" style={{ background: p.color }}>
                      {p.name[0]}
                    </div>
                    <div>
                      <h3 className="font-serif text-xl font-semibold text-white">{p.name}</h3>
                      <p className="text-[10px] text-carbon-400">{p.tagline}</p>
                    </div>
                  </div>
                  <p className="text-sm text-carbon-400 leading-relaxed mb-4">{p.desc}</p>
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {p.services.map(s => (
                      <span key={s} className="chip text-[10px] bg-carbon-800 text-carbon-300 ring-1 ring-white/5">{s}</span>
                    ))}
                  </div>
                  <button onClick={() => navigate('/services')} className="text-xs font-semibold text-amber-500 flex items-center gap-1 group-hover:gap-2 transition-all">
                    Explore <ArrowRight size={12} />
                  </button>
                </div>
              </Reveal>
            ))}

            {/* "More Platforms" card */}
            <Reveal delay={PLATFORMS.length * 100}>
              <div className="card-dark p-6 h-full flex flex-col items-center justify-center text-center border-dashed">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-carbon-800 text-carbon-400 mb-3">
                  <Store size={22} />
                </div>
                <h3 className="font-serif text-lg font-semibold text-white">And More</h3>
                <p className="text-sm text-carbon-400 mt-2">Working across additional platforms and custom solutions based on your needs.</p>
                <button onClick={() => navigate('/contact')} className="btn-outline-amber btn-sm mt-4">Ask About Your Platform</button>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          LIVE STORE DEMONSTRATION — "See What We Build."
      ═══════════════════════════════════════════════════════════════ */}
      <section className="section bg-carbon-950">
        <div className="container-page">
          <Reveal className="mb-10 text-center">
            <span className="eyebrow">Store Demonstrations</span>
            <h2 className="mt-4 section-title">See What We Build</h2>
            <p className="mx-auto mt-4 max-w-lg text-carbon-400">Interactive storefront mockups across platforms. Click a tab to see how a store looks and functions.</p>
          </Reveal>

          <Reveal>
            {/* Tabs */}
            <div className="flex flex-wrap justify-center gap-2 mb-6">
              {STORE_TABS.map((tab, i) => (
                <button
                  key={tab}
                  onClick={() => setStoreTab(i)}
                  className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all ${storeTab === i ? 'bg-amber-500 text-white shadow-amber' : 'bg-carbon-900 text-carbon-400 ring-1 ring-white/10 hover:text-white'}`}
                >
                  {tab}
                </button>
              ))}
            </div>
            <StoreDemo active={storeTab} />
          </Reveal>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          SERVICES PREVIEW — Categorized
      ═══════════════════════════════════════════════════════════════ */}
      <section className="section bg-carbon-900">
        <div className="container-page">
          <Reveal className="mb-10 text-center">
            <span className="eyebrow">Our Services</span>
            <h2 className="mt-4 section-title">Everything Your Business Needs</h2>
            <p className="mx-auto mt-4 max-w-lg text-carbon-400">From ecommerce development to marketing, business services, creative media, and strategy — organized by category.</p>
          </Reveal>

          {/* Category filter */}
          <Reveal className="mb-8">
            <div className="flex flex-wrap justify-center gap-2">
              {filterOptions.map(f => (
                <button
                  key={f}
                  onClick={() => setServiceFilter(f)}
                  className={`chip transition ${serviceFilter === f ? 'bg-amber-500 text-white' : 'bg-carbon-900 text-carbon-400 ring-1 ring-white/10 hover:text-white'}`}
                >
                  {f}
                </button>
              ))}
            </div>
          </Reveal>

          {/* Service categories */}
          <div className="space-y-10">
            {filteredCategories.map((cat, ci) => (
              <Reveal key={cat.id} delay={ci * 100}>
                <div>
                  <div className="flex items-center gap-3 mb-5">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/15 text-amber-500">
                      <Icon name={cat.icon} size={20} />
                    </div>
                    <h3 className="font-serif text-2xl font-semibold text-white">{cat.name}</h3>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {cat.services.map((s, si) => (
                      <div
                        key={s.name}
                        className="group card-dark p-5 transition-all hover:-translate-y-1 hover:ring-amber-500/20 hover:shadow-lift"
                      >
                        <div className="flex items-start gap-3">
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-carbon-800 text-amber-500 group-hover:bg-amber-500 group-hover:text-white transition-colors">
                            <Icon name={s.icon} size={16} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-white text-sm">{s.name}</h4>
                            <p className="mt-1 text-xs text-carbon-400 leading-relaxed">{s.desc}</p>
                          </div>
                        </div>
                        <button onClick={() => navigate('/services')} className="mt-3 text-[11px] font-semibold text-amber-500 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          Learn More <ChevronRight size={11} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          <div className="mt-10 text-center">
            <button onClick={() => navigate('/services')} className="btn-amber">View All Services <ArrowRight size={16} /></button>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          HOW WE WORK — Process steps
      ═══════════════════════════════════════════════════════════════ */}
      <section className="section bg-carbon-950">
        <div className="container-page">
          <Reveal className="mb-12 text-center">
            <span className="eyebrow">Our Process</span>
            <h2 className="mt-4 section-title">From Vision to Results</h2>
            <p className="mx-auto mt-4 max-w-lg text-carbon-400">A structured approach that moves your business from idea to measurable outcomes.</p>
          </Reveal>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {PROCESS_STEPS.map((step, i) => (
              <Reveal key={step.num} delay={i * 100}>
                <div className="group relative card-dark p-6 transition-all hover:-translate-y-1 hover:shadow-lift">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/15 text-amber-500 group-hover:bg-amber-500 group-hover:text-white transition-colors">
                      <Icon name={step.icon} size={22} />
                    </div>
                    <span className="font-serif text-3xl font-bold text-carbon-800 group-hover:text-amber-500/30 transition-colors">{step.num}</span>
                  </div>
                  <h3 className="font-serif text-lg font-semibold text-white">{step.title}</h3>
                  <p className="mt-2 text-sm text-carbon-400 leading-relaxed">{step.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          TRUST SECTION — "What We Help Businesses Achieve"
      ═══════════════════════════════════════════════════════════════ */}
      <section className="section bg-carbon-900">
        <div className="container-page">
          <Reveal className="mb-12 text-center">
            <span className="eyebrow">Our Value</span>
            <h2 className="mt-4 section-title">What We Help Businesses Achieve</h2>
          </Reveal>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {TRUST_CARDS.map((t, i) => (
              <Reveal key={t.title} delay={i * 80}>
                <div className="group card-dark p-6 h-full transition-all hover:-translate-y-1 hover:shadow-lift">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-forest-600/15 text-forest-400 group-hover:bg-forest-600 group-hover:text-white transition-colors mb-4">
                    <Icon name={t.icon} size={22} />
                  </div>
                  <h3 className="font-serif text-lg font-semibold text-white">{t.title}</h3>
                  <p className="mt-2 text-sm text-carbon-400 leading-relaxed">{t.desc}</p>
                </div>
              </Reveal>
            ))}

            {/* Extra cell — motto */}
            <Reveal delay={TRUST_CARDS.length * 80}>
              <div className="card-forest p-6 h-full flex flex-col justify-center text-center">
                <p className="font-serif text-lg text-white leading-snug">"All That Matters<br />Is Result"</p>
                <p className="mt-2 text-xs text-carbon-400">Our central philosophy.</p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          PLATFORM MARQUEE
      ═══════════════════════════════════════════════════════════════ */}
      <section className="py-12 bg-carbon-950 border-y border-white/5 overflow-hidden">
        <div className="container-page mb-6">
          <p className="text-center text-xs font-semibold uppercase tracking-[0.3em] text-carbon-500">Platforms & Channels We Work Across</p>
        </div>
        <div className="relative overflow-hidden">
          <div className="flex gap-8 whitespace-nowrap" style={{ transform: `translateX(${marqueeOffset}px)`, willChange: 'transform' }}>
            {[...MARQUEE_PLATFORMS, ...MARQUEE_PLATFORMS, ...MARQUEE_PLATFORMS].map((p, i) => (
              <span key={i} className="font-serif text-xl font-medium text-carbon-600 hover:text-amber-500 transition-colors cursor-default">
                {p}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          RESULT JOURNEY — Animated path
      ═══════════════════════════════════════════════════════════════ */}
      <section className="section bg-carbon-900">
        <div className="container-page">
          <Reveal className="mb-12 text-center">
            <span className="eyebrow">Our Philosophy</span>
            <h2 className="mt-4 section-title">The Journey to Results</h2>
            <p className="mx-auto mt-4 max-w-lg text-carbon-400">Every business moves through these stages. We help you navigate each one.</p>
          </Reveal>

          <Reveal>
            <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
              {RESULT_JOURNEY.map((step, i) => (
                <div key={step.label} className="flex items-center gap-2 sm:gap-3">
                  <div className="group flex flex-col items-center">
                    <div className="flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-2xl bg-carbon-800 ring-1 ring-white/10 text-white font-serif text-xs sm:text-sm font-semibold transition-all hover:bg-amber-500 hover:text-white hover:ring-amber-500 hover:scale-110">
                      {step.label}
                    </div>
                  </div>
                  {i < RESULT_JOURNEY.length - 1 && (
                    <ArrowRight size={16} className="text-carbon-600 shrink-0" />
                  )}
                </div>
              ))}
            </div>
          </Reveal>

          <Reveal className="mt-10 text-center" delay={200}>
            <p className="font-serif text-xl text-carbon-300 italic max-w-2xl mx-auto">
              "Because when everything is said and done, the result is what matters."
            </p>
          </Reveal>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          ABOUT PREVIEW
      ═══════════════════════════════════════════════════════════════ */}
      <section className="section bg-forest-950 relative overflow-hidden">
        <div className="absolute inset-0 noise opacity-5" />
        <div className="absolute -right-32 top-1/2 -translate-y-1/2 h-96 w-96 rounded-full bg-forest-700/15 blur-3xl" />
        <div className="container-page relative">
          <Reveal>
            <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
              <div>
                <span className="eyebrow-forest">Beyond the Store</span>
                <h2 className="mt-4 font-serif text-4xl font-semibold text-white sm:text-5xl">
                  We don't believe a store<br />is only about how it looks
                </h2>
                <p className="mt-5 text-carbon-300 leading-relaxed">
                  A beautiful store is valuable, but customers must also discover the product, understand the product, trust the brand, interact with the store, and ultimately take action. Our approach considers every layer: store, product, brand, customer, marketing, promotion, experience, and growth.
                </p>
                <p className="mt-4 text-carbon-300 leading-relaxed">
                  Founded in {FOUNDED_YEAR} by Jacob David, Official Shopijavid was built on one principle: <span className="text-amber-500 font-semibold">"All That Matters Is Result."</span>
                </p>
                <div className="mt-7 flex flex-wrap gap-3">
                  <button onClick={() => navigate('/portfolio')} className="btn-forest">Learn More About Us</button>
                  <button onClick={() => navigate('/team')} className="btn-ghost">Meet the Team</button>
                </div>
              </div>

              {/* Ecosystem visual */}
              <div className="relative flex items-center justify-center min-h-[300px]">
                <div className="relative">
                  {/* Center */}
                  <div className="relative z-10 flex h-28 w-28 sm:h-32 sm:w-32 items-center justify-center rounded-full bg-amber-500 text-white font-serif text-sm font-bold text-center shadow-amber">
                    Official<br />Shopijavid
                  </div>
                  {/* Orbiting labels */}
                  {['STORE', 'MARKETING', 'BRANDING', 'TECHNOLOGY', 'CREATIVE', 'BUSINESS', 'STRATEGY'].map((label, i) => {
                    const angle = (i / 7) * Math.PI * 2;
                    const r = 130;
                    const x = Math.cos(angle) * r;
                    const y = Math.sin(angle) * r;
                    return (
                      <div
                        key={label}
                        className="absolute flex h-16 w-16 items-center justify-center rounded-xl bg-carbon-900 ring-1 ring-white/15 text-[10px] font-semibold text-white text-center transition-all hover:bg-forest-600 hover:ring-forest-500"
                        style={{
                          left: '50%',
                          top: '50%',
                          transform: `translate(-50%, -50%) translate(${x}px, ${y}px)`,
                        }}
                      >
                        {label}
                      </div>
                    );
                  })}
                  {/* Connecting lines via SVG */}
                  <svg className="absolute inset-0 -m-16 pointer-events-none" style={{ width: 'calc(100% + 128px)', height: 'calc(100% + 128px)' }}>
                    {Array.from({ length: 7 }).map((_, i) => {
                      const angle = (i / 7) * Math.PI * 2;
                      const cx = 144 + Math.cos(angle) * 130;
                      const cy = 144 + Math.sin(angle) * 130;
                      return <line key={i} x1="144" y1="144" x2={cx} y2={cy} stroke="rgba(16,185,129,0.15)" strokeWidth="1" />;
                    })}
                  </svg>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          FAQ
      ═══════════════════════════════════════════════════════════════ */}
      <section className="section bg-carbon-950">
        <div className="container-page max-w-3xl">
          <Reveal className="mb-10 text-center">
            <span className="eyebrow">Questions</span>
            <h2 className="mt-4 section-title">Frequently Asked</h2>
          </Reveal>
          <div className="space-y-3">
            {[
              { q: 'What platforms do you work with?', a: 'We work across Shopify, Wix, WooCommerce, Etsy, Amazon, and more. If your platform is not listed, contact us and we will let you know if we can help.' },
              { q: 'Do you offer services beyond ecommerce?', a: 'Yes. We offer bookkeeping, resume writing, business documentation, consultation, video editing, graphic design, and more. See our Services page for the full list.' },
              { q: 'Is the consultation really free?', a: 'Yes. Your first strategy consultation is completely free with no obligation. We discuss your business and recommend next steps.' },
              { q: 'Do you guarantee results?', a: 'We do not guarantee specific sales figures. We commit to pursuing meaningful, measurable outcomes through professional strategy and execution.' },
              { q: 'How do I get started?', a: 'Click "Start a Project" anywhere on the site, fill out the contact form, and our team will respond within 24 hours.' },
            ].map((faq, i) => (
              <Reveal key={i} delay={i * 60}>
                <div className="card-dark overflow-hidden">
                  <button onClick={() => setFaqOpen(faqOpen === i ? null : i)} className="flex w-full items-center justify-between p-5 text-left">
                    <span className="font-serif text-base sm:text-lg font-medium text-white">{faq.q}</span>
                    <span className={`text-amber-500 text-xl font-light transition-transform shrink-0 ml-4 ${faqOpen === i ? 'rotate-45' : ''}`}>+</span>
                  </button>
                  {faqOpen === i && (
                    <div className="border-t border-white/8 px-5 pb-5 pt-4 animate-fade-in">
                      <p className="text-sm leading-relaxed text-carbon-400">{faq.a}</p>
                    </div>
                  )}
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          NEWSLETTER
      ═══════════════════════════════════════════════════════════════ */}
      <section className="section-sm bg-forest-950">
        <div className="container-page">
          <div className="mx-auto max-w-xl text-center">
            <span className="eyebrow-forest">Stay Updated</span>
            <h2 className="mt-4 font-serif text-3xl font-semibold text-white">Get Growth Insights</h2>
            <p className="mt-3 text-carbon-400 text-sm">Join entrepreneurs receiving our best content on ecommerce, branding, and digital growth.</p>
            {subscribed ? (
              <p className="mt-6 text-forest-400 font-semibold">You are in. Welcome.</p>
            ) : (
              <form onSubmit={(e) => { e.preventDefault(); if (email) setSubscribed(true); }} className="mt-6 flex flex-col sm:flex-row gap-2">
                <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Your email address" className="input-dark flex-1" />
                <button type="submit" className="btn-forest shrink-0">Subscribe</button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          FINAL CTA
      ═══════════════════════════════════════════════════════════════ */}
      <section className="section-sm bg-carbon-950">
        <div className="container-page">
          <Reveal>
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-forest-900 to-carbon-900 px-6 py-16 sm:px-12 text-center ring-1 ring-forest-700/40">
              <div className="absolute inset-0 noise opacity-5" />
              <div className="absolute -left-16 top-1/2 h-64 w-64 -translate-y-1/2 rounded-full bg-amber-500/10 blur-3xl" />
              <div className="absolute -right-16 top-1/2 h-64 w-64 -translate-y-1/2 rounded-full bg-forest-600/10 blur-3xl" />
              <div className="relative">
                <span className="eyebrow">Ready to Grow?</span>
                <h2 className="mt-5 font-serif text-3xl sm:text-4xl lg:text-5xl font-semibold text-white">
                  Your Store Has a Vision.<br />Let's Build the System Behind It.
                </h2>
                <p className="mx-auto mt-4 max-w-lg text-carbon-300">Tell us about your business, your product, and where you want to go.</p>
                <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                  <button onClick={() => navigate('/contact')} className="btn-amber">Start a Project <ArrowRight size={16} /></button>
                  <a href={`mailto:${AGENCY_EMAIL}`} className="btn-ghost">Contact Official Shopijavid</a>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
