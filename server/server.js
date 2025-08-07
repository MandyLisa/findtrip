// step 1 import ...
const express = require('express')
const cors = require('cors')
const app = express()
const morgan = require('morgan')
const { readdirSync } = require('fs')
const path = require('path')
const fs = require('fs'); // เพิ่มการ import fs เพื่อใช้ในการตรวจสอบและสร้างโฟลเดอร์


// ใช้งาน code จากไฟล์ authen.js แทน และลบstep 3 router ด้านล่างออก
// จากนั้นเพิ่มcode app.use('./api',authenRouter) แทน
// จากนั้นก็ต้องเพิ่ม app.use จากไฟล์ทุกตัวที่เราจะเรียกใช้ ซึ่งมันมีวิธีที่ง่ายกกว่านั้น
// ด้านล่างนี้ comment ทิ้งเลย
// const authRouter = require('./routes/auth')
// const categoryRouter = require('./routes/category')

// ตรวจสอบและสร้างโฟลเดอร์ 'public/uploads/slips' หากยังไม่มี
const slipDir = path.join(__dirname, 'public', 'uploads', 'slips');
console.log(slipDir
    
)
if (!fs.existsSync(slipDir)) {
    fs.mkdirSync(slipDir, { recursive: true });
    console.log('Created folder:', slipDir); // ข้อความแจ้งเตือนหากสร้างโฟลเดอร์ใหม่
}

// ก่อน app.use() หรือการใช้งาน routes อื่น ๆ: คุณจะต้องตรวจสอบและสร้างโฟลเดอร์ public/uploads/slips/ ที่จะใช้สำหรับเก็บสลิปก่อน
// โค้ด fs.existsSync() และ fs.mkdirSync() จะทำงานในตอนเริ่มต้นของเซิร์ฟเวอร์ ก่อนที่จะโหลด routes หรือใช้ฟังก์ชันอื่น ๆ
// recursive: true จะช่วยสร้างโฟลเดอร์ทั้งหมดที่ขาดหายไป (เช่น uploads/ และ public/ ถ้ายังไม่มี)


// middelware 
app.use(morgan('dev')) // morgan ใช้บันทึก Log HTTP request ที่เข้ามายังเซิร์ฟเวอร์ 
app.use(express.json({ limit: '50mb'})) // สำหรับ parse JSON request body
app.use(cors({ // เพราะ Postman ไม่ได้อยู่ใน browser เลย ไม่ติด CORS ค่ะ CORS มีผลเฉพาะเวลาเปิดบน browser (เช่น Chrome, Safari, Firefox)
    origin: 'http://localhost:5173'
}));

// ด้านล่างนี้ comment ทิ้งเลย เพราะมีการใช้ const { readdirSync } = require('fs') แทนแล้ว
// app.use('/api',authRouter)
// app.use('/api/',categoryRouter)
// ลอง console.log แบบนี้ดู



// เขียนโค้ดสร้าง ระบบโหลด route อัตโนมัติ จากโฟลเดอร์ ./routes
readdirSync('./routes').forEach((file) => {
    const routeName = path.parse(file).name; // ดึงเฉพาะชื่อไฟล์
    console.log(`Loading route: ${routeName}`); // ตรวจสอบว่า auth ถูกโหลด
    app.use(`/api/${routeName}`, require(`./routes/${file}`))
})



// step 2 start server
app.listen(5000,
    ()=> console.log('Server is running on port 5000'))