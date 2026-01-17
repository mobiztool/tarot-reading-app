'use client';

/**
 * Reading Patterns Analysis Page
 * VIP-exclusive feature for pattern analysis (Story 9.4)
 */

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  BarChart3, 
  PieChart, 
  TrendingUp, 
  Sparkles, 
  Crown, 
  ArrowLeft,
  Loader2,
  AlertCircle,
  BookOpen,
  GitCompare,
} from 'lucide-react';
import { usePremiumStatus } from '@/lib/hooks/usePremiumStatus';
import { useAuth } from '@/lib/hooks/useAuth';
import {
  CardFrequencyChart,
  ThemeDistributionChart,
  TimelineChart,
  DayPatternChart,
  SpreadUsageChart,
  InsightsList,
} from '@/components/patterns';
import type { PatternAnalysisResult } from '@/lib/patterns/types';

export default function PatternsPage(): React.JSX.Element {
  const router = useRouter();
  const { user, isLoading: isLoadingAuth } = useAuth();
  const { isVip, isLoading: isLoadingTier, tier } = usePremiumStatus();
  
  const [analysis, setAnalysis] = useState<PatternAnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Fetch pattern analysis
  useEffect(() => {
    async function fetchAnalysis(): Promise<void> {
      if (!user || !isVip) return;
      
      try {
        setIsLoading(true);
        setError(null);
        
        const response = await fetch('/api/patterns/analyze');
        const result = await response.json();
        
        if (result.success) {
          setAnalysis(result.data);
        } else {
          setError(result.error || 'เกิดข้อผิดพลาด');
        }
      } catch (err) {
        console.error('Pattern fetch error:', err);
        setError('ไม่สามารถโหลดข้อมูลได้');
      } finally {
        setIsLoading(false);
      }
    }
    
    if (!isLoadingAuth && !isLoadingTier && user && isVip) {
      fetchAnalysis();
    } else if (!isLoadingAuth && !isLoadingTier) {
      setIsLoading(false);
    }
  }, [user, isVip, isLoadingAuth, isLoadingTier]);
  
  // Loading state
  if (isLoadingAuth || isLoadingTier || isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-purple-500 mx-auto mb-4" />
          <p className="text-gray-400">กำลังวิเคราะห์รูปแบบ...</p>
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
            คุณต้องเข้าสู่ระบบเพื่อดูการวิเคราะห์รูปแบบ
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
            วิเคราะห์รูปแบบการดูดวง
          </h1>
          <p className="text-gray-400 mb-6">
            ค้นพบ insight จากประวัติการดูดวงของคุณ<br />
            ไพ่ที่ปรากฏบ่อย, หัวข้อที่สนใจ, และอื่นๆ
          </p>
          
          <div className="grid grid-cols-2 gap-3 mb-6 text-left">
            <div className="flex items-center gap-2 text-gray-300">
              <BarChart3 className="w-4 h-4 text-purple-400" />
              <span className="text-sm">ไพ่ที่ปรากฏบ่อย</span>
            </div>
            <div className="flex items-center gap-2 text-gray-300">
              <PieChart className="w-4 h-4 text-pink-400" />
              <span className="text-sm">หัวข้อที่สนใจ</span>
            </div>
            <div className="flex items-center gap-2 text-gray-300">
              <TrendingUp className="w-4 h-4 text-green-400" />
              <span className="text-sm">แนวโน้มการดูดวง</span>
            </div>
            <div className="flex items-center gap-2 text-gray-300">
              <Sparkles className="w-4 h-4 text-yellow-400" />
              <span className="text-sm">Insights ส่วนตัว</span>
            </div>
          </div>
          
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
  
  // Insufficient data
  if (analysis && !analysis.sufficientData) {
    return (
      <div className="min-h-screen bg-gray-900 p-4">
        <div className="max-w-2xl mx-auto pt-8">
          <Link
            href="/profile"
            className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            กลับไปโปรไฟล์
          </Link>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center bg-gray-800/50 rounded-2xl p-8 border border-gray-700"
          >
            <BookOpen className="w-16 h-16 text-purple-400 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-white mb-2">
              ต้องการข้อมูลเพิ่มเติม
            </h1>
            <p className="text-gray-400 mb-4">
              คุณมีการดูดวง {analysis.readingCount} ครั้ง<br />
              ต้องการอย่างน้อย {analysis.minimumReadingsRequired} ครั้งเพื่อวิเคราะห์รูปแบบ
            </p>
            
            <div className="w-full bg-gray-700 rounded-full h-3 mb-6">
              <div
                className="bg-gradient-to-r from-purple-500 to-purple-600 h-3 rounded-full transition-all"
                style={{ 
                  width: `${Math.min((analysis.readingCount / analysis.minimumReadingsRequired) * 100, 100)}%` 
                }}
              />
            </div>
            
            <p className="text-sm text-gray-500 mb-6">
              อีก {analysis.minimumReadingsRequired - analysis.readingCount} ครั้งจะปลดล็อค Pattern Analysis
            </p>
            
            <Link
              href="/reading"
              className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              <Sparkles className="w-5 h-5" />
              ดูดวงเลย
            </Link>
          </motion.div>
        </div>
      </div>
    );
  }
  
  // Main analysis view
  return (
    <div className="min-h-screen bg-gray-900 p-4">
      <div className="max-w-6xl mx-auto pt-8 pb-16">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link
              href="/profile"
              className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold text-white">Pattern Analysis</h1>
                <span className="px-2 py-0.5 bg-yellow-500/20 text-yellow-400 text-xs rounded-full">
                  VIP
                </span>
              </div>
              <p className="text-gray-400 text-sm">
                วิเคราะห์จาก {analysis?.readingCount || 0} ครั้งการดูดวง
              </p>
            </div>
          </div>
          
          <Link
            href="/profile/patterns/compare"
            className="inline-flex items-center gap-2 px-4 py-2 bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700 hover:text-white transition-colors"
          >
            <GitCompare className="w-4 h-4" />
            <span className="hidden sm:inline">เปรียบเทียบ</span>
          </Link>
        </div>
        
        {analysis && (
          <div className="space-y-6">
            {/* Insights Row */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700"
            >
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-5 h-5 text-yellow-400" />
                <h2 className="text-lg font-semibold text-white">Insights ส่วนตัว</h2>
              </div>
              <InsightsList insights={analysis.insights} />
            </motion.section>
            
            {/* Charts Grid */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Card Frequency */}
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700"
              >
                <div className="flex items-center gap-2 mb-4">
                  <BarChart3 className="w-5 h-5 text-purple-400" />
                  <h2 className="text-lg font-semibold text-white">ไพ่ที่ปรากฏบ่อย</h2>
                </div>
                {analysis.frequentCards.length > 0 ? (
                  <CardFrequencyChart data={analysis.frequentCards} />
                ) : (
                  <p className="text-gray-500 text-center py-8">ยังไม่มีข้อมูล</p>
                )}
              </motion.section>
              
              {/* Theme Distribution */}
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700"
              >
                <div className="flex items-center gap-2 mb-4">
                  <PieChart className="w-5 h-5 text-pink-400" />
                  <h2 className="text-lg font-semibold text-white">หัวข้อที่สนใจ</h2>
                </div>
                {analysis.themes.length > 0 ? (
                  <ThemeDistributionChart data={analysis.themes} />
                ) : (
                  <p className="text-gray-500 text-center py-8">ลองใส่คำถามตอนดูดวงเพื่อวิเคราะห์หัวข้อ</p>
                )}
              </motion.section>
            </div>
            
            {/* Timeline & Spread Usage */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Reading Timeline */}
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700"
              >
                <div className="flex items-center gap-2 mb-4">
                  <TrendingUp className="w-5 h-5 text-green-400" />
                  <h2 className="text-lg font-semibold text-white">แนวโน้มการดูดวง</h2>
                </div>
                {analysis.monthlyReadings.length > 0 ? (
                  <TimelineChart data={analysis.monthlyReadings} />
                ) : (
                  <p className="text-gray-500 text-center py-8">ยังไม่มีข้อมูล</p>
                )}
              </motion.section>
              
              {/* Spread Usage */}
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700"
              >
                <div className="flex items-center gap-2 mb-4">
                  <BarChart3 className="w-5 h-5 text-emerald-400" />
                  <h2 className="text-lg font-semibold text-white">รูปแบบที่ใช้บ่อย</h2>
                </div>
                {analysis.spreadUsage.length > 0 ? (
                  <SpreadUsageChart data={analysis.spreadUsage} />
                ) : (
                  <p className="text-gray-500 text-center py-8">ยังไม่มีข้อมูล</p>
                )}
              </motion.section>
            </div>
            
            {/* Day Pattern */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700"
            >
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="w-5 h-5 text-pink-400" />
                <h2 className="text-lg font-semibold text-white">วันที่ดูดวงบ่อย</h2>
              </div>
              {analysis.dayPatterns.length > 0 ? (
                <DayPatternChart data={analysis.dayPatterns} />
              ) : (
                <p className="text-gray-500 text-center py-8">ยังไม่มีข้อมูล</p>
              )}
            </motion.section>
            
            {/* Top Cards Gallery */}
            {analysis.frequentCards.length > 0 && (
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700"
              >
                <h2 className="text-lg font-semibold text-white mb-4">ไพ่ประจำตัว Top 5</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                  {analysis.frequentCards.slice(0, 5).map((card, index) => (
                    <div key={card.cardId} className="text-center">
                      <div className="relative aspect-[2/3] mb-2">
                        <img
                          src={card.imageUrl}
                          alt={card.cardName}
                          className="w-full h-full object-cover rounded-lg"
                        />
                        <span className="absolute -top-2 -right-2 w-6 h-6 bg-purple-600 text-white text-xs font-bold rounded-full flex items-center justify-center">
                          {index + 1}
                        </span>
                      </div>
                      <p className="text-sm font-medium text-white truncate">{card.cardNameTh}</p>
                      <p className="text-xs text-gray-400">{card.count} ครั้ง</p>
                    </div>
                  ))}
                </div>
              </motion.section>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
