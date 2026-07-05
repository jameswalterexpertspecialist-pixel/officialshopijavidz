import { ArrowLeft, Star, Clock, Check, ArrowRight } from 'lucide-react';
import { useHashRoute } from '../lib/router';
import { GIGS, AGENCY_EMAIL } from '../lib/data';

export default function GigDetailPage({ id }: { id: string }) {
  const { navigate } = useHashRoute();
  const gig = GIGS.find((g) => g.id === id);

  if (!gig) {
    return <div className="pt-32 text-center"><h1 className="font-serif text-3xl text-white">Gig not found</h1><button onClick={() => navigate('/gigs')} className="btn-amber mt-6">Back to Gigs</button></div>;
  }

  return (
    <div className="pt-20">
      <section className="section bg-carbon-950">
        <div className="container-page">
          <button onClick={() => navigate('/gigs')} className="flex items-center gap-1.5 text-sm text-carbon-400 hover:text-white"><ArrowLeft size={16} /> Back to Gigs</button>
          <div className="mt-6 grid gap-10 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <div className="overflow-hidden rounded-2xl ring-1 ring-white/10 shadow-card">
                <img src={gig.img} alt={gig.title} className="h-80 w-full object-cover" />
              </div>
              <h1 className="mt-6 font-serif text-4xl font-semibold text-white">{gig.title}</h1>
              <div className="mt-3 flex items-center gap-4">
                <span className="flex items-center gap-1 text-amber-500"><Star size={16} className="fill-amber-500" /> {gig.rating}</span>
                <span className="text-sm text-carbon-400">({gig.reviews} reviews)</span>
                <span className="flex items-center gap-1 text-carbon-400"><Clock size={15} /> {gig.delivery} delivery</span>
              </div>
              <p className="mt-5 text-carbon-400 leading-relaxed">{gig.desc}</p>
              <h2 className="mt-8 font-serif text-2xl font-semibold text-white">What is included</h2>
              <ul className="mt-4 space-y-2.5">
                {['Professional consultation', 'Premium quality delivery', 'Source files included', 'Two rounds of revisions', 'Direct communication throughout', 'Satisfaction guarantee'].map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm text-carbon-300"><Check size={16} className="mt-0.5 shrink-0 text-forest-400" /> {f}</li>
                ))}
              </ul>
            </div>
            <div>
              <div className="sticky top-24 card-dark p-6">
                <div className="flex items-baseline justify-between">
                  <span className="font-serif text-4xl font-semibold text-white">${gig.price}</span>
                  <span className="text-sm text-carbon-400">starting at</span>
                </div>
                <p className="mt-1 text-sm text-carbon-400">{gig.delivery} delivery</p>
                <a href={`mailto:${AGENCY_EMAIL}?subject=Gig Inquiry: ${gig.title}`} className="btn-amber mt-5 w-full">Order Now <ArrowRight size={15} /></a>
                <button onClick={() => navigate('/contact')} className="btn-outline-amber mt-3 w-full">Ask a Question</button>
                <p className="mt-4 text-center text-xs text-carbon-500">Free consultation. No payment required to inquire.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
