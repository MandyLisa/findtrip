const jwt = require('jsonwebtoken')
const prisma = require('../config/prisma')
// เอา token ที่หน้าบ้านส่งมา มา verify ดูว่าใช้ตัวจริงหรือเปล่า
// เพราะฉะนั้น path ไหนที่มีความ secure คุณต้อง log in เท่านั้น
// เราก็จะใส่ authCheck เข้าไป
exports.authCheck = async (req, res, next) => {
    // console.log('2222222222')
    try {
        // verify token ที่ส่งมาจากหน้าบ้าน
        const headerToken = req.headers.authorization
        // console.log('เข้ามาตรงนี้หรือเปล่า =', headerToken) // log ตรงนี้เลย

        // ส่ง request โดยไม่มี token
        if (!headerToken) {
            return res.status(401).json({ message: 'No Token Authorization' })
        }

        const token = headerToken.split(' ')[1]

        // เอา token ที่ส่งมา มาถอดรหัสด้วย jwt
        const decode = jwt.verify(token, process.env.SECRET)
        req.user = decode
        // console.log(decode)

        const user = await prisma.user.findFirst({
            where: {
                id: req.user.id // ใช้ id จาก token โดยตรง
            },
            select: {
                id: true,
                enable: true
            }
        });

        //ตรวจสอบว่า user มีค่าจริงก่อนตรวจสอบ enabled
        if (!user) {
            return res.status(404).json({ message: 'User not found' })
        }
        // เช็คต่อว่า user นี้ ปิดอยู่หรือเปล่า ถ้าส่ง token ของบัญชีที่ถูกปิดเข้ามา
        if (!user.enable) {
            return res.status(403).json({ message: 'This account is disabled' })
        }
        next()
    } catch (err) {
        if (err.name === 'JsonWebTokenError') {
            return res.status(401).json({ message: 'Invalid token' });
          }
          
          if (err.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Token expired' });
          }
        
          return res.status(500).json({ message: 'Authentication failed' });
        }
}

exports.adminCheck = async (req, res, next) => {
    try {
        const { id } = req.user // ใช้ id จาก token โดยตรง
        const adminUser = await prisma.user.findUnique({
            where: { 
                id: id
            },
            select: {
                role: true // เลือกเฉพาะ field ที่จำเป็น
            }
        })

        if(!adminUser || adminUser.role == 'USER') {
            return res.status(403).json({ message: 'Admin Access Denied'})
        }
        // console.log('Admin Check', adminUser)

        next()
    } catch (err) {
        console.log('Admin Check Error:', err)
        res.status(500).json({ message: 'Server error during admin verification'})
    }
}