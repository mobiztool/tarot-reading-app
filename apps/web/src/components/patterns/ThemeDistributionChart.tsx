'use client';

/**
 * Theme Distribution Pie Chart Component
 * Displays reading themes distribution (Story 9.4)
 */

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import type { ThemeData } from '@/lib/patterns/types';

interface ThemeDistributionChartProps {
  data: ThemeData[];
}

export function ThemeDistributionChart({ data }: ThemeDistributionChartProps): React.JSX.Element {
  const chartData = data.map(theme => ({
    name: theme.themeTh,
    value: theme.count,
    percentage: theme.percentage.toFixed(1),
    color: theme.color,
  }));
  
  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={80}
            label={({ name, payload }) => `${name} ${(payload as { percentage: string })?.percentage}%`}
            labelLine={false}
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: '#1F2937',
              border: '1px solid #374151',
              borderRadius: '8px',
            }}
            formatter={(value, name, props) => [
              `${value} ครั้ง (${(props?.payload as { percentage?: string })?.percentage}%)`,
              name,
            ]}
          />
          <Legend
            verticalAlign="bottom"
            height={36}
            formatter={(value) => <span className="text-gray-300 text-sm">{value}</span>}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
