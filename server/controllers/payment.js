const prisma = require('../config/prisma') // Import Prisma Client
const { sendPaymentSuccessEmail } = require('../utils/email')
const { v4: uuidv4 } = require('uuid') // ใช้สร้าง transactionId แบบสุ่ม
const cloudinary = require('../utils/cloudinary')
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)
const Stripe = require('stripe')


// user อัพโหลด payment slip
exports.uploadPaymentSlip = async (req, res) => {

    console.log('เข้า uploadPaymentSlip ไหม ?????????')

    try {
        const { bookingId } = req.params // <-- ดึงจาก URL
        console.log('ดูก่อนว่า bookingId ได้อะไร', bookingId)
        const { bankName } = req.body
        const slipFile = req.file // ดึงไฟล์ที่อัปโหลด
        const userId = req.user.id; // ดึง userId จาก token

        if (!slipFile) {
            return res.status(400).json({ message: 'No slip file uploaded' })
        }

        if (!bankName) {
            return res.status(400).json({ message: 'Bank Name are required' })
        }

        const numericBookingId = Number(bookingId)

        // 1. ตรวจสอบ Booking เพื่อดึง totalPrice และยืนยันว่าเป็นของ user นี้จริง
        const booking = await prisma.booking.findFirst({
            where: {
                id: numericBookingId,
                userId: userId
            }
        })

        if (!booking) {
            return res.status(404).json({ message: 'Booking Not Found' });
        }

        const fileBuffer = req.file.buffer

        // 2. อัพโหลดไฟล์ไป Cloudinary
        const fileBase64 = `data:${slipFile.mimetype};base64,${fileBuffer.toString('base64')}`;

        const result = await cloudinary.uploader.upload(fileBase64, {
            public_id: `slip-${Date.now()}`,
            resource_type: 'image',
            folder: 'findtrip2025/slips'
        })

        console.log('ได้ result ไหม ========== ', result)

        // 3. ตรวจสอบว่ามี Payment record สำหรับ booking นี้อยู่แล้วหรือไม่
        let payment = await prisma.payment.findUnique({
            where: { bookingId: numericBookingId }
        })

        if (payment) {
            // **ถ้ามี Payment record อยู่แล้ว: ให้อัปเดตข้อมูล**
            // (เช่น กรณีที่ผู้ใช้อัปโหลดสลิปซ้ำ หรือเปลี่ยนใจเลือกธนาคารใหม่)
            const updatedPayment = await prisma.payment.update({
                where: { bookingId: numericBookingId },
                data: {
                    paymentMethod: 'BANK_TRANSFER', // ตั้งค่าเป็นโอนเงิน
                    bankName: bankName,
                    secure_url: result.secure_url, // URL ของรูปจาก Cloudinary
                    public_id: result.public_id, // public_id ของรูป
                    paymentDate: new Date(),
                    paymentStatus: 'PENDING', // สถานะรอตรวจสอบ
                    amount: booking.totalPrice // ใช้ totalPrice จาก booking
                }
            })
            console.log('Payment record updated:', updatedPayment)
            res.status(200).json({ message: 'Payment slip uploaded and payment updated successfully', payment: updatedPayment })

        } else {
            // **ถ้ายังไม่มี Payment record: ให้สร้างขึ้นมาใหม่**
            const newPayment = await prisma.payment.create({
                data: {
                    bookingId: booking.id, // ใช้ booking.id จากที่ดึงมา
                    paymentMethod: 'BANK_TRANSFER',
                    bankName: bankName,
                    secure_url: result.secure_url,
                    public_id: result.public_id,
                    paymentDate: new Date(),
                    paymentStatus: 'PENDING',
                    amount: booking.totalPrice, // ใช้ totalPrice จาก booking
                    transactionId: `BANK-${Date.now()}-${booking.id}` // สร้าง transactionId ง่ายๆ สำหรับการโอน
                }
            })
            console.log('New Payment record created:', newPayment);
            res.status(201).json({ message: 'Payment slip uploaded and new payment created successfully', payment: newPayment });
        }
        // 4. อัปเดตสถานะ Booking ให้เป็น 'PENDING'
        // เพิ่มโค้ดส่วนนี้ก่อนการส่ง response กลับ
        const updatedBooking = await prisma.booking.update({
            where: { id: numericBookingId },
            data: {
                bookingStatus: 'PENDING', // ตั้งสถานะการจองเป็น PENDING รอการตรวจสอบสลิป
            },
        })
        console.log('Booking status updated to PENDING:', updatedBooking)

    } catch (err) {
        console.error('Error uploading payment slip:', err)
        res.status(500).json({ message: 'Server Error during slip upload or payment update', error: err.message })
    }
}

// user ดูสถานะการชำระเงิน (ตาม bookingId)
exports.checkPaymentStatus = async (req, res) => {
    try {
        const { bookingId } = req.params

        const payment = await prisma.payment.findUnique({ 
            where: { 
                bookingId: parseInt(bookingId) 
            } 
        })

        if (!payment) {
            return res.status(404).json({ message: 'Payment not found!' });
        }

        res.json(payment);

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
};

// User ดูรายละเอียดการชำระเงินของตัวเอง
exports.getPaymentDetails = async (req, res) => {
    try {
        const { paymentId } = req.params;

        const payment = await prisma.payment.findUnique({ where: { id: parseInt(paymentId) } });

        if (!payment) {
            return res.status(404).json({ message: 'Payment not found!' });
        }

        res.json(payment);

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
};


// Admin ดูรายการชำระเงินทั้งหมด
exports.listPayments = async (req, res) => {
    try {
        const payments = await prisma.payment.findMany({
            orderBy: { paymentDate: 'desc' },
        });
        res.json(payments);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
};

// Admin ยืนยันการชำระเงินและอัพเดตสถานะให้ลค.
exports.confirmPaymentSlip = async (req, res) => {
    try {
        const { paymentId } = req.params;

        // 1. ตรวจสอบว่า paymentId ที่แอดมินเลือกมีอยู่ในระบบหรือไม่
        const payment = await prisma.payment.findUnique({
            where: { id: Number(paymentId) },
            include: { // นำข้อมูลการจองมาด้วยเพื่อให้แอดมินเห็นข้อมูลที่เกี่ยวข้อง
                booking: {
                    include: {
                        user: true,   // ดึงอีเมลผู้จอง
                        tourPackage: true,
                    },
                },
            },
        });

        if (!payment) {
            return res.status(404).json({ message: 'Payment not found' });
        }

        // 2. ตรวจสอบสถานะการชำระเงินปัจจุบัน
        if (payment.paymentStatus === 'CONFIRMED') {
            return res.status(400).json({ message: 'Payment has already been confirmed' });
        }

        // 3. อัปเดตสถานะการชำระเงินเป็น 'CONFIRMED'
        const updatedPayment = await prisma.payment.update({
            where: { id: payment.id },
            data: {
                paymentStatus: 'CONFIRMED',
                updatedDate: new Date(),
            },
        });

        // 4. อัปเดตสถานะการจองเป็น "Confirmed" หากการชำระเงินเสร็จสมบูรณ์
        await prisma.booking.update({
            where: { id: payment.bookingId },
            data: {
                bookingStatus: 'CONFIRMED',
            },
        });

        // 5. ส่งอีเมลยืนยันไปยังผู้ใช้งาน
        const userEmail = payment.booking.user.email;
        const tourTitle = payment.booking.tourPackage.title;

        await sendPaymentSuccessEmail(userEmail, tourTitle, payment.booking.id);

        // 6. ส่งผลลัพธ์การอัปเดต
        res.json({
            message: 'Payment successfully confirmed',
            payment: updatedPayment,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error', err });
    }
};

// Admin ยกเลิกการชำระเงิน (ลบ Payment)
exports.deletePayment = async (req, res) => {
    try {
        const { bookingId } = req.params;

        const payment = await prisma.payment.findUnique({
            where: {
                bookingId: parseInt(bookingId)
            }
        });

        if (!payment) {
            return res.status(404).json({ message: 'Payment not found!' });
        }

        await prisma.payment.delete({
            where: {
                bookingId: parseInt(bookingId)
            }
        });

        res.json({ message: 'Payment deleted successfully!' });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
};
