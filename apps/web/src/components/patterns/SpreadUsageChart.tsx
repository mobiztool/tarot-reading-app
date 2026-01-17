'use client';

/**
 * Spread Usage Chart Component
 * Displays spread type usage distribution (Story 9.4)
 */

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import type { SpreadUsage } from '@/lib/patterns/types';

interface SpreadUsageChartProps {
  data: SpreadUsage[];
}

const COLORS = ['#10B981', '#34D399', '#6EE7B7', '#A7F3D0', '#D1FAE5'];

export function SpreadUsageChart({ data }: SpreadUsageChartProps): React.JSX.Element {
  const chartData = data.slice(0, 5).map(spread => ({
    name: spread.spreadNameTh,
    count: spread.count,
    percentage: spread.percentage.toFixed(1),
  }));
  
  return (
    <div className="h-48">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          layout="vertical"
          margin={{ top: 10, right: 30, left: 80, bottom: 10 }}
        >
          <XAxis type="number" />
          <YAxis 
            dataKey="name" 
            type="category" 
            width={75}
            tick={{ fill: '#9CA3AF', fontSize: 11 }}
          />
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
          <Bar dataKey="count" radius={[0, 4, 4, 0]}>
            {chartData.map((_, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
