import { useEffect } from 'react';
import { Check, ArrowRight, Clock, TrendingUp, Star } from 'lucide-react';
import { useHashRoute } from '../lib/router';
import { SERVICES, PRICING } from '../lib/data';

export default function ServicesPage() {
  const { navigate } = useHashRoute();

  useEffect(() => {
    const hash = window.location.hash;
    if (hash.includes('#')) {
      const id = hash.split('#')[1];
      setTimeout(() => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  }, []);

  return (
    <div className="pt-20">
      <section className="relative bg-carbon-950 py-16 overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-30" />
        <div className="absolute left-1/2 top-0 -translate-x-1/2 h-px w-3/4 bg-gradient-to-r from-transparent via-amber-500/40 to-transparent" />
        <div className="container-page relative text-center">
          <span className="eyebrow">Our Capabilities</span>
          <h1 className="mt-4 font-serif text-5xl font-semibold text-white sm:text-6xl">Services</h1>
          <p className="mx-auto mt-4 max-w-xl text-carbon-400">Every service is designed to deliver measurable growth. Click any service for a full overview of what it is, what people overlook, the timeline, and the benefits.</p>
        </div>
      </section>

      <section className="section bg-carbon-950">
        <div className="container-page space-y-6">
          {SERVICES.map((s, i) => (
            <div key={s.id} id={s.id} className="card-dark overflow-hidden scroll-mt-24">
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
                    <h2 className="mt-2 font-serif text-2xl font-semibold text-white">{s.name}</h2>
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
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section className="section bg-carbon-900">
        <div className="container-page">
          <div className="mb-12 text-center">
            <span className="eyebrow">Pricing</span>
            <h2 className="mt-4 section-title">Plans for every stage</h2>
          </div>
          <div className="grid gap-5 md:grid-cols-3 max-w-5xl mx-auto">
            {PRICING.map((plan) => (
              <div key={plan.name} className={`relative rounded-2xl p-7 ring-1 transition hover:-translate-y-1 ${plan.highlight ? 'bg-forest-950 ring-forest-700/50 shadow-forest' : 'card-dark'}`}>
                {plan.highlight && <span className="absolute -top-3 left-1/2 -translate-x-1/2 chip bg-amber-600 text-white shadow-amber text-[10px]">Most Popular</span>}
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
            ))}
          </div>
          <p className="mt-8 text-center text-sm text-carbon-400">
            For flexible pricing structures and personalized service consultation, <button onClick={() => navigate('/contact')} className="text-amber-500 hover:underline">contact us directly</button> for a proactive discussion.
          </p>
          <div className="mt-6 text-center">
            <button onClick={() => navigate('/terms')} className="text-sm text-carbon-500 hover:text-amber-500 transition underline">View Contract & Payment Terms</button>
          </div>
        </div>
      </section>
    </div>
  );
}
