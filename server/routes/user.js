const express = require('express')
const router = express.Router()

// import module ที่เราเรียกใช้
const { authCheck }  = require('../middlewares/authCheck') // ตรวจสอบการเข้าสู่ระบบก่อน
const { getUserProfile, updateUserProfile } = require('../controllers/user')
  
// ข้อมูลผู้ใช้ (User Profile)
router.get('/profile', authCheck, getUserProfile) // ดูโปรไฟล์
router.put('/profile', authCheck, updateUserProfile) // แก้ไขโปรไฟล์


module.exports = router