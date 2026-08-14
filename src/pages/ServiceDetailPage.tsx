import { useEffect, useState } from 'react';
import { ArrowLeft, Clock, Star, Check, Send, ShieldCheck, Zap, RefreshCw } from 'lucide-react';
import { supabase, type ServiceWithProfile, type ProjectWithProfile } from '../lib/supabase';
import { useHashRoute } from '../lib/router';
import ProjectCard from '../components/ProjectCard';

const fallbackImg = 'https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?auto=compress&cs=tinysrgb&w=800';

export default function ServiceDetailPage({ id }: { id: string }) {
  const { navigate } = useHashRoute();
  const [service, setService] = useState<ServiceWithProfile | null>(null);
  const [projects, setProjects] = useState<ProjectWithProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.from('services').select('*, profiles(full_name, avatar_url, title)').eq('id', id).maybeSingle();
      setService(data as ServiceWithProfile | null);
      if (data) {
        const { data: projs } = await supabase.from('projects').select('*, profiles(full_name, avatar_url)').eq('user_id', data.user_id).order('created_at', { ascending: false }).limit(3);
        setProjects((projs as ProjectWithProfile[]) ?? []);
      }
      setLoading(false);
    })();
  }, [id]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!service) return;
    setSubmitting(true);
    setError(null);
    const { error: err } = await supabase.from('inquiries').insert({
      service_id: service.id, recipient_id: service.user_id,
      sender_name: form.name, sender_email: form.email, message: form.message,
    });
    setSubmitting(false);
    if (err) setError(err.message);
    else { setSent(true); setForm({ name: '', email: '', message: '' }); }
  };

  if (loading) return <div className="container-page pt-10"><div className="h-96 animate-pulse rounded-3xl bg-ink-100" /></div>;

  if (!service) {
    return (
      <div className="container-page pt-24 text-center">
        <h1 className="font-serif text-3xl text-ink-900">Service not found</h1>
        <button onClick={() => navigate('/services')} className="btn-dark mt-6">Back to services</button>
      </div>
    );
  }

  return (
    <div>
      {/* Dark hero */}
      <section className="relative bg-ink-950 pt-10 pb-20">
        <div className="absolute inset-0 noise-overlay opacity-[0.04]" />
        <div className="container-page relative">
          <button onClick={() => navigate('/services')} className="flex items-center gap-1.5 text-sm font-medium text-ink-400 hover:text-cream-50 transition">
            <ArrowLeft size={16} /> Back to services
          </button>
          <div className="mt-6 grid gap-8 lg:grid-cols-2 lg:items-end">
            <div>
              <div className="flex flex-wrap gap-2">
                <span className="chip bg-coral-500/15 text-coral-400">{service.category}</span>
                {service.featured && <span className="chip bg-amber-400/15 text-amber-400">★ Featured</span>}
              </div>
              <h1 className="mt-4 font-serif text-4xl font-normal text-cream-50 sm:text-5xl leading-tight">{service.title}</h1>
              <div className="mt-5 flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-coral-500 text-white font-bold overflow-hidden">
                  {service.profiles?.avatar_url ? <img src={service.profiles.avatar_url} alt="" className="h-full w-full object-cover" /> : (service.profiles?.full_name?.[0] ?? '?')}
                </span>
                <div>
                  <p className="font-semibold text-cream-50">{service.profiles?.full_name ?? 'Creator'}</p>
                  <p className="text-sm text-ink-400">{service.profiles?.title || 'Freelance professional'}</p>
                </div>
              </div>
            </div>
            <div className="flex flex-wrap gap-4 lg:justify-end">
              <div className="flex items-center gap-2 rounded-2xl bg-ink-800 px-5 py-3 ring-1 ring-ink-700">
                <Clock size={18} className="text-coral-400" />
                <div><p className="text-xs text-ink-400">Delivery</p><p className="font-semibold text-cream-50">{service.delivery_days} days</p></div>
              </div>
              <div className="flex items-center gap-2 rounded-2xl bg-ink-800 px-5 py-3 ring-1 ring-ink-700">
                <Star size={18} className="text-amber-400 fill-amber-400" />
                <div><p className="text-xs text-ink-400">Rating</p><p className="font-semibold text-cream-50">4.9 (128)</p></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="container-page -mt-12 relative grid gap-10 lg:grid-cols-3">
        {/* Main */}
        <div className="lg:col-span-2">
          <div className="overflow-hidden rounded-3xl bg-ink-100 shadow-card ring-1 ring-ink-200/60">
            <img src={service.image_url || fallbackImg} alt={service.title} className="h-80 w-full object-cover" />
          </div>

          <h2 className="mt-8 font-serif text-2xl font-normal text-ink-900">About this service</h2>
          <p className="mt-3 whitespace-pre-line leading-relaxed text-ink-600">{service.description}</p>

          <h2 className="mt-8 font-serif text-2xl font-normal text-ink-900">What's included</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {[
              'Initial consultation & scope definition',
              `${service.delivery_days}-day delivery timeline`,
              'Two rounds of revisions',
              'Final deliverables in your format',
              'Direct communication throughout',
              'Source files included',
            ].map((item) => (
              <div key={item} className="flex items-start gap-2.5 rounded-2xl bg-cream-50 p-3 ring-1 ring-ink-200/60">
                <Check size={18} className="mt-0.5 shrink-0 text-sage-500" />
                <span className="text-sm text-ink-700">{item}</span>
              </div>
            ))}
          </div>

          {/* Trust badges */}
          <div className="mt-8 grid grid-cols-3 gap-3">
            {[
              { icon: ShieldCheck, label: 'Secure', sub: 'Protected inquiry' },
              { icon: Zap, label: 'Fast', sub: `${service.delivery_days}d delivery` },
              { icon: RefreshCw, label: 'Revisions', sub: '2 rounds free' },
            ].map((b) => (
              <div key={b.label} className="flex flex-col items-center rounded-2xl bg-ink-900 p-4 text-center">
                <b.icon size={20} className="text-coral-400" />
                <p className="mt-2 text-sm font-semibold text-cream-50">{b.label}</p>
                <p className="text-xs text-ink-400">{b.sub}</p>
              </div>
            ))}
          </div>

          {projects.length > 0 && (
            <>
              <h2 className="mt-10 font-serif text-2xl font-normal text-ink-900">Recent work</h2>
              <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {projects.map((p) => <ProjectCard key={p.id} project={p} />)}
              </div>
            </>
          )}
        </div>

        {/* Inquiry sidebar */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 card p-6">
            <div className="flex items-baseline justify-between">
              <span className="font-serif text-4xl font-normal text-ink-900">${service.price}</span>
              <span className="text-sm text-ink-500">starting at</span>
            </div>

            {sent ? (
              <div className="mt-6 rounded-2xl bg-sage-50 p-6 text-center ring-1 ring-sage-200">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-sage-500 text-white">
                  <Check size={28} />
                </div>
                <p className="mt-4 font-serif text-xl text-ink-900">Inquiry sent!</p>
                <p className="mt-1 text-sm text-ink-500">The creator will get back to you soon.</p>
                <button onClick={() => setSent(false)} className="btn-light mt-5 text-sm">Send another</button>
              </div>
            ) : (
              <form onSubmit={submit} className="mt-6 space-y-4">
                <h3 className="font-serif text-xl font-normal text-ink-900">Contact the creator</h3>
                {error && <p className="rounded-lg bg-coral-50 p-3 text-sm text-coral-700">{error}</p>}
                <div>
                  <label className="label">Your name</label>
                  <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input" placeholder="Jane Doe" />
                </div>
                <div>
                  <label className="label">Email</label>
                  <input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="input" placeholder="jane@example.com" />
                </div>
                <div>
                  <label className="label">Message</label>
                  <textarea required value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} rows={4} className="input resize-none" placeholder="Tell the creator what you need..." />
                </div>
                <button type="submit" disabled={submitting} className="btn-coral w-full">
                  {submitting ? 'Sending...' : <>Send inquiry <Send size={15} /></>}
                </button>
                <p className="text-center text-xs text-ink-400">No payment required to inquire</p>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
