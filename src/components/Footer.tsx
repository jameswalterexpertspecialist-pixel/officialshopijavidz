import { Mail, MapPin, Instagram, Facebook, Twitter, Youtube, Send } from 'lucide-react';
import { useHashRoute } from '../lib/router';
import { AGENCY_EMAIL, AGENCY_ADDRESS, SOCIAL_LINKS } from '../lib/data';
import { useState } from 'react';

const socialIcons: Record<string, React.ComponentType<{ size?: number }>> = {
  facebook: Facebook,
  instagram: Instagram,
  twitter: Twitter,
  tiktok: Youtube,
  quora: Youtube,
};

export default function Footer() {
  const { navigate } = useHashRoute();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  return (
    <footer className="relative bg-carbon-950 border-t border-white/10 pt-16 pb-8">
      <div className="container-page">
        <div className="grid gap-10 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <button onClick={() => navigate('/')} className="flex items-center gap-3">
              <img src="/images/shopi.jpeg" alt="" className="h-12 w-12 rounded-full object-cover ring-1 ring-white/20" />
              <div>
                <span className="block font-serif text-xl font-semibold tracking-wide text-white">Official Shopijavid</span>
                <span className="block text-xs text-amber-500 tracking-widest">ALL THAT MATTERS IS RESULT</span>
              </div>
            </button>
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-carbon-400">
              We help businesses move from idea to brand to store to promotion to customers to sales to growth. One ecosystem. Multiple solutions. One objective — results.
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              {SOCIAL_LINKS.map((s) => {
                const Icon = socialIcons[s.icon] || Youtube;
                return (
                  <a key={s.name} href={s.url} target="_blank" rel="noopener noreferrer" title={s.name} className="flex h-9 w-9 items-center justify-center rounded-full bg-carbon-900 text-carbon-400 ring-1 ring-white/10 transition hover:bg-accent-500 hover:text-white hover:ring-accent-500 hover:scale-110">
                    <Icon size={15} />
                  </a>
                );
              })}
            </div>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-widest text-amber-500">Navigation</h4>
            <ul className="mt-4 space-y-2.5 text-sm">
              {[['Home','/'],['Services','/services'],['Portfolio','/portfolio'],['Team','/team'],['Blog','/blog'],['Contact','/contact']].map(([l,t]) => (
                <li key={t}><button onClick={() => navigate(t)} className="text-carbon-400 hover:text-white transition">{l}</button></li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-widest text-amber-500">Services</h4>
            <ul className="mt-4 space-y-2.5 text-sm">
              {['Shopify Development','Wix Development','WooCommerce','Amazon Optimization','Marketing Strategy','Bookkeeping','Resume Writing','Brand Identity'].map((s) => (
                <li key={s}><button onClick={() => navigate('/services')} className="text-carbon-400 hover:text-white transition">{s}</button></li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-widest text-amber-500">Contact</h4>
            <ul className="mt-4 space-y-3 text-sm">
              <li><a href={`mailto:${AGENCY_EMAIL}`} className="flex items-center gap-2 text-carbon-400 hover:text-white transition"><Mail size={14} /> {AGENCY_EMAIL}</a></li>
              <li className="flex items-start gap-2 text-carbon-400"><MapPin size={14} className="mt-0.5 shrink-0" /> {AGENCY_ADDRESS}</li>
            </ul>
            {subscribed ? (
              <p className="mt-4 text-sm text-forest-400">You are on the list.</p>
            ) : (
              <form onSubmit={(e) => { e.preventDefault(); if (email) setSubscribed(true); }} className="mt-4 flex gap-2">
                <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Your email" className="input-dark flex-1 text-xs" />
                <button type="submit" className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent-500 text-white hover:bg-accent-400 transition"><Send size={15} /></button>
              </form>
            )}
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-6 sm:flex-row">
          <p className="text-xs text-carbon-500">© {new Date().getFullYear()} Official Shopijavid. All rights reserved.</p>
          <div className="flex gap-5 text-xs text-carbon-500">
            <button onClick={() => navigate('/terms')} className="hover:text-white transition">Terms & Conditions</button>
            <button onClick={() => navigate('/terms')} className="hover:text-white transition">Privacy Policy</button>
            <button onClick={() => navigate('/terms')} className="hover:text-white transition">Cookie Policy</button>
          </div>
        </div>
      </div>
    </footer>
  );
}
