import { ArrowRight, MapPin, Briefcase } from 'lucide-react';
import { useHashRoute } from '../lib/router';
import { CAREERS, AGENCY_EMAIL } from '../lib/data';

export default function CareersPage() {
  const { navigate } = useHashRoute();
  return (
    <div className="pt-20">
      <section className="relative bg-carbon-950 py-16 overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-30" />
        <div className="absolute left-1/2 top-0 -translate-x-1/2 h-px w-3/4 bg-gradient-to-r from-transparent via-amber-500/40 to-transparent" />
        <div className="container-page relative text-center">
          <span className="eyebrow">Join Us</span>
          <h1 className="mt-4 font-serif text-5xl font-semibold text-white sm:text-6xl">Careers</h1>
          <p className="mx-auto mt-4 max-w-xl text-carbon-400">We are always looking for talented, passionate people who care about doing great work. Explore our open positions below.</p>
        </div>
      </section>

      <section className="section bg-carbon-950">
        <div className="container-page">
          <div className="space-y-4">
            {CAREERS.map((job, i) => (
              <div key={i} className="card-dark p-6 transition hover:ring-forest-700/30 hover:shadow-card">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="font-serif text-xl font-semibold text-white">{job.title}</h3>
                    <div className="mt-2 flex flex-wrap gap-3 text-xs text-carbon-400">
                      <span className="flex items-center gap-1"><Briefcase size={12} /> {job.type}</span>
                      <span className="flex items-center gap-1"><MapPin size={12} /> {job.location}</span>
                    </div>
                    <p className="mt-3 text-sm text-carbon-400 leading-relaxed">{job.desc}</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {job.skills.map((s) => <span key={s} className="chip bg-forest-900/60 text-forest-400 text-[10px]">{s}</span>)}
                    </div>
                  </div>
                  <a href={`mailto:${AGENCY_EMAIL}?subject=Job Application: ${job.title}`} className="btn-outline-amber btn-sm shrink-0">Apply Now <ArrowRight size={14} /></a>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 rounded-2xl bg-forest-900 p-8 text-center ring-1 ring-forest-700/40">
            <h3 className="font-serif text-2xl font-semibold text-white">Do not see your role?</h3>
            <p className="mt-2 text-carbon-300">We are always interested in meeting talented people. Send us your resume and tell us how you can contribute.</p>
            <a href={`mailto:${AGENCY_EMAIL}?subject=General Application`} className="btn-amber mt-5">Send Your Resume <ArrowRight size={16} /></a>
          </div>
        </div>
      </section>
    </div>
  );
}
