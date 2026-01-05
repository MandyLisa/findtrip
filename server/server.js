// 1. import ขั้นตอน (เมื่อรันไฟล์)
const express = require('express') 
const cors = require('cors') 
const morgan = require('morgan') 
const app = express() // สร้าง แอปพลิเคชัน หรือตัวเซิร์ฟเวอร์หลักขึ้นมาหนึ่งตัว ซึ่งจะทำหน้าที่ควบคุมทุกอย่าง
const path = require('path') // สำหรับจัดการการเข้าถึง path ต่างๆ ในระบบ
const fs = require('fs') // ใช้ในการตรวจสอบและสร้างโฟลเดอร์


// สร้าง path เต็มของโฟลเดอร์ที่จะเก็บไฟล์ slip 
const slipDir = path.join(__dirname, 'public', 'uploads', 'slips')
console.log(slipDir)


if (!fs.existsSync(slipDir)) { // เช็คว่า path นี้มีอยู่จริงไหม ถ้าไม่มี
    fs.mkdirSync(slipDir, { recursive: true }) // สร้างโฟลเดอร์ทันที
    console.log('Created folder:', slipDir) 
}

// 2. middelware ตั้งกฎของเซิร์ฟเวอร์ เพื่อเตรียมรับคำขอจากภายนอก
app.use(morgan('dev')) // บันทึก log ข้อมูลการ request 
app.use(express.json({ limit: '50mb'})) // แปลงข้อความเป็น json
app.use(cors({ // ฟีเจอร์ด้านความปลอดภัยในเว็บเบราว์เซอร์ที่ป้องกันไม่ให้หน้าเว็บส่งคำขอ API ไปยัง "ที่มา (Origin)" ที่แตกต่างกัน
    origin: 'http://localhost:5173'
}))


// 3. กำหนด API Route (ระบุเส้นทางของไฟล์) โดยอ่านไฟล์ทั้งหมดที่อยู่ในโฟลเดอร์ routes และ สร้างเส้นทาง API Routes
fs.readdirSync('./routes').forEach((file) => {
    const routeName = path.parse(file).name 
    app.use(`/api/${routeName}`, require(`./routes/${file}`))
})


app.listen(5000,
    ()=> console.log('Server is running on port 5000'))