'use client';

/**
 * Recent Readings Widget
 * Story 9.5: Premium User Dashboard & Statistics
 * 
 * Displays last 5 readings with quick preview
 */

import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { th } from 'date-fns/locale';
import type { RecentReading } from '@/lib/dashboard/types';

interface RecentReadingsWidgetProps {
  readings: RecentReading[];
}

export function RecentReadingsWidget({ readings }: RecentReadingsWidgetProps) {
  return (
    <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          <span>📜</span>
          การดูดวงล่าสุด
        </h3>
        <Link
          href="/history"
          className="text-sm text-purple-400 hover:text-purple-300 transition-colors"
        >
          ดูทั้งหมด →
        </Link>
      </div>

      {readings.length === 0 ? (
        <div className="text-center py-8 text-slate-500">
          <p className="text-3xl mb-2">🔮</p>
          <p className="text-sm">ยังไม่มีประวัติการดูดวง</p>
          <Link
            href="/reading"
            className="inline-block mt-3 px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white text-sm rounded-lg transition-colors"
          >
            เริ่มดูดวง
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {readings.map((reading) => (
            <Link
              key={reading.id}
              href={`/reading/result/${reading.id}`}
              className="block p-3 bg-slate-700/30 hover:bg-slate-700/50 rounded-xl transition-colors group"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-white">
                      {reading.spreadTypeTh}
                    </span>
                    {reading.isFavorite && (
                      <span className="text-yellow-400 text-xs">⭐</span>
                    )}
                  </div>
                  {reading.question && (
                    <p className="text-slate-400 text-xs mt-1 truncate">
                      {reading.question}
                    </p>
                  )}
                  <div className="flex items-center gap-2 mt-1 text-xs text-slate-500">
                    <span>{reading.cardCount} ใบ</span>
                    <span>•</span>
                    <span>
                      {formatDistanceToNow(new Date(reading.createdAt), {
                        addSuffix: true,
                        locale: th,
                      })}
                    </span>
                  </div>
                </div>
                <span className="text-slate-500 group-hover:text-slate-300 transition-colors">
                  →
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
