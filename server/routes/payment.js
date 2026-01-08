const express = require('express')
const router = express.Router()
const multer = require('multer')
const uploadImage = require('../middlewares/uploadImage')

const { authCheck, adminCheck } = require('../middlewares/authCheck')
const { 
    uploadPaymentSlip,
    listPayments,
    listPaymentStatus,
    listPaymentMethod,
    getPaymentDetailByAdmin, 
} = require('../controllers/payment')


// user
// @ Endpoint http://localhost:5000/api/payment
router.post('/upload-slip/:bookingId', authCheck, uploadImage.single('slip'), uploadPaymentSlip)

// admin 
// @ Endpoint http://localhost:5000/api/payments
router.get('/admin/all', authCheck, adminCheck, listPayments) // ดูรายการชำระเงินทั้งหมด
router.get('/admin/list-status/payment', authCheck, adminCheck, listPaymentStatus) // drop down สถานะการชำระเงิน
router.get('/admin/list-status/method', authCheck, adminCheck, listPaymentMethod) // drop down ช่องทางการชำระเงิน
router.get('/admin/payment-details/:id', authCheck, adminCheck, getPaymentDetailByAdmin) // อัปเดตสถานะการชำระเงิน


module.exports = router