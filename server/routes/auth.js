// step import 
const express = require('express')
const router = express.Router()
const { authCheck, adminCheck } = require('../middlewares/authCheck') // ตรวจสอบสิทธิ์
const { register, login, currentUserAdmin, forgotPassword, verifyResetToken, resetPassword } 
= require('../controllers/auth')

// Admin
// @Endpoint http://localhost:5000/api/register
router.post('/register',register)
router.post('/login',login)
router.post('/forgot-password', forgotPassword) // ส่งอีเมลรีเซ็ตรหัสผ่าน
router.get('/verify-reset-token/:token', verifyResetToken) // ตรวจสอบ token รีเซ็ตรหัสผ่าน
router.post('/reset-password', resetPassword) // เปลี่ยนรหัสผ่านใหม่
router.post('/current-user', authCheck, currentUserAdmin)
router.post('/current-admin',authCheck, adminCheck, currentUserAdmin)



module.exports = router; // ส่งออก router ไปใช้ไฟล์อื่น