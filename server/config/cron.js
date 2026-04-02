const cron = require('node-cron')
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const { sendBookingCancelledEmail } = require('../utils/email')

// ฟังก์ชันสำหรับ Update สถานะทัวร์อัตโนมัติ
const updateTourStatus = async () => {
    try {
        // console.log('--- Starting Daily Tour Status Update ---')
        
        const today = new Date()

        today.setHours(0, 0, 0, 0)

        // คำนวณวันที่ "วันนี้ + 3 วัน"
        const targetDate = new Date(today)
        targetDate.setDate(today.getDate() + 3)

        // 1. สั่ง Update ใน Database จริงๆ
        // เงื่อนไข: ถ้าวันเริ่มเดินทาง (startDate) น้อยกว่าหรือเท่ากับ targetDate
        // และทัวร์นั้นยังเปิดอยู่ (isActive: true) ให้เปลี่ยนเป็น false ทันที
        const result = await prisma.tourPackage.updateMany({
            where: {
                startDate: {
                    lte: targetDate // lte = Less than or equal
                },
                isActive: true
            },
            data: {
                isActive: false,
                seatStatus: 'CLOSED' // ปรับสถานะที่นั่งเป็นปิดไปด้วยเลยเพื่อความชัวร์
            }
        })

        console.log(`Successfully updated ${result.count} tours to INACTIVE.`)
        // console.log('--- Update Completed ---')
    } catch (error) {
        console.error('Error during Cron Job:', error)
    }
}

const autoCancelExpiredDraftBookings = async () => {
    try {
        const cutoff = new Date(Date.now() - (24 * 60 * 60 * 1000))

        const expiredDrafts = await prisma.booking.findMany({
            where: {
                bookingStatus: 'DRAFT',
                createdDate: {
                    lt: cutoff,
                },
                Payment: {
                    is: null,
                },
            },
            select: {
                id: true,
                adultCount: true,
                tourPackageId: true,
            },
        })

        for (const booking of expiredDrafts) {
            try {
                await prisma.$transaction(async (tx) => {
                    await tx.booking.update({
                        where: { id: booking.id },
                        data: { bookingStatus: 'CANCELLED' },
                    })

                    await tx.tourPackage.update({
                        where: { id: booking.tourPackageId },
                        data: {
                            sold: {
                                decrement: booking.adultCount,
                            },
                        },
                    })
                })

                try {
                    await sendBookingCancelledEmail(null, booking.id)
                } catch (emailError) {
                    console.error('Auto-cancelled booking but email sending failed: ', emailError)
                }
            } catch (err) {
                console.error('Failed to auto-cancel expired draft booking: ', booking.id, err)
            }
        }
    } catch (error) {
        console.error('Error during autoCancelExpiredDraftBookings:', error)
    }
}

// 2. ตั้งเวลาให้ทำงานทุกวันตอนเที่ยงคืนเป๊ะ (00:00)
// รูปแบบ: (วินาที) นาที ชั่วโมง วันที่ เดือน วันในสัปดาห์
// '0 0 * * *' คือ ทุกนาทีที่ 0 ชั่วโมงที่ 0 ของทุกวัน
const initCron = () => {
    cron.schedule('0 0 * * *', () => {
        updateTourStatus()
    })
    console.log('Cron Job initialized: Will run every day at midnight.')

    cron.schedule('0 * * * *', () => {
        autoCancelExpiredDraftBookings()
    })
    console.log('Cron Job initialized: Auto-cancel expired DRAFT bookings every hour.')
}

module.exports = { initCron }