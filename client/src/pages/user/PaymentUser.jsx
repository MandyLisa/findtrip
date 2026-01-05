import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { cancelBooking, getBookingDetail } from '../../API/booking'
import Pre_Footer from '../../components/Pre_Footer'
import { Ban, CheckCircle, TicketCheck, Clock, Loader, XCircle } from 'lucide-react'
import { FaCcVisa } from 'react-icons/fa'
import { SiMastercard } from 'react-icons/si'
import BookingCardDetails from '../../components/card/BookingCardDetails'
import { toast } from 'sonner'
import CheckoutCardForm from '../../components/payment/CheckoutCardForm'
import BankTransferForm from '../../components/payment/BankTransferForm'
import useAuthStore from '../../store/authStore'
import ConfirmDialog from '../../components/ui/ConfirmDialog'


const PaymentUser = () => {
  // Hooks
  const navigate = useNavigate()
  const { bookingId } = useParams()
  const token = useAuthStore((state) => state.token)
  const bookingFromUserBookingCard = location.state?.bookingData
  // console.log(bookingFromUserBookingCard) จะได้ undefined ถ้าไม่ได้กดผ่าน cards

  // States
  const [booking, setBooking] = useState({})
  const [loading, setLoading] = useState(true)
  const [paymentMethod, setPaymentMethod] = useState(null)

  // Effects
  useEffect(() => {
    if (bookingFromUserBookingCard) {
      setBooking(bookingFromUserBookingCard)
    } else if (token && bookingId) {
      fetchBookingDetail()
    }
  }, [token, bookingId, bookingFromUserBookingCard])

  const fetchBookingDetail = async () => {
    try {
      setLoading(true) // ตั้งค่า loading เป็น true ก่อนเริ่ม fetch
      const res = await getBookingDetail(token, bookingId) // เรียก API fetch booking
      setBooking(res.data.booking) // อัปเดตลงใน state
    } catch (error) {
      console.error('Failed to fetch booking: ', error) 
    } finally {
      setLoading(false) 
    }
  }

  const { bookingStatus } = booking
  const hideAllExceptDetails = ['PENDING', 'PAID', 'CANCELLED', 'FAILED'].includes(bookingStatus)

  // choose payment method
  const handleSelectPaymentMethod = (method) => {
    setPaymentMethod(method)
  }

  
  const handleCancelBooking = async () => {
    try {
      const res = await cancelBooking(token, bookingId) // เรียก API ยกเลิกการจอง
      setBooking(res.data.booking) 
      toast.success('ยกเลิกการจองเรียบร้อยแล้ว')
      navigate(`/user/mybookings`) 
    } catch (error) {
      console.error(error)
      toast.error('เกิดข้อผิดพลาดในการยกเลิกการจอง')
    }
  }

  const handleBack = () => {
    navigate(`/user/mybookings`)
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
    <div>
      {!hideAllExceptDetails && (
        <div className='my-8 p-4 border border-brand-pink rounded-sm shadow-md'>
          <p className='text-2xl md:text-3xl text-gray-700 my-4 text-center md:text-left'>
            เราได้รับข้อมูลการจองของท่านแล้ว กรุณาตรวจสอบอีเมล์ที่ใช้ลงทะเบียน!
          </p>
          <p className='text-base md:text-xl text-gray-700 my-2'>
            โปรดทราบการจองของท่านจะเสร็จสมบูรณ์เมื่อชำระเงินแล้วเท่านั้น! กรุณาชำระเงินภายใน 24 ชม. หลังทำการจอง
          </p>
          <p className='text-base md:text-xl text-gray-700 my-2'>
            เพื่อยืนยันสถานะการจองและการเข้าร่วมทัวร์อย่างเสร็จสมบูรณ์!
          </p>
        </div>
      )}

      <BookingCardDetails booking={booking} />

      {bookingStatus === 'PENDING' && (
        <div className='bg-yellow-100 text-yellow-700 border border-yellow-400 rounded-md p-4 my-4'>
          <div className='flex items-center gap-2'>
            <Clock className='w-5 h-5 text-yellow-500' />
            <span>กรุณารอการตรวจสอบจากทางบริษัท ภายใน 24 ชม. หากเกินระยะเวลาดังกล่าว กรุณาติดต่อฝ่ายบริการลูกค้าของบริษัท FindTrip ขอบคุณค่ะ</span>
          </div>
        </div>
      )}

      {bookingStatus === 'PAID' && (
        <div className='bg-green-100 text-green-700 border border-green-400 rounded-md p-4 my-4 flex flex-col gap-3'>
          <div className='flex items-center gap-2'>
            <CheckCircle className='w-5 h-5 text-green-600' />
            <span>ชำระเงินสำเร็จ! การจองของท่านได้รับการยืนยันแล้ว กรุณาดูที่การจองของฉัน</span>
          </div>
        </div>
      )}

      {bookingStatus === 'FAILED' && (
        <div className='bg-red-100 text-red-700 border border-red-400 rounded-md p-4 my-4'>
          <div className='flex items-center gap-2'>
            <XCircle className='w-5 h-5 text-red-700' />
            <span>ชำระเงินไม่สำเร็จ! กรุณาติดต่อฝ่ายบริการลูกค้าของบริษัท FindTrip ขอบคุณค่ะ</span>
          </div>
        </div>
      )}

      {bookingStatus === 'CANCELLED' && (
        <div className='bg-gray-100 text-gray-700 border border-gray-300 rounded-md p-4 my-4'>
          <div className='flex items-center gap-2'>
            <Ban className='w-5 h-5 text-red-500' />
            <span>การจองของท่านได้รับการยกเลิกแล้ว</span>
          </div>
        </div>
      )}

      {!hideAllExceptDetails && (
        <>
          <div className='text-lg md:text-2xl font-semibold text-gray-700'>
            เลือกช่องทางชำระเงิน
          </div>
          <div className='my-4 p-4 border-2 border-brand-pink rounded-md shadow-md'>
            <div className='max-w-full mx-auto'>
              <div className='bg-white rounded-lg shadow-sm p-6'>
                <h1 className='text-xl font-bold text-gray-700 mb-6'>คุณต้องการชำระเงินด้วยวิธีใด?</h1>
                {/* Payment Method Selection */}

                {/* <Element stripe={stripePromise}> */}
                <div className='space-y-4 mb-6'>
                  <div
                    className=
                    {`border rounded-lg p-4 cursor-pointer transition-colors ${paymentMethod === 'credit' ?
                      'border-pink-500 bg-pink-50' : 'border-gray-200'}`}
                    onClick={() => handleSelectPaymentMethod('credit')}
                  >
                    <div className='flex items-center justify-between'>
                      <div className='flex items-center space-x-3'>
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'credit' ?
                          'border-pink-500 bg-pink-500' : 'border-gray-300'}`}>
                          {paymentMethod === 'credit' && <div className='w-2 h-2 bg-white rounded-full'></div>}
                        </div>
                        <span className='font-medium'>บัตรเครดิต/เดบิต</span>
                      </div>
                      <div className='flex space-x-2'>
                        <FaCcVisa className='w-8 h-8 text-blue-700' />
                        <SiMastercard className='w-8 h-8 text-orange-600' />
                      </div>
                    </div>
                    {paymentMethod === 'credit' && (
                      <CheckoutCardForm
                        token={token}
                        bookingId={bookingId}
                      />
                    )}
                  </div>
                </div>

                {/* Bank Transfer */}
                <div className='max-w-full mx-auto'>
                  <div
                    className={`border rounded-lg p-4 cursor-pointer transition-colors ${paymentMethod === 'bank' ?
                      'border-pink-500 bg-pink-50' : 'border-gray-200'}`}
                    onClick={() => handleSelectPaymentMethod('bank')}
                  >
                    <div className='flex items-center justify-between'>
                      <div className='flex items-center space-x-3'>
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'bank' ?
                          'border-pink-500 bg-pink-500' : 'border-gray-300'}`}
                        >
                          {paymentMethod === 'bank' &&
                            <div className='w-2 h-2 bg-white rounded-full'></div>
                          }
                        </div>
                        <span className='font-medium'>โอนผ่านบัญชีธนาคาร</span>
                      </div>
                      <div className='flex space-x-2'>
                        <TicketCheck className='w-6 h-6 text-green-500' />
                      </div>
                    </div>
                    {paymentMethod === 'bank' && (
                      <BankTransferForm
                        token={token}
                        bookingId={bookingId}
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
      {!hideAllExceptDetails && (
        <div className='space-y-3'>
          <ConfirmDialog
            title='ยกเลิกการจอง'
            description='คุณต้องการยกเลิกการจองนี้ใช่หรือไม่? การกระทำนี้จะไม่สามารถย้อนกลับได้'
            confirmText='ยืนยัน'
            cancelText='ยกเลิก'
            onConfirm={handleCancelBooking}
          >
            <button
              // onClick={handleCancelBooking}
              className='w-full bg-gray-200 text-gray-700 py-3 rounded-lg font-medium 
            hover:bg-gray-300 transition-colors'
            disabled={loading}
            >
              ยกเลิกการจอง
            </button>
          </ConfirmDialog>
        </div>
      )}

      {bookingStatus !== 'DRAFT' && (
        <div className='flex flex-col justify-center mt-4'>
          <button
            type='button'
            className='p-2 bg-brand-pink text-white rounded-md hover:bg-pink-600
          hover:text-white'
            onClick={handleBack}
          >
            ย้อนกลับ
          </button>
        </div>
      )}
      <Pre_Footer />
    </div>
  )
}

export default PaymentUser
