import { useEffect, useState } from 'react';
import { Menu, X, Sun, Moon } from 'lucide-react';
import { useHashRoute } from '../lib/router';
import { useTheme } from '../lib/theme';

const links = [
  { label: 'Home', to: '/' },
  { label: 'Portfolio', to: '/portfolio' },
  { label: 'Services', to: '/services' },
  { label: 'Gigs', to: '/gigs' },
  { label: 'Pricing', to: '/pricing' },
  { label: 'Blog', to: '/blog' },
  { label: 'Team', to: '/team' },
  { label: 'Contact', to: '/contact' },
];

export default function Navbar() {
  const { route, navigate } = useHashRoute();
  const { theme, toggle } = useTheme();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const go = (to: string) => { navigate(to); setOpen(false); };
  const isActive = (to: string) => (to === '/' ? route === '/' : route.startsWith(to));

  return (
    <header className={`fixed left-0 right-0 top-0 z-50 transition-all duration-500 ${scrolled ? 'bg-carbon-950/90 backdrop-blur-xl shadow-lg' : 'bg-transparent'}`}>
      <nav className="container-page flex items-center justify-between gap-4 py-3">
        <button onClick={() => go('/')} className="flex items-center gap-2.5 shrink-0">
          <img src="/images/WhatsApp_Image_2026-05-18_at_11.45.20_AM.jpeg" alt="SHOPIJAVID" className="h-10 w-10 rounded-full object-cover ring-1 ring-amber-500/40 shrink-0" />
          <span className="font-serif text-lg font-semibold tracking-widest text-white whitespace-nowrap">SHOPIJAVID</span>
        </button>

        <div className="hidden lg:flex items-center gap-0.5">
          {links.map((l) => (
            <button
              key={l.to}
              onClick={() => go(l.to)}
              className={`rounded-full px-3.5 py-2 text-sm font-medium transition-colors ${
                isActive(l.to) ? 'text-amber-500' : 'text-white/70 hover:text-white'
              }`}
            >
              {l.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button onClick={toggle} className="flex h-9 w-9 items-center justify-center rounded-full text-white/70 ring-1 ring-white/15 hover:bg-white/5 hover:text-white transition" aria-label="Toggle theme">
            {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
          </button>
          <button onClick={() => go('/contact')} className="hidden sm:inline-flex btn-amber btn-sm">Book Strategy Call</button>
          <button onClick={() => setOpen(!open)} className="flex h-9 w-9 items-center justify-center rounded-full text-white ring-1 ring-white/15 lg:hidden" aria-label="Toggle menu">
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </nav>

      {open && (
        <div className="lg:hidden bg-carbon-950/95 backdrop-blur-xl border-t border-white/10 animate-fade-in">
          <div className="container-page py-4 grid grid-cols-2 gap-1">
            {links.map((l) => (
              <button
                key={l.to}
                onClick={() => go(l.to)}
                className={`rounded-lg px-4 py-3 text-sm font-medium text-left ${
                  isActive(l.to) ? 'bg-amber-500/15 text-amber-500' : 'text-white/70 hover:bg-white/5'
                }`}
              >
                {l.label}
              </button>
            ))}
            <button onClick={() => go('/contact')} className="btn-amber btn-sm col-span-2 mt-2">Book Strategy Call</button>
          </div>
        </div>
      )}
    </header>
  );
}
