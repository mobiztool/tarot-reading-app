// Theme System for Tarot Reading App

export type ThemeId = 'dark-mystical' | 'light-ethereal' | 'deep-ocean' | 'cosmic-purple';

export interface Theme {
  id: ThemeId;
  name: string;
  nameTh: string;
  description: string;
  emoji: string;
  colors: {
    // Background colors
    bgPrimary: string;
    bgSecondary: string;
    bgCard: string;
    bgGradientFrom: string;
    bgGradientVia: string;
    bgGradientTo: string;
    
    // Text colors
    textPrimary: string;
    textSecondary: string;
    textMuted: string;
    
    // Accent colors
    accentPrimary: string;
    accentSecondary: string;
    accentGold: string;
    
    // Border colors
    borderPrimary: string;
    borderSecondary: string;
  };
}

export const themes: Record<ThemeId, Theme> = {
  'dark-mystical': {
    id: 'dark-mystical',
    name: 'Dark Mystical',
    nameTh: 'มืดลึกลับ',
    description: 'ธีมมืดคลาสสิก เหมาะกับบรรยากาศลึกลับและน่าพิศวง',
    emoji: '🌙',
    colors: {
      bgPrimary: '#0f172a',
      bgSecondary: '#1e293b',
      bgCard: 'rgba(30, 41, 59, 0.5)',
      bgGradientFrom: '#0f172a',
      bgGradientVia: 'rgba(88, 28, 135, 0.2)',
      bgGradientTo: '#0f172a',
      textPrimary: '#f1f5f9',
      textSecondary: '#cbd5e1',
      textMuted: '#64748b',
      accentPrimary: '#a855f7',
      accentSecondary: '#6366f1',
      accentGold: '#fbbf24',
      borderPrimary: 'rgba(148, 163, 184, 0.2)',
      borderSecondary: 'rgba(139, 92, 246, 0.3)',
    },
  },
  'light-ethereal': {
    id: 'light-ethereal',
    name: 'Light Ethereal',
    nameTh: 'สว่างนวล',
    description: 'ธีมสว่างนุ่มนวล สบายตา เหมาะกับการใช้งานตอนกลางวัน',
    emoji: '☀️',
    colors: {
      bgPrimary: '#faf5ff',
      bgSecondary: '#f3e8ff',
      bgCard: 'rgba(243, 232, 255, 0.8)',
      bgGradientFrom: '#faf5ff',
      bgGradientVia: 'rgba(233, 213, 255, 0.5)',
      bgGradientTo: '#fdf4ff',
      textPrimary: '#1e1b4b',
      textSecondary: '#4c1d95',
      textMuted: '#7c3aed',
      accentPrimary: '#7c3aed',
      accentSecondary: '#a855f7',
      accentGold: '#d97706',
      borderPrimary: 'rgba(124, 58, 237, 0.2)',
      borderSecondary: 'rgba(168, 85, 247, 0.3)',
    },
  },
  'deep-ocean': {
    id: 'deep-ocean',
    name: 'Deep Ocean',
    nameTh: 'มหาสมุทรลึก',
    description: 'ธีมสีน้ำเงินเข้ม เหมือนดำดิ่งสู่ก้นทะเล',
    emoji: '🌊',
    colors: {
      bgPrimary: '#0c1929',
      bgSecondary: '#0f2847',
      bgCard: 'rgba(15, 40, 71, 0.6)',
      bgGradientFrom: '#0c1929',
      bgGradientVia: 'rgba(6, 78, 120, 0.3)',
      bgGradientTo: '#0a1628',
      textPrimary: '#e0f2fe',
      textSecondary: '#7dd3fc',
      textMuted: '#38bdf8',
      accentPrimary: '#0ea5e9',
      accentSecondary: '#06b6d4',
      accentGold: '#f59e0b',
      borderPrimary: 'rgba(56, 189, 248, 0.2)',
      borderSecondary: 'rgba(14, 165, 233, 0.3)',
    },
  },
  'cosmic-purple': {
    id: 'cosmic-purple',
    name: 'Cosmic Purple',
    nameTh: 'จักรวาลม่วง',
    description: 'ธีมม่วงเข้มสไตล์อวกาศ เหมาะกับการดูดวง',
    emoji: '🔮',
    colors: {
      bgPrimary: '#1a0a2e',
      bgSecondary: '#2d1b4e',
      bgCard: 'rgba(45, 27, 78, 0.6)',
      bgGradientFrom: '#1a0a2e',
      bgGradientVia: 'rgba(88, 28, 135, 0.4)',
      bgGradientTo: '#16082a',
      textPrimary: '#f5f3ff',
      textSecondary: '#ddd6fe',
      textMuted: '#a78bfa',
      accentPrimary: '#c084fc',
      accentSecondary: '#e879f9',
      accentGold: '#fcd34d',
      borderPrimary: 'rgba(167, 139, 250, 0.2)',
      borderSecondary: 'rgba(192, 132, 252, 0.3)',
    },
  },
};

export const DEFAULT_THEME: ThemeId = 'dark-mystical';

export function getTheme(themeId: ThemeId): Theme {
  return themes[themeId] || themes[DEFAULT_THEME];
}

export function getAllThemes(): Theme[] {
  return Object.values(themes);
}

// Generate CSS variables from theme
export function getThemeCSSVariables(theme: Theme): Record<string, string> {
  return {
    '--theme-bg-primary': theme.colors.bgPrimary,
    '--theme-bg-secondary': theme.colors.bgSecondary,
    '--theme-bg-card': theme.colors.bgCard,
    '--theme-bg-gradient-from': theme.colors.bgGradientFrom,
    '--theme-bg-gradient-via': theme.colors.bgGradientVia,
    '--theme-bg-gradient-to': theme.colors.bgGradientTo,
    '--theme-text-primary': theme.colors.textPrimary,
    '--theme-text-secondary': theme.colors.textSecondary,
    '--theme-text-muted': theme.colors.textMuted,
    '--theme-accent-primary': theme.colors.accentPrimary,
    '--theme-accent-secondary': theme.colors.accentSecondary,
    '--theme-accent-gold': theme.colors.accentGold,
    '--theme-border-primary': theme.colors.borderPrimary,
    '--theme-border-secondary': theme.colors.borderSecondary,
  };
}


