const { Role } = require("@prisma/client")
const prisma = require("../config/prisma")


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

// 4. เปลี่ยน status ลูกค้า
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
        res.status(500).json({ message: 'Error change user status'})
    }
}

// 5. show dashboard
exports.getDashboardSummary = async (req, res) => {
    try {
        const [bookingCount, totalRevenueResult, userCount, tourPackageCount] = await Promise.all([
            prisma.booking.count(), // นับจำนวนการจองทั้งหมดในฐานข้อมูล
            prisma.payment.aggregate({ // คำนวณยอดรวมเงินทั้งหมดจากฟิลด์ amount ในตาราง payment
                _sum: { amount: true }
            }),
            prisma.user.count(), // นับจำนวนผู้ใช้งาน (Member) ทั้งหมด
            prisma.tourPackage.count(), // นับจำนวนแพ็กเกจทัวร์ทั้งหมดที่มีในระบบ
        ])

        // const [recommendTours, almostFullTours, isActiveTours] = await Promise.all([
        //     prisma.tourPackage.count({ where: { isRecommend: true } }), // นับทัวร์ที่ตั้งค่าเป็น "แนะนำ"
        //     // prisma.tourPackage.count({ where: { isAlmostFull: true } }), // นับทัวร์ที่ตั้งค่าเป็น "ใกล้เต็ม"
        //     prisma.tourPackage.count({ where: { isActive: true } }), // นับทัวร์ที่เปิดใช้งาน (Active) อยู่
        // ])

        res.status(200).json({
            totalBookings: bookingCount,
            totalRevenue: totalRevenueResult._sum.amount || 0,
            totalUsers: userCount,
            totalTours: tourPackageCount,
            // tour: {
            //     recommendTours,
            //     almostFullTours,
            //     isActiveTours
            // }
        })
    } catch (err) {
        console.error('Error in Get Dashboard Summary:', err)
        res.status(500).json({ message: 'Error in Get Dashboard Summary:' })
    }
}

/** แปลงค่าจาก Prisma/MySQL เป็น number สำหรับ JSON */
const toNum = (v) => {
    if (v == null || v === undefined) return 0
    if (typeof v === 'bigint') return Number(v)
    if (typeof v === 'object' && v !== null && typeof v.toNumber === 'function') return v.toNumber()
    const n = Number(v)
    return Number.isFinite(n) ? n : 0
}

// 6. Dashboard analytics (KPI + charts + top tours) — aggregate ที่ backend
exports.getDashboardAnalytics = async (req, res) => {
    try {
        const granularity = ['weekly', 'monthly', 'yearly'].includes(req.query.granularity)
            ? req.query.granularity
            : 'monthly'

        const endDate = new Date()
        const startDate = new Date()
        if (granularity === 'monthly') {
            startDate.setMonth(endDate.getMonth() - 11)
            startDate.setDate(1)
            startDate.setHours(0, 0, 0, 0)
        } else if (granularity === 'weekly') {
            startDate.setDate(endDate.getDate() - 7 * 11)
            startDate.setHours(0, 0, 0, 0)
        } else {
            startDate.setFullYear(endDate.getFullYear() - 4)
            startDate.setMonth(0, 1)
            startDate.setHours(0, 0, 0, 0)
        }
        endDate.setHours(23, 59, 59, 999)

        const [totalSalesAgg, totalTours, totalBookings, totalUsers] = await Promise.all([
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
            prisma.tourPackage.count(),
            prisma.booking.count(),
            prisma.user.count()
        ])

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
            console.log('55555555555555555555555 : ', salesTrendRaw)

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

            console.log('YEARLY RESULT 55555555 :', salesTrendRaw)
        }

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

        const topToursRaw = await prisma.$queryRaw`
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
            salesTrend: mapTrend(salesTrendRaw),
            salesByCountry: mapNamed(salesByCountryRaw),
            salesByCategory: mapNamed(salesByCategoryRaw),
            bookingStatus,
            paymentStatus,
            topTours: mapNamed(topToursRaw),
            meta: { granularity }
        })
    } catch (err) {
        console.error('Error in getDashboardAnalytics:', err)
        res.status(500).json({ message: 'Error in Get Dashboard Analytics' })
    }
}






