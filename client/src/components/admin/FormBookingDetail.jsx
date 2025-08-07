import { getBookingDetail, updateBookingStatus } from '@/API/booking'
import useAuthStore from '@/store/authStore'
import { formatDate_Time, formatDateRange } from '@/utils/formatDate'
import { Loader } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Search } from 'lucide-react'
import { toast } from 'react-toastify'
import ConfirmDialog from '../ui/ConfirmDialog'

const FormBookingDetail = () => {
    const token = useAuthStore((state) => state.token)
    const { id } = useParams()
    const navigate = useNavigate()

    const [booking, setBooking] = useState({})
    const [loading, setLoading] = useState(false)

    const [showSlipModal, setShowSlipModal] = useState(false)
    const handleShowSlip = () => setShowSlipModal(true)
    const handleCloseSlip = () => setShowSlipModal(false)

    useEffect(() => {
        if (id) {
            fetchBookingDetail()
        }
    }, [])

    // API call to Backend for fetch
    const fetchBookingDetail = async () => {
        setLoading(true)
        try {
            const res = await getBookingDetail(token, id)
            console.log('ดู fetchBookingDetail ตรงนี้ ', res)
            setBooking(res.data.booking)
            
        } catch (error) {
            console.error('Failed to Fetch Booking Detail: ', error)
        } finally {
            setLoading(false)
        }
    }

    // API call to Backend for update BookingStatus
    const handleBookingStatus = async (status) => {
        setLoading(true)
        try {
            const res = await updateBookingStatus(token, id, status)
            console.log('ดู handleBookingStatus ตรงนี้ ', res)
            setBooking(res.data.booking)

            if (status === 'CANCELLED') {
                toast.success('ยกเลิกการจองเรียบร้อยแล้ว')
            } else if (status === 'PAID') {
                toast.success('อนุมัติการจองเรียบร้อยแล้ว')
            } else if (status === 'FAILED') {
                toast.success('ไม่อนุมัติการจองนี้')
            }
        } catch (error) {
            console.error('Failed to update BookingStatus : ', error)
            toast.error('เกิดข้อผิดพลาดในการอัพเดท สถานะ Booking')
        } finally {
            setLoading(false)
        }
    }

    const handleBack = () => {
        navigate(-1)
    }


    if (loading) {
        return (
            <div className='flex flex-col items-center justify-center mt-16'>
                <Loader className='animate-spin text-brand-pink w-10 h-10 mb-2' />
                <p>กำลังโหลดข้อมูล...กรุณารอสักครู่</p>
            </div >
        )
    }

    if (!booking) {
        return (
            <div className='items-center justify-center font-semibold'>ไม่พบข้อมูลการจอง</div>
        )
    }

    return (
        <div className='my-8 p-6 bg-white rounded-md shadow-md'>
            <div className='flex flex-col'>
                <p className='text-xl md:text-2xl mt-2 md:mt-0'>รายละเอียดการจอง</p>
                <p className='text-md mt-2'>รหัสลูกค้า {booking?.userId}</p>
            </div>
            <div className='flex flex-col mt-4'>
                <p className='text-md mt-2 font-semibold'>รหัสการจอง: {booking?.id}</p>
                <p className='text-md mt-2'>ชื่อทัวร์: {booking?.tourPackage?.title}</p>
                <p className='text-md mt-2'>รหัสทัวร์: ({booking?.tourPackage?.tourCode})</p>
                <p className='text-md mt-2'>ระยะเวลา: {booking?.tourPackage?.duration}</p>
                <p className='text-md mt-2'>เดินทาง: {formatDateRange(booking?.tourPackage?.startDate, booking?.tourPackage?.endDate)}</p>
                <p className='text-md mt-2'>สายการบิน: {booking?.tourPackage?.airline}</p>
                <p className='text-md mt-2'>โรงแรม: ระดับ {booking?.tourPackage?.starRating} ดาว</p>
                <p className='text-md mt-6 font-semibold'>จำนวนผู้เดินทาง</p>
                <p className='text-md mt-2'>ผู้ใหญ่&nbsp;&nbsp; {booking?.adultCount}&nbsp;&nbsp; ท่าน</p>
                <p className='text-md mt-2'>เด็ก&nbsp;( อายุไม่เกิน 2 ปี ) &nbsp;&nbsp;{booking?.childCount} &nbsp;&nbsp;ท่าน</p>
                <p className='text-md mt-2'>จำนวนผู้พักแยก&nbsp;&nbsp; {booking?.singleStayCount} &nbsp;&nbsp;ท่าน</p>
                <p className='text-md mt-6 font-semibold'>ราคาทั้งหมด: <span>{Number(booking?.totalPrice).toLocaleString('th-TH')} บาท</span></p>
                <p className='text-md mt-6 font-semibold'>สถานะการจอง</p>
                <div className='flex items-center mt-2'>
                    <p className='text-md'>
                        {booking?.bookingStatus ? booking.bookingStatus : '-'}
                    </p>
                    {booking?.bookingStatus === 'PENDING' &&
                        booking?.Payment?.paymentMethod === 'BANK_TRANSFER' && (
                            <button
                                onClick={handleShowSlip}
                                className='ml-2 text-brand-pink hover:text-pink-600'
                                title='ดูสลิปโอนเงิน'
                            >
                                <Search size={20} />
                            </button>
                        )}
                </div>
                <p className='text-md mt-6 font-semibold'>ช่องทางชำระเงิน</p>
                <p className='text-md mt-2'>{booking?.Payment?.paymentMethod ?? '-'}</p>
                <p className='text-md mt-6 font-semibold'>สถานะการชำระเงิน</p>
                <p className='text-md mt-2'>{booking?.Payment?.paymentStatus ?? '-'}</p>
                <p className='text-md mt-6 font-semibold'>วันที่สร้างการจอง</p>
                <p className='text-md mt-2'>{formatDate_Time(booking?.createdDate)}</p>
                <p className='text-md mt-6 font-semibold'>วันที่อัพเดตล่าสุด</p>
                <p className='text-md mt-2'>{formatDate_Time(booking?.updatedDate)}</p>
            </div>
            <div className='flex mt-8'>
                <button
                    type='button'
                    className='p-2 mr-6 bg-white text-brand-pink border-2 border-brand-pink rounded-md hover:bg-brand-pink
                    hover:text-white'
                    onClick={handleBack}
                >
                    ย้อนกลับ
                </button>

                {booking?.bookingStatus === 'DRAFT' ? (
                    <ConfirmDialog
                        title='คุณแน่ใจว่าต้องการลบรายการจองนี้?'
                        description={`คุณต้องการลบรหัสการจอง '${booking?.id}' ใช่หรือไม่? การลบนี้จะไม่สามารถย้อนกลับได้`}
                        confirmText='ลบเลย'
                        cancelText='ยกเลิก'
                        onConfirm={() => handleBookingStatus('CANCELLED')}
                    >
                        <button
                            type='button'
                            className='p-2 bg-red-600 text-white rounded-md hover:bg-red-700'
                        >
                            ยกเลิกรายการจอง
                        </button>
                    </ConfirmDialog>
                ) : booking?.bookingStatus === 'PENDING' ? (
                    <div className='flex gap-4'>
                        <ConfirmDialog
                            title='คุณแน่ใจว่าต้องการอนุมัติรายการนี้?'
                            description={`ยืนยันการอนุมัติรหัสการจอง '${booking?.id}' หรือไม่?`}
                            confirmText='อนุมัติเลย'
                            cancelText='ยกเลิก'
                            onConfirm={() => handleBookingStatus('PAID')}
                        >
                            <button className='p-2 bg-green-600 text-white rounded-md hover:bg-green-700'>
                                อนุมัติ
                            </button>
                        </ConfirmDialog>

                        <ConfirmDialog
                            title='คุณแน่ใจว่าไม่ต้องการอนุมัติรายการนี้?'
                            description={`ปฏิเสธรหัสการจอง '${booking?.id}' หรือไม่?`}
                            confirmText='ไม่อนุมัติ'
                            cancelText='ยกเลิก'
                            onConfirm={() => handleBookingStatus('FAILED')}
                        >
                            <button className='p-2 bg-red-600 text-white rounded-md hover:bg-red-700'>
                                ไม่อนุมัติ
                            </button>
                        </ConfirmDialog>
                    </div>
                ) : (
                    null
                )}
            </div>

            {showSlipModal && (
                <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
                    <div className='bg-white p-4 rounded-lg max-w-3xl w-full relative'>
                        <button
                            onClick={handleCloseSlip}
                            className='absolute top-2 right-2 text-gray-500 hover:text-gray-700'
                        >
                            ✕
                        </button>
                        <h2 className='text-lg font-semibold mb-4'>สลิปการชำระเงิน</h2>
                        {booking?.Payment?.secure_url ? (
                            <img
                                src={booking.Payment.secure_url}
                                alt='สลิปโอนเงิน'
                                className='w-full h-auto rounded'
                            />
                        ) : (
                            <p className='text-gray-500'>ไม่พบสลิปการชำระเงิน</p>
                        )}
                    </div>
                </div>
            )}

        </div >
    )
}

export default FormBookingDetail
