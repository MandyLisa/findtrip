const express = require('express') // นำเข้า library express 
const router = express.Router() // จัดการ route เส้นทาง API ใน app 
const { authCheck, adminCheck } = require('../middlewares/authCheck') // นำเข้าฟังก์ชัน authCheck, adminCheck ที่อยู่ใน Middleware สำหรับตรวจสอบสิทธิ์ผู้ใช้ 
const { listUsers, listUserRole, getProfileById, updateUserRole, changeUserStatus, getDashboardSummary, getDashboardAnalytics } = require('../controllers/admin')


// @Endpoint http://localhost:5000/api/admin
router.get('/users', authCheck, adminCheck, listUsers) // ดูรายการผู้ใช้ทั้งหมด
router.get('/users/role-list', authCheck, adminCheck, listUserRole) // drop down
router.get('/users/:id', authCheck, adminCheck, getProfileById) // drop down

router.put('/users/role/:id', authCheck, adminCheck, updateUserRole) // เปลี่ยน role ของ user
router.put('/users/status/:id', authCheck, adminCheck, changeUserStatus) // เปลี่ยน status ของ user
router.get('/summary', getDashboardSummary)
router.get('/dashboard', authCheck, adminCheck, getDashboardAnalytics)


module.exports = router
