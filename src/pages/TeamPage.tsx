import { Mail, MessageCircle, Send, ArrowRight } from 'lucide-react';
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
          <h1 className="mt-4 font-serif text-5xl font-semibold text-white sm:text-6xl">Meet the team</h1>
          <p className="mx-auto mt-4 max-w-xl text-carbon-400">The people behind every project. Each team member brings dedication, skill, and a commitment to delivering real results.</p>
        </div>
      </section>

      <section className="section bg-carbon-950">
        <div className="container-page">
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {TEAM.map((member) => (
              <div key={member.name} className="group card-dark overflow-hidden transition-all hover:-translate-y-1 hover:shadow-lift">
                <div className={`relative overflow-hidden ${member.isFounder ? 'h-80' : 'h-64'}`}>
                  <img src={member.img} alt={member.name} className={`h-full w-full transition-transform duration-500 group-hover:scale-105 ${member.isFounder ? 'object-contain bg-carbon-900' : 'object-cover'}`} />
                  <div className="absolute inset-0 bg-gradient-to-t from-carbon-950 to-transparent" />
                  {member.isFounder && <span className="absolute left-3 top-3 chip bg-amber-500 text-carbon-950 text-[10px]">Founder</span>}
                </div>
                <div className="p-5">
                  <h3 className="font-serif text-lg font-semibold text-white">{member.name}</h3>
                  <p className="text-sm text-amber-500">{member.role}</p>
                  <p className="mt-2 text-xs text-carbon-400 leading-relaxed line-clamp-3">{member.desc}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {member.isFounder ? (
                      <>
                        <a href={`mailto:${member.email}`} className="flex h-8 w-8 items-center justify-center rounded-full bg-carbon-800 text-carbon-400 ring-1 ring-white/10 transition hover:bg-amber-500 hover:text-carbon-950" title="Email"><Mail size={14} /></a>
                        <a href={member.whatsapp} target="_blank" rel="noopener noreferrer" className="flex h-8 w-8 items-center justify-center rounded-full bg-carbon-800 text-carbon-400 ring-1 ring-white/10 transition hover:bg-forest-600 hover:text-white" title="WhatsApp"><MessageCircle size={14} /></a>
                        <a href={member.telegram} target="_blank" rel="noopener noreferrer" className="flex h-8 w-8 items-center justify-center rounded-full bg-carbon-800 text-carbon-400 ring-1 ring-white/10 transition hover:bg-blue-600 hover:text-white" title="Telegram"><Send size={14} /></a>
                      </>
                    ) : (
                      <>
                        <button onClick={() => navigate('/contact')} className="chip bg-amber-500/15 text-amber-400 hover:bg-amber-500/25 transition text-[10px] flex items-center gap-1">
                          Connect via Request <ArrowRight size={10} />
                        </button>
                        <a href={member.telegram} target="_blank" rel="noopener noreferrer" className="flex h-8 w-8 items-center justify-center rounded-full bg-carbon-800 text-carbon-400 ring-1 ring-white/10 transition hover:bg-blue-600 hover:text-white" title="Telegram"><Send size={14} /></a>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
