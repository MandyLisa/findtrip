import { fetchDashboardSummary } from "@/API/profile"
import useAuthStore from "@/store/authStore"
import { Loader } from "lucide-react"
import { useEffect, useState } from "react"

const AdminDashBoard = () => {
    const token = useAuthStore((state) => state.token)
    const [loading, setLoading] = useState(false)

    const [data, setData] = useState({
        totalBookings: 0,
        totalRevenue: 0,
        totalUsers: 0,
        totalTours: 0,
        tour: {
            recommendTours: 0,
            isActiveTours: 0,
            isAlmostFull: 0
        }
    })

    useEffect(() => {
        getSummary()
    }, [token])


    const getSummary = async () => {
        setLoading(true)
        try {
            const res = await fetchDashboardSummary(token)
            setData(res.data)
        } catch (err) {
            console.error('Error loading dashboard:', err)
        } finally {
            setLoading(false)
        }
    }

    if (loading) {
        return (
            <div className='flex flex-col items-center justify-center mt-16'>
                <Loader className='animate-spin text-brand-pink w-10 h-10 mb-2' />
                <p>กำลังโหลดข้อมูล...กรุณารอสักครู่</p>
            </div >
        )
    }

    if (!data) {
        return (
            <div className='items-center justify-center font-semibold'>ไม่พบข้อมูล</div>
        )
    }

    return (
        <div className="flex flex-col items-center justify-center bg-gray-100 p-1">
            <h1 className="text-5xl font-bold text-brand-pink mb-6">
                WELCOME TO DASHBOARD FINDTRIP
            </h1>

            <div className="grid grid-cols-4 gap-6 w-full max-w-10xl mt-4 h-40">
                <div className="bg-white shadow rounded-xl p-10 text-center">
                    <h2 className="text-xl font-semibold text-gray-700">การจองทั้งหมด</h2>
                    <p className="text-3xl font-semibold mt-2 text-blue-600">{data.totalBookings}</p>
                </div>

                <div className="bg-white shadow rounded-xl p-10 text-center">
                    <h2 className="text-xl font-semibold text-gray-700">ยอดขายรวม</h2>
                    <p className="text-3xl font-semibold mt-2 text-blue-600">{Number(data.totalRevenue).toLocaleString()} ฿</p>
                </div>

                <div className="bg-white shadow rounded-xl p-10 text-center">
                    <h2 className="text-xl font-semibold text-gray-700">จำนวนผู้ใช้งาน</h2>
                    <p className="text-3xl font-semibold mt-2 text-blue-600">{data.totalUsers}</p>
                </div>

                <div className="bg-white shadow rounded-xl p-10 text-center">
                    <h2 className="text-xl font-semibold text-gray-700">จำนวนทัวร์ทั้งหมด</h2>
                    <p className="text-3xl font-semibold mt-2 text-blue-600">{data.totalTours}</p>
                </div>
            </div>

            {data?.tour && (
                <div className="grid grid-cols-4 gap-6 w-full max-w-10xl mt-4 h-40">
                    <div className="bg-white shadow rounded-xl p-10 text-center">
                        <h2 className="text-xl font-semibold text-gray-700">จำนวนทัวร์แนะนำ</h2>
                        <p className="text-3xl font-semibold mt-2 text-blue-600">{data.tour.recommendTours}</p>
                    </div>

                    <div className="bg-white shadow rounded-xl p-10 text-center">
                        <h2 className="text-xl font-semibold text-gray-700">จำนวนทัวร์ที่เปิดขาย</h2>
                        <p className="text-3xl font-semibold mt-2 text-blue-600">{data.tour.isActiveTours}</p>
                    </div>
                    
                    <div className="bg-white shadow rounded-xl p-10 text-center">
                        <h2 className="text-xl font-semibold text-gray-700">จำนวนทัวร์ที่ปิดการขาย</h2>
                        <p className="text-3xl font-semibold mt-2 text-blue-600">{data.tour.isActiveTours}</p>
                    </div>

                    <div className="bg-white shadow rounded-xl p-10 text-center">
                        <h2 className="text-xl font-semibold text-gray-700">จำนวนทัวร์ใกล้เต็ม</h2>
                        <p className="text-3xl font-semibold mt-2 text-blue-600">{data.tour.isAlmostFull}</p>
                    </div>

                </div>
            )}
            
        </div>
    )
}

export default AdminDashBoard
