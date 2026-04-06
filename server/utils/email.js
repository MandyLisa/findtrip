const prisma = require('../config/prisma')
require('dotenv').config() // คำสั่งนี้จะโหลดค่าต่างๆ ที่เก็บไว้ในไฟล์ .env ให้สามารถใช้งานได้ในโค้ด
const nodemailer = require('nodemailer') // นำเข้า Nodemailer เพื่อสั่งให้มันทำงานตามเหตุการณ์

// 4. ตั้งค่า Nodemailer สามารถใช้ค่าจาก .env ได้ทันที
const transporter = nodemailer.createTransport({
    service: 'gmail', // 
    auth: {
        user: process.env.EMAIL_USER, // ใช้ค่าจาก .env
        pass: process.env.EMAIL_PASS, // ใช้ค่าจาก .env
        //ค่าจาก .env จะถูกโหลดเข้า process.env โดยอัตโนมัติ ทำให้เราสามารถใช้งานในโค้ดได้ทันที
    },
})

exports.sendBookingConfirmationEmail = async (toEmail, bookingId) => {
    try {
        console.log("--- DEBUG EMAIL START ---")
        console.log("1. Received toEmail from controller:", toEmail)
        console.log("2. Received bookingId:", bookingId)
        // 1. ดึงข้อมูล booking พร้อม tour package และ user
        const booking = await prisma.booking.findUnique({
            where: { id: bookingId },
            include: {
                tourPackage: true,
                user: true,
            },
        })

        if (!booking) throw new Error('Booking not found')

        // 📌 จุดสำคัญ: ตรวจสอบว่าใน Database ผู้ใช้คนนี้มีอีเมลไหม
        console.log("3. User Email from DB:", booking.user?.email)

        const { tourPackage, user } = booking

        // ถ้า toEmail ที่รับมาเป็น undefined 
        // ให้ไปใช้ user.email จากฐานข้อมูลที่เรา include มาแทน
        const recipient = toEmail || booking.user?.email

        if (!recipient) {
            throw new Error('No email address found for this user')
        }

        console.log("4. Final Recipient:", recipient)

        const paymentLink = `http://localhost:5173/user/payments/${bookingId}`


        // 2. สร้างเนื้อหาอีเมล (HTML) พร้อม QR Code จริง
        const htmlContent = `
            <h2>ยืนยันการจองแพ็คเกจทัวร์  ${tourPackage.title} </h2>
            <p>คุณ ${user.name || ''} ${user.surname || ''} ได้ทำการจองแพ็คเกจทัวร์เรียบร้อยแล้ว</p>
            <ul>
                <li><strong>ชื่อทัวร์:</strong> ${tourPackage.title}</li>
                <li><strong>รหัสทัวร์:</strong> ${tourPackage.tourCode}</li>
                <li><strong>รหัสการจอง:</strong> ${booking.id}</li>
                <li><strong>วันเดินทาง:</strong> ${new Date(tourPackage.startDate).toLocaleDateString()}</li>
                <li><strong>จำนวนวันเดินทาง:</strong> ${tourPackage.duration}</li>
                <li><strong>จำนวนผู้เดินทาง(ผู้ใหญ่):</strong> ${booking.adultCount} ท่าน</li>
                <li><strong>จำนวนผู้เดินทาง(เด็ก):</strong> ${booking.childCount} ท่าน</li>
                <li><strong>จำนวนผู้พักห้องแยก:</strong> ${booking.childCount} ท่าน</li>
                <li><strong>รวมยอดชำระเงินทั้งหมด:</strong> ${booking.totalPrice.toLocaleString()} บาท</li>
            </ul>
            <p><strong>กรุณาชำระเงินภายใน 24 ชั่วโมง มิเช่นนั้นการจองของท่านอาจถูกยกเลิก หรือไม่สามารถยืนยันการจองได้</strong></p>
            <p><a href='${paymentLink}' style='color: #ec4899; font-weight: bold;'>คลิกที่นี่เพื่อชำระเงิน</a></p>
            `

        await transporter.sendMail({
            from: `'findtrip' <${process.env.EMAIL_USER}>`,
            to: recipient,
            subject: `ยืนยันการจองแพ็คเกจทัวร์ของคุณ ${user.name || ''}`,
            html: htmlContent,
        })

        console.log("--- DEBUG EMAIL END ---")

    } catch (error) {
        console.error('Error in sendBookingConfirmationEmail: ', error.message)
        throw new Error('Error in sending booking confirmation email')
    }
}


exports.sendPaymentSuccessEmail = async (toEmail, paymentId) => {
    try {
        // ดึงข้อมูล Payment พร้อม Booking และ User ที่เกี่ยวข้อง
        const payment = await prisma.payment.findUnique({
            where: { id: paymentId },
            include: {
                booking: {
                    include: {
                        user: true,
                        tourPackage: true, // ถ้าอยากโชว์ชื่อทัวร์
                    }
                }
            }
        })

        if (!payment) throw new Error('ไม่พบข้อมูลการชำระเงิน')

        const user = payment.booking.user
        const tour = payment.booking.tourPackage

        const recipient = toEmail || user?.email

        if (!recipient) {
            throw new Error('No email address found for this user')
        }

        const message = `
            <html>
                <body style="font-family: Arial, sans-serif; color: #333;">
                    <h2 style="color: #ea2c6d;">ยืนยันการชำระเงินสำเร็จ</h2>
                    <p>สวัสดีคุณ ${user.name},</p>
                    <p>ขอบคุณที่ชำระเงินสำหรับ <strong>${tour?.title || 'ไม่ระบุ'}</strong></p>
                    <p>รายละเอียดการชำระเงิน:</p>
                    <ul>
                        <li>รหัสการจอง: ${payment.bookingId}</li>
                        <li>จำนวนเงิน: ฿${payment.amount.toFixed(2)}</li>
                        <li>วันที่ชำระเงิน: ${new Date(payment.paymentDate).toLocaleString('th-TH')}</li>
                        <li>ช่องทาง: ${payment.paymentMethod}</li>
                    </ul>
          <p>ขอให้คุณสนุกกับการเดินทาง!</p>
          <hr />
        </body>
      </html>
    `

        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: recipient,
            subject: 'ยืนยันการชำระเงิน - findtrip',
            html: message
        })

        console.log('ส่งอีเมล์ยืนยันการชำระเงินสำเร็จ')
    } catch (error) {
        console.error('ไม่สามารถส่งอีเมล์ยืนยันการชำระเงินได้:', error.message)
    }
}


exports.sendBookingCancelledEmail = async (toEmail, bookingId) => {
    try {
        const booking = await prisma.booking.findUnique({
            where: { id: bookingId },
            include: {
                tourPackage: true,
                user: true,
            },
        })

        if (!booking) throw new Error('Booking not found')

        const { tourPackage, user } = booking
        const recipient = toEmail || booking.user?.email

        if (!recipient) {
            throw new Error('No email address found for this user')
        }

        const htmlContent = `
            <h2>แจ้งยกเลิกการจองแพ็คเกจทัวร์ ${tourPackage.title}</h2>
            <p>คุณ ${user.name || ''} ${user.surname || ''}</p>
            <p>ระบบได้ทำการยกเลิกการจองของคุณโดยอัตโนมัติ เนื่องจากไม่ได้ทำรายการชำระเงินภายใน 24 ชั่วโมง</p>
            <ul>
                <li><strong>รหัสการจอง:</strong> ${booking.id}</li>
                <li><strong>ชื่อทัวร์:</strong> ${tourPackage.title}</li>
                <li><strong>รหัสทัวร์:</strong> ${tourPackage.tourCode}</li>
                <li><strong>จำนวนผู้เดินทาง(ผู้ใหญ่):</strong> ${booking.adultCount} ท่าน</li>
                <li><strong>รวมยอด:</strong> ${booking.totalPrice.toLocaleString()} บาท</li>
            </ul>
            <p>หากคุณต้องการจองใหม่ สามารถกลับไปทำรายการจองได้อีกครั้ง</p>
        `

        await transporter.sendMail({
            from: `'findtrip' <${process.env.EMAIL_USER}>`,
            to: recipient,
            subject: `ยกเลิกการจองอัตโนมัติ - ${tourPackage.title}`,
            html: htmlContent,
        })

        console.log('ส่งอีเมลแจ้งยกเลิกการจองสำเร็จ')
    } catch (error) {
        console.error('Error in sendBookingCancelledEmail: ', error.message)
        throw new Error('Error in sending booking cancelled email')
    }
}
