import { useEffect, useRef, useState } from 'react';
import { ArrowRight, Star, Check, ChevronLeft, ChevronRight, Play } from 'lucide-react';
import { useHashRoute } from '../lib/router';
import { STATS, SERVICES, GIGS, TESTIMONIALS, FAQS, PROJECTS, PRICING, SLIDES, AGENCY_EMAIL, FOUNDED_YEAR, VIDEO_SCRIPT } from '../lib/data';

function Counter({ target, suffix, prefix }: { target: number; suffix: string; prefix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      let start = 0;
      const duration = 2000;
      const step = Math.ceil(target / (duration / 16));
      const timer = setInterval(() => {
        start += step;
        if (start >= target) { setCount(target); clearInterval(timer); }
        else setCount(start);
      }, 16);
      observer.disconnect();
    }, { threshold: 0.5 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target]);

  return <div ref={ref} className="font-serif text-5xl font-semibold text-white lg:text-6xl">{prefix}{count}{suffix}</div>;
}

export default function HomePage() {
  const { navigate } = useHashRoute();
  const [slide, setSlide] = useState(0);
  const [testimonialIdx, setTestimonialIdx] = useState(0);
  const [activeVideo, setActiveVideo] = useState(0);
  const [faqOpen, setFaqOpen] = useState<number | null>(null);
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  useEffect(() => {
    const t = setInterval(() => setSlide((s) => (s + 1) % SLIDES.length), 3000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const t = setInterval(() => setTestimonialIdx((i) => (i + 1) % TESTIMONIALS.length), 5000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const t = setInterval(() => setActiveVideo((v) => (v + 1) % 4), 2500);
    return () => clearInterval(t);
  }, []);

  const featuredProjects = PROJECTS.slice(0, 2);
  const featuredGigs = GIGS.slice(0, 4);

  return (
    <div className="overflow-x-hidden">
      {/* ── HERO SLIDESHOW ── */}
      <section className="relative h-screen min-h-[700px] overflow-hidden">
        {SLIDES.map((s, i) => (
          <div key={i} className={`absolute inset-0 transition-all duration-1000 ${i === slide ? 'opacity-100 scale-100' : 'opacity-0 scale-105'}`}>
            <img src={s.img} alt="" className="h-full w-full object-cover object-center" />
            <div className="absolute inset-0 bg-gradient-to-b from-carbon-950/60 via-carbon-950/40 to-carbon-950/90" />
          </div>
        ))}
        <div className="absolute inset-0 grid-bg opacity-30" />
        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 text-center">
          <div className="container-page">
            <div className="animate-fade-up">
              <span className="eyebrow">Premium Ecommerce Growth Agency</span>
              <h1 className="mt-5 font-serif text-5xl font-semibold leading-[1.08] text-white sm:text-6xl lg:text-7xl xl:text-8xl">
                Building Powerful Brands<br />
                <span className="amber-text">That Deliver Real Results</span>
              </h1>
              <p className="mx-auto mt-6 max-w-2xl text-lg text-white/80 leading-relaxed font-medium">
                {SLIDES[slide].title} <span className="text-accent-400">—</span> {SLIDES[slide].sub}
              </p>
              <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
                <button onClick={() => navigate('/contact')} className="btn-amber">Book Free Strategy Call <ArrowRight size={16} /></button>
                <button onClick={() => navigate('/portfolio')} className="btn-ghost">View Portfolio</button>
              </div>
              <p className="mt-8 text-sm font-bold text-accent-400 tracking-[0.3em] uppercase">What Matters Is Results</p>
            </div>
          </div>
        </div>
        {/* Slide indicators */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
          {SLIDES.map((_, i) => (
            <button key={i} onClick={() => setSlide(i)} className={`h-1.5 rounded-full transition-all ${i === slide ? 'w-8 bg-amber-500' : 'w-1.5 bg-white/30'}`} />
          ))}
        </div>
        <button onClick={() => setSlide((s) => (s - 1 + SLIDES.length) % SLIDES.length)} className="absolute left-4 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur hover:bg-black/60">
          <ChevronLeft size={20} />
        </button>
        <button onClick={() => setSlide((s) => (s + 1) % SLIDES.length)} className="absolute right-4 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur hover:bg-black/60">
          <ChevronRight size={20} />
        </button>
      </section>

      {/* ── CLIENT LOGOS ── */}
      <section className="bg-carbon-900/50 py-10 border-y border-white/8">
        <div className="container-page">
          <p className="text-center text-xs font-semibold uppercase tracking-[0.3em] text-carbon-500 mb-6">Brands we have worked with</p>
          <div className="flex flex-wrap items-center justify-center gap-8">
            {['All4thegiftofit', 'Lixirmart', 'Lumara', 'Esoteric Mafia'].map((b) => (
              <span key={b} className="font-serif text-lg font-medium text-carbon-400 hover:text-white transition tracking-wide">{b}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <section className="section bg-carbon-950">
        <div className="container-page">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {STATS.map((s) => (
              <div key={s.label} className="text-center">
                <Counter target={s.value} suffix={s.suffix} prefix={(s as any).prefix} />
                <p className="mt-2 text-sm text-carbon-400 uppercase tracking-widest">{s.label}</p>
                <div className="mx-auto mt-3 amber-line" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── INTRO ── */}
      <section className="section bg-forest-950 relative overflow-hidden">
        <div className="absolute inset-0 noise opacity-5" />
        <div className="absolute -right-32 top-1/2 -translate-y-1/2 h-96 w-96 rounded-full bg-forest-700/15 blur-3xl" />
        <div className="container-page relative grid gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <span className="eyebrow-forest">Who We Are</span>
            <h2 className="mt-4 font-serif text-4xl font-semibold text-white sm:text-5xl">
              A team obsessed<br />with <em className="forest-text not-italic">your growth</em>
            </h2>
            <p className="mt-5 text-carbon-300 leading-relaxed">
              Founded in {FOUNDED_YEAR} by Jacob David, SHOPIJAVID is a premium ecommerce growth and brand strategy agency. We help businesses achieve exceptional online growth through branding, Shopify development, digital marketing, and performance-focused strategy.
            </p>
            <p className="mt-4 text-carbon-300 leading-relaxed">
              Every project we take on is driven by one principle: what matters is results. We do not chase aesthetics alone. We build systems that generate revenue, retain customers, and compound in value over time.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <button onClick={() => navigate('/portfolio')} className="btn-forest">View Our Work</button>
              <button onClick={() => navigate('/portfolio')} className="btn-ghost">About Us</button>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {['https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=600',
              'https://images.pexels.com/photos/3182812/pexels-photo-3182812.jpeg?auto=compress&cs=tinysrgb&w=600',
              'https://images.pexels.com/photos/590022/pexels-photo-590022.jpeg?auto=compress&cs=tinysrgb&w=600',
              'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=600'].map((src, i) => (
              <div key={i} className={`overflow-hidden rounded-2xl ${i === 1 ? 'mt-6' : ''}`}>
                <img src={src} alt="" className="h-44 w-full object-cover hover:scale-105 transition-transform duration-500" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SERVICES PREVIEW ── */}
      <section className="section bg-carbon-950">
        <div className="container-page">
          <div className="mb-12 text-center">
            <span className="eyebrow">What We Do</span>
            <h2 className="mt-4 section-title">Services that move the needle</h2>
            <p className="mt-4 mx-auto max-w-xl text-carbon-400">From brand strategy to Shopify development to digital marketing, every service is designed to deliver measurable growth.</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {SERVICES.slice(0, 6).map((s) => (
              <button key={s.id} onClick={() => navigate(`/services#${s.id}`)} className="group card-dark p-6 text-left transition-all hover:-translate-y-1 hover:ring-forest-700/50 hover:shadow-forest">
                <span className="text-3xl text-forest-400 group-hover:text-amber-500 transition-colors">{s.icon}</span>
                <h3 className="mt-4 font-serif text-xl font-semibold text-white">{s.name}</h3>
                <p className="mt-2 text-sm leading-relaxed text-carbon-400">{s.desc}</p>
                <div className="mt-4 flex items-center gap-1 text-xs font-semibold text-amber-500 opacity-0 transition-opacity group-hover:opacity-100">
                  Read overview <ArrowRight size={13} />
                </div>
              </button>
            ))}
          </div>
          <div className="mt-8 text-center">
            <button onClick={() => navigate('/services')} className="btn-outline-amber">See All Services <ArrowRight size={16} /></button>
          </div>
        </div>
      </section>

      {/* ── PORTFOLIO PREVIEW ── */}
      <section className="section bg-carbon-900">
        <div className="container-page">
          <div className="mb-12 text-center">
            <span className="eyebrow">Selected Work</span>
            <h2 className="mt-4 section-title">Featured projects</h2>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            {featuredProjects.map((p) => (
              <button key={p.id} onClick={() => navigate(`/portfolio/${p.id}`)} className="group relative overflow-hidden rounded-2xl text-left ring-1 ring-white/10 shadow-card transition-all hover:-translate-y-1 hover:shadow-lift">
                <div className="relative h-64 overflow-hidden">
                  <img src={p.img} alt={p.name} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-carbon-950 via-carbon-950/30 to-transparent" />
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <span className="chip bg-amber-600/20 text-amber-400 text-[10px]">{p.industry}</span>
                  <h3 className="mt-2 font-serif text-2xl font-semibold text-white">{p.name}</h3>
                  <p className="mt-1 text-sm text-white/70">{p.services.slice(0, 2).join(' · ')}</p>
                  <div className="mt-3 flex gap-4 text-xs font-semibold text-forest-400">
                    <span>{p.results.revenue} Revenue</span>
                    <span>{p.results.conversion} Conversion</span>
                  </div>
                </div>
              </button>
            ))}
          </div>
          <div className="mt-8 text-center">
            <button onClick={() => navigate('/portfolio')} className="btn-outline-amber">See More Projects <ArrowRight size={16} /></button>
          </div>
        </div>
      </section>

      {/* ── VIDEO SECTION ── */}
      <section className="section bg-carbon-950 relative overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-30" />
        <div className="container-page relative">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <span className="eyebrow">Our Story</span>
              <h2 className="mt-4 font-serif text-4xl font-semibold text-white sm:text-5xl">
                Your digital presence<br />is your <span className="amber-text">real estate</span>
              </h2>
              <div className="mt-6 space-y-4 text-carbon-400 leading-relaxed">
                {VIDEO_SCRIPT.split('\n\n').map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
              </div>
              <button onClick={() => navigate('/contact')} className="btn-amber mt-7">Work With Us <ArrowRight size={16} /></button>
            </div>
            <div className="relative">
              <div className="overflow-hidden rounded-2xl ring-1 ring-white/10 shadow-lift">
                {[
                  'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=800',
                  'https://images.pexels.com/photos/3182812/pexels-photo-3182812.jpeg?auto=compress&cs=tinysrgb&w=800',
                  'https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?auto=compress&cs=tinysrgb&w=800',
                  'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=800',
                ].map((src, i) => (
                  <img key={i} src={src} alt="" className={`h-72 w-full object-cover transition-all duration-1000 ${i === activeVideo ? 'block' : 'hidden'}`} />
                ))}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-amber-600/90 text-white shadow-amber backdrop-blur animate-pulse-amber">
                    <Play size={24} className="ml-1" />
                  </div>
                </div>
              </div>
              <div className="absolute -bottom-4 -right-4 rounded-2xl bg-forest-900 p-4 ring-1 ring-forest-700/40 shadow-card">
                <p className="text-xs text-carbon-400">Revenue Generated</p>
                <p className="mt-1 font-serif text-2xl font-semibold text-white">$4.8M+</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── EVERYTHING AN AMBITIOUS BRAND NEEDS ── */}
      <section className="section bg-forest-950 relative overflow-hidden">
        <div className="absolute inset-0 noise opacity-5" />
        <div className="container-page relative">
          <div className="mb-12 text-center">
            <span className="eyebrow-forest">Complete Solutions</span>
            <h2 className="mt-4 section-title">Everything an ambitious<br />brand actually needs</h2>
            <p className="mt-4 mx-auto max-w-2xl text-carbon-400">Real businesses need more than a logo and a website. Below is every capability we bring to help you build, grow, and dominate your market.</p>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {SERVICES.map((s) => (
              <button key={s.id} onClick={() => navigate(`/services#${s.id}`)} className="group relative overflow-hidden rounded-2xl ring-1 ring-white/10 text-left transition-all hover:-translate-y-1 hover:shadow-lift">
                <div className="absolute inset-0">
                  <img
                    src={`https://images.pexels.com/photos/${[3184360,230544,267350,270408,196645,256541,3389957,590016,3184292,2796057,3184465,3182812,590022][SERVICES.indexOf(s) % 13]}/pexels-photo-${[3184360,230544,267350,270408,196645,256541,3389957,590016,3184292,2796057,3184465,3182812,590022][SERVICES.indexOf(s) % 13]}.jpeg?auto=compress&cs=tinysrgb&w=600`}
                    alt=""
                    className="h-full w-full object-cover opacity-20 transition-opacity group-hover:opacity-30"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-carbon-950/95 to-carbon-950/60" />
                </div>
                <div className="relative p-6">
                  <span className="text-3xl">{s.icon}</span>
                  <h3 className="mt-3 font-serif text-xl font-semibold text-white">{s.name}</h3>
                  <p className="mt-2 text-sm text-carbon-400 leading-relaxed">{s.overview.slice(0, 120)}...</p>
                  <div className="mt-3 text-xs font-semibold text-forest-400 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    Read overview <ArrowRight size={12} />
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURED GIGS ── */}
      <section className="section bg-carbon-950">
        <div className="container-page">
          <div className="mb-12 text-center">
            <span className="eyebrow">Our Gigs</span>
            <h2 className="mt-4 section-title">Professional gigs<br />ready to deliver</h2>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {featuredGigs.map((g) => (
              <button key={g.id} onClick={() => navigate(`/gigs/${g.id}`)} className="group card-dark overflow-hidden text-left transition-all hover:-translate-y-1 hover:shadow-lift hover:ring-amber-500/20">
                <div className="relative h-44 overflow-hidden">
                  <img src={g.img} alt={g.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-carbon-950/60 to-transparent" />
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-white group-hover:text-amber-400 transition-colors">{g.title}</h3>
                  <p className="mt-1 text-xs text-carbon-400 line-clamp-2">{g.desc}</p>
                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-xs text-carbon-500">Starts at</span>
                    <span className="font-serif text-lg font-semibold text-white">${g.price}</span>
                  </div>
                  <div className="mt-2 flex items-center gap-1 text-xs text-amber-500">
                    <Star size={12} className="fill-amber-500" /> {g.rating} ({g.reviews})
                  </div>
                </div>
              </button>
            ))}
          </div>
          <div className="mt-8 text-center">
            <button onClick={() => navigate('/gigs')} className="btn-outline-amber">See All 13 Gigs <ArrowRight size={16} /></button>
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="section bg-carbon-900 relative overflow-hidden">
        <div className="absolute -right-32 top-1/2 -translate-y-1/2 h-96 w-96 rounded-full bg-amber-500/8 blur-3xl" />
        <div className="container-page relative">
          <div className="mb-12 text-center">
            <span className="eyebrow">Client Reviews</span>
            <h2 className="mt-4 section-title">What clients say</h2>
          </div>
          <div className="relative overflow-hidden">
            <div className="flex transition-transform duration-700 ease-in-out" style={{ transform: `translateX(-${testimonialIdx * 100}%)` }}>
              {TESTIMONIALS.map((t, i) => (
                <div key={i} className="w-full shrink-0 px-4">
                  <div className="mx-auto max-w-2xl card-dark p-8 text-center">
                    <div className="flex justify-center gap-1 mb-4">
                      {Array.from({ length: t.rating }).map((_, j) => <Star key={j} size={18} className="fill-amber-500 text-amber-500" />)}
                    </div>
                    <p className="font-serif text-xl font-medium italic leading-relaxed text-white">"{t.text}"</p>
                    <div className="mt-6 flex items-center justify-center gap-3">
                      <img src={t.avatar} alt="" className="h-12 w-12 rounded-full object-cover ring-2 ring-amber-500/40" />
                      <div className="text-left">
                        <p className="font-semibold text-white">{t.name}</p>
                        <p className="text-sm text-carbon-400">{t.role}</p>
                        <span className="chip bg-forest-900/60 text-forest-400 text-[10px] mt-1">{t.category}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-6 flex items-center justify-center gap-3">
            <button onClick={() => setTestimonialIdx((i) => (i - 1 + TESTIMONIALS.length) % TESTIMONIALS.length)} className="h-10 w-10 rounded-full bg-carbon-800 text-white flex items-center justify-center hover:bg-amber-600 transition"><ChevronLeft size={18} /></button>
            <div className="flex gap-2">
              {TESTIMONIALS.map((_, i) => (
                <button key={i} onClick={() => setTestimonialIdx(i)} className={`h-1.5 rounded-full transition-all ${i === testimonialIdx ? 'w-8 bg-amber-500' : 'w-1.5 bg-carbon-600'}`} />
              ))}
            </div>
            <button onClick={() => setTestimonialIdx((i) => (i + 1) % TESTIMONIALS.length)} className="h-10 w-10 rounded-full bg-carbon-800 text-white flex items-center justify-center hover:bg-amber-600 transition"><ChevronRight size={18} /></button>
          </div>
        </div>
      </section>

      {/* ── WHY CHOOSE US ── */}
      <section className="section bg-carbon-950">
        <div className="container-page">
          <div className="mb-12 text-center">
            <span className="eyebrow">Our Advantage</span>
            <h2 className="mt-4 section-title">Why clients choose<br />SHOPIJAVID</h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { icon: '◈', title: 'Ecommerce-First Strategy', desc: 'Everything we build is designed to drive revenue. We combine branding with performance to create stores that convert.' },
              { icon: '✦', title: 'Premium Design Systems', desc: 'Our work looks world-class because we invest in every detail. Typography, spacing, color, and imagery work together as a unified system.' },
              { icon: '⌗', title: 'Conversion-Focused Execution', desc: 'We do not build for aesthetics alone. Every design decision is backed by conversion data and best practices.' },
              { icon: '◈', title: 'Founder-Led Communication', desc: 'You speak directly with the people doing the work. No account managers in the middle. Fast, clear, transparent communication.' },
              { icon: '✎', title: 'Results-Driven Philosophy', desc: 'Our motto is simple. What matters is results. We measure success by your revenue, not our portfolio aesthetics.' },
              { icon: '▶', title: '24/7 Support Access', desc: 'Your business does not run on business hours. Neither do we. Support is available when you need it through email and WhatsApp.' },
            ].map((item) => (
              <div key={item.title} className="card-dark p-6 transition hover:-translate-y-1 hover:ring-forest-700/30">
                <span className="text-3xl text-forest-400">{item.icon}</span>
                <h3 className="mt-3 font-serif text-lg font-semibold text-white">{item.title}</h3>
                <p className="mt-2 text-sm text-carbon-400 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRICING PREVIEW ── */}
      <section className="section bg-carbon-900">
        <div className="container-page">
          <div className="mb-12 text-center">
            <span className="eyebrow">Pricing</span>
            <h2 className="mt-4 section-title">Simple, honest pricing</h2>
            <p className="mt-4 text-carbon-400">Start free. Scale when you are ready. No commissions. Ever.</p>
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
                <button onClick={() => navigate(plan.name === 'Enterprise' ? '/contact' : '/contact')} className={`mt-6 w-full ${plan.highlight ? 'btn-forest' : 'btn-outline-amber'}`}>{plan.cta}</button>
              </div>
            ))}
          </div>
          <p className="mt-8 text-center text-sm text-carbon-400">
            For flexible pricing structures and personalized service consultation, <button onClick={() => navigate('/contact')} className="text-amber-500 hover:underline">contact us directly</button> for a proactive discussion.
          </p>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="section bg-carbon-950">
        <div className="container-page max-w-3xl">
          <div className="mb-12 text-center">
            <span className="eyebrow">Questions</span>
            <h2 className="mt-4 section-title">Frequently asked</h2>
          </div>
          <div className="space-y-3">
            {FAQS.map((faq, i) => (
              <div key={i} className="card-dark overflow-hidden">
                <button onClick={() => setFaqOpen(faqOpen === i ? null : i)} className="flex w-full items-center justify-between p-5 text-left">
                  <span className="font-serif text-lg font-medium text-white">{faq.q}</span>
                  <span className={`text-amber-500 text-xl font-light transition-transform ${faqOpen === i ? 'rotate-45' : ''}`}>+</span>
                </button>
                {faqOpen === i && (
                  <div className="border-t border-white/8 px-5 pb-5 pt-4 animate-fade-in">
                    <p className="text-sm leading-relaxed text-carbon-400">{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── NEWSLETTER ── */}
      <section className="section-sm bg-forest-950">
        <div className="container-page">
          <div className="mx-auto max-w-xl text-center">
            <span className="eyebrow-forest">Stay Updated</span>
            <h2 className="mt-4 font-serif text-3xl font-semibold text-white">Get growth insights weekly</h2>
            <p className="mt-3 text-carbon-400 text-sm">Join 2,000+ entrepreneurs receiving our best content on branding, ecommerce, and digital growth.</p>
            {subscribed ? (
              <p className="mt-6 text-forest-400 font-semibold">You are in. Welcome to the growth circle.</p>
            ) : (
              <form onSubmit={(e) => { e.preventDefault(); if (email) setSubscribed(true); }} className="mt-6 flex gap-2">
                <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Your email address" className="input-dark flex-1" />
                <button type="submit" className="btn-forest shrink-0">Subscribe</button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      <section className="section-sm bg-carbon-950">
        <div className="container-page">
          <div className="relative overflow-hidden rounded-3xl bg-forest-900 px-8 py-16 text-center ring-1 ring-forest-700/40">
            <div className="absolute inset-0 noise opacity-5" />
            <div className="absolute -left-16 top-1/2 h-64 w-64 -translate-y-1/2 rounded-full bg-amber-500/10 blur-3xl" />
            <div className="relative">
              <span className="eyebrow-forest">Ready to Grow?</span>
              <h2 className="mt-5 font-serif text-4xl font-semibold text-white sm:text-5xl">Your brand deserves<br />real results.</h2>
              <p className="mx-auto mt-4 max-w-lg text-carbon-300">Consultation is free. Results are guaranteed by our commitment. Let us build something remarkable together.</p>
              <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                <button onClick={() => navigate('/contact')} className="btn-amber">Book Free Strategy Call <ArrowRight size={16} /></button>
                <a href={`mailto:${AGENCY_EMAIL}`} className="btn-ghost">Email Us</a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
