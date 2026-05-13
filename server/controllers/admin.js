const { Role } = require('@prisma/client')
const prisma = require('../config/prisma')


/** แปลงค่าจาก Prisma/MySQL เป็น number สำหรับ JSON */
const toNum = (v) => {
    if (v == null || v === undefined) return 0
    if (typeof v === 'bigint') return Number(v)
    if (typeof v === 'object' && v !== null && typeof v.toNumber === 'function') return v.toNumber()
    const n = Number(v)
    return Number.isFinite(n) ? n : 0
}

// 1. ดูข้อมูลผู้ใช้ทั้งหมด
exports.listUsers = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1
        const limit = parseInt(req.query.limit) || 10
        const skip = (page - 1) * limit

        const { id, email, name, phone, role, enable } = req.query

        const where = {}

        if (id) {
            where.id = Number(id)
        }
        if (email) {
            where.email = {
                contains: email,
            }
        }
        if (name) {
            where.name = {
                contains: name,
            }
        }
        if (phone) {
            where.phone = {
                contains: phone,
            }
        }
        if (role) {
            where.role = role
        }

        if (enable !== undefined && enable !== '') {
            where.enable = enable === 'true'
        }

        const [user, totalCount] = await Promise.all([
            prisma.user.findMany({
                skip: skip,
                take: limit,
                where: where,
                orderBy: {
                    createdDate: 'desc'
                }
            }),
            prisma.user.count({
                where: where,
            })
        ])

        res.status(200).json({
            data: user,
            currentPage: page,
            totalPage: Math.ceil(totalCount / limit),
            totalCount,
        })
    } catch (err) {
        console.error('Error fetching List User', err)
        res.status(500).json({ message: 'Error fetching List User' })
    }
}

// 2. Drop down user role 
exports.listUserRole = async (req, res) => {
    try {
        const allRoleList = Object.values(Role) // แปลง enum เป็น array ของ string

        res.status(200).json({
            data: allRoleList,
            totalCount: allRoleList.length,
        })

    } catch (err) {
        console.error('Error in listUserRole', err)
        res.status(500).json({ message: 'Error in listUserRole' })
    }
}

exports.getProfileById = async (req, res) => {
    try {
        const { id } = req.params
        const user = await prisma.user.findUnique({
            where: { id: Number(id) }
        })

        res.status(200).json({
            ok: true,
            message: 'Get profile successfully',
            user: user
        })
    } catch (error) {
        console.error('Error fetching profile: ', error)
        res.status(500).json({ message: 'Error fetching profile' })
    }
}

// 3. เปลี่ยน Role ของ User
exports.updateUserRole = async (req, res) => {
    try {
        // 1. รับค่า ID และ role
        const { id } = req.params
        const { role } = req.body
        // console.error('======111111', id)
        // console.error('======222222', role)

        // 2. อัปเดตข้อมูลในฐานข้อมูล
        const user = await prisma.user.update({
            where: { id: Number(id) },
            data: { role: role } // ข้อมูลที่จะอัปเดต เฉพาะ field role
        })

        res.status(200).json({
            ok: true,
            message: 'User role updated successfully',
            user: user
        })
    } catch (err) {
        console.error('Error in updating user role', err)
        res.status(500).json({ message: 'Error in updating user role' })
    }
}

// 4. เปลี่ยน status user (enable/disable)
exports.changeUserStatus = async (req, res) => {
    // console.log('เข้าฟังชั่นนี้ไหม changeUserStatus')
    try {
        const { id } = req.params
        const { enable } = req.body
        // console.error('======111111',id)
        // console.error('======222222',enable)

        const user = await prisma.user.update({ // รอให้การอัปเดตเสร็จสมบูรณ์ ก่อนทำงานต่อ ซึ่งจะได้ผลลัพธ์ที่ถูกอัปเดตแล้วเก็บในตัวแปร user
            where: { id: Number(id) }, // เงื่อนไขการค้นหา
            data: { enable: enable } // ข้อมูลที่จะอัปเดต ระบุฟิลด์และค่าที่ต้องการอัปเดต
        })

        res.status(200).json({
            ok: true,
            message: 'Change user status successfully',
            user: user
        })
    } catch (err) {
        console.error('Error change user status', err)
        res.status(500).json({ message: 'Error change user status' })
    }
}


// 5. Dashboard analytics (KPI + charts + top tours) — aggregate ที่ backend
exports.getDashboardAnalytics = async (req, res) => {
    try {
        // 1. รับค่า granularity (ช่วงเวลาที่ใช้ในการแสดงผล เช่น รายเดือน รายสัปดาห์ รายปี) จาก query parameters
        const granularity = ['weekly', 'monthly', 'yearly'].includes(req.query.granularity)
            ? req.query.granularity
            : 'monthly'

        const endDate = new Date() // วันนี้ ตอนนี้
        const startDate = new Date() // วันนี้ ตอนนี้ (แต่เราจะหมุนย้อนอดีตไป)

        if (granularity === 'monthly') {
            startDate.setMonth(endDate.getMonth() - 11) // ถอยหลังไป 11 เดือน (รวมเดือนปัจจุบันเป็น 12 เดือน) เพื่อดูการเติบโตของกราฟในช่วง 1 ปี ที่ผ่านมา
            startDate.setDate(1) // ตั้งวันที่เป็นวันที่ 1 ของเดือน เพื่อให้ช่วงเวลาครอบคลุมทั้งเดือน
            startDate.setHours(0, 0, 0, 0) // ตั้งเวลาเป็น 00:00:00 (เริ่มวันใหม่)
        } else if (granularity === 'weekly') { // ถอยหลังไป 11 สัปดาห์ (รวมสัปดาห์ปัจจุบันเป็น 12 สัปดาห์) เพื่อดูการเติบโตของกราฟในช่วง 3 เดือน ที่ผ่านมา
            startDate.setDate(endDate.getDate() - 7 * 11) // เอา 'วันนี้' ลบออกไป 77 วัน (7 วัน * 11 สัปดาห์)
            startDate.setHours(0, 0, 0, 0)
        } else {
            startDate.setFullYear(endDate.getFullYear() - 4) // ถอยหลังไป 4 ปี (รวมปีปัจจุบันเป็น 5 ปี) เพื่อดูการเติบโตของกราฟในช่วง 5 ปี ที่ผ่านมา
            startDate.setMonth(0, 1)
            startDate.setHours(0, 0, 0, 0)
        }
        endDate.setHours(23, 59, 59, 999) // ตั้งเวลาเป็น 23:59:59.999 (วินาทีสุดท้ายของวัน) เพื่อให้ยอดขายในวันนี้ถูกนับรวมอยู่ในผลลัพธ์ด้วย

        // 2. เตรียมช่วงเวลา โดยเพิ่ม Logic วันที่สำหรับ Summary เข้าไป
        const now = new Date()
        const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate())
        const startOfWeek = new Date(now)
        startOfWeek.setDate(now.getDate() - now.getDay()) // ถอยไปต้นสัปดาห์ (วันอาทิตย์)
        startOfWeek.setHours(0, 0, 0, 0)
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
        const startOfYear = new Date(now.getFullYear(), 0, 1)

        // 3. ดึงข้อมูลแบบ Parallel (รันพร้อมกัน) ยิง API และรันพร้อมกันทั้งหมด 8 คำสั่ง ไม่ต้องรอทีละบรรทัด ช่วยลดเวลาในการรอผลลัพธ์จากฐานข้อมูล
        const [
            totalSalesAgg,
            totalTours,
            totalBookings,
            totalUsers,
            todaySales,
            weeklySales,
            monthlySales,
            yearlySales
        ] = await Promise.all([
            prisma.payment.aggregate({
                where: {
                    paymentStatus: 'PAID',
                    paymentDate: {
                        not: null,
                        gte: startDate,
                        lte: endDate
                    }
                },
                _sum: { amount: true }
            }),
            prisma.tourPackage.count(), // นับจำนวนแพ็กเกจทัวร์ทั้งหมดที่มีในระบบ
            prisma.booking.count(), // นับจำนวนการจองทั้งหมดในฐานข้อมูล
            prisma.user.count(), // นับจำนวนผู้ใช้งาน (Member) ทั้งหมด
            prisma.payment.aggregate({ where: { paymentStatus: 'PAID', paymentDate: { gte: startOfDay } }, _sum: { amount: true } }), // รวมยอดขายเฉพาะ "วันนี้" คำนวณยอดรวมเงินทั้งหมดจากฟิลด์ amount ในตาราง payment
            prisma.payment.aggregate({ where: { paymentStatus: 'PAID', paymentDate: { gte: startOfWeek } }, _sum: { amount: true } }), // รวมยอดขายเฉพาะ "สัปดาห์นี้" 
            prisma.payment.aggregate({ where: { paymentStatus: 'PAID', paymentDate: { gte: startOfMonth } }, _sum: { amount: true } }), // รวมยอดขายเฉพาะ "เดือนนี้"
            prisma.payment.aggregate({ where: { paymentStatus: 'PAID', paymentDate: { gte: startOfYear } }, _sum: { amount: true } }), // รวมยอดขายเฉพาะ "ปีนี้"
        ])

        // 4. ดึงข้อมูลทำกราฟและ Chart
        const bookingStatusRows = await prisma.booking.groupBy({
            by: ['bookingStatus'],
            _count: { _all: true }
        })

        const paymentStatusRows = await prisma.payment.groupBy({
            by: ['paymentStatus'],
            _count: { _all: true }
        })

        const bookingStatus = bookingStatusRows.map((r) => ({
            status: r.bookingStatus,
            count: r._count._all
        }))

        const paymentStatus = paymentStatusRows.map((r) => ({
            status: r.paymentStatus,
            count: r._count._all
        }))

        let salesTrendRaw
        if (granularity === 'monthly') {
            salesTrendRaw = await prisma.$queryRaw`
                SELECT DATE_FORMAT(p.paymentDate, '%Y-%m') AS period, SUM(p.amount) AS totalSales
                FROM Payment p
                WHERE p.paymentStatus = 'PAID'
                  AND p.paymentDate IS NOT NULL
                  AND p.paymentDate >= ${startDate}
                  AND p.paymentDate <= ${endDate}
                GROUP BY DATE_FORMAT(p.paymentDate, '%Y-%m')
                ORDER BY period ASC
            `
        } else if (granularity === 'weekly') {
            salesTrendRaw = await prisma.$queryRaw`
                SELECT
                  CONCAT(YEAR(p.paymentDate), '-W', LPAD(WEEK(p.paymentDate, 3), 2, '0')) AS period,
                  SUM(p.amount) AS totalSales
                FROM Payment p
                WHERE p.paymentStatus = 'PAID'
                  AND p.paymentDate IS NOT NULL
                  AND p.paymentDate >= ${startDate}
                  AND p.paymentDate <= ${endDate}
                GROUP BY CONCAT(YEAR(p.paymentDate), '-W', LPAD(WEEK(p.paymentDate, 3), 2, '0'))
                ORDER BY period ASC
            `
            // console.log('55555555555555555555555 : ', salesTrendRaw)

        } else {
            salesTrendRaw = await prisma.$queryRaw`
                SELECT CAST(YEAR(p.paymentDate) AS CHAR) AS period, SUM(p.amount) AS totalSales
                FROM Payment p
                WHERE p.paymentStatus = 'PAID'
                  AND p.paymentDate IS NOT NULL
                  AND p.paymentDate >= ${startDate}
                  AND p.paymentDate <= ${endDate}
                GROUP BY CAST(YEAR(p.paymentDate) AS CHAR)
                ORDER BY period ASC
            `
            // console.log('YEARLY RESULT 55555555 :', salesTrendRaw)
        }

        //SQL Alias (นามแฝง) คือการตั้งชื่อใหม่ให้กับคอลัมน์หรือผลลัพธ์ของการคำนวณใน SQL เพื่อให้ง่ายต่อการอ้างอิงและอ่านผลลัพธ์ โดยใช้คำว่า AS ตามด้วยชื่อที่ต้องการตั้งเป็นนามแฝง เช่น ในตัวอย่างนี้ เราตั้งชื่อใหม่ให้กับผลรวมของยอดขายเป็น totalSales และตั้งชื่อใหม่ให้กับช่วงเวลาที่เรากำลังวิเคราะห์เป็น period ซึ่งช่วยให้เราเข้าใจได้ง่ายขึ้นว่าแต่ละคอลัมน์ในผลลัพธ์หมายถึงอะไร และทำให้โค้ดดูสะอาดและอ่านง่ายขึ้นมาก
        const salesByCountryRaw = await prisma.$queryRaw`
            SELECT c.id AS countryId, c.name AS name, COALESCE(SUM(p.amount), 0) AS totalSales
            FROM Payment p
            INNER JOIN Booking b ON p.bookingId = b.id
            INNER JOIN TourPackage t ON b.tourPackageId = t.id
            INNER JOIN Country c ON t.countryId = c.id
            WHERE p.paymentStatus = 'PAID'
              AND p.paymentDate IS NOT NULL
              AND p.paymentDate >= ${startDate}
              AND p.paymentDate <= ${endDate}
            GROUP BY c.id, c.name
            ORDER BY totalSales DESC
        `

        const salesByCategoryRaw = await prisma.$queryRaw`
            SELECT cat.id AS categoryId, cat.name AS name, COALESCE(SUM(p.amount), 0) AS totalSales
            FROM Payment p
            INNER JOIN Booking b ON p.bookingId = b.id
            INNER JOIN TourPackage t ON b.tourPackageId = t.id
            INNER JOIN Category cat ON t.categoryId = cat.id
            WHERE p.paymentStatus = 'PAID'
              AND p.paymentDate IS NOT NULL
              AND p.paymentDate >= ${startDate}
              AND p.paymentDate <= ${endDate}
            GROUP BY cat.id, cat.name
            ORDER BY totalSales DESC
        `
        // ทัวร์ที่ทำรายได้สูงสุด 10 อันดับแรก (กรองเฉพาะคนที่จ่ายแล้ว)
        // เลือก id ของทัวร์ ตั้งชื่อใหม่ว่า tourPackageId, title ของทัวร์, และเอา amount (ยอดเงิน) ในตาราง Payment มาบวกกันทั้งหมด (SUM) ถ้าค่าเป็นว่างให้ใส่ 0 (COALESCE) แล้วส่งกลับมาในชื่อ totalSales
        // เริ่มดึงข้อมูลจากตาราง Payment (ตั้งชื่อย่อว่า p)
        // เชื่อมกับตาราง Booking (ตั้งชื่อย่อว่า b) โดยดูว่า bookingId ใน Payment ตรงกับ id ของ Booking ไหน
        // เชื่อมกับตาราง TourPackage (ตั้งชื่อย่อว่า t) โดยดูว่า tourPackageId ใน Booking ตรงกับ id ของ TourPackage ไหน
        // กรองเฉพาะแถวที่ paymentStatus เป็น 'PAID' และ paymentDate ไม่เป็น NULL และอยู่ในช่วงเวลาที่เรากำหนด
        // จากนั้นจัดกลุ่มผลลัพธ์ตาม id และ title ของทัวร์ เพื่อให้เราสามารถคำนวณยอดขายรวมสำหรับแต่ละทัวร์ได้ ต้อง groupBy id และ title เพราะไม่งั้น มันจะเอาทุกอย่างมารวมกันเป็นบรรทัดเดียว
        // สุดท้ายเรียงลำดับผลลัพธ์ตามยอดขายรวม (totalSales) จากมากไปน้อย และจำกัดผลลัพธ์ให้แสดงแค่ 10 อันดับแรก
        const topToursByRevenueRaw = await prisma.$queryRaw` 
            SELECT t.id AS tourPackageId, t.title AS title, COALESCE(SUM(p.amount), 0) AS totalSales
            FROM Payment p
            INNER JOIN Booking b ON p.bookingId = b.id
            INNER JOIN TourPackage t ON b.tourPackageId = t.id
            WHERE p.paymentStatus = 'PAID'
              AND p.paymentDate IS NOT NULL
              AND p.paymentDate >= ${startDate}
              AND p.paymentDate <= ${endDate}
            GROUP BY t.id, t.title
            ORDER BY totalSales DESC
            LIMIT 10
        `

        // ทัวร์ที่มีคนจองเยอะที่สุด 10 อันดับแรก (กรองเฉพาะคนที่จ่ายแล้ว)
        const topToursByVolumeRaw = await prisma.$queryRaw` 
            SELECT t.id AS tourPackageId, t.title AS title, COALESCE(SUM(b.adultCount), 0) AS totalSeatsSold
            FROM Payment p
            INNER JOIN Booking b ON p.bookingId = b.id
            INNER JOIN TourPackage t ON b.tourPackageId = t.id
            WHERE p.paymentStatus = 'PAID'
              AND p.paymentDate IS NOT NULL
              AND p.paymentDate >= ${ startDate }
              AND p.paymentDate <= ${ endDate }
            GROUP BY t.id, t.title
            ORDER BY totalSeatsSold DESC
            LIMIT 10
            `

        const mapTrend = (rows) =>
            rows.map((row) => ({
                period: String(row.period),
                totalSales: toNum(row.totalSales)
            }))

        const mapNamed = (rows) =>
            rows.map((row) => ({
                ...row,
                totalSales: toNum(row.totalSales)
            }))

        res.status(200).json({
            kpi: {
                totalSales: toNum(totalSalesAgg._sum.amount),
                totalTours,
                totalBookings,
                totalUsers
            },
            salesMetrics: {
                today: toNum(todaySales._sum.amount),
                thisWeek: toNum(weeklySales._sum.amount),
                thisMonth: toNum(monthlySales._sum.amount),
                thisYear: toNum(yearlySales._sum.amount)
            },
            salesTrend: mapTrend(salesTrendRaw),
            salesByCountry: mapNamed(salesByCountryRaw),
            salesByCategory: mapNamed(salesByCategoryRaw),
            bookingStatus,
            paymentStatus,
            topToursByRevenue: mapNamed(topToursByRevenueRaw),
            topToursByVolume: mapNamed(topToursByVolumeRaw),
            meta: { granularity }
        })
    } catch (err) {
        console.error('Error in getDashboardAnalytics:', err)
        res.status(500).json({ message: 'Error in Get Dashboard Analytics' })
    }
}






