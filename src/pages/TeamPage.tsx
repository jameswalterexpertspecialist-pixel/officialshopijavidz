import { Mail, MessageCircle, Send, ArrowRight, Briefcase } from 'lucide-react';
import { useHashRoute } from '../lib/router';
import { TEAM } from '../lib/data';

export default function TeamPage() {
  const { navigate } = useHashRoute();
  return (
    <div className="pt-20">
      <section className="relative bg-carbon-950 py-16 overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-30" />
        <div className="absolute left-1/2 top-0 -translate-x-1/2 h-px w-3/4 bg-gradient-to-r from-transparent via-amber-500/40 to-transparent" />
        <div className="container-page relative text-center">
          <span className="eyebrow">Our People</span>
          <h1 className="mt-4 font-serif text-5xl font-semibold text-white sm:text-6xl">Meet the Team</h1>
          <p className="mx-auto mt-4 max-w-xl text-carbon-400">The people behind every project. Each team member brings dedication, skill, and a commitment to delivering real results.</p>
        </div>
      </section>

      <section className="section bg-carbon-950">
        <div className="container-page">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {TEAM.map((member) => (
              <div key={member.name} className="group card-dark overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:shadow-lift">
                <div className="relative overflow-hidden h-80">
                  <img src={member.img} alt={member.name} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-carbon-950 via-carbon-950/20 to-transparent" />
                  {member.isFounder && <span className="absolute left-3 top-3 chip bg-amber-500 text-carbon-950 text-[10px] font-bold">Founder</span>}
                  <div className="absolute bottom-3 left-3 right-3">
                    <h3 className="font-serif text-lg font-semibold text-white">{member.name}</h3>
                    <p className="text-sm text-amber-500">{member.role}</p>
                  </div>
                </div>
                <div className="p-5">
                  <div className="flex items-center gap-2 text-xs text-carbon-400">
                    <Briefcase size={12} className="text-forest-400" />
                    <span>{member.agency}</span>
                  </div>
                  <p className="mt-3 text-xs text-carbon-400 leading-relaxed line-clamp-4">{member.desc}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {member.isFounder && (
                      <>
                        <a href={`mailto:${member.email}`} className="flex h-8 w-8 items-center justify-center rounded-full bg-carbon-800 text-carbon-400 ring-1 ring-white/10 transition hover:bg-amber-500 hover:text-carbon-950" title="Email"><Mail size={14} /></a>
                        <a href={member.whatsapp} target="_blank" rel="noopener noreferrer" className="flex h-8 w-8 items-center justify-center rounded-full bg-carbon-800 text-carbon-400 ring-1 ring-white/10 transition hover:bg-forest-600 hover:text-white" title="WhatsApp"><MessageCircle size={14} /></a>
                        <a href={member.telegram} target="_blank" rel="noopener noreferrer" className="flex h-8 w-8 items-center justify-center rounded-full bg-carbon-800 text-carbon-400 ring-1 ring-white/10 transition hover:bg-blue-600 hover:text-white" title="Telegram"><Send size={14} /></a>
                      </>
                    )}
                    {!member.isFounder && (
                      <>
                        <button onClick={() => navigate('/contact')} className="chip bg-amber-500/15 text-amber-400 hover:bg-amber-500/25 transition text-[10px] flex items-center gap-1">
                          Connect <ArrowRight size={10} />
                        </button>
                        <a href={member.telegram} target="_blank" rel="noopener noreferrer" className="flex h-8 w-8 items-center justify-center rounded-full bg-carbon-800 text-carbon-400 ring-1 ring-white/10 transition hover:bg-blue-600 hover:text-white" title="Telegram"><Send size={14} /></a>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <div className="card-dark inline-block px-8 py-6">
              <p className="font-serif text-xl text-white">Want to work with our team?</p>
              <p className="mt-1 text-sm text-carbon-400">Start a project and let's discuss how we can help your business grow.</p>
              <button onClick={() => navigate('/contact')} className="btn-amber btn-sm mt-4">Start a Project <ArrowRight size={14} /></button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
