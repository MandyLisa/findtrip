import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'

const COLORS = [
  '#ec4899',
  '#6366f1',
  '#22c55e',
  '#f59e0b',
  '#14b8a6',
  '#8b5cf6',
  '#ef4444',
  '#06b6d4',
  '#84cc16',
  '#f97316',
]

/**
 * @param {Array<{ name: string, value: number }>} data
 * @param {string} title
 * @param {'currency' | 'count'} valueType
 */
const SimplePieChart = ({ title, data, valueType = 'currency' }) => {
  const chartData = Array.isArray(data)
    ? data.map((d) => ({
        name: d.name,
        value: Number(d.value) || 0,
      }))
    : []

  const total = chartData.reduce((s, d) => s + d.value, 0)
  const empty = chartData.length === 0 || total === 0

  const formatVal = (v) =>
    valueType === 'currency' ? `${Number(v).toLocaleString()} ฿` : `${Number(v).toLocaleString()} รายการ`

  return (
    <div className="flex h-full min-h-[280px] flex-col rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
      <h3 className="mb-1 text-base font-semibold text-gray-900">{title}</h3>
      {empty ? (
        <div className="flex flex-1 items-center justify-center rounded-xl bg-gray-50 text-sm text-gray-400">
          ไม่มีข้อมูล
        </div>
      ) : (
        <div className="min-h-[220px] flex-1 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={48}
                outerRadius={88}
                paddingAngle={2}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {chartData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} stroke="#fff" strokeWidth={1} />
                ))}
              </Pie>
              <Tooltip formatter={(v) => formatVal(v)} contentStyle={{ borderRadius: '12px' }} />
              <Legend wrapperStyle={{ fontSize: '12px' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  )
}

export default SimplePieChart
