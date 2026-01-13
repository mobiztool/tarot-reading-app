'use client';

import Link from 'next/link';
import { SPREAD_INFO, type SpreadInfo } from '@/lib/access-control';
import { SUBSCRIPTION_TIERS } from '@/lib/subscription/tiers';
import { SubscriptionTier } from '@/types/subscription';

interface SpreadCardProps {
  spread: SpreadInfo;
  hasAccess: boolean;
  currentTier: SubscriptionTier;
}

function SpreadCard({ spread, hasAccess, currentTier }: SpreadCardProps) {
  const tierBadge: Record<SubscriptionTier, { label: string; color: string }> = {
    free: { label: 'ฟรี', color: 'bg-slate-600 text-slate-300' },
    basic: { label: 'Basic', color: 'bg-blue-600/50 text-blue-200' },
    pro: { label: 'Pro', color: 'bg-purple-600/50 text-purple-200' },
    vip: { label: 'VIP', color: 'bg-amber-600/50 text-amber-200' },
  };

  return (
    <div
      className={`relative flex items-center gap-4 p-4 rounded-xl transition-all ${
        hasAccess
          ? 'bg-slate-700/30 hover:bg-slate-700/50'
          : 'bg-slate-800/30 opacity-60'
      }`}
    >
      {/* Icon */}
      <div
        className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${
          hasAccess ? 'bg-purple-600/30' : 'bg-slate-700/50'
        }`}
      >
        {hasAccess ? spread.icon : '🔒'}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <h3 className="text-slate-200 font-medium truncate">{spread.nameTh}</h3>
          <span
            className={`text-xs px-2 py-0.5 rounded-full ${tierBadge[spread.minimumTier].color}`}
          >
            {tierBadge[spread.minimumTier].label}
          </span>
        </div>
        <p className="text-slate-500 text-sm truncate">{spread.descriptionTh}</p>
        <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
          <span>🃏 {spread.cardCount} ใบ</span>
          <span>⏱️ {spread.estimatedTime}</span>
        </div>
      </div>

      {/* Status/Action */}
      <div className="flex-shrink-0">
        {hasAccess ? (
          <Link
            href={spread.route}
            className="px-3 py-1.5 bg-purple-600/30 hover:bg-purple-600/50 text-purple-200 text-sm rounded-lg transition-colors"
          >
            เริ่มเลย →
          </Link>
        ) : (
          <Link
            href="/pricing"
            className="text-purple-400 text-sm hover:text-purple-300"
          >
            อัปเกรด →
          </Link>
        )}
      </div>
    </div>
  );
}

interface SpreadAccessSectionProps {
  currentTier?: SubscriptionTier;
}

export function SpreadAccessSection({ currentTier = 'free' }: SpreadAccessSectionProps) {
  const tierOrder: Record<SubscriptionTier, number> = {
    free: 0,
    basic: 1,
    pro: 2,
    vip: 3,
  };

  // Get all available spreads
  const allSpreads = Object.values(SPREAD_INFO).filter(
    (spread) => spread.isAvailable
  );

  // Check if user can access spread based on tier
  const canAccess = (spread: SpreadInfo) => {
    return tierOrder[currentTier] >= tierOrder[spread.minimumTier];
  };

  // Separate into accessible and locked
  const accessibleSpreads = allSpreads.filter(canAccess);
  const lockedSpreads = allSpreads.filter((spread) => !canAccess(spread));

  // Future spreads (not yet available)
  const futureSpreads = Object.values(SPREAD_INFO).filter(
    (spread) => !spread.isAvailable
  );

  const tierDisplay = SUBSCRIPTION_TIERS[currentTier];

  return (
    <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-8 shadow-xl mb-6">
      <h2 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
        🎴 รูปแบบการดูดวง
      </h2>
      <p className="text-slate-400 text-sm mb-6">
        รูปแบบที่คุณเข้าถึงได้ตามระดับสมาชิก
        <span className="ml-2 px-2 py-0.5 bg-purple-600/30 text-purple-300 rounded text-xs">
          {tierDisplay.nameTh}
        </span>
      </p>

      {/* Accessible Spreads */}
      <div className="space-y-3 mb-6">
        <h3 className="text-slate-400 text-sm font-medium flex items-center gap-2">
          ✅ เข้าถึงได้ ({accessibleSpreads.length})
        </h3>
        {accessibleSpreads.map((spread) => (
          <SpreadCard
            key={spread.id}
            spread={spread}
            hasAccess={true}
            currentTier={currentTier}
          />
        ))}
      </div>

      {/* Locked Spreads */}
      {lockedSpreads.length > 0 && (
        <div className="space-y-3 mb-6">
          <h3 className="text-slate-500 text-sm font-medium flex items-center gap-2">
            🔒 ต้องอัพเกรด ({lockedSpreads.length})
          </h3>
          {lockedSpreads.map((spread) => (
            <SpreadCard
              key={spread.id}
              spread={spread}
              hasAccess={false}
              currentTier={currentTier}
            />
          ))}
        </div>
      )}

      {/* Upgrade CTA */}
      {currentTier !== 'vip' && (
        <div className="mt-6 p-4 bg-gradient-to-r from-purple-900/30 to-pink-900/30 rounded-xl border border-purple-500/30">
          <p className="text-purple-200 text-sm mb-3">
            ✨ อัปเกรดเพื่อปลดล็อครูปแบบเพิ่มเติม
          </p>
          <Link
            href="/pricing"
            className="inline-block px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white text-sm rounded-lg transition-colors"
          >
            ดูแพ็คเกจทั้งหมด →
          </Link>
        </div>
      )}

      {/* Future Spreads Preview */}
      {futureSpreads.length > 0 && (
        <div className="mt-6 pt-6 border-t border-slate-700/50">
          <h3 className="text-slate-500 text-sm font-medium flex items-center gap-2 mb-3">
            🔮 เร็วๆ นี้
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {futureSpreads.map((spread) => (
              <div
                key={spread.id}
                className="flex items-center gap-2 p-2 bg-slate-800/30 rounded-lg opacity-50"
              >
                <span className="text-xl">{spread.icon}</span>
                <div>
                  <p className="text-slate-400 text-sm">{spread.nameTh}</p>
                  <p className="text-slate-600 text-xs">{spread.cardCount} ใบ</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default SpreadAccessSection;
