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
        <div className='my-8 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-gray-200 sm:p-6'>
            <div className='flex flex-col gap-1'>
                <p className='text-base font-semibold text-gray-800 sm:text-lg'>รายละเอียดการชำระเงิน</p>
                <p className='text-sm text-gray-600'>รหัสลูกค้า {payment?.booking?.userId}</p>
                <p className='text-sm text-gray-600'>ชื่อลูกค้า {payment?.booking?.user?.name} {payment?.booking?.user?.surname}</p>
                <p className='text-sm text-gray-600'>อีเมล์ {payment?.booking?.user?.email}</p>
                <p className='text-sm text-gray-600'>โทรศัพท์ {payment?.booking?.user?.phone}</p> 
            </div>

            <div className='mt-5 grid grid-cols-1 gap-6 lg:grid-cols-2'>
                <div className='space-y-2'>
                    <p className='text-sm font-semibold text-gray-800'>หมายเลขการชำระเงิน: <span className='font-normal text-gray-700'>{payment?.id}</span></p>
                    <p className='text-sm text-gray-700'>ชื่อทัวร์: {payment?.booking?.tourPackage?.title}</p>
                    <p className='text-sm text-gray-700'>รหัสทัวร์: {payment?.booking?.tourPackage?.tourCode}</p>
                    <p className='text-sm text-gray-700'>ระยะเวลา: {payment?.booking?.tourPackage?.duration}</p>
                    <p className='text-sm text-gray-700'>เดินทาง: {formatDateRange(payment?.booking?.tourPackage?.startDate, payment?.booking?.tourPackage?.endDate)}</p>
                    <p className='text-sm text-gray-700'>เลขการจอง: {payment?.bookingId}</p>

                    <div className='pt-4'>
                        <p className='text-sm font-semibold text-gray-800'>จำนวนผู้เดินทาง</p>
                        <div className='mt-2 grid grid-cols-1 gap-2 sm:grid-cols-3'>
                            <p className='text-sm text-gray-700'>ผู้ใหญ่ {payment?.booking?.adultCount} ท่าน</p>
                            <p className='text-sm text-gray-700'>เด็ก ( อายุไม่เกิน 2 ปี ) {payment?.booking?.childCount} ท่าน</p>
                            <p className='text-sm text-gray-700'>พักแยก {payment?.booking?.singleStayCount} ท่าน</p>
                        </div>
                    </div>

                    <p className='pt-4 text-sm font-semibold text-gray-800'>ราคารวมทั้งหมด: <span className='font-normal text-gray-700'>{Number(payment?.booking?.totalPrice).toLocaleString('th-TH')} บาท</span></p>
                </div>

                <div className='space-y-2'>
                    <p className='text-sm font-semibold text-gray-800'>สถานะการจอง</p>
                    <div className='flex flex-wrap items-center gap-2'>
                        <p className='text-sm text-gray-700'>
                            {payment?.booking?.bookingStatus ? payment?.booking?.bookingStatus : '-'}
                        </p>
                    {(payment?.paymentStatus === 'PAID'|| payment?.paymentStatus === 'PENDING') &&
                        payment?.paymentMethod === 'BANK_TRANSFER' && (
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
                        <p className='mt-1 text-sm text-gray-700'>
                            {payment?.paymentMethod ?? '-'}
                            {payment?.paymentMethod === 'BANK_TRANSFER' && payment?.bankName && (
                                <>
                                    <br />
                                    <span className='text-sm text-gray-600'>ธนาคาร: {payment.bankName}</span>
                                </>
                            )}
                        </p>
                    </div>

                    <div className='pt-4'>
                        <p className='text-sm font-semibold text-gray-800'>สถานะการชำระเงิน</p>
                        <p className='mt-1 text-sm text-gray-700'>{payment?.paymentStatus ?? '-'}</p>
                    </div>

                    <div className='pt-4'>
                        <p className='text-sm font-semibold text-gray-800'>หมายเลขธุรกรรมการเงิน</p>
                        <p className='mt-1 text-sm text-gray-700'>{payment?.transactionId?? '-'}</p>
                    </div>

                    <div className='pt-4'>
                        <p className='text-sm font-semibold text-gray-800'>วันที่สร้างการชำระเงิน</p>
                        <p className='mt-1 text-sm text-gray-700'>{payment?.createdDate}</p>
                    </div>

                    <div className='pt-4'>
                        <p className='text-sm font-semibold text-gray-800'>วันที่อัพเดตล่าสุด</p>
                        <p className='mt-1 text-sm text-gray-700'>{payment?.updatedDate}</p>
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
            </div>

            {showSlipModal && (
                <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4'>
                    <div className='relative w-full max-w-3xl rounded-2xl bg-white p-4 shadow-xl ring-1 ring-gray-200 sm:p-6'>
                        <button
                            onClick={handleCloseSlip}
                            className='absolute right-3 top-3 inline-flex h-9 w-9 items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-700'
                        >
                            ✕
                        </button>
                        <h2 className='mb-4 text-base font-semibold text-gray-800 sm:text-lg'>สลิปการชำระเงิน</h2>
                        {payment?.secure_url ? (
                            <img
                                src={payment.secure_url}
                                alt='สลิปโอนเงิน'
                                className='w-full h-auto rounded-xl ring-1 ring-gray-200'
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
