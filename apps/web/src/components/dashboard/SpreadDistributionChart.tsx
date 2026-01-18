'use client';

/**
 * Spread Distribution Chart
 * Story 9.5: Premium User Dashboard & Statistics
 * 
 * Pie/Donut chart showing spread type usage
 */

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from 'recharts';
import type { SpreadDistributionItem } from '@/lib/dashboard/types';

interface SpreadDistributionChartProps {
  data: SpreadDistributionItem[];
}

export function SpreadDistributionChart({ data }: SpreadDistributionChartProps) {
  const total = data.reduce((sum, d) => sum + d.count, 0);

  // Custom tooltip
  const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: Array<{ payload: SpreadDistributionItem }> }) => {
    if (active && payload && payload.length) {
      const item = payload[0].payload;
      return (
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-3 shadow-xl">
          <p className="font-medium text-white">{item.spreadTypeTh}</p>
          <p className="text-slate-400 text-sm">
            {item.count} ครั้ง ({item.percentage}%)
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <span>🥧</span>
            รูปแบบที่ใช้บ่อย
          </h3>
          <p className="text-slate-400 text-sm mt-1">
            รวม {total} ครั้ง ใน {data.length} รูปแบบ
          </p>
        </div>
      </div>

      {data.length === 0 ? (
        <div className="h-64 flex items-center justify-center text-slate-500">
          <div className="text-center">
            <p className="text-4xl mb-2">🔮</p>
            <p>ยังไม่มีข้อมูลการดูดวง</p>
          </div>
        </div>
      ) : (
        <div className="flex flex-col md:flex-row items-center gap-6">
          {/* Chart */}
          <div className="h-64 w-full md:w-1/2">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data as unknown as Array<Record<string, unknown>>}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="count"
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Legend */}
          <div className="w-full md:w-1/2 space-y-2">
            {data.slice(0, 6).map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-700/30 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-slate-300 text-sm">{item.spreadTypeTh}</span>
                </div>
                <div className="text-right">
                  <span className="text-white font-medium">{item.count}</span>
                  <span className="text-slate-500 text-sm ml-1">({item.percentage}%)</span>
                </div>
              </div>
            ))}
            {data.length > 6 && (
              <p className="text-slate-500 text-sm text-center pt-2">
                +{data.length - 6} รูปแบบอื่นๆ
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
