const prisma = require('../config/prisma')
// funtion ใช้สร้างหมวดหมู่ใหม่ในระบบ โดยใช้ prisma เชื่อมต่อกับฐานข้อมูลใน My SQL


// Admin
exports.create = async (req, res) => { // ใช้ async/await เพราะมีการทำงานกับฐานข้อมูลที่ต้องรอผลลัพธ์
    try { // try-catch ดักจับ ประมวลผล และจัดการข้อผิดพลาด
        const { name } = req.body //ดึงข้อมูลทั้งหมด จาก request body

        //  Validate ต้องมีเพราะผู้ใช้อาจข้ามการดักหน้าบ้านได้ (เช่น ใช้ Postman ยิง API โดยตรง)
        if (!name || name.trim() === '') {
            return res.status(400).json({ message: 'Category name is required' });
        }

        const newCategory = await prisma.category.create({ // สร้าง record ใหม่ในตาราง category 
            data: { name }// name: ชื่อหมวดหมู่ที่รับมาจาก request
        })

        res.status(201).json(newCategory) // ส่งข้อมูลหมวดหมู่ที่เพิ่งสร้างกลับไปยัง client

    } catch (err) { // ถ้ามีข้อผิดพลาดเกิดขึ้นระหว่างการทำงาน
        console.log(err) // จะแสดง error ใน console (สำหรับ debugging)

        // Prisma errors code ระบุ ข้อมูลซ้ำในฟิลด์ unique
        if (err.code === 'P2002') {
            return res.status(400).json({ message: 'Duplicate category name' });
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

        const [allCategory, totalCount] = await Promise.all([
            prisma.category.findMany({
                where: where,
                orderBy: {
                    createdDate: 'desc'
                },
                skip,
                take: limit
            }),
            prisma.category.count({
                where: where,
            })
            
        ])
        res.status(200).json({
            data: allCategory,
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
            return res.status(400).json({ message: 'Category name is required' })
        }

        // ตรวจสอบชื่อซ้ำ โดยไม่รวม id ปัจจุบัน
        const existing = await prisma.category.findFirst({
            where: {
                name: name.trim(),
                NOT: {
                    id: Number(id)
                }
            }
        })

        if (existing) {
            return res.status(400).json({ message: 'Duplicate category name' })
        }

        const category = await prisma.category.update({
            where: {
                id: Number(id) // ข้อมูลที่ส่งมา มันเป็น string จริงต้องแปลงเป็น number ก่อน
            },
            data: {
                name: name.trim()
            }
        })
        res.status(200).json(category)
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: 'Server Error' })
    }
}

exports.remove = async (req, res) => {
    try {
        const { id } = req.params
        const category = await prisma.category.delete({
            where: {
                id: Number(id) // ข้อมูลที่ส่งมา มันเป็น string จริงต้องแปลงเป็น number ก่อน
            }
        })
        res.send(category)
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: 'Server Error' })
    }
}

// user
exports.listAllCategory = async (req, res) => {
    try {
        const categories = await prisma.category.findMany({
            orderBy: {
                id: 'asc', // เรียงจาก id น้อยไปมาก
            },
        })

        res.status(200).json({
            data: categories,
            totalCount: categories.length,
        })
    } catch (err) {
        console.error('Error in listAllCountry:', err);
        res.status(500).json({ message: 'Server Error' });
    }
}
