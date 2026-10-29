import { useEffect, useState } from 'react';

const SERVICES = [
  { label: 'Web Design', className: 'globe-service-one' },
  { label: 'Digital Marketing', className: 'globe-service-two' },
  { label: 'Ads Management', className: 'globe-service-three' },
  { label: 'Video Animation', className: 'globe-service-four' },
  { label: 'UGC Content', className: 'globe-service-five' },
  { label: 'SEO', className: 'globe-service-six' },
  { label: 'Branding', className: 'globe-service-seven' },
  { label: 'E-commerce Optimization', className: 'globe-service-eight' },
];

export default function InteractiveGlobe({ size = 420 }: { size?: number }) {
  const [reducedMotion, setReducedMotion] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [lastX, setLastX] = useState(0);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const updateMotion = () => setReducedMotion(mediaQuery.matches);
    updateMotion();
    mediaQuery.addEventListener('change', updateMotion);
    return () => mediaQuery.removeEventListener('change', updateMotion);
  }, []);

  return (
    <div
      className={`realistic-globe ${reducedMotion ? 'reduced-motion' : ''} ${dragging ? 'is-dragging' : ''}`}
      style={{ '--globe-size': `${size}px`, '--globe-rotation': `${rotation}deg` } as React.CSSProperties}
      aria-label="Interactive globe showing connected digital services"
      role="img"
      onPointerDown={(event) => { event.currentTarget.setPointerCapture(event.pointerId); setDragging(true); setLastX(event.clientX); }}
      onPointerMove={(event) => { if (!dragging) return; setRotation((value) => value + (event.clientX - lastX) * 0.35); setLastX(event.clientX); }}
      onPointerUp={(event) => { event.currentTarget.releasePointerCapture(event.pointerId); setDragging(false); }}
      onPointerCancel={() => setDragging(false)}
    >
      <div className="globe-orbit globe-orbit-wide" />
      <div className="globe-orbit globe-orbit-tall" />
      <div className="globe-sphere">
        <div className="globe-texture" />
        <div className="globe-shade" />
        <div className="globe-atmosphere" />
      </div>
      <div className="globe-service-labels" aria-hidden="true">
        {SERVICES.map((service) => (
          <span key={service.label} className={`globe-service ${service.className}`}>
            <i />{service.label}
          </span>
        ))}
      </div>
      <p className="globe-hint">Drag to explore services</p>
    </div>
  );
}
