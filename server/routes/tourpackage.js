const express = require('express')
const router = express.Router()
const upload = require('../middlewares/upload')
const { authCheck, adminCheck } = require('../middlewares/authCheck')
const { create, update, remove, list, read, createImages, removeImages, createPDF } 
      = require('../controllers/tourpackage')


// Admin
// @Endpoint http://localhost:5000/api/tourpackage/
router.post('/images', authCheck, adminCheck, createImages) // อัพโหลดรูป
router.delete('/remove-images', authCheck, adminCheck, removeImages) // ลบรูป

router.post('/upload-pdf', authCheck, adminCheck, upload.single('pdf'),  createPDF) // อัพโหลด PDF

router.post('/', authCheck, adminCheck, create) // เพิ่ม package
router.put('/:id', authCheck, adminCheck, update) // อัพเดตแก้ไข package
router.get('/detail/:id', authCheck, adminCheck, read) // อ่าน package
router.get('/', authCheck, adminCheck, list) // แสดงรายการทัวร์
router.delete('/:id', authCheck, adminCheck, remove) // ลบ package


module.exports = router