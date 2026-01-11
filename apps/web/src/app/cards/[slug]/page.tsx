import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ArticleJsonLd, BreadcrumbJsonLd } from '@/components/seo';

interface CardData {
  id: string;
  name: string;
  nameTh: string;
  slug: string;
  arcana: string;
  suit: string | null;
  number: number | null;
  element: string | null;
  imageUrl: string;
  meaningUpright: string;
  meaningReversed: string;
  keywordsUpright: string[];
  keywordsReversed: string[];
  advice: string;
  symbolism: string;
}

async function getCard(slug: string): Promise<CardData | null> {
  try {
    const { prisma } = await import('@/lib/prisma');

    const card = await prisma.card.findFirst({
      where: { slug },
    });

    if (!card) return null;

    // Determine the correct image path based on suit and number
    const getImageUrl = () => {
      if (card.image_url && card.image_url.startsWith('http')) {
        return card.image_url;
      }
      // Use the folder structure: /cards/{suit}/{number}.jpg
      const suitFolder = card.arcana === 'major' ? 'major' : (card.suit || 'major');
      const numberPadded = (card.number ?? 0).toString().padStart(2, '0');
      return `/cards/${suitFolder}/${numberPadded}.jpg`;
    };

    return {
      id: card.id,
      name: card.name,
      nameTh: card.name_th,
      slug: card.slug,
      arcana: card.arcana,
      suit: card.suit,
      number: card.number,
      element: card.element,
      imageUrl: getImageUrl(),
      meaningUpright: card.meaning_upright,
      meaningReversed: card.meaning_reversed,
      keywordsUpright: card.keywords_upright,
      keywordsReversed: card.keywords_reversed,
      advice: card.advice,
      symbolism: card.symbolism || '',
    };
  } catch (error) {
    console.error('Error fetching card:', error);
    return null;
  }
}

async function getRelatedCards(arcana: string, suit: string | null, currentSlug: string) {
  try {
    const { prisma } = await import('@/lib/prisma');

    // Query related cards (same suit or same arcana, excluding current card)
    let cards;
    if (arcana === 'major') {
      cards = await prisma.card.findMany({
        where: { arcana: 'major', slug: { not: currentSlug } },
        take: 4,
      });
    } else if (suit && ['wands', 'cups', 'swords', 'pentacles', 'major_arcana'].includes(suit)) {
      cards = await prisma.card.findMany({
        where: {
          suit: suit as 'wands' | 'cups' | 'swords' | 'pentacles' | 'major_arcana',
          slug: { not: currentSlug },
        },
        take: 4,
      });
    } else {
      cards = await prisma.card.findMany({
        where: { slug: { not: currentSlug } },
        take: 4,
      });
    }

    return cards.map((card) => {
      // Determine the correct image path based on suit and number
      const getImageUrl = () => {
        if (card.image_url && card.image_url.startsWith('http')) {
          return card.image_url;
        }
        const suitFolder = card.arcana === 'major' ? 'major' : (card.suit || 'major');
        const numberPadded = (card.number ?? 0).toString().padStart(2, '0');
        return `/cards/${suitFolder}/${numberPadded}.jpg`;
      };

      return {
        id: card.id,
        name: card.name,
        nameTh: card.name_th,
        slug: card.slug,
        arcana: card.arcana,
        suit: card.suit,
        imageUrl: getImageUrl(),
      };
    });
  } catch (error) {
    console.error('Error fetching related cards:', error);
    return [];
  }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const card = await getCard(slug);

  if (!card) {
    return {
      title: 'ไม่พบไพ่ | ดูดวงไพ่ยิปซี',
    };
  }

  const description = `ความหมายไพ่ ${card.nameTh} (${card.name}) - ${card.meaningUpright.substring(0, 120)}...`;

  return {
    title: `${card.nameTh} - ความหมายและคำทำนาย`,
    description,
    keywords: [
      card.nameTh,
      card.name,
      'ความหมายไพ่ยิปซี',
      'ไพ่ทาโรต์',
      ...card.keywordsUpright,
    ],
    openGraph: {
      title: `${card.nameTh} (${card.name}) - ความหมายไพ่ยิปซี`,
      description,
      type: 'article',
      images: [{ url: card.imageUrl, width: 400, height: 600, alt: card.nameTh }],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${card.nameTh} - ความหมายไพ่ยิปซี`,
      description,
      images: [card.imageUrl],
    },
  };
}

export default async function CardDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const card = await getCard(slug);

  if (!card) {
    notFound();
  }

  const relatedCards = await getRelatedCards(card.arcana, card.suit, slug);

  const suitLabels: Record<string, { name: string; emoji: string }> = {
    wands: { name: 'ไม้เท้า (Wands)', emoji: '🪄' },
    cups: { name: 'ถ้วย (Cups)', emoji: '🏆' },
    swords: { name: 'ดาบ (Swords)', emoji: '⚔️' },
    pentacles: { name: 'เหรียญ (Pentacles)', emoji: '🪙' },
  };

  const elementLabels: Record<string, { name: string; emoji: string }> = {
    fire: { name: 'ไฟ', emoji: '🔥' },
    water: { name: 'น้ำ', emoji: '💧' },
    air: { name: 'ลม', emoji: '💨' },
    earth: { name: 'ดิน', emoji: '🌍' },
  };

  const siteUrl = 'https://tarot-reading-app-ebon.vercel.app';

  return (
    <>
      {/* Structured Data */}
      <ArticleJsonLd
        title={`${card.nameTh} (${card.name}) - ความหมายไพ่ยิปซี`}
        description={card.meaningUpright}
        url={`${siteUrl}/cards/${card.slug}`}
        imageUrl={card.imageUrl}
      />
      <BreadcrumbJsonLd
        items={[
          { name: 'หน้าแรก', url: siteUrl },
          { name: 'คู่มือไพ่ยิปซี', url: `${siteUrl}/cards` },
          { name: card.nameTh, url: `${siteUrl}/cards/${card.slug}` },
        ]}
      />

      <Header />
      <main className="min-h-screen bg-gradient-to-b from-slate-900 via-purple-950/20 to-slate-900 py-8 px-4">
        <article className="max-w-4xl mx-auto">
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
                <Link href="/cards" className="hover:text-purple-400 transition-colors">
                  คู่มือไพ่ยิปซี
                </Link>
              </li>
              <li className="mx-2">/</li>
              <li className="text-purple-400">{card.nameTh}</li>
            </ol>
          </nav>

          {/* Card Header */}
          <header className="grid md:grid-cols-2 gap-8 mb-12">
            {/* Card Image */}
            <div className="flex justify-center">
              <div className="relative w-64 md:w-80 aspect-[2/3] rounded-2xl overflow-hidden shadow-2xl shadow-purple-500/20 border-4 border-amber-400/50">
                <Image
                  src={card.imageUrl}
                  alt={card.nameTh}
                  fill
                  sizes="(max-width: 768px) 256px, 320px"
                  className="object-cover"
                  priority
                />
              </div>
            </div>

            {/* Card Info */}
            <div className="flex flex-col justify-center">
              {/* Arcana Badge */}
              <div className="mb-4">
                <span
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium ${
                    card.arcana === 'major'
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/50'
                      : 'bg-purple-500/20 text-purple-300 border border-purple-500/50'
                  }`}
                >
                  {card.arcana === 'major' ? '⭐ Major Arcana' : `${suitLabels[card.suit || '']?.emoji || '🎴'} Minor Arcana`}
                  {card.number !== null && ` • #${card.number}`}
                </span>
              </div>

              {/* Card Name */}
              <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-purple-300 font-card mb-2">
                {card.nameTh}
              </h1>
              <p className="text-xl text-purple-400 font-card mb-6">{card.name}</p>

              {/* Quick Info */}
              <div className="flex flex-wrap gap-3 mb-6">
                {card.suit && suitLabels[card.suit] && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-slate-800/50 rounded-full text-sm text-slate-300">
                    {suitLabels[card.suit].emoji} {suitLabels[card.suit].name}
                  </span>
                )}
                {card.element && elementLabels[card.element] && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-slate-800/50 rounded-full text-sm text-slate-300">
                    {elementLabels[card.element].emoji} ธาตุ{elementLabels[card.element].name}
                  </span>
                )}
              </div>

              {/* CTA */}
              <Link
                href="/reading"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-medium rounded-xl transition-all duration-300 w-fit"
              >
                🔮 ดูดวงกับไพ่ใบนี้
              </Link>
            </div>
          </header>

          {/* Keywords */}
          <section className="mb-12">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Upright Keywords */}
              <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-green-400 mb-4 flex items-center gap-2">
                  ⬆️ คำสำคัญ (ไพ่ขึ้น)
                </h3>
                <div className="flex flex-wrap gap-2">
                  {card.keywordsUpright.map((keyword, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 bg-green-500/20 text-green-300 rounded-full text-sm"
                    >
                      {keyword}
                    </span>
                  ))}
                </div>
              </div>

              {/* Reversed Keywords */}
              <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-pink-400 mb-4 flex items-center gap-2">
                  🔄 คำสำคัญ (ไพ่กลับหัว)
                </h3>
                <div className="flex flex-wrap gap-2">
                  {card.keywordsReversed.map((keyword, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 bg-pink-500/20 text-pink-300 rounded-full text-sm"
                    >
                      {keyword}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Meanings */}
          <section className="space-y-8 mb-12">
            {/* Upright Meaning */}
            <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6">
              <h2 className="text-2xl font-bold text-green-400 mb-4 flex items-center gap-2">
                ⬆️ ความหมายเมื่อไพ่ขึ้น
              </h2>
              <p className="text-slate-300 leading-relaxed text-lg">{card.meaningUpright}</p>
            </div>

            {/* Reversed Meaning */}
            <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6">
              <h2 className="text-2xl font-bold text-pink-400 mb-4 flex items-center gap-2">
                🔄 ความหมายเมื่อไพ่กลับหัว
              </h2>
              <p className="text-slate-300 leading-relaxed text-lg">{card.meaningReversed}</p>
            </div>
          </section>

          {/* Symbolism */}
          {card.symbolism && (
            <section className="mb-12">
              <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6">
                <h2 className="text-2xl font-bold text-purple-400 mb-4 flex items-center gap-2">
                  🔮 สัญลักษณ์และความหมาย
                </h2>
                <p className="text-slate-300 leading-relaxed">{card.symbolism}</p>
              </div>
            </section>
          )}

          {/* Advice */}
          {card.advice && (
            <section className="mb-12">
              <div className="bg-gradient-to-r from-purple-900/50 to-indigo-900/50 border border-purple-500/30 rounded-xl p-6">
                <h2 className="text-2xl font-bold text-amber-400 mb-4 flex items-center gap-2">
                  💡 คำแนะนำ
                </h2>
                <p className="text-slate-200 leading-relaxed text-lg">{card.advice}</p>
              </div>
            </section>
          )}

          {/* Related Cards */}
          {relatedCards.length > 0 && (
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-purple-400 mb-6 flex items-center gap-2">
                🎴 ไพ่ที่เกี่ยวข้อง
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {relatedCards.map((relatedCard) => (
                  <Link
                    key={relatedCard.id}
                    href={`/cards/${relatedCard.slug}`}
                    className="group bg-slate-800/50 hover:bg-slate-700/50 border border-slate-700/50 hover:border-purple-500/50 rounded-xl p-3 transition-all duration-300 hover:scale-105"
                  >
                    <div className="relative aspect-[2/3] mb-3 rounded-lg overflow-hidden">
                      <Image
                        src={relatedCard.imageUrl}
                        alt={relatedCard.nameTh}
                        fill
                        sizes="(max-width: 768px) 50vw, 25vw"
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                        loading="lazy"
                      />
                    </div>
                    <div className="text-center">
                      <h3 className="font-bold text-purple-300 font-card text-sm group-hover:text-purple-200 transition-colors line-clamp-1">
                        {relatedCard.nameTh}
                      </h3>
                      <p className="text-xs text-slate-500">{relatedCard.name}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* Navigation */}
          <nav className="flex justify-between items-center border-t border-slate-700 pt-8">
            <Link
              href="/cards"
              className="inline-flex items-center gap-2 px-6 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium rounded-xl transition-colors"
            >
              ← กลับไปคู่มือไพ่
            </Link>
            <Link
              href="/reading"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-medium rounded-xl transition-all duration-300"
            >
              🔮 เริ่มดูดวง
            </Link>
          </nav>
        </article>
      </main>
      <Footer />
    </>
  );
}
