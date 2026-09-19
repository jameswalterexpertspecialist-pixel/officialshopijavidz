import { useEffect, useRef, useState } from 'react';
import {
  ArrowRight, ArrowUpRight, TrendingUp, Mail, MessageCircle, Send,
  Instagram, Facebook, Twitter, Youtube, Quote, Star, Target,
  Sparkles, Store, ShoppingBag, Megaphone, Palette, Compass,
  Award, Users, Heart, ChevronRight,
} from 'lucide-react';
import { useHashRoute } from '../lib/router';
import {
  PROJECTS, TESTIMONIALS, TEAM, MILESTONES, FOUNDER_IMG, FOUNDED_YEAR,
  AGENCY_EMAIL, STATS_FULL, FOUNDER_EMAIL, FOUNDER_WHATSAPP, SOCIAL_LINKS,
  RESULT_JOURNEY,
} from '../lib/data';

const socialIcons: Record<string, React.ComponentType<{ size?: number }>> = {
  facebook: Facebook, instagram: Instagram, twitter: Twitter, tiktok: Youtube, quora: Youtube,
};

const categories = ['All', 'Ecommerce', 'Branding', 'Web Design', 'Marketing', 'Optimization'];

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

export default function PortfolioPage() {
  const { navigate } = useHashRoute();
  const [cat, setCat] = useState('All');

  const filteredProjects = cat === 'All' ? PROJECTS : PROJECTS.filter(p => {
    if (cat === 'Ecommerce') return p.services.some(s => /store|shopify|wix|woocommerce|ecommerce|amazon|etsy/i.test(s)) || p.industry === 'Ecommerce';
    if (cat === 'Branding') return p.services.some(s => /brand|identity|logo/i.test(s));
    if (cat === 'Web Design') return p.services.some(s => /design|ux|ui|website|store/i.test(s));
    if (cat === 'Marketing') return p.services.some(s => /marketing|seo|social|ad|promotion/i.test(s));
    if (cat === 'Optimization') return p.services.some(s => /optim|conversion|performance/i.test(s));
    return true;
  });

  return (
    <div className="pt-20">
      {/* Header */}
      <section className="relative bg-carbon-950 py-16 overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-30" />
        <div className="absolute left-1/2 top-0 -translate-x-1/2 h-px w-3/4 bg-gradient-to-r from-transparent via-amber-500/40 to-transparent" />
        <div className="container-page relative text-center">
          <span className="eyebrow">Our Work & Philosophy</span>
          <h1 className="mt-4 font-serif text-5xl font-semibold text-white sm:text-6xl">Portfolio & Case Studies</h1>
          <p className="mx-auto mt-4 max-w-xl text-carbon-400">Real projects with real stories. Every engagement is built around one question: did it move the business forward?</p>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          "ALL THAT MATTERS IS RESULT" — Brand Story
      ═══════════════════════════════════════════════════════════════ */}
      <section className="section bg-carbon-950 relative overflow-hidden">
        <div className="absolute -left-32 top-1/4 h-96 w-96 rounded-full bg-amber-500/8 blur-3xl" />
        <div className="absolute -right-32 bottom-1/4 h-96 w-96 rounded-full bg-forest-600/10 blur-3xl" />

        <div className="container-page relative">
          <Reveal className="mb-12 text-center">
            <span className="eyebrow">Our Philosophy</span>
            <h2 className="mt-4 font-serif text-4xl sm:text-5xl font-semibold text-white">All That Matters Is Result</h2>
            <div className="mt-4 amber-line mx-auto" />
          </Reveal>

          {/* Story text */}
          <Reveal className="max-w-3xl mx-auto">
            <div className="space-y-5 text-carbon-300 leading-relaxed text-center">
              <p className="text-lg">
                Every merchant starts with a dream.
              </p>
              <p>
                A product to offer the world. A brand that represents their vision. A store to showcase what they built. A business idea that they believe in. A vision for growth.
              </p>
              <p>
                The merchant may care about design, technology, branding, marketing, and customer experience — and they should. All of these things matter.
              </p>
              <p>
                But the dream is bigger than any one of them. The dream is customers discovering the product. Customers interacting with the product. Customers trusting the brand. Customers purchasing. The business growing.
              </p>
              <p className="font-serif text-xl text-white">
                That is why Official Shopijavid made <span className="text-amber-500">"All That Matters Is Result"</span> a central philosophy.
              </p>
              <p>
                We evaluate a merchant's store and business from the perspective of the merchant's ultimate objective. Design matters. Technology matters. Branding matters. Marketing matters. Customer experience matters.
              </p>
              <p className="font-serif text-lg text-white">
                But the work must ultimately contribute toward the desired business outcome.
              </p>
              <p className="text-sm text-carbon-500 italic">
                We do not promise guaranteed results. We commit to pursuing meaningful and measurable outcomes — not empty promises.
              </p>
            </div>
          </Reveal>

          {/* Animated journey */}
          <Reveal className="mt-14" delay={200}>
            <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
              {RESULT_JOURNEY.map((step, i) => (
                <div key={step.label} className="flex items-center gap-2 sm:gap-3">
                  <div className="group flex flex-col items-center">
                    <div className="flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-2xl bg-carbon-900 ring-1 ring-white/10 text-white font-serif text-[11px] sm:text-xs font-semibold transition-all hover:bg-amber-500 hover:text-white hover:ring-amber-500 hover:scale-110">
                      {step.label}
                    </div>
                  </div>
                  {i < RESULT_JOURNEY.length - 1 && <ArrowRight size={14} className="text-carbon-600 shrink-0" />}
                </div>
              ))}
            </div>
          </Reveal>

          <Reveal className="mt-10 text-center" delay={300}>
            <p className="font-serif text-xl text-carbon-300 italic max-w-2xl mx-auto">
              "Because when everything is said and done, the result is what matters."
            </p>
          </Reveal>
        </div>
      </section>

      {/* Results summary */}
      <section className="bg-carbon-900 py-10 border-y border-white/5">
        <div className="container-page">
          <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
            {[
              { label: 'Projects Delivered', value: STATS_FULL.projects },
              { label: 'Avg Conversion Lift', value: '2.3x' },
              { label: 'Client Satisfaction', value: '91%' },
              { label: 'Years in Business', value: `${new Date().getFullYear() - FOUNDED_YEAR}+` },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <p className="font-serif text-3xl sm:text-4xl font-semibold text-amber-500">{s.value}</p>
                <p className="mt-1 text-[10px] sm:text-xs text-carbon-400 uppercase tracking-widest">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Projects grid */}
      <section className="section bg-carbon-950">
        <div className="container-page">
          <Reveal className="mb-8 text-center">
            <span className="eyebrow">Case Studies</span>
            <h2 className="mt-4 section-title">Selected Work</h2>
            <p className="mx-auto mt-4 max-w-lg text-carbon-400">Each project tells a story of challenge, strategy, and outcome. Where verified metrics exist, they are shown. Where they do not, we describe the qualitative improvements honestly.</p>
          </Reveal>

          <div className="mb-8 flex flex-wrap gap-2 justify-center">
            {categories.map(c => (
              <button
                key={c}
                onClick={() => setCat(c)}
                className={`chip transition ${cat === c ? 'bg-amber-500 text-white shadow-amber' : 'bg-carbon-900 text-carbon-400 ring-1 ring-white/10 hover:text-white'}`}
              >
                {c}
              </button>
            ))}
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {filteredProjects.map((p, i) => (
              <Reveal key={p.id} delay={i * 80}>
                <button onClick={() => navigate(`/portfolio/${p.id}`)} className="group relative w-full overflow-hidden rounded-2xl text-left ring-1 ring-white/10 shadow-card transition-all hover:-translate-y-1 hover:shadow-lift">
                  <div className="relative h-72 overflow-hidden">
                    <img src={p.img} alt={p.name} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                    <div className="absolute inset-0 bg-gradient-to-t from-carbon-950 via-carbon-950/40 to-transparent" />
                    <div className="absolute left-4 top-4 flex gap-1.5">
                      <span className="chip bg-amber-600/20 text-amber-400 text-[10px] ring-1 ring-amber-500/20">{p.industry}</span>
                      <span className="chip bg-carbon-900/60 text-carbon-300 text-[10px]">{p.platform}</span>
                    </div>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <h3 className="font-serif text-2xl font-semibold text-white">{p.name}</h3>
                    <p className="mt-1 text-sm text-white/70">{p.services.slice(0, 3).join(' · ')}</p>
                    <div className="mt-3 flex flex-wrap gap-3 text-xs font-semibold">
                      <span className="flex items-center gap-1 text-forest-400"><TrendingUp size={12} /> {p.results.revenue}</span>
                      <span className="text-amber-500">{p.results.conversion}</span>
                    </div>
                    <div className="mt-4 flex items-center gap-2 text-sm font-semibold text-amber-500 opacity-0 transition-opacity group-hover:opacity-100">
                      View Case Study <ArrowUpRight size={15} />
                    </div>
                  </div>
                </button>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Case study format explanation */}
      <section className="section-sm bg-carbon-900">
        <div className="container-page">
          <Reveal className="text-center">
            <span className="eyebrow">Our Case Study Format</span>
            <h2 className="mt-4 font-serif text-2xl font-semibold text-white">Every Project Tells a Story</h2>
            <p className="mx-auto mt-4 max-w-2xl text-sm text-carbon-400">We document each engagement across six dimensions: the challenge, the opportunity, what was done, the platform, the strategy, and the outcome. Where metrics are verified, we show them. Where they are not, we describe qualitative improvements honestly.</p>
          </Reveal>

          <Reveal className="mt-10" delay={100}>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 max-w-4xl mx-auto">
              {[
                { icon: Target, label: 'Challenge', desc: 'What problem was the business facing?' },
                { icon: Compass, label: 'Opportunity', desc: 'What potential did we identify?' },
                { icon: Store, label: 'Platform', desc: 'Which platform or channel was involved?' },
                { icon: Megaphone, label: 'Strategy', desc: 'What approach did we take?' },
                { icon: Palette, label: 'Execution', desc: 'What was actually built and delivered?' },
                { icon: Award, label: 'Outcome', desc: 'What changed for the business?' },
              ].map((c, i) => (
                <Reveal key={c.label} delay={i * 60}>
                  <div className="card-dark p-5 text-center">
                    <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/15 text-amber-500 mb-3">
                      <c.icon size={18} />
                    </div>
                    <p className="font-serif text-base font-semibold text-white">{c.label}</p>
                    <p className="mt-1 text-xs text-carbon-400">{c.desc}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* Testimonials */}
      <section className="section bg-carbon-900">
        <div className="container-page">
          <Reveal className="mb-10 text-center">
            <span className="eyebrow">What People Say</span>
            <h2 className="mt-4 section-title">Client Testimonials</h2>
          </Reveal>

          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {TESTIMONIALS.map((t, i) => (
              <Reveal key={i} delay={i * 80}>
                <div className="card-dark p-6 h-full">
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
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* About / Founder */}
      <section className="section bg-carbon-950 relative overflow-hidden">
        <div className="absolute inset-0 noise opacity-5" />
        <div className="container-page relative">
          <Reveal>
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
                <div className="mt-6 space-y-4 text-carbon-400 leading-relaxed text-sm">
                  <p>Jacob David developed a deep passion for technology, creativity, and digital innovation during his school years. He was fascinated by how digital systems could transform businesses, create opportunities, and connect people globally.</p>
                  <p>While others saw technology as entertainment, he saw it as the future of business and independence. His curiosity pushed him to study branding, online business structures, digital systems, ecommerce, automation, and creative marketing.</p>
                  <p>Over time, his passion evolved into a mission. He wanted to build a professional agency where ambition meets execution and where brands can experience real, measurable growth.</p>
                  <p>This vision led to the creation of Official Shopijavid in {FOUNDED_YEAR}. The company was built on one principle: <span className="text-amber-500 font-semibold">"All That Matters Is Result."</span></p>
                </div>
                <div className="mt-7 flex gap-3">
                  <a href={`mailto:${FOUNDER_EMAIL}`} className="btn-outline-amber btn-sm"><Mail size={14} /> Contact Jacob</a>
                  <a href={FOUNDER_WHATSAPP} target="_blank" rel="noopener noreferrer" className="btn-ghost btn-sm"><MessageCircle size={14} /> WhatsApp</a>
                </div>
                <div className="mt-5 flex flex-wrap gap-2">
                  {SOCIAL_LINKS.map(s => {
                    const I = socialIcons[s.icon] || Youtube;
                    return <a key={s.name} href={s.url} target="_blank" rel="noopener noreferrer" title={s.name} className="flex h-9 w-9 items-center justify-center rounded-full bg-carbon-800 text-carbon-300 ring-1 ring-white/10 transition hover:bg-amber-500 hover:text-carbon-950 hover:ring-amber-500 hover:scale-110"><I size={15} /></a>;
                  })}
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="section-sm bg-carbon-900">
        <div className="container-page">
          <div className="grid gap-6 md:grid-cols-2">
            <Reveal>
              <div className="card-forest p-8">
                <span className="eyebrow-forest">Mission</span>
                <p className="mt-4 text-lg leading-relaxed text-white">To help businesses achieve exceptional online growth and professional branding through premium design, strategic thinking, and measurable execution.</p>
              </div>
            </Reveal>
            <Reveal delay={100}>
              <div className="card-dark p-8 ring-1 ring-amber-500/20">
                <span className="eyebrow">Vision</span>
                <p className="mt-4 text-lg leading-relaxed text-white">To become a globally recognized digital branding powerhouse where every brand we touch experiences real, measurable, and lasting growth.</p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="section-sm bg-carbon-950">
        <div className="container-page">
          <Reveal className="mb-8 text-center">
            <span className="eyebrow">What We Stand For</span>
            <h2 className="mt-3 font-serif text-3xl font-semibold text-white">Core Values</h2>
          </Reveal>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
            {['Excellence', 'Innovation', 'Integrity', 'Creativity', 'Transparency', 'Results'].map((v, i) => (
              <Reveal key={v} delay={i * 50}>
                <div className="card-dark p-5 text-center transition hover:-translate-y-1 hover:shadow-lift">
                  <p className="font-serif text-lg font-semibold text-amber-500">{v}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="section bg-carbon-900">
        <div className="container-page">
          <Reveal className="mb-12 text-center">
            <span className="eyebrow">Our Journey</span>
            <h2 className="mt-4 section-title">Company Timeline</h2>
          </Reveal>
          <div className="relative mx-auto max-w-3xl">
            <div className="absolute left-4 top-0 bottom-0 w-px bg-gradient-to-b from-amber-500/40 via-forest-700/40 to-transparent md:left-1/2" />
            {MILESTONES.map((m, i) => (
              <Reveal key={i} delay={i * 50}>
                <div className={`relative mb-8 flex gap-6 md:gap-0 ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
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
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="section bg-carbon-950">
        <div className="container-page">
          <Reveal className="mb-12 text-center">
            <span className="eyebrow">Our People</span>
            <h2 className="mt-4 section-title">Meet the Team</h2>
            <p className="mt-4 text-carbon-400">The people behind every project we deliver.</p>
          </Reveal>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {TEAM.map((member, i) => (
              <Reveal key={member.name} delay={i * 80}>
                <div className="group card-dark overflow-hidden transition-all hover:-translate-y-1 hover:shadow-lift">
                  <div className={`relative overflow-hidden ${member.isFounder ? 'h-72' : 'h-56'}`}>
                    <img src={member.img} alt={member.name} className={`h-full w-full transition-transform duration-500 group-hover:scale-105 ${member.isFounder ? 'object-contain bg-carbon-900' : 'object-cover'}`} />
                    <div className="absolute inset-0 bg-gradient-to-t from-carbon-950 to-transparent" />
                    {member.isFounder && <span className="absolute left-3 top-3 chip bg-amber-600 text-white text-[10px]">Founder</span>}
                  </div>
                  <div className="p-5">
                    <h3 className="font-serif text-lg font-semibold text-white">{member.name}</h3>
                    <p className="text-sm text-amber-500">{member.role}</p>
                    <p className="text-[11px] text-forest-400 mt-0.5">{member.agency}</p>
                    <p className="mt-2 text-xs text-carbon-400 leading-relaxed line-clamp-3">{member.desc}</p>
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
                          <button onClick={() => navigate('/contact')} className="chip bg-amber-500/15 text-amber-400 hover:bg-amber-500/25 transition text-[10px] flex items-center gap-1">Connect <ArrowRight size={10} /></button>
                          <a href={member.telegram} target="_blank" rel="noopener noreferrer" className="flex h-8 w-8 items-center justify-center rounded-full bg-carbon-800 text-carbon-400 ring-1 ring-white/10 transition hover:bg-blue-600 hover:text-white" title="Telegram"><Send size={14} /></a>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="section-sm bg-carbon-900">
        <div className="container-page">
          <div className="rounded-3xl bg-gradient-to-br from-forest-900 to-carbon-900 p-10 text-center ring-1 ring-forest-700/40 relative overflow-hidden">
            <div className="absolute -left-16 top-1/2 h-48 w-48 -translate-y-1/2 rounded-full bg-amber-500/10 blur-3xl" />
            <div className="relative">
              <h2 className="font-serif text-3xl font-semibold text-white">Want results like these?</h2>
              <p className="mt-3 text-carbon-300">Your free consultation is one message away. Tell us about your business and where you want to go.</p>
              <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                <button onClick={() => navigate('/contact')} className="btn-amber">Start a Project <ArrowRight size={16} /></button>
                <a href={`mailto:${AGENCY_EMAIL}`} className="btn-ghost"><Mail size={16} /> Email Us</a>
                <a href={FOUNDER_WHATSAPP} target="_blank" rel="noopener noreferrer" className="btn-forest"><MessageCircle size={16} /> WhatsApp</a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
