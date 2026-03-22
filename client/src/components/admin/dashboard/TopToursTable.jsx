const TopToursTable = ({ rows }) => {
  const list = Array.isArray(rows) ? rows : []

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
      <h3 className="mb-1 text-lg font-semibold text-gray-900">ทัวร์ขายดี 10 อันดับ</h3>
      <p className="mb-4 text-sm text-gray-500">เรียงตามยอดขายรวม (เฉพาะการชำระ PAID)</p>
      <div className="overflow-x-auto rounded-xl border border-gray-100">
        <table className="min-w-full divide-y divide-gray-100 text-left text-sm">
          <thead className="bg-gray-50/80">
            <tr>
              <th className="px-4 py-3 font-semibold text-gray-600">#</th>
              <th className="px-4 py-3 font-semibold text-gray-600">ชื่อทัวร์</th>
              <th className="px-4 py-3 font-semibold text-gray-600 text-right">ยอดขายรวม</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50 bg-white">
            {list.length === 0 ? (
              <tr>
                <td colSpan={3} className="px-4 py-10 text-center text-gray-400">
                  ยังไม่มีข้อมูลยอดขาย
                </td>
              </tr>
            ) : (
              list.map((row, idx) => (
                <tr key={row.tourPackageId ?? idx} className="hover:bg-pink-50/30 transition-colors">
                  <td className="px-4 py-3 font-medium text-gray-500">{idx + 1}</td>
                  <td className="px-4 py-3 text-gray-900">{row.title}</td>
                  <td className="px-4 py-3 text-right font-semibold text-pink-600">
                    {Number(row.totalSales).toLocaleString()} ฿
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default TopToursTable
