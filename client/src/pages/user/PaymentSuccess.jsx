import { useNavigate, useSearchParams } from 'react-router-dom'
import { CheckCircle, Clock } from 'lucide-react'
import { useEffect, useState } from 'react'
import { stripeCheckoutStatus } from '../../API/payment'
import { toast } from 'react-toastify'
import useAuthStore from '../../store/authStore'

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams() // สำหรับ Bank Transfer (booking_id, paymentMethod, bankName)
  const sessionId = searchParams.get('session_id')// 
  // const { sessionId } = useParams() // สำหรับ Credit Card (sessionId)
  const navigate = useNavigate()
  const token = useAuthStore((state) => state.token)

  const [paymentStatus, setPaymentStatus] = useState('กำลังตรวจสอบสถานะ...')
  const [statusIcon, setStatusIcon] = useState(null) // icon ที่จะแสดง
  const [message, setMessage] = useState('') // ข้อความที่จะแสดง
  const [bookingDisplayInfo, setBookingDisplayInfo] = useState(null) // ข้อมูล booking ที่จะแสดง

  useEffect(() => {
    if (!token) return
    if (sessionId) {
      verifyStripePayment() // <<<< สำหรับ Credit Card
    } else if (searchParams.get('booking_id') && searchParams.get('paymentMethod') === 'BANK_TRANSFER') {
      handleBankTransferSuccess() // <<<< สำหรับ Bank Transfer
    } else {
      toast.error('ไม่พบข้อมูลการชำระเงินที่ถูกต้อง')  // ถ้าไม่มีข้อมูลที่จำเป็น
      navigate('/user/payment', { replace: true }) // ตรงนี้ทำเพื่อ? อาจจะพาไปหน้า error หรือหน้าจ่ายเงินอีกครั้ง
    }
  }, [sessionId, searchParams, token, navigate])

  // Logic สำหรับ Credit Card
  const verifyStripePayment = async () => {
    if (!token || !sessionId) return

    setPaymentStatus('กำลังยืนยันการชำระเงินด้วยบัตรเครดิต...')

    try {
      const response = await stripeCheckoutStatus(token, sessionId)
      // console.log('ดู verifyStripePayment ตรงนี้', response)

      if (response.data.paymentStatus === 'PAID') {
        setPaymentStatus('การชำระเงินสำเร็จ!')
        setMessage('เราได้รับยอดชำระของคุณแล้ว การจองของคุณได้รับการยืนยันแล้ว')
        setStatusIcon(<CheckCircle className='w-16 h-16 text-green-500 mx-auto mb-4' />)
        if (response.data.booking) {
          setBookingDisplayInfo(response.data.booking)
        }
      } else {
        setPaymentStatus('การชำระเงินยังไม่สำเร็จ')
        setMessage('การชำระเงินของคุณอาจมีปัญหา โปรดตรวจสอบสถานะการจองได้ที่ การจองของฉัน')
        setStatusIcon(<Clock className='w-16 h-16 text-orange-500 mx-auto mb-4' />)

      }

    } catch (error) {
      console.error('Error verifying Stripe payment:', error)
      setPaymentStatus('เกิดข้อผิดพลาดในการยืนยันการชำระเงิน') // ทำไมได้อันนี้
      setMessage('ไม่สามารถยืนยันสถานะการชำระเงินได้ กรุณาลองใหม่ภายหลัง หรือติดต่อผู้ดูแลระบบ')
      setStatusIcon(<Clock className='w-16 h-16 text-red-600 mx-auto mb-4' />)// อาจใช้ XCircle
    }
  }

  // Logic สำหรับ Bank Transfer 
  const handleBankTransferSuccess = () => {
    const bookingId = searchParams.get('booking_id')
    const bankName = searchParams.get('bankName')
    setPaymentStatus('อัปโหลดสลิปสำเร็จ!')
    setMessage(`เราได้รับสลิปการโอนเงินของคุณสำหรับการจอง ID: ${bookingId} ผ่าน${bankName}แล้ว กรุณารอการตรวจสอบ ภายใน 24 ชม.`)
    setStatusIcon(<Clock className='w-16 h-16 text-blue-500 mx-auto mb-4' />) // icon สำหรับรอตรวจสอบ
    setBookingDisplayInfo({ id: bookingId, paymentMethod: 'โอนเงินผ่านธนาคาร', bankName: bankName })
  }

  return (
    <div className='container mx-auto p-6 bg-white rounded-lg shadow-md mt-10 max-w-full text-center'>
      {statusIcon}
      <h1 className='text-3xl font-bold mb-3'>{paymentStatus}</h1>
      <p className='text-gray-700 text-lg mb-6'>{message}</p>
      {bookingDisplayInfo && (
        <div className='bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6 text-left'>
          <p className='font-semibold text-gray-800 text-xl mb-2 items-center'>รายละเอียดการจอง:</p>
          <p className='text-gray-700'><strong>รหัสการจอง:</strong> {bookingDisplayInfo.id}</p>
          {bookingDisplayInfo.paymentMethod && (
            <p className='text-gray-700'><strong>ช่องทางชำระเงิน:</strong> {bookingDisplayInfo.paymentMethod}</p>
          )}
          {bookingDisplayInfo.bankName && (
            <p className='text-gray-700'><strong>ธนาคารที่โอน:</strong> {bookingDisplayInfo.bankName}</p>
          )}
          {bookingDisplayInfo.tourPackageId && (
            <p className='text-gray-700'><strong>เลขไอดีทัวร์:</strong> {bookingDisplayInfo.tourPackageId}</p>
          )}
          {typeof bookingDisplayInfo.adultCount === 'number' && (
            <p className='text-gray-700'><strong>จำนวนผู้เดินทาง(ผู้ใหญ่):</strong> {bookingDisplayInfo.adultCount} ท่าน</p>
          )}
          {typeof bookingDisplayInfo.childCount === 'number' && (
            <p className='text-gray-700'><strong>จำนวนผู้เดินทาง(เด็กเล็ก):</strong> {bookingDisplayInfo.childCount} ท่าน</p>
          )}
          {typeof bookingDisplayInfo.singleStayCount === 'number' && (
            <p className='text-gray-700'><strong>จำนวนผู้พักแยกห้อง:</strong> {bookingDisplayInfo.singleStayCount} ท่าน</p>
          )}
          {bookingDisplayInfo.createdDate && (
            <p className='text-gray-700'><strong>วันที่ทำรายการ:</strong> {bookingDisplayInfo.createdDate}</p>
          )}
          {bookingDisplayInfo.updatedDate && (
            <p className='text-gray-700'><strong>วันที่ชำระเงิน:</strong> {bookingDisplayInfo.updatedDate}</p>
          )}
          {bookingDisplayInfo.totalPrice && (
            <p className='text-gray-700'><strong>ราคาแพ็คเกจ:</strong> {bookingDisplayInfo.totalPrice}</p>
          )}
        </div>
      )}
      <button
        onClick={() => navigate('/user/mybookings')}
        className='mt-4 bg-brand-pink text-white py-3 px-6 rounded-lg font-medium
        hover:bg-pink-600 transition-colors text-lg'
      >
        ดูสถานะการจองของฉัน
      </button>
    </div>
  )
}

export default PaymentSuccess
