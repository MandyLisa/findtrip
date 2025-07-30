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

        // 2. อัปเดตข้อมูลในฐานข้อมูล
        const user = await prisma.user.update({
            where: { id: Number(id) },
            data: { role: role } // ข้อมูลที่จะอัปเดต เฉพาะ field role
        })

        res.status(200).json({
            ok: true,
            message: 'User role updated successfully',
            data: user
        })
    } catch (err) {
        console.error('Error in updating user role', err)
        res.status(500).json({ message: 'Error in updating user role', err })
    }
}

// 4. เปลี่ยน status ลูกค้า
exports.changeUserStatus = async (req, res) => {
    try {
        const { id, enable } = req.body
        console.log(id, enable)
        const user = await prisma.user.update({ // รอให้การอัปเดตเสร็จสมบูรณ์ ก่อนทำงานต่อ ซึ่งจะได้ผลลัพธ์ที่ถูกอัปเดตแล้วเก็บในตัวแปร user
            where: { id: Number(id) }, // เงื่อนไขการค้นหา
            data: { enable: enable } // ข้อมูลที่จะอัปเดต ระบุฟิลด์และค่าที่ต้องการอัปเดต
        })
        res.json(user)
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: 'Server Error' })
    }
}


