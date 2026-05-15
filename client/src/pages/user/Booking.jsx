import { useNavigate, useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import usePublicStore from '../../store/publicStore'
import { formatDateRange } from '../../utils/formatDate'
import DownloadPDF from '../../components/card/DownloadPDF'
import { createBooking } from '../../API/booking'
import Pre_Footer from '../../components/Pre_Footer'
import Swal from 'sweetalert2'
import { InfoBox } from '../../components/ui/InfoBox'
import ConfirmDialog from '@/components/ui/ConfirmDialog'
import useAuthStore from '@/store/authStore'

const BookingUser = () => {
    const navigate = useNavigate()
    const { id } = useParams()
    const token = useAuthStore((state) => state.token) // แนบตอนเรียก API ไปสร้างการจอง

    const fetchTourDetail = usePublicStore((state) => state.fetchTourDetail)
    const tourDetail = usePublicStore((state) => state.tourDetail)

    const [adultCount, setAdultCount] = useState(1)
    const [childCount, setChildCount] = useState(0)
    const [singleStayCount, setSingleStayCount] = useState(0)
    const [totalAdultPrice, setTotalAdultPrice] = useState(0)
    const [totalChildPrice, setTotalChildPrice] = useState(0)
    const [totalSingleStayPrice, setTotalSingleStayPrice] = useState(0)
    const [totalPrice, setTotalPrice] = useState(0)
    const [isLoading, setIsLoading] = useState(false)

    const increment = (setter, value) => setter(value + 1)
    const decrement = (setter, value, min = 0) => {
        if (value > min) setter(value - 1)
    }
    const decrementAdult = () => setAdultCount(prev => prev > 1 ? prev - 1 : prev)
    const decrementChild = () => setChildCount(prev => prev > 0 ? prev - 1 : prev)

    // ดึงข้อมูลทัวร์ ตาม id
    useEffect(() => {
        fetchTourDetail(id)
    }, [id])

    // คำนวณราคาทุกครั้งที่ค่าเปลี่ยน
    useEffect(() => {

        if (!tourDetail) return // เช็คว่าข้อมูล tourDetail โหลดเสร็จแล้วหรือยัง

        // step ดึงราคาจาก tourDetail
        const pricePerAdult = tourDetail.priceAdult || 0
        const pricePerChild = tourDetail.priceChild || 0
        const singleStayCost = tourDetail.singleStayExtra || 0

        // step คำนวณราคาแต่ละประเภท
        const adultTotal = adultCount * pricePerAdult
        const childTotal = childCount * pricePerChild
        const singleStayTotal = singleStayCount * singleStayCost

        // step อัพเดทราคาแต่ละประเภท
        setTotalAdultPrice(adultTotal)
        setTotalChildPrice(childTotal)
        setTotalSingleStayPrice(singleStayTotal)

        // step คำนวณและอัพเดทราคารวมทั้งหมด
        const grandTotal = adultTotal + childTotal + singleStayTotal
        setTotalPrice(grandTotal)

    }, [tourDetail, adultCount, childCount, singleStayCount])

    // คำนวณที่นั่งที่เหลือสำหรับการแสดงผล
    const hasSeatData = tourDetail?.maxSeats != null && tourDetail?.sold != null
    const availableSeats = hasSeatData
        ? (parseInt(tourDetail.maxSeats) || 0) - (parseInt(tourDetail.sold) || 0)
        : null

    const handleClickBooking = async () => {
        if (availableSeats !== null && adultCount > availableSeats) { // validate ก่อน ค่อยสร้างการจอง
            await Swal.fire({
                title: 'ไม่สามารถจองได้',
                text: 'จำนวนผู้ใหญ่เกินจำนวนที่นั่ง',
                icon: 'error',
                confirmButtonText: 'ตกลง',
                confirmButtonColor: '#dc2626',
            })
            return
        }

        setIsLoading(true)     
        try {
            const data = {
                tourPackageId: id,
                adultCount,
                childCount,
                singleStayCount,
            }
            const res = await createBooking(token, data)
            const bookingId = res.data.booking.id
            await Swal.fire({
                title: 'สร้างการจองสำเร็จ!',
                icon: 'success',
                showConfirmButton: false,
                timer: 1200,
                timerProgressBar: true,
            })
            navigate(`/user/payments/${bookingId}`)

        } catch (error) {
            console.error('Booking error:', error)
            if (error.response && error.response.status === 409) { // ถ้า Error 409 (Conflict) เกิดจากการจองซ้ำ        
                const existingBookingId = error.response.data.bookingId // ดึง bookingId เดิมจาก Backend
                await Swal.fire({
                    title: 'มีรายการจองอยู่แล้ว',
                    text: 'คุณมีรายการจองที่กำลังดำเนินการสำหรับทัวร์นี้อยู่แล้ว!',
                    icon: 'info',
                    confirmButtonText: 'ไปหน้าชำระเงิน',
                    confirmButtonColor: '#ec4899',
                })
                if (existingBookingId) {
                    navigate(`/user/payments/${existingBookingId}`) // Redirect ไปที่หน้า PaymentUser เดิมเพื่อดำเนินการต่อ
                }
            } else {
                const errMsg = error.response?.data?.message || 'เกิดข้อผิดพลาดในการสร้างการจอง'
                await Swal.fire({
                    title: 'ทำรายการไม่สำเร็จ',
                    text: errMsg,
                    icon: 'error',
                    confirmButtonText: 'ลองอีกครั้ง',
                    confirmButtonColor: '#dc2626'
                })
            }
        } finally {
            setIsLoading(false)
        }
    }

    const handleClickCancel = async () => {
        navigate(`/tourdetail/${id}`)
    }

    if (!tourDetail) {
        return (
            <div className='flex justify-center items-center mt-16'>
                <p className='text-gray-700 font-semibold'>ไม่พบข้อมูลทัวร์ หรือเกิดข้อผิดพลาด</p>
            </div>
        )
    }

    return (
        <div className='px-4 sm:px-6 lg:px-12'>
            <div className='text-2xl font-semibold text-gray-700 mt-16 py-2'>
                {tourDetail.title}
            </div>
            <div className='flex flex-wrap text-xl py-4 text-gray-700 gap-2'>
                <p>{tourDetail.country?.name} |</p>
                <p>{tourDetail.duration} |</p>
                <p>{formatDateRange(tourDetail.startDate, tourDetail.endDate)} |</p>
                <p>{tourDetail.airline}</p>
            </div>

            <div className='flex flex-wrap items-center gap-4 mt-6'>
                <DownloadPDF pdfUrl={tourDetail.tourPDF?.secure_url} />
                <div className='text-xl text-gray-700 font-semibold'>
                    รหัสทัวร์ ({tourDetail.tourCode})
                </div>
                <div className='text-xl text-gray-700 font-semibold'>
                    จำนวนที่นั่งคงเหลือ <span className='text-brand-pink'>{availableSeats === null ? 'กำลังโหลด...' : availableSeats}</span> ที่นั่ง
                </div>
            </div>
            <div className='py-6 text-2xl text-gray-700'>
                โปรดระบุจำนวนผู้เดินทาง
            </div>

            {/* Section: ผู้ใหญ่ */}
            <div className='border border-brand-pink rounded-md shadow-md mb-8'>
                <div className='flex flex-col md:flex-row justify-around gap-6 mt-4 mb-4'>
                    <div className='flex flex-col items-center mb-6 md:mb-0'>
                        <p className='w-full text-lg text-gray-700 mb-2 md:text-center sm:text-center'>จำนวนผู้ใหญ่และเด็ก 2 ขวบขึ้นไป</p>
                        <div className='flex justify-between border border-brand-pink w-60'>
                            <button
                                className='px-3 py-1 bg-brand-pink text-white font-semibold hover:bg-pink-600'
                                onClick={() => decrement(setAdultCount, adultCount, 1)}
                            >
                                -
                            </button>
                            <span className='text-lg font-semibold text-brand-pink'>{adultCount}</span>
                            <button
                                className={`px-3 py-1 bg-brand-pink text-white font-semibold hover:bg-pink-600 ${(availableSeats !== null && adultCount >= availableSeats)
                                    ? 'bg-gray-300 cursor-not-allowed'
                                    : 'bg-brand-pink hover:bg-pink-600'
                                    }`}
                                onClick={() => increment(setAdultCount, adultCount)}
                                disabled={availableSeats !== null && adultCount >= availableSeats}
                            >
                                +
                            </button>
                        </div>
                        {availableSeats !== null && adultCount > availableSeats && (
                            <p className='text-sm text-red-500 mt-1'>จำนวนผู้ใหญ่เกินจำนวนที่นั่งแล้ว</p>
                        )}
                    </div>
                    <InfoBox label='ราคาต่อท่าน' value={tourDetail.priceAdult} />
                    <InfoBox label='ราคารวม' value={totalAdultPrice} />
                </div>
            </div>


            {/* Section: เด็กเล็ก */}
            <div className='border border-brand-pink rounded-md shadow-md mb-8'>
                <div className='flex flex-col md:flex-row justify-around gap-6 mt-4 mb-4'>
                    <div className='flex flex-col items-center mb-6 md:mb-0'>
                        <p className='w-full text-lg text-gray-700 mb-2 md:text-center sm:text-center'>จำนวนเด็กอายุต่ำกว่า 2 ขวบ</p>
                        <div className='flex justify-between border border-brand-pink w-60'>
                            <button
                                className='px-3 py-1 bg-brand-pink text-white font-semibold hover:bg-pink-600'
                                onClick={() => decrement(setChildCount, childCount, 0)}
                            >
                                -
                            </button>
                            <span className='text-lg font-semibold text-brand-pink'>{childCount}</span>
                            <button
                                className={`px-3 py-1 bg-brand-pink text-white font-semibold hover:bg-pink-600 ${childCount >= adultCount
                                    ? 'bg-gray-300 cursor-not-allowed'
                                    : 'bg-brand-pink hover:bg-pink-600'
                                    }`}
                                onClick={() => increment(setChildCount, childCount)}
                                disabled={childCount >= adultCount}
                            >
                                +
                            </button>
                        </div>
                    </div>
                    <InfoBox label='ราคาต่อท่าน' value={tourDetail.priceChild} />
                    <InfoBox label='ราคารวม' value={totalChildPrice} />
                </div>
            </div>

            {/* Section: พักแยก */}
            <div className='border border-brand-pink rounded-md shadow-md mb-8'>
                <div className='flex flex-col md:flex-row justify-around gap-6 mt-4 mb-4'>
                    <div className='flex flex-col items-center mb-6 md:mb-0'>
                        <p className='w-full text-lg text-gray-700 mb-2 md:text-center sm:text-center'>จำนวนผู้ที่ต้องการพักแยกห้อง</p>
                        <div className='flex justify-between border border-brand-pink w-60'>
                            <button
                                className='px-3 py-1 bg-brand-pink text-white font-semibold hover:bg-pink-600'
                                onClick={() => decrement(setSingleStayCount, singleStayCount, 0)}
                            >
                                -
                            </button>
                            <span className='text-lg font-semibold text-brand-pink'>{singleStayCount}</span>
                            <button
                                className={`px-3 py-1 bg-brand-pink text-white font-semibold hover:bg-pink-600 ${singleStayCount >= adultCount
                                    ? 'bg-gray-300 cursor-not-allowed'
                                    : 'bg-brand-pink hover:bg-pink-600'
                                    }`}
                                onClick={() => increment(setSingleStayCount, singleStayCount)}
                                disabled={singleStayCount >= adultCount}
                            >
                                +
                            </button>
                        </div>
                    </div>

                    <InfoBox label='ราคาต่อท่าน' value={tourDetail.singleStayExtra} />
                    <InfoBox label='ราคารวม' value={totalSingleStayPrice} />
                </div>
            </div>

            {/* Total Summary */}
            <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center'>
                <p className='text-2xl text-gray-700 mt-8 mb-4'>รวมค่าใช้จ่ายทั้งหมด</p>
                <p className='text-2xl text-brand-pink border-b-2 border-brand-pink mt-8 mb-4'>
                    ฿{Number(totalPrice).toLocaleString('th-TH')}
                </p>
            </div>

            {/* ปุ่มจอง */}
            <div className='w-full mt-8'>
                <button
                    className='bg-brand-pink text-white text-2xl flex items-center justify-center h-14 w-full 
                             hover:bg-pink-600 disabled:opacity-50 disabled:cursor-not-allowed'
                    onClick={handleClickBooking}
                    disabled={isLoading} // ทำให้ปุ่ม disabled ขณะกำลังโหลด เพื่อป้องกันการกดซ้ำ
                >
                    {isLoading ? (
                        <>
                            <div className='w-6 h-6 mr-3 border-2 border-white border-t-transparent rounded-full animate-spin'></div>
                            <span>กำลังทำรายการจอง...กรุณารอสักครู่</span>
                        </>
                    ) : (
                        'จองเลย'
                    )}
                </button>
            </div>

            {/* ปุ่มยกเลิก */}
            <div className='w-full mt-4 mb-8'>
                <ConfirmDialog
                    title='ยกเลิกการจอง'
                    description='คุณแน่ใจหรือไม่ว่าต้องการยกเลิกการจองนี้?'
                    confirmText='ยืนยัน'
                    cancelText='ยกเลิก'
                    onConfirm={handleClickCancel}
                >
                    <button
                        className='bg-gray-200 text-2xl text-gray-700 flex items-center justify-center h-14 w-full
            hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed'
                        disabled={isLoading}
                    >
                        ยกเลิก
                    </button>
                </ConfirmDialog>
            </div>
            <Pre_Footer />
        </div >
    )
}

export default BookingUser
