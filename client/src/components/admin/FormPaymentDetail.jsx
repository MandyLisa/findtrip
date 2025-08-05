import { getPaymentDetail } from "@/API/payment"
import useAuthStore from "@/store/authStore"
import { formatDateRange } from "@/utils/formatDate"
import { Loader, Search } from "lucide-react"
import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"


const FormPaymentDetail = () => {
    const token = useAuthStore((state) => state.token)
    const { id } = useParams()
    const navigate = useNavigate()

    const [payment, setPayment] = useState({})
    const [loading, setLoading] = useState(false)

    const [showSlipModal, setShowSlipModal] = useState(false)
    const handleShowSlip = () => setShowSlipModal(true)
    const handleCloseSlip = () => setShowSlipModal(false)

    useEffect(() => {
        if (id) {
            fetchPaymentDetail()
        }
    }, [])

    // API call to Backend for fetch
    const fetchPaymentDetail = async () => {
        setLoading(true)
        try {
            const res = await getPaymentDetail(token, id)
            console.log('ดู fetchPaymentDetail ตรงนี้ ', res)
            setPayment(res.data.payment)

        } catch (err) {
            console.error('Failed to Fetch Payment Detail: ', err)
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

    if (!payment) {
        return (
            <div className='items-center justify-center font-semibold'>ไม่พบข้อมูลการชำระเงิน</div>
        )
    }


    return (
        <div className='my-8 p-6 bg-white rounded-md shadow-md'>
            <div className='flex flex-col'>
                <p className='text-xl md:text-2xl mt-2 md:mt-0'>รายละเอียดการชำระเงิน</p>
                <p className='text-md mt-2'>รหัสลูกค้า {payment?.booking?.userId}</p>
            </div>
            <div className='flex flex-col mt-4'>
                <p className='text-md mt-2 font-semibold'>หมายเลขการชำระเงิน: {payment?.id}</p>
                <p className='text-md mt-2'>ชื่อทัวร์: {payment?.booking?.tourPackage?.title}</p>
                <p className='text-md mt-2'>รหัสทัวร์: {payment?.booking?.tourPackage?.tourCode}</p>
                <p className='text-md mt-2'>ระยะเวลา: {payment?.booking?.tourPackage?.duration}</p>
                <p className='text-md mt-2'>เดินทาง: {formatDateRange(payment?.booking?.tourPackage?.startDate, payment?.booking?.tourPackage?.endDate)}</p>
                <p className='text-md mt-2'>ระยะเวลา: {payment?.bookingId}</p>
                <p className='text-md mt-6 font-semibold'>จำนวนผู้เดินทาง</p>
                <p className='text-md mt-2'>ผู้ใหญ่&nbsp;&nbsp; {payment?.booking?.adultCount}&nbsp;&nbsp; ท่าน</p>
                <p className='text-md mt-2'>เด็ก&nbsp;( อายุไม่เกิน 2 ปี ) &nbsp;&nbsp;{payment?.booking?.childCount} &nbsp;&nbsp;ท่าน</p>
                <p className='text-md mt-2'>จำนวนผู้พักแยก&nbsp;&nbsp; {payment?.booking?.singleStayCount} &nbsp;&nbsp;ท่าน</p>
                <p className='text-md mt-6 font-semibold'>ราคารวมทั้งหมด: <span>{Number(payment?.booking?.totalPrice).toLocaleString('th-TH')} บาท</span></p>
                <p className='text-md mt-6 font-semibold'>สถานะการจอง</p>
                <div className='flex items-center mt-2'>
                    <p className='text-md'>
                        {payment?.booking?.bookingStatus ? payment?.booking?.bookingStatus : '-'}
                    </p>
                    {(payment?.paymentStatus === 'PAID'|| payment?.paymentStatus === 'PENDING') &&
                        payment?.paymentMethod === 'BANK_TRANSFER' && (
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
                <p className='text-md mt-2'>
                    {payment?.paymentMethod ?? '-'}
                    {payment?.paymentMethod === 'BANK_TRANSFER' && payment?.bankName && (
                        <>
                            <br />
                            <span className='text-sm text-gray-600'>ธนาคาร: {payment.bankName}</span>
                        </>
                    )}
                </p>

                <p className='text-md mt-6 font-semibold'>สถานะการชำระเงิน</p>
                <p className='text-md mt-2'>{payment?.paymentStatus ?? '-'}</p>
                <p className='text-md mt-6 font-semibold'>หมายเลขธุรกรรมการเงิน</p>
                <p className='text-md mt-2'>{payment?.transactionId?? '-'}</p>

                <p className='text-md mt-6 font-semibold'>วันที่สร้างการชำระเงิน</p>
                <p className='text-md mt-2'>{payment?.createdDate}</p>
                <p className='text-md mt-6 font-semibold'>วันที่อัพเดตล่าสุด</p>
                <p className='text-md mt-2'>{payment?.updatedDate}</p>
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
                        {payment?.secure_url ? (
                            <img
                                src={payment.secure_url}
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

export default FormPaymentDetail
