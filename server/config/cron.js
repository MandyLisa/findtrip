const cron = require('node-cron')
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

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

// 2. ตั้งเวลาให้ทำงานทุกวันตอนเที่ยงคืนเป๊ะ (00:00)
// รูปแบบ: (วินาที) นาที ชั่วโมง วันที่ เดือน วันในสัปดาห์
// '0 0 * * *' คือ ทุกนาทีที่ 0 ชั่วโมงที่ 0 ของทุกวัน
const initCron = () => {
    cron.schedule('0 0 * * *', () => {
        updateTourStatus()
    })
    console.log('Cron Job initialized: Will run every day at midnight.')
}

module.exports = { initCron }