import { useEffect, useRef, useState } from 'react';
import {
  ArrowRight, ArrowUpRight, TrendingUp, ShoppingBag, Globe, Package, Tag, Box, Store,
  Megaphone, Sparkles, Search, Compass, Briefcase, Palette, Target, Heart,
  Check, Users, DollarSign, ShoppingCart, BarChart3, ChevronRight, Award,
  ClipboardCheck, Hammer, Smartphone, CreditCard, FileText, Mail,
  Video, Scissors, Image, PenTool, Layout, Calculator, Folder, Lightbulb,
  MessageSquare, Network, Film, RefreshCw, Settings, RotateCcw, UserPlus,
  Calendar, Share2, Star, ChevronLeft, Play, Pause,
} from 'lucide-react';
import { useHashRoute } from '../lib/router';
import {
  SERVICE_CATEGORIES, TRUST_CARDS,
  MARQUEE_PLATFORMS, AGENCY_EMAIL, FOUNDED_YEAR,
  SLIDES, PRICING,
} from '../lib/data';
import InteractiveGlobe from '../components/InteractiveGlobe';
import EcosystemDiagram from '../components/EcosystemDiagram';

// ─── Icon resolver ───────────────────────────────────────────────────
const iconMap: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  ShoppingBag, ShoppingCart, Globe, Package, Tag, Box, Store, Megaphone,
  Sparkles, Search, Compass, Briefcase, Palette, Target, Heart, TrendingUp,
  ClipboardCheck, Hammer, Smartphone, CreditCard, FileText, Mail, Video,
  Scissors, Image, PenTool, Layout, Calculator, Folder, Lightbulb,
  MessageSquare, Network, Film, RefreshCw, Settings, RotateCcw, UserPlus,
  Calendar, Share2, Star, Award, Users, DollarSign, BarChart3, ArrowRight,
};

function Icon({ name, size, className }: { name: string; size?: number; className?: string }) {
  const C = iconMap[name] || Sparkles;
  return <C size={size} className={className} />;
}

// ─── Reveal-on-scroll wrapper ────────────────────────────────────────
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
    <div
      ref={ref}
      className={`${className} transition-all duration-700 ease-out ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

// ─── Slideshow ───────────────────────────────────────────────────────
function Slideshow() {
  const { navigate } = useHashRoute();
  const [current, setCurrent] = useState(0);
  const [playing, setPlaying] = useState(true);
  const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;

  useEffect(() => {
    if (!playing || reduced) return;
    const t = setInterval(() => setCurrent(c => (c + 1) % SLIDES.length), 5000);
    return () => clearInterval(t);
  }, [playing, reduced]);

  const go = (dir: number) => setCurrent(c => (c + dir + SLIDES.length) % SLIDES.length);
  const slide = SLIDES[current];

  return (
    <div className="relative h-[60vh] min-h-[420px] sm:h-[70vh] overflow-hidden">
      {SLIDES.map((s, i) => (
        <div
          key={i}
          className={`absolute inset-0 transition-opacity duration-1000 ${i === current ? 'opacity-100' : 'opacity-0'}`}
        >
          <img src={s.img} alt={s.title} className={`h-full w-full object-cover ${i === current ? 'scale-105' : 'scale-100'} transition-transform duration-[6000ms]`} loading={i === 0 ? 'eager' : 'lazy'} />
          <div className="absolute inset-0 bg-gradient-to-t from-carbon-950 via-carbon-950/60 to-carbon-950/30" />
        </div>
      ))}

      {/* Content */}
      <div className="absolute inset-0 flex items-end pb-16 sm:pb-20">
        <div className="container-page">
          <div className="max-w-2xl">
            <div className={`transition-all duration-700 ${current === 0 ? '' : ''}`}>
              <span className="eyebrow animate-fade-in">{current + 1} / {SLIDES.length}</span>
              <h2 className="mt-3 font-serif text-3xl sm:text-5xl font-semibold text-white leading-tight">{slide.title}</h2>
              <p className="mt-3 text-sm sm:text-lg text-carbon-300 max-w-lg">{slide.sub}</p>
              <button onClick={() => navigate(slide.to)} className="btn-amber mt-5">
                {slide.cta} <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="absolute bottom-6 right-4 sm:right-8 flex items-center gap-2">
        <button onClick={() => go(-1)} className="flex h-9 w-9 items-center justify-center rounded-full bg-carbon-950/60 text-white ring-1 ring-white/20 hover:bg-carbon-950/90 transition" aria-label="Previous slide">
          <ChevronLeft size={18} />
        </button>
        <button onClick={() => setPlaying(p => !p)} className="flex h-9 w-9 items-center justify-center rounded-full bg-carbon-950/60 text-white ring-1 ring-white/20 hover:bg-carbon-950/90 transition" aria-label={playing ? 'Pause' : 'Play'}>
          {playing ? <Pause size={16} /> : <Play size={16} />}
        </button>
        <button onClick={() => go(1)} className="flex h-9 w-9 items-center justify-center rounded-full bg-carbon-950/60 text-white ring-1 ring-white/20 hover:bg-carbon-950/90 transition" aria-label="Next slide">
          <ChevronRight size={18} />
        </button>
      </div>

      {/* Dots */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-1.5">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`h-1.5 rounded-full transition-all ${i === current ? 'w-8 bg-amber-500' : 'w-1.5 bg-white/30 hover:bg-white/50'}`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

const FEATURED_TEMPLATES = [
  { name: 'Atelier No. 7', platform: 'Shopify', type: 'Premium commerce', accent: '#63e6be', background: 'linear-gradient(135deg, #132c2a, #071b20)', description: 'Editorial product storytelling for a considered lifestyle brand.', className: 'template-shopify' },
  { name: 'Casa Forma', platform: 'Wix', type: 'Creative studio', accent: '#ff8a65', background: 'linear-gradient(135deg, #351d2e, #101b35)', description: 'Expressive layouts and bold visual direction built around the brand.', className: 'template-wix' },
  { name: 'Northline Supply', platform: 'WooCommerce', type: 'Conversion system', accent: '#4aa8ff', background: 'linear-gradient(135deg, #13243e, #091321)', description: 'Structured merchandising and clear buying paths for a growing catalog.', className: 'template-woocommerce' },
  { name: 'Signal Objects', platform: 'Custom build', type: 'Digital storefront', accent: '#d7b86d', background: 'linear-gradient(135deg, #29231d, #101316)', description: 'A focused launch experience that turns product discovery into action.', className: 'template-custom' },
] as const;

function PlatformTemplate({ template, index }: { template: typeof FEATURED_TEMPLATES[number]; index: number }) {
  return (
    <div className={`template-card ${template.className} group`} style={{ '--template-accent': template.accent } as React.CSSProperties}>
      <div className="template-browser">
        <span /><span /><span />
        <p>{template.platform.toLowerCase()}.shopijavid.com</p>
      </div>
      <div className="template-content" style={{ background: template.background }}>
        <div className="template-nav">
          <strong>{template.name}</strong>
          <span>{index === 1 ? 'Studio / Journal / Shop' : index === 2 ? 'Shop  ·  About  ·  Journal' : 'New collection  /  Cart'}</span>
        </div>
        {index === 0 && (
          <div className="template-editorial"><span>Objects for<br />slower living.</span><div className="template-orbit" /></div>
        )}
        {index === 1 && (
          <div className="template-collage"><div className="collage-tile collage-tile-main">MADE<br /><b>VISIBLE</b></div><div className="collage-tile collage-tile-side">BRAND<br />STUDIO</div></div>
        )}
        {index === 2 && (
          <div className="template-catalog"><div className="catalog-hero"><span>Built for<br /><b>everyday.</b></span></div><div className="catalog-row"><span>01 / 04</span><b>Essentials collection</b><span>$128</span></div></div>
        )}
        {index === 3 && (
          <div className="template-launch"><span>THE NEW STANDARD</span><strong>Make room<br />for better.</strong><button>Explore drop</button></div>
        )}
        <div className="template-footer"><span>{template.type}</span><i style={{ backgroundColor: template.accent }} /></div>
      </div>
      <div className="template-caption"><span>{String(index + 1).padStart(2, '0')}</span><div><h3>{template.platform}</h3><p>{template.description}</p></div><ArrowUpRight size={18} /></div>
    </div>
  );
}

// ─── Main component ──────────────────────────────────────────────────
export default function HomePage() {
  const { navigate } = useHashRoute();
  const [serviceFilter, setServiceFilter] = useState('All');
  const [faqOpen, setFaqOpen] = useState<number | null>(null);
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [marqueeOffset, setMarqueeOffset] = useState(0);
  const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;

  useEffect(() => {
    if (reduced) return;
    const t = setInterval(() => setMarqueeOffset(o => o - 1), 30);
    return () => clearInterval(t);
  }, [reduced]);

  const filterOptions = ['All', ...SERVICE_CATEGORIES.map(c => c.name.split(' ')[0])];
  const filteredCategories = serviceFilter === 'All'
    ? SERVICE_CATEGORIES
    : SERVICE_CATEGORIES.filter(c => c.name.startsWith(serviceFilter));

  return (
    <div className="overflow-x-hidden">
      {/* ═══ HERO SECTION ═══ */}
      <section className="relative min-h-screen flex items-center pt-20 overflow-hidden bg-carbon-950">
        <div className="absolute inset-0 grid-bg opacity-20" />
        <div className="absolute left-1/2 top-0 -translate-x-1/2 h-px w-3/4 bg-gradient-to-r from-transparent via-amber-500/30 to-transparent" />
        <div className="absolute -left-32 top-1/4 h-96 w-96 rounded-full bg-forest-600/10 blur-3xl" />
        <div className="absolute -right-32 bottom-1/4 h-96 w-96 rounded-full bg-amber-500/8 blur-3xl" />

        <div className="container-page relative py-12 lg:py-0">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div className="text-center lg:text-left">
              <span className="eyebrow animate-fade-in">Premium Digital Commerce Agency</span>
              <h1 className="mt-5 font-serif text-4xl font-semibold leading-[1.1] text-white sm:text-5xl lg:text-6xl">
                Building Better<br />
                <span className="amber-text">Digital Commerce</span><br />
                Experiences
              </h1>
              <p className="mx-auto lg:mx-0 mt-6 max-w-xl text-base sm:text-lg text-carbon-300 leading-relaxed">
                From ecommerce stores and digital branding to marketing, optimization and business solutions — Official Shopijavid helps businesses turn their ideas into stronger digital experiences and measurable growth.
              </p>
              <div className="mt-8 flex flex-wrap items-center justify-center lg:justify-start gap-3">
                <button onClick={() => navigate('/contact')} className="btn-amber">Start a Project <ArrowRight size={16} /></button>
                <button onClick={() => navigate('/services')} className="btn-ghost">Explore Our Services</button>
              </div>
              <p className="mt-6 text-xs font-semibold tracking-[0.3em] uppercase text-carbon-400">
                One ecosystem. Multiple solutions. <span className="text-amber-500">One objective — results.</span>
              </p>
            </div>
            <div className="relative flex items-center justify-center">
              <EcosystemDiagram size={420} />
            </div>
          </div>
        </div>
      </section>

      {/* ═══ SLIDESHOW ═══ */}
      <section className="relative bg-carbon-950">
        <Slideshow />
      </section>

      {/* ═══ BRAND FILM ═══ */}
      <section className="section film-section">
        <div className="container-page">
          <Reveal className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <span className="eyebrow">Built for the next move</span>
              <h2 className="mt-4 section-title">The digital space<br />behind your ambition.</h2>
            </div>
            <p className="max-w-sm text-sm leading-relaxed text-carbon-300">A stronger presence gives your business room to be discovered, trusted, and remembered.</p>
          </Reveal>
          <Reveal>
            <div className="film-frame">
              <video className="h-full w-full object-cover" autoPlay muted loop playsInline poster="/images/image copy 2.png">
                <source src="/videos/shopijavid.mp4" type="video/mp4" />
              </video>
              <div className="film-overlay" />
              <div className="film-label"><span className="live-dot" /> Official Shopijavid / Brand film</div>
              <div className="film-statement">Build something<br /><em>worth finding.</em></div>
              <div className="film-meta"><span>01</span><span>Strategy / Design / Growth</span></div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ═══ ECOMMERCE SHOWCASE ═══ */}
      <section className="section showcase-section">
        <div className="container-page">
          <Reveal className="mb-12 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl"><span className="eyebrow">Ecommerce & Store Development</span><h2 className="mt-4 section-title">Four directions.<br /><span className="electric-text">One sharper standard.</span></h2></div>
            <p className="max-w-sm text-sm leading-relaxed text-carbon-300">Shopify, Wix, WooCommerce, and custom commerce — different tools, different personalities, equally intentional.</p>
          </Reveal>
          <div className="grid gap-5 lg:grid-cols-2">
            {FEATURED_TEMPLATES.map((template, index) => <Reveal key={template.name} delay={index * 90}><PlatformTemplate template={template} index={index} /></Reveal>)}
          </div>
          <Reveal className="mt-10 text-center"><button onClick={() => navigate('/portfolio')} className="btn-primary">See More Projects <ArrowRight size={16} /></button><p className="mt-3 text-xs text-carbon-500">Explore the full portfolio, marketing work, and growth systems</p></Reveal>
        </div>
      </section>

      {/* ═══ SERVICES PREVIEW ═══ */}
      <section className="section bg-carbon-900">
        <div className="container-page">
          <Reveal className="mb-10 text-center">
            <span className="eyebrow">Our Services</span>
            <h2 className="mt-4 section-title">Everything Your Business Needs</h2>
            <p className="mx-auto mt-4 max-w-lg text-carbon-400">From ecommerce development to marketing, business services, creative media, and strategy — organized by category.</p>
          </Reveal>

          <Reveal className="mb-8">
            <div className="flex flex-wrap justify-center gap-2">
              {filterOptions.map(f => (
                <button key={f} onClick={() => setServiceFilter(f)} className={`chip transition ${serviceFilter === f ? 'bg-amber-500 text-white' : 'bg-carbon-900 text-carbon-400 ring-1 ring-white/10 hover:text-white'}`}>{f}</button>
              ))}
            </div>
          </Reveal>

          <div className="space-y-10">
            {filteredCategories.map((cat, ci) => (
              <Reveal key={cat.id} delay={ci * 100}>
                <div>
                  <div className="flex items-center gap-3 mb-5">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/15 text-amber-500"><Icon name={cat.icon} size={20} /></div>
                    <h3 className="font-serif text-2xl font-semibold text-white">{cat.name}</h3>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {cat.services.map((s) => (
                      <div key={s.name} className="group card-dark p-5 transition-all hover:-translate-y-1 hover:ring-amber-500/20 hover:shadow-lift">
                        <div className="flex items-start gap-3">
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-carbon-800 text-amber-500 group-hover:bg-amber-500 group-hover:text-white transition-colors"><Icon name={s.icon} size={16} /></div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-white text-sm">{s.name}</h4>
                            <p className="mt-1 text-xs text-carbon-400 leading-relaxed">{s.desc}</p>
                          </div>
                        </div>
                        <button onClick={() => navigate('/services')} className="mt-3 text-[11px] font-semibold text-amber-500 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">Learn More <ChevronRight size={11} /></button>
                      </div>
                    ))}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          <div className="mt-10 text-center">
            <button onClick={() => navigate('/services')} className="btn-amber">View All Services <ArrowRight size={16} /></button>
          </div>
        </div>
      </section>

      {/* ═══ PRICING PREVIEW ═══ */}
      <section className="section bg-carbon-950">
        <div className="container-page">
          <Reveal className="mb-10 text-center">
            <span className="eyebrow">Pricing</span>
            <h2 className="mt-4 section-title">Clear, Honest Pricing</h2>
            <p className="mx-auto mt-4 max-w-lg text-carbon-400">Full-service packages from starter to enterprise. For categorized per-service pricing, visit our full pricing page.</p>
          </Reveal>

          <div className="grid gap-5 md:grid-cols-3 max-w-5xl mx-auto">
            {PRICING.map((plan, i) => (
              <Reveal key={plan.name} delay={i * 100}>
                <div className={`relative rounded-2xl p-7 ring-1 transition hover:-translate-y-1 h-full ${plan.highlight ? 'bg-forest-950 ring-forest-700/50 shadow-forest' : 'card-dark'}`}>
                  {plan.highlight && <span className="absolute -top-3 left-1/2 -translate-x-1/2 chip bg-amber-500 text-white shadow-amber text-[10px]">Most Popular</span>}
                  <p className="text-xs font-semibold uppercase tracking-widest text-amber-500">{plan.name}</p>
                  <div className="mt-2 flex items-baseline gap-1">
                    <span className="font-serif text-4xl font-semibold text-white">{plan.price}</span>
                    <span className="text-sm text-carbon-400">{plan.period}</span>
                  </div>
                  <p className="mt-1 text-sm text-carbon-400">{plan.desc}</p>
                  <ul className="mt-5 space-y-2.5">
                    {plan.features.slice(0, 5).map(f => (
                      <li key={f} className="flex items-start gap-2 text-sm">
                        <Check size={15} className={`mt-0.5 shrink-0 ${plan.highlight ? 'text-forest-400' : 'text-amber-500'}`} />
                        <span className="text-carbon-300">{f}</span>
                      </li>
                    ))}
                  </ul>
                  <button onClick={() => navigate('/pricing')} className={`mt-6 w-full ${plan.highlight ? 'btn-forest' : 'btn-outline-amber'}`}>{plan.cta}</button>
                </div>
              </Reveal>
            ))}
          </div>

          <div className="mt-8 text-center">
            <button onClick={() => navigate('/pricing')} className="btn-outline-amber">View Full Pricing <ArrowRight size={16} /></button>
          </div>
        </div>
      </section>

      {/* ═══ TRUST ═══ */}
      <section className="section bg-carbon-900">
        <div className="container-page">
          <Reveal className="mb-12 text-center">
            <span className="eyebrow">Our Value</span>
            <h2 className="mt-4 section-title">What We Help Businesses Achieve</h2>
          </Reveal>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {TRUST_CARDS.map((t, i) => (
              <Reveal key={t.title} delay={i * 80}>
                <div className="group card-dark p-6 h-full transition-all hover:-translate-y-1 hover:shadow-lift">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-forest-600/15 text-forest-400 group-hover:bg-forest-600 group-hover:text-white transition-colors mb-4"><Icon name={t.icon} size={22} /></div>
                  <h3 className="font-serif text-lg font-semibold text-white">{t.title}</h3>
                  <p className="mt-2 text-sm text-carbon-400 leading-relaxed">{t.desc}</p>
                </div>
              </Reveal>
            ))}
            <Reveal delay={TRUST_CARDS.length * 80}>
              <div className="card-forest p-6 h-full flex flex-col justify-center text-center">
                <p className="font-serif text-lg text-white leading-snug">"All That Matters<br />Is Result"</p>
                <p className="mt-2 text-xs text-carbon-400">Our central philosophy.</p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ═══ MARQUEE ═══ */}
      <section className="py-12 bg-carbon-950 border-y border-white/5 overflow-hidden">
        <div className="container-page mb-6">
          <p className="text-center text-xs font-semibold uppercase tracking-[0.3em] text-carbon-500">Platforms & Channels We Work Across</p>
        </div>
        <div className="relative overflow-hidden">
          <div className="flex gap-8 whitespace-nowrap" style={{ transform: `translateX(${marqueeOffset}px)`, willChange: 'transform' }}>
            {[...MARQUEE_PLATFORMS, ...MARQUEE_PLATFORMS, ...MARQUEE_PLATFORMS].map((p, i) => (
              <span key={i} className="font-serif text-xl font-medium text-carbon-600 hover:text-amber-500 transition-colors cursor-default">{p}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ ABOUT PREVIEW ═══ */}
      <section className="section bg-forest-950 relative overflow-hidden">
        <div className="absolute inset-0 noise opacity-5" />
        <div className="absolute -right-32 top-1/2 -translate-y-1/2 h-96 w-96 rounded-full bg-forest-700/15 blur-3xl" />
        <div className="container-page relative">
          <Reveal>
            <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
              <div>
                <span className="eyebrow-forest">Beyond the Store</span>
                <h2 className="mt-4 font-serif text-4xl font-semibold text-white sm:text-5xl">We don't believe a store<br />is only about how it looks</h2>
                <p className="mt-5 text-carbon-300 leading-relaxed">A beautiful store is valuable, but customers must also discover the product, understand the product, trust the brand, interact with the store, and ultimately take action. Our approach considers every layer: store, product, brand, customer, marketing, promotion, experience, and growth.</p>
                <p className="mt-4 text-carbon-300 leading-relaxed">Founded in {FOUNDED_YEAR} by Jacob David, Official Shopijavid was built on one principle: <span className="text-amber-500 font-semibold">"All That Matters Is Result."</span></p>
                <div className="mt-7 flex flex-wrap gap-3">
                  <button onClick={() => navigate('/portfolio')} className="btn-forest">Learn More About Us</button>
                  <button onClick={() => navigate('/team')} className="btn-ghost">Meet the Team</button>
                </div>
              </div>
              <div className="beyond-globe-wrap">
                <InteractiveGlobe size={380} />
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ═══ FAQ ═══ */}
      <section className="section bg-carbon-950">
        <div className="container-page max-w-3xl">
          <Reveal className="mb-10 text-center">
            <span className="eyebrow">Questions</span>
            <h2 className="mt-4 section-title">Frequently Asked</h2>
          </Reveal>
          <div className="space-y-3">
            {[
              { q: 'What platforms do you work with?', a: 'We work across Shopify, Wix, WooCommerce, Etsy, Amazon, and more. If your platform is not listed, contact us and we will let you know if we can help.' },
              { q: 'Do you offer services beyond ecommerce?', a: 'Yes. We offer bookkeeping, resume writing, business documentation, consultation, video editing, graphic design, and more. See our Services page for the full list.' },
              { q: 'Is the consultation really free?', a: 'Yes. Your first strategy consultation is completely free with no obligation. We discuss your business and recommend next steps.' },
              { q: 'Do you guarantee results?', a: 'We do not guarantee specific sales figures. We commit to pursuing meaningful, measurable outcomes through professional strategy and execution.' },
              { q: 'How do I get started?', a: 'Click "Start a Project" anywhere on the site, fill out the contact form, and our team will respond within 24 hours.' },
            ].map((faq, i) => (
              <Reveal key={i} delay={i * 60}>
                <div className="card-dark overflow-hidden">
                  <button onClick={() => setFaqOpen(faqOpen === i ? null : i)} className="flex w-full items-center justify-between p-5 text-left">
                    <span className="font-serif text-base sm:text-lg font-medium text-white">{faq.q}</span>
                    <span className={`text-amber-500 text-xl font-light transition-transform shrink-0 ml-4 ${faqOpen === i ? 'rotate-45' : ''}`}>+</span>
                  </button>
                  {faqOpen === i && <div className="border-t border-white/8 px-5 pb-5 pt-4 animate-fade-in"><p className="text-sm leading-relaxed text-carbon-400">{faq.a}</p></div>}
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ NEWSLETTER ═══ */}
      <section className="section-sm bg-forest-950">
        <div className="container-page">
          <div className="mx-auto max-w-xl text-center">
            <span className="eyebrow-forest">Stay Updated</span>
            <h2 className="mt-4 font-serif text-3xl font-semibold text-white">Get Growth Insights</h2>
            <p className="mt-3 text-carbon-400 text-sm">Join entrepreneurs receiving our best content on ecommerce, branding, and digital growth.</p>
            {subscribed ? (
              <p className="mt-6 text-forest-400 font-semibold">You are in. Welcome.</p>
            ) : (
              <form onSubmit={(e) => { e.preventDefault(); if (email) setSubscribed(true); }} className="mt-6 flex flex-col sm:flex-row gap-2">
                <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Your email address" className="input-dark flex-1" />
                <button type="submit" className="btn-forest shrink-0">Subscribe</button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* ═══ FINAL CTA ═══ */}
      <section className="section-sm bg-carbon-950">
        <div className="container-page">
          <Reveal>
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-forest-900 to-carbon-900 px-6 py-16 sm:px-12 text-center ring-1 ring-forest-700/40">
              <div className="absolute inset-0 noise opacity-5" />
              <div className="absolute -left-16 top-1/2 h-64 w-64 -translate-y-1/2 rounded-full bg-amber-500/10 blur-3xl" />
              <div className="absolute -right-16 top-1/2 h-64 w-64 -translate-y-1/2 rounded-full bg-forest-600/10 blur-3xl" />
              <div className="relative">
                <span className="eyebrow">Ready to Grow?</span>
                <h2 className="mt-5 font-serif text-3xl sm:text-4xl lg:text-5xl font-semibold text-white">Your Store Has a Vision.<br />Let's Build the System Behind It.</h2>
                <p className="mx-auto mt-4 max-w-lg text-carbon-300">Tell us about your business, your product, and where you want to go.</p>
                <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                  <button onClick={() => navigate('/contact')} className="btn-amber">Start a Project <ArrowRight size={16} /></button>
                  <a href={`mailto:${AGENCY_EMAIL}`} className="btn-ghost">Contact Official Shopijavid</a>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
