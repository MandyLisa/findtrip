import { getBookingDetail, updateBookingStatus } from '@/API/booking'
import useAuthStore from '@/store/authStore'
import { formatDate_Time, formatDateRange } from '@/utils/formatDate'
import axios from 'axios'
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
            // console.log('ดู fetchBookingDetail ตรงนี้ ', res)
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
            const res =
                status === 'PAID'
                    ? await axios.patch(
                        `/api/booking/admin/${id}/status`,
                        {
                            bookingStatus: status,
                            approvedBy: useAuthStore.getState()?.user?.name,
                            approvedAt: new Date(),
                        },
                        {
                            headers: {
                                Authorization: `Bearer ${token}`,
                            },
                        }
                    )
                    : await updateBookingStatus(token, id, status)
            // console.log('ดู handleBookingStatus ตรงนี้ ', res)
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
        <div className='my-8 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-gray-200 sm:p-6'>
            <div className='flex flex-col gap-1'>
                <p className='text-base font-semibold text-gray-800 sm:text-lg'>รายละเอียดลูกค้า</p>
                <p className='text-sm text-gray-600'>รหัสลูกค้า {booking?.userId}</p>
                <p className='text-sm text-gray-600'>ชื่อลูกค้า {booking?.user?.name} {booking?.user?.surname}</p>
                <p className='text-sm text-gray-600'>อีเมล์ {booking?.user?.email}</p>
                <p className='text-sm text-gray-600'>โทรศัพท์ {booking?.user?.phone}</p>
            </div>

            <div className='mt-5 grid grid-cols-1 gap-6 lg:grid-cols-2'>
                <div className='space-y-2'>
                    <p className='text-base font-semibold text-gray-800 sm:text-lg'>รายละเอียดการจอง</p>
                    <p className='text-sm font-normal text-gray-800'>รหัสการจอง: <span className='font-normal text-gray-700'>{booking?.id}</span></p>
                    <p className='text-sm text-gray-700'>ชื่อทัวร์: {booking?.tourPackage?.title}</p>
                    <p className='text-sm text-gray-700'>รหัสทัวร์: ({booking?.tourPackage?.tourCode})</p>
                    <p className='text-sm text-gray-700'>ระยะเวลา: {booking?.tourPackage?.duration}</p>
                    <p className='text-sm text-gray-700'>เดินทาง: {formatDateRange(booking?.tourPackage?.startDate, booking?.tourPackage?.endDate)}</p>
                    <p className='text-sm text-gray-700'>สายการบิน: {booking?.tourPackage?.airline}</p>
                    <p className='text-sm text-gray-700'>โรงแรม: ระดับ {booking?.tourPackage?.starRating} ดาว</p>

                    <div className='pt-4'>
                        <p className='text-sm font-semibold text-gray-800'>จำนวนผู้เดินทาง</p>
                        <div className='mt-2 grid grid-cols-1 gap-2 sm:grid-cols-3'>
                            <p className='text-sm text-gray-700'>ผู้ใหญ่ {booking?.adultCount} ท่าน</p>
                            <p className='text-sm text-gray-700'>เด็ก ( อายุไม่เกิน 2 ปี ) {booking?.childCount} ท่าน</p>
                            <p className='text-sm text-gray-700'>พักแยก {booking?.singleStayCount} ท่าน</p>
                        </div>
                    </div>

                    <p className='pt-4 text-sm font-semibold text-gray-800'>ราคาทั้งหมด: <span className='font-normal text-gray-700'>{Number(booking?.totalPrice).toLocaleString('th-TH')} บาท</span></p>
                </div>

                <div className='space-y-2'>
                    <p className='text-sm font-semibold text-gray-800'>สถานะการจอง</p>
                    <div className='flex flex-wrap items-center gap-2'>
                        <p className='text-sm text-gray-700'>
                            {booking?.bookingStatus ? booking.bookingStatus : '-'}
                        </p>
                        {booking?.bookingStatus === 'PENDING' &&
                            booking?.Payment?.paymentMethod === 'BANK_TRANSFER' && (
                                <button
                                    onClick={handleShowSlip}
                                    className='inline-flex items-center justify-center rounded-lg p-1 text-brand-pink hover:bg-pink-50 hover:text-pink-600'
                                    title='ดูสลิปโอนเงิน'
                                >
                                    <Search size={20} />
                                </button>
                            )}
                    </div>

                    <div className='pt-4'>
                        <p className='text-sm font-semibold text-gray-800'>ช่องทางชำระเงิน</p>
                        <p className='mt-1 text-sm text-gray-700'>{booking?.Payment?.paymentMethod ?? '-'}</p>
                    </div>

                    <div className='pt-4'>
                        <p className='text-sm font-semibold text-gray-800'>สถานะการชำระเงิน</p>
                        <p className='mt-1 text-sm text-gray-700'>{booking?.Payment?.paymentStatus ?? '-'}</p>
                    </div>

                    <div className='pt-4'>
                        <p className='text-sm font-semibold text-gray-800'>วันที่สร้างการจอง</p>
                        <p className='mt-1 text-sm text-gray-700'>{formatDate_Time(booking?.createdDate)}</p>
                    </div>

                    <div className='pt-4'>
                        <p className='text-sm font-semibold text-gray-800'>วันที่อัพเดตล่าสุด</p>
                        <p className='mt-1 text-sm text-gray-700'>{formatDate_Time(booking?.updatedDate)}</p>
                    </div>
                </div>
            </div>

            <div className='mt-8 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center'>
                <button
                    type='button'
                    className='inline-flex items-center justify-center rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-brand-pink shadow-sm ring-1 ring-inset ring-brand-pink hover:bg-brand-pink hover:text-white'
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
                            className='inline-flex items-center justify-center rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-red-700'
                        >
                            ยกเลิกรายการจอง
                        </button>
                    </ConfirmDialog>
                ) : booking?.bookingStatus === 'PENDING' ? (
                    <div className='flex flex-col gap-3 sm:flex-row sm:gap-4'>
                        <ConfirmDialog
                            title='คุณแน่ใจว่าต้องการอนุมัติรายการนี้?'
                            description={`ยืนยันการอนุมัติรหัสการจอง '${booking?.id}' หรือไม่?`}
                            confirmText='ยืนยัน'
                            cancelText='ยกเลิก'
                            onConfirm={() => handleBookingStatus('PAID')}
                        >
                            <button className='inline-flex items-center justify-center rounded-xl bg-green-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-green-700'>
                                อนุมัติ
                            </button>
                        </ConfirmDialog>

                        <ConfirmDialog
                            title='คุณแน่ใจว่าไม่ต้องการอนุมัติรายการนี้?'
                            description={`ปฏิเสธรหัสการจอง '${booking?.id}' หรือไม่?`}
                            confirmText='ยืนยัน'
                            cancelText='ยกเลิก'
                            onConfirm={() => handleBookingStatus('FAILED')}
                        >
                            <button className='inline-flex items-center justify-center rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-red-700'>
                                ไม่อนุมัติ
                            </button>
                        </ConfirmDialog>
                    </div>
                ) : (
                    null
                )}
            </div>

            {showSlipModal && (
                <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4'>
                    <div
                        onClick={handleCloseSlip} // เพิ่ม onClick ให้ปิดเมื่อคลิกพื้นหลัง (Overlay)
                        className='relative w-full max-w-3xl rounded-2xl bg-white p-4 shadow-xl ring-1 ring-gray-200 sm:p-6'>
                        <div
                            onClick={(e) => e.stopPropagation()} // หยุดการปิดเมื่อคลิกโดนตัว Modal ด้านใน
                        >
                            {/* 3. ปุ่มปิดที่ชัดเจนขึ้น และมี Hover Effect ที่เด่นกว่าเดิม */}
                            <button
                                onClick={handleCloseSlip}
                                className='absolute -top-12 right-0 sm:-right-2 sm:top-2 inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/20 text-white hover:bg-white/40 sm:bg-gray-100 sm:text-gray-500 sm:hover:bg-gray-200 transition-all'
                                title='ปิด'
                            >
                                <span className='text-2xl leading-none'>✕</span>
                            </button>

                            <h2 className='text-base font-semibold text-gray-800 sm:text-lg mb-4'>สลิปการชำระเงิน</h2>

                            <div className='overflow-y-auto max-h-[70vh] rounded-xl'>
                                {booking?.Payment?.secure_url ? (
                                    <img
                                        src={booking.Payment.secure_url}
                                        alt='สลิปโอนเงิน'
                                        className='w-full h-auto rounded-xl ring-1 ring-gray-200'
                                    />
                                ) : (
                                    <p className='text-gray-500'>ไม่พบสลิปการชำระเงิน</p>
                                )}
                            </div>

                            {/* 4. เพิ่มปุ่ม "ปิดหน้าต่าง" ด้านล่างสำหรับมือถือ */}
                            <div className='mt-6 sm:hidden'>
                                <button
                                    onClick={handleCloseSlip}
                                    className='w-full py-3 bg-gray-100 text-gray-700 font-medium rounded-xl active:bg-gray-200'
                                >
                                    ปิดหน้าต่าง
                                </button>
                            </div>
                        </div>
                    </div>
                </div >
            )}
        </div >
    )
}

export default FormBookingDetail
