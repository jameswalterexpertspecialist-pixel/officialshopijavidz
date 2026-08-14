import { useEffect, useRef, useState } from 'react';
import { ArrowRight, ChevronRight } from 'lucide-react';
import { useHashRoute } from '../lib/router';
import { PLATFORMS, MARQUEE_PLATFORMS } from '../lib/data';
import InteractiveStore from '../components/InteractiveStore';
import AnalyticsDashboard from '../components/AnalyticsDashboard';

const PLATFORM_TABS = ['shopify', 'wix', 'woocommerce', 'etsy', 'amazon'] as const;

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
    <div ref={ref} className={`${className} transition-all duration-700 ease-out ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  );
}

export default function PlatformsPage() {
  const { navigate } = useHashRoute();
  const [activeTab, setActiveTab] = useState<string>('shopify');
  const [marqueeOffset, setMarqueeOffset] = useState(0);
  const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;

  useEffect(() => {
    if (reduced) return;
    const t = setInterval(() => setMarqueeOffset(o => o - 1), 30);
    return () => clearInterval(t);
  }, [reduced]);

  const activePlatform = PLATFORMS.find(p => p.id === activeTab) || PLATFORMS[0];
  const isMarketplace = activeTab === 'etsy' || activeTab === 'amazon';

  return (
    <div className="pt-20">
      {/* Hero */}
      <section className="relative bg-carbon-950 py-16 overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-30" />
        <div className="absolute left-1/2 top-0 -translate-x-1/2 h-px w-3/4 bg-gradient-to-r from-transparent via-amber-500/40 to-transparent" />
        <div className="container-page relative text-center">
          <span className="eyebrow">Platforms We Work Across</span>
          <h1 className="mt-4 font-serif text-5xl font-semibold text-white sm:text-6xl">Your Business.<br />Every Opportunity.</h1>
          <p className="mx-auto mt-4 max-w-xl text-carbon-400">Official Shopijavid works across multiple ecommerce platforms and digital channels. We do not claim official partnerships — we work across these platforms to help your business grow.</p>
        </div>
      </section>

      {/* Platform cards */}
      <section className="section-sm bg-carbon-900">
        <div className="container-page">
          <Reveal className="mb-8 text-center">
            <span className="eyebrow">Platform Overview</span>
            <h2 className="mt-3 font-serif text-2xl font-semibold text-white">Platforms We Work Across</h2>
          </Reveal>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {PLATFORMS.map((p, i) => (
              <Reveal key={p.id} delay={i * 80}>
                <button
                  onClick={() => {
                    setActiveTab(p.id);
                    document.getElementById('store-demo')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }}
                  className={`group w-full card-dark p-5 text-left transition-all hover:-translate-y-1 hover:shadow-lift ${activeTab === p.id ? 'ring-2 ring-amber-500/40' : ''}`}
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl text-white font-bold text-lg mb-3" style={{ background: p.color }}>
                    {p.name[0]}
                  </div>
                  <h3 className="font-serif text-lg font-semibold text-white">{p.name}</h3>
                  <p className="text-[10px] text-carbon-400 mt-0.5">{p.tagline}</p>
                  <div className="mt-3 flex flex-wrap gap-1">
                    {p.services.slice(0, 3).map(s => (
                      <span key={s} className="chip text-[9px] bg-carbon-800 text-carbon-300">{s}</span>
                    ))}
                  </div>
                  <p className="mt-3 text-[11px] font-semibold text-amber-500 flex items-center gap-1 group-hover:gap-2 transition-all">
                    Explore <ChevronRight size={11} />
                  </p>
                </button>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive store demos */}
      <section className="section bg-carbon-950" id="store-demo">
        <div className="container-page">
          <Reveal className="mb-8 text-center">
            <span className="eyebrow">Live Store Demonstrations</span>
            <h2 className="mt-4 section-title">See What We Build</h2>
            <p className="mx-auto mt-4 max-w-lg text-carbon-400">These are fully interactive storefront demonstrations. Browse products, add to cart, view details, and experience the store as your customers would.</p>
          </Reveal>

          {/* Platform tabs */}
          <Reveal className="mb-6">
            <div className="flex flex-wrap justify-center gap-2">
              {PLATFORM_TABS.map(tab => {
                const p = PLATFORMS.find(pl => pl.id === tab)!;
                return (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all ${activeTab === tab ? 'text-white shadow-lg' : 'bg-carbon-900 text-carbon-400 ring-1 ring-white/10 hover:text-white'}`}
                    style={activeTab === tab ? { background: p.color } : {}}
                  >
                    {p.name}
                  </button>
                );
              })}
            </div>
          </Reveal>

          {/* Platform description */}
          <Reveal className="mb-6">
            <div className="max-w-2xl mx-auto text-center">
              <p className="text-sm text-carbon-400">{activePlatform.desc}</p>
              <div className="mt-3 flex flex-wrap justify-center gap-1.5">
                {activePlatform.services.map(s => (
                  <span key={s} className="chip text-[10px] bg-carbon-900 text-carbon-300 ring-1 ring-white/10">{s}</span>
                ))}
              </div>
              {isMarketplace && (
                <p className="mt-3 text-[11px] text-amber-500/70 italic">Marketplace Experience Demonstration — not an official platform interface</p>
              )}
            </div>
          </Reveal>

          {/* Interactive store */}
          <Reveal>
            <div key={activeTab}>
              <InteractiveStore platform={activeTab} />
            </div>
          </Reveal>
        </div>
      </section>

      {/* Analytics dashboard */}
      <section className="section bg-carbon-900">
        <div className="container-page">
          <Reveal className="mb-8 text-center">
            <span className="eyebrow">Analytics & Growth</span>
            <h2 className="mt-4 section-title">Data-Driven Growth Dashboard</h2>
            <p className="mx-auto mt-4 max-w-lg text-carbon-400">Real data-driven charts generated from actual data arrays. Switch between revenue, orders, visitors, and conversion metrics. All data is clearly labeled as illustrative — not actual client results.</p>
          </Reveal>

          <Reveal>
            <AnalyticsDashboard />
          </Reveal>
        </div>
      </section>

      {/* Platform marquee */}
      <section className="py-12 bg-carbon-950 border-y border-white/5 overflow-hidden">
        <div className="container-page mb-6">
          <p className="text-center text-xs font-semibold uppercase tracking-[0.3em] text-carbon-500">Platforms & Channels We Work Across</p>
        </div>
        <div className="relative overflow-hidden">
          <div className="flex gap-8 whitespace-nowrap" style={{ transform: `translateX(${marqueeOffset}px)`, willChange: 'transform' }}>
            {[...MARQUEE_PLATFORMS, ...MARQUEE_PLATFORMS, ...MARQUEE_PLATFORMS].map((p, i) => (
              <span key={i} className="font-serif text-xl font-medium text-carbon-600">{p}</span>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-sm bg-carbon-950">
        <div className="container-page">
          <div className="rounded-3xl bg-gradient-to-br from-forest-900 to-carbon-900 p-10 text-center ring-1 ring-forest-700/40 relative overflow-hidden">
            <div className="absolute -left-16 top-1/2 h-48 w-48 -translate-y-1/2 rounded-full bg-amber-500/10 blur-3xl" />
            <div className="relative">
              <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-white">Ready to build your store?</h2>
              <p className="mt-3 text-carbon-300 text-sm">Tell us which platform you're on and where you want to go. We'll build the system behind your vision.</p>
              <button onClick={() => navigate('/contact')} className="btn-amber mt-6">Start a Project <ArrowRight size={16} /></button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
