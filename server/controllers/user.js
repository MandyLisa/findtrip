const prisma = require('../config/prisma')

// 1. ดูข้อมูลโปรไฟล์ของตัวเอง GET /api/user/profile
exports.getUserProfile = async (req, res) => {
    try {
        const user = await prisma.user.findUnique({
            where: {
                id: req.user.id // ใช้ req.user.id ดึงข้อมูลของผู้ใช้ที่เข้าสู่ระบบอยู่แล้วมาได้เลย สามารถใช้ได้เมื่อผ่าน middleware เท่านั้น 
            }
        })

        // console.log('ดู getUserProfile' , user)
        return res.status(200).json({
            success: true,
            message: 'Get user profile successfully',
            user: user
        })
    } catch (error) {
        console.log('Error getUserProfile: ', error)
        res.status(500).json({
            success: false,
            message: 'Error fetching user profile'
        })
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

        // console.log('ดู updatedUserData ', updatedUserData)
        return res.status(200).json({
            success: true,
            message: 'Update user profile successfully',
            user: {
                name: updatedUserData.name,
                surname: updatedUserData.surname,
                phone: updatedUserData.phone,
                adress: updatedUserData.address,
            }
        })
    } catch (error) {
        console.log('Error updateUserProfile: ', error)
        res.status(500).json({ 
            success: false,
            message: 'Error updating profile' 
        })
    }
}

