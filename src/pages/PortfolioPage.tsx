import { useState } from 'react';
import { ArrowUpRight, Star, TrendingUp, Mail, MessageCircle, Quote, Send, ArrowRight } from 'lucide-react';
import { useHashRoute } from '../lib/router';
import { PROJECTS, TESTIMONIALS, TEAM, MILESTONES, FOUNDER_IMG, FOUNDED_YEAR, AGENCY_EMAIL, STATS_FULL, FOUNDER_EMAIL, FOUNDER_WHATSAPP, SOCIAL_LINKS } from '../lib/data';
import { Instagram, Facebook, Twitter, Youtube } from 'lucide-react';

const socialIcons: Record<string, React.ComponentType<{ size?: number }>> = {
  facebook: Facebook,
  instagram: Instagram,
  twitter: Twitter,
  tiktok: Youtube,
  quora: Youtube,
};

const categories = ['All', 'Ecommerce', 'Branding', 'Web Design', 'Marketing'];

export default function PortfolioPage() {
  const { navigate } = useHashRoute();
  const [cat, setCat] = useState('All');

  return (
    <div className="pt-20">
      {/* Header */}
      <section className="relative bg-carbon-950 py-16 overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-30" />
        <div className="absolute left-1/2 top-0 -translate-x-1/2 h-px w-3/4 bg-gradient-to-r from-transparent via-amber-500/40 to-transparent" />
        <div className="container-page relative text-center">
          <span className="eyebrow">Our Work</span>
          <h1 className="mt-4 font-serif text-5xl font-semibold text-white sm:text-6xl">Portfolio & Case Studies</h1>
          <p className="mx-auto mt-4 max-w-xl text-carbon-400">Real projects, real results. Every brand we work with gets our full attention and a system built to scale.</p>
        </div>
      </section>

      {/* Results summary */}
      <section className="bg-carbon-900 py-10">
        <div className="container-page">
          <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
            {[
              { label: 'Client Revenue Generated', value: '$30M+' },
              { label: 'Projects Delivered', value: '52+' },
              { label: 'Avg Conversion Lift', value: '2.3x' },
              { label: 'Client Satisfaction', value: '91%' },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <p className="font-serif text-3xl font-semibold text-amber-500">{s.value}</p>
                <p className="mt-1 text-xs text-carbon-400 uppercase tracking-widest">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Projects grid */}
      <section className="section bg-carbon-950">
        <div className="container-page">
          <div className="mb-8 flex flex-wrap gap-2 justify-center">
            {categories.map((c) => (
              <button key={c} onClick={() => setCat(c)} className={`chip transition ${cat === c ? 'bg-amber-600 text-white' : 'bg-carbon-900 text-carbon-400 ring-1 ring-white/10 hover:text-white'}`}>{c}</button>
            ))}
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            {PROJECTS.map((p) => (
              <button key={p.id} onClick={() => navigate(`/portfolio/${p.id}`)} className="group relative overflow-hidden rounded-2xl text-left ring-1 ring-white/10 shadow-card transition-all hover:-translate-y-1 hover:shadow-lift">
                <div className="relative h-72 overflow-hidden">
                  <img src={p.img} alt={p.name} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-carbon-950 via-carbon-950/40 to-transparent" />
                  <span className="absolute left-4 top-4 chip bg-amber-600/20 text-amber-400 text-[10px]">{p.industry}</span>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="font-serif text-2xl font-semibold text-white">{p.name}</h3>
                  <p className="mt-1 text-sm text-white/70">{p.services.join(' · ')}</p>
                  <div className="mt-3 flex flex-wrap gap-3 text-xs font-semibold">
                    <span className="flex items-center gap-1 text-forest-400"><TrendingUp size={12} /> {p.results.revenue}</span>
                    <span className="text-amber-500">{p.results.conversion} conversion</span>
                  </div>
                  <div className="mt-4 flex items-center gap-2 text-sm font-semibold text-amber-500 opacity-0 transition-opacity group-hover:opacity-100">
                    View Case Study <ArrowUpRight size={15} />
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials in portfolio */}
      <section className="section bg-carbon-900">
        <div className="container-page">
          <div className="mb-10 text-center">
            <span className="eyebrow">What People Say</span>
            <h2 className="mt-4 section-title">Client testimonials</h2>
          </div>
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {TESTIMONIALS.map((t, i) => (
              <div key={i} className="card-dark p-6">
                <Quote size={24} className="text-amber-500/40" />
                <p className="mt-3 text-sm leading-relaxed text-carbon-300">{t.text}</p>
                <div className="mt-5 flex items-center gap-3">
                  <img src={t.avatar} alt="" className="h-10 w-10 rounded-full object-cover ring-1 ring-amber-500/30" />
                  <div>
                    <p className="text-sm font-semibold text-white">{t.name}</p>
                    <p className="text-xs text-carbon-400">{t.role}</p>
                  </div>
                  <div className="ml-auto flex gap-0.5">
                    {Array.from({ length: t.rating }).map((_, j) => <Star key={j} size={12} className="fill-amber-500 text-amber-500" />)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact CTA in portfolio */}
      <section className="section-sm bg-carbon-950">
        <div className="container-page">
          <div className="rounded-3xl bg-forest-900 p-10 text-center ring-1 ring-forest-700/40">
            <h2 className="font-serif text-3xl font-semibold text-white">Want results like these?</h2>
            <p className="mt-3 text-carbon-300">Your free consultation is one message away.</p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <a href={`mailto:${AGENCY_EMAIL}`} className="btn-amber"><Mail size={16} /> Email Us</a>
              <a href={FOUNDER_WHATSAPP} target="_blank" rel="noopener noreferrer" className="btn-forest"><MessageCircle size={16} /> WhatsApp</a>
            </div>
          </div>
        </div>
      </section>

      {/* ── ABOUT / FOUNDER ── */}
      <section className="section bg-carbon-900 relative overflow-hidden">
        <div className="absolute inset-0 noise opacity-5" />
        <div className="container-page relative">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div className="relative">
              <div className="overflow-hidden rounded-3xl ring-1 ring-amber-500/20 shadow-lift">
                <img src={FOUNDER_IMG} alt="Jacob David" className="w-full object-contain" style={{ maxHeight: '640px' }} />
              </div>
              <div className="absolute -bottom-5 -right-5 rounded-2xl bg-amber-600 p-5 shadow-amber">
                <p className="text-xs text-white/80 uppercase tracking-widest">Founded</p>
                <p className="font-serif text-3xl font-semibold text-white">{FOUNDED_YEAR}</p>
              </div>
            </div>
            <div>
              <span className="eyebrow">About The Founder</span>
              <h2 className="mt-4 font-serif text-4xl font-semibold text-white sm:text-5xl">Jacob David</h2>
              <p className="mt-1 text-amber-500 font-medium">Founder & Creative Director</p>
              <div className="mt-6 space-y-4 text-carbon-400 leading-relaxed">
                <p>Jacob David developed a deep passion for technology, creativity, and digital innovation during his school years. He was fascinated by how digital systems could transform businesses, create opportunities, and connect people globally.</p>
                <p>While others saw technology as entertainment, he saw it as the future of business and independence. His curiosity pushed him to study branding, online business structures, digital systems, ecommerce, automation, and creative marketing. He spent countless hours exploring how websites worked, how brands were built, and how online businesses could scale beyond physical limitations.</p>
                <p>Over time, his passion evolved into a mission. He wanted to build a professional agency where ambition meets execution and where brands can experience real, measurable growth. An agency where desire meets results.</p>
                <p>This vision led to the creation of SHOPIJAVID in {FOUNDED_YEAR}. The company was built on one principle: <span className="text-amber-500 font-semibold">"What matters is results."</span> That motto reflects the commitment to delivering real outcomes instead of empty promises.</p>
              </div>
              <div className="mt-7 flex gap-3">
                <a href={`mailto:${FOUNDER_EMAIL}`} className="btn-outline-amber btn-sm"><Mail size={14} /> Contact Jacob</a>
                <a href={FOUNDER_WHATSAPP} target="_blank" rel="noopener noreferrer" className="btn-forest btn-sm"><MessageCircle size={14} /> WhatsApp</a>
              </div>
              <div className="mt-5 flex flex-wrap gap-2">
                {SOCIAL_LINKS.map((s) => {
                  const Icon = socialIcons[s.icon] || Youtube;
                  return (
                    <a key={s.name} href={s.url} target="_blank" rel="noopener noreferrer" title={s.name} className="flex h-9 w-9 items-center justify-center rounded-full bg-carbon-800 text-carbon-300 ring-1 ring-white/10 transition hover:bg-amber-500 hover:text-carbon-950 hover:ring-amber-500 hover:scale-110">
                      <Icon size={15} />
                    </a>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="section-sm bg-carbon-950">
        <div className="container-page">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="card-forest p-8">
              <span className="eyebrow-forest">Mission</span>
              <p className="mt-4 text-lg leading-relaxed text-white">To help businesses achieve exceptional online growth and professional branding through premium design, strategic thinking, and measurable execution.</p>
            </div>
            <div className="card-dark p-8 ring-1 ring-amber-500/20">
              <span className="eyebrow">Vision</span>
              <p className="mt-4 text-lg leading-relaxed text-white">To become a globally recognized digital branding powerhouse where every brand we touch experiences real, measurable, and lasting growth.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="section-sm bg-carbon-900">
        <div className="container-page">
          <div className="mb-8 text-center">
            <span className="eyebrow">What We Stand For</span>
            <h2 className="mt-3 font-serif text-3xl font-semibold text-white">Core Values</h2>
          </div>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
            {['Excellence', 'Innovation', 'Integrity', 'Creativity', 'Transparency', 'Results'].map((v) => (
              <div key={v} className="card-dark p-5 text-center">
                <p className="font-serif text-lg font-semibold text-amber-500">{v}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="section bg-carbon-950">
        <div className="container-page">
          <div className="mb-12 text-center">
            <span className="eyebrow">Our Journey</span>
            <h2 className="mt-4 section-title">Company timeline</h2>
          </div>
          <div className="relative mx-auto max-w-3xl">
            <div className="absolute left-4 top-0 bottom-0 w-px bg-gradient-to-b from-amber-500/40 via-forest-700/40 to-transparent md:left-1/2" />
            {MILESTONES.map((m, i) => (
              <div key={i} className={`relative mb-8 flex gap-6 md:gap-0 ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                <div className="hidden md:block md:w-1/2" />
                <div className="absolute left-4 top-2 h-3 w-3 rounded-full bg-amber-500 ring-4 ring-carbon-950 md:left-1/2 md:-translate-x-1/2" />
                <div className="ml-10 md:ml-0 md:w-1/2 md:px-8">
                  <div className="card-dark p-5">
                    <p className="font-serif text-2xl font-semibold text-amber-500">{m.year}</p>
                    <h3 className="mt-1 font-semibold text-white">{m.title}</h3>
                    <p className="mt-2 text-sm text-carbon-400 leading-relaxed">{m.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Staff Section */}
      <section className="section bg-carbon-900">
        <div className="container-page">
          <div className="mb-12 text-center">
            <span className="eyebrow">Our People</span>
            <h2 className="mt-4 section-title">Meet the team</h2>
            <p className="mt-4 text-carbon-400">The people behind every project we deliver.</p>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {TEAM.map((member) => (
              <div key={member.name} className="group card-dark overflow-hidden transition-all hover:-translate-y-1 hover:shadow-lift">
                <div className={`relative overflow-hidden ${member.isFounder ? 'h-72' : 'h-56'}`}>
                  <img src={member.img} alt={member.name} className={`h-full w-full transition-transform duration-500 group-hover:scale-105 ${member.isFounder ? 'object-contain bg-carbon-900' : 'object-cover'}`} />
                  <div className="absolute inset-0 bg-gradient-to-t from-carbon-950 to-transparent" />
                  {member.isFounder && <span className="absolute left-3 top-3 chip bg-amber-600 text-white text-[10px]">Founder</span>}
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
                        <button onClick={() => navigate('/contact')} className="chip bg-amber-500/15 text-amber-400 hover:bg-amber-500/25 transition text-[10px] flex items-center gap-1">Connect via Request <ArrowRight size={10} /></button>
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
