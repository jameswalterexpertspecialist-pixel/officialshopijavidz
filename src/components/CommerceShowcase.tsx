import { useEffect, useState, type CSSProperties } from 'react';
import { ArrowUpRight, ChevronLeft, ChevronRight } from 'lucide-react';

const TEMPLATES = [
  { name: 'Lumara Naturel', platform: 'Shopify', type: 'Wellness & Beauty', accent: '#c99b4b', description: 'A calm, conversion-led wellness store with botanical storytelling.', style: 'editorial' },
  { name: 'UrbanKicks', platform: 'Wix', type: 'Footwear & Fashion', accent: '#ee6b4f', description: 'A high-energy launch store designed around movement and limited drops.', style: 'fashion' },
  { name: 'Calrey Outdoors', platform: 'WooCommerce', type: 'Outdoor & Adventure', accent: '#4f8790', description: 'Structured merchandising for dependable gear and open-air living.', style: 'catalog' },
  { name: 'Varenlo', platform: 'Custom build', type: 'Jewelry & Accessories', accent: '#d7b86d', description: 'A quiet luxury storefront where product detail leads the experience.', style: 'luxury' },
  { name: 'Satanic Streetwear', platform: 'Shopify', type: 'Streetwear & Fashion', accent: '#e14d42', description: 'A dark editorial storefront for bold collections and fast drops.', style: 'streetwear' },
  { name: 'HomeVibe', platform: 'Wix', type: 'Home & Lifestyle', accent: '#a3a889', description: 'An airy home collection built around warmth, discovery, and trust.', style: 'home' },
] as const;

type Device = 'phone' | 'tablet' | 'laptop' | 'desktop';

function StorePreview({ template, device }: { template: typeof TEMPLATES[number]; device: Device }) {
  return (
    <div className={`store-device store-device-${device} store-design-${template.style}`} style={{ '--store-accent': template.accent } as CSSProperties}>
      <div className="store-screen">
        <div className="store-topbar"><b>{template.name}</b><span>Shop &nbsp; Collections &nbsp; About &nbsp; Bag</span></div>
        {template.style === 'editorial' && <div className="store-layout store-editorial-layout"><div><small>NEW ARRIVALS / 2026</small><h3>Natural beauty<br /><em>from within.</em></h3><button>Shop now</button></div><div className="store-product-orbit" /></div>}
        {template.style === 'fashion' && <div className="store-layout store-fashion-layout"><div className="store-fashion-image" /><div><small>DROP 04 / LIMITED</small><h3>Move<br /><strong>forward.</strong></h3><button>View the drop</button></div></div>}
        {template.style === 'catalog' && <div className="store-layout store-catalog-layout"><div className="store-catalog-copy"><small>FIELD NOTES / 2026</small><h3>Built for<br /><strong>the outside.</strong></h3><button>Shop the trail</button></div><div className="store-catalog-grid"><i /><i /><i /><i /></div></div>}
        {template.style === 'luxury' && <div className="store-layout store-tech-layout"><div><small>OBJECT 04 / 12</small><h3>Quiet forms<br /><em>lasting value.</em></h3><button>Discover the edit</button></div><div className="store-tech-product"><span>V</span></div></div>}
        {template.style === 'streetwear' && <div className="store-layout store-street-layout"><div><small>SEASON 06 / AFTER DARK</small><h3>For the<br /><em>bold.</em></h3><button>Enter the collection</button></div><div className="store-street-product" /></div>}
        {template.style === 'home' && <div className="store-layout store-home-layout"><div className="store-home-image" /><div><small>THE SLOW HOME</small><h3>Elevate<br /><em>your space.</em></h3><button>Shop the room</button></div></div>}
      </div>
    </div>
  );
}

export default function CommerceShowcase() {
  const [current, setCurrent] = useState(0);
  const [device, setDevice] = useState<Device>('desktop');
  const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
  const selected = TEMPLATES[current];
  const devices: Device[] = ['phone', 'tablet', 'laptop', 'desktop'];

  useEffect(() => {
    if (reduced) return;
    const timer = window.setInterval(() => setCurrent(value => (value + 1) % TEMPLATES.length), 6500);
    return () => window.clearInterval(timer);
  }, [reduced]);

  const move = (direction: number) => setCurrent(value => (value + direction + TEMPLATES.length) % TEMPLATES.length);

  return (
    <div className="commerce-showcase">
      <div className="showcase-toolbar">
        <div className="showcase-devices" role="tablist" aria-label="Preview device">
          {devices.map(item => <button key={item} onClick={() => setDevice(item)} className={device === item ? 'is-active' : ''} role="tab" aria-selected={device === item}>{item}</button>)}
        </div>
        <div className="showcase-controls"><button onClick={() => move(-1)} aria-label="Previous store design"><ChevronLeft size={18} /></button><span>{String(current + 1).padStart(2, '0')} / {String(TEMPLATES.length).padStart(2, '0')}</span><button onClick={() => move(1)} aria-label="Next store design"><ChevronRight size={18} /></button></div>
      </div>
      <div className="showcase-viewport">
        <div className="showcase-track" style={{ transform: `translateX(-${current * 100}%)` }}>
          {TEMPLATES.map(template => <div className="showcase-slide" key={template.name}><StorePreview template={template} device={device} /></div>)}
        </div>
      </div>
      <div className="showcase-caption"><div><span className="showcase-index">{String(current + 1).padStart(2, '0')}</span><div><h3>{selected.name}</h3><p>{selected.platform} · {selected.type} — {selected.description}</p></div></div><ArrowUpRight size={20} /></div>
      <div className="showcase-dots" aria-label="Choose store design">{TEMPLATES.map((template, index) => <button key={template.name} onClick={() => setCurrent(index)} className={index === current ? 'is-active' : ''} aria-label={`Show ${template.name}`} />)}</div>
    </div>
  );
}
