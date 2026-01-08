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
        console.log('Error fetching List User', err)
        res.status(500).json({ message: 'Error fetching List User', err })
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
        res.status(500).json({ message: 'Error in listUserRole', err })
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
        console.log('Error fetching profile: ', error)
        res.status(500).json({ message: 'Error fetching profile', error })
    }
}

// 3. เปลี่ยน Role ของ User
exports.updateUserRole = async (req, res) => {
    try {
        // 1. รับค่า ID และ role
        const { id } = req.params
        const { role } = req.body
        console.log('======111111', id)
        console.log('======222222', role)

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
        res.status(500).json({ message: 'Error in updating user role', err })
    }
}

// 4. เปลี่ยน status ลูกค้า
exports.changeUserStatus = async (req, res) => {
    console.log('เข้าฟังชั่นนี้ไหม changeUserStatus')
    try {
        const { id } = req.params
        const { enable } = req.body
        // console.log('======111111',id)
        // console.log('======222222',enable)

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
        console.log('Error change user status', err)
        res.status(500).json({ message: 'Error change user status', err })
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

        const [recommendTours, almostFullTours, isActiveTours] = await Promise.all([
            prisma.tourPackage.count({ where: { isRecommend: true } }), // นับทัวร์ที่ตั้งค่าเป็น "แนะนำ"
            prisma.tourPackage.count({ where: { isAlmostFull: true } }), // นับทัวร์ที่ตั้งค่าเป็น "ใกล้เต็ม"
            prisma.tourPackage.count({ where: { isActive: true } }), // นับทัวร์ที่เปิดใช้งาน (Active) อยู่
        ])

        res.status(200).json({
            totalBookings: bookingCount,
            totalRevenue: totalRevenueResult._sum.amount || 0,
            totalUsers: userCount,
            totalTours: tourPackageCount,
            tour: {
                recommendTours,
                almostFullTours,
                isActiveTours
            }
        })
    } catch (err) {
        console.error('Error in Get Dashboard Summary:', err)
        res.status(500).json({ message: 'Error in Get Dashboard Summary:', err })
    }
}






