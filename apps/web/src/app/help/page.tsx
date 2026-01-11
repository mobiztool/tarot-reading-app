'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { useAnalytics } from '@/lib/hooks';
import {
  FAQS,
  FAQ_CATEGORIES,
  searchFAQs,
  getFAQsByCategory,
  type FAQ,
  type FAQCategory,
} from '@/lib/help/faqs';

export default function HelpPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<FAQCategory | 'all'>('all');
  const [expandedFAQ, setExpandedFAQ] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<Record<string, boolean | null>>({});
  const { track } = useAnalytics();

  // Filter FAQs based on search and category
  const filteredFAQs = useMemo(() => {
    let results = searchQuery ? searchFAQs(searchQuery) : FAQS;
    if (selectedCategory !== 'all') {
      results = results.filter((faq) => faq.category === selectedCategory);
    }
    return results;
  }, [searchQuery, selectedCategory]);

  // Group FAQs by category for display
  const groupedFAQs = useMemo(() => {
    if (selectedCategory !== 'all') {
      return { [selectedCategory]: filteredFAQs };
    }
    
    const groups: Record<string, FAQ[]> = {};
    filteredFAQs.forEach((faq) => {
      if (!groups[faq.category]) {
        groups[faq.category] = [];
      }
      groups[faq.category].push(faq);
    });
    return groups;
  }, [filteredFAQs, selectedCategory]);

  const handleToggleFAQ = (id: string) => {
    const newExpanded = expandedFAQ === id ? null : id;
    setExpandedFAQ(newExpanded);
    if (newExpanded) {
      track('help_faq_viewed', { faq_id: id });
    }
  };

  const handleFeedback = (faqId: string, helpful: boolean) => {
    setFeedback((prev) => ({ ...prev, [faqId]: helpful }));
    track('help_feedback', { faq_id: faqId, helpful });
  };

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-b from-slate-900 via-purple-950/20 to-slate-900 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full flex items-center justify-center shadow-lg shadow-purple-500/30">
              <span className="text-4xl">❓</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-300 to-amber-300 mb-4">
              ศูนย์ช่วยเหลือ
            </h1>
            <p className="text-slate-400 text-lg">
              พบคำตอบสำหรับคำถามที่พบบ่อย หรือติดต่อทีมสนับสนุน
            </p>
          </div>

          {/* Search */}
          <div className="mb-8">
            <div className="relative">
              <input
                type="text"
                placeholder="🔍 ค้นหาคำถาม..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-6 py-4 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                >
                  ✕
                </button>
              )}
            </div>
            {searchQuery && (
              <p className="text-slate-500 text-sm mt-2">
                พบ {filteredFAQs.length} ผลลัพธ์สำหรับ &quot;{searchQuery}&quot;
              </p>
            )}
          </div>

          {/* Category Tabs */}
          <div className="flex flex-wrap gap-2 mb-8">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                selectedCategory === 'all'
                  ? 'bg-purple-600 text-white'
                  : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
              }`}
            >
              ทั้งหมด
            </button>
            {Object.entries(FAQ_CATEGORIES).map(([key, cat]) => (
              <button
                key={key}
                onClick={() => setSelectedCategory(key as FAQCategory)}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  selectedCategory === key
                    ? 'bg-purple-600 text-white'
                    : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                }`}
              >
                {cat.emoji} {cat.title}
              </button>
            ))}
          </div>

          {/* FAQs */}
          {Object.keys(groupedFAQs).length > 0 ? (
            Object.entries(groupedFAQs).map(([category, faqs]) => (
              <div key={category} className="mb-8">
                {selectedCategory === 'all' && (
                  <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                    {FAQ_CATEGORIES[category as FAQCategory]?.emoji}{' '}
                    {FAQ_CATEGORIES[category as FAQCategory]?.title}
                  </h2>
                )}

                <div className="space-y-3">
                  {faqs.map((faq) => (
                    <div
                      key={faq.id}
                      className="bg-slate-800/50 border border-slate-700/50 rounded-xl overflow-hidden"
                    >
                      {/* Question */}
                      <button
                        onClick={() => handleToggleFAQ(faq.id)}
                        className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-slate-700/30 transition-colors"
                      >
                        <span className="text-white font-medium pr-4">{faq.question}</span>
                        <span
                          className={`text-purple-400 transition-transform ${
                            expandedFAQ === faq.id ? 'rotate-180' : ''
                          }`}
                        >
                          ▼
                        </span>
                      </button>

                      {/* Answer */}
                      {expandedFAQ === faq.id && (
                        <div className="px-6 pb-4 animate-fadeIn">
                          <div className="border-t border-slate-700/50 pt-4">
                            <p className="text-slate-400 whitespace-pre-line">{faq.answer}</p>

                            {/* Feedback */}
                            <div className="mt-4 pt-4 border-t border-slate-700/50">
                              {feedback[faq.id] === undefined ? (
                                <div className="flex items-center gap-4">
                                  <span className="text-slate-500 text-sm">
                                    คำตอบนี้เป็นประโยชน์ไหม?
                                  </span>
                                  <div className="flex gap-2">
                                    <button
                                      onClick={() => handleFeedback(faq.id, true)}
                                      className="px-3 py-1 bg-green-500/20 hover:bg-green-500/30 text-green-400 rounded-lg transition-colors text-sm"
                                    >
                                      👍 ใช่
                                    </button>
                                    <button
                                      onClick={() => handleFeedback(faq.id, false)}
                                      className="px-3 py-1 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-colors text-sm"
                                    >
                                      👎 ไม่
                                    </button>
                                  </div>
                                </div>
                              ) : (
                                <p className="text-slate-500 text-sm">
                                  {feedback[faq.id]
                                    ? '✅ ขอบคุณสำหรับความคิดเห็น!'
                                    : '📝 ขอบคุณ! เราจะปรับปรุงคำตอบนี้'}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🔍</div>
              <p className="text-slate-400">ไม่พบคำถามที่ตรงกับการค้นหา</p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                }}
                className="mt-4 text-purple-400 hover:text-purple-300"
              >
                ล้างการค้นหา
              </button>
            </div>
          )}

          {/* Contact Section */}
          <div className="mt-12 bg-gradient-to-br from-purple-900/30 to-indigo-900/30 border border-purple-500/30 rounded-2xl p-8 text-center">
            <h2 className="text-2xl font-bold text-white mb-4">
              ยังไม่พบคำตอบที่ต้องการ?
            </h2>
            <p className="text-slate-400 mb-6">
              ทีมสนับสนุนของเราพร้อมช่วยเหลือคุณ
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="mailto:support@tarot-app.com"
                onClick={() => track('help_contact_clicked', { method: 'email' })}
                className="inline-flex items-center justify-center px-6 py-3 bg-purple-600 hover:bg-purple-500 text-white rounded-xl transition-colors"
              >
                📧 ส่งอีเมลถึงเรา
              </a>
              <Link
                href="https://facebook.com/tarotapp"
                target="_blank"
                onClick={() => track('help_contact_clicked', { method: 'facebook' })}
                className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl transition-colors"
              >
                💬 แชทบน Facebook
              </Link>
            </div>

            <p className="text-slate-500 text-sm mt-6">
              ตอบกลับภายใน 24 ชั่วโมง (วันทำการ)
            </p>
          </div>

          {/* Quick Links */}
          <div className="mt-12 grid md:grid-cols-3 gap-4">
            <Link
              href="/privacy"
              className="p-6 bg-slate-800/50 border border-slate-700/50 rounded-xl hover:border-purple-500/50 transition-colors text-center"
            >
              <div className="text-3xl mb-2">🔒</div>
              <h3 className="text-white font-medium">นโยบายความเป็นส่วนตัว</h3>
              <p className="text-slate-500 text-sm mt-1">ข้อมูลของคุณปลอดภัย</p>
            </Link>
            <Link
              href="/terms"
              className="p-6 bg-slate-800/50 border border-slate-700/50 rounded-xl hover:border-purple-500/50 transition-colors text-center"
            >
              <div className="text-3xl mb-2">📜</div>
              <h3 className="text-white font-medium">ข้อกำหนดการใช้งาน</h3>
              <p className="text-slate-500 text-sm mt-1">เงื่อนไขการใช้บริการ</p>
            </Link>
            <Link
              href="/cards"
              className="p-6 bg-slate-800/50 border border-slate-700/50 rounded-xl hover:border-purple-500/50 transition-colors text-center"
            >
              <div className="text-3xl mb-2">📚</div>
              <h3 className="text-white font-medium">คู่มือไพ่ยิปซี</h3>
              <p className="text-slate-500 text-sm mt-1">ความหมายไพ่ 78 ใบ</p>
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

