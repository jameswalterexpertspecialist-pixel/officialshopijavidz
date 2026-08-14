import { useState, useCallback } from 'react';
import {
  ShoppingCart, X, Search, Star, Heart, ChevronRight, Plus, Minus,
  Check, ArrowRight, Menu, SlidersHorizontal, Tag, Truck, Shield, RotateCcw,
  Filter, LayoutGrid, List, ChevronDown, Eye,
} from 'lucide-react';

// ─── Shared types ─────────────────────────────────────────────────────
type Product = {
  id: number;
  name: string;
  price: number;
  compareAt?: number;
  image: string;
  rating: number;
  reviews: number;
  badge?: string;
  category: string;
  description: string;
};

type CartItem = { product: Product; qty: number };

// ─── Shared cart logic ────────────────────────────────────────────────
function useCart() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [wishlist, setWishlist] = useState<number[]>([]);

  const addToCart = useCallback((product: Product, quantity = 1) => {
    setCart(prev => {
      const existing = prev.find(i => i.product.id === product.id);
      if (existing) return prev.map(i => i.product.id === product.id ? { ...i, qty: i.qty + quantity } : i);
      return [...prev, { product, qty: quantity }];
    });
    setCartOpen(true);
  }, []);
  const removeFromCart = (id: number) => setCart(prev => prev.filter(i => i.product.id !== id));
  const updateQty = (id: number, delta: number) => setCart(prev => prev.map(i => i.product.id === id ? { ...i, qty: Math.max(1, i.qty + delta) } : i));
  const toggleWishlist = (id: number) => setWishlist(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);

  const cartTotal = cart.reduce((sum, i) => sum + i.product.price * i.qty, 0);
  const cartCount = cart.reduce((sum, i) => sum + i.qty, 0);

  return { cart, cartOpen, setCartOpen, wishlist, toggleWishlist, addToCart, removeFromCart, updateQty, cartTotal, cartCount };
}

// ─── Shared product detail modal ──────────────────────────────────────
function ProductDetail({ product, onClose, onAdd, accentColor }: { product: Product; onClose: () => void; onAdd: (qty: number) => void; accentColor: string }) {
  const [qty, setQty] = useState(1);
  const [saved, setSaved] = useState(false);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-bounce-in">
        <button onClick={onClose} className="absolute top-4 right-4 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/80 text-gray-500 hover:text-gray-800"><X size={20} /></button>
        <div className="grid sm:grid-cols-2 gap-0">
          <div className="aspect-square overflow-hidden bg-gray-50">
            <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
          </div>
          <div className="p-6">
            {product.badge && <span className="inline-block text-[10px] font-bold px-2 py-0.5 rounded-full text-white mb-2" style={{ background: accentColor }}>{product.badge}</span>}
            <h2 className="font-serif text-xl font-semibold text-gray-900">{product.name}</h2>
            <div className="flex items-center gap-2 mt-1">
              <div className="flex gap-0.5">{Array.from({ length: 5 }).map((_, i) => <Star key={i} size={13} className={i < Math.round(product.rating) ? 'fill-amber-500 text-amber-500' : 'text-gray-300'} />)}</div>
              <span className="text-xs text-gray-500">{product.rating} ({product.reviews} reviews)</span>
            </div>
            <div className="flex items-baseline gap-2 mt-3">
              <span className="font-bold text-2xl text-gray-900">${product.price.toFixed(2)}</span>
              {product.compareAt && <span className="text-sm text-gray-400 line-through">${product.compareAt.toFixed(2)}</span>}
            </div>
            <p className="mt-4 text-sm text-gray-600 leading-relaxed">{product.description}</p>
            <div className="mt-4 space-y-1.5">
              <div className="flex items-center gap-2 text-sm text-gray-700"><Check size={15} style={{ color: accentColor }} /> In stock — ready to ship</div>
              <div className="flex items-center gap-2 text-sm text-gray-700"><Truck size={15} style={{ color: accentColor }} /> Free shipping over $50</div>
              <div className="flex items-center gap-2 text-sm text-gray-700"><RotateCcw size={15} style={{ color: accentColor }} /> 30-day returns</div>
            </div>
            <div className="mt-5 flex items-center gap-3">
              <div className="flex items-center gap-1 rounded-lg border border-gray-200">
                <button onClick={() => setQty(q => Math.max(1, q - 1))} className="flex h-9 w-9 items-center justify-center text-gray-600"><Minus size={14} /></button>
                <span className="w-8 text-center text-sm font-semibold">{qty}</span>
                <button onClick={() => setQty(q => q + 1)} className="flex h-9 w-9 items-center justify-center text-gray-600"><Plus size={14} /></button>
              </div>
              <button onClick={() => { onAdd(qty); onClose(); }} className="flex-1 py-2.5 rounded-xl font-semibold text-white transition hover:opacity-90" style={{ background: accentColor }}>
                Add to Cart — ${(product.price * qty).toFixed(2)}
              </button>
            </div>
            <button onClick={() => setSaved(s => !s)} className="mt-3 flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800">
              <Heart size={15} className={saved ? 'fill-red-500 text-red-500' : ''} /> {saved ? 'Saved to wishlist' : 'Add to wishlist'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Shared cart drawer ───────────────────────────────────────────────
function CartDrawer({ cart, cartCount, cartTotal, onClose, removeFromCart, updateQty, accentColor }: {
  cart: CartItem[]; cartCount: number; cartTotal: number; onClose: () => void;
  removeFromCart: (id: number) => void; updateQty: (id: number, d: number) => void; accentColor: string;
}) {
  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md bg-white h-full overflow-y-auto shadow-2xl animate-fade-in">
        <div className="sticky top-0 bg-white border-b border-gray-100 px-5 py-4 flex items-center justify-between">
          <h3 className="font-serif text-lg font-semibold text-gray-900">Shopping Cart ({cartCount})</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700"><X size={20} /></button>
        </div>
        {cart.length === 0 ? (
          <div className="text-center py-20">
            <ShoppingCart size={40} className="mx-auto text-gray-300" />
            <p className="mt-4 text-gray-500">Your cart is empty</p>
            <button onClick={onClose} className="mt-4 text-sm font-semibold" style={{ color: accentColor }}>Continue Shopping</button>
          </div>
        ) : (
          <>
            <div className="px-5 py-4 space-y-4">
              {cart.map(item => (
                <div key={item.product.id} className="flex gap-3">
                  <img src={item.product.image} alt={item.product.name} className="h-16 w-16 rounded-lg object-cover" />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-semibold text-gray-900 truncate">{item.product.name}</h4>
                    <p className="text-sm text-gray-500">${item.product.price.toFixed(2)}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <button onClick={() => updateQty(item.product.id, -1)} className="flex h-6 w-6 items-center justify-center rounded border border-gray-200 text-gray-600"><Minus size={12} /></button>
                      <span className="text-sm font-semibold w-6 text-center">{item.qty}</span>
                      <button onClick={() => updateQty(item.product.id, 1)} className="flex h-6 w-6 items-center justify-center rounded border border-gray-200 text-gray-600"><Plus size={12} /></button>
                      <button onClick={() => removeFromCart(item.product.id)} className="ml-auto text-xs text-gray-400 hover:text-red-500">Remove</button>
                    </div>
                  </div>
                  <span className="font-semibold text-gray-900 text-sm">${(item.product.price * item.qty).toFixed(2)}</span>
                </div>
              ))}
            </div>
            <div className="sticky bottom-0 bg-white border-t border-gray-100 px-5 py-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-bold text-gray-900 text-lg">${cartTotal.toFixed(2)}</span>
              </div>
              <p className="text-xs text-gray-500 mb-3">Shipping and taxes calculated at checkout</p>
              <button className="w-full py-3 rounded-xl font-semibold text-white transition hover:opacity-90" style={{ background: accentColor }}>
                Checkout — ${cartTotal.toFixed(2)}
              </button>
              <button onClick={onClose} className="w-full text-center text-sm text-gray-500 mt-2">Continue Shopping</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════
// SHOPIFY — Premium / luxury DTC brand
// Minimal navigation, large product photography, editorial layout
// ═══════════════════════════════════════════════════════════════════════
const SHOPIFY_PRODUCTS: Product[] = [
  { id: 1, name: 'Aurora Wireless Headphones', price: 129.99, compareAt: 179.99, image: 'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=600', rating: 4.8, reviews: 124, badge: 'Bestseller', category: 'Electronics', description: 'Premium wireless headphones with active noise cancellation, 30-hour battery life, and crystal-clear sound quality.' },
  { id: 2, name: 'Lumen Smart Watch Pro', price: 199.00, compareAt: 249.00, image: 'https://images.pexels.com/photos/437037/pexels-photo-437037.jpeg?auto=compress&cs=tinysrgb&w=600', rating: 4.9, reviews: 89, badge: 'New', category: 'Electronics', description: 'Advanced smartwatch with health tracking, GPS, and 7-day battery life.' },
  { id: 3, name: 'Terra Leather Backpack', price: 89.50, image: 'https://images.pexels.com/photos/2905238/pexels-photo-2905238.jpeg?auto=compress&cs=tinysrgb&w=600', rating: 4.7, reviews: 56, category: 'Accessories', description: 'Handcrafted genuine leather backpack with laptop compartment.' },
  { id: 4, name: 'Vista Polarized Sunglasses', price: 59.99, compareAt: 79.99, image: 'https://images.pexels.com/photos/701877/pexels-photo-701877.jpeg?auto=compress&cs=tinysrgb&w=600', rating: 4.6, reviews: 42, badge: 'Sale', category: 'Accessories', description: 'UV400 protection polarized sunglasses with lightweight titanium frame.' },
];

function ShopifyStore() {
  const cart = useCart();
  const [selected, setSelected] = useState<Product | null>(null);
  const [view, setView] = useState<'home' | 'shop'>('home');

  return (
    <div className="bg-white text-gray-900" style={{ minHeight: '540px' }}>
      {/* Header — minimal luxury */}
      <header className="border-b border-gray-100">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-6">
            <span className="font-serif text-2xl font-light tracking-wide">AURORA<span className="font-semibold">.</span></span>
            <nav className="hidden sm:flex gap-5 text-sm text-gray-600">
              <button onClick={() => setView('home')} className="hover:text-black transition">{view === 'home' ? 'Home' : 'Home'}</button>
              <button onClick={() => setView('shop')} className="hover:text-black transition">Shop</button>
              <span className="hover:text-black transition cursor-pointer">Collections</span>
              <span className="hover:text-black transition cursor-pointer">About</span>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <Search size={16} className="text-gray-500 cursor-pointer" />
            <button onClick={() => cart.setCartOpen(true)} className="relative flex items-center gap-1.5 text-sm">
              <ShoppingCart size={16} /> Cart
              {cart.cartCount > 0 && <span className="absolute -top-2 -right-2 flex h-4 w-4 items-center justify-center rounded-full text-[9px] font-bold text-white bg-black">{cart.cartCount}</span>}
            </button>
          </div>
        </div>
      </header>

      {view === 'home' ? (
        <>
          {/* Editorial hero */}
          <div className="relative h-48 sm:h-56 overflow-hidden">
            <img src="https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=1200" alt="" className="h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-0 left-0 p-6 sm:p-8 text-white">
              <p className="text-[10px] uppercase tracking-[0.3em] mb-1">New Season</p>
              <h1 className="font-serif text-2xl sm:text-3xl font-light">Sound, Redefined</h1>
              <button onClick={() => setView('shop')} className="mt-3 inline-flex items-center gap-1 text-sm border-b border-white pb-0.5 hover:gap-2 transition-all">Discover Collection <ArrowRight size={14} /></button>
            </div>
          </div>

          {/* Featured — large editorial cards */}
          <div className="px-6 py-6">
            <div className="flex items-baseline justify-between mb-4">
              <h2 className="font-serif text-xl font-light">Featured</h2>
              <button onClick={() => setView('shop')} className="text-xs text-gray-500 hover:text-black transition">View all →</button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {SHOPIFY_PRODUCTS.slice(0, 2).map(p => (
                <div key={p.id} className="group cursor-pointer" onClick={() => { setSelected(p); }}>
                  <div className="relative aspect-[4/5] overflow-hidden bg-gray-50">
                    <img src={p.image} alt={p.name} className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-700" />
                    {p.badge && <span className="absolute top-3 left-3 text-[9px] font-medium uppercase tracking-wider px-2 py-1 bg-white/90 backdrop-blur">{p.badge}</span>}
                  </div>
                  <div className="mt-3 text-center">
                    <h3 className="text-sm font-medium text-gray-900">{p.name}</h3>
                    <p className="text-xs text-gray-500 mt-0.5">${p.price.toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bestsellers row */}
          <div className="px-6 pb-6">
            <h2 className="font-serif text-xl font-light mb-4">Bestsellers</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {SHOPIFY_PRODUCTS.map(p => (
                <div key={p.id} className="group cursor-pointer" onClick={() => setSelected(p)}>
                  <div className="relative aspect-square overflow-hidden bg-gray-50 rounded-lg">
                    <img src={p.image} alt={p.name} className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <button onClick={(e) => { e.stopPropagation(); cart.addToCart(p); }} className="absolute bottom-2 right-2 flex h-8 w-8 items-center justify-center rounded-full bg-black text-white opacity-0 group-hover:opacity-100 transition"><ShoppingCart size={14} /></button>
                  </div>
                  <h3 className="text-xs font-medium text-gray-900 mt-2 truncate">{p.name}</h3>
                  <p className="text-xs text-gray-500">${p.price.toFixed(2)}</p>
                </div>
              ))}
            </div>
          </div>
        </>
      ) : (
        <div className="px-6 py-6">
          <div className="flex items-baseline justify-between mb-5">
            <h2 className="font-serif text-xl font-light">All Products</h2>
            <button onClick={() => setView('home')} className="text-xs text-gray-500 hover:text-black transition">← Back to home</button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {SHOPIFY_PRODUCTS.map(p => (
              <div key={p.id} className="group cursor-pointer" onClick={() => setSelected(p)}>
                <div className="relative aspect-[4/5] overflow-hidden bg-gray-50 rounded-lg">
                  <img src={p.image} alt={p.name} className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  {p.badge && <span className="absolute top-3 left-3 text-[9px] font-medium uppercase tracking-wider px-2 py-1 bg-white/90">{p.badge}</span>}
                  <button onClick={(e) => { e.stopPropagation(); cart.addToCart(p); }} className="absolute bottom-2 right-2 flex h-8 w-8 items-center justify-center rounded-full bg-black text-white opacity-0 group-hover:opacity-100 transition"><ShoppingCart size={14} /></button>
                </div>
                <div className="mt-2">
                  <h3 className="text-sm font-medium text-gray-900">{p.name}</h3>
                  <div className="flex items-center gap-1 mt-0.5"><Star size={10} className="fill-amber-500 text-amber-500" /><span className="text-[10px] text-gray-500">{p.rating}</span></div>
                  <p className="text-sm text-gray-700 mt-0.5">${p.price.toFixed(2)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Trust bar */}
      <div className="border-t border-gray-100 px-6 py-4 flex flex-wrap justify-center gap-6 text-[10px] text-gray-500">
        <span className="flex items-center gap-1"><Truck size={12} /> Free Worldwide Shipping</span>
        <span className="flex items-center gap-1"><Shield size={12} /> Secure Checkout</span>
        <span className="flex items-center gap-1"><RotateCcw size={12} /> 30-Day Returns</span>
      </div>

      {selected && <ProductDetail product={selected} onClose={() => setSelected(null)} onAdd={(q) => cart.addToCart(selected, q)} accentColor="#000000" />}
      {cart.cartOpen && <CartDrawer cart={cart.cart} cartCount={cart.cartCount} cartTotal={cart.cartTotal} onClose={() => cart.setCartOpen(false)} removeFromCart={cart.removeFromCart} updateQty={cart.updateQty} accentColor="#000000" />}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════
// WIX — Creative / colorful / lifestyle brand
// Asymmetrical layout, bold typography, expressive sections
// ═══════════════════════════════════════════════════════════════════════
const WIX_PRODUCTS: Product[] = [
  { id: 10, name: 'Sunset Ceramic Vase', price: 42.00, image: 'https://images.pexels.com/photos/2074130/pexels-photo-2074130.jpeg?auto=compress&cs=tinysrgb&w=600', rating: 4.8, reviews: 78, badge: 'Handmade', category: 'Home', description: 'Handcrafted ceramic vase with reactive glaze. Each piece is unique.' },
  { id: 11, name: 'Boho Macrame Wall Art', price: 65.00, image: 'https://images.pexels.com/photos/6102162/pexels-photo-6102162.jpeg?auto=compress&cs=tinysrgb&w=600', rating: 4.9, reviews: 45, badge: 'Trending', category: 'Home', description: 'Handwoven macrame wall hanging made from organic cotton rope.' },
  { id: 12, name: 'Essential Oil Diffuser', price: 38.50, compareAt: 55.00, image: 'https://images.pexels.com/photos/4202325/pexels-photo-4202325.jpeg?auto=compress&cs=tinysrgb&w=600', rating: 4.7, reviews: 92, category: 'Wellness', description: 'Bamboo essential oil diffuser with 7-color LED light.' },
  { id: 13, name: 'Linen Throw Pillow', price: 28.00, image: 'https://images.pexels.com/photos/1248583/pexels-photo-1248583.jpeg?auto=compress&cs=tinysrgb&w=600', rating: 4.6, reviews: 34, category: 'Home', description: '100% linen throw pillow with hidden zipper. Multiple colors.' },
];

function WixStore() {
  const cart = useCart();
  const [selected, setSelected] = useState<Product | null>(null);
  const [filter, setFilter] = useState('All');
  const cats = ['All', 'Home', 'Wellness'];
  const filtered = filter === 'All' ? WIX_PRODUCTS : WIX_PRODUCTS.filter(p => p.category === filter);

  return (
    <div className="bg-gradient-to-br from-rose-50 via-white to-amber-50 text-gray-900" style={{ minHeight: '540px' }}>
      {/* Header — bold, colorful */}
      <header className="bg-gradient-to-r from-rose-500 to-orange-400 text-white">
        <div className="flex items-center justify-between px-6 py-3">
          <span className="font-serif text-xl font-bold tracking-tight">Lifestyle&Co</span>
          <nav className="hidden sm:flex gap-4 text-sm font-medium">
            <span className="cursor-pointer hover:underline">Home</span>
            <span className="cursor-pointer hover:underline">Shop</span>
            <span className="cursor-pointer hover:underline">Journal</span>
            <span className="cursor-pointer hover:underline">About</span>
          </nav>
          <button onClick={() => cart.setCartOpen(true)} className="relative flex items-center gap-1.5 text-sm">
            <ShoppingCart size={16} /> <span className="hidden sm:inline">Bag</span>
            {cart.cartCount > 0 && <span className="absolute -top-2 -right-2 flex h-4 w-4 items-center justify-center rounded-full text-[9px] font-bold text-rose-500 bg-white">{cart.cartCount}</span>}
          </button>
        </div>
      </header>

      {/* Creative hero — asymmetrical */}
      <div className="grid sm:grid-cols-2 gap-0">
        <div className="p-6 sm:p-8 sm:pr-4 flex flex-col justify-center">
          <p className="text-[10px] uppercase tracking-[0.3em] text-rose-500 font-bold mb-2">New Collection</p>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold leading-tight">Make Your Space<br/><span className="text-rose-500 italic">Feel Alive</span></h1>
          <p className="text-sm text-gray-600 mt-3 max-w-xs">Handcrafted home goods designed to bring warmth and personality to every room.</p>
          <button onClick={() => document.getElementById('wix-products')?.scrollIntoView({ behavior: 'smooth' })} className="mt-4 inline-flex items-center gap-2 rounded-full bg-rose-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-rose-600 transition w-fit">
            Shop Collection <ArrowRight size={14} />
          </button>
        </div>
        <div className="relative h-44 sm:h-auto overflow-hidden">
          <img src="https://images.pexels.com/photos/6102162/pexels-photo-6102162.jpeg?auto=compress&cs=tinysrgb&w=800" alt="" className="h-full w-full object-cover" />
        </div>
      </div>

      {/* Filter pills — creative style */}
      <div id="wix-products" className="px-6 pt-6">
        <div className="flex gap-2 mb-4">
          {cats.map(c => (
            <button key={c} onClick={() => setFilter(c)} className={`px-4 py-1.5 rounded-full text-sm font-medium transition ${filter === c ? 'bg-rose-500 text-white' : 'bg-white text-gray-600 ring-1 ring-rose-200 hover:bg-rose-50'}`}>{c}</button>
          ))}
        </div>
      </div>

      {/* Products — asymmetrical grid with varying sizes */}
      <div className="px-6 pb-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {filtered.map((p, i) => (
            <div key={p.id} className={`group cursor-pointer ${i === 0 ? 'col-span-2 lg:col-span-2' : ''}`} onClick={() => setSelected(p)}>
              <div className={`relative overflow-hidden rounded-2xl bg-white ${i === 0 ? 'aspect-[16/10]' : 'aspect-square'}`}>
                <img src={p.image} alt={p.name} className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500" />
                {p.badge && <span className="absolute top-2 left-2 text-[9px] font-bold uppercase px-2 py-1 rounded-full bg-rose-500 text-white">{p.badge}</span>}
                <button onClick={(e) => { e.stopPropagation(); cart.addToCart(p); }} className="absolute bottom-2 right-2 flex h-8 w-8 items-center justify-center rounded-full bg-white text-rose-500 shadow-md opacity-0 group-hover:opacity-100 transition"><ShoppingCart size={14} /></button>
              </div>
              <div className="mt-2">
                <h3 className="text-sm font-semibold text-gray-900">{p.name}</h3>
                <div className="flex items-center justify-between mt-0.5">
                  <span className="text-sm text-rose-500 font-bold">${p.price.toFixed(2)}</span>
                  <div className="flex items-center gap-0.5"><Star size={10} className="fill-amber-500 text-amber-500" /><span className="text-[10px] text-gray-500">{p.rating}</span></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Editorial banner */}
      <div className="mx-6 mb-6 rounded-2xl bg-gradient-to-r from-rose-500 to-orange-400 p-5 text-white flex items-center justify-between">
        <div>
          <p className="font-serif text-lg font-bold">Join Our Creative Community</p>
          <p className="text-xs text-white/80">Get 15% off your first order</p>
        </div>
        <button className="rounded-full bg-white text-rose-500 px-4 py-2 text-xs font-bold hover:bg-rose-50 transition">Subscribe</button>
      </div>

      {selected && <ProductDetail product={selected} onClose={() => setSelected(null)} onAdd={(q) => cart.addToCart(selected, q)} accentColor="#f43f5e" />}
      {cart.cartOpen && <CartDrawer cart={cart.cart} cartCount={cart.cartCount} cartTotal={cart.cartTotal} onClose={() => cart.setCartOpen(false)} removeFromCart={cart.removeFromCart} updateQty={cart.updateQty} accentColor="#f43f5e" />}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════
// WOOCOMMERCE — Professional / structured / retail catalogue
// Sidebar filters, structured grid, trust badges, reviews
// ═══════════════════════════════════════════════════════════════════════
const WOO_PRODUCTS: Product[] = [
  { id: 20, name: 'Industrial Steel Shelving', price: 149.00, compareAt: 199.00, image: 'https://images.pexels.com/photos/2762247/pexels-photo-2762247.jpeg?auto=compress&cs=tinysrgb&w=600', rating: 4.7, reviews: 156, badge: '-25%', category: 'Furniture', description: 'Heavy-duty steel shelving unit. 5 tiers. Holds up to 200kg per shelf.' },
  { id: 21, name: 'Ergonomic Office Chair', price: 289.00, image: 'https://images.pexels.com/photos/1959074/pexels-photo-1959074.jpeg?auto=compress&cs=tinysrgb&w=600', rating: 4.8, reviews: 203, badge: 'Top Rated', category: 'Furniture', description: 'Mesh back ergonomic chair with lumbar support and adjustable armrests.' },
  { id: 22, name: 'LED Desk Lamp Pro', price: 45.99, compareAt: 59.99, image: 'https://images.pexels.com/photos/1112597/pexels-photo-1112597.jpeg?auto=compress&cs=tinysrgb&w=600', rating: 4.6, reviews: 87, category: 'Lighting', description: 'Adjustable LED desk lamp with 5 brightness levels and USB charging port.' },
  { id: 23, name: 'Bamboo Desk Organizer', price: 32.50, image: 'https://images.pexels.com/photos/667838/pexels-photo-667838.jpeg?auto=compress&cs=tinysrgb&w=600', rating: 4.5, reviews: 64, category: 'Accessories', description: 'Natural bamboo desk organizer with phone stand and pen holder.' },
  { id: 24, name: 'Standing Desk Converter', price: 199.00, compareAt: 259.00, image: 'https://images.pexels.com/photos/3801929/pexels-photo-3801929.jpeg?auto=compress&cs=tinysrgb&w=600', rating: 4.7, reviews: 112, badge: 'Sale', category: 'Furniture', description: 'Gas spring standing desk converter. Adjusts from sit to stand in seconds.' },
  { id: 25, name: 'Wireless Charging Pad', price: 24.99, image: 'https://images.pexels.com/photos/4526473/pexels-photo-4526473.jpeg?auto=compress&cs=tinysrgb&w=600', rating: 4.4, reviews: 51, category: 'Electronics', description: '10W fast wireless charging pad. Compatible with Qi-enabled devices.' },
];

function WooCommerceStore() {
  const cart = useCart();
  const [selected, setSelected] = useState<Product | null>(null);
  const [activeCat, setActiveCat] = useState('All');
  const [sortBy, setSortBy] = useState('featured');
  const [showFilters, setShowFilters] = useState(false);

  const cats = ['All', 'Furniture', 'Lighting', 'Accessories', 'Electronics'];
  let filtered = activeCat === 'All' ? WOO_PRODUCTS : WOO_PRODUCTS.filter(p => p.category === activeCat);
  if (sortBy === 'low') filtered = [...filtered].sort((a, b) => a.price - b.price);
  if (sortBy === 'high') filtered = [...filtered].sort((a, b) => b.price - a.price);
  if (sortBy === 'rating') filtered = [...filtered].sort((a, b) => b.rating - a.rating);

  return (
    <div className="bg-slate-50 text-gray-900" style={{ minHeight: '540px' }}>
      {/* Header — structured retail */}
      <header className="bg-white border-b border-gray-200">
        <div className="flex items-center justify-between px-6 py-3">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded bg-purple-700 text-white font-bold text-xs">W</div>
            <span className="font-sans text-lg font-bold text-purple-900">WorkSpace Pro</span>
          </div>
          <div className="hidden sm:flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-1.5 flex-1 max-w-xs mx-4">
            <Search size={14} className="text-gray-400" />
            <input type="text" placeholder="Search products..." className="bg-transparent text-sm outline-none flex-1" />
          </div>
          <button onClick={() => cart.setCartOpen(true)} className="relative flex items-center gap-1.5 text-sm font-medium">
            <ShoppingCart size={16} /> <span className="hidden sm:inline">Cart</span>
            {cart.cartCount > 0 && <span className="absolute -top-2 -right-2 flex h-4 w-4 items-center justify-center rounded-full text-[9px] font-bold text-white bg-purple-700">{cart.cartCount}</span>}
          </button>
        </div>
        <nav className="flex items-center gap-4 px-6 py-2 text-sm text-gray-600 border-t border-gray-100 overflow-x-auto">
          {cats.map(c => (
            <button key={c} onClick={() => setActiveCat(c)} className={`whitespace-nowrap font-medium transition ${activeCat === c ? 'text-purple-700' : 'hover:text-purple-700'}`}>{c}</button>
          ))}
        </nav>
      </header>

      {/* Breadcrumb + result count */}
      <div className="px-6 py-3 flex items-center justify-between text-xs text-gray-500">
        <span>Home / Shop {activeCat !== 'All' && `/ ${activeCat}`}</span>
        <div className="flex items-center gap-3">
          <button onClick={() => setShowFilters(!showFilters)} className="flex items-center gap-1 font-medium text-gray-700 sm:hidden"><Filter size={12} /> Filters</button>
          <select value={sortBy} onChange={e => setSortBy(e.target.value)} className="rounded-md border border-gray-200 px-2 py-1 text-xs outline-none">
            <option value="featured">Sort by: Featured</option>
            <option value="low">Price: Low to High</option>
            <option value="high">Price: High to Low</option>
            <option value="rating">Top Rated</option>
          </select>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row">
        {/* Sidebar filters */}
        <aside className={`${showFilters ? 'block' : 'hidden'} sm:block w-full sm:w-48 shrink-0 p-4 bg-white border-r border-gray-100`}>
          <p className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">Categories</p>
          <div className="space-y-1.5 mb-5">
            {cats.map(c => (
              <button key={c} onClick={() => setActiveCat(c)} className={`block w-full text-left text-sm px-3 py-1.5 rounded-lg transition ${activeCat === c ? 'bg-purple-100 text-purple-700 font-medium' : 'text-gray-700 hover:bg-gray-100'}`}>{c}</button>
            ))}
          </div>
          <p className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">Price Range</p>
          <div className="space-y-1.5 mb-5">
            {['Under $50', '$50 - $150', '$150 - $300', '$300+'].map(r => (
              <label key={r} className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer"><input type="checkbox" className="rounded" /> {r}</label>
            ))}
          </div>
          <p className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">Availability</p>
          <div className="space-y-1.5">
            <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer"><input type="checkbox" className="rounded" defaultChecked /> In stock</label>
            <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer"><input type="checkbox" className="rounded" /> On sale</label>
          </div>
        </aside>

        {/* Product grid — structured retail cards */}
        <div className="flex-1 p-4">
          <p className="text-sm text-gray-600 mb-3">{filtered.length} products</p>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
            {filtered.map(p => (
              <div key={p.id} className="group bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition cursor-pointer" onClick={() => setSelected(p)}>
                <div className="relative aspect-square overflow-hidden bg-gray-50">
                  <img src={p.image} alt={p.name} className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  {p.badge && <span className={`absolute top-2 left-2 text-[9px] font-bold px-2 py-0.5 rounded ${p.badge.includes('%') ? 'bg-red-500 text-white' : 'bg-purple-700 text-white'}`}>{p.badge}</span>}
                  <button onClick={(e) => { e.stopPropagation(); cart.addToCart(p); }} className="absolute bottom-2 right-2 flex h-8 w-8 items-center justify-center rounded-lg bg-purple-700 text-white shadow opacity-0 group-hover:opacity-100 transition"><ShoppingCart size={14} /></button>
                </div>
                <div className="p-3">
                  <p className="text-[10px] text-purple-600 uppercase tracking-wider mb-0.5">{p.category}</p>
                  <h3 className="text-sm font-semibold text-gray-900 line-clamp-2 leading-snug">{p.name}</h3>
                  <div className="flex items-center gap-1 mt-1">
                    <div className="flex gap-0.5">{Array.from({ length: 5 }).map((_, i) => <Star key={i} size={9} className={i < Math.round(p.rating) ? 'fill-amber-500 text-amber-500' : 'text-gray-300'} />)}</div>
                    <span className="text-[10px] text-gray-500">({p.reviews})</span>
                  </div>
                  <div className="flex items-baseline gap-1.5 mt-2">
                    <span className="font-bold text-gray-900">${p.price.toFixed(2)}</span>
                    {p.compareAt && <span className="text-xs text-gray-400 line-through">${p.compareAt.toFixed(2)}</span>}
                  </div>
                  <button onClick={(e) => { e.stopPropagation(); cart.addToCart(p); }} className="mt-2 w-full py-1.5 rounded-md text-xs font-semibold text-white bg-purple-700 hover:bg-purple-800 transition">Add to Cart</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Trust badges */}
      <div className="border-t border-gray-200 bg-white px-6 py-4 grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
        <div className="flex flex-col items-center gap-1"><Truck size={18} className="text-purple-700" /><span className="text-[10px] text-gray-600">Fast Shipping</span></div>
        <div className="flex flex-col items-center gap-1"><Shield size={18} className="text-purple-700" /><span className="text-[10px] text-gray-600">Secure Payment</span></div>
        <div className="flex flex-col items-center gap-1"><RotateCcw size={18} className="text-purple-700" /><span className="text-[10px] text-gray-600">Easy Returns</span></div>
        <div className="flex flex-col items-center gap-1"><Check size={18} className="text-purple-700" /><span className="text-[10px] text-gray-600">Quality Guaranteed</span></div>
      </div>

      {selected && <ProductDetail product={selected} onClose={() => setSelected(null)} onAdd={(q) => cart.addToCart(selected, q)} accentColor="#7f54b3" />}
      {cart.cartOpen && <CartDrawer cart={cart.cart} cartCount={cart.cartCount} cartTotal={cart.cartTotal} onClose={() => cart.setCartOpen(false)} removeFromCart={cart.removeFromCart} updateQty={cart.updateQty} accentColor="#7f54b3" />}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════
// ETSY — Marketplace / handmade / creative
// ═══════════════════════════════════════════════════════════════════════
const ETSY_PRODUCTS: Product[] = [
  { id: 30, name: 'Personalized Birth Flower Necklace', price: 34.50, image: 'https://images.pexels.com/photos/1454171/pexels-photo-1454171.jpeg?auto=compress&cs=tinysrgb&w=600', rating: 4.9, reviews: 1247, badge: 'Bestseller', category: 'Jewelry', description: 'Hand-stamped birth flower necklace. Sterling silver or gold plated.' },
  { id: 31, name: 'Custom Watercolor Pet Portrait', price: 45.00, image: 'https://images.pexels.com/photos/2598024/pexels-photo-2598024.jpeg?auto=compress&cs=tinysrgb&w=600', rating: 5.0, reviews: 892, badge: 'Unique', category: 'Art', description: 'Custom watercolor portrait of your pet from a photo. Digital or printed.' },
  { id: 32, name: 'Handwoven Basket Set', price: 58.00, image: 'https://images.pexels.com/photos/4207791/pexels-photo-4207791.jpeg?auto=compress&cs=tinysrgb&w=600', rating: 4.8, reviews: 334, category: 'Home', description: 'Set of 3 handwoven seagrass baskets. Fair trade, eco-friendly.' },
  { id: 33, name: 'Vintage Leather Journal', price: 28.00, image: 'https://images.pexels.com/photos/1375042/pexels-photo-1375042.jpeg?auto=compress&cs=tinysrgb&w=600', rating: 4.7, reviews: 567, category: 'Stationery', description: 'Handmade leather journal with 200 unlined pages. Refillable.' },
];

function EtsyStore() {
  const cart = useCart();
  const [selected, setSelected] = useState<Product | null>(null);

  return (
    <div className="bg-orange-50/30 text-gray-900" style={{ minHeight: '540px' }}>
      <header className="bg-white border-b border-orange-100">
        <div className="flex items-center justify-between px-6 py-3">
          <div className="flex items-center gap-2">
            <span className="font-serif text-xl font-bold text-orange-600">Crafted</span>
            <span className="hidden sm:inline-block text-[10px] px-2 py-0.5 rounded-full bg-orange-100 text-orange-700">Marketplace Experience Demo</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-1.5 rounded-full bg-orange-50 px-3 py-1.5"><Search size={14} className="text-orange-400" /><input type="text" placeholder="Search handmade..." className="bg-transparent text-sm outline-none w-28" /></div>
            <button onClick={() => cart.setCartOpen(true)} className="relative flex items-center gap-1.5 text-sm"><ShoppingCart size={16} /> <span className="hidden sm:inline">Cart</span>{cart.cartCount > 0 && <span className="absolute -top-2 -right-2 flex h-4 w-4 items-center justify-center rounded-full text-[9px] font-bold text-white bg-orange-600">{cart.cartCount}</span>}</button>
          </div>
        </div>
      </header>

      <div className="px-6 py-4">
        <p className="text-[10px] uppercase tracking-[0.2em] text-orange-600 font-bold mb-1">Handmade & Unique</p>
        <h2 className="font-serif text-2xl font-bold mb-4">Discover One-of-a-Kind Pieces</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {ETSY_PRODUCTS.map(p => (
            <div key={p.id} className="group cursor-pointer" onClick={() => setSelected(p)}>
              <div className="relative aspect-square overflow-hidden rounded-xl bg-white">
                <img src={p.image} alt={p.name} className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500" />
                {p.badge && <span className="absolute top-2 left-2 text-[9px] font-bold px-2 py-0.5 rounded-full bg-orange-600 text-white">{p.badge}</span>}
                <button onClick={(e) => { e.stopPropagation(); cart.addToCart(p); }} className="absolute bottom-2 right-2 flex h-8 w-8 items-center justify-center rounded-full bg-white text-orange-600 shadow opacity-0 group-hover:opacity-100 transition"><ShoppingCart size={14} /></button>
              </div>
              <div className="mt-2">
                <h3 className="text-xs font-semibold text-gray-900 line-clamp-2 leading-snug">{p.name}</h3>
                <p className="text-[10px] text-gray-500 mt-0.5">StudioCraftCo</p>
                <div className="flex items-center gap-1 mt-0.5"><Star size={10} className="fill-orange-500 text-orange-500" /><span className="text-[10px] text-gray-600">{p.rating} ({p.reviews})</span></div>
                <p className="text-sm font-bold text-orange-700 mt-0.5">${p.price.toFixed(2)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {selected && <ProductDetail product={selected} onClose={() => setSelected(null)} onAdd={(q) => cart.addToCart(selected, q)} accentColor="#f56400" />}
      {cart.cartOpen && <CartDrawer cart={cart.cart} cartCount={cart.cartCount} cartTotal={cart.cartTotal} onClose={() => cart.setCartOpen(false)} removeFromCart={cart.removeFromCart} updateQty={cart.updateQty} accentColor="#f56400" />}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════
// AMAZON — Marketplace / product-focused list layout
// ═══════════════════════════════════════════════════════════════════════
const AMAZON_PRODUCTS: Product[] = [
  { id: 40, name: 'Noise-Cancelling Bluetooth Earbuds', price: 49.99, compareAt: 79.99, image: 'https://images.pexels.com/photos/3780681/pexels-photo-3780681.jpeg?auto=compress&cs=tinysrgb&w=600', rating: 4.3, reviews: 18432, badge: "Amazon's Choice", category: 'Electronics', description: 'Wireless earbuds with active noise cancellation and 24-hour battery.' },
  { id: 41, name: 'Stainless Steel Watch', price: 89.00, compareAt: 129.00, image: 'https://images.pexels.com/photos/277390/pexels-photo-277390.jpeg?auto=compress&cs=tinysrgb&w=600', rating: 4.5, reviews: 8721, badge: 'Deal', category: 'Accessories', description: 'Minimalist stainless steel watch with Japanese movement.' },
  { id: 42, name: 'Portable Bluetooth Speaker', price: 29.99, image: 'https://images.pexels.com/photos/1666816/pexels-photo-1666816.jpeg?auto=compress&cs=tinysrgb&w=600', rating: 4.2, reviews: 24561, badge: 'Best Seller', category: 'Electronics', description: 'IPX7 waterproof speaker with 12-hour battery and deep bass.' },
];

function AmazonStore() {
  const cart = useCart();
  const [selected, setSelected] = useState<Product | null>(null);

  return (
    <div className="bg-white text-gray-900" style={{ minHeight: '540px' }}>
      <header className="bg-gray-900 text-white">
        <div className="flex items-center justify-between px-6 py-2">
          <div className="flex items-center gap-3">
            <span className="font-sans text-lg font-bold">ShopMart</span>
            <span className="hidden sm:inline-block text-[10px] px-2 py-0.5 rounded bg-gray-700 text-gray-300">Marketplace Experience Demo</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-1.5 rounded-lg bg-white text-gray-900 px-2 py-1.5 flex-1 max-w-xs"><Search size={14} className="text-gray-400" /><input type="text" placeholder="Search products..." className="bg-transparent text-sm outline-none flex-1" /><button className="bg-amber-500 px-2 py-1 rounded text-xs font-bold">Go</button></div>
            <button onClick={() => cart.setCartOpen(true)} className="relative flex items-center gap-1.5 text-sm"><ShoppingCart size={16} /> <span className="hidden sm:inline">Cart</span>{cart.cartCount > 0 && <span className="absolute -top-2 -right-2 flex h-4 w-4 items-center justify-center rounded-full text-[9px] font-bold text-gray-900 bg-amber-400">{cart.cartCount}</span>}</button>
          </div>
        </div>
      </header>

      <div className="px-6 py-4">
        <p className="text-xs text-gray-500 mb-3"><span className="font-semibold text-gray-700">Today's Deals</span> in Electronics</p>
        <div className="space-y-3">
          {AMAZON_PRODUCTS.map(p => (
            <div key={p.id} className="group flex gap-4 bg-white border border-gray-200 rounded-lg p-3 hover:shadow-md transition cursor-pointer" onClick={() => setSelected(p)}>
              <img src={p.image} alt={p.name} className="h-24 w-24 rounded-lg object-cover shrink-0" />
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-sm text-blue-900 hover:text-orange-600 line-clamp-2">{p.name}</h3>
                <div className="flex items-center gap-1 mt-1">
                  <span className="text-xs font-bold text-orange-600">{p.rating}</span>
                  <div className="flex gap-0.5">{Array.from({ length: 5 }).map((_, i) => <Star key={i} size={10} className={i < Math.round(p.rating) ? 'fill-orange-500 text-orange-500' : 'text-gray-300'} />)}</div>
                  <span className="text-xs text-blue-600 hover:underline">{p.reviews.toLocaleString()}</span>
                </div>
                {p.badge && <span className="inline-block mt-1 text-[9px] font-bold px-1.5 py-0.5 rounded bg-orange-100 text-orange-800 border border-orange-300">{p.badge}</span>}
                <p className="text-xs text-gray-600 mt-1 line-clamp-2">{p.description}</p>
                <div className="flex items-center justify-between mt-2">
                  <div className="flex items-baseline gap-1.5">
                    <span className="font-bold text-xl text-gray-900">${p.price.toFixed(2)}</span>
                    {p.compareAt && <span className="text-xs text-gray-400 line-through">${p.compareAt.toFixed(2)}</span>}
                  </div>
                  <button onClick={(e) => { e.stopPropagation(); cart.addToCart(p); }} className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-amber-500 text-gray-900 hover:bg-amber-400 transition">Add to Cart</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {selected && <ProductDetail product={selected} onClose={() => setSelected(null)} onAdd={(q) => cart.addToCart(selected, q)} accentColor="#ff9900" />}
      {cart.cartOpen && <CartDrawer cart={cart.cart} cartCount={cart.cartCount} cartTotal={cart.cartTotal} onClose={() => cart.setCartOpen(false)} removeFromCart={cart.removeFromCart} updateQty={cart.updateQty} accentColor="#ff9900" />}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════
// Main export — renders the correct platform demo
// ═══════════════════════════════════════════════════════════════════════
export default function InteractiveStore({ platform }: { platform: string }) {
  const wrapper = "rounded-2xl overflow-hidden ring-1 ring-white/10 shadow-lift";

  if (platform === 'shopify') return <div className={wrapper}><ShopifyStore /></div>;
  if (platform === 'wix') return <div className={wrapper}><WixStore /></div>;
  if (platform === 'woocommerce') return <div className={wrapper}><WooCommerceStore /></div>;
  if (platform === 'etsy') return <div className={wrapper}><EtsyStore /></div>;
  if (platform === 'amazon') return <div className={wrapper}><AmazonStore /></div>;
  return <div className={wrapper}><ShopifyStore /></div>;
}
