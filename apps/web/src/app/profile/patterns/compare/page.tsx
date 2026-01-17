'use client';

/**
 * Reading Comparison Page
 * VIP feature for comparing two readings side-by-side (Story 9.4)
 */

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { th } from 'date-fns/locale';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  Loader2, 
  Crown, 
  AlertCircle,
  GitCompare,
  Check,
} from 'lucide-react';
import { usePremiumStatus } from '@/lib/hooks/usePremiumStatus';
import { useAuth } from '@/lib/hooks/useAuth';
import { ReadingComparison } from '@/components/patterns';

interface ReadingListItem {
  id: string;
  createdAt: string;
  readingType: string;
  readingTypeTh: string;
  question: string | null;
  cardCount: number;
}

const SPREAD_NAMES_TH: Record<string, string> = {
  daily: 'ไพ่รายวัน',
  three_card: 'ไพ่ 3 ใบ',
  love_relationships: 'ความรัก',
  career_money: 'การงาน-การเงิน',
  yes_no: 'ใช่/ไม่ใช่',
  celtic_cross: 'Celtic Cross',
  decision_making: 'การตัดสินใจ',
  self_discovery: 'ค้นหาตัวเอง',
  relationship_deep_dive: 'ความสัมพันธ์เชิงลึก',
  chakra_alignment: 'จักระ',
  shadow_work: 'Shadow Work',
  friendship: 'มิตรภาพ',
  career_path: 'เส้นทางอาชีพ',
  financial_abundance: 'ความมั่งคั่ง',
};

export default function ComparePage(): React.JSX.Element {
  const router = useRouter();
  const { user, isLoading: isLoadingAuth } = useAuth();
  const { isVip, isLoading: isLoadingTier, tier } = usePremiumStatus();
  
  const [readings, setReadings] = useState<ReadingListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [selected1, setSelected1] = useState<string | null>(null);
  const [selected2, setSelected2] = useState<string | null>(null);
  const [showComparison, setShowComparison] = useState(false);
  
  // Fetch user's readings
  useEffect(() => {
    async function fetchReadings(): Promise<void> {
      if (!user || !isVip) return;
      
      try {
        setIsLoading(true);
        setError(null);
        
        const response = await fetch('/api/readings');
        const result = await response.json();
        
        if (result.readings) {
          setReadings(result.readings.map((r: {
            id: string;
            createdAt: string;
            readingType: string;
            question: string | null;
            _count: { cards: number };
          }) => ({
            id: r.id,
            createdAt: r.createdAt,
            readingType: r.readingType,
            readingTypeTh: SPREAD_NAMES_TH[r.readingType] || r.readingType,
            question: r.question,
            cardCount: r._count?.cards || 0,
          })));
        }
      } catch (err) {
        console.error('Readings fetch error:', err);
        setError('ไม่สามารถโหลดรายการได้');
      } finally {
        setIsLoading(false);
      }
    }
    
    if (!isLoadingAuth && !isLoadingTier && user && isVip) {
      fetchReadings();
    } else if (!isLoadingAuth && !isLoadingTier) {
      setIsLoading(false);
    }
  }, [user, isVip, isLoadingAuth, isLoadingTier]);
  
  const handleSelect = (readingId: string): void => {
    if (selected1 === readingId) {
      setSelected1(null);
    } else if (selected2 === readingId) {
      setSelected2(null);
    } else if (!selected1) {
      setSelected1(readingId);
    } else if (!selected2) {
      setSelected2(readingId);
    } else {
      // Both selected, replace first
      setSelected1(selected2);
      setSelected2(readingId);
    }
  };
  
  const handleCompare = (): void => {
    if (selected1 && selected2) {
      setShowComparison(true);
    }
  };
  
  // Loading state
  if (isLoadingAuth || isLoadingTier || isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-purple-500 mx-auto mb-4" />
          <p className="text-gray-400">กำลังโหลด...</p>
        </div>
      </div>
    );
  }
  
  // Not logged in
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <AlertCircle className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-white mb-2">กรุณาเข้าสู่ระบบ</h1>
          <p className="text-gray-400 mb-6">
            คุณต้องเข้าสู่ระบบเพื่อใช้ฟีเจอร์เปรียบเทียบ
          </p>
          <Link
            href="/auth/login"
            className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            เข้าสู่ระบบ
          </Link>
        </div>
      </div>
    );
  }
  
  // VIP Gate
  if (!isVip) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-lg bg-gray-800/50 rounded-2xl p-8 border border-gray-700"
        >
          <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <Crown className="w-10 h-10 text-white" />
          </div>
          <span className="inline-block px-3 py-1 bg-yellow-500/20 text-yellow-400 text-sm rounded-full mb-4">
            VIP Exclusive
          </span>
          <h1 className="text-2xl font-bold text-white mb-2">
            เปรียบเทียบการดูดวง
          </h1>
          <p className="text-gray-400 mb-6">
            เปรียบเทียบ 2 การดูดวงเพื่อค้นหารูปแบบและธีมที่คงที่
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/pricing"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-yellow-500 to-yellow-600 text-black font-semibold rounded-lg hover:from-yellow-400 hover:to-yellow-500 transition-all"
            >
              <Crown className="w-5 h-5" />
              อัพเกรดเป็น VIP
            </Link>
            <button
              onClick={() => router.back()}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-gray-600 text-gray-300 rounded-lg hover:border-gray-500 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              กลับ
            </button>
          </div>
          
          <p className="text-xs text-gray-500 mt-4">
            แพ็คเกจปัจจุบัน: {tier === 'free' ? 'ฟรี' : tier === 'basic' ? 'Basic' : tier === 'pro' ? 'Pro' : tier}
          </p>
        </motion.div>
      </div>
    );
  }
  
  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-white mb-2">เกิดข้อผิดพลาด</h1>
          <p className="text-gray-400 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            ลองอีกครั้ง
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-900 p-4">
      <div className="max-w-4xl mx-auto pt-8 pb-16">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Link
            href="/profile/patterns"
            className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-white">เปรียบเทียบการดูดวง</h1>
              <span className="px-2 py-0.5 bg-yellow-500/20 text-yellow-400 text-xs rounded-full">
                VIP
              </span>
            </div>
            <p className="text-gray-400 text-sm">
              เลือก 2 รายการเพื่อเปรียบเทียบ
            </p>
          </div>
        </div>
        
        {/* Selection status */}
        <div className="flex items-center justify-between mb-4 bg-gray-800/50 rounded-lg p-4">
          <div className="flex items-center gap-4">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              selected1 ? 'bg-purple-600' : 'bg-gray-700'
            }`}>
              {selected1 ? <Check className="w-4 h-4 text-white" /> : '1'}
            </div>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              selected2 ? 'bg-pink-600' : 'bg-gray-700'
            }`}>
              {selected2 ? <Check className="w-4 h-4 text-white" /> : '2'}
            </div>
            <span className="text-gray-400 text-sm">
              {selected1 && selected2 
                ? 'พร้อมเปรียบเทียบ'
                : `เลือกอีก ${2 - (selected1 ? 1 : 0) - (selected2 ? 1 : 0)} รายการ`}
            </span>
          </div>
          <button
            onClick={handleCompare}
            disabled={!selected1 || !selected2}
            className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <GitCompare className="w-4 h-4" />
            เปรียบเทียบ
          </button>
        </div>
        
        {/* Comparison View */}
        {showComparison && selected1 && selected2 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <ReadingComparison
              reading1Id={selected1}
              reading2Id={selected2}
              onClose={() => setShowComparison(false)}
            />
          </motion.div>
        )}
        
        {/* Reading List */}
        <div className="space-y-2">
          {readings.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <p>ยังไม่มีประวัติการดูดวง</p>
              <Link
                href="/reading"
                className="inline-block mt-4 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                เริ่มดูดวง
              </Link>
            </div>
          ) : (
            readings.map((reading) => {
              const isSelected = selected1 === reading.id || selected2 === reading.id;
              const selectionNumber = selected1 === reading.id ? 1 : selected2 === reading.id ? 2 : null;
              
              return (
                <motion.button
                  key={reading.id}
                  onClick={() => handleSelect(reading.id)}
                  className={`w-full text-left p-4 rounded-xl border transition-all ${
                    isSelected
                      ? selectionNumber === 1
                        ? 'bg-purple-900/30 border-purple-500'
                        : 'bg-pink-900/30 border-pink-500'
                      : 'bg-gray-800/50 border-gray-700 hover:border-gray-600'
                  }`}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      {isSelected && (
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          selectionNumber === 1 ? 'bg-purple-600' : 'bg-pink-600'
                        }`}>
                          <span className="text-white text-sm font-bold">{selectionNumber}</span>
                        </div>
                      )}
                      <div>
                        <h3 className="font-medium text-white">{reading.readingTypeTh}</h3>
                        <p className="text-sm text-gray-400">
                          {format(new Date(reading.createdAt), 'd MMM yyyy HH:mm', { locale: th })}
                          {' • '}{reading.cardCount} ไพ่
                        </p>
                        {reading.question && (
                          <p className="text-sm text-gray-500 truncate max-w-md mt-1">
                            "{reading.question}"
                          </p>
                        )}
                      </div>
                    </div>
                    {!isSelected && (
                      <span className="text-gray-500 text-sm">คลิกเพื่อเลือก</span>
                    )}
                  </div>
                </motion.button>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
