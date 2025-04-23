import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { SalesData } from '@/lib/types';

interface RegionDistributionChartProps {
  salesData: SalesData[];
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#607D8B'];

const RegionDistributionChart = ({ salesData }: RegionDistributionChartProps) => {
  // Process data to get sales by region
  const salesByRegion = salesData.reduce((acc, sale) => {
    if (!acc[sale.region]) {
      acc[sale.region] = 0;
    }
    acc[sale.region] += sale.amount;
    return acc;
  }, {} as Record<string, number>);

  // Convert to chart data format
  const chartData = Object.entries(salesByRegion).map(([region, amount], index) => ({
    name: region,
    value: amount,
    color: COLORS[index % COLORS.length],
  }));

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Sales by Region</h2>
      <div className="w-full h-80">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={5}
              dataKey="value"
              label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
              labelLine={false}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value) => [`$${value.toLocaleString()}`, 'Sales']}
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="grid grid-cols-2 gap-2 mt-4">
        {chartData.map((item, index) => (
          <div key={index} className="flex items-center">
            <div
              className="w-3 h-3 rounded-full mr-2"
              style={{ backgroundColor: item.color }}
            ></div>
            <span className="text-sm text-gray-600">
              {item.name}: ${item.value.toLocaleString()}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RegionDistributionChart; 