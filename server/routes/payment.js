const express = require('express')
const router = express.Router()
const multer = require('multer')
const uploadImage = require('../middlewares/uploadImage')

const { authCheck, adminCheck } = require('../middlewares/authCheck')
const { 
    // choosePaymentMethod,
    uploadPaymentSlip,
    checkPaymentStatus,
    getPaymentDetails,
    listPayments,
    listPaymentStatus,
    listPaymentMethod,
    confirmPaymentSlip, 
} = require('../controllers/payment')


// user
// @ Endpoint http://localhost:5000/api/payment

// router.post('/select-method', authCheck, choosePaymentMethod) // เลือกวิธีการชำระเงิน
router.post('/upload-slip/:bookingId', authCheck, uploadImage.single('slip'), uploadPaymentSlip)
router.get('/status/:bookingId', authCheck, checkPaymentStatus) // ดูสถานะการชำระเงินของ booking ตัวเอง
router.get('/detail/:paymentId', authCheck, getPaymentDetails)  // ดูข้อมูลการชำระเงินของ Booking ที่เราจองไป

// admin 
// @ Endpoint http://localhost:5000/api/payments
router.get('/admin/all', authCheck, adminCheck, listPayments) // ดูรายการชำระเงินทั้งหมด
router.get('/admin/list-status/payment', authCheck, adminCheck, listPaymentStatus) // ดูการจองทั้งหมด
router.get('/admin/list-status/method', authCheck, adminCheck, listPaymentMethod) // ดูการจองทั้งหมด

router.put('/admin/:paymentId/status', authCheck, adminCheck, confirmPaymentSlip) // อัปเดตสถานะการชำระเงิน
// router.delete('/admin/:paymentId', authCheck, adminCheck, deletePayment) // ลบการชำระเงิน

module.exports = router