/**
 * Component Tests: Dashboard Widgets
 * Story 9.5: Premium User Dashboard & Statistics
 * 
 * Tests for dashboard UI components
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { DashboardStats } from '@/components/dashboard/DashboardStats';
import { StreakWidget } from '@/components/dashboard/StreakWidget';
import { BadgesWidget } from '@/components/dashboard/BadgesWidget';
import { QuickActions } from '@/components/dashboard/QuickActions';
import type { DashboardSummary, Badge } from '@/lib/dashboard/types';

// Mock next/navigation
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    refresh: vi.fn(),
  }),
  useSearchParams: () => new URLSearchParams(),
}));

// Mock next/link
vi.mock('next/link', () => ({
  default: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}));

const mockSummary: DashboardSummary = {
  totalReadings: 50,
  readingsThisWeek: 7,
  readingsThisMonth: 28,
  favoriteSpread: 'three_card',
  favoriteSpreadTh: '3 ใบ',
  mostCommonCard: 'The Fool',
  mostCommonCardTh: 'คนโง่',
  currentStreak: 5,
  longestStreak: 14,
  memberSince: '2025-01-01T00:00:00.000Z',
};

const mockBadges: Badge[] = [
  { id: 'first_reading', name: 'ผู้แสวงหา', description: 'ดูดวงครั้งแรก', emoji: '🔮', earned: true, earnedAt: '2025-01-01', progress: 100 },
  { id: 'reading_master', name: 'ปรมาจารย์', description: 'ดูดวงครบ 50 ครั้ง', emoji: '🎓', earned: true, earnedAt: '2025-06-01', progress: 100 },
  { id: 'daily_reader', name: 'นักอ่านประจำวัน', description: 'ดูดวงรายวัน 7 วันติดต่อกัน', emoji: '📅', earned: false, earnedAt: null, progress: 70 },
];

describe('DashboardStats Component', () => {
  it('should render total readings count', () => {
    render(<DashboardStats stats={mockSummary} />);
    expect(screen.getByText('50')).toBeInTheDocument();
  });

  it('should render weekly readings', () => {
    render(<DashboardStats stats={mockSummary} />);
    expect(screen.getByText('7')).toBeInTheDocument();
  });

  it('should render monthly readings', () => {
    render(<DashboardStats stats={mockSummary} />);
    expect(screen.getByText('28')).toBeInTheDocument();
  });

  it('should render current streak', () => {
    render(<DashboardStats stats={mockSummary} />);
    expect(screen.getByText('5 วัน')).toBeInTheDocument();
  });

  it('should render stat labels in Thai', () => {
    render(<DashboardStats stats={mockSummary} />);
    expect(screen.getByText('การดูดวงทั้งหมด')).toBeInTheDocument();
    expect(screen.getByText('สัปดาห์นี้')).toBeInTheDocument();
    expect(screen.getByText('เดือนนี้')).toBeInTheDocument();
    expect(screen.getByText('Streak ปัจจุบัน')).toBeInTheDocument();
  });
});

describe('StreakWidget Component', () => {
  it('should render current streak', () => {
    render(<StreakWidget currentStreak={5} longestStreak={14} />);
    // Current streak appears twice (main display + stats grid)
    expect(screen.getAllByText('5').length).toBeGreaterThanOrEqual(1);
  });

  it('should render longest streak', () => {
    render(<StreakWidget currentStreak={5} longestStreak={14} />);
    expect(screen.getAllByText('14').length).toBeGreaterThanOrEqual(1);
  });

  it('should show motivation when streak is 0', () => {
    render(<StreakWidget currentStreak={0} longestStreak={14} />);
    expect(screen.getByText('ดูดวงวันนี้เพื่อเริ่มต้น Streak!')).toBeInTheDocument();
  });

  it('should not show motivation when streak is active', () => {
    render(<StreakWidget currentStreak={5} longestStreak={14} />);
    expect(screen.queryByText('ดูดวงวันนี้เพื่อเริ่มต้น Streak!')).not.toBeInTheDocument();
  });
});

describe('BadgesWidget Component', () => {
  it('should render badge count', () => {
    render(<BadgesWidget badges={mockBadges} totalReadings={50} />);
    expect(screen.getByText('2/3')).toBeInTheDocument();
  });

  it('should render earned badges with emoji', () => {
    render(<BadgesWidget badges={mockBadges} totalReadings={50} />);
    expect(screen.getByText('🔮')).toBeInTheDocument();
    expect(screen.getByText('🎓')).toBeInTheDocument();
  });

  it('should render badge names', () => {
    render(<BadgesWidget badges={mockBadges} totalReadings={50} />);
    // Badge names appear in both card and tooltip
    expect(screen.getAllByText('ผู้แสวงหา').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('ปรมาจารย์').length).toBeGreaterThanOrEqual(1);
  });
});

describe('QuickActions Component', () => {
  it('should render quick action buttons', () => {
    render(<QuickActions favoriteSpread="three_card" />);
    expect(screen.getByText('ดูดวงใหม่')).toBeInTheDocument();
    expect(screen.getByText('ประวัติการดู')).toBeInTheDocument();
    expect(screen.getByText('จัดการสมาชิก')).toBeInTheDocument();
  });

  it('should render favorite spread button when available', () => {
    render(<QuickActions favoriteSpread="three_card" />);
    expect(screen.getByText('รูปแบบโปรด')).toBeInTheDocument();
  });

  it('should render daily card button when no favorite', () => {
    render(<QuickActions favoriteSpread={null} />);
    expect(screen.getByText('ไพ่ประจำวัน')).toBeInTheDocument();
  });

  it('should have correct navigation links', () => {
    render(<QuickActions favoriteSpread={null} />);
    const readingLink = screen.getByText('ดูดวงใหม่').closest('a');
    const historyLink = screen.getByText('ประวัติการดู').closest('a');
    const billingLink = screen.getByText('จัดการสมาชิก').closest('a');

    expect(readingLink).toHaveAttribute('href', '/reading');
    expect(historyLink).toHaveAttribute('href', '/history');
    expect(billingLink).toHaveAttribute('href', '/profile/billing');
  });
});

describe('Responsive Layout', () => {
  it('DashboardStats should have grid layout', () => {
    const { container } = render(<DashboardStats stats={mockSummary} />);
    const grid = container.querySelector('.grid');
    expect(grid).toBeInTheDocument();
    expect(grid).toHaveClass('grid-cols-2');
  });

  it('QuickActions should have grid layout', () => {
    const { container } = render(<QuickActions favoriteSpread={null} />);
    const grid = container.querySelector('.grid');
    expect(grid).toBeInTheDocument();
    expect(grid).toHaveClass('grid-cols-2');
  });
});
