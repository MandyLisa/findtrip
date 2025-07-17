const express = require('express')
const router = express.Router()
const { authCheck, adminCheck }  = require('../middlewares/authCheck')
const { getUserBookings, getBookingById, createBooking, cancelBooking,
        listBookings, updateBookingStatus } = require('../controllers/booking')

// 1. สำหรับ User ใช้งาน
router.post('/', authCheck, createBooking) // สร้างการจองใหม่
router.get('/', authCheck, getUserBookings) // ดูการจองของตัวเอง
router.get('/:id', authCheck, getBookingById) // ดูรายละเอียดการจอง
router.patch('/:id/cancel', authCheck, cancelBooking) // ยกเลิกการจอง

// 2. สำหรับ Admin ใช้งาน 
router.get('/admin/all', authCheck, adminCheck, listBookings) // ดูการจองทั้งหมด
router.put('/admin/:id/status', authCheck, adminCheck, updateBookingStatus) // อัปเดตสถานะการจอง

module.exports = router