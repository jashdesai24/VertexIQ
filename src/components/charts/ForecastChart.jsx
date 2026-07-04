import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { formatCurrency } from '@/utils/format'

// Revenue history + forecast in one continuous line: solid area for actuals,
// dashed/lighter area for predicted months. Used on Dashboard and Sales Forecast page.
export function ForecastChart({ data }) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <AreaChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="actualFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#4F46E5" stopOpacity={0.35} />
            <stop offset="100%" stopColor="#4F46E5" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="forecastFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#4F46E5" stopOpacity={0.12} />
            <stop offset="100%" stopColor="#4F46E5" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="text-[var(--color-border)] dark:text-[var(--color-border-dark)]" vertical={false} />
        <XAxis dataKey="month" tick={{ fontSize: 12, fill: 'var(--color-muted)' }} axisLine={false} tickLine={false} />
        <YAxis
          tickFormatter={(v) => formatCurrency(v, { compact: true })}
          tick={{ fontSize: 12, fill: 'var(--color-muted)' }}
          axisLine={false}
          tickLine={false}
          width={64}
        />
        <Tooltip
          formatter={(value) => formatCurrency(value)}
          contentStyle={{ borderRadius: 10, border: '1px solid var(--color-border)', fontSize: 13 }}
        />
        <Area type="monotone" dataKey="actual" stroke="#4F46E5" strokeWidth={2} fill="url(#actualFill)" connectNulls />
        <Area type="monotone" dataKey="forecast" stroke="#4F46E5" strokeWidth={2} strokeDasharray="5 5" fill="url(#forecastFill)" connectNulls />
      </AreaChart>
    </ResponsiveContainer>
  )
}
