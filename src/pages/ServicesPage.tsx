import { useEffect, useState } from 'react';
import {
  ArrowRight, Check, Clock, TrendingUp, ShoppingBag, ShoppingCart, Globe,
  Package, Tag, Box, Store, Megaphone, Sparkles, Search, Compass, Briefcase,
  Palette, Target, Heart, Smartphone, CreditCard, FileText, Mail, Video,
  Scissors, Image, PenTool, Layout, Calculator, Folder, Lightbulb,
  MessageSquare, Network, Film, RefreshCw, Settings, RotateCcw, UserPlus,
  Calendar, Share2, Star, Users, DollarSign, BarChart3, Award,
} from 'lucide-react';
import { useHashRoute } from '../lib/router';
import { SERVICES, SERVICE_CATEGORIES, PLATFORMS, PRICING } from '../lib/data';

const iconMap: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  ShoppingBag, ShoppingCart, Globe, Package, Tag, Box, Store, Megaphone,
  Sparkles, Search, Compass, Briefcase, Palette, Target, Heart, TrendingUp,
  Smartphone, CreditCard, FileText, Mail, Video, Scissors, Image, PenTool,
  Layout, Calculator, Folder, Lightbulb, MessageSquare, Network, Film,
  RefreshCw, Settings, RotateCcw, UserPlus, Calendar, Share2, Star, Award,
  Users, DollarSign, BarChart3, Clock, ArrowRight, Check,
};

function Icon({ name, size, className }: { name: string; size?: number; className?: string }) {
  const C = iconMap[name] || Sparkles;
  return <C size={size} className={className} />;
}

// Reveal-on-scroll
function Reveal({ children, delay = 0, className = '' }: { children: React.ReactNode; delay?: number; className?: string }) {
  const [ref, setRef] = useState<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);
  const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;

  useEffect(() => {
    if (reduced) { setVisible(true); return; }
    if (!ref) return;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setVisible(true); obs.disconnect(); }
    }, { threshold: 0.15 });
    obs.observe(ref);
    return () => obs.disconnect();
  }, [ref, reduced]);

  return (
    <div
      ref={setRef}
      className={`${className} transition-all duration-700 ease-out ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

export default function ServicesPage() {
  const { navigate } = useHashRoute();
  const [filter, setFilter] = useState('All');

  const filters = ['All', 'Ecommerce', 'Marketing', 'Business', 'Creative', 'Strategy'];
  const filteredCategories = filter === 'All'
    ? SERVICE_CATEGORIES
    : SERVICE_CATEGORIES.filter(c => {
        if (filter === 'Ecommerce') return c.id === 'ecommerce';
        if (filter === 'Marketing') return c.id === 'marketing';
        if (filter === 'Business') return c.id === 'business';
        if (filter === 'Creative') return c.id === 'creative';
        if (filter === 'Strategy') return c.id === 'strategy';
        return true;
      });

  return (
    <div className="pt-20">
      {/* Hero */}
      <section className="relative bg-carbon-950 py-16 overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-30" />
        <div className="absolute left-1/2 top-0 -translate-x-1/2 h-px w-3/4 bg-gradient-to-r from-transparent via-amber-500/40 to-transparent" />
        <div className="container-page relative text-center">
          <span className="eyebrow">Our Capabilities</span>
          <h1 className="mt-4 font-serif text-5xl font-semibold text-white sm:text-6xl">Services</h1>
          <p className="mx-auto mt-4 max-w-xl text-carbon-400">From ecommerce development to marketing, business services, creative media, and strategy — everything your business needs, organized by category.</p>
        </div>
      </section>

      {/* Platform quick links */}
      <section className="section-sm bg-carbon-900">
        <div className="container-page">
          <p className="text-center text-xs font-semibold uppercase tracking-[0.3em] text-carbon-500 mb-6">Platforms We Work Across</p>
          <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-5">
            {PLATFORMS.map(p => (
              <div key={p.id} className="group card-dark p-4 text-center transition-all hover:-translate-y-1 hover:shadow-lift">
                <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl text-white font-bold mb-2" style={{ background: p.color }}>
                  {p.name[0]}
                </div>
                <p className="text-sm font-semibold text-white">{p.name}</p>
                <p className="text-[10px] text-carbon-400 mt-0.5">{p.services.length} services</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Filter bar */}
      <section className="sticky top-16 z-30 bg-carbon-950/95 backdrop-blur-md border-y border-white/5">
        <div className="container-page py-4">
          <div className="flex flex-wrap justify-center gap-2">
            {filters.map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`chip transition ${filter === f ? 'bg-amber-500 text-white shadow-amber' : 'bg-carbon-900 text-carbon-400 ring-1 ring-white/10 hover:text-white'}`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Categorized services */}
      <section className="section bg-carbon-950">
        <div className="container-page space-y-12">
          {filteredCategories.map((cat, ci) => (
            <Reveal key={cat.id} delay={ci * 50}>
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/15 text-amber-500">
                    <Icon name={cat.icon} size={24} />
                  </div>
                  <div>
                    <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-white">{cat.name}</h2>
                    <p className="text-xs text-carbon-400">{cat.services.length} services in this category</p>
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {cat.services.map((s) => (
                    <div
                      key={s.name}
                      className="group card-dark p-5 transition-all hover:-translate-y-1 hover:ring-amber-500/20 hover:shadow-lift"
                    >
                      <div className="flex items-start gap-3 mb-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-carbon-800 text-amber-500 group-hover:bg-amber-500 group-hover:text-white transition-colors">
                          <Icon name={s.icon} size={18} />
                        </div>
                        <h3 className="font-semibold text-white text-sm leading-snug pt-1">{s.name}</h3>
                      </div>
                      <p className="text-xs text-carbon-400 leading-relaxed">{s.desc}</p>
                      <button onClick={() => navigate('/contact')} className="mt-4 flex items-center gap-1 text-[11px] font-semibold text-amber-500 group-hover:gap-2 transition-all">
                        Get This Service <ArrowRight size={11} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Process mini-section */}
      <section className="section-sm bg-carbon-900">
        <div className="container-page text-center">
          <Reveal>
            <span className="eyebrow">How We Work</span>
            <h2 className="mt-4 font-serif text-3xl font-semibold text-white">From Vision to Results</h2>
            <p className="mx-auto mt-4 max-w-lg text-sm text-carbon-400">Discover, evaluate, build, promote, optimize, and deliver measurable progress. Every service we offer follows this structured approach.</p>
          </Reveal>
        </div>
      </section>

      {/* CTA */}
      <section className="section-sm bg-carbon-950">
        <div className="container-page">
          <div className="rounded-3xl bg-gradient-to-br from-forest-900 to-carbon-900 p-10 sm:p-12 text-center ring-1 ring-forest-700/40 relative overflow-hidden">
            <div className="absolute -left-16 top-1/2 h-48 w-48 -translate-y-1/2 rounded-full bg-amber-500/10 blur-3xl" />
            <div className="relative">
              <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-white">Don't see what you need?</h2>
              <p className="mt-3 text-carbon-300 text-sm">We offer custom solutions beyond what's listed. Tell us about your project and we'll find the right approach.</p>
              <button onClick={() => navigate('/contact')} className="btn-amber mt-6">Start a Project <ArrowRight size={16} /></button>
            </div>
          </div>
        </div>
      </section>

      {/* Original detailed services (for reference) */}
      <section className="section bg-carbon-900">
        <div className="container-page">
          <Reveal className="mb-10 text-center">
            <span className="eyebrow">Service Details</span>
            <h2 className="mt-4 section-title">Detailed Service Overviews</h2>
            <p className="mx-auto mt-4 max-w-lg text-carbon-400">Click any service for a full overview of what it is, what people overlook, the timeline, and the benefits.</p>
          </Reveal>

          <div className="space-y-6">
            {SERVICES.map((s, i) => (
              <Reveal key={s.id} delay={i * 30}>
                <div className="card-dark overflow-hidden scroll-mt-24" id={s.id}>
                  <div className="grid gap-0 lg:grid-cols-3">
                    <div className="relative h-48 overflow-hidden lg:h-auto">
                      <img
                        src={`https://images.pexels.com/photos/${[3184360,230544,267350,270408,196645,256541,3389957,590016,3184292,2796057,3184465,3182812,590022][i % 13]}/pexels-photo-${[3184360,230544,267350,270408,196645,256541,3389957,590016,3184292,2796057,3184465,3182812,590022][i % 13]}.jpeg?auto=compress&cs=tinysrgb&w=600`}
                        alt=""
                        className="h-full w-full object-cover opacity-30"
                      />
                      <div className="absolute inset-0 bg-gradient-to-r from-carbon-900/80 to-transparent" />
                      <div className="absolute bottom-4 left-4">
                        <span className="text-4xl">{s.icon}</span>
                        <h3 className="mt-2 font-serif text-2xl font-semibold text-white">{s.name}</h3>
                      </div>
                    </div>
                    <div className="p-6 lg:col-span-2">
                      <p className="text-carbon-400 leading-relaxed">{s.overview}</p>
                      <div className="mt-4 grid gap-3 sm:grid-cols-2">
                        {s.benefits.map((b) => (
                          <div key={b} className="flex items-start gap-2 text-sm text-carbon-300">
                            <Check size={15} className="mt-0.5 shrink-0 text-forest-400" /> {b}
                          </div>
                        ))}
                      </div>
                      <div className="mt-5 flex flex-wrap items-center gap-4 border-t border-white/8 pt-4">
                        <span className="flex items-center gap-1.5 text-xs text-amber-500"><Clock size={13} /> {s.timeline}</span>
                        <span className="flex items-center gap-1.5 text-xs text-forest-400"><TrendingUp size={13} /> {s.impact.slice(0, 60)}...</span>
                      </div>
                      <button onClick={() => navigate('/contact')} className="btn-outline-amber btn-sm mt-4">Get This Service <ArrowRight size={14} /></button>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="section bg-carbon-950">
        <div className="container-page">
          <Reveal className="mb-12 text-center">
            <span className="eyebrow">Pricing</span>
            <h2 className="mt-4 section-title">Plans for Every Stage</h2>
            <p className="mx-auto mt-4 max-w-lg text-carbon-400">Transparent pricing options. For custom projects, contact us for a personalized quote.</p>
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
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-start gap-2 text-sm">
                        <Check size={15} className={`mt-0.5 shrink-0 ${plan.highlight ? 'text-forest-400' : 'text-amber-500'}`} />
                        <span className="text-carbon-300">{f}</span>
                      </li>
                    ))}
                  </ul>
                  <button onClick={() => navigate('/contact')} className={`mt-6 w-full ${plan.highlight ? 'btn-forest' : 'btn-outline-amber'}`}>{plan.cta}</button>
                </div>
              </Reveal>
            ))}
          </div>
          <p className="mt-8 text-center text-sm text-carbon-400">
            For flexible pricing and personalized consultation, <button onClick={() => navigate('/contact')} className="text-amber-500 hover:underline">contact us directly</button>.
          </p>
          <div className="mt-4 text-center">
            <button onClick={() => navigate('/terms')} className="text-sm text-carbon-500 hover:text-amber-500 transition underline">View Contract & Payment Terms</button>
          </div>
        </div>
      </section>
    </div>
  );
}
