'use client';

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import type { Report } from '@/types';

export function FunnelHealthChart({ report }: { report?: Report }) {
  const data = [
    { name: 'Leads', value: report?.leadVolume || 0 },
    { name: 'Qualified', value: report?.qualifiedLeads || 0 },
    { name: 'Booked', value: report?.bookedCalls || 0 },
    { name: 'Show-ups', value: report?.showUps || 0 },
    { name: 'Closed', value: report?.salesClosed || 0 },
  ];

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis dataKey="name" tick={{ fontSize: 12 }} stroke="#64748b" />
          <YAxis tick={{ fontSize: 12 }} stroke="#64748b" />
          <Tooltip cursor={{ fill: '#f1f5f9' }} />
          <Bar dataKey="value" fill="#0f766e" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
