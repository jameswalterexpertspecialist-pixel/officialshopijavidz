import { ArrowLeft, ArrowUpRight, TrendingUp, Star, Quote } from 'lucide-react';
import { useHashRoute } from '../lib/router';
import { PROJECTS } from '../lib/data';

export default function ProjectDetailPage({ id }: { id: string }) {
  const { navigate } = useHashRoute();
  const project = PROJECTS.find((p) => p.id === id);

  if (!project) {
    return (
      <div className="pt-32 text-center">
        <h1 className="font-serif text-3xl text-white">Project not found</h1>
        <button onClick={() => navigate('/portfolio')} className="btn-amber mt-6">Back to Portfolio</button>
      </div>
    );
  }

  return (
    <div className="pt-20">
      <section className="relative h-[400px] overflow-hidden">
        <img src={project.img} alt={project.name} className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-carbon-950 via-carbon-950/50 to-carbon-950/30" />
        <div className="container-page absolute inset-x-0 bottom-0 pb-10">
          <button onClick={() => navigate('/portfolio')} className="flex items-center gap-1.5 text-sm text-white/70 hover:text-white"><ArrowLeft size={16} /> Back to Portfolio</button>
          <span className="mt-4 inline-block chip bg-amber-600/20 text-amber-400">{project.industry}</span>
          <h1 className="mt-3 font-serif text-5xl font-semibold text-white">{project.name}</h1>
          <a href={project.url} target="_blank" rel="noopener noreferrer" className="mt-3 inline-flex items-center gap-1 text-sm text-forest-400 hover:text-forest-300">{project.url} <ArrowUpRight size={14} /></a>
        </div>
      </section>

      <section className="section bg-carbon-950">
        <div className="container-page grid gap-10 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-8">
            <div>
              <h2 className="font-serif text-2xl font-semibold text-white">The Challenge</h2>
              <p className="mt-3 text-carbon-400 leading-relaxed">{project.challenge}</p>
            </div>
            <div>
              <h2 className="font-serif text-2xl font-semibold text-white">Our Strategy</h2>
              <p className="mt-3 text-carbon-400 leading-relaxed">{project.strategy}</p>
            </div>
            <div>
              <h2 className="font-serif text-2xl font-semibold text-white">Services Provided</h2>
              <div className="mt-3 flex flex-wrap gap-2">
                {project.services.map((s) => <span key={s} className="chip bg-forest-900/60 text-forest-400">{s}</span>)}
              </div>
            </div>
            <div>
              <h2 className="font-serif text-2xl font-semibold text-white">Client Feedback</h2>
              <div className="mt-4 card-dark p-6">
                <Quote size={24} className="text-amber-500/40" />
                <p className="mt-3 font-serif text-lg italic text-white leading-relaxed">"{project.testimonial.text}"</p>
                <div className="mt-4 flex items-center gap-3">
                  <div className="flex gap-0.5">{Array.from({ length: 5 }).map((_, j) => <Star key={j} size={14} className="fill-amber-500 text-amber-500" />)}</div>
                  <span className="text-sm text-white font-semibold">{project.testimonial.name}</span>
                  <span className="text-sm text-carbon-400">{project.testimonial.role}</span>
                </div>
              </div>
            </div>
          </div>
          <div>
            <div className="sticky top-24 card-dark p-6">
              <h3 className="font-serif text-xl font-semibold text-white">Results</h3>
              <div className="mt-5 space-y-4">
                {[
                  { label: 'Revenue Growth', value: project.results.revenue },
                  { label: 'Conversion Rate', value: project.results.conversion },
                  { label: 'Bounce Rate', value: project.results.bounce },
                  { label: 'Mobile Performance', value: project.results.mobile },
                ].map((r) => (
                  <div key={r.label} className="flex items-center justify-between border-b border-white/8 pb-3">
                    <span className="text-sm text-carbon-400">{r.label}</span>
                    <span className="font-serif text-lg font-semibold text-amber-500">{r.value}</span>
                  </div>
                ))}
              </div>
              <div className="mt-5 rounded-xl bg-forest-900/40 p-4 ring-1 ring-forest-700/30">
                <TrendingUp size={20} className="text-forest-400" />
                <p className="mt-2 text-sm text-carbon-300">All metrics measured 4 months post-launch compared to pre-launch baseline.</p>
              </div>
              <a href={project.url} target="_blank" rel="noopener noreferrer" className="btn-amber mt-5 w-full">View Store Design <ArrowUpRight size={15} /></a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
