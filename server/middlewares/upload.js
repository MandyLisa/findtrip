// middlewares/upload.js
const multer = require('multer') // multer ทำหน้าที่ดักจับไฟล์ที่ผู้ใช้ upload ผ่าน form

const storage = multer.memoryStorage() // // 1. จัดเก็บไฟล์ไว้ใน  RAM (ผ่าน memoryStorage())

const upload = multer({ // 2. ตั้งค่าการอัปโหลดไฟล์ PDF ส่งต่อไฟล์นั้นผ่าน req.file.buffer ไปยัง Cloudinary API
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


// อธิบายการทำงาน "การคัดกรองไฟล์ ก่อนจะผ่านเข้า controller"
// fileFilter: (req, file, cb) => { ... }
// - เป็นฟังก์ชันที่ Multer จะเรียกใช้ทุกครั้งที่มีการอัปโหลดไฟล์
// - req คือ request object
// - file คือข้อมูลของไฟล์ที่อัปโหลด (เช่น file.mimetype, file.originalname)
// - cb คือ callback ที่ต้องเรียกเพื่อแจ้ง Multer ว่าจะรับไฟล์นี้หรือไม่

// if (file.mimetype === 'application/pdf')
// file.mimetype คือชนิดของไฟล์ที่ browser แจ้งมา เช่น:
// - PDF: 'application/pdf'
// - PNG: 'image/png'
// - JPEG: 'image/jpeg'
// - ตรงนี้คือเช็คว่าไฟล์เป็น PDF หรือไม่

// cb(null, true)
// - ถ้าไฟล์เป็น PDF: บอก multer ว่า ไม่มี error (null) และให้ รับไฟล์นี้เข้าไป (true)

// cb(new Error('Only PDF files are allowed'), false)
// ถ้าไฟล์ไม่ใช่ PDF: บอก multer ว่าเกิด error โดยสร้าง Error ใหม่ และให้ ปฏิเสธการรับไฟล์นี้ (false)

// middlewares/uploadPDF.js
// const multer = require('multer');

// const storage = multer.memoryStorage();

// const pdfFilter = (req, file, cb) => {
//   if (file.mimetype === 'application/pdf') {
//     cb(null, true);
//   } else {
//     cb(new Error('Only PDF files are allowed'), false);
//   }
// };

// const uploadPDF = multer({
//   storage,
//   fileFilter: pdfFilter,
//   limits: { fileSize: 10 * 1024 * 1024 } // PDF ใหญ่กว่านิดหน่อย
// });

// module.exports = uploadPDF;
