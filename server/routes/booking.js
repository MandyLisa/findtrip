const express = require('express')
const router = express.Router()
const { authCheck, adminCheck }  = require('../middlewares/authCheck')
const { getUserBookings, getBookingById, createBooking, cancelBooking,
        listBookings, updateBookingStatus, listBookingStatus } = require('../controllers/booking')


// @Endpoint http://localhost:5000/api/booking
// 1. สำหรับ User ใช้งาน
router.post('/', authCheck, createBooking) // สร้างการจองใหม่
router.get('/', authCheck, getUserBookings) // ดูการจองของตัวเอง
router.patch('/:id/cancel', authCheck, cancelBooking) // ยกเลิกการจอง
router.get('/:id', authCheck, getBookingById) // ดูรายละเอียดการจอง

// 2. สำหรับ Admin ใช้งาน 
router.get('/admin/all', authCheck, adminCheck, listBookings) // ดูการจองทั้งหมด
router.get('/admin/list-status/booking', authCheck, adminCheck, listBookingStatus) // drop down
router.patch('/admin/:id/status', authCheck, adminCheck, updateBookingStatus) // อัปเดตสถานะการจอง


module.exports = router