import { useEffect, useRef, useState } from 'react';
import {
  ArrowRight, Search, ClipboardCheck, Hammer, Megaphone, TrendingUp, Award,
  Store, Sparkles, Heart, ArrowUpRight,
} from 'lucide-react';
import { useHashRoute } from '../lib/router';
import { PROCESS_STEPS, TRUST_CARDS, RESULT_JOURNEY, GIGS } from '../lib/data';

const iconMap: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  Search, ClipboardCheck, Hammer, Megaphone, TrendingUp, Award,
  Store, Sparkles, Heart,
};

function Icon({ name, size, className }: { name: string; size?: number; className?: string }) {
  const C = iconMap[name] || Sparkles;
  return <C size={size} className={className} />;
}

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

export default function GrowthPage() {
  const { navigate } = useHashRoute();
  const featuredGigs = GIGS.slice(0, 8);

  return (
    <div className="overflow-x-hidden pt-20">
      {/* Hero */}
      <section className="relative bg-carbon-950 py-20 overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-20" />
        <div className="absolute left-1/2 top-0 -translate-x-1/2 h-px w-3/4 bg-gradient-to-r from-transparent via-amber-500/40 to-transparent" />
        <div className="container-page relative text-center">
          <span className="eyebrow animate-fade-in">Our Growth System</span>
          <h1 className="mt-5 font-serif text-4xl font-semibold text-white sm:text-5xl lg:text-6xl">
            From Vision<br /><span className="amber-text">to Results</span>
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-carbon-300 leading-relaxed">
            Every business moves through stages. We help you navigate each one — from the first idea to measurable, sustainable growth. This is our philosophy, our process, and the journey we take with every client.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <button onClick={() => navigate('/contact')} className="btn-amber">Start Your Journey <ArrowRight size={16} /></button>
            <button onClick={() => navigate('/services')} className="btn-ghost">Explore Services</button>
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="section bg-carbon-950">
        <div className="container-page">
          <Reveal className="mb-12 text-center">
            <span className="eyebrow">Our Process</span>
            <h2 className="mt-4 section-title">A Structured Path to Results</h2>
            <p className="mx-auto mt-4 max-w-lg text-carbon-400">A clear, repeatable approach that moves your business from idea to measurable outcomes — step by step.</p>
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

      {/* Trust Cards */}
      <section className="section bg-carbon-900">
        <div className="container-page">
          <Reveal className="mb-12 text-center">
            <span className="eyebrow">What We Build</span>
            <h2 className="mt-4 section-title">Five Pillars of Growth</h2>
            <p className="mx-auto mt-4 max-w-lg text-carbon-400">Every engagement is built on these foundational outcomes.</p>
          </Reveal>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {TRUST_CARDS.map((card, i) => (
              <Reveal key={card.title} delay={i * 80}>
                <div className="card-dark p-6 h-full transition-all hover:-translate-y-1 hover:shadow-lift">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-500/15 text-amber-500 mb-4">
                    <Icon name={card.icon} size={20} />
                  </div>
                  <h3 className="font-serif text-lg font-semibold text-white">{card.title}</h3>
                  <p className="mt-2 text-sm text-carbon-400 leading-relaxed">{card.desc}</p>
                </div>
              </Reveal>
            ))}
            <Reveal delay={400}>
              <div className="card-forest p-6 h-full flex flex-col items-center justify-center text-center">
                <p className="font-serif text-2xl text-white">Results</p>
                <p className="mt-2 text-sm text-carbon-400">Because when everything is said and done, the result is what matters.</p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Result Journey */}
      <section className="section bg-carbon-950">
        <div className="container-page">
          <Reveal className="mb-12 text-center">
            <span className="eyebrow">Our Philosophy</span>
            <h2 className="mt-4 section-title">The Journey to Results</h2>
            <p className="mx-auto mt-4 max-w-lg text-carbon-400">Every business moves through these stages. We help you navigate each one — and accelerate the path from dream to growth.</p>
          </Reveal>
          <Reveal>
            <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
              {RESULT_JOURNEY.map((step, i) => (
                <div key={step.label} className="flex items-center gap-2 sm:gap-3">
                  <div className="group flex flex-col items-center">
                    <div className="flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-2xl bg-carbon-800 ring-1 ring-white/10 text-white font-serif text-xs sm:text-sm font-semibold transition-all hover:bg-amber-500 hover:text-white hover:ring-amber-500 hover:scale-110">{step.label}</div>
                    <p className="mt-2 max-w-[80px] text-center text-[10px] text-carbon-500 leading-tight hidden sm:block">{step.desc}</p>
                  </div>
                  {i < RESULT_JOURNEY.length - 1 && <ArrowRight size={16} className="text-carbon-600 shrink-0" />}
                </div>
              ))}
            </div>
          </Reveal>
          <Reveal className="mt-12 text-center" delay={200}>
            <p className="font-serif text-xl text-carbon-300 italic max-w-2xl mx-auto">"Because when everything is said and done, the result is what matters."</p>
          </Reveal>
        </div>
      </section>

      {/* Gigs Preview */}
      <section className="section bg-carbon-900">
        <div className="container-page">
          <Reveal className="mb-10 text-center">
            <span className="eyebrow">Marketplace</span>
            <h2 className="mt-4 section-title">Ready-to-Order Services</h2>
            <p className="mx-auto mt-4 max-w-lg text-carbon-400">Clear pricing, delivery times, and proven results — start growing with any of these professional gigs.</p>
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
                      <Sparkles size={10} className="fill-amber-500" /> {g.rating}
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

      {/* CTA */}
      <section className="section bg-carbon-950">
        <div className="container-page">
          <Reveal>
            <div className="card-dark p-10 text-center">
              <h2 className="section-title">Ready to Start Growing?</h2>
              <p className="mx-auto mt-4 max-w-md text-carbon-400">Your first strategy consultation is free. Let's talk about where you are and where you want to go.</p>
              <button onClick={() => navigate('/contact')} className="btn-amber mt-6">Start a Project <ArrowUpRight size={16} /></button>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
