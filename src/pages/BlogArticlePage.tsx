import { ArrowLeft, Clock, ArrowRight, Share2 } from 'lucide-react';
import { useHashRoute } from '../lib/router';
import { BLOG_POSTS } from '../lib/data';

export default function BlogArticlePage({ id }: { id: string }) {
  const { navigate } = useHashRoute();
  const post = BLOG_POSTS.find((p) => p.id === id);

  if (!post) {
    return <div className="pt-32 text-center"><h1 className="font-serif text-3xl text-white">Article not found</h1><button onClick={() => navigate('/blog')} className="btn-amber mt-6">Back to Blog</button></div>;
  }

  const related = BLOG_POSTS.filter((p) => p.id !== id).slice(0, 3);

  return (
    <div className="pt-20">
      <article className="bg-carbon-950">
        {/* Hero */}
        <div className="relative h-[360px] overflow-hidden">
          <img src={post.img} alt="" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-carbon-950 via-carbon-950/50 to-transparent" />
          <div className="container-page absolute inset-x-0 bottom-0 pb-10">
            <button onClick={() => navigate('/blog')} className="flex items-center gap-1.5 text-sm text-white/70 hover:text-white"><ArrowLeft size={16} /> Back to Blog</button>
            <span className="mt-4 inline-block chip bg-forest-900/60 text-forest-400">{post.category}</span>
            <h1 className="mt-3 font-serif text-4xl font-semibold text-white sm:text-5xl max-w-3xl">{post.title}</h1>
            <div className="mt-4 flex items-center gap-4 text-sm text-carbon-400">
              <span className="flex items-center gap-1"><Clock size={14} /> {post.readTime}</span>
              <span>{post.date}</span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="section">
          <div className="container-page max-w-3xl">
            <p className="text-xl leading-relaxed text-carbon-300 font-serif italic mb-8">{post.excerpt}</p>
            {post.content.map((block, i) => {
              if (block.type === 'h2') return <h2 key={i} className="mt-10 mb-4 font-serif text-2xl font-semibold text-white">{block.text}</h2>;
              return <p key={i} className="mb-5 leading-relaxed text-carbon-400">{block.text}</p>;
            })}

            {/* CTA */}
            <div className="mt-12 rounded-2xl bg-forest-900 p-8 text-center ring-1 ring-forest-700/40">
              <h3 className="font-serif text-2xl font-semibold text-white">Ready to grow your brand?</h3>
              <p className="mt-2 text-carbon-300">Your free consultation is one click away.</p>
              <button onClick={() => navigate('/contact')} className="btn-amber mt-5">Book Strategy Call <ArrowRight size={16} /></button>
            </div>

            {/* Share */}
            <div className="mt-8 flex items-center gap-3">
              <span className="text-sm text-carbon-500">Share this article:</span>
              <button className="flex h-9 w-9 items-center justify-center rounded-full bg-carbon-900 text-carbon-400 ring-1 ring-white/10 hover:bg-amber-600 hover:text-white transition"><Share2 size={15} /></button>
            </div>
          </div>
        </div>

        {/* Related */}
        <div className="section-sm bg-carbon-900">
          <div className="container-page">
            <h3 className="font-serif text-2xl font-semibold text-white mb-6">Related articles</h3>
            <div className="grid gap-5 sm:grid-cols-3">
              {related.map((p) => (
                <button key={p.id} onClick={() => navigate(`/blog/${p.id}`)} className="group card-dark overflow-hidden text-left transition hover:-translate-y-1 hover:shadow-lift">
                  <div className="h-32 overflow-hidden"><img src={p.img} alt="" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" /></div>
                  <div className="p-4">
                    <h4 className="font-serif text-base font-semibold text-white group-hover:text-amber-400 transition line-clamp-2">{p.title}</h4>
                    <p className="mt-1 text-xs text-carbon-500">{p.readTime}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </article>
    </div>
  );
}
