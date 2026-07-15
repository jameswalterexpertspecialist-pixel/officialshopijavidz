import { useState, useMemo } from 'react';
import { Mail, MapPin, Clock, Check, X, MessageCircle, ArrowRight, Instagram, Facebook, Twitter, Youtube, Send, AlertCircle, Loader2 } from 'lucide-react';
import { AGENCY_EMAIL, FOUNDER_WHATSAPP, AGENCY_ADDRESS, AGENCY_LAT, AGENCY_LNG, SERVICES, WORK_WITH_OPTIONS, SOCIAL_LINKS } from '../lib/data';

const socialIcons: Record<string, React.ComponentType<{ size?: number }>> = {
  facebook: Facebook,
  instagram: Instagram,
  twitter: Twitter,
  tiktok: Youtube,
  quora: Youtube,
};

const ALL_SERVICES = SERVICES.map((s) => s.name).concat(['Custom Request']);

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', company: '', phone: '', budget: '', message: '', workWith: '' });
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [customService, setCustomService] = useState('');
  const [search, setSearch] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [consultationCode, setConsultationCode] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const filteredServices = useMemo(() => {
    return ALL_SERVICES.filter((s) => s.toLowerCase().includes(search.toLowerCase()) && !selectedServices.includes(s));
  }, [search, selectedServices]);

  const generateCode = (email: string) => {
    if (!email || !email.includes('@')) { setConsultationCode(''); return; }
    const prefix = 'SJ';
    const year = new Date().getFullYear();
    const hash = email.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
    const num = (hash * 7) % 10000;
    setConsultationCode(`${prefix}-${year}-${String(num).padStart(4, '0')}`);
  };

  const toggleService = (s: string) => {
    setSelectedServices((prev) => prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]);
  };

  const addCustom = () => {
    if (customService.trim() && !selectedServices.includes(customService.trim())) {
      setSelectedServices([...selectedServices, customService.trim()]);
      setCustomService('');
    }
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    const services = [...selectedServices];
    if (customService.trim()) services.push(customService.trim());

    const payload = {
      name: form.name,
      email: form.email,
      company: form.company,
      phone: form.phone,
      services,
      budget: form.budget,
      message: form.message,
      workWith: form.workWith,
      consultationCode,
    };

    try {
      const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/contact-notify`;
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || `Request failed (${response.status})`);
      }

      const data = await response.json();
      if (!data.success) {
        throw new Error(data.error || 'Something went wrong. Please try again.');
      }
      setSent(true);
    } catch (err: any) {
      setError(err.message || 'Failed to send message. Please try again or email us directly.');
    } finally {
      setSubmitting(false);
    }
  };

  if (sent) {
    return (
      <div className="pt-32 pb-20">
        <div className="container-page max-w-lg text-center">
          <div className="card-dark p-10">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-forest-600 text-white">
              <Check size={32} />
            </div>
            <h1 className="mt-5 font-serif text-3xl font-semibold text-white">Message sent!</h1>
            <p className="mt-3 text-carbon-400">We will get back to you within 24 hours.</p>
            {consultationCode && (
              <div className="mt-6 rounded-xl bg-forest-900/40 p-4 ring-1 ring-forest-700/30">
                <p className="text-xs text-carbon-400 uppercase tracking-widest">Your Consultation Code</p>
                <p className="mt-1 font-mono text-2xl font-semibold text-amber-500">{consultationCode}</p>
                <p className="mt-2 text-xs text-carbon-500">Save this code for your reference. Include it in any follow-up communications.</p>
              </div>
            )}
            <button onClick={() => { setSent(false); setForm({ name: '', email: '', company: '', phone: '', budget: '', message: '' }); setSelectedServices([]); setConsultationCode(''); }} className="btn-outline-amber mt-6">Send Another</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-20">
      <section className="relative bg-carbon-950 py-16 overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-30" />
        <div className="absolute left-1/2 top-0 -translate-x-1/2 h-px w-3/4 bg-gradient-to-r from-transparent via-amber-500/40 to-transparent" />
        <div className="container-page relative text-center">
          <span className="eyebrow">Get In Touch</span>
          <h1 className="mt-4 font-serif text-5xl font-semibold text-white sm:text-6xl">Let's build something</h1>
          <p className="mx-auto mt-4 max-w-xl text-carbon-400">Your first strategy consultation is completely free. Tell us about your project and we will get back to you within 24 hours.</p>
        </div>
      </section>

      <section className="section bg-carbon-950">
        <div className="container-page grid gap-10 lg:grid-cols-3">
          {/* Form */}
          <div className="lg:col-span-2">
            <form onSubmit={submit} className="card-dark p-8 space-y-5">
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="label">Name *</label>
                  <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input-dark" placeholder="Your name" />
                </div>
                <div>
                  <label className="label">Email *</label>
                  <input required type="email" value={form.email} onChange={(e) => { setForm({ ...form, email: e.target.value }); generateCode(e.target.value); }} className="input-dark" placeholder="you@email.com" />
                </div>
              </div>
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="label">Company</label>
                  <input value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} className="input-dark" placeholder="Company name" />
                </div>
                <div>
                  <label className="label">Phone</label>
                  <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="input-dark" placeholder="Phone number" />
                </div>
              </div>

              {/* Service multi-select */}
              <div>
                <label className="label">Services Needed *</label>
                {selectedServices.length > 0 && (
                  <div className="mb-2 flex flex-wrap gap-2">
                    {selectedServices.map((s) => (
                      <span key={s} className="chip bg-forest-900/60 text-forest-400 flex items-center gap-1">
                        {s} <button type="button" onClick={() => toggleService(s)}><X size={12} /></button>
                      </span>
                    ))}
                  </div>
                )}
                <div className="relative">
                  <input
                    value={search}
                    onChange={(e) => { setSearch(e.target.value); setShowDropdown(true); }}
                    onFocus={() => setShowDropdown(true)}
                    onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
                    className="input-dark"
                    placeholder="Search for services..."
                  />
                  {showDropdown && filteredServices.length > 0 && (
                    <div className="absolute z-10 mt-1 w-full rounded-xl bg-carbon-800 ring-1 ring-white/10 shadow-lift max-h-48 overflow-y-auto">
                      {filteredServices.map((s) => (
                        <button key={s} type="button" onClick={() => { toggleService(s); setSearch(''); }} className="block w-full px-4 py-2.5 text-left text-sm text-carbon-300 hover:bg-carbon-700 hover:text-white transition">
                          {s}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <div className="mt-2 flex gap-2">
                  <input value={customService} onChange={(e) => setCustomService(e.target.value)} className="input-dark flex-1" placeholder="Type a custom service if not listed..." />
                  <button type="button" onClick={addCustom} className="btn-outline-amber btn-sm shrink-0">Add</button>
                </div>
              </div>

              <div>
                <label className="label">Who would you like to work with?</label>
                <select value={form.workWith} onChange={(e) => setForm({ ...form, workWith: e.target.value })} className="input-dark">
                  <option value="">Select an option</option>
                  {WORK_WITH_OPTIONS.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
                </select>
              </div>

              <div>
                <label className="label">Budget</label>
                <select value={form.budget} onChange={(e) => setForm({ ...form, budget: e.target.value })} className="input-dark">
                  <option value="">Select range</option>
                  <option>Under $500</option>
                  <option>$500 to $1,500</option>
                  <option>$1,500 to $5,000</option>
                  <option>$5,000 to $15,000</option>
                  <option>$15,000+</option>
                </select>
              </div>

              <div>
                <label className="label">Message *</label>
                <textarea required value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} rows={5} className="input-dark resize-none" placeholder="Tell us about your project..." />
              </div>

              {consultationCode && (
                <div className="rounded-xl bg-forest-900/40 p-4 ring-1 ring-forest-700/30">
                  <p className="text-xs text-carbon-400 uppercase tracking-widest">Your Consultation Code</p>
                  <p className="mt-1 font-mono text-xl font-semibold text-amber-500">{consultationCode}</p>
                </div>
              )}

              {error && (
                <div className="flex items-start gap-2 rounded-xl bg-red-500/10 p-3 text-sm text-red-400 ring-1 ring-red-500/20">
                  <AlertCircle size={16} className="mt-0.5 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <button type="submit" disabled={submitting} className="btn-amber w-full">
                {submitting ? (
                  <><Loader2 size={16} className="animate-spin" /> Sending...</>
                ) : (
                  <>Send Message <ArrowRight size={16} /></>
                )}
              </button>
              <p className="text-center text-xs text-carbon-500">We reply within 24 hours. Consultation is free.</p>
            </form>
          </div>

          {/* Contact info */}
          <div className="space-y-4">
            <div className="card-dark p-6">
              <h3 className="font-serif text-xl font-semibold text-white">Contact Information</h3>
              <div className="mt-5 space-y-4">
                <a href={`mailto:${AGENCY_EMAIL}`} className="flex items-start gap-3 text-carbon-400 hover:text-white transition">
                  <Mail size={18} className="mt-0.5 shrink-0 text-amber-500" />
                  <div><p className="text-xs text-carbon-500">Email</p><p className="text-sm">{AGENCY_EMAIL}</p></div>
                </a>
                <a href={FOUNDER_WHATSAPP} target="_blank" rel="noopener noreferrer" className="flex items-start gap-3 text-carbon-400 hover:text-white transition">
                  <MessageCircle size={18} className="mt-0.5 shrink-0 text-forest-400" />
                  <div><p className="text-xs text-carbon-500">WhatsApp</p><p className="text-sm">Chat with us</p></div>
                </a>
                <div className="flex items-start gap-3 text-carbon-400">
                  <MapPin size={18} className="mt-0.5 shrink-0 text-amber-500" />
                  <div><p className="text-xs text-carbon-500">Office</p><p className="text-sm">{AGENCY_ADDRESS}</p></div>
                </div>
                <div className="flex items-start gap-3 text-carbon-400">
                  <Clock size={18} className="mt-0.5 shrink-0 text-forest-400" />
                  <div><p className="text-xs text-carbon-500">Business Hours</p><p className="text-sm">Mon to Fri, 9am to 6pm EST</p></div>
                </div>
              </div>
            </div>

            <div className="card-dark overflow-hidden">
              <iframe
                title="Office Location"
                width="100%"
                height="200"
                loading="lazy"
                style={{ border: 0 }}
                src={`https://www.openstreetmap.org/export/embed.html?bbox=${AGENCY_LNG - 0.01}%2C${AGENCY_LAT - 0.008}%2C${AGENCY_LNG + 0.01}%2C${AGENCY_LAT + 0.008}&layer=mapnik&marker=${AGENCY_LAT}%2C${AGENCY_LNG}`}
              />
            </div>

            <div className="card-dark p-6">
              <h3 className="text-xs font-semibold uppercase tracking-widest text-amber-500">Follow Us</h3>
              <p className="mt-2 text-sm text-carbon-400">Connect with us on social media for updates, insights, and behind-the-scenes content.</p>
              <div className="mt-4 flex flex-wrap gap-2.5">
                {SOCIAL_LINKS.map((s) => {
                  const Icon = socialIcons[s.icon] || Youtube;
                  return (
                    <a key={s.name} href={s.url} target="_blank" rel="noopener noreferrer" title={s.name} className="flex h-10 w-10 items-center justify-center rounded-full bg-carbon-900 text-carbon-300 ring-1 ring-white/10 transition hover:bg-amber-500 hover:text-carbon-950 hover:ring-amber-500 hover:scale-110">
                      <Icon size={17} />
                    </a>
                  );
                })}
              </div>
            </div>

            <div className="card-forest p-6 text-center">
              <p className="font-serif text-lg text-white">Consultation is free.</p>
              <p className="mt-1 text-sm text-carbon-400">No obligation. No pressure. Just real advice for your brand.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
