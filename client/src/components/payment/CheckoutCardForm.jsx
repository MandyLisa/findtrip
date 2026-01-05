import { loadStripe } from '@stripe/stripe-js'
import { EmbeddedCheckoutProvider, EmbeddedCheckout } from '@stripe/react-stripe-js'
import { createStripePayment } from '../../API/payment'
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY)


const CheckoutCardForm = ({ token, bookingId }) => {
    const fetchClientSecret = async () => {
        try {
            // Step 1: สร้าง stripe session
            const response = await createStripePayment(token, bookingId)
            // step 2: ตรวจสอบว่า clientSecret มีอยู่จริง และเป็น string ก่อน return
            if (response.data && typeof response.data.clientSecret === 'string') {
                return response.data.clientSecret
            } else {
                console.error('Client secret is missing or not a string in backend response')
                throw new Error('Stripe client secret missing or invalid.')
            }

        } catch (error) {
            console.log('Error Stripe payment: ', error)
            throw error // สำคัญ ต้อง throw error กลับไป เพื่อให้ Stripe.js จัดการ
        } 
    }
    const options = { fetchClientSecret } // มันคือค่าที่ return จาก response.data.clientSecret ส่งไปให้ตัว Embedded
    return (
        <div id='checkout'>
            {stripePromise && options && (
                <EmbeddedCheckoutProvider
                    stripe={stripePromise}
                    options={options}
                >
                    <EmbeddedCheckout />
                </EmbeddedCheckoutProvider>
            )}
        </div>
    )
}

export default CheckoutCardForm
