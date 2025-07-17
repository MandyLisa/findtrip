import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { getBookingDetail } from '../../API/booking'
import useAuthStore from '../../store/authStore'

const PaymentReceipt = () => {
    const { bookingId } = useParams()
    const token = useAuthStore((state) => state.token)
    const [paymentDetails, setPaymentDetails] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (bookingId) { 
            fetchPaymentDetails()
        }
    }, [bookingId])

    const fetchPaymentDetails = async () => {
        try {
            setLoading(true) // Set loading to true before fetching
            const res = await getBookingDetail(token, bookingId)
            console.log('ดู fetchBookingDetails ', res)
            setPaymentDetails(res.data.booking) 
        } catch (error) {
            console.error('Error fetching payment details: ', error)
        } finally {
            setLoading(false) 
        }
    }

    if (loading) {
        return <div>Loading booking details...</div>
    }


    if (!paymentDetails) {
        return <div>No booking details found for ID: {bookingId}.</div>
    }

    return (
        <div>
            <h1>ใบเสร็จการชำระเงิน</h1>
            <p><strong>Booking ID:</strong> {bookingId}</p>

            {/* Display other booking details */}
            <p><strong>ชื่อลูกค้า:</strong> {paymentDetails.customerName}</p>
            <p><strong>วันที่จอง:</strong> {new Date(paymentDetails.bookingDate).toLocaleDateString()}</p>
            <p><strong>บริการ:</strong> {paymentDetails.serviceName}</p>
            <p><strong>ราคารวม:</strong> {paymentDetails.totalAmount} บาท</p>
            <p><strong>สถานะการชำระเงิน:</strong> <span style={{ color: 'green', fontWeight: 'bold' }}>{paymentDetails.paymentStatus}</span></p>

            {/* You can add more details here based on your actual bookingDetails structure */}
        </div>
    )
}

export default PaymentReceipt


