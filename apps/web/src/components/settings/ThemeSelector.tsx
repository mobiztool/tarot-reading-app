'use client';

import { useState } from 'react';
import { ThemeId, getAllThemes, getTheme } from '@/lib/themes';
import { useTheme } from '@/lib/hooks/useTheme';

interface ThemeSelectorProps {
  showPreview?: boolean;
}

export function ThemeSelector({ showPreview = true }: ThemeSelectorProps) {
  const { themeId, setTheme, isLoading } = useTheme();
  const [previewTheme, setPreviewTheme] = useState<ThemeId | null>(null);
  const themes = getAllThemes();

  const displayTheme = previewTheme ? getTheme(previewTheme) : getTheme(themeId);

  if (isLoading) {
    return (
      <div className="animate-pulse">
        <div className="h-8 bg-slate-700 rounded w-32 mb-4"></div>
        <div className="grid grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-32 bg-slate-700 rounded-xl"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-[var(--theme-text-primary)] mb-2">
          🎨 เลือกธีม
        </h3>
        <p className="text-sm text-[var(--theme-text-muted)]">
          ปรับแต่งรูปลักษณ์ของแอปให้เหมาะกับคุณ
        </p>
      </div>

      {/* Theme Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {themes.map((theme) => (
          <button
            key={theme.id}
            onClick={() => setTheme(theme.id)}
            onMouseEnter={() => setPreviewTheme(theme.id)}
            onMouseLeave={() => setPreviewTheme(null)}
            className={`
              relative p-4 rounded-xl border-2 transition-all duration-300
              ${themeId === theme.id
                ? 'border-[var(--theme-accent-primary)] shadow-lg shadow-[var(--theme-accent-primary)]/20'
                : 'border-[var(--theme-border-primary)] hover:border-[var(--theme-accent-secondary)]'
              }
            `}
            style={{
              backgroundColor: theme.colors.bgSecondary,
            }}
          >
            {/* Selected indicator */}
            {themeId === theme.id && (
              <div className="absolute top-2 right-2 w-6 h-6 bg-[var(--theme-accent-primary)] rounded-full flex items-center justify-center text-white text-sm">
                ✓
              </div>
            )}

            {/* Theme preview */}
            <div
              className="h-16 rounded-lg mb-3 overflow-hidden"
              style={{
                background: `linear-gradient(to bottom, ${theme.colors.bgGradientFrom}, ${theme.colors.bgGradientVia}, ${theme.colors.bgGradientTo})`,
              }}
            >
              {/* Mini card preview */}
              <div className="flex justify-center items-center h-full gap-1">
                <div
                  className="w-6 h-10 rounded"
                  style={{ backgroundColor: theme.colors.accentPrimary }}
                ></div>
                <div
                  className="w-6 h-10 rounded"
                  style={{ backgroundColor: theme.colors.accentSecondary }}
                ></div>
                <div
                  className="w-6 h-10 rounded"
                  style={{ backgroundColor: theme.colors.accentGold }}
                ></div>
              </div>
            </div>

            {/* Theme info */}
            <div className="text-center">
              <span className="text-2xl mb-1 block">{theme.emoji}</span>
              <h4
                className="font-medium text-sm"
                style={{ color: theme.colors.textPrimary }}
              >
                {theme.nameTh}
              </h4>
              <p
                className="text-xs mt-1"
                style={{ color: theme.colors.textMuted }}
              >
                {theme.name}
              </p>
            </div>
          </button>
        ))}
      </div>

      {/* Preview Section */}
      {showPreview && (
        <div
          className="p-6 rounded-xl border transition-all duration-300"
          style={{
            backgroundColor: displayTheme.colors.bgCard,
            borderColor: displayTheme.colors.borderSecondary,
          }}
        >
          <h4
            className="font-semibold mb-2"
            style={{ color: displayTheme.colors.textPrimary }}
          >
            ตัวอย่างธีม: {displayTheme.nameTh}
          </h4>
          <p
            className="text-sm mb-4"
            style={{ color: displayTheme.colors.textSecondary }}
          >
            {displayTheme.description}
          </p>

          <div className="flex gap-3">
            <button
              className="px-4 py-2 rounded-lg font-medium text-white transition-colors"
              style={{ backgroundColor: displayTheme.colors.accentPrimary }}
            >
              ปุ่มหลัก
            </button>
            <button
              className="px-4 py-2 rounded-lg font-medium transition-colors"
              style={{
                backgroundColor: 'transparent',
                color: displayTheme.colors.accentSecondary,
                border: `1px solid ${displayTheme.colors.borderSecondary}`,
              }}
            >
              ปุ่มรอง
            </button>
            <span
              className="px-4 py-2 rounded-lg font-medium"
              style={{
                backgroundColor: displayTheme.colors.accentGold,
                color: '#000',
              }}
            >
              ⭐ Gold
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

