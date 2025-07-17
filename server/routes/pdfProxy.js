const express = require('express')
const router = express.Router()

// import module ที่เราเรียกใช้
const { proxyPDF }  = require('../controllers/pdfProxy') // ตรวจสอบการเข้าสู่ระบบก่อน

  
router.get('/', proxyPDF ) // ดูโปรไฟล์


module.exports = router