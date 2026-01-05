const express = require('express') // นำเข้า library express ช่วยจัดการ api กับ node.js
const router = express.Router() // จัดการ route เส้นทาง API ใน app 
const { authCheck, adminCheck } = require('../middlewares/authCheck') // นำเข้าฟังก์ชัน authCheck, adminCheck ที่อยู่ใน Middleware สำหรับตรวจสอบสิทธิ์ผู้ใช้ 
const { listUsers, listUserRole, getProfileById, updateUserRole, changeUserStatus, getDashboardSummary } = require('../controllers/admin')
// นำเข้าฟังก์ชัน "Controller" ซึ่งแต่ละฟังก์ชันมีหน้าที่ประมวลผลคำขอและส่งข้อมูลกลับ
// authCheck: ใช้ตรวจสอบว่าผู้ใช้ได้เข้าสู่ระบบแล้วหรือยัง
// adminCheck: ใช้ตรวจสอบว่าผู้ใช้คนนั้นมีสิทธิ์เป็น Admin หรือไม่


// Admin จัดการผู้ใช้ (User Management)
router.get('/users', authCheck, adminCheck, listUsers) // ดูรายการผู้ใช้ทั้งหมด
router.get('/users/role-list', authCheck, adminCheck, listUserRole) // drop down
router.get('/users/:id', authCheck, adminCheck, getProfileById) // drop down

router.put('/users/role/:id', authCheck, adminCheck, updateUserRole) // เปลี่ยน role ของ user
router.put('/users/status/:id', authCheck, adminCheck, changeUserStatus) // เปลี่ยน status ของ user
router.get('/summary', getDashboardSummary)


module.exports = router
