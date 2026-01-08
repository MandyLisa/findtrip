const prisma = require('../config/prisma')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const crypto = require('crypto')
const { sendPasswordResetEmail } = require('../utils/email')

exports.register = async (req, res) => {
    try {
       
        const { username, email, password, name, surname, phone } = req.body

        // step 1 check username or email in Database
        const existingUser = await prisma.user.findFirst({ 
            where: {
                OR: [
                    { username: username },
                    { email: email }
                ]
            }
        })
        // step 2 ถ้ามี username หรือ อีเมล์  ในระบบแล้ว
        if (existingUser) { 
            if (existingUser.username === username) {
                return res.status(409).json({
                    field: 'username',
                    message: username + ' มีในระบบแล้ว กรุณาใช้ชื่ออื่น' 
                })
            }
            if (existingUser.email === email) {
                return res.status(409).json({ 
                    field: 'email',
                    message: email + ' มีในระบบแล้ว กรุณาใช้อีเมลอื่น' 
                })
            }
        }

        // step 3: Hash Password เข้ารหัสผ่าน 
        const hashPassword = await bcrypt.hash(password, 10)

        // step 4: Register
        const newUser = await prisma.user.create({
            data: {
                username: username,
                email: email,
                password: hashPassword,
                name: name,
                surname: surname,
                phone: phone
            }
        })
        
        delete newUser.password // ลบ key บางตัว ที่ไม่ต้องการส่งไปให้หน้าบ้าน 

        return res.status(201).json({ message: 'ลงทะเบียนสำเร็จ', user: newUser })

    } catch (err) {
        console.log(err)
        return res.status(500).json({ message: 'Server Error', err })
    }
}

exports.login = async (req, res) => {
    try {
        // step 1:  รับค่า username หรือ email และ password จากผู้ใช้
        const { identifier, password } = req.body 

        // ค้นหาผู้ใช้จาก username หรือ email
        const user = await prisma.user.findFirst({ 
            where: {
                OR: [
                    { username: identifier }, // ค้นหา username ด้วย indentifier
                    { email: identifier } // ค้นหา email ด้วย indentifier
                ]
            }
        })
        // ถ้าไม่มีการกรอก username หรือ email เข้ามาอย่างถูกต้อง
        if (!user) {
            return res.status(401).json({ message: 'ชื่อบัญชี หรือ อีเมล์ ไม่ถูกต้อง' })
        }

        // step 2 check password (compare) ถอดรหัสด้วย bcrypt 
        const isMatch = await bcrypt.compare(password, user.password)

        if (!isMatch) { // ถ้า passworld ไม่ตรงกัน
            return res.status(400).json({ message: 'ชื่อบัญชี หรือ อีเมล์ ไม่ถูกต้อง' })
        }

        // step 4 create payload คือ data 
        const users = { 
            id: user.id,
            username: user.username,
            email: user.email,
            name: user.name,
            role: user.role
        }

        // step 5 เอา object users ไปเข้ารหัส ด้วย secret ออกมาเป็น token
        // process.env.SECRET คีย์ลับที่ใช้สำหรับการเข้ารหัส token 
        const token = jwt.sign(users, process.env.SECRET, { expiresIn: '24h' })
       
        // res.json({ users:users, token })
        return res.status(200).json({ 
            message: 'เข้าสู่ระบบสำเร็จ', 
            users: users,
            token: token
        })

    } catch (err) {
        console.error(err)
        return res.status(500).json({ message: 'Server Error' })
    }
}

// ฟังก์ชั่นนี้จะถูกเรียกใช้หลังจากผู้ใช้ล็อกอินสำเร็จ เพื่อนำข้อมูลไปแสดงผลหรือตรวจสอบสิทธิ์ในการเข้าถึงฟีเจอร์ต่างๆ ของระบบ
exports.currentUserAdmin = async (req, res) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: req.user.id },
            select: {
                id: true,
                username: true,
                email: true,
                role: true,
                name: true
            }
        })

        res.json(user)
    } catch (err) {
        console.error('Current UserAdmin Error:', err)
        res.status(500).json({ message: 'Server error' })
    }
}

// 1. API สำหรับส่งอีเมลรีเซ็ตรหัสผ่าน
exports.forgotPassword = async (req, res) => {
    try {
        const { email } = req.body

        // ตรวจสอบว่ามีอีเมลในระบบหรือไม่
        const user = await prisma.user.findUnique({
            where: { email }
        })

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'ไม่พบอีเมล์นี้ในระบบ'
            })
        }

        // สร้าง reset token + hash
        const resetToken = crypto.randomBytes(32).toString('hex')
        const resetTokenHash = crypto.createHash('sha256').update(resetToken).digest('hex')

        // กำหนดเวลาหมดอายุ (15 นาที)
        const resetTokenExpire = new Date(Date.now() + 15 * 60 * 1000) // 15 นาที

        // อัปเดตข้อมูลลง DB
        const updateUser = await prisma.user.update({
            where: { email },
            data: {
                resetPasswordToken: resetTokenHash,
                resetPasswordExpire: resetTokenExpire
            }
        })


        // สร้างลิงก์รีเซ็ตรหัสผ่าน
        const resetLink = `${process.env.CLIENT_URL}/reset-password/${resetToken}`
        console.log('CLIENT_URL ===>', process.env.CLIENT_URL)


        // เรียกฟังก์ชั่น ส่งอีเมล์แจ้งเตือน (ส่งพาราไป 3 ตัว)
        await sendPasswordResetEmail(
            updateUser.email,  // ส่งอีเมลไปที่ไหน
            updateUser.name,  // แสดงชื่อในอีเมล์
            resetLink // ลิงก์รีเซ็ตรหัสผ่าน
        )


        res.json({
            success: true,
            message: 'ส่งอีเมลสำหรับรีเซ็ตรหัสผ่านเรียบร้อยแล้ว'
        })

    } catch (error) {
        console.error(error)
        res.status(500).json({ success: false, message: 'เกิดข้อผิดพลาดในระบบ' })
    }
}

// 2. API สำหรับตรวจสอบ reset token
exports.verifyResetToken = async (req, res) => {

    try {
        const { token } = req.params

        // แปลง token เป็น hash
        const resetTokenHash = crypto.createHash('sha256').update(token).digest('hex')

        // ค้นหา user ที่มี token นี้และยังไม่หมดอายุ
        const user = await prisma.user.findFirst({
            where: {
                resetPasswordToken: resetTokenHash,
                resetPasswordExpire: {
                    gte: new Date() // expire ต้องมากกว่าตอนนี้ (ยังไม่หมดอายุ)
                }
            }
        })


        if (!user) {
            return res.status(400).json({ message: 'Token ไม่ถูกต้องหรือหมดอายุแล้ว' })
        }

        res.status(200).json({
            success: true,
            message: 'Token ถูกต้อง'
        })

        
    } catch (error) {
        console.error(error)
        res.status(500).json({
            success: false,
            message: 'เกิดข้อผิดพลาดในระบบ'
        })
    }
}

// 3. API สำหรับรีเซ็ตรหัสผ่าน
exports.resetPassword = async (req, res) => {

    try {
        const { token, newPassword } = req.body
        // console.log(token)
        // console.log(newPassword)

        // ตรวจสอบข้อมูลที่ส่งมา
        if (!token || !newPassword) {
            return res.status(400).json({
                success: false,
                message: 'กรุณากรอกข้อมูลให้ครบถ้วน'
            })
        }

        // ตรวจสอบความยาวรหัสผ่าน
        if (newPassword.length < 8) {
            return res.status(400).json({
                success: false,
                message: 'รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร'
            })
        }

        // แปลง token เป็น hash
        const resetTokenHash = crypto.createHash('sha256').update(token).digest('hex')


        // หา user ที่มี token นี้และยังไม่หมดอายุ
        const user = await prisma.user.findFirst({
            where: {
                resetPasswordToken: resetTokenHash,
                resetPasswordExpire: {
                    gte: new Date() // expire ต้องมากกว่าตอนนี้ (ยังไม่หมดอายุ)
                }
            }
        })


        if (!user) {
            return res.status(400).json({
                success: false,
                message: 'Token ไม่ถูกต้องหรือหมดอายุแล้ว'
            })
        }

        // เข้ารหัสผ่านใหม่
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(newPassword, salt)


        // อัปเดตรหัสผ่าน และลบ reset token
        const updatePassword = await prisma.user.update({
            where: { id: user.id },
            data: {
                password: hashedPassword,
                resetPasswordToken: null,
                resetPasswordExpire: null
            }
        })


        res.status(200).json({
            success: true,
            message: 'รีเซ็ตรหัสผ่านสำเร็จ'
        })

        
    } catch (error) {
        console.error(error)
        res.status(500).json({
            success: false,
            message: 'เกิดข้อผิดพลาดในระบบ'
        })
    }
}


