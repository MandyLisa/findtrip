const prisma = require('../config/prisma')
// funtion ใช้สร้างหมวดหมู่ใหม่ในระบบ โดยใช้ prisma เชื่อมต่อกับฐานข้อมูลใน My SQL


// Admin
exports.create = async (req, res) => { // ใช้ async/await เพราะมีการทำงานกับฐานข้อมูลที่ต้องรอผลลัพธ์
    try { // try-catch ดักจับ ประมวลผล และจัดการข้อผิดพลาด
        const { name } = req.body //ดึงข้อมูลทั้งหมด จาก request body

        // Validate input
        if (!name || name.trim() === '') {
            return res.status(400).json({ message: 'Country name is required' });
        }

        const newCountry = await prisma.country.create({ // สร้าง record ใหม่ในตาราง category 
            data: {
                name: name // name: ชื่อประเทศที่รับมาจาก request         
            }
        })
        res.status(201).json(newCountry) // ส่งข้อมูลหมวดหมู่ที่เพิ่งสร้างกลับไปยัง client

    } catch (err) { // ถ้ามีข้อผิดพลาดเกิดขึ้นระหว่างการทำงาน
        console.log(err) // จะแสดง error ใน console (สำหรับ debugging)

        if (err.code === 'P2002') {         // Prisma errors code ระบุ ข้อมูลซ้ำในฟิลด์ unique
            return res.status(400).json({ message: 'Duplicate country name' });
        }
        res.status(500).json({ message: 'Server Error' }) //ส่ง response กลับด้วย status code 500 และข้อความ "Server Error"
    }
}

exports.list = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1
        const limit = parseInt(req.query.limit) || 5  // ถ้าไม่มีหรือไม่ถูกต้อง → fallback เป็น 10 ใช้เพื่อกำหนดจำนวนข้อมูลที่จะแสดงต่อหน้า
        const skip = (page - 1) * limit

        const { id, name, } = req.query
        // console.log('1111111111111========= ', id)
        // console.log('2222222222222========= ', name)

        // สร้างเงื่อนไข where แบบ dynamic
        const where = {}

        if (id) {
            where.id = Number(id)
        }

        if (name) {
            where.name = {
                contains: name,
            }
        }

        const [allCountry, totalCount] = await Promise.all([
            prisma.country.findMany({
                where: where,
                orderBy: {
                    createdDate: 'desc'
                },
                skip,
                take: limit
            }),
            prisma.country.count({
                where: where,
            })
        ])
        res.status(200).json({
            data: allCountry,
            currentPage: page,
            totalPage: Math.ceil(totalCount / limit),
            totalCount,
        })
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
}

exports.update = async (req, res) => {
    try {
        const { id } = req.params
        const { name } = req.body

        if (!name || name.trim() === '') {
            return res.status(400).json({ message: 'Country name is required' })
        }

        // ตรวจสอบชื่อซ้ำ โดยไม่รวม id ปัจจุบัน
        const existing = await prisma.country.findFirst({
            where: {
                name: name.trim(),
                NOT: {
                    id: Number(id)
                }
            }
        })

        if (existing) {
            return res.status(400).json({ message: 'Duplicate country name' })
        }

        const country = await prisma.country.update({
            where: {
                id: Number(id) // ข้อมูลที่ส่งมา มันเป็น string จริงต้องแปลงเป็น number ก่อน
            },
            data: {
                name: name.trim()
            }
        })
        res.status(200).json(country)
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: 'Server Error' })
    }
}

exports.remove = async (req, res) => {
    try {
        const { id } = req.params
        const country = await prisma.country.delete({
            where: {
                id: Number(id)
            }
        })
        res.send(country)
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: 'Server Error' })
    }
}

// user
exports.listAllCountry = async (req, res) => {
    try {
        const countries = await prisma.country.findMany({
            orderBy: {
                id: 'asc',
            },
        })

        res.status(200).json({
            data: countries,
            totalCount: countries.length,
        })
    } catch (err) {
        console.error('Error in listAllCountry:', err);
        res.status(500).json({ message: 'Server Error' });
    }
}


