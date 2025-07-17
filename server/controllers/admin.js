const prisma = require("../config/prisma")


// 1. ดูผู้ใช้ทั้งหมด
exports.listUsers = async (req, res) => {
    try {
        const users = await prisma.user.findMany({
            select: {
                id: true,
                email: true,
                name: true,
                phone: true,
                role: true
            }
        });
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

// 2. เปลี่ยน Role ของ User
exports.updateUserRole = async (req, res) => {
    try {
        // 1. รับค่า ID และ role จาก request body
        const { id, role } =  req.body;
        // 2. อัปเดตข้อมูลในฐานข้อมูล
        const updatedUser = await prisma.user.update({
            where: { id: Number(id) },
            data: { role: role } // ข้อมูลที่จะอัปเดต เฉพาะ field role
        });

        res.json(updatedUser); // 3. ส่งข้อมูลผู้ใช้ที่อัปเดตแล้วกลับไป
    } catch (error) {
        res.status(500).json({ message: "Error updating user role", error }); // 4. จัดการข้อผิดพลาด (ถ้ามี)
    }
};

// 3. เปลี่ยน status ลูกค้า
exports.changeUserStatus = async(req,res) => {
    try {
        const { id, enable } = req.body
        console.log(id, enable)
        const user = await prisma.user.update({ // รอให้การอัปเดตเสร็จสมบูรณ์ ก่อนทำงานต่อ ซึ่งจะได้ผลลัพธ์ที่ถูกอัปเดตแล้วเก็บในตัวแปร user
            where: { id:Number(id) }, // เงื่อนไขการค้นหา
            data: { enable: enable} // ข้อมูลที่จะอัปเดต ระบุฟิลด์และค่าที่ต้องการอัปเดต
        })
        res.json(user)
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: 'Server Error' })
    }
}


