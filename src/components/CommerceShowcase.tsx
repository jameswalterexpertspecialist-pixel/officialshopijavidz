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
type Product = { name: string; price: string; rating: string; reviews: number; description: string; image: string };

const PRODUCTS: Record<string, Product[]> = {
  editorial: [
    { name: 'Beauty Gummies', price: '$38', rating: '4.9', reviews: 128, description: 'Berry antioxidant blend for everyday radiance.', image: '/images/Luxury_E-Commerce_Design_Showcase.png' },
    { name: 'Glow Serum', price: '$54', rating: '4.8', reviews: 96, description: 'Botanical hydration with a soft satin finish.', image: '/images/image copy 2.png' },
    { name: 'Daily Ritual Set', price: '$82', rating: '5.0', reviews: 74, description: 'A considered three-step wellness routine.', image: '/images/image copy 3.png' },
  ],
  fashion: [
    { name: 'Velocity Runner', price: '$148', rating: '4.8', reviews: 214, description: 'Lightweight street performance with all-day comfort.', image: '/images/WhatsApp_Image_2026-07-05_at_00.17.36.jpeg' },
    { name: 'Transit Low', price: '$124', rating: '4.7', reviews: 83, description: 'Clean lines and responsive cushioning for city miles.', image: '/images/image.png' },
    { name: 'Core Utility Sock', price: '$24', rating: '4.9', reviews: 61, description: 'Technical knit built for the daily rotation.', image: '/images/image copy.png' },
  ],
  catalog: [
    { name: 'Summit Shell', price: '$210', rating: '4.9', reviews: 152, description: 'Weather-ready protection for unpredictable trails.', image: '/images/world_w.jfif' },
    { name: 'Trail Pack 24L', price: '$96', rating: '4.8', reviews: 117, description: 'Balanced carry with room for the long way around.', image: '/images/world.jfif' },
    { name: 'Field Bottle', price: '$32', rating: '4.6', reviews: 48, description: 'Insulated stainless steel for every adventure.', image: '/images/world_w copy.jfif' },
  ],
  luxury: [
    { name: 'Arc Pendant', price: '$320', rating: '5.0', reviews: 42, description: 'A sculptural pendant hand-finished in warm gold.', image: '/images/image copy 4.png' },
    { name: 'Linea Cuff', price: '$280', rating: '4.9', reviews: 37, description: 'Minimal form, polished edges, lasting presence.', image: '/images/WhatsApp_Image_2026-07-15_at_17.31.14.jpeg' },
    { name: 'No. 04 Studs', price: '$190', rating: '4.8', reviews: 29, description: 'Small architectural details for every occasion.', image: '/images/shopi.jpeg' },
  ],
  streetwear: [
    { name: 'After Dark Hoodie', price: '$118', rating: '4.9', reviews: 187, description: 'Heavyweight cotton with a deliberately oversized cut.', image: '/images/image copy 3.png' },
    { name: 'Signal Cargo', price: '$142', rating: '4.8', reviews: 103, description: 'Utility pockets and a sharp silhouette for night runs.', image: '/images/image copy 2.png' },
    { name: 'Archive Cap', price: '$46', rating: '4.7', reviews: 66, description: 'Low-profile structure with an embroidered mark.', image: '/images/image copy.png' },
  ],
  home: [
    { name: 'Linen Lounge Chair', price: '$540', rating: '4.9', reviews: 88, description: 'Soft natural texture and a frame made to settle in.', image: '/images/image copy 4.png' },
    { name: 'Form Table Lamp', price: '$128', rating: '4.8', reviews: 56, description: 'A warm pool of light for slower evenings.', image: '/images/image copy 3.png' },
    { name: 'Woven Throw', price: '$86', rating: '4.7', reviews: 41, description: 'Textured cotton layering for the quiet corners.', image: '/images/image copy 2.png' },
  ],
};

function ProductRail({ style }: { style: string }) {
  return (
    <div className="store-products" aria-label="Featured products">
      {PRODUCTS[style].map(product => <article className="store-product" key={product.name}><img src={product.image} alt={product.name} /><div className="store-product-copy"><strong>{product.name}</strong><span>{product.description}</span><small><b>{product.rating}</b> ★ <em>({product.reviews})</em></small><b className="store-product-price">{product.price}</b></div></article>)}
    </div>
  );
}

function StorePreview({ template, device }: { template: typeof TEMPLATES[number]; device: Device }) {
  return (
    <div className={`store-device store-device-${device} store-design-${template.style}`} style={{ '--store-accent': template.accent } as CSSProperties}>
      <div className="store-screen">
        <div className="store-topbar"><b>{template.name}</b><span>Shop &nbsp; Collections &nbsp; About &nbsp; Bag</span></div>
        {template.style === 'editorial' && <div className="store-layout store-editorial-layout"><div><small>NEW ARRIVALS / 2026</small><h3>Natural beauty<br /><em>from within.</em></h3><button>Shop now</button></div><div className="store-reference-art" /></div>}
        {template.style === 'fashion' && <div className="store-layout store-fashion-layout"><div className="store-fashion-image" /><div><small>DROP 04 / LIMITED</small><h3>Move<br /><strong>forward.</strong></h3><button>View the drop</button></div></div>}
        {template.style === 'catalog' && <div className="store-layout store-catalog-layout"><div className="store-catalog-copy"><small>FIELD NOTES / 2026</small><h3>Built for<br /><strong>the outside.</strong></h3><button>Shop the trail</button></div><div className="store-catalog-grid"><i /><i /><i /><i /></div></div>}
        {template.style === 'luxury' && <div className="store-layout store-tech-layout"><div><small>OBJECT 04 / 12</small><h3>Quiet forms<br /><em>lasting value.</em></h3><button>Discover the edit</button></div><div className="store-tech-product"><span>V</span></div></div>}
        {template.style === 'streetwear' && <div className="store-layout store-street-layout"><div><small>SEASON 06 / AFTER DARK</small><h3>For the<br /><em>bold.</em></h3><button>Enter the collection</button></div><div className="store-street-product" /></div>}
        {template.style === 'home' && <div className="store-layout store-home-layout"><div className="store-home-image" /><div><small>THE SLOW HOME</small><h3>Elevate<br /><em>your space.</em></h3><button>Shop the room</button></div></div>}
        <ProductRail style={template.style} />
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
