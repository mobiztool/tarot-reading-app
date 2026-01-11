import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ArticleJsonLd, BreadcrumbJsonLd } from '@/components/seo';
import { getPostBySlug, getRelatedPosts, getAllPosts } from '@/lib/blog/posts';

export async function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    return { title: 'บทความไม่พบ' };
  }

  return {
    title: post.title,
    description: post.excerpt,
    keywords: post.tags,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
      publishedTime: post.publishedAt,
      authors: [post.author],
      tags: post.tags,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
    },
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const relatedPosts = getRelatedPosts(slug, 3);
  const siteUrl = 'https://tarot-reading-app-ebon.vercel.app';

  return (
    <>
      {/* Structured Data */}
      <ArticleJsonLd
        title={post.title}
        description={post.excerpt}
        url={`${siteUrl}/blog/${post.slug}`}
        imageUrl={post.imageUrl}
        datePublished={post.publishedAt}
        author={post.author}
      />
      <BreadcrumbJsonLd
        items={[
          { name: 'หน้าแรก', url: siteUrl },
          { name: 'บทความ', url: `${siteUrl}/blog` },
          { name: post.title, url: `${siteUrl}/blog/${post.slug}` },
        ]}
      />

      <Header />
      <main className="min-h-screen bg-gradient-to-b from-slate-900 via-purple-950/20 to-slate-900 py-8 px-4">
        <article className="max-w-3xl mx-auto">
          {/* Breadcrumb */}
          <nav className="mb-6">
            <ol className="flex items-center text-sm text-slate-400 flex-wrap gap-1">
              <li>
                <Link href="/" className="hover:text-purple-400 transition-colors">
                  หน้าแรก
                </Link>
              </li>
              <li className="mx-2">/</li>
              <li>
                <Link href="/blog" className="hover:text-purple-400 transition-colors">
                  บทความ
                </Link>
              </li>
              <li className="mx-2">/</li>
              <li className="text-purple-400 line-clamp-1">{post.title}</li>
            </ol>
          </nav>

          {/* Article Header */}
          <header className="mb-8">
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="px-3 py-1 bg-purple-600/80 text-white text-sm rounded-full">
                {post.category}
              </span>
            </div>

            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4 leading-tight">
              {post.title}
            </h1>

            <p className="text-xl text-slate-400 mb-6">{post.excerpt}</p>

            {/* Meta */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500 border-b border-slate-700 pb-6">
              <span className="flex items-center gap-2">
                <span>👤</span>
                <span>{post.author}</span>
              </span>
              <span className="flex items-center gap-2">
                <span>📅</span>
                <span>{new Date(post.publishedAt).toLocaleDateString('th-TH', { dateStyle: 'long' })}</span>
              </span>
              <span className="flex items-center gap-2">
                <span>⏱️</span>
                <span>อ่าน {post.readTime} นาที</span>
              </span>
            </div>
          </header>

          {/* Article Content */}
          <div className="prose prose-invert prose-purple max-w-none mb-12">
            {post.content.split('\n').map((paragraph, index) => {
              const trimmed = paragraph.trim();
              if (!trimmed) return null;

              // Headings
              if (trimmed.startsWith('## ')) {
                return (
                  <h2 key={index} className="text-2xl font-bold text-purple-400 mt-8 mb-4">
                    {trimmed.replace('## ', '')}
                  </h2>
                );
              }
              if (trimmed.startsWith('### ')) {
                return (
                  <h3 key={index} className="text-xl font-bold text-purple-300 mt-6 mb-3">
                    {trimmed.replace('### ', '')}
                  </h3>
                );
              }

              // List items
              if (trimmed.startsWith('- ')) {
                return (
                  <li key={index} className="text-slate-300 ml-6 mb-2 list-disc">
                    {trimmed.replace('- ', '')}
                  </li>
                );
              }

              // Bold text handling
              if (trimmed.includes('**')) {
                const parts = trimmed.split(/\*\*([^*]+)\*\*/g);
                return (
                  <p key={index} className="text-slate-300 leading-relaxed mb-4">
                    {parts.map((part, i) =>
                      i % 2 === 1 ? (
                        <strong key={i} className="text-purple-300">
                          {part}
                        </strong>
                      ) : (
                        part
                      )
                    )}
                  </p>
                );
              }

              // Regular paragraph
              return (
                <p key={index} className="text-slate-300 leading-relaxed mb-4">
                  {trimmed}
                </p>
              );
            })}
          </div>

          {/* Tags */}
          <div className="border-t border-slate-700 pt-6 mb-8">
            <h4 className="text-sm font-medium text-slate-400 mb-3">แท็ก</h4>
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 bg-slate-800/50 text-slate-400 rounded-full text-sm hover:bg-purple-600/20 hover:text-purple-300 cursor-pointer transition-colors"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="bg-gradient-to-r from-purple-900/50 to-indigo-900/50 border border-purple-500/30 rounded-2xl p-8 text-center mb-12">
            <h3 className="text-2xl font-bold text-white mb-2">พร้อมลองดูดวงด้วยตัวเองแล้วหรือยัง?</h3>
            <p className="text-slate-300 mb-6">เริ่มดูดวงประจำวันหรือไพ่ 3 ใบได้เลย ฟรี!</p>
            <Link
              href="/reading"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-medium rounded-xl transition-all duration-300"
            >
              🔮 เริ่มดูดวงเลย
            </Link>
          </div>

          {/* Related Posts */}
          {relatedPosts.length > 0 && (
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-purple-400 mb-6">📚 บทความที่เกี่ยวข้อง</h2>
              <div className="grid md:grid-cols-3 gap-4">
                {relatedPosts.map((relatedPost) => (
                  <Link
                    key={relatedPost.slug}
                    href={`/blog/${relatedPost.slug}`}
                    className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4 hover:border-purple-500/50 transition-all"
                  >
                    <h3 className="font-medium text-white mb-2 line-clamp-2 hover:text-purple-300">
                      {relatedPost.title}
                    </h3>
                    <div className="text-sm text-slate-500">
                      ⏱️ {relatedPost.readTime} นาที
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* Navigation */}
          <nav className="flex justify-between items-center border-t border-slate-700 pt-8">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 px-6 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium rounded-xl transition-colors"
            >
              ← กลับไปบทความ
            </Link>
            <Link
              href="/cards"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-medium rounded-xl transition-all"
            >
              📚 คู่มือไพ่ยิปซี
            </Link>
          </nav>
        </article>
      </main>
      <Footer />
    </>
  );
}

