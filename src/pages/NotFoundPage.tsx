import { Home, ArrowLeft } from 'lucide-react';
import { useHashRoute } from '../lib/router';

export default function NotFoundPage() {
  const { navigate } = useHashRoute();
  return (
    <div className="pt-32 pb-20 min-h-[70vh] flex items-center">
      <div className="container-page max-w-lg text-center">
        <div className="relative inline-block">
          <h1 className="font-serif text-[120px] font-bold leading-none text-carbon-800 sm:text-[160px]">404</h1>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-amber-500 font-mono text-sm tracking-widest">NOT FOUND</span>
          </div>
        </div>
        <h2 className="mt-4 font-serif text-2xl font-semibold text-white">Looks like this page took a different route.</h2>
        <p className="mt-3 text-carbon-400">The page you're looking for doesn't exist or has been moved. Let's get you back on track.</p>
        <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
          <button onClick={() => navigate('/')} className="btn-amber"><Home size={16} /> Return Home</button>
          <button onClick={() => navigate('/contact')} className="btn-ghost"><ArrowLeft size={16} /> Contact Us</button>
        </div>
      </div>
    </div>
  );
}
