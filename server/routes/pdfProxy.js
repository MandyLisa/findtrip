const express = require('express')
const router = express.Router()
const { proxyPDF }  = require('../controllers/pdfProxy') // ตรวจสอบการเข้าสู่ระบบก่อน
// import module ที่เราเรียกใช้


// @Endpoint http://localhost:5000/api/pdfProxy
router.get('/', proxyPDF ) // ดูโปรไฟล์


module.exports = router