const prisma = require('../config/prisma')
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)
const { v4: uuidv4 } = require('uuid') // ใช้สร้าง transactionId แบบสุ่ม
const { sendPaymentSuccessEmail } = require('../utils/email')


// 1. สร้าง “หน้าจ่ายเงินของ Stripe” ให้ผู้ใช้กรอกบัตร + ขอ clientSecret กลับไปให้ Frontend “ยังไม่ได้กดชำระเงิน”
exports.createStripePayment = async (req, res) => { // สร้าง Stripe Checkout Session ให้ frontend เอาไปแสดง <EmbeddedCheckout /> + ขอ clientSecret”
    try {
        const { bookingId } = req.body // รับ bookingId เพื่อจะได้รู้ว่ากำลังจะจ่ายเงินสำหรับการจองไหน
        const userId = req.user.id //และใครเป็นผู้จ่าย
        // console.error(userId)
        // console.error(bookingId)

        const booking = await prisma.booking.findFirst({ // หา booking ใน DB ว่ามีจริงไหม
            where: { id: bookingId }
        })


        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' })
        }

        // **เช็คการจ่ายซ้ำ** ตรวจสอบว่ามีการชำระเงินที่สำเร็จแล้วสำหรับการจองนี้หรือไม่ เพื่อป้องกันการสร้าง Stripe Session ซ้ำซ้อน
        const existingPayment = await prisma.payment.findFirst({
            where: {
                bookingId: booking.id,
                paymentStatus: 'PAID'
            }
        })

        if (existingPayment) {
            return res.status(400).json({ message: 'Payment for this booking has already been processed' })
        }

        const { totalPrice } = booking // destructure โค้ดออกมา เพื่อ เอายอด totalPrice ไปสร้าง Stripe Checkout Session

        const session = await stripe.checkout.sessions.create({
            ui_mode: 'embedded', // บอกว่าเป็นแบบ Embedded Checkout
            metadata: { // ฝังข้อมูลไว้ใช้ตรวจตอนยืนยันผล
                bookingId: booking.id,
                userId: userId
            },
            payment_method_types: ['card'], // เฉพาะบัตรเครดิต
            line_items: [ // รายการที่จะแสดงในหน้า Checkout ของ Stripe
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
        })

        // ส่ง clientSecret กลับไปให้ Frontend 
        res.status(201).json({ clientSecret: session.client_secret })
        // console.error('ขั้นตอนสุดท้ายของ createStripePayment =========')

    } catch (error) {
        console.error('Error createStripePayment', error)
        res.status(500).json({ message: 'Server Error Creating Stripe Session' })
    }
}

// 2. เมื่อผู้ใช้กดปุ่มชำระเงิน เช็คกับ Stripe ว่าสุดท้าย “จ่ายสำเร็จจริงไหม” แล้วค่อยอัปเดตใน DB
exports.stripeCheckoutStatus = async (req, res) => {
    try {
        const { sessionId } = req.params // รับ sessionId ที่ Frontend ส่งมา เพื่อไปเช็คกับ Stripe ว่าสถานะการจ่ายเงินของ session นี้เป็นยังไง ก่อนอัพเดตลง DB
        const userId = req.user.id

        if (!sessionId) {
            return res.status(400).json({ message: 'Session ID is required' })
        }

        // 1. ดึงข้อมูล Session จาก Stripe API เพื่อยืนยันสถานะการชำระเงินที่ฝั่ง Stripe
        const session = await stripe.checkout.sessions.retrieve(sessionId)
        // console.error('session ================ ', session)

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

            const result = await prisma.$transaction(async (tx) => {
                const booking = await tx.booking.findUnique({
                    where: { id: sessionBookingId },
                })

                if (!booking) {
                    console.error(`Booking not found for payment confirmation: ${sessionBookingId}`)
                    return { notFound: true }
                }

                const existingPayment = await tx.payment.findUnique({
                    where: { bookingId: booking.id },
                })

                if (existingPayment?.paymentStatus === 'PAID' && booking.bookingStatus === 'PAID') {
                    return { alreadyPaid: true, paymentId: existingPayment.id }
                }

                const payment = await tx.payment.upsert({
                    where: { bookingId: booking.id },
                    update: {
                        paymentMethod: 'CREDIT_CARD',
                        paymentStatus: 'PAID',
                        transactionId: session.id,
                        paymentDate: new Date(),
                        amount: session.amount_total / 100,
                    },
                    create: {
                        bookingId: booking.id,
                        paymentMethod: 'CREDIT_CARD',
                        paymentStatus: 'PAID',
                        transactionId: session.id,
                        paymentDate: new Date(),
                        amount: session.amount_total / 100,
                    },
                })

                await tx.booking.update({
                    where: { id: booking.id },
                    data: { bookingStatus: 'PAID' },
                })

                return {
                    alreadyPaid: false,
                    paymentId: payment.id,
                }
            })

            if (result?.notFound) {
                return res.status(404).json({ message: 'Associated booking not found.' })
            }

            if (!result?.alreadyPaid) {
                try {
                    await sendPaymentSuccessEmail(null, result.paymentId)
                } catch (emailError) {
                    console.error('Payment confirmed but email sending failed: ', emailError)
                }
            }

            return res.status(200).json({
                message: result?.alreadyPaid ? 'Payment already confirmed.' : 'Payment Complete',
                paymentStatus: 'PAID',
            })

        } else {
            // กรณีที่ payment_status ไม่ใช่ 'paid' (เช่น 'unpaid', 'canceled', 'requires_payment_method')
            console.error(`Stripe session ${sessionId} payment status: ${session.payment_status}`)
            res.status(400).json({
                message: `Payment status is ${session.payment_status}. Not confirmed`,
                paymentStatus: session.payment_status
            })
        }

    } catch (error) {
        console.error('Error confirming Stripe payment:', error)
        res.status(500).json({ message: 'Server error during payment confirmation' })
    }
}