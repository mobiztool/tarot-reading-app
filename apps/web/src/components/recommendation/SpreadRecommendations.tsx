'use client';

/**
 * Spread Recommendations Component
 * Story 7.8: Spread Recommendation Engine
 * 
 * Displays "Suggested for you" section with personalized spread recommendations
 * Based on user's question and tier
 */

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { SubscriptionTier } from '@/types/subscription';
import { SUBSCRIPTION_TIERS } from '@/lib/subscription/tiers';
import {
  getSpreadRecommendations,
  getDefaultRecommendations,
  SpreadRecommendation,
} from '@/lib/recommendation';
import { trackEvent } from '@/lib/analytics';

interface SpreadRecommendationsProps {
  question?: string;
  userTier: SubscriptionTier;
  maxRecommendations?: number;
  onRecommendationClick?: (recommendation: SpreadRecommendation, accepted: boolean) => void;
  className?: string;
}

export function SpreadRecommendations({
  question = '',
  userTier,
  maxRecommendations = 3,
  onRecommendationClick,
  className = '',
}: SpreadRecommendationsProps) {
  const router = useRouter();
  const [showReasons, setShowReasons] = useState<Set<string>>(new Set());
  const [isVisible, setIsVisible] = useState(false);

  // Get recommendations based on question
  const result = useMemo(() => {
    if (question.trim().length >= 3) {
      return getSpreadRecommendations(question, userTier, maxRecommendations);
    }
    return getDefaultRecommendations(userTier, maxRecommendations);
  }, [question, userTier, maxRecommendations]);

  const { recommendations, hasMatches, primaryCategory } = result;

  // Animate in on mount
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  // Track recommendation shown
  useEffect(() => {
    if (recommendations.length > 0) {
      trackEvent('recommendation_shown', {
        question_length: question.length,
        has_matches: hasMatches,
        primary_category: primaryCategory || 'default',
        recommendation_count: recommendations.length,
        spread_ids: recommendations.map((r) => r.spread.id).join(','),
      });
    }
  }, [recommendations, hasMatches, primaryCategory, question.length]);

  const handleRecommendationClick = (recommendation: SpreadRecommendation): void => {
    // Track click
    trackEvent('recommendation_clicked', {
      spread_id: recommendation.spread.id,
      spread_name: recommendation.spread.name,
      is_accessible: recommendation.isAccessible,
      match_category: recommendation.matchedCategory,
      match_score: recommendation.matchScore,
    });

    if (onRecommendationClick) {
      onRecommendationClick(recommendation, true);
    }

    if (recommendation.isAccessible) {
      router.push(recommendation.spread.route);
    } else {
      router.push(`/gate/premium?spread=${recommendation.spread.id}&tier=${recommendation.requiredTier}`);
    }
  };

  const toggleReason = (spreadId: string): void => {
    setShowReasons((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(spreadId)) {
        newSet.delete(spreadId);
      } else {
        newSet.add(spreadId);
      }
      return newSet;
    });
  };

  const tierColors: Record<SubscriptionTier, string> = {
    free: 'bg-gray-500',
    basic: 'bg-blue-500',
    pro: 'bg-purple-500',
    vip: 'bg-gradient-to-r from-yellow-400 to-orange-500',
  };

  if (recommendations.length === 0) {
    return null;
  }

  return (
    <div className={`${className}`}>
      {/* Section Header */}
      <div className="flex items-center gap-3 mb-4">
        <span className="text-2xl">✨</span>
        <h2 className="text-xl font-semibold text-white">
          {hasMatches ? 'แนะนำสำหรับคุณ' : 'รูปแบบยอดนิยม'}
        </h2>
        {hasMatches && primaryCategory && (
          <span className="px-3 py-1 bg-purple-500/20 rounded-full text-xs text-purple-300 border border-purple-500/30">
            จากคำถามของคุณ
          </span>
        )}
      </div>

      {/* Question Preview */}
      {question && hasMatches && (
        <div className="mb-4 p-3 bg-white/5 rounded-lg border border-purple-500/20">
          <p className="text-sm text-purple-300 italic">
            &ldquo;{question.length > 100 ? `${question.slice(0, 100)}...` : question}&rdquo;
          </p>
        </div>
      )}

      {/* Recommendations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {recommendations.map((recommendation, index) => {
          const { spread, isAccessible, matchedCategory } = recommendation;
          const showReason = showReasons.has(spread.id);

          return (
            <div
              key={spread.id}
              className={`relative rounded-2xl p-5 border cursor-pointer group
                transition-all duration-300 ease-out
                ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}
                ${isAccessible 
                  ? 'bg-gradient-to-br from-purple-900/50 to-indigo-900/50 border-purple-500/40 hover:border-purple-400/60 hover:scale-[1.02]' 
                  : 'bg-white/5 border-purple-500/20 hover:bg-white/10'}
                ${index === 0 && hasMatches ? 'ring-2 ring-purple-500/50' : ''}
              `}
              style={{ transitionDelay: `${index * 100}ms` }}
              onClick={() => handleRecommendationClick(recommendation)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleRecommendationClick(recommendation);
                }
              }}
            >
              {/* Best Match Badge */}
              {index === 0 && hasMatches && (
                <div className="absolute -top-2 left-4">
                  <span className="px-3 py-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full text-xs font-semibold text-white shadow-lg">
                    เหมาะที่สุด
                  </span>
                </div>
              )}

              {/* Tier Badge */}
              {spread.minimumTier !== 'free' && (
                <div className="absolute top-3 right-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold text-white ${tierColors[spread.minimumTier]}`}>
                    {SUBSCRIPTION_TIERS[spread.minimumTier].nameTh}
                  </span>
                </div>
              )}

              {/* Lock Icon */}
              {!isAccessible && (
                <div className="absolute top-3 left-3">
                  <div className="w-7 h-7 bg-black/50 rounded-full flex items-center justify-center">
                    <span className="text-sm">🔒</span>
                  </div>
                </div>
              )}

              {/* Content */}
              <div className={`${!isAccessible ? 'opacity-60' : ''}`}>
                {/* Icon & Title */}
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-3xl">{spread.icon}</span>
                  <div>
                    <h3 className="text-lg font-semibold text-white">
                      {spread.nameTh}
                    </h3>
                    <p className="text-sm text-purple-300">
                      {spread.descriptionTh}
                    </p>
                  </div>
                </div>

                {/* Meta */}
                <div className="flex items-center gap-4 text-xs text-purple-400 mb-3">
                  <span className="flex items-center gap-1">
                    <span>🎴</span>
                    <span>{spread.cardCount} ใบ</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <span>⏱️</span>
                    <span>{spread.estimatedTime}</span>
                  </span>
                </div>

                {/* Why This Spread Button */}
                {hasMatches && matchedCategory !== 'popular' && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleReason(spread.id);
                    }}
                    className="text-xs text-purple-400 hover:text-purple-300 flex items-center gap-1 transition-colors"
                  >
                    <span>💡</span>
                    <span>{showReason ? 'ซ่อนเหตุผล' : 'ทำไมแนะนำรูปแบบนี้?'}</span>
                  </button>
                )}

                {/* Reason Expansion */}
                <div
                  className={`overflow-hidden transition-all duration-300 ease-out ${
                    showReason ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'
                  }`}
                >
                  <div className="mt-3 pt-3 border-t border-purple-500/20">
                    <p className="text-sm text-purple-300">
                      {recommendation.reasonTh}
                    </p>
                    {recommendation.matchedKeywords.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1">
                        {recommendation.matchedKeywords.slice(0, 3).map((keyword) => (
                          <span
                            key={keyword}
                            className="px-2 py-0.5 bg-purple-500/20 rounded text-xs text-purple-300"
                          >
                            {keyword}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Unlock CTA */}
              {!isAccessible && (
                <div className="mt-3 pt-3 border-t border-purple-500/20">
                  <span className="text-sm text-purple-300 flex items-center gap-2">
                    <span>✨</span>
                    <span>อัปเกรดเพื่อปลดล็อก</span>
                  </span>
                </div>
              )}

              {/* Hover Effect for Accessible */}
              {isAccessible && (
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-500/0 via-purple-500/5 to-pink-500/0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
