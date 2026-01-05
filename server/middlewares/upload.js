// middlewares/upload.js
const multer = require('multer') // multer ทำหน้าที่ดักจับไฟล์ที่ผู้ใช้ upload ผ่าน form
const storage = multer.memoryStorage() // // 1. จัดเก็บไฟล์ไว้ใน  RAM (ผ่าน memoryStorage())

const upload = multer({ // 2. ตั้งค่าการอัปโหลดไฟล์ PDF 
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // จำกัดขนาดไฟล์ไม่เกิน 5 MB
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {  // อนุญาตเฉพาะ PDF เท่านั้น
      cb(null, true)
    } else {
      cb(new Error('Only PDF files are allowed'), false)
    }
  }
})

module.exports = upload


