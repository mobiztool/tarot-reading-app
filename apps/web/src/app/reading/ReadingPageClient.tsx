'use client';

/**
 * Reading Page Client Component
 * Story 7.8: Spread Recommendation Engine
 * 
 * Handles question input and personalized recommendations
 */

import { useState, useCallback } from 'react';
import { SubscriptionTier } from '@/types/subscription';
import { SpreadRecommendations } from '@/components/recommendation';
import { SpreadRecommendation } from '@/lib/recommendation';
import { trackEvent } from '@/lib/analytics';

interface ReadingPageClientProps {
  userTier: SubscriptionTier;
}

export function ReadingPageClient({ userTier }: ReadingPageClientProps) {
  const [question, setQuestion] = useState('');
  const [hasInteracted, setHasInteracted] = useState(false);

  const handleQuestionChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newQuestion = e.target.value;
    setQuestion(newQuestion);
    
    if (!hasInteracted && newQuestion.length > 0) {
      setHasInteracted(true);
      trackEvent('recommendation_question_started', {
        source: 'reading_page',
      });
    }
  }, [hasInteracted]);

  const handleRecommendationClick = useCallback((recommendation: SpreadRecommendation, accepted: boolean) => {
    trackEvent('recommendation_accepted', {
      spread_id: recommendation.spread.id,
      spread_name: recommendation.spread.name,
      question_length: question.length,
      has_question: question.length >= 3,
      accepted,
    });
  }, [question]);

  return (
    <div className="mb-12">
      {/* Question Input Section */}
      <div className="max-w-2xl mx-auto mb-8">
        <label htmlFor="question" className="block text-sm font-medium text-purple-200 mb-2">
          คุณมีคำถามอะไรในใจ? (ไม่บังคับ)
        </label>
        <div className="relative">
          <textarea
            id="question"
            value={question}
            onChange={handleQuestionChange}
            placeholder="พิมพ์คำถามของคุณที่นี่... เช่น 'ความรักของฉันจะเป็นอย่างไร' หรือ 'ควรเปลี่ยนงานไหม'"
            className="w-full px-4 py-3 bg-white/10 border border-purple-500/30 rounded-xl text-white placeholder-purple-400/60 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent resize-none transition-all"
            rows={3}
            maxLength={500}
          />
          <div className="absolute bottom-2 right-3 text-xs text-purple-400">
            {question.length}/500
          </div>
        </div>
        <p className="mt-2 text-xs text-purple-400">
          ระบบจะแนะนำรูปแบบการ์ดที่เหมาะกับคำถามของคุณ
        </p>
      </div>

      {/* Recommendations Section */}
      <SpreadRecommendations
        question={question}
        userTier={userTier}
        maxRecommendations={3}
        onRecommendationClick={handleRecommendationClick}
        className="mb-8"
      />

      {/* Divider */}
      <div className="flex items-center gap-4 mb-8">
        <div className="flex-1 h-px bg-purple-500/30"></div>
        <span className="text-purple-400 text-sm">หรือเลือกจากรูปแบบทั้งหมด</span>
        <div className="flex-1 h-px bg-purple-500/30"></div>
      </div>
    </div>
  );
}
