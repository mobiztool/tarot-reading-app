'use client';

/**
 * Card Frequency Chart Component
 * Displays top cards as a bar chart (Story 9.4)
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
import type { CardFrequency } from '@/lib/patterns/types';

interface CardFrequencyChartProps {
  data: CardFrequency[];
}

const COLORS = ['#8B5CF6', '#A78BFA', '#C4B5FD', '#DDD6FE', '#EDE9FE'];

export function CardFrequencyChart({ data }: CardFrequencyChartProps): React.JSX.Element {
  const chartData = data.slice(0, 5).map(card => ({
    name: card.cardNameTh,
    count: card.count,
    percentage: card.percentage.toFixed(1),
    upright: card.uprightCount,
    reversed: card.reversedCount,
  }));
  
  return (
    <div className="h-64">
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
            tick={{ fill: '#9CA3AF', fontSize: 12 }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#1F2937',
              border: '1px solid #374151',
              borderRadius: '8px',
            }}
            labelStyle={{ color: '#F9FAFB' }}
            formatter={(value, name, props) => {
              if (name === 'count' && props?.payload) {
                return [
                  `${value} ครั้ง (${props.payload.percentage}%)`,
                  'จำนวน',
                ];
              }
              return [value, name];
            }}
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
