const jwt = require('jsonwebtoken')
const prisma = require('../config/prisma')

exports.authCheck = async (req, res, next) => {
    try {                                                                                                                                                                                   
        const headerToken = req.headers.authorization // verify token ที่ส่งมาจากหน้าบ้าน
        // console.log('เข้าตรงนี้หรือเปล่านะ =', headerToken)

        if (!headerToken) {
            return res.status(401).json({ message: 'No Token Authorization' })
        }

        const token = headerToken.split(' ')[1]  
        // console.log('เช็ค token ที่ได้หลัง split ', token)

        const decode = jwt.verify(token, process.env.SECRET)
        req.user = decode 
        // console.log('0000000', decode)

        const user = await prisma.user.findFirst({
            where: {
                id: req.user.id // ใช้ id จาก token 
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
        console.log("ตรวจพบ Error ใน authCheck:", err.name, err.message) // เพิ่มบรรทัดนี้
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
                role: true 
            }
        })

        if(!adminUser || adminUser.role == 'USER') {
            return res.status(403).json({ message: 'Admin Access Denied'})
        }
        console.log('adminCheck', adminUser)

        next()
    } catch (err) {
        console.log('Admin Check Error:', err)
        res.status(500).json({ message: 'Server error during admin verification'})
    }
}