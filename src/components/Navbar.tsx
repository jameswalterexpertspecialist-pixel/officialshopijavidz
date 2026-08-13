import { useEffect, useState } from 'react';
import { Menu, X, Sun, Moon, Palette } from 'lucide-react';
import { useHashRoute } from '../lib/router';
import { useTheme } from '../lib/theme';

const links = [
  { label: 'Home', to: '/' },
  { label: 'Services', to: '/services' },
  { label: 'Portfolio', to: '/portfolio' },
  { label: 'Team', to: '/team' },
  { label: 'Blog', to: '/blog' },
  { label: 'Contact', to: '/contact' },
];

export default function Navbar() {
  const { route, navigate } = useHashRoute();
  const { theme, accent, toggle, setAccent } = useTheme();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [colorOpen, setColorOpen] = useState(false);

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
          <img src="/images/shopi.jpeg" alt="SHOPIJAVID" className="h-10 w-10 rounded-full object-cover ring-1 ring-white/20 shrink-0" />
          <span className="font-serif text-lg font-semibold tracking-widest text-white whitespace-nowrap">Official Shopijavid</span>
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
          {/* Accent colour switcher */}
          <div className="relative">
            <button onClick={() => setColorOpen(!colorOpen)} className="flex h-9 w-9 items-center justify-center rounded-full text-white/70 ring-1 ring-white/15 hover:bg-white/5 hover:text-white transition" aria-label="Change colour">
              <Palette size={16} />
            </button>
            {colorOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setColorOpen(false)} />
                <div className="absolute right-0 top-11 z-50 w-44 rounded-xl bg-carbon-900 p-2 ring-1 ring-white/10 shadow-lift animate-fade-in">
                  <p className="px-2 py-1.5 text-[10px] font-semibold uppercase tracking-widest text-carbon-500">Colour scheme</p>
                  <button
                    onClick={() => { if (accent !== 'green') setAccent('green'); setColorOpen(false); }}
                    className={`flex w-full items-center gap-3 rounded-lg px-2.5 py-2 text-sm transition ${accent === 'green' ? 'bg-white/5 text-white' : 'text-carbon-400 hover:text-white'}`}
                  >
                    <span className="h-4 w-4 rounded-full bg-emerald-500 ring-1 ring-white/20" />
                    <span>Green</span>
                    {accent === 'green' && <span className="ml-auto text-xs text-emerald-400">●</span>}
                  </button>
                  <button
                    onClick={() => { if (accent !== 'blue') setAccent('blue'); setColorOpen(false); }}
                    className={`flex w-full items-center gap-3 rounded-lg px-2.5 py-2 text-sm transition ${accent === 'blue' ? 'bg-white/5 text-white' : 'text-carbon-400 hover:text-white'}`}
                  >
                    <span className="h-4 w-4 rounded-full bg-blue-500 ring-1 ring-white/20" />
                    <span>Blue</span>
                    {accent === 'blue' && <span className="ml-auto text-xs text-blue-400">●</span>}
                  </button>
                  <button
                    onClick={() => { if (accent !== 'gold') setAccent('gold'); setColorOpen(false); }}
                    className={`flex w-full items-center gap-3 rounded-lg px-2.5 py-2 text-sm transition ${accent === 'gold' ? 'bg-white/5 text-white' : 'text-carbon-400 hover:text-white'}`}
                  >
                    <span className="h-4 w-4 rounded-full bg-amber-500 ring-1 ring-white/20" />
                    <span>Gold</span>
                    {accent === 'gold' && <span className="ml-auto text-xs text-amber-400">●</span>}
                  </button>
                </div>
              </>
            )}
          </div>

          <button onClick={toggle} className="flex h-9 w-9 items-center justify-center rounded-full text-white/70 ring-1 ring-white/15 hover:bg-white/5 hover:text-white transition" aria-label="Toggle theme">
            {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
          </button>
          <button onClick={() => go('/contact')} className="hidden sm:inline-flex btn-amber btn-sm">Start a Project</button>
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
            <button onClick={() => go('/contact')} className="btn-amber btn-sm col-span-2 mt-2">Start a Project</button>
          </div>
        </div>
      )}
    </header>
  );
}
