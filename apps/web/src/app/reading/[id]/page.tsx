'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import { TarotCard } from '@/components/cards';
import { Header } from '@/components/layout/Header';
import { ShareButtons } from '@/components/share';
import { ReadingNotes, FavoriteButton, EditableQuestion } from '@/components/reading';
import { PDFExportButton } from '@/components/export';
import { useAuth, useAnalytics } from '@/lib/hooks';
import { format } from 'date-fns';
import { th } from 'date-fns/locale';
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
    meaningUpright: string;
    meaningReversed: string;
    keywordsUpright: string[];
    keywordsReversed: string[];
    advice: string;
  };
}

interface ReadingDetail {
  id: string;
  userId: string | null;
  readingType: 'daily' | 'three_card';
  question: string | null;
  createdAt: string;
  updatedAt: string;
  isFavorite: boolean;
  notes: string | null;
  cards: ReadingCard[];
}

const POSITION_LABELS: Record<string, { th: string; emoji: string; color: string }> = {
  past: { th: 'อดีต', emoji: '', color: 'from-blue-500 to-blue-600' },
  present: { th: 'ปัจจุบัน', emoji: '', color: 'from-purple-500 to-purple-600' },
  future: { th: 'อนาคต', emoji: '', color: 'from-amber-500 to-amber-600' },
};

export default function ReadingDetailPage() {
  const router = useRouter();
  const params = useParams();
  const readingId = params?.id as string;
  
  const { user, isLoading: authLoading } = useAuth();
  const { track } = useAnalytics();

  const [reading, setReading] = useState<ReadingDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [selectedCard, setSelectedCard] = useState<ReadingCard | null>(null);

  useEffect(() => {
    if (!readingId) return;
    
    async function fetchReading() {
      try {
        const response = await fetch(`/api/readings/${readingId}`);
        const data = await response.json();

        if (data.success) {
          setReading(data.data);
          track('reading_detail_viewed', { readingId });
        } else {
          throw new Error(data.error || 'Failed to fetch reading');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setIsLoading(false);
      }
    }

    fetchReading();
  }, [readingId, track]);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const response = await fetch(`/api/readings/${readingId}`, {
        method: 'DELETE',
      });
      const data = await response.json();

      if (data.success) {
        track('reading_deleted', { readingId });
        router.push('/history');
      } else {
        throw new Error(data.error || 'Failed to delete reading');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      setIsDeleting(false);
    }
  };

  if (!readingId) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gradient-to-b from-slate-900 via-purple-950/20 to-slate-900 flex items-center justify-center px-4">
          <div className="text-center">
            <div className="text-6xl mb-6">X</div>
            <h2 className="text-xl font-bold text-red-400 mb-2">ไม่พบรหัสการดูดวง</h2>
            <Link
              href="/history"
              className="inline-flex items-center px-6 py-3 bg-purple-600 hover:bg-purple-500 text-white font-medium rounded-xl transition-colors mt-4"
            >
              กลับไปประวัติ
            </Link>
          </div>
        </div>
      </>
    );
  }

  if (isLoading || authLoading) {
    return (
      <>
        <Header />
        <PageLoader message="กำลังโหลด..." />
      </>
    );
  }

  if (error || !reading) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gradient-to-b from-slate-900 via-purple-950/20 to-slate-900 flex items-center justify-center px-4">
          <div className="text-center">
            <div className="text-6xl mb-6">?</div>
            <h2 className="text-xl font-bold text-red-400 mb-2">ไม่พบการดูดวงนี้</h2>
            <p className="text-slate-400 mb-6">{error || 'อาจถูกลบไปแล้วหรือคุณไม่มีสิทธิ์เข้าถึง'}</p>
            <Link
              href="/history"
              className="inline-flex items-center px-6 py-3 bg-purple-600 hover:bg-purple-500 text-white font-medium rounded-xl transition-colors"
            >
              กลับไปประวัติ
            </Link>
          </div>
        </div>
      </>
    );
  }

  let formattedDate = '';
  try {
    formattedDate = format(new Date(reading.createdAt), 'd MMMM yyyy HH:mm', { locale: th });
  } catch {
    formattedDate = reading.createdAt;
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-b from-slate-900 via-purple-950/20 to-slate-900 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-800/50 rounded-full text-sm text-slate-400 mb-4">
              {formattedDate}
            </div>
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-amber-400 bg-clip-text text-transparent mb-2">
              {reading.readingType === 'daily' ? 'ดูดวงประจำวัน' : 'ไพ่ 3 ใบ'}
            </h1>
          </div>

          <EditableQuestion
            readingId={reading.id}
            initialQuestion={reading.question}
            onUpdate={(q) => setReading((prev) => prev ? { ...prev, question: q } : null)}
          />

          <div
            className={`grid gap-8 mb-8 ${
              reading.readingType === 'three_card'
                ? 'grid-cols-1 md:grid-cols-3'
                : 'grid-cols-1 max-w-md mx-auto'
            }`}
          >
            {reading.cards.map((rc) => (
              <div
                key={rc.position}
                className={`text-center cursor-pointer transition-transform hover:scale-105 ${
                  selectedCard?.position === rc.position ? 'ring-2 ring-purple-500 rounded-2xl' : ''
                }`}
                onClick={() => setSelectedCard(selectedCard?.position === rc.position ? null : rc)}
              >
                {rc.positionLabel && POSITION_LABELS[rc.positionLabel] && (
                  <div
                    className={`inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r ${POSITION_LABELS[rc.positionLabel].color} rounded-full text-sm text-white font-medium mb-4`}
                  >
                    {POSITION_LABELS[rc.positionLabel].th}
                  </div>
                )}

                <div className="flex justify-center mb-4">
                  <TarotCard
                    frontImage={rc.card.imageUrl}
                    cardName={rc.card.nameTh}
                    size="lg"
                    isReversed={rc.isReversed}
                    isFlipped={true}
                    showFlipAnimation={false}
                  />
                </div>

                <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-purple-300 font-card mb-1">
                  {rc.card.nameTh}
                </h2>
                <p className="text-purple-400 font-card">{rc.card.name}</p>
                {rc.isReversed && (
                  <span className="inline-flex items-center gap-1 px-2 py-1 bg-pink-500/20 text-pink-300 rounded-full text-xs mt-2">
                    กลับหัว
                  </span>
                )}
              </div>
            ))}
          </div>

          {selectedCard && (
            <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6 mb-8 animate-fadeIn">
              <h3 className="text-xl font-bold text-purple-300 mb-4 font-card">
                {selectedCard.card.nameTh} - คำทำนาย
              </h3>

              <div className="flex flex-wrap gap-2 mb-4">
                {(selectedCard.isReversed
                  ? (selectedCard.card.keywordsReversed || [])
                  : (selectedCard.card.keywordsUpright || [])
                ).map((keyword, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-sm"
                  >
                    {String(keyword)}
                  </span>
                ))}
              </div>

              <div className="mb-4">
                <h4 className="text-sm font-medium text-slate-400 mb-2">
                  {selectedCard.isReversed ? 'ความหมายเมื่อกลับหัว' : 'ความหมาย'}
                </h4>
                <p className="text-slate-300 leading-relaxed">
                  {selectedCard.isReversed
                    ? selectedCard.card.meaningReversed
                    : selectedCard.card.meaningUpright}
                </p>
              </div>

              <div>
                <h4 className="text-sm font-medium text-slate-400 mb-2">คำแนะนำ</h4>
                <p className="text-slate-300 leading-relaxed">{selectedCard.card.advice}</p>
              </div>
            </div>
          )}

          <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6 mb-8">
            <ShareButtons
              readingId={reading.id}
              readingType={reading.readingType}
              cards={reading.cards.map((rc) => ({
                name: rc.card.name,
                nameTh: rc.card.nameTh,
                isReversed: rc.isReversed,
                positionLabel: rc.positionLabel || undefined,
                imageUrl: rc.card.imageUrl,
              }))}
            />
          </div>

          <div className="flex items-center justify-center gap-4 mb-6">
            <FavoriteButton
              readingId={reading.id}
              initialFavorite={reading.isFavorite}
              size="lg"
            />
            
            {/* PDF Export Button - Story 9.3 */}
            <PDFExportButton
              readingId={reading.id}
              readingType={reading.readingType}
              cardCount={reading.cards.length}
              size="lg"
            />
          </div>

          <div className="mb-8">
            <ReadingNotes readingId={reading.id} initialNotes={reading.notes} />
          </div>

          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <Link
              href="/history"
              className="inline-flex items-center px-6 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium rounded-xl transition-colors"
            >
              กลับไปประวัติ
            </Link>

            <Link
              href="/reading"
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-medium rounded-xl transition-all duration-300"
            >
              ดูดวงใหม่
            </Link>

            {user && reading.userId === user.id && (
              <button
                onClick={() => setShowDeleteModal(true)}
                className="inline-flex items-center px-6 py-3 bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/50 font-medium rounded-xl transition-colors"
              >
                ลบ
              </button>
            )}
          </div>
        </div>
      </div>

      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4">
          <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 max-w-md w-full">
            <h3 className="text-xl font-bold text-red-400 mb-4">ยืนยันการลบ</h3>
            <p className="text-slate-400 mb-6">
              คุณแน่ใจหรือไม่ว่าต้องการลบการดูดวงนี้? การดำเนินการนี้ไม่สามารถย้อนกลับได้
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => setShowDeleteModal(false)}
                disabled={isDeleting}
                className="flex-1 px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white font-medium rounded-xl transition-colors"
              >
                ยกเลิก
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="flex-1 px-6 py-3 bg-red-600 hover:bg-red-500 disabled:bg-slate-600 text-white font-medium rounded-xl transition-colors"
              >
                {isDeleting ? 'กำลังลบ...' : 'ลบเลย'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
