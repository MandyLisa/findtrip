const prisma = require('../config/prisma')
// ใช้ prisma เชื่อมต่อกับฐานข้อมูลใน My SQL

// Admin
exports.create = async (req, res) => { 
    try { 
        const { name } = req.body //ดึงข้อมูล จาก req.body

        //  Validate ต้องมี เพราะผู้ใช้อาจข้ามการดักจากหน้าบ้านได้ (เช่น ใช้ Postman ยิง API โดยตรง)
        if (!name || name.trim() === '') {
            return res.status(400).json({ message: 'Category name is required' })
        }

        const normalizedName = name.trim()

        const newCategory = await prisma.category.create({ // สร้าง record ใหม่ในตาราง category 
            data: { name: normalizedName }// ชื่อที่รับมาจาก request
        })

        res.status(201).json(newCategory) 

    } catch (error) { 
        console.log(error) 

        if (error.code === 'P2002') {  // รหัส Prisma Error ดัก duplicate จาก DB (ข้อมูลซ้ำตรงกับฟิลด์ unique)
            return res.status(400).json({ message: 'Category name already exists' })
        }
        res.status(500).json({ message: 'Server Error' }) 
    }
}

exports.list = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1
        const limit = parseInt(req.query.limit) || 5  // ถ้าไม่มีหรือไม่ถูกต้อง → fallback เป็น 10 ใช้เพื่อกำหนดจำนวนข้อมูลที่จะแสดงต่อหน้า
        const skip = (page - 1) * limit

        const { id, name, } = req.query
        // console.log('1111111111111========= ', id)

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
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Server Error' })
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
    } catch (error) {
        console.log(error)
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
        res.status(200).json(category)
    } catch (error) {
        console.log(error)
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
    } catch (error) {
        console.error('Error in listAllCategory:', error)
        res.status(500).json({ message: 'Server Error' })
    }
}
