/**
 * Dashboard Types
 * Story 9.5: Premium User Dashboard & Statistics
 */

import { SubscriptionTier } from '@/types/subscription';

export interface DashboardSummary {
  totalReadings: number;
  readingsThisWeek: number;
  readingsThisMonth: number;
  favoriteSpread: string | null;
  favoriteSpreadTh: string | null;
  mostCommonCard: string | null;
  mostCommonCardTh: string | null;
  currentStreak: number;
  longestStreak: number;
  memberSince: string;
}

export interface ActivityDataPoint {
  date: string;
  count: number;
  label: string;
}

export interface SpreadDistributionItem {
  spreadType: string;
  spreadTypeTh: string;
  count: number;
  percentage: number;
  color: string;
}

export interface FavoriteCard {
  cardId: string;
  cardName: string;
  cardNameTh: string;
  imageUrl: string;
  count: number;
  percentage: number;
  lastDrawn: string;
}

export interface RecentReading {
  id: string;
  spreadType: string;
  spreadTypeTh: string;
  question: string | null;
  createdAt: string;
  cardCount: number;
  isFavorite: boolean;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  emoji: string;
  earned: boolean;
  earnedAt: string | null;
  progress?: number;
  requirement?: string;
}

export interface SubscriptionInfo {
  tier: SubscriptionTier;
  status: string;
  currentPeriodEnd: string | null;
  cancelAt: string | null;
  isTrialing: boolean;
}

export interface AIInsight {
  type: 'pattern' | 'recommendation' | 'summary';
  title: string;
  content: string;
  generatedAt: string;
}

export interface DashboardData {
  summary: DashboardSummary;
  activityData: ActivityDataPoint[];
  spreadDistribution: SpreadDistributionItem[];
  favoriteCards: FavoriteCard[];
  recentReadings: RecentReading[];
  badges: Badge[];
  subscription: SubscriptionInfo | null;
  aiInsights: AIInsight[] | null;
}

export type TimeRange = '7d' | '30d' | '90d' | 'all';
