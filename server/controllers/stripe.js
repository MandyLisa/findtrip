const prisma = require('../config/prisma')
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)
const { v4: uuidv4 } = require('uuid') // ใช้สร้าง transactionId แบบสุ่ม
const { sendPaymentSuccessEmail } = require('../utils/email')


// 1. ดูผู้ใช้ทั้งหมด
exports.createStripePayment = async (req, res) => {
   
    try {
        const { bookingId } = req.body
        const userId = req.user.id
        // console.log(userId)
        // console.log(bookingId)

        const booking = await prisma.booking.findFirst({
            where: { id: bookingId }
        })


        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' })
        }

        // **สำคัญ** ตรวจสอบว่ามีการชำระเงินที่สำเร็จแล้วสำหรับการจองนี้หรือไม่ เพื่อป้องกันการสร้าง Stripe Session ซ้ำซ้อน
        const existingPayment = await prisma.payment.findFirst({
            where: {
                bookingId: booking.id,
                paymentStatus: 'PAID'
            }
        })


        if (existingPayment) {
            return res.status(400).json({ message: 'Payment for this booking has already been processed' })
        }

        const { totalPrice } = booking // destructure โค้ดออกมา เวลาเอาไปใช้ จะได้ไม่ต้อง . ยาวๆ (ตัวอย่างแบบยาวเช่น booking.data.data.totalPrice)

        const session = await stripe.checkout.sessions.create({
            ui_mode: 'embedded',
            metadata: {
                bookingId: booking.id,
                userId: userId
            },
            payment_method_types: ['card'], // เฉพาะบัตรเครดิต
            line_items: [
                {
                    quantity: 1,
                    price_data: {
                        currency: 'thb',
                        product_data: {
                            name: 'ยอดเงินรวมที่ต้องชำระ',
                            description: `สำหรับการจองหมายเลข #${booking.id}`
                        },
                        unit_amount: totalPrice * 100
                    }
                },
            ],
            mode: 'payment',
            return_url: `http://localhost:5173/user/payment-success?session_id={CHECKOUT_SESSION_ID}&booking_id=${bookingId}`, // หน้าที่บอกว่า เมื่อจ่ายเงินเสร็จ จะให้มันไปไหน
            // `${process.env.FRONTEND_URL}/user/payment-success?session_id={CHECKOUT_SESSION_ID}`
        })


        // ส่ง clientSecret กลับไปให้ Frontend เพื่อเริ่มต้น Stripe Embedded Checkout
        res.status(201).json({ clientSecret: session.client_secret })
        console.log('ขั้นตอนสุดท้ายของ createStripePayment =========')

    } catch (error) {
        console.log('Error createStripePayment', error)
        res.status(500).json({ message: 'Server Error Creating Stripe Session', error })
    }
}

exports.stripeCheckoutStatus = async (req, res) => {
    try {

        const { sessionId } = req.params
        const userId = req.user.id 


        if (!sessionId) {
            return res.status(400).json({ message: 'Session ID is required' })
        }

        // 1. ดึงข้อมูล Session จาก Stripe API เพื่อยืนยันสถานะการชำระเงินที่ฝั่ง Stripe
        const session = await stripe.checkout.sessions.retrieve(sessionId)
        console.log('ได้ session ================ กลับมาไหม ', session)

        // 2. ตรวจสอบว่า session นี้เป็นของผู้ใช้คนปัจจุบันจริงหรือไม่ (จาก metadata)
        const sessionBookingId = Number(session.metadata.bookingId)
        const sessionUserId = Number(session.metadata.userId)

        if (!sessionBookingId || !sessionUserId || sessionUserId !== userId) {
            console.warn(`Attempted payment confirmation by wrong user or invalid metadata`)
            return res.status(403).json({ message: 'Unauthorized or invalid payment session data' })
        }

        // 3. ตรวจสอบสถานะการชำระเงินของ Stripe Session
        if (session.payment_status === 'paid') {
            // การชำระเงินสำเร็จบน Stripe

            // 3. ค้นหา Booking ใน DB ของเรา
            const booking = await prisma.booking.findUnique({
                where: { id: sessionBookingId }
            })

            console.log('ได้ booking ================ อะไร ', booking)

            if (!booking) {
                console.error(`Booking not found for payment confirmation: ${sessionBookingId}`)
                return res.status(404).json({ message: 'Associated booking not found.' })
            }

            // 4. ตรวจสอบและสร้าง/อัปเดต Payment record
            let payment = await prisma.payment.findUnique({
                where: { bookingId: booking.id }
            })

            if (payment) {
                // ถ้ามี Payment record อยู่แล้ว (อาจจะอยู่ในสถานะ PENDING จากการโอนเงิน หรือเคยสร้างไว้ก่อน)
                // ให้อัปเดตสถานะและข้อมูลที่เกี่ยวข้องกับการชำระเงินด้วยบัตร
                if (payment.paymentStatus === 'PAID') {
                    // ป้องกันการอัปเดตซ้ำ ถ้าสถานะเป็น PAID อยู่แล้ว
                    console.log(`Payment for booking ${booking.id} already PAID.`)
                    return res.status(200).json({ message: 'Payment already confirmed.', paymentStatus: 'PAID', booking: booking })
                }

                payment = await prisma.payment.update({
                    where: { id: payment.id },
                    data: {
                        paymentMethod: 'CREDIT_CARD',
                        paymentStatus: 'PAID',
                        transactionId: session.id, // ใช้ Stripe Session ID เป็น transaction ID
                        paymentDate: new Date(),
                        amount: session.amount_total / 100, // แปลงจากสตางค์เป็นบาท
                    },
                    include: { booking: true } // ดึงข้อมูล booking กลับไปด้วย
                })
                console.log('Existing Payment record updated to PAID:', payment)

            } else {
                // ถ้ายังไม่มี Payment record (กรณีที่ไม่เคยเลือกช่องทางอื่นมาก่อน หรือเพิ่งสร้าง session)
                // ให้สร้าง Payment record ใหม่
                payment = await prisma.payment.create({
                    data: {
                        bookingId: booking.id,
                        paymentMethod: 'CREDIT_CARD',
                        paymentStatus: 'PAID',
                        transactionId: session.id,
                        paymentDate: new Date(),
                        amount: session.amount_total / 100,
                        // อาจจะใช้ uuidv4() ถ้าคุณต้องการรันเลข transactionId ภายในของคุณด้วย
                        // transactionId: uuidv4(),
                    },
                    include: { booking: true }
                })
            }

            console.log('Existing Payment record updated to PAID: ============', payment)
            // 5. update DB bookingStatus ให้เป็น PAID (เมื่อชำระเงินสำเร็จ)
            const updatedBooking = await prisma.booking.update({
                where: {
                    id: booking.id
                },
                data: {
                    bookingStatus: 'PAID'
                }
            })

            console.log('111111111111111111111 ============')

            await sendPaymentSuccessEmail(req.user.email, payment.id)

             console.log('22222222222222222222 ============')


            res.status(200).json({
                message: 'Payment Complete',
                paymentStatus: 'PAID',
            })

        } else {
            // กรณีที่ payment_status ไม่ใช่ 'paid' (เช่น 'unpaid', 'canceled', 'requires_payment_method')
            console.log(`Stripe session ${sessionId} payment status: ${session.payment_status}`)
            res.status(400).json({
                message: `Payment status is ${session.payment_status}. Not confirmed`,
                paymentStatus: session.payment_status
            })
        }

    } catch (error) {
        console.error('Error confirming Stripe payment:', error)
        res.status(500).json({ message: 'Server error during payment confirmation', error })
    }
}