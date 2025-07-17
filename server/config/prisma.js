const { PrismaClient } = require('@prisma/client') // นำเข้า Prisma Client ส่วน @prisma/client คือแพ็กเกจที่รวมฟีเจอร์ทั้งหมดสำหรับการเชื่อมต่อและจัดการ DB
const prisma = new PrismaClient() // PrismaClient คือคลาสที่ใช้สำหรับสร้าง instance ของ Prisma Client และเก็บไว้ในตัวแปร prisma 
// instance นี้จะใช้สำหรับการเชื่อมต่อกับฐานข้อมูลและดำเนินการ query ต่างๆ


module.exports = prisma // ส่งออก instance ของ Prisma Client เพื่อให้โมดูลอื่นในโปรเจกต์สามารถนำไปใช้งานได้