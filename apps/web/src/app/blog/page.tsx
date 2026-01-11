import { Metadata } from 'next';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { getAllPosts, getAllCategories } from '@/lib/blog/posts';

export const metadata: Metadata = {
  title: 'บทความไพ่ยิปซี - เรียนรู้และพัฒนา',
  description:
    'บทความเกี่ยวกับไพ่ทาโรต์ คู่มือสำหรับผู้เริ่มต้น เทคนิคการอ่านไพ่ และความรู้เชิงลึก',
  keywords: ['บทความไพ่ยิปซี', 'เรียนไพ่ทาโรต์', 'คู่มือ', 'เทคนิค'],
};

export default function BlogPage() {
  const posts = getAllPosts();
  const categories = getAllCategories();

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-b from-slate-900 via-purple-950/20 to-slate-900 py-8 px-4">
        <div className="max-w-5xl mx-auto">
          {/* Breadcrumb */}
          <nav className="mb-6">
            <ol className="flex items-center text-sm text-slate-400">
              <li>
                <Link href="/" className="hover:text-purple-400 transition-colors">
                  หน้าแรก
                </Link>
              </li>
              <li className="mx-2">/</li>
              <li className="text-purple-400">บทความ</li>
            </ol>
          </nav>

          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-amber-400 bg-clip-text text-transparent mb-4">
              📖 บทความไพ่ยิปซี
            </h1>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto">
              เรียนรู้เกี่ยวกับไพ่ทาโรต์ วิธีการอ่านไพ่ และการพัฒนาตนเองผ่านบทความคุณภาพ
            </p>
          </div>

          {/* Categories */}
          <div className="flex flex-wrap justify-center gap-2 mb-10">
            <span className="px-4 py-2 bg-purple-600 text-white rounded-full text-sm font-medium">
              ทั้งหมด ({posts.length})
            </span>
            {categories.map((category) => (
              <span
                key={category}
                className="px-4 py-2 bg-slate-800/50 text-slate-400 rounded-full text-sm hover:bg-slate-700/50 cursor-pointer transition-colors"
              >
                {category}
              </span>
            ))}
          </div>

          {/* Blog Posts Grid */}
          <div className="grid md:grid-cols-2 gap-6">
            {posts.map((post) => (
              <article
                key={post.slug}
                className="bg-slate-800/50 border border-slate-700/50 rounded-2xl overflow-hidden hover:border-purple-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/10 group"
              >
                {/* Post Image Placeholder */}
                <div className="aspect-video bg-gradient-to-br from-purple-900/50 to-indigo-900/50 relative overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-6xl">🎴</span>
                  </div>
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 bg-purple-600/80 text-white text-xs rounded-full">
                      {post.category}
                    </span>
                  </div>
                </div>

                {/* Post Content */}
                <div className="p-6">
                  {/* Meta */}
                  <div className="flex items-center gap-4 text-sm text-slate-500 mb-3">
                    <span>📅 {new Date(post.publishedAt).toLocaleDateString('th-TH')}</span>
                    <span>⏱️ {post.readTime} นาที</span>
                  </div>

                  {/* Title */}
                  <h2 className="text-xl font-bold text-white mb-3 group-hover:text-purple-300 transition-colors line-clamp-2">
                    <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                  </h2>

                  {/* Excerpt */}
                  <p className="text-slate-400 text-sm mb-4 line-clamp-2">{post.excerpt}</p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {post.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-1 bg-slate-700/50 text-slate-400 text-xs rounded"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>

                  {/* Read More */}
                  <Link
                    href={`/blog/${post.slug}`}
                    className="inline-flex items-center text-purple-400 hover:text-purple-300 font-medium text-sm transition-colors"
                  >
                    อ่านเพิ่มเติม →
                  </Link>
                </div>
              </article>
            ))}
          </div>

          {/* CTA */}
          <div className="text-center mt-12">
            <p className="text-slate-400 mb-4">พร้อมลองดูดวงด้วยตัวเองหรือยัง?</p>
            <Link
              href="/reading"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-medium rounded-xl transition-all duration-300 shadow-lg hover:shadow-purple-500/25"
            >
              🔮 เริ่มดูดวงเลย
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

