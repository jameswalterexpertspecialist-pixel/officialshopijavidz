import { useEffect, useRef, useState } from 'react';
import {
  ArrowRight, TrendingUp, ShoppingBag, Globe, Package, Tag, Box, Store,
  Megaphone, Sparkles, Search, Compass, Briefcase, Palette, Target, Heart,
  Check, Users, DollarSign, ShoppingCart, BarChart3, ChevronRight, Award,
  ClipboardCheck, Hammer, Smartphone, CreditCard, FileText, Mail,
  Video, Scissors, Image, PenTool, Layout, Calculator, Folder, Lightbulb,
  MessageSquare, Network, Film, RefreshCw, Settings, RotateCcw, UserPlus,
  Calendar, Share2, Star, ChevronLeft, Play, Pause,
} from 'lucide-react';
import { useHashRoute } from '../lib/router';
import {
  PLATFORMS, SERVICE_CATEGORIES, PROCESS_STEPS, TRUST_CARDS,
  MARQUEE_PLATFORMS, RESULT_JOURNEY, AGENCY_EMAIL, FOUNDED_YEAR,
  SLIDES, GIGS, PRICING, SERVICE_CATEGORIES,
} from '../lib/data';
import InteractiveStore from '../components/InteractiveStore';


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

// ─── Slideshow ───────────────────────────────────────────────────────
function Slideshow() {
  const { navigate } = useHashRoute();
  const [current, setCurrent] = useState(0);
  const [playing, setPlaying] = useState(true);
  const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;

  useEffect(() => {
    if (!playing || reduced) return;
    const t = setInterval(() => setCurrent(c => (c + 1) % SLIDES.length), 5000);
    return () => clearInterval(t);
  }, [playing, reduced]);

  const go = (dir: number) => setCurrent(c => (c + dir + SLIDES.length) % SLIDES.length);
  const slide = SLIDES[current];

  return (
    <div className="relative h-[60vh] min-h-[420px] sm:h-[70vh] overflow-hidden">
      {SLIDES.map((s, i) => (
        <div
          key={i}
          className={`absolute inset-0 transition-opacity duration-1000 ${i === current ? 'opacity-100' : 'opacity-0'}`}
        >
          <img src={s.img} alt={s.title} className={`h-full w-full object-cover ${i === current ? 'scale-105' : 'scale-100'} transition-transform duration-[6000ms]`} loading={i === 0 ? 'eager' : 'lazy'} />
          <div className="absolute inset-0 bg-gradient-to-t from-carbon-950 via-carbon-950/60 to-carbon-950/30" />
        </div>
      ))}

      {/* Content */}
      <div className="absolute inset-0 flex items-end pb-16 sm:pb-20">
        <div className="container-page">
          <div className="max-w-2xl">
            <div className={`transition-all duration-700 ${current === 0 ? '' : ''}`}>
              <span className="eyebrow animate-fade-in">{current + 1} / {SLIDES.length}</span>
              <h2 className="mt-3 font-serif text-3xl sm:text-5xl font-semibold text-white leading-tight">{slide.title}</h2>
              <p className="mt-3 text-sm sm:text-lg text-carbon-300 max-w-lg">{slide.sub}</p>
              <button onClick={() => navigate(slide.to)} className="btn-amber mt-5">
                {slide.cta} <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="absolute bottom-6 right-4 sm:right-8 flex items-center gap-2">
        <button onClick={() => go(-1)} className="flex h-9 w-9 items-center justify-center rounded-full bg-carbon-950/60 text-white ring-1 ring-white/20 hover:bg-carbon-950/90 transition" aria-label="Previous slide">
          <ChevronLeft size={18} />
        </button>
        <button onClick={() => setPlaying(p => !p)} className="flex h-9 w-9 items-center justify-center rounded-full bg-carbon-950/60 text-white ring-1 ring-white/20 hover:bg-carbon-950/90 transition" aria-label={playing ? 'Pause' : 'Play'}>
          {playing ? <Pause size={16} /> : <Play size={16} />}
        </button>
        <button onClick={() => go(1)} className="flex h-9 w-9 items-center justify-center rounded-full bg-carbon-950/60 text-white ring-1 ring-white/20 hover:bg-carbon-950/90 transition" aria-label="Next slide">
          <ChevronRight size={18} />
        </button>
      </div>

      {/* Dots */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-1.5">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`h-1.5 rounded-full transition-all ${i === current ? 'w-8 bg-amber-500' : 'w-1.5 bg-white/30 hover:bg-white/50'}`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

// ─── Hero mockup (kept for visual cycling) ───────────────────────────
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
      <div className="rounded-2xl bg-carbon-900 ring-1 ring-white/15 shadow-2xl overflow-hidden">
        <div className="flex items-center gap-1.5 px-4 py-3 border-b border-white/8">
          <span className="h-3 w-3 rounded-full bg-red-400/70" />
          <span className="h-3 w-3 rounded-full bg-amber-400/70" />
          <span className="h-3 w-3 rounded-full bg-forest-400/70" />
          <span className="ml-3 flex-1 rounded-md bg-carbon-800 px-3 py-1 text-[10px] text-carbon-500 font-mono">officialshopijavid.com/{f.label.toLowerCase().replace(/\s/g, '-')}</span>
        </div>
        <div className="relative h-72 sm:h-80 overflow-hidden" style={{ background: `linear-gradient(135deg, ${f.color}08, transparent)` }}>
          {frame < 5 && <StorefrontMockup color={f.color} frame={frame} />}
          {frame === 5 && <DashboardMockup color={f.color} />}
          {frame === 6 && <SalesGraphMockup color={f.color} />}
          {frame === 7 && <GrowthMockup color={f.color} />}
        </div>
      </div>
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

function StorefrontMockup({ color }: { color: string; frame?: number }) {
  const products = [
    { name: 'Product One', price: '$49.99', badge: 'New' },
    { name: 'Product Two', price: '$89.00', badge: 'Sale' },
    { name: 'Product Three', price: '$24.50', badge: '' },
  ];
  return (
    <div className="animate-fade-in p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="h-5 w-24 rounded-full" style={{ background: `${color}40` }} />
        <div className="flex gap-2">{[60, 50, 45].map((w, i) => <div key={i} className="h-3 rounded-full bg-white/10" style={{ width: w }} />)}</div>
        <div className="h-7 w-7 rounded-full" style={{ background: `${color}30` }} />
      </div>
      <div className="rounded-xl mb-4 h-16 flex items-center px-4" style={{ background: `linear-gradient(90deg, ${color}25, ${color}08)` }}>
        <div><div className="h-2.5 w-32 rounded-full bg-white/20 mb-1.5" /><div className="h-2 w-20 rounded-full bg-white/10" /></div>
      </div>
      <div className="grid grid-cols-3 gap-2">
        {products.map((p, i) => (
          <div key={i} className="rounded-lg bg-carbon-800/60 ring-1 ring-white/5 p-2">
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
        <div className="flex gap-1.5"><div className="h-6 w-12 rounded-md" style={{ background: `${color}30` }} /><div className="h-6 w-12 rounded-md bg-white/10" /></div>
      </div>
      <div className="grid grid-cols-3 gap-2 mb-3">
        {['Revenue', 'Orders', 'CTR'].map((l, i) => (
          <div key={l} className="rounded-lg bg-carbon-800/60 ring-1 ring-white/5 p-2">
            <p className="text-[8px] text-carbon-400 uppercase">{l}</p>
            <p className="text-sm font-bold mt-0.5" style={{ color }}>{['$12.4K', '347', '3.8%'][i]}</p>
            <div className="mt-1 flex items-end gap-0.5 h-4">{[40, 60, 45, 80, 65, 90].map((h, j) => <div key={j} className="flex-1 rounded-sm" style={{ height: `${h}%`, background: `${color}60` }} />)}</div>
          </div>
        ))}
      </div>
      <div className="rounded-lg bg-carbon-800/60 ring-1 ring-white/5 p-3">
        <div className="h-2 w-20 rounded-full bg-white/15 mb-2" />
        <svg viewBox="0 0 200 50" className="w-full h-16">
          <polyline fill="none" stroke={color} strokeWidth="2" points="0,45 30,38 60,40 90,28 120,22 150,15 200,8" strokeLinecap="round" strokeLinejoin="round" />
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
        <div><div className="h-3 w-32 rounded-full bg-white/20 mb-1" /><div className="h-2 w-20 rounded-full bg-white/10" /></div>
        <div className="flex items-center gap-1 text-[10px] font-semibold" style={{ color }}><TrendingUp size={12} /> +24.7%</div>
      </div>
      <div className="flex-1 flex items-end gap-1.5 pb-2">
        {[35, 50, 42, 60, 55, 72, 65, 80, 75, 90, 85, 95].map((h, i) => <div key={i} className="flex-1 rounded-t-md" style={{ height: `${h}%`, background: `linear-gradient(to top, ${color}, ${color}60)` }} />)}
      </div>
      <div className="flex justify-between text-[8px] text-carbon-500">{['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'].map(m => <span key={m}>{m}</span>)}</div>
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

// ─── Main component ──────────────────────────────────────────────────
export default function HomePage() {
  const { navigate } = useHashRoute();
  const [heroFrame, setHeroFrame] = useState(0);
  const [storeTab, setStoreTab] = useState(0);
  const [faqOpen, setFaqOpen] = useState<number | null>(null);
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [marqueeOffset, setMarqueeOffset] = useState(0);
  const [beyondParallax, setBeyondParallax] = useState(0);
  const beyondRef = useRef<HTMLElement>(null);
  const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;

  useEffect(() => {
    if (reduced) return;
    const t = setInterval(() => setHeroFrame(f => (f + 1) % HERO_FRAMES.length), 3500);
    return () => clearInterval(t);
  }, [reduced]);

  useEffect(() => {
    if (reduced) return;
    const t = setInterval(() => setMarqueeOffset(o => o - 1), 30);
    return () => clearInterval(t);
  }, [reduced]);

  useEffect(() => {
    if (reduced) return;
    const onScroll = () => {
      if (!beyondRef.current) return;
      const rect = beyondRef.current.getBoundingClientRect();
      const viewport = window.innerHeight;
      if (rect.top < viewport && rect.bottom > 0) {
        const progress = (viewport - rect.top) / (viewport + rect.height);
        setBeyondParallax(progress * -40);
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [reduced]);

  const STORE_TABS = ['shopify', 'wix', 'woocommerce', 'etsy', 'amazon'] as const;
  const featuredGigs = GIGS.slice(0, 8);

  return (
    <div className="overflow-x-hidden">
      {/* ═══ HERO SECTION ═══ */}
      <section className="relative min-h-screen flex items-center pt-20 overflow-hidden bg-carbon-950">
        <div className="absolute inset-0 grid-tech opacity-30" />
        <div className="absolute left-1/2 top-0 -translate-x-1/2 h-px w-3/4 bg-gradient-to-r from-transparent via-electric-500/40 to-transparent" />
        <div className="absolute -left-32 top-1/4 h-96 w-96 rounded-full bg-electric-600/10 blur-3xl animate-glow-pulse" />
        <div className="absolute -right-32 bottom-1/4 h-96 w-96 rounded-full bg-cyan-500/8 blur-3xl animate-glow-pulse" style={{ animationDelay: '2s' }} />

        <div className="container-page relative py-12 lg:py-0">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
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
            <div className="relative">
              <HeroMockup frame={heroFrame} />
              <div className="mt-6 flex flex-wrap justify-center gap-1.5">
                {HERO_FRAMES.map((f, i) => (
                  <button key={i} onClick={() => setHeroFrame(i)} className={`h-1.5 rounded-full transition-all ${i === heroFrame ? 'w-6 bg-amber-500' : 'w-1.5 bg-white/20'}`} aria-label={f.label} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ SLIDESHOW ═══ */}
      <section className="relative bg-carbon-950">
        <Slideshow />
      </section>

      {/* ═══ VIDEO SHOWCASE ═══ */}
      <section className="section bg-carbon-950">
        <div className="container-page">
          <Reveal className="mb-8 text-center">
            <span className="eyebrow-cyan">Data-Driven Growth</span>
            <h2 className="mt-4 section-title">Build Systems That Learn</h2>
            <p className="mx-auto mt-4 max-w-lg text-carbon-400">Your digital presence is more than a website — it is your own space. A place where your brand speaks, works, and grows. This is what it means to own your digital estate.</p>
          </Reveal>
          <Reveal>
            <div className="relative rounded-2xl overflow-hidden ring-1 ring-white/10 shadow-lift bg-carbon-900">
              <video
                src="/videos/shopijavid.mp4"
                poster="/images/image.png"
                autoPlay
                muted
                loop
                playsInline
                controls
                className="w-full aspect-video object-cover"
              />
            </div>
          </Reveal>
        </div>
      </section>

      {/* ═══ COMMERCE PLATFORMS ═══ */}
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
                <button onClick={() => navigate('/platforms')} className="group card-dark p-6 h-full w-full text-left transition-all hover:-translate-y-1.5 hover:shadow-lift">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl text-white font-bold text-lg" style={{ background: p.color }}>{p.name[0]}</div>
                    <div>
                      <h3 className="font-serif text-xl font-semibold text-white">{p.name}</h3>
                      <p className="text-[10px] text-carbon-400">{p.tagline}</p>
                    </div>
                  </div>
                  <p className="text-sm text-carbon-400 leading-relaxed mb-4">{p.desc}</p>
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {p.services.map(s => <span key={s} className="chip text-[10px] bg-carbon-800 text-carbon-300 ring-1 ring-white/5">{s}</span>)}
                  </div>
                  <span className="text-xs font-semibold text-amber-500 flex items-center gap-1 group-hover:gap-2 transition-all">
                    Explore Platform <ArrowRight size={12} />
                  </span>
                </button>
              </Reveal>
            ))}
            <Reveal delay={PLATFORMS.length * 100}>
              <div className="card-dark p-6 h-full flex flex-col items-center justify-center text-center border-dashed">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-carbon-800 text-carbon-400 mb-3"><Store size={22} /></div>
                <h3 className="font-serif text-lg font-semibold text-white">And More</h3>
                <p className="text-sm text-carbon-400 mt-2">Working across additional platforms and custom solutions based on your needs.</p>
                <button onClick={() => navigate('/contact')} className="btn-outline-amber btn-sm mt-4">Ask About Your Platform</button>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ═══ INTERACTIVE STORE DEMO ═══ */}
      <section className="section bg-carbon-950">
        <div className="container-page">
          <Reveal className="mb-8 text-center">
            <span className="eyebrow">Live Store Demonstrations</span>
            <h2 className="mt-4 section-title">See What We Build</h2>
            <p className="mx-auto mt-4 max-w-lg text-carbon-400">These are fully interactive storefront demonstrations. Browse products, add to cart, view product details, and experience the store as your customers would.</p>
          </Reveal>

          <Reveal className="mb-6">
            <div className="flex flex-wrap justify-center gap-2">
              {STORE_TABS.map((tab) => {
                const p = PLATFORMS.find(pl => pl.id === tab)!;
                return (
                  <button
                    key={tab}
                    onClick={() => setStoreTab(STORE_TABS.indexOf(tab))}
                    className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all ${storeTab === STORE_TABS.indexOf(tab) ? 'text-white shadow-lg' : 'bg-carbon-900 text-carbon-400 ring-1 ring-white/10 hover:text-white'}`}
                    style={storeTab === STORE_TABS.indexOf(tab) ? { background: p.color } : {}}
                  >
                    {p.name}
                  </button>
                );
              })}
            </div>
          </Reveal>

          <Reveal>
            <div key={storeTab}>
              <InteractiveStore platform={STORE_TABS[storeTab]} />
            </div>
          </Reveal>

          <div className="mt-6 text-center">
            <button onClick={() => navigate('/platforms')} className="btn-outline-amber">View All Platform Demos <ArrowRight size={16} /></button>
          </div>
        </div>
      </section>

      {/* ═══ SERVICES PREVIEW ═══ */}
      <section className="section bg-carbon-900">
        <div className="container-page">
          <Reveal className="mb-10 text-center">
            <span className="eyebrow">Our Services</span>
            <h2 className="mt-4 section-title">Everything Your Business Needs</h2>
            <p className="mx-auto mt-4 max-w-lg text-carbon-400">From ecommerce development to marketing, business services, creative media, and strategy — organized by category.</p>
          </Reveal>

          {/* Show only Ecommerce & Store Development (4 services) with See More */}
          {(() => {
            const ecommerceCat = SERVICE_CATEGORIES.find(c => c.id === 'ecommerce');
            if (!ecommerceCat) return null;
            const visibleServices = ecommerceCat.services.slice(0, 4);
            return (
              <Reveal>
                <div>
                  <div className="flex items-center gap-3 mb-5">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/15 text-amber-500"><Icon name={ecommerceCat.icon} size={20} /></div>
                    <h3 className="font-serif text-2xl font-semibold text-white">{ecommerceCat.name}</h3>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {visibleServices.map((s) => (
                      <div key={s.name} className="group card-dark p-5 transition-all hover:-translate-y-1 hover:ring-amber-500/20 hover:shadow-lift">
                        <div className="flex items-start gap-3">
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-carbon-800 text-amber-500 group-hover:bg-amber-500 group-hover:text-white transition-colors"><Icon name={s.icon} size={16} /></div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-white text-sm">{s.name}</h4>
                            <p className="mt-1 text-xs text-carbon-400 leading-relaxed line-clamp-2">{s.desc}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </Reveal>
            );
          })()}

          <div className="mt-6 text-center">
            <button onClick={() => navigate('/services')} className="btn-outline-amber">See More — View All Services <ArrowRight size={16} /></button>
          </div>
        </div>
      </section>

      {/* ═══ PRICING PREVIEW ═══ */}
      <section className="section bg-carbon-950">
        <div className="container-page">
          <Reveal className="mb-10 text-center">
            <span className="eyebrow">Pricing</span>
            <h2 className="mt-4 section-title">Clear, Honest Pricing</h2>
            <p className="mx-auto mt-4 max-w-lg text-carbon-400">Full-service packages from starter to enterprise. For categorized per-service pricing, visit our full pricing page.</p>
          </Reveal>

          <div className="grid gap-5 md:grid-cols-3 max-w-5xl mx-auto">
            {PRICING.map((plan, i) => (
              <Reveal key={plan.name} delay={i * 100}>
                <div className={`relative rounded-2xl p-7 ring-1 transition hover:-translate-y-1 h-full ${plan.highlight ? 'bg-forest-950 ring-forest-700/50 shadow-forest' : 'card-dark'}`}>
                  {plan.highlight && <span className="absolute -top-3 left-1/2 -translate-x-1/2 chip bg-amber-500 text-white shadow-amber text-[10px]">Most Popular</span>}
                  <p className="text-xs font-semibold uppercase tracking-widest text-amber-500">{plan.name}</p>
                  <div className="mt-2 flex items-baseline gap-1">
                    <span className="font-serif text-4xl font-semibold text-white">{plan.price}</span>
                    <span className="text-sm text-carbon-400">{plan.period}</span>
                  </div>
                  <p className="mt-1 text-sm text-carbon-400">{plan.desc}</p>
                  <ul className="mt-5 space-y-2.5">
                    {plan.features.slice(0, 5).map(f => (
                      <li key={f} className="flex items-start gap-2 text-sm">
                        <Check size={15} className={`mt-0.5 shrink-0 ${plan.highlight ? 'text-forest-400' : 'text-amber-500'}`} />
                        <span className="text-carbon-300">{f}</span>
                      </li>
                    ))}
                  </ul>
                  <button onClick={() => navigate('/pricing')} className={`mt-6 w-full ${plan.highlight ? 'btn-forest' : 'btn-outline-amber'}`}>{plan.cta}</button>
                </div>
              </Reveal>
            ))}
          </div>

          <div className="mt-8 text-center">
            <button onClick={() => navigate('/pricing')} className="btn-outline-amber">View Full Pricing <ArrowRight size={16} /></button>
          </div>
        </div>
      </section>

      {/* ═══ GIGS PREVIEW ═══ */}
      <section className="section bg-carbon-900">
        <div className="container-page">
          <Reveal className="mb-10 text-center">
            <span className="eyebrow">Marketplace</span>
            <h2 className="mt-4 section-title">Professional Gigs</h2>
            <p className="mx-auto mt-4 max-w-lg text-carbon-400">Ready-to-order services with clear pricing, delivery times, and proven results.</p>
          </Reveal>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {featuredGigs.map((g, i) => (
              <Reveal key={g.id} delay={i * 50}>
                <button onClick={() => navigate(`/gigs/${g.id}`)} className="group card-dark overflow-hidden text-left transition-all hover:-translate-y-1 hover:shadow-lift hover:ring-amber-500/20 w-full">
                  <div className="relative h-32 overflow-hidden">
                    <img src={g.img} alt={g.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" loading="lazy" />
                    <div className="absolute inset-0 bg-gradient-to-t from-carbon-950/60 to-transparent" />
                    <span className="absolute right-2 top-2 chip bg-carbon-950/80 text-amber-500 text-[10px] backdrop-blur">{g.delivery}</span>
                  </div>
                  <div className="p-3">
                    <h3 className="font-semibold text-white text-sm group-hover:text-amber-400 transition-colors">{g.title}</h3>
                    <div className="mt-2 flex items-center justify-between">
                      <span className="text-[10px] text-carbon-500">From</span>
                      <span className="font-serif text-lg font-semibold text-white">${g.price}</span>
                    </div>
                    <div className="mt-1 flex items-center gap-1 text-[10px] text-amber-500">
                      <Star size={10} className="fill-amber-500" /> {g.rating} <span className="text-carbon-500">({g.reviews})</span>
                    </div>
                  </div>
                </button>
              </Reveal>
            ))}
          </div>

          <div className="mt-8 text-center">
            <button onClick={() => navigate('/gigs')} className="btn-amber">Browse All Gigs <ArrowRight size={16} /></button>
          </div>
        </div>
      </section>

      {/* ═══ PROCESS ═══ */}
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
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/15 text-amber-500 group-hover:bg-amber-500 group-hover:text-white transition-colors"><Icon name={step.icon} size={22} /></div>
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

      {/* ═══ TRUST ═══ */}
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
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-forest-600/15 text-forest-400 group-hover:bg-forest-600 group-hover:text-white transition-colors mb-4"><Icon name={t.icon} size={22} /></div>
                  <h3 className="font-serif text-lg font-semibold text-white">{t.title}</h3>
                  <p className="mt-2 text-sm text-carbon-400 leading-relaxed">{t.desc}</p>
                </div>
              </Reveal>
            ))}
            <Reveal delay={TRUST_CARDS.length * 80}>
              <div className="card-forest p-6 h-full flex flex-col justify-center text-center">
                <p className="font-serif text-lg text-white leading-snug">"All That Matters<br />Is Result"</p>
                <p className="mt-2 text-xs text-carbon-400">Our central philosophy.</p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ═══ MARQUEE ═══ */}
      <section className="py-12 bg-carbon-950 border-y border-white/5 overflow-hidden">
        <div className="container-page mb-6">
          <p className="text-center text-xs font-semibold uppercase tracking-[0.3em] text-carbon-500">Platforms & Channels We Work Across</p>
        </div>
        <div className="relative overflow-hidden">
          <div className="flex gap-8 whitespace-nowrap" style={{ transform: `translateX(${marqueeOffset}px)`, willChange: 'transform' }}>
            {[...MARQUEE_PLATFORMS, ...MARQUEE_PLATFORMS, ...MARQUEE_PLATFORMS].map((p, i) => (
              <span key={i} className="font-serif text-xl font-medium text-carbon-600 hover:text-amber-500 transition-colors cursor-default">{p}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ RESULT JOURNEY ═══ */}
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
                    <div className="flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-2xl bg-carbon-800 ring-1 ring-white/10 text-white font-serif text-xs sm:text-sm font-semibold transition-all hover:bg-amber-500 hover:text-white hover:ring-amber-500 hover:scale-110">{step.label}</div>
                  </div>
                  {i < RESULT_JOURNEY.length - 1 && <ArrowRight size={16} className="text-carbon-600 shrink-0" />}
                </div>
              ))}
            </div>
          </Reveal>
          <Reveal className="mt-10 text-center" delay={200}>
            <p className="font-serif text-xl text-carbon-300 italic max-w-2xl mx-auto">"Because when everything is said and done, the result is what matters."</p>
          </Reveal>
        </div>
      </section>

      {/* ═══ ABOUT PREVIEW — Beyond the Store with provided image ═══ */}
      <section className="section bg-carbon-950 relative overflow-hidden" ref={beyondRef}>
        <div className="absolute inset-0 grid-tech opacity-30" />
        <div className="absolute -left-32 top-1/4 h-96 w-96 rounded-full bg-electric-600/10 blur-3xl" />
        <div className="absolute -right-32 bottom-1/4 h-96 w-96 rounded-full bg-cyan-500/8 blur-3xl" />
        <div className="container-page relative">
          <Reveal>
            <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
              <div>
                <span className="eyebrow-cyan">Beyond the Store</span>
                <h2 className="mt-4 font-serif text-4xl font-semibold text-white sm:text-5xl">We don't believe a store<br />is only about how it looks</h2>
                <p className="mt-5 text-carbon-300 leading-relaxed">A beautiful store is valuable, but customers must also discover the product, understand the product, trust the brand, interact with the store, and ultimately take action. Our approach considers every layer: store, product, brand, customer, marketing, promotion, experience, and growth.</p>
                <p className="mt-4 text-carbon-300 leading-relaxed">Founded in {FOUNDED_YEAR} by Jacob David, Official Shopijavid was built on one principle: <span className="cyan-text">"All That Matters Is Result."</span></p>

                {/* Animated journey flow */}
                <div className="mt-6 flex flex-wrap items-center gap-2">
                  {['Product', 'Brand', 'Store', 'Marketing', 'Experience', 'Analytics', 'Growth'].map((step, i) => (
                    <div key={step} className="flex items-center gap-2">
                      <span className="chip bg-electric-600/15 text-electric-300 ring-1 ring-electric-500/20 text-[10px]">{step}</span>
                      {i < 6 && <ArrowRight size={12} className="text-cyan-500/50" />}
                    </div>
                  ))}
                </div>

                <div className="mt-7 flex flex-wrap gap-3">
                  <button onClick={() => navigate('/portfolio')} className="btn-amber">Learn More About Us</button>
                  <button onClick={() => navigate('/team')} className="btn-ghost">Meet the Team</button>
                </div>
              </div>

              {/* Provided image with parallax + floating animation */}
              <div className="relative">
                <div
                  className="relative rounded-2xl overflow-hidden ring-1 ring-white/10 shadow-lift parallax-img"
                  style={{ transform: `translateY(${beyondParallax}px)` }}
                >
                  <img
                    src="/images/image.png"
                    alt="Official Shopijavid digital commerce showcase"
                    className="w-full h-auto object-cover animate-float"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-carbon-950/40 via-transparent to-transparent pointer-events-none" />
                  {/* Floating tech accent cards */}
                  <div className="absolute top-4 right-4 card-glass px-3 py-2 animate-bounce-in">
                    <div className="flex items-center gap-2">
                      <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-electric-500/20 text-electric-400"><TrendingUp size={14} /></div>
                      <div>
                        <p className="text-[9px] text-carbon-400 uppercase tracking-wider">Growth</p>
                        <p className="text-xs font-semibold text-white">Data-Driven</p>
                      </div>
                    </div>
                  </div>
                  <div className="absolute bottom-4 left-4 card-glass px-3 py-2 animate-bounce-in" style={{ animationDelay: '0.2s' }}>
                    <div className="flex items-center gap-2">
                      <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-cyan-500/20 text-cyan-400"><Store size={14} /></div>
                      <div>
                        <p className="text-[9px] text-carbon-400 uppercase tracking-wider">Commerce</p>
                        <p className="text-xs font-semibold text-white">Multi-Platform</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ═══ FAQ ═══ */}
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
                  {faqOpen === i && <div className="border-t border-white/8 px-5 pb-5 pt-4 animate-fade-in"><p className="text-sm leading-relaxed text-carbon-400">{faq.a}</p></div>}
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ NEWSLETTER ═══ */}
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

      {/* ═══ FINAL CTA ═══ */}
      <section className="section-sm bg-carbon-950">
        <div className="container-page">
          <Reveal>
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-forest-900 to-carbon-900 px-6 py-16 sm:px-12 text-center ring-1 ring-forest-700/40">
              <div className="absolute inset-0 noise opacity-5" />
              <div className="absolute -left-16 top-1/2 h-64 w-64 -translate-y-1/2 rounded-full bg-amber-500/10 blur-3xl" />
              <div className="absolute -right-16 top-1/2 h-64 w-64 -translate-y-1/2 rounded-full bg-forest-600/10 blur-3xl" />
              <div className="relative">
                <span className="eyebrow">Ready to Grow?</span>
                <h2 className="mt-5 font-serif text-3xl sm:text-4xl lg:text-5xl font-semibold text-white">Your Store Has a Vision.<br />Let's Build the System Behind It.</h2>
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
