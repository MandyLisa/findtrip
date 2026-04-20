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
    // Embedded Checkout ต้องการ Checkout Session client secret เพื่อโหลดหน้าจ่ายเงินของ Checkout ภายในเว็บของเรา
    return (
        <div id='checkout'>
            {/* เพิ่มส่วนของ Info Box สำหรับการทดสอบ */}
            <div className='bg-blue-50 border-l-4 border-blue-400 p-4 mb-6 rounded-r-md shadow-sm'>
                <div className='flex'>
                    <div className='ml-3'>
                        <p className='text-sm text-blue-700 font-medium'>
                            โหมดทดสอบ (Test Mode)
                        </p>
                        <p className='text-xs text-blue-600 mt-1'>
                            คุณสามารถทดสอบการชำระเงินได้โดยใช้หมายเลขบัตร:
                            <span className='font-mono bg-blue-100 px-1 mx-1 border border-blue-200 rounded'>
                                4242 4242 4242 4242
                            </span>
                            (CVC และวันหมดอายุสามารถระบุเป็นเลขใดก็ได้ แต่วันหมดอายุควรเป็นอนาคต)
                        </p>
                    </div>
                </div>
            </div>
            {stripePromise && options && (
                <EmbeddedCheckoutProvider //Stripe Checkout แบบฝังในหน้า (Embedded Checkout)
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
