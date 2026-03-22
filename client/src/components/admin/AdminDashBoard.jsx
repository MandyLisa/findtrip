import { fetchDashboardAnalytics } from '@/API/profile'
import useAuthStore from '@/store/authStore'
import { Loader } from 'lucide-react'
import { useEffect, useState } from 'react'
import KPICard from './dashboard/KPICard'
import SalesTrendChart from './dashboard/SalesTrendChart'
import SimplePieChart from './dashboard/SimplePieChart'
import TopToursTable from './dashboard/TopToursTable'

const emptyAnalytics = {
    kpi: { totalSales: 0, totalTours: 0, totalBookings: 0, totalUsers: 0 },
    salesTrend: [],
    salesByCountry: [],
    salesByCategory: [],
    bookingStatus: [],
    paymentStatus: [],
    topTours: [],
    meta: { granularity: 'monthly' },
}

const AdminDashBoard = () => {
    const token = useAuthStore((state) => state.token)
    const [loading, setLoading] = useState(true)
    const [hasLoadedOnce, setHasLoadedOnce] = useState(false)
    const [granularity, setGranularity] = useState('monthly')
    const [analytics, setAnalytics] = useState(emptyAnalytics)

    useEffect(() => {
        const load = async () => {
            if (!token) {
                setLoading(false)
                setHasLoadedOnce(true)
                return  
            }
            setLoading(true)
            try {
                const res = await fetchDashboardAnalytics(token, { granularity })
                setAnalytics({ ...emptyAnalytics, ...res.data })
            } catch (err) {
                console.error('Error loading dashboard:', err)
                setAnalytics(emptyAnalytics)
            } finally {
                setLoading(false)
                setHasLoadedOnce(true)
            }
        }
        load()
    }, [token, granularity])

    const kpi = analytics.kpi || emptyAnalytics.kpi

    const countryPieData = (analytics.salesByCountry || []).map((c) => ({
        name: c.name,
        value: Number(c.totalSales) || 0,
    }))

    const categoryPieData = (analytics.salesByCategory || []).map((c) => ({
        name: c.name,
        value: Number(c.totalSales) || 0,
    }))

    const bookingPieData = (analytics.bookingStatus || []).map((b) => ({
        name: b.status,
        value: Number(b.count) || 0,
    }))

    const paymentPieData = (analytics.paymentStatus || []).map((p) => ({
        name: p.status,
        value: Number(p.count) || 0,
    }))

    if (!hasLoadedOnce && loading) {
        return (
            <div className="flex min-h-[40vh] flex-col items-center justify-center">
                <Loader className="mb-2 h-10 w-10 animate-spin text-pink-500" />
                <p className="text-gray-500">กำลังโหลดข้อมูล...กรุณารอสักครู่</p>
            </div>
        )
    }

    return (
        <div className="w-full max-w-[1600px] mx-auto px-3 pb-10 sm:px-4 lg:px-6">
            <div className="mb-8 text-center sm:mb-10">
                <h1 className="bg-gradient-to-r from-pink-600 to-rose-500 bg-clip-text text-3xl font-bold tracking-tight text-transparent sm:text-4xl">
                    FindTrip Admin Dashboard
                </h1>
                <p className="mt-2 text-sm text-gray-500">สรุปภาพรวมธุรกิจ — ยอดขายจากการชำระเงินสำเร็จ (PAID) เท่านั้น</p>
            </div>

            {/* KPI */}
            <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <KPICard
                    title="ยอดขายรวม (PAID)"
                    value={`${Number(kpi.totalSales).toLocaleString()} ฿`}
                    accent="from-pink-500 to-rose-500"
                />
                <KPICard
                    title="แพ็คเกจทัวร์ทั้งหมด"
                    value={Number(kpi.totalTours).toLocaleString()}
                    accent="from-indigo-500 to-violet-500"
                />
                <KPICard
                    title="การจองทั้งหมด"
                    value={Number(kpi.totalBookings).toLocaleString()}
                    accent="from-emerald-500 to-teal-500"
                />
                <KPICard
                    title="ผู้ใช้งานทั้งหมด"
                    value={Number(kpi.totalUsers).toLocaleString()}
                    accent="from-amber-500 to-orange-500"
                />
            </div>

            {/* Trend + granularity */}
            <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <span className="text-sm font-medium text-gray-600">ช่วงเวลาแนวโน้มยอดขาย</span>
                <div className="flex flex-wrap gap-2">
                    {[
                        { id: 'weekly', label: 'รายสัปดาห์' },
                        { id: 'monthly', label: 'รายเดือน' },
                        { id: 'yearly', label: 'รายปี' },
                    ].map((g) => (
                        <button
                            key={g.id}
                            type="button"
                            onClick={() => setGranularity(g.id)}
                            className={`rounded-full px-4 py-2 text-sm font-medium transition ${granularity === g.id
                                ? 'bg-pink-600 text-white shadow-md'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                        >
                            {g.label}
                        </button>
                    ))}
                </div>
            </div>

            <div className="mb-8">
                <SalesTrendChart data={analytics.salesTrend} granularity={granularity} />
            </div>

            {/* Pie charts — 2 cols on tablet+ */}
            <div className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
                <SimplePieChart title="ยอดขายตามประเทศ (PAID)" data={countryPieData} valueType="currency" />
                <SimplePieChart title="ยอดขายตามหมวดหมู่ (PAID)" data={categoryPieData} valueType="currency" />
                <SimplePieChart title="สถานะการจอง (ทุกแถวใน Booking)" data={bookingPieData} valueType="count" />
                <SimplePieChart title="สถานะการชำระเงิน (Payment)" data={paymentPieData} valueType="count" />
            </div>

            <TopToursTable rows={analytics.topTours} />

            {hasLoadedOnce && loading && (
                <div className="pointer-events-none fixed bottom-4 right-4 flex items-center gap-2 rounded-full bg-white/90 px-3 py-2 text-sm text-gray-500 shadow-lg ring-1 ring-gray-200">
                    <Loader className="h-4 w-4 animate-spin text-pink-500" />
                    กำลังอัปเดต...
                </div>
            )}
        </div>
    )
}

export default AdminDashBoard