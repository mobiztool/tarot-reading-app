'use client';

/**
 * Reading Activity Chart
 * Story 9.5: Premium User Dashboard & Statistics
 * 
 * Line/Area chart showing reading frequency over time
 */

import { useMemo } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import type { ActivityDataPoint } from '@/lib/dashboard/types';

interface ReadingActivityChartProps {
  data: ActivityDataPoint[];
  timeRange: '7d' | '30d' | '90d' | 'all';
}

export function ReadingActivityChart({ data, timeRange }: ReadingActivityChartProps) {
  // Sample data for better display on longer time ranges
  const chartData = useMemo(() => {
    if (timeRange === '90d' || timeRange === 'all') {
      // Group by week for longer ranges
      const weeklyData: ActivityDataPoint[] = [];
      for (let i = 0; i < data.length; i += 7) {
        const weekSlice = data.slice(i, i + 7);
        const total = weekSlice.reduce((sum, d) => sum + d.count, 0);
        if (weekSlice.length > 0) {
          weeklyData.push({
            date: weekSlice[0].date,
            count: total,
            label: weekSlice[0].label,
          });
        }
      }
      return weeklyData;
    }
    return data;
  }, [data, timeRange]);

  const totalReadings = data.reduce((sum, d) => sum + d.count, 0);
  const avgPerDay = data.length > 0 ? (totalReadings / data.length).toFixed(1) : '0';

  return (
    <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <span>📈</span>
            กิจกรรมการดูดวง
          </h3>
          <p className="text-slate-400 text-sm mt-1">
            รวม {totalReadings} ครั้ง • เฉลี่ย {avgPerDay} ครั้ง/วัน
          </p>
        </div>
      </div>

      {chartData.length === 0 || totalReadings === 0 ? (
        <div className="h-64 flex items-center justify-center text-slate-500">
          <div className="text-center">
            <p className="text-4xl mb-2">📊</p>
            <p>ยังไม่มีข้อมูลการดูดวงในช่วงเวลานี้</p>
          </div>
        </div>
      ) : (
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={chartData}
              margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorReadings" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis
                dataKey="label"
                stroke="#94a3b8"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                interval="preserveStartEnd"
              />
              <YAxis
                stroke="#94a3b8"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                allowDecimals={false}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1e293b',
                  border: '1px solid #475569',
                  borderRadius: '8px',
                  color: '#fff',
                }}
                labelStyle={{ color: '#94a3b8' }}
                formatter={(value) => [`${value} ครั้ง`, 'การดูดวง']}
              />
              <Area
                type="monotone"
                dataKey="count"
                stroke="#8B5CF6"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorReadings)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
