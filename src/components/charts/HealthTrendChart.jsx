import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'

// Small trend line used inside the Business Health Score hero widget.
export function HealthTrendChart({ data }) {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <LineChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
        <XAxis dataKey="period" tick={{ fontSize: 12, fill: 'var(--color-muted)' }} axisLine={false} tickLine={false} />
        <YAxis domain={[0, 100]} tick={{ fontSize: 12, fill: 'var(--color-muted)' }} axisLine={false} tickLine={false} width={30} />
        <Tooltip contentStyle={{ borderRadius: 10, border: '1px solid var(--color-border)', fontSize: 13 }} />
        <Line type="monotone" dataKey="score" stroke="#4F46E5" strokeWidth={2.5} dot={{ r: 3 }} activeDot={{ r: 5 }} />
      </LineChart>
    </ResponsiveContainer>
  )
}
