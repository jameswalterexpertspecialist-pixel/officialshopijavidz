import { Smartphone, Tablet, Monitor, Tv } from 'lucide-react';

function ScreenContent({ variant }: { variant: string }) {
  if (variant === 'phone') {
    return (
      <div className="dm-screen-content">
        <div className="dm-nav"><b>Shop</b><i /></div>
        <div className="dm-hero"><span>NEW<br />DROP</span></div>
        <div className="dm-grid"><div /><div /><div /><div /></div>
        <div className="dm-cta" />
      </div>
    );
  }
  if (variant === 'tablet') {
    return (
      <div className="dm-screen-content">
        <div className="dm-nav"><b>Store</b><i /></div>
        <div className="dm-hero"><span>Collections<br />& Story</span></div>
        <div className="dm-grid" style={{ gridTemplateColumns: '1fr 1fr 1fr' }}><div /><div /><div /><div /><div /><div /></div>
      </div>
    );
  }
  if (variant === 'desktop') {
    return (
      <div className="dm-screen-content">
        <div className="dm-nav"><b>Official Shopijavid</b><i /><i /><i /></div>
        <div className="dm-hero" style={{ minHeight: '60px' }}><span>Full Storefront Experience<br />Navigation · Cart · Search</span></div>
        <div className="dm-grid" style={{ gridTemplateColumns: '1fr 1fr 1fr 1fr' }}><div /><div /><div /><div /></div>
        <div className="dm-cta" />
      </div>
    );
  }
  return (
    <div className="dm-screen-content">
      <div className="dm-nav"><b>Commerce at Scale</b><i /></div>
      <div className="dm-hero" style={{ flex: 1, minHeight: '80px' }}><span>Immersive<br />Brand Showcase</span></div>
      <div className="dm-grid" style={{ gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr' }}><div /><div /><div /><div /><div /></div>
    </div>
  );
}

function DeviceLabel({ icon: Icon, label, desc }: { icon: React.ComponentType<{ size?: number }>; label: string; desc: string }) {
  return (
    <div className="dm-label">
      <span>{label}</span>
      <p>{desc}</p>
    </div>
  );
}

export default function DeviceMockups() {
  return (
    <div className="device-stage">
      <div>
        <div className="dm-phone">
          <div className="dm-screen"><ScreenContent variant="phone" /></div>
        </div>
        <DeviceLabel icon={Smartphone} label="Phone" desc="Mobile-first checkout" />
      </div>

      <div>
        <div className="dm-tablet">
          <div className="dm-screen"><ScreenContent variant="tablet" /></div>
        </div>
        <DeviceLabel icon={Tablet} label="Tablet" desc="Browse & explore" />
      </div>

      <div>
        <div className="dm-desktop">
          <div className="dm-monitor"><div className="dm-screen"><ScreenContent variant="desktop" /></div></div>
          <div className="dm-stand" />
          <div className="dm-base" />
        </div>
        <DeviceLabel icon={Monitor} label="Desktop" desc="Full storefront" />
      </div>

      <div>
        <div className="dm-tv">
          <div className="dm-bezel"><div className="dm-screen"><ScreenContent variant="tv" /></div></div>
          <div className="dm-tvstand" />
          <div className="dm-tvbase" />
        </div>
        <DeviceLabel icon={Tv} label="Big Screen" desc="Immersive display" />
      </div>
    </div>
  );
}
