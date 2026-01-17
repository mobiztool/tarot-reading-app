'use client';

/**
 * Timeline Chart Component
 * Displays monthly reading frequency (Story 9.4)
 */

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from 'recharts';
import type { MonthlyReading } from '@/lib/patterns/types';

interface TimelineChartProps {
  data: MonthlyReading[];
}

export function TimelineChart({ data }: TimelineChartProps): React.JSX.Element {
  const chartData = data.map(month => ({
    name: month.monthLabel,
    readings: month.count,
  }));
  
  return (
    <div className="h-48">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="colorReadings" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis 
            dataKey="name" 
            tick={{ fill: '#9CA3AF', fontSize: 10 }}
            interval={1}
          />
          <YAxis tick={{ fill: '#9CA3AF', fontSize: 10 }} />
          <Tooltip
            contentStyle={{
              backgroundColor: '#1F2937',
              border: '1px solid #374151',
              borderRadius: '8px',
            }}
            labelStyle={{ color: '#F9FAFB' }}
            formatter={(value) => [`${value} ครั้ง`, 'จำนวนการดูดวง']}
          />
          <Area
            type="monotone"
            dataKey="readings"
            stroke="#8B5CF6"
            strokeWidth={2}
            fill="url(#colorReadings)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

interface DayPatternChartProps {
  data: { dayNameTh: string; count: number; percentage: number }[];
}

export function DayPatternChart({ data }: DayPatternChartProps): React.JSX.Element {
  const chartData = data.map(day => ({
    name: day.dayNameTh,
    count: day.count,
    percentage: day.percentage.toFixed(1),
  }));
  
  return (
    <div className="h-48">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <XAxis 
            dataKey="name" 
            tick={{ fill: '#9CA3AF', fontSize: 10 }}
          />
          <YAxis tick={{ fill: '#9CA3AF', fontSize: 10 }} />
          <Tooltip
            contentStyle={{
              backgroundColor: '#1F2937',
              border: '1px solid #374151',
              borderRadius: '8px',
            }}
            labelStyle={{ color: '#F9FAFB' }}
            formatter={(value, _, props) => [
              `${value} ครั้ง (${(props?.payload as { percentage?: string })?.percentage}%)`,
              'จำนวน',
            ]}
          />
          <Line
            type="monotone"
            dataKey="count"
            stroke="#EC4899"
            strokeWidth={2}
            dot={{ fill: '#EC4899', strokeWidth: 2 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
