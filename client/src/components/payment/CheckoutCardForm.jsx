import { loadStripe } from '@stripe/stripe-js'
import { EmbeddedCheckoutProvider, EmbeddedCheckout } from '@stripe/react-stripe-js'
import { createStripePayment } from '../../API/payment'
import { useState, useCallback, useMemo } from 'react'
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY)


const CheckoutCardForm = ({ token, bookingId, isSubmitting, setIsSubmitting }) => {

    const [loadingCheckoutCard, setLoadingCheckoutCard] = useState(false)

    const fetchClientSecret = useCallback(async () => { // ใช้ useCallback เพื่อล็อคฟังก์ชัน fetchClientSecret ไม่ให้สร้างใหม่
        try {
            setLoadingCheckoutCard(true) // เริ่ม loading
            setIsSubmitting(true)        // ล็อคปุ่มยกเลิกที่หน้า Parent

            // Step 1: สร้าง stripe session
            const response = await createStripePayment(token, bookingId)
            // step 2: ตรวจสอบว่า clientSecret มีอยู่จริง และเป็น string ก่อน return
            if (response.data && typeof response.data.clientSecret === 'string') {
                // เมื่อได้ secret มาแล้ว ระบบ Stripe จะขึ้นหน้าฟอร์ม เรายังคงให้ isSubmitting เป็น true ต่อไปจนกว่าจะชำระเงินเสร็จ
                return response.data.clientSecret
            } else {
                console.error('Client secret is missing or not a string in backend response')
                throw new Error('Stripe client secret missing or invalid.')
            }

        } catch (error) {
            console.log('Error Stripe payment: ', error)
            setIsSubmitting(false) // ถ้าเกิด error ให้ปลดล็อคปุ่มยกเลิกที่หน้า Parent เพื่อให้ User สามารถลองใหม่ได้
            setLoadingCheckoutCard(false)
            throw error // throw error กลับไป เพื่อให้ Stripe.js จัดการ
        }
    }, [token, bookingId, setIsSubmitting]) // จะสร้างฟังก์ชันใหม่เฉพาะเมื่อ token หรือ bookingId เปลี่ยนเท่านั้น

    // 2. ใช้ useMemo เพื่อล็อค Object options ไม่ให้สร้างใหม่
    const options = useMemo(() => ({ fetchClientSecret }), [fetchClientSecret])
    // มันคือค่าที่ return จาก response.data.clientSecret ส่งไปให้ตัว Embedded
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
                                4242 4242 4242 4242 และอีเมล์ test@example.com
                            </span>
                            (CVC และวันหมดอายุสามารถระบุเป็นเลขใดก็ได้ แต่วันหมดอายุควรเป็นอนาคต)
                        </p>
                    </div>
                </div>
            </div>

            {/* 3. Render เมื่อพร้อม และระบุ options ที่ถูกล็อคค่าไว้แล้ว */}
            {stripePromise && options.fetchClientSecret && (
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
