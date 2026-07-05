import { Star, Clock, ArrowRight, ArrowUpRight } from 'lucide-react';
import { useHashRoute } from '../lib/router';
import { GIGS } from '../lib/data';

export default function GigsPage() {
  const { navigate } = useHashRoute();

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

      <section className="section bg-carbon-950">
        <div className="container-page">
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {GIGS.map((g) => (
              <button key={g.id} onClick={() => navigate(`/gigs/${g.id}`)} className="group card-dark overflow-hidden text-left transition-all hover:-translate-y-1 hover:shadow-lift hover:ring-amber-500/20">
                <div className="relative h-40 overflow-hidden">
                  <img src={g.img} alt={g.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-carbon-950/60 to-transparent" />
                  <span className="absolute right-3 top-3 chip bg-carbon-950/80 text-amber-500 text-[10px] backdrop-blur">{g.delivery}</span>
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
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
