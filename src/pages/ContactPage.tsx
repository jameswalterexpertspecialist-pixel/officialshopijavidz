import { useState, useMemo } from 'react';
import { Mail, MapPin, Clock, Check, X, MessageCircle, ArrowRight, Instagram, Facebook, Twitter, Youtube, AlertCircle, Loader2, Globe } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { AGENCY_EMAIL, FOUNDER_WHATSAPP, AGENCY_ADDRESS, AGENCY_LAT, AGENCY_LNG, SERVICES, WORK_WITH_OPTIONS, SOCIAL_LINKS } from '../lib/data';

const socialIcons: Record<string, React.ComponentType<{ size?: number }>> = {
  facebook: Facebook,
  instagram: Instagram,
  twitter: Twitter,
  tiktok: Youtube,
  quora: Youtube,
};

const ALL_SERVICES = SERVICES.map((s) => s.name).concat([
  'Bookkeeping', 'Resume Writing', 'Business Documentation', 'Business Consultation',
  'Account Management', 'Outsourcing Assistance', 'Video Editing', 'Graphic Design',
  'Social Media Creatives', 'Brand Identity', 'Competitor Research', 'Market Research',
  'Growth Strategy', 'Custom Request',
]);

const PLATFORM_OPTIONS = ['Shopify', 'Wix', 'WooCommerce', 'Etsy', 'Amazon', 'Other', 'Not Sure'];

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', company: '', phone: '', platform: '', budget: '', message: '', workWith: '' });
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [customService, setCustomService] = useState('');
  const [search, setSearch] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [consultationCode, setConsultationCode] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [touched, setTouched] = useState<Record<string, boolean>>({});

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

  const markTouched = (field: string) => setTouched((prev) => ({ ...prev, [field]: true }));

  const validate = () => {
    const services = [...selectedServices];
    if (customService.trim()) services.push(customService.trim());
    const errors: string[] = [];
    if (!form.name.trim()) errors.push('Name is required');
    if (!form.email.trim()) errors.push('Email is required');
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errors.push('Please enter a valid email address');
    if (services.length === 0) errors.push('Please select at least one service');
    if (!form.message.trim()) errors.push('Project description is required');
    return errors;
  };

  const resetForm = () => {
    setForm({ name: '', email: '', company: '', phone: '', platform: '', budget: '', message: '', workWith: '' });
    setSelectedServices([]);
    setCustomService('');
    setSearch('');
    setConsultationCode('');
    setTouched({});
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errors = validate();
    if (errors.length > 0) {
      setError(errors[0]);
      setTouched({ name: true, email: true, message: true });
      return;
    }

    setSubmitting(true);
    setError(null);
    const services = [...selectedServices];
    if (customService.trim()) services.push(customService.trim());

    try {
      try {
        await supabase.from('sj_contacts').insert({
          name: form.name,
          email: form.email,
          company: form.company,
          phone: form.phone,
          services,
          budget: form.budget,
          message: form.message,
          consultation_code: consultationCode,
        });
      } catch {
        // DB save is best-effort
      }

      const formData = new FormData();
      formData.append('name', form.name);
      formData.append('email', form.email);
      formData.append('company', form.company || 'Not provided');
      formData.append('phone', form.phone || 'Not provided');
      formData.append('platform', form.platform || 'Not specified');
      formData.append('services', services.length > 0 ? services.join(', ') : 'None specified');
      formData.append('budget', form.budget || 'Not specified');
      formData.append('workWith', form.workWith || 'No preference');
      formData.append('consultationCode', consultationCode);
      formData.append('message', form.message);
      formData.append('_subject', `New Contact Request from ${form.name} [${consultationCode}]`);
      formData.append('_template', 'table');
      formData.append('_captcha', 'false');

      const emailResponse = await fetch('https://formsubmit.co/ajax/officialshopijavid@gmail.com', {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: formData,
      });

      if (!emailResponse.ok) {
        throw new Error('Email delivery failed. Please try again or email us directly at ' + AGENCY_EMAIL);
      }

      const emailData = await emailResponse.json();
      if (emailData.success !== 'true' && emailData.success !== true) {
        throw new Error('Email delivery failed. Please try again or email us directly at ' + AGENCY_EMAIL);
      }

      setSent(true);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Something went wrong. Please try again or contact us directly at ' + AGENCY_EMAIL;
      setError(msg);
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
            <h1 className="mt-5 font-serif text-3xl font-semibold text-white">Request Received</h1>
            <p className="mt-3 text-carbon-400">Thank you for contacting Official Shopijavid. Your request has been successfully submitted. Our team will review your requirements and get back to you.</p>
            {consultationCode && (
              <div className="mt-6 rounded-xl bg-forest-900/40 p-4 ring-1 ring-forest-700/30">
                <p className="text-xs text-carbon-400 uppercase tracking-widest">Your Consultation Code</p>
                <p className="mt-1 font-mono text-2xl font-semibold text-amber-500">{consultationCode}</p>
                <p className="mt-2 text-xs text-carbon-500">Save this code for your reference. Include it in any follow-up communications.</p>
              </div>
            )}
            <button onClick={() => { setSent(false); resetForm(); }} className="btn-outline-amber mt-6">Send Another</button>
          </div>
        </div>
      </div>
    );
  }

  const showError = (field: string, condition: boolean) => touched[field] && condition;

  return (
    <div className="pt-20">
      <section className="relative bg-carbon-950 py-16 overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-30" />
        <div className="absolute left-1/2 top-0 -translate-x-1/2 h-px w-3/4 bg-gradient-to-r from-transparent via-amber-500/40 to-transparent" />
        <div className="container-page relative text-center">
          <span className="eyebrow">Get In Touch</span>
          <h1 className="mt-4 font-serif text-5xl font-semibold text-white sm:text-6xl">Let's Talk About Your Business</h1>
          <p className="mx-auto mt-4 max-w-xl text-carbon-400">Tell us about your business, your product, and where you want to go. Your first strategy consultation is completely free.</p>
        </div>
      </section>

      <section className="section bg-carbon-950">
        <div className="container-page grid gap-10 lg:grid-cols-3">
          {/* Form */}
          <div className="lg:col-span-2">
            <form onSubmit={submit} className="card-dark p-8 space-y-5">
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="label">Full Name *</label>
                  <input
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    onBlur={() => markTouched('name')}
                    className={`input-dark ${showError('name', !form.name.trim()) ? 'ring-2 ring-red-500' : ''}`}
                    placeholder="Your name"
                  />
                  {showError('name', !form.name.trim()) && <p className="mt-1 text-xs text-red-400">Name is required</p>}
                </div>
                <div>
                  <label className="label">Email Address *</label>
                  <input
                    required
                    type="email"
                    value={form.email}
                    onChange={(e) => { setForm({ ...form, email: e.target.value }); generateCode(e.target.value); }}
                    onBlur={() => markTouched('email')}
                    className={`input-dark ${showError('email', !form.email.trim()) ? 'ring-2 ring-red-500' : ''}`}
                    placeholder="you@email.com"
                  />
                  {showError('email', !form.email.trim()) && <p className="mt-1 text-xs text-red-400">Valid email is required</p>}
                </div>
              </div>
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="label">Company / Store Name</label>
                  <input value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} className="input-dark" placeholder="Company or store name" />
                </div>
                <div>
                  <label className="label">Phone / WhatsApp</label>
                  <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="input-dark" placeholder="Phone number" />
                </div>
              </div>

              <div>
                <label className="label">Platform</label>
                <select value={form.platform} onChange={(e) => setForm({ ...form, platform: e.target.value })} className="input-dark">
                  <option value="">Select platform</option>
                  {PLATFORM_OPTIONS.map((p) => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>

              {/* Service multi-select */}
              <div>
                <label className="label">Service Interested In *</label>
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
                    className={`input-dark ${touched.services && selectedServices.length === 0 && !customService.trim() ? 'ring-2 ring-red-500' : ''}`}
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
                {touched.services && selectedServices.length === 0 && !customService.trim() && (
                  <p className="mt-1 text-xs text-red-400">Please select at least one service</p>
                )}
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="label">Who would you like to work with?</label>
                  <select value={form.workWith} onChange={(e) => setForm({ ...form, workWith: e.target.value })} className="input-dark">
                    <option value="">Select an option</option>
                    {WORK_WITH_OPTIONS.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
                  </select>
                </div>
                <div>
                  <label className="label">Budget Range</label>
                  <select value={form.budget} onChange={(e) => setForm({ ...form, budget: e.target.value })} className="input-dark">
                    <option value="">Select range</option>
                    <option>Under $500</option>
                    <option>$500 to $1,500</option>
                    <option>$1,500 to $5,000</option>
                    <option>$5,000 to $15,000</option>
                    <option>$15,000+</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="label">Project Description *</label>
                <textarea
                  required
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  onBlur={() => markTouched('message')}
                  rows={5}
                  className={`input-dark resize-none ${showError('message', !form.message.trim()) ? 'ring-2 ring-red-500' : ''}`}
                  placeholder="Tell us about your project, your product, and your goals..."
                />
                {showError('message', !form.message.trim()) && <p className="mt-1 text-xs text-red-400">Project description is required</p>}
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
                  <><Loader2 size={16} className="animate-spin" /> Sending your request...</>
                ) : (
                  <>Start a Project <ArrowRight size={16} /></>
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
                  <Globe size={18} className="mt-0.5 shrink-0 text-amber-500" />
                  <div><p className="text-xs text-carbon-500">Website</p><p className="text-sm">officialshopijavid.com</p></div>
                </div>
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
