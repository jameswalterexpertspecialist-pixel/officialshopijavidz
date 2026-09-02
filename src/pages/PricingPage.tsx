import { useEffect, useRef, useState } from 'react';
import { Check, ArrowRight, ShoppingBag, Megaphone, Palette, Briefcase, Compass } from 'lucide-react';
import { useHashRoute } from '../lib/router';
import { PRICING, PRICING_CATEGORIES } from '../lib/data';

const iconMap: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  ShoppingBag, Megaphone, Palette, Briefcase, Compass,
};

function Icon({ name, size, className }: { name: string; size?: number; className?: string }) {
  const C = iconMap[name] || Compass;
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
    <div ref={ref} className={`${className} transition-all duration-700 ease-out ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  );
}

export default function PricingPage() {
  const { navigate } = useHashRoute();
  const [filter, setFilter] = useState('All');
  const filters = ['All', 'Ecommerce', 'Marketing', 'Creative', 'Business', 'Strategy'];

  const filteredCategories = filter === 'All'
    ? PRICING_CATEGORIES
    : PRICING_CATEGORIES.filter(c => {
        if (filter === 'Ecommerce') return c.id === 'ecommerce';
        if (filter === 'Marketing') return c.id === 'marketing';
        if (filter === 'Creative') return c.id === 'creative';
        if (filter === 'Business') return c.id === 'business';
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
          <span className="eyebrow">Transparent Pricing</span>
          <h1 className="mt-4 font-serif text-5xl font-semibold text-white sm:text-6xl">Pricing</h1>
          <p className="mx-auto mt-4 max-w-xl text-carbon-400">Clear, honest pricing for every service. No hidden fees. No commissions. Pick what you need and get started immediately.</p>
        </div>
      </section>

      {/* Package tiers (original pricing preserved) */}
      <section className="section-sm bg-carbon-950">
        <div className="container-page">
          <Reveal className="mb-8 text-center">
            <span className="eyebrow">Package Tiers</span>
            <h2 className="mt-3 font-serif text-2xl font-semibold text-white">Full-Service Packages Plans</h2>
            <p className="mt-3 text-sm text-carbon-400">Complete solutions from starter to enterprise. For custom pricing, contact us directly.</p>
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
                    {plan.features.map(f => (
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
        </div>
      </section>

      {/* Filter bar */}
      <div className="sticky top-16 z-30 bg-carbon-950/95 backdrop-blur-md border-y border-white/5">
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
      </div>

      {/* Categorized pricing */}
      <section className="section bg-carbon-900">
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
                    <p className="text-xs text-carbon-400">{cat.services.length} services</p>
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  {cat.services.map((s, si) => (
                    <Reveal key={s.name} delay={si * 60}>
                      <div className={`relative card-dark p-5 h-full transition-all hover:-translate-y-1 hover:shadow-lift ${s.popular ? 'ring-amber-500/30' : ''}`}>
                        {s.popular && (
                          <span className="absolute -top-2 left-1/2 -translate-x-1/2 chip bg-amber-500 text-white text-[9px]">Popular</span>
                        )}
                        <h3 className="font-semibold text-white text-sm">{s.name}</h3>
                        <div className="mt-2 flex items-baseline gap-1">
                          <span className="font-serif text-2xl font-bold text-amber-500">{s.price}</span>
                          <span className="text-[10px] text-carbon-400">{s.period}</span>
                        </div>
                        <ul className="mt-3 space-y-1.5">
                          {s.features.map(f => (
                            <li key={f} className="flex items-start gap-1.5 text-[11px] text-carbon-400">
                              <Check size={12} className="mt-0.5 shrink-0 text-forest-400" /> {f}
                            </li>
                          ))}
                        </ul>
                        <button onClick={() => navigate('/contact')} className="btn-outline-amber btn-sm mt-4 w-full">Get Started</button>
                      </div>
                    </Reveal>
                  ))}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="section-sm bg-carbon-950">
        <div className="container-page">
          <div className="rounded-3xl bg-gradient-to-br from-forest-900 to-carbon-900 p-10 text-center ring-1 ring-forest-700/40 relative overflow-hidden">
            <div className="absolute -left-16 top-1/2 h-48 w-48 -translate-y-1/2 rounded-full bg-amber-500/10 blur-3xl" />
            <div className="relative">
              <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-white">Need a custom package?</h2>
              <p className="mt-3 text-carbon-300 text-sm">Tell us about your project and we'll build a pricing plan that fits your needs and budget.</p>
              <button onClick={() => navigate('/contact')} className="btn-amber mt-6">Start a Project <ArrowRight size={16} /></button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
