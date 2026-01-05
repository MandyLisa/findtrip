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

// router.post('/select-method', authCheck, choosePaymentMethod) // เลือกวิธีการชำระเงิน
router.post('/upload-slip/:bookingId', authCheck, uploadImage.single('slip'), uploadPaymentSlip)
// uploadImage.single('slip') คือ middleware ที่ประมวลผลไฟล์ก่อนถึง ไฟล์ uploadPaymentSlip) 
// authCheck — ตรวจสิทธิ์ผู้ใช้ก่อน (ป้องกันคนไม่ได้สิทธิอัปโหลด)
// uploadImage.single('slip') คือ multer อ่าน body แบบ multipart/form-data 
// และประมวลผลไฟล์ field ชื่อ 'slip' แล้วใส่ req.file
// uploadPaymentSlip คือฟังชั่นที่ใช้จัดการค่า ที่รับ req.file/req.body เพื่อบันทึก path ลง DB หรือทำงานต่อไป
// ต้องแน่ใจว่าฟอร์มฝั่งหน้าใช้ enctype="multipart/form-data" และ input ชื่อ name="slip" 
// ถ้าไม่ตรง จะไม่ได้ไฟล์ใน req.file

// admin 
// @ Endpoint http://localhost:5000/api/payments
router.get('/admin/all', authCheck, adminCheck, listPayments) // ดูรายการชำระเงินทั้งหมด
router.get('/admin/list-status/payment', authCheck, adminCheck, listPaymentStatus) // drop down สถานะการชำระเงิน
router.get('/admin/list-status/method', authCheck, adminCheck, listPaymentMethod) // drop down ช่องทางการชำระเงิน
router.get('/admin/payment-details/:id', authCheck, adminCheck, getPaymentDetailByAdmin) // อัปเดตสถานะการชำระเงิน


module.exports = router