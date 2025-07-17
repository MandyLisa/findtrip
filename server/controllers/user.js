const prisma = require("../config/prisma")

// 1. ดูข้อมูลโปรไฟล์ของตัวเอง
// GET /api/user/profile → ดูข้อมูลโปรไฟล์ของตัวเอง
exports.getUserProfile = async (req, res) => {
    try {
        const user = await prisma.user.findUnique({
            where: {
                id: req.user.id // ใช้ req.user.id ดึงข้อมูลของผู้ใช้ที่เข้าสู่ระบบอยู่ req.user.id สามารถใช้ได้เมื่อผ่าน middleware เท่านั้น 
            }
        })

        console.log(user)
        res.status(200).json({ message: 'Get user profile successfully', user })
    } catch (error) {
        console.log('Error getUserProfile: ', error)
        res.status(500).json({ message: 'Error fetching user profile', error })
    }
}

// 2. อัปเดตข้อมูลโปรไฟล์
// PUT /api/user/profile → อัปเดตข้อมูลโปรไฟล์
exports.updateUserProfile = async (req, res) => {
    try {
        const { name, surname, phone, address } = req.body // ข้อมูลที่ Frontend ส่งมา

        const updatedUserData = await prisma.user.update({
            where: {
                id: req.user.id
            },
            data: {
                name: name,
                surname: surname,
                phone: phone,
                address: address
            }
        })

        console.log('ดู updatedUserData',updatedUserData)

        res.status(200).json({
            success: true,
            user: {
                name: updatedUserData.name,
                surname: updatedUserData.surname,
                phone: updatedUserData.phone,
                adress: updatedUserData.address,
            }
        })
    } catch (error) {
        console.log('Error updateUserProfile: ', error)
        res.status(500).json({ message: 'Error updating profile', error })
    }
}

