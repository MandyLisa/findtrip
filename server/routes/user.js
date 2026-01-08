const express = require('express')
const router = express.Router()
const { authCheck }  = require('../middlewares/authCheck') // ตรวจสอบการเข้าสู่ระบบก่อน
const { getUserProfile, updateUserProfile } = require('../controllers/user')
  
// @Endpoint http://localhost:5000/api/user
router.get('/profile', authCheck, getUserProfile) // ดูโปรไฟล์
router.put('/profile', authCheck, updateUserProfile) // แก้ไขโปรไฟล์


module.exports = router