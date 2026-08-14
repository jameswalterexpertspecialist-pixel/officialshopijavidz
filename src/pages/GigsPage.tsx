import { useState, useEffect, useRef } from 'react';
import { Star, ArrowRight, Search } from 'lucide-react';
import { useHashRoute } from '../lib/router';
import { GIGS } from '../lib/data';

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

export default function GigsPage() {
  const { navigate } = useHashRoute();
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');

  const categories = ['All', ...Array.from(new Set(GIGS.map(g => g.category)))];
  const filteredGigs = GIGS.filter(g => {
    if (filter !== 'All' && g.category !== filter) return false;
    if (search && !g.title.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="pt-20">
      <section className="relative bg-carbon-950 py-16 overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-30" />
        <div className="absolute left-1/2 top-0 -translate-x-1/2 h-px w-3/4 bg-gradient-to-r from-transparent via-amber-500/40 to-transparent" />
        <div className="container-page relative text-center">
          <span className="eyebrow">Marketplace</span>
          <h1 className="mt-4 font-serif text-5xl font-semibold text-white sm:text-6xl">Professional Gigs</h1>
          <p className="mx-auto mt-4 max-w-xl text-carbon-400">Ready-to-order services with clear pricing, delivery times, and proven results. Pick what you need and get started immediately.</p>
        </div>
      </section>

      {/* Search + filters */}
      <section className="sticky top-16 z-30 bg-carbon-950/95 backdrop-blur-md border-y border-white/5">
        <div className="container-page py-4">
          <div className="flex flex-col sm:flex-row items-center gap-3 justify-between">
            <div className="flex items-center gap-1.5 rounded-full bg-carbon-800 px-3 py-2 ring-1 ring-white/10 w-full sm:w-64">
              <Search size={14} className="text-carbon-500" />
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search gigs..."
                className="bg-transparent text-sm text-white placeholder:text-carbon-500 outline-none flex-1"
              />
            </div>
            <div className="flex flex-wrap gap-1.5 justify-center">
              {categories.map(c => (
                <button
                  key={c}
                  onClick={() => setFilter(c)}
                  className={`chip transition ${filter === c ? 'bg-amber-500 text-white' : 'bg-carbon-900 text-carbon-400 ring-1 ring-white/10 hover:text-white'}`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Gigs grid */}
      <section className="section bg-carbon-950">
        <div className="container-page">
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredGigs.map((g, i) => (
              <Reveal key={g.id} delay={i * 50}>
                <button onClick={() => navigate(`/gigs/${g.id}`)} className="group card-dark overflow-hidden text-left transition-all hover:-translate-y-1 hover:shadow-lift hover:ring-amber-500/20 w-full">
                  <div className="relative h-40 overflow-hidden">
                    <img src={g.img} alt={g.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" />
                    <div className="absolute inset-0 bg-gradient-to-t from-carbon-950/60 to-transparent" />
                    <span className="absolute right-3 top-3 chip bg-carbon-950/80 text-amber-500 text-[10px] backdrop-blur">{g.delivery}</span>
                    <span className="absolute left-3 top-3 chip bg-amber-500/20 text-amber-400 text-[10px] backdrop-blur">{g.category}</span>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-white group-hover:text-amber-400 transition-colors">{g.title}</h3>
                    <p className="mt-1 text-xs text-carbon-400 line-clamp-2">{g.desc}</p>
                    <div className="mt-3 flex items-center justify-between">
                      <span className="text-xs text-carbon-500">Starts at</span>
                      <span className="font-serif text-xl font-semibold text-white">${g.price}</span>
                    </div>
                    <div className="mt-2 flex items-center gap-1 text-xs text-amber-500">
                      <Star size={12} className="fill-amber-500" /> {g.rating} <span className="text-carbon-500">({g.reviews} reviews)</span>
                    </div>
                  </div>
                </button>
              </Reveal>
            ))}
          </div>

          {filteredGigs.length === 0 && (
            <div className="text-center py-20">
              <p className="text-carbon-400">No gigs found matching your search.</p>
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="section-sm bg-carbon-900">
        <div className="container-page">
          <div className="rounded-3xl bg-gradient-to-br from-forest-900 to-carbon-900 p-10 text-center ring-1 ring-forest-700/40 relative overflow-hidden">
            <div className="absolute -left-16 top-1/2 h-48 w-48 -translate-y-1/2 rounded-full bg-amber-500/10 blur-3xl" />
            <div className="relative">
              <h2 className="font-serif text-2xl font-semibold text-white">Don't see what you need?</h2>
              <p className="mt-3 text-carbon-300 text-sm">We offer custom services beyond what's listed here. Tell us about your project.</p>
              <button onClick={() => navigate('/contact')} className="btn-amber mt-6">Start a Project <ArrowRight size={16} /></button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
