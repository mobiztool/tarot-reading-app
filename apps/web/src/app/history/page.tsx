'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { TarotCard } from '@/components/cards';
import { Header } from '@/components/layout/Header';
import { useAuth, useAnalytics } from '@/lib/hooks';
import { PageLoader } from '@/components/ui/MysticalLoader';

interface ReadingCard {
  position: number;
  positionLabel: 'past' | 'present' | 'future' | null;
  isReversed: boolean;
  card: {
    id: string;
    name: string;
    nameTh: string;
    slug: string;
    imageUrl: string;
  };
}

interface Reading {
  id: string;
  readingType: 'daily' | 'three_card';
  question: string | null;
  createdAt: string;
  isFavorite: boolean;
  cards: ReadingCard[];
}

const POSITION_LABELS = {
  past: { th: 'อดีต', emoji: '⏪', color: 'bg-blue-500/20 text-blue-300' },
  present: { th: 'ปัจจุบัน', emoji: '⏺️', color: 'bg-purple-500/20 text-purple-300' },
  future: { th: 'อนาคต', emoji: '⏩', color: 'bg-amber-500/20 text-amber-300' },
};

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    if (diffHours === 0) {
      const diffMins = Math.floor(diffMs / (1000 * 60));
      return diffMins <= 1 ? 'เมื่อสักครู่' : `${diffMins} นาทีที่แล้ว`;
    }
    return `${diffHours} ชั่วโมงที่แล้ว`;
  }

  if (diffDays === 1) return 'เมื่อวาน';
  if (diffDays < 7) return `${diffDays} วันที่แล้ว`;

  return date.toLocaleDateString('th-TH', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

function ReadingTypeLabel({ type }: { type: 'daily' | 'three_card' }) {
  if (type === 'daily') {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-1 bg-amber-500/20 text-amber-300 rounded-full text-xs font-medium">
        ☀️ ดูดวงประจำวัน
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 px-2 py-1 bg-purple-500/20 text-purple-300 rounded-full text-xs font-medium">
      🌙 ไพ่ 3 ใบ
    </span>
  );
}

function ReadingHistoryCard({
  reading,
  onViewDetail,
}: {
  reading: Reading;
  onViewDetail: (id: string) => void;
}) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl overflow-hidden transition-all duration-300 hover:border-purple-500/30">
      {/* Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-4 flex items-center justify-between text-left hover:bg-slate-700/30 transition-colors"
      >
        <div className="flex items-center gap-4">
          {/* Mini card preview - show actual card images */}
          <div className="flex -space-x-4">
            {reading.cards.slice(0, 3).map((rc, idx) => (
              <div
                key={idx}
                className={`w-10 h-14 rounded border-2 border-slate-700 overflow-hidden bg-gradient-to-br from-purple-600 to-indigo-800 ${rc.isReversed ? 'rotate-180' : ''}`}
                style={{ zIndex: reading.cards.length - idx }}
              >
                {rc.card.imageUrl ? (
                  <img 
                    src={rc.card.imageUrl} 
                    alt={rc.card.nameTh}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-xs">🎴</div>
                )}
              </div>
            ))}
          </div>

          <div>
            <div className="flex items-center gap-2 mb-1">
              <ReadingTypeLabel type={reading.readingType} />
              <span className="text-slate-500 text-xs">{formatDate(reading.createdAt)}</span>
            </div>

            {reading.question && (
              <p className="text-slate-400 text-sm truncate max-w-[200px] sm:max-w-[300px]">
                &quot;{reading.question}&quot;
              </p>
            )}

            {!reading.question && (
              <p className="text-slate-500 text-sm font-card">
                {reading.cards.map((c) => c.card.nameTh).join(' • ')}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className={`transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}>
            ▼
          </span>
        </div>
      </button>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="p-4 pt-0 border-t border-slate-700/50">
          <div className="pt-4">
            {/* Cards Grid */}
            <div
              className={`grid gap-4 mb-4 ${
                reading.readingType === 'three_card'
                  ? 'grid-cols-3'
                  : 'grid-cols-1 max-w-[200px] mx-auto'
              }`}
            >
              {reading.cards.map((rc) => (
                <div key={rc.position} className="text-center">
                  {/* Position Label */}
                  {rc.positionLabel && (
                    <div
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs mb-2 ${POSITION_LABELS[rc.positionLabel].color}`}
                    >
                      {POSITION_LABELS[rc.positionLabel].emoji} {POSITION_LABELS[rc.positionLabel].th}
                    </div>
                  )}

                  {/* Card */}
                  <div className="flex justify-center mb-2">
                    <TarotCard
                      frontImage={rc.card.imageUrl}
                      cardName={rc.card.nameTh}
                      size="sm"
                      isReversed={rc.isReversed}
                      isFlipped={true}
                      showFlipAnimation={false}
                    />
                  </div>

                  {/* Card Name */}
                  <p className="text-sm font-medium text-purple-300 font-card">{rc.card.nameTh}</p>
                  <p className="text-xs text-slate-500 font-card">{rc.card.name}</p>
                  {rc.isReversed && <span className="text-xs text-pink-400">🔄 กลับหัว</span>}
                </div>
              ))}
            </div>

            {/* Question if exists */}
            {reading.question && (
              <div className="bg-slate-900/50 rounded-lg p-3 mb-4">
                <p className="text-slate-400 text-sm">
                  <span className="text-purple-400">❓ คำถาม:</span> {reading.question}
                </p>
              </div>
            )}

            {/* View Detail Button */}
            <button
              onClick={() => onViewDetail(reading.id)}
              className="w-full py-2 bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 rounded-lg transition-colors text-sm"
            >
              📖 ดูรายละเอียดเพิ่มเติม
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// Skeleton Loading Component
function SkeletonCard() {
  return (
    <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-4 animate-pulse">
      <div className="flex items-center gap-4">
        <div className="flex -space-x-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="w-10 h-14 bg-slate-700 rounded border-2 border-slate-600"></div>
          ))}
        </div>
        <div className="flex-1">
          <div className="h-5 bg-slate-700 rounded w-28 mb-2"></div>
          <div className="h-4 bg-slate-700 rounded w-40"></div>
        </div>
        <div className="w-4 h-4 bg-slate-700 rounded"></div>
      </div>
    </div>
  );
}

export default function HistoryPage() {
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();
  const { track } = useAnalytics();

  const [readings, setReadings] = useState<Reading[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'daily' | 'three_card'>('all');
  const [dateRange, setDateRange] = useState<'7d' | '30d' | 'all'>('all');
  const [search, setSearch] = useState('');
  const [searchDebounce, setSearchDebounce] = useState('');
  const [hasMore, setHasMore] = useState(false);
  const [total, setTotal] = useState(0);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchDebounce(search);
    }, 500);
    return () => clearTimeout(timer);
  }, [search]);

  // Fetch readings
  const fetchReadings = useCallback(
    async (offset = 0, append = false) => {
      if (offset === 0) {
        setIsLoading(true);
      } else {
        setIsLoadingMore(true);
      }

      try {
        const params = new URLSearchParams();
        params.set('limit', '20');
        params.set('offset', offset.toString());

        if (filter !== 'all') {
          params.set('type', filter);
        }
        if (dateRange !== 'all') {
          params.set('dateRange', dateRange);
        }
        if (searchDebounce) {
          params.set('search', searchDebounce);
        }
        if (user?.id) {
          params.set('userId', user.id);
        }

        const response = await fetch(`/api/readings?${params.toString()}`);
        const data = await response.json();

        if (data.success) {
          if (append) {
            setReadings((prev) => [...prev, ...data.data]);
          } else {
            setReadings(data.data);
          }
          setHasMore(data.hasMore);
          setTotal(data.total);

          if (offset === 0) {
            track('history_viewed', { total: data.total });
          }
        } else {
          throw new Error(data.message || 'Failed to fetch readings');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setIsLoading(false);
        setIsLoadingMore(false);
      }
    },
    [filter, dateRange, searchDebounce, user?.id, track]
  );

  // Initial fetch and when filters change
  useEffect(() => {
    if (!authLoading) {
      fetchReadings(0, false);
    }
  }, [authLoading, fetchReadings]);

  // Handle filter change
  const handleFilterChange = (newFilter: 'all' | 'daily' | 'three_card') => {
    setFilter(newFilter);
    track('history_filter_used', { filter: newFilter });
  };

  // Handle date range change
  const handleDateRangeChange = (newRange: '7d' | '30d' | 'all') => {
    setDateRange(newRange);
    track('history_filter_used', { dateRange: newRange });
  };

  // Load more
  const handleLoadMore = () => {
    fetchReadings(readings.length, true);
  };

  // View detail
  const handleViewDetail = (id: string) => {
    track('reading_reopened', { readingId: id });
    router.push(`/reading/${id}`);
  };

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/login?redirectTo=/history');
    }
  }, [authLoading, user, router]);

  if (authLoading) {
    return (
      <>
        <Header />
        <PageLoader message="กำลังโหลด..." />
      </>
    );
  }

  if (!user) {
    return null;
  }

  // Error state
  if (error) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gradient-to-b from-slate-900 via-purple-950/20 to-slate-900 flex items-center justify-center px-4">
          <div className="text-center">
            <div className="text-6xl mb-6">😢</div>
            <h2 className="text-xl font-bold text-red-400 mb-2">เกิดข้อผิดพลาด</h2>
            <p className="text-slate-400 mb-6">{error}</p>
            <Link
              href="/"
              className="inline-flex items-center px-6 py-3 bg-purple-600 hover:bg-purple-500 text-white font-medium rounded-xl transition-colors"
            >
              🏠 กลับหน้าแรก
            </Link>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-b from-slate-900 via-purple-950/20 to-slate-900 py-8 px-4">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-amber-400 bg-clip-text text-transparent mb-2">
              📜 ประวัติการดูดวง
            </h1>
            <p className="text-slate-400">
              ดูผลการดูดวงย้อนหลังของคุณ ({total} รายการ)
            </p>
          </div>

          {/* Search */}
          <div className="mb-4">
            <div className="relative">
              <input
                type="text"
                placeholder="🔍 ค้นหาจากคำถาม..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full px-4 py-3 pl-10 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500"
              />
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">🔍</span>
              {search && (
                <button
                  onClick={() => setSearch('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Date Range Filter */}
          <div className="flex gap-2 mb-4">
            {[
              { key: '7d', label: '7 วันล่าสุด' },
              { key: '30d', label: '30 วันล่าสุด' },
              { key: 'all', label: 'ทั้งหมด' },
            ].map(({ key, label }) => (
              <button
                key={key}
                onClick={() => handleDateRangeChange(key as '7d' | '30d' | 'all')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  dateRange === key
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Filter Tabs */}
          <div className="flex justify-center gap-2 mb-6">
            <button
              onClick={() => handleFilterChange('all')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === 'all'
                  ? 'bg-purple-600 text-white'
                  : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
              }`}
            >
              ทั้งหมด
            </button>
            <button
              onClick={() => handleFilterChange('daily')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === 'daily'
                  ? 'bg-amber-600 text-white'
                  : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
              }`}
            >
              ☀️ ประจำวัน
            </button>
            <button
              onClick={() => handleFilterChange('three_card')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === 'three_card'
                  ? 'bg-purple-600 text-white'
                  : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
              }`}
            >
              🌙 3 ใบ
            </button>
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="space-y-4">
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
            </div>
          )}

          {/* Readings List */}
          {!isLoading && readings.length === 0 && (
            <div className="text-center py-16">
              <div className="text-6xl mb-6">🔮</div>
              <h2 className="text-xl font-bold text-slate-400 mb-2">ยังไม่มีประวัติการดูดวง</h2>
              <p className="text-slate-500 mb-6">เริ่มดูดวงครั้งแรกของคุณเลย!</p>
              <Link
                href="/reading"
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-medium rounded-xl transition-all duration-300 shadow-lg shadow-purple-500/25"
              >
                🎴 เริ่มดูดวง
              </Link>
            </div>
          )}

          {!isLoading && readings.length > 0 && (
            <div className="space-y-4">
              {readings.map((reading) => (
                <ReadingHistoryCard
                  key={reading.id}
                  reading={reading}
                  onViewDetail={handleViewDetail}
                />
              ))}

              {/* Load More Button */}
              {hasMore && (
                <div className="flex justify-center pt-4">
                  <button
                    onClick={handleLoadMore}
                    disabled={isLoadingMore}
                    className="px-6 py-3 bg-slate-800 hover:bg-slate-700 disabled:bg-slate-800 text-slate-300 font-medium rounded-xl transition-colors flex items-center gap-2"
                  >
                    {isLoadingMore ? (
                      <>
                        <span className="animate-spin">⏳</span>
                        กำลังโหลด...
                      </>
                    ) : (
                      <>
                        📥 โหลดเพิ่มเติม
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Bottom Navigation */}
          <div className="mt-8 flex justify-center gap-4">
            <Link
              href="/reading"
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-medium rounded-xl transition-all duration-300"
            >
              🎴 ดูดวงใหม่
            </Link>
            <Link
              href="/"
              className="inline-flex items-center px-6 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium rounded-xl transition-colors"
            >
              🏠 หน้าแรก
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
