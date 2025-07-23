import { useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import useAuthStore from '../../store/authStore'
import UserSidebar from '../../components/user/UserSidebar'
import { getUserBookings } from '../../API/booking'
import UserBookingCard from '../../components/user/UserBookingCard'
import Pagination from '../../components/card/Pagination'
import { Loader } from 'lucide-react'


const MyBooking = () => {
  const navigate = useNavigate()
  const { token, user: authUser } = useAuthStore()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!token) {
      navigate('/login')
      return
    }
  }, [token])

  // Tabs
  const [activeStatus, setActiveStatus] = useState('ALL')

  // กำหนด tabs และ mapping กับสถานะ
  const tabs = [
    { key: 'รายการทั้งหมด', label: 'รายการทั้งหมด', status: 'ALL' },
    { key: 'รอชำระเงิน', label: 'รอชำระเงิน', status: 'DRAFT' },
    { key: 'รอตรวจสอบ', label: 'รอตรวจสอบ', status: 'PENDING' },
    { key: 'ชำระเงินสำเร็จ', label: 'ชำระเงินสำเร็จ', status: 'PAID' },
    { key: 'ชำระเงินไม่สำเร็จ', label: 'ชำระเงินไม่สำเร็จ', status: 'FAILED' },
    { key: 'ยกเลิกการจอง', label: 'ยกเลิกการจอง', status: 'CANCELLED' }
  ]

  const handleTabClick = (status) => {
    setActiveStatus(status)
    setCurrentPage(1)
    fetchBookingData(status)
    // console.log(`ดึงข้อมูลสำหรับสถานะ: ${status}`) 
  }

  // Pagination
  const [totalPages, setTotalPages] = useState(1)
  const [currentPage, setCurrentPage] = useState(1)
  const limit = 10

  // Fetch Booking
  const [allBookings, setAllBookings] = useState([])

  const fetchBookingData = async (bookingStatus) => {
    try {
      setLoading(true)
      const res = await getUserBookings(token, currentPage, limit, bookingStatus)
      console.log('ดู fetchBookingData', res)
      setAllBookings(res.data.booking)
      setTotalPages(res.data.totalPage)
    } catch (error) {
      console.log('Error fetching Booking Data', error)
    } finally {
      setLoading(false)
    }
  }

  // Fetch ข้อมูลจากหลังบ้าน
  useEffect(() => {
    fetchBookingData(activeStatus)
  }, [token, currentPage])


  const filteredBookings = activeStatus === 'ALL'
    ? allBookings
    : allBookings.filter((booking) => booking.bookingStatus === activeStatus)

  return (
    <div className='flex flex-col xl:flex-row gap-4 lg:gap-6 h-full max-h-full overflow-hidden'>
      <UserSidebar />

      {/* Right Content */}
      <div className='flex-1 bg-white rounded-lg shadow-sm border overflow-hidden flex flex-col'>
        {/* Header */}
        <div className='p-4 lg:p-6 flex-1'>
          <h1 className='text-2xl font-bold text-gray-800'>การจองของฉัน</h1>
        </div>

        {/* Tabs */}
        <div className='p-4 lg:p-6 flex-1'>
          <div className='flex flex-wrap justify-center gap-4'>
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => handleTabClick(tab.status)}
                className={
                  `px-4 py-2 rounded-full text-sm font-medium transition-colors 
                  ${activeStatus === tab.status
                    ? 'bg-brand-pink text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Filters Booking Cards */}
        <div className='p-6 lg:p-12'>
          {loading ? (
            <div className='flex flex-col items-center justify-center mt-16'>
              <Loader className='animate-spin text-brand-pink w-10 h-10 mb-2' />
              <p className='text-center text-gray-500 mt-8'>กำลังโหลดข้อมูล...กรุณารอสักครู่</p>
            </div>
          ) : filteredBookings.length === 0 ? (
            <p className='text-center text-gray-500 mt-8'>ไม่มีรายการจองในสถานะนี้</p>
          ) : (
            filteredBookings.map((booking) => (
              <div className='mt-0' key={booking.id}>
                <UserBookingCard
                  data={booking}
                />
              </div>
            ))
          )}
        </div>
        <div className='mb-8'>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={(page) => setCurrentPage(page)}
          />
        </div>
      </div>
    </div>
  )
}

export default MyBooking

