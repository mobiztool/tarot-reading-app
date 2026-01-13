import { MetadataRoute } from 'next';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://tarot-reading-app-ebon.vercel.app';

// Static pages
const staticPages = [
  '',
  '/reading',
  '/reading/daily',
  '/reading/three-card',
  '/cards',
  '/blog',
  '/history',
  '/profile',
  '/settings',
  '/auth/login',
  '/auth/signup',
  '/privacy',
  '/terms',
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const sitemap: MetadataRoute.Sitemap = [];

  // Add static pages
  for (const page of staticPages) {
    sitemap.push({
      url: `${siteUrl}${page}`,
      lastModified: new Date(),
      changeFrequency: page === '' ? 'daily' : 'weekly',
      priority: page === '' ? 1 : page.includes('/reading') ? 0.9 : 0.7,
    });
  }

  // Add card pages dynamically from database
  try {
    const { prisma } = await import('@/lib/prisma');
    const cards = await prisma.card.findMany({
      select: { slug: true },
    });

    for (const card of cards) {
      sitemap.push({
        url: `${siteUrl}/cards/${card.slug}`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.8,
      });
    }
  } catch (error) {
    console.error('Error fetching cards for sitemap:', error);
  }

  // Add blog posts
  try {
    const { getAllPosts } = await import('@/lib/blog/posts');
    const posts = getAllPosts();

    for (const post of posts) {
      sitemap.push({
        url: `${siteUrl}/blog/${post.slug}`,
        lastModified: new Date(post.publishedAt),
        changeFrequency: 'monthly',
        priority: 0.7,
      });
    }
  } catch (error) {
    console.error('Error fetching blog posts for sitemap:', error);
  }

  return sitemap;
}

