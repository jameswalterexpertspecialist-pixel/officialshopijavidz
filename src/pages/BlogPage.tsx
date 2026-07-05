import { Clock, ArrowRight, ArrowUpRight } from 'lucide-react';
import { useHashRoute } from '../lib/router';
import { BLOG_POSTS } from '../lib/data';

export default function BlogPage() {
  const { navigate } = useHashRoute();
  const featured = BLOG_POSTS[0];
  const rest = BLOG_POSTS.slice(1);

  return (
    <div className="pt-20">
      <section className="relative bg-carbon-950 py-16 overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-30" />
        <div className="absolute left-1/2 top-0 -translate-x-1/2 h-px w-3/4 bg-gradient-to-r from-transparent via-amber-500/40 to-transparent" />
        <div className="container-page relative text-center">
          <span className="eyebrow">The Journal</span>
          <h1 className="mt-4 font-serif text-5xl font-semibold text-white sm:text-6xl">Long-form thinking on<br />brand and growth</h1>
        </div>
      </section>

      {/* Featured */}
      <section className="section bg-carbon-950">
        <div className="container-page">
          <button onClick={() => navigate(`/blog/${featured.id}`)} className="group grid gap-8 lg:grid-cols-2 lg:items-center card-dark overflow-hidden text-left transition-all hover:shadow-lift">
            <div className="relative h-64 lg:h-80 overflow-hidden">
              <img src={featured.img} alt="" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
            </div>
            <div className="p-8">
              <span className="chip bg-amber-600/20 text-amber-400 text-[10px]">Featured</span>
              <h2 className="mt-3 font-serif text-3xl font-semibold text-white group-hover:text-amber-400 transition-colors">{featured.title}</h2>
              <p className="mt-3 text-carbon-400 leading-relaxed">{featured.excerpt}</p>
              <div className="mt-4 flex items-center gap-4 text-xs text-carbon-500">
                <span className="flex items-center gap-1"><Clock size={12} /> {featured.readTime}</span>
                <span>{featured.date}</span>
                <span className="text-forest-400">{featured.category}</span>
              </div>
              <div className="mt-5 flex items-center gap-1 text-sm font-semibold text-amber-500">Read Article <ArrowRight size={15} /></div>
            </div>
          </button>
        </div>
      </section>

      {/* Grid */}
      <section className="section bg-carbon-900">
        <div className="container-page">
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {rest.map((post) => (
              <button key={post.id} onClick={() => navigate(`/blog/${post.id}`)} className="group card-dark overflow-hidden text-left transition-all hover:-translate-y-1 hover:shadow-lift">
                <div className="relative h-48 overflow-hidden">
                  <img src={post.img} alt="" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  <span className="absolute left-3 top-3 chip bg-carbon-950/80 text-forest-400 text-[10px] backdrop-blur">{post.category}</span>
                </div>
                <div className="p-5">
                  <h3 className="font-serif text-lg font-semibold text-white group-hover:text-amber-400 transition-colors line-clamp-2">{post.title}</h3>
                  <p className="mt-2 text-sm text-carbon-400 line-clamp-2">{post.excerpt}</p>
                  <div className="mt-3 flex items-center gap-3 text-xs text-carbon-500">
                    <span className="flex items-center gap-1"><Clock size={11} /> {post.readTime}</span>
                    <span>{post.date}</span>
                  </div>
                  <div className="mt-3 flex items-center gap-1 text-xs font-semibold text-amber-500">Read Article <ArrowUpRight size={12} /></div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
