import { useState, useCallback } from 'react';
import {
  ShoppingCart, X, Search, Star, Heart, ChevronRight, Plus, Minus,
  Check, ArrowRight, Menu,
} from 'lucide-react';
import { useHashRoute } from '../lib/router';

// ─── Product data (shared across platform variants) ──────────────────
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

const PRODUCTS: Product[] = [
  { id: 1, name: 'Aurora Wireless Headphones', price: 129.99, compareAt: 179.99, image: 'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=500', rating: 4.8, reviews: 124, badge: 'Bestseller', category: 'Electronics', description: 'Premium wireless headphones with active noise cancellation, 30-hour battery life, and crystal-clear sound quality. Designed for audiophiles and professionals.' },
  { id: 2, name: 'Lumen Smart Watch Pro', price: 199.00, compareAt: 249.00, image: 'https://images.pexels.com/photos/437037/pexels-photo-437037.jpeg?auto=compress&cs=tinysrgb&w=500', rating: 4.9, reviews: 89, badge: 'New', category: 'Electronics', description: 'Advanced smartwatch with health tracking, GPS, heart rate monitor, and 7-day battery life. Water resistant up to 50 meters.' },
  { id: 3, name: 'Terra Leather Backpack', price: 89.50, image: 'https://images.pexels.com/photos/2905238/pexels-photo-2905238.jpeg?auto=compress&cs=tinysrgb&w=500', rating: 4.7, reviews: 56, category: 'Accessories', description: 'Handcrafted genuine leather backpack with laptop compartment, water-resistant lining, and adjustable straps. Perfect for work and travel.' },
  { id: 4, name: 'Vista Polarized Sunglasses', price: 59.99, compareAt: 79.99, image: 'https://images.pexels.com/photos/701877/pexels-photo-701877.jpeg?auto=compress&cs=tinysrgb&w=500', rating: 4.6, reviews: 42, badge: 'Sale', category: 'Accessories', description: 'UV400 protection polarized sunglasses with lightweight titanium frame. Includes premium case and microfiber cloth.' },
  { id: 5, name: 'Nimbus Ceramic Mug Set', price: 34.00, image: 'https://images.pexels.com/photos/2074130/pexels-photo-2074130.jpeg?auto=compress&cs=tinysrgb&w=500', rating: 4.8, reviews: 78, category: 'Home', description: 'Set of 4 handcrafted ceramic mugs with reactive glaze finish. Microwave and dishwasher safe. 12oz capacity each.' },
  { id: 6, name: 'Pulse Fitness Tracker', price: 79.99, compareAt: 99.99, image: 'https://images.pexels.com/photos/4498136/pexels-photo-4498136.jpeg?auto=compress&cs=tinysrgb&w=500', rating: 4.5, reviews: 34, category: 'Electronics', description: 'Slim fitness tracker with 15-day battery, sleep monitoring, and 20+ workout modes. Syncs with iOS and Android.' },
];

type CartItem = { product: Product; qty: number };

type PlatformTheme = {
  name: string;
  headerBg: string;
  accentColor: string;
  buttonColor: string;
  cardStyle: string;
  layout: 'grid' | 'list';
  showFilters: boolean;
};

const THEMES: Record<string, PlatformTheme> = {
  shopify: {
    name: 'Shopify', headerBg: '#1a1a1a', accentColor: '#96bf48', buttonColor: '#96bf48',
    cardStyle: 'rounded-xl', layout: 'grid', showFilters: true,
  },
  wix: {
    name: 'Wix', headerBg: '#0c80ef', accentColor: '#0c80ef', buttonColor: '#0c80ef',
    cardStyle: 'rounded-lg', layout: 'grid', showFilters: true,
  },
  woocommerce: {
    name: 'WooCommerce', headerBg: '#7f54b3', accentColor: '#7f54b3', buttonColor: '#7f54b3',
    cardStyle: 'rounded-md', layout: 'grid', showFilters: true,
  },
  etsy: {
    name: 'Etsy', headerBg: '#f56400', accentColor: '#f56400', buttonColor: '#f56400',
    cardStyle: 'rounded-lg', layout: 'grid', showFilters: true,
  },
  amazon: {
    name: 'Amazon', headerBg: '#131921', accentColor: '#ff9900', buttonColor: '#ff9900',
    cardStyle: 'rounded-md', layout: 'list', showFilters: false,
  },
};

export default function InteractiveStore({ platform }: { platform: string }) {
  const { navigate } = useHashRoute();
  const theme = THEMES[platform] || THEMES.shopify;
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [wishlist, setWishlist] = useState<number[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [qty, setQty] = useState(1);

  const categories = ['All', ...Array.from(new Set(PRODUCTS.map(p => p.category)))];

  const filteredProducts = PRODUCTS.filter(p => {
    if (activeCategory !== 'All' && p.category !== activeCategory) return false;
    if (searchQuery && !p.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

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

  const cartTotal = cart.reduce((sum, i) => sum + i.product.price * i.qty, 0);
  const cartCount = cart.reduce((sum, i) => sum + i.qty, 0);

  const toggleWishlist = (id: number) => setWishlist(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);

  const handleAddFromDetail = () => {
    if (selectedProduct) { addToCart(selectedProduct, qty); setSelectedProduct(null); setQty(1); }
  };

  const isMarketplace = platform === 'etsy' || platform === 'amazon';

  return (
    <div className="rounded-2xl overflow-hidden ring-1 ring-white/10 shadow-lift bg-white" style={{ minHeight: '500px' }}>
      {/* Store Header */}
      <div className="text-white" style={{ background: theme.headerBg }}>
        <div className="flex items-center justify-between px-4 py-3 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded font-bold text-sm" style={{ background: theme.accentColor, color: '#fff' }}>
              {theme.name[0]}
            </div>
            <span className="font-serif text-lg font-semibold">{theme.name} Store</span>
            {isMarketplace && (
              <span className="hidden sm:inline-block text-[10px] px-2 py-0.5 rounded-full bg-white/15">
                Marketplace Experience Demonstration
              </span>
            )}
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5">
              <Search size={14} className="text-white/60" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search products..."
                className="bg-transparent text-sm text-white placeholder:text-white/50 outline-none w-32 sm:w-40"
              />
            </div>
            <button onClick={() => setCartOpen(true)} className="relative flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 text-sm hover:bg-white/20 transition">
              <ShoppingCart size={16} />
              <span className="hidden sm:inline">Cart</span>
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold text-white" style={{ background: theme.accentColor }}>
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
        {/* Nav links */}
        <div className="hidden sm:flex items-center gap-5 px-6 pb-2 text-xs text-white/70">
          <span className="cursor-pointer hover:text-white">Home</span>
          <span className="cursor-pointer hover:text-white">Shop</span>
          <span className="cursor-pointer hover:text-white">Collections</span>
          <span className="cursor-pointer hover:text-white">About</span>
          <span className="cursor-pointer hover:text-white">Contact</span>
        </div>
      </div>

      {/* Mobile search */}
      <div className="sm:hidden bg-white px-4 py-2 border-b border-gray-100">
        <div className="flex items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1.5">
          <Search size={14} className="text-gray-400" />
          <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search..." className="bg-transparent text-sm text-gray-800 outline-none flex-1" />
        </div>
      </div>

      {/* Promo banner */}
      <div className="text-center py-2 text-xs text-white" style={{ background: theme.accentColor }}>
        Free shipping on orders over $50 — Limited time offer
      </div>

      <div className="flex flex-col sm:flex-row">
        {/* Filters sidebar */}
        {theme.showFilters && (
          <aside className="sm:w-44 border-r border-gray-100 p-4 bg-gray-50">
            <p className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">Categories</p>
            <div className="flex sm:flex-col gap-1.5 flex-wrap">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`text-sm px-3 py-1.5 rounded-lg transition text-left ${
                    activeCategory === cat ? 'text-white' : 'text-gray-700 hover:bg-gray-200'
                  }`}
                  style={activeCategory === cat ? { background: theme.accentColor } : {}}
                >
                  {cat}
                </button>
              ))}
            </div>
            {theme.showFilters && (
              <>
                <p className="text-xs font-bold uppercase tracking-wider text-gray-500 mt-5 mb-3 hidden sm:block">Price Range</p>
                <div className="hidden sm:block space-y-1.5">
                  {['Under $50', '$50 - $100', '$100 - $200', '$200+'].map(range => (
                    <label key={range} className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                      <input type="checkbox" className="rounded" /> {range}
                    </label>
                  ))}
                </div>
              </>
            )}
          </aside>
        )}

        {/* Product grid/list */}
        <div className="flex-1 p-4 bg-white">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-gray-600">{filteredProducts.length} products</p>
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <span>Sort:</span>
              <select className="rounded-lg border border-gray-200 px-2 py-1 text-xs outline-none">
                <option>Featured</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
                <option>Top Rated</option>
              </select>
            </div>
          </div>

          {theme.layout === 'list' ? (
            <div className="space-y-3">
              {filteredProducts.map(p => (
                <div key={p.id} className={`flex gap-4 ${theme.cardStyle} border border-gray-100 p-3 hover:shadow-md transition cursor-pointer`} onClick={() => { setSelectedProduct(p); setQty(1); }}>
                  <img src={p.image} alt={p.name} className="h-24 w-24 rounded-lg object-cover shrink-0" />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 text-sm truncate">{p.name}</h3>
                    <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{p.description}</p>
                    <div className="flex items-center gap-1 mt-1">
                      <Star size={12} className="fill-amber-500 text-amber-500" />
                      <span className="text-xs text-gray-600">{p.rating} ({p.reviews})</span>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-baseline gap-1.5">
                        <span className="font-bold text-gray-900 text-base">${p.price.toFixed(2)}</span>
                        {p.compareAt && <span className="text-xs text-gray-400 line-through">${p.compareAt.toFixed(2)}</span>}
                      </div>
                      <button
                        onClick={(e) => { e.stopPropagation(); addToCart(p); }}
                        className="text-xs font-semibold px-3 py-1.5 rounded-lg text-white transition hover:opacity-90"
                        style={{ background: theme.buttonColor }}
                      >
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
              {filteredProducts.map(p => (
                <div key={p.id} className={`group ${theme.cardStyle} border border-gray-100 overflow-hidden hover:shadow-md transition cursor-pointer`} onClick={() => { setSelectedProduct(p); setQty(1); }}>
                  <div className="relative aspect-square overflow-hidden bg-gray-50">
                    <img src={p.image} alt={p.name} className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    {p.badge && (
                      <span className="absolute top-2 left-2 text-[10px] font-bold px-2 py-0.5 rounded-full text-white" style={{ background: theme.accentColor }}>
                        {p.badge}
                      </span>
                    )}
                    <button
                      onClick={(e) => { e.stopPropagation(); toggleWishlist(p.id); }}
                      className="absolute top-2 right-2 flex h-7 w-7 items-center justify-center rounded-full bg-white/80 hover:bg-white transition"
                    >
                      <Heart size={14} className={wishlist.includes(p.id) ? 'fill-red-500 text-red-500' : 'text-gray-500'} />
                    </button>
                  </div>
                  <div className="p-3">
                    <h3 className="font-semibold text-gray-900 text-sm truncate">{p.name}</h3>
                    <div className="flex items-center gap-1 mt-0.5">
                      <Star size={11} className="fill-amber-500 text-amber-500" />
                      <span className="text-[10px] text-gray-500">{p.rating} ({p.reviews})</span>
                    </div>
                    <div className="flex items-baseline gap-1.5 mt-1.5">
                      <span className="font-bold text-gray-900">${p.price.toFixed(2)}</span>
                      {p.compareAt && <span className="text-[10px] text-gray-400 line-through">${p.compareAt.toFixed(2)}</span>}
                    </div>
                    <button
                      onClick={(e) => { e.stopPropagation(); addToCart(p); }}
                      className="mt-2 w-full text-xs font-semibold py-1.5 rounded-lg text-white transition hover:opacity-90"
                      style={{ background: theme.buttonColor }}
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {filteredProducts.length === 0 && (
            <div className="text-center py-16">
              <p className="text-gray-400">No products found matching your search.</p>
            </div>
          )}
        </div>
      </div>

      {/* Cart Drawer */}
      {cartOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-black/50" onClick={() => setCartOpen(false)} />
          <div className="relative w-full max-w-md bg-white h-full overflow-y-auto shadow-2xl animate-fade-in">
            <div className="sticky top-0 bg-white border-b border-gray-100 px-5 py-4 flex items-center justify-between">
              <h3 className="font-serif text-lg font-semibold text-gray-900">Shopping Cart ({cartCount})</h3>
              <button onClick={() => setCartOpen(false)} className="text-gray-400 hover:text-gray-700"><X size={20} /></button>
            </div>
            {cart.length === 0 ? (
              <div className="text-center py-20">
                <ShoppingCart size={40} className="mx-auto text-gray-300" />
                <p className="mt-4 text-gray-500">Your cart is empty</p>
                <button onClick={() => setCartOpen(false)} className="mt-4 text-sm font-semibold" style={{ color: theme.accentColor }}>Continue Shopping</button>
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
                  <button className="w-full py-3 rounded-xl font-semibold text-white transition hover:opacity-90" style={{ background: theme.buttonColor }}>
                    Checkout — ${cartTotal.toFixed(2)}
                  </button>
                  <button onClick={() => setCartOpen(false)} className="w-full text-center text-sm text-gray-500 mt-2">Continue Shopping</button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Product Detail Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60" onClick={() => setSelectedProduct(null)} />
          <div className="relative bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-bounce-in">
            <button onClick={() => setSelectedProduct(null)} className="absolute top-4 right-4 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/80 text-gray-500 hover:text-gray-800"><X size={20} /></button>
            <div className="grid sm:grid-cols-2 gap-0">
              <div className="aspect-square overflow-hidden bg-gray-50">
                <img src={selectedProduct.image} alt={selectedProduct.name} className="h-full w-full object-cover" />
              </div>
              <div className="p-6">
                {selectedProduct.badge && (
                  <span className="inline-block text-[10px] font-bold px-2 py-0.5 rounded-full text-white mb-2" style={{ background: theme.accentColor }}>
                    {selectedProduct.badge}
                  </span>
                )}
                <h2 className="font-serif text-xl font-semibold text-gray-900">{selectedProduct.name}</h2>
                <div className="flex items-center gap-2 mt-1">
                  <div className="flex gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => <Star key={i} size={13} className={i < Math.round(selectedProduct.rating) ? 'fill-amber-500 text-amber-500' : 'text-gray-300'} />)}
                  </div>
                  <span className="text-xs text-gray-500">{selectedProduct.rating} ({selectedProduct.reviews} reviews)</span>
                </div>
                <div className="flex items-baseline gap-2 mt-3">
                  <span className="font-bold text-2xl text-gray-900">${selectedProduct.price.toFixed(2)}</span>
                  {selectedProduct.compareAt && <span className="text-sm text-gray-400 line-through">${selectedProduct.compareAt.toFixed(2)}</span>}
                </div>
                <p className="mt-4 text-sm text-gray-600 leading-relaxed">{selectedProduct.description}</p>
                <div className="mt-4 space-y-1.5">
                  <div className="flex items-center gap-2 text-sm text-gray-700"><Check size={15} style={{ color: theme.accentColor }} /> In stock — ready to ship</div>
                  <div className="flex items-center gap-2 text-sm text-gray-700"><Check size={15} style={{ color: theme.accentColor }} /> Free shipping over $50</div>
                  <div className="flex items-center gap-2 text-sm text-gray-700"><Check size={15} style={{ color: theme.accentColor }} /> 30-day returns</div>
                </div>
                <div className="mt-5 flex items-center gap-3">
                  <div className="flex items-center gap-1 rounded-lg border border-gray-200">
                    <button onClick={() => setQty(q => Math.max(1, q - 1))} className="flex h-9 w-9 items-center justify-center text-gray-600"><Minus size={14} /></button>
                    <span className="w-8 text-center text-sm font-semibold">{qty}</span>
                    <button onClick={() => setQty(q => q + 1)} className="flex h-9 w-9 items-center justify-center text-gray-600"><Plus size={14} /></button>
                  </div>
                  <button onClick={handleAddFromDetail} className="flex-1 py-2.5 rounded-xl font-semibold text-white transition hover:opacity-90" style={{ background: theme.buttonColor }}>
                    Add to Cart — ${(selectedProduct.price * qty).toFixed(2)}
                  </button>
                </div>
                <button onClick={() => { toggleWishlist(selectedProduct.id); }} className="mt-3 flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800">
                  <Heart size={15} className={wishlist.includes(selectedProduct.id) ? 'fill-red-500 text-red-500' : ''} /> {wishlist.includes(selectedProduct.id) ? 'Saved to wishlist' : 'Add to wishlist'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Trust badges */}
      <div className="flex flex-wrap justify-center gap-4 py-3 border-t border-gray-100 bg-gray-50 text-xs text-gray-500">
        <span className="flex items-center gap-1"><Check size={12} /> Secure Checkout</span>
        <span className="flex items-center gap-1"><Check size={12} /> Free Shipping Over $50</span>
        <span className="flex items-center gap-1"><Check size={12} /> 30-Day Returns</span>
        <span className="flex items-center gap-1"><Check size={12} /> 24/7 Support</span>
      </div>
    </div>
  );
}
