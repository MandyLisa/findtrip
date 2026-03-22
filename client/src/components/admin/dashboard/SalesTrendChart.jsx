import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

const SalesTrendChart = ({ data, granularity }) => {
  const hasData = Array.isArray(data) && data.length > 0

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">แนวโน้มยอดขาย</h3>
          <p className="text-sm text-gray-500">
            ตามช่วงเวลา ({granularity === 'weekly' ? 'รายสัปดาห์' : granularity === 'yearly' ? 'รายปี' : 'รายเดือน'}) — เฉพาะการชำระสำเร็จ (PAID)
          </p>
        </div>
      </div>
      {!hasData ? (
        <div className="flex h-72 items-center justify-center rounded-xl bg-gray-50 text-gray-400">
          ไม่มีข้อมูลในช่วงที่เลือก
        </div>
      ) : (
        <div className="h-72 w-full min-h-[18rem]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="period" tick={{ fontSize: 11 }} stroke="#9ca3af" />
              <YAxis tick={{ fontSize: 11 }} stroke="#9ca3af" tickFormatter={(v) => Number(v).toLocaleString()} />
              <Tooltip
                formatter={(value) => [`${Number(value).toLocaleString()} ฿`, 'ยอดขาย']}
                labelFormatter={(label) => `ช่วง: ${label}`}
                contentStyle={{ borderRadius: '12px', border: '1px solid #e5e7eb' }}
              />
              <Line
                type="monotone"
                dataKey="totalSales"
                name="ยอดขาย"
                stroke="#ec4899"
                strokeWidth={2.5}
                dot={{ r: 3, fill: '#ec4899' }}
                activeDot={{ r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  )
}

export default SalesTrendChart
