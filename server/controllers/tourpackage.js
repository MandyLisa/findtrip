const prisma = require('../config/prisma')
const cloudinary = require('../utils/cloudinary')


// tourpackage/admin
exports.create = async (req, res) => {

    try { // ดึงค่าจาก body ที่มาจาก Frontend เพื่อสร้างข้อมูลใหม่ใน TourPackage
        const { title, tourCode, categoryId, countryId, airline, starRating, startDate, endDate, duration,
            priceAdult, priceChild, singleStayExtra, priceVisa, priceGuide, maxSeats, itinerary,
            isRecommend, isActive, images, tourPDF } = req.body

        // Validation
        const requiredFields = [
            title, tourCode, categoryId, countryId,
            airline, starRating, startDate, endDate,
            duration, priceAdult, priceChild, singleStayExtra,
            priceVisa, priceGuide, maxSeats, itinerary,
            isRecommend, isActive, images, tourPDF
        ]

        if (requiredFields.some(field => field == null)) {
            return res.status(400).json({ message: 'Missing required fields' })
        }

        // แปลงวันที่ให้เป็น DateTime object
        const formattedStartDate = new Date(startDate) // สร้าง Date object จาก string ที่รับเข้ามา
        const formattedEndDate = new Date(endDate)

        // เช็ค validate 
        const existing = await prisma.tourPackage.findUnique({
            where: { tourCode }
        })

        if (existing) {
            return res.status(400).json({ error: 'รหัสทัวร์นี้มีอยู่แล้วในระบบ โปรดติดต่อ Supervisor' })
        }

        // ใส่ Logic เหมือนกับ Update ตรงปุ่มเปิด/ปิดการขายทัวร์ กับ seatStatus
        let seatStatusInitial = 'AVAILABLE'
        if (isActive === false) {
            seatStatusInitial = 'CLOSED'
        }

        // create ลงฐานข้อมูล
        const newTourPackage = await prisma.tourPackage.create({
            data: { // ฝั่งซ้ายคือฟิลด์ในฐานข้อมูล ฝั่งขวาคือค่าที่ส่งมาจาก front end
                title: title,
                tourCode: tourCode,
                category: {
                    connect: { id: Number(categoryId) }
                },
                country: {
                    connect: { id: Number(countryId) }
                },
                airline: airline,
                starRating: Number(starRating),
                startDate: formattedStartDate,
                endDate: formattedEndDate,
                duration: duration,
                priceAdult: Number(priceAdult),
                priceChild: Number(priceChild),
                singleStayExtra: Number(singleStayExtra),
                priceVisa: Number(priceVisa),
                priceGuide: Number(priceGuide),
                maxSeats: Number(maxSeats),
                itinerary: itinerary,
                isRecommend: isRecommend,
                isActive: isActive,
                seatStatus: seatStatusInitial, // กำหนดค่าเริ่มต้นของ seatStatus
                images: { // loop สร้างไปเรื่อยๆ เพราะเป็น One-to-Many: (1 ทัวร์มีหลายรูปภาพ)
                    create: images.map((item) => ({ // return ออกไปเป็น object
                        asset_id: item.asset_id,
                        public_id: item.public_id,
                        url: item.url,
                        secure_url: item.secure_url
                    }))
                },

                tourPDF: {
                    create: {
                        asset_id: tourPDF.asset_id,
                        public_id: tourPDF.public_id,
                        url: tourPDF.url,
                        secure_url: tourPDF.secure_url
                    }
                } // : undefined  
            }
        })

        // console.log(newTourPackage) // เพื่อดูข้อมูลที่ถูกบันทึกจริง
        res.status(201).json({
            data: newTourPackage,
            message: 'Created Successfully'
        }) // ส่งข้อมูลกลับไปยัง Frontend โดยส่งข้อความเพื่อยืนยันว่าบันทึกสำเร็จ
    } catch (err) {
        console.error('Create TourPackage Error: ', err)
        res.status(500).json({ message: 'Server Error' })
    }
}

exports.list = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1 // อยากดูหน้าที่เท่าไหร่
        const limit = parseInt(req.query.limit) || 10  // หนึ่งหน้าจะให้โชว์กี่แถว
        const skip = (page - 1) * limit //ต้อง 'ข้าม' ไปกี่แถวถึงจะเจอหน้าที่จะอ่าน เป็นสูตรการคำนวนหน้า

        // 1. รับค่า Filter และดึงค่าตัวกรองจาก query string
        const { id, tourCode, categoryId, countryId, isRecommend, isActive, seatStatus } = req.query

        // 2. สร้างวันนี้เป็นฐาน (เที่ยงคืนเป๊ะ)
        const today = new Date()
        today.setHours(0, 0, 0, 0)

        // 3. สร้างเงื่อนไขพื้นฐาน
        const where = {}
        if (id && id.trim() !== '') where.id = Number(id)
        if (tourCode && tourCode.trim() !== '') where.tourCode = { contains: tourCode }
        if (categoryId && categoryId.trim() !== '') where.categoryId = Number(categoryId)
        if (countryId && countryId.trim() !== '') where.countryId = Number(countryId)
        if (isRecommend === 'true' || isRecommend === 'false') {
            where.isRecommend = isRecommend === 'true'
        }
        if (isActive === 'true' || isActive === 'false') {
            where.isActive = isActive === 'true'
        }

        // 4. ดึง ID ทั้งหมดมาก่อน เพื่อเอาไปคำนวณ Virtual Status (ไม่ให้ Pagination แหว่ง)
        // เราไม่สามารถ filter 'CLOSED' (3 วัน) ใน Prisma findMany ตรงๆ ได้ ต้องดึง "ID ทั้งหมด"  ที่ตรงเงื่อนไขมาก่อน
        const allIds = await prisma.tourPackage.findMany({
            where: where, // ตัวแปรที่กรองมาแล้ว
            select: {
                id: true,
                startDate: true,
                seatStatus: true,
                maxSeats: true,
                sold: true
            }
        })

        // 5. คำนวณ Virtual Status ใหม่ และกรอง ID ตามสถานะที่นั่งที่ถูกปรับแล้ว
        const filteredIds = allIds.map(tour => {
            const startDate = new Date(tour.startDate)
            startDate.setHours(0, 0, 0, 0)

            const daysDiff = Math.ceil((startDate - today) / (1000 * 3600 * 24))

            let currentStatus = tour.seatStatus
            // แก้ไข: ใช้ <= 3 เพื่อให้นับรวมวันที่ 3 ด้วย
            if (daysDiff <= 3 && currentStatus !== 'CLOSED') {
                currentStatus = 'CLOSED'
            }
            return { id: tour.id, finalStatus: currentStatus }
        })
            .filter(t => {
                // ถ้าหน้าบ้านไม่ได้เลือก filter อะไร ให้ผ่านหมด
                if (!req.query.seatStatus || req.query.seatStatus === '') return true
                // ถ้าเลือก filter ให้เทียบกับ status ที่คำนวณใหม่แล้ว
                return t.finalStatus === req.query.seatStatus
            })
            .map(t => t.id)

        // 6. นำ IDs ที่กรองสถานะที่นั่ง ซึ่งถูกปรับแล้ว ไปดึงข้อมูลแบบ Pagination 
        const [data, totalCount] = await Promise.all([
            prisma.tourPackage.findMany({
                where: {
                    id: { in: filteredIds }
                },
                skip: skip,
                take: limit,
                orderBy: { createdDate: 'desc' },
                include: { category: true, country: true } // ดึงข้อมูลที่เกี่ยวข้องมาด้วย
            }),

            Promise.resolve(filteredIds.length)
        ])

        // 7. Mapping ข้อมูลรอบสุดท้ายเพื่อใส่ค่า remainingSeats และ daysUntilDeparture
        const finalData = data.map(tour => {
            const startDate = new Date(tour.startDate)
            startDate.setHours(0, 0, 0, 0) // ตั้งวันเดินทางเป็นเที่ยงคืนเช่นกัน

            const daysDiff = Math.ceil((startDate - today) / (1000 * 3600 * 24)) // ใช้ Math.ceil เพื่อความปลอดภัย

            // console.log(`ID: ${tour.id} | Diff: ${daysDiff} days`)

            // แม้ใน DB จะเป็น true แต่ถ้าเหลือ < 3 วัน เราจะส่ง false ไปให้หน้าบ้าน
            let currentIsActive = tour.isActive
            if (daysDiff < 3) {
                currentIsActive = false
            }

            // 2. คำนวณ seatStatus ให้สอดคล้องกัน
            let currentSeatStatus = tour.seatStatus
            if (currentIsActive === false || daysDiff < 3) {
                currentSeatStatus = 'CLOSED'
            }

            // หมายเหตุ: ถ้าไม่เข้าเงื่อนไขด้านบน currentStatus จะใช้ค่าจาก DB 
            // (ซึ่งถูกจัดการโดย SQL Trigger เช่น AVAILABLE, FULL, NEARLY_FULL)

            return {
                ...tour,
                isActive: currentIsActive, // ส่งค่าที่อัปเดตแล้วไปให้หน้าบ้าน
                remainingSeats: tour.maxSeats - tour.sold,
                daysUntilDeparture: daysDiff,
                seatStatus: currentSeatStatus // ส่งค่าที่ได้ตามเงื่อนไข ไปให้หน้าบ้าน
            }
        })

        res.status(200).json({
            data: finalData,
            currentPage: page,
            totalPage: Math.ceil(totalCount / limit),
            totalCount,
        })

    } catch (err) {
        console.log(err)
        res.status(500).json({ message: 'Server Error' })
    }
}

exports.read = async (req, res) => {
    try {
        const { id } = req.params
        const tourPackage = await prisma.tourPackage.findFirst({
            where: { id: Number(id) },
            include: { // ดึงทุกฟิลด์ และดึงความสัมพันธ์แบบ relation 
                images: true,
                tourPDF: true,
            }
        })

        if (!tourPackage) return res.status(404).json({ message: 'ไม่พบข้อมูลทัวร์' })

        // ใช้ Logic คำนวณปิดทัวร์ก่อนเดินทาง 3 วันเหมือนหน้า list
        const today = new Date()
        today.setHours(0, 0, 0, 0)

        const startDateForCompare = new Date(tourPackage.startDate)
        startDateForCompare.setHours(0, 0, 0, 0)

        const timeDiff = startDateForCompare.getTime() - today.getTime()
        const daysDiff = Math.floor(timeDiff / (1000 * 3600 * 24))

        let currentStatus = tourPackage.seatStatus

        if (daysDiff < 3 && currentStatus !== 'CLOSED') {
            currentStatus = 'CLOSED'
        }

        res.status(200).json({
            ...tourPackage,
            daysUntilDeparture: daysDiff,
            remainingSeats: tourPackage.maxSeats - tourPackage.sold,
            seatStatus: currentStatus
        })
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: 'Server Error' })
    }
}

exports.update = async (req, res) => {
    try {
        const { title, tourCode, categoryId, countryId, airline, starRating, startDate, endDate, duration,
            priceAdult, priceChild, singleStayExtra, priceVisa, priceGuide, maxSeats, itinerary,
            isRecommend, isActive, images, tourPDF } = req.body
        // ดึงค่าต่างๆจาก req.body ที่มาจาก Frontend เพื่อใช้สร้างข้อมูลใหม่ใน TourPackage

        // แปลงวันที่ให้เป็น DateTime object
        const formattedStartDate = new Date(startDate)
        const formattedEndDate = new Date(endDate)

        // ลบรูปเก่า เพื่อ insert รูปใหม่เข้าไปใน database ไม่ได้ลบใน cloud
        await prisma.image.deleteMany({
            where: {
                tourPackageId: Number(req.params.id)
            }
        })

        // กรอง public_id ที่ไม่มี หรือ undefined ออก
        const cleanedImages = (images || []).map((item) => {
            const { public_id, ...rest } = item
            return public_id ? { public_id, ...rest } : rest
        })

        // console.log(tourPDF.pdf_url)

        // Logic เชื่อมโยงปุ่มเปิด/ปิดการขายทัวร์ กับ seatStatus
        let seatStatusUpdate = undefined
        if (isActive === false) {
            seatStatusUpdate = 'CLOSED'
        } else if (isActive === true) {
            seatStatusUpdate = 'AVAILABLE'
        }

        const tourPackage = await prisma.tourPackage.update({
            where: {
                id: Number(req.params.id)
            },
            data: { // ฝั่งซ้ายคือฟิลด์ในฐานข้อมูล ฝั่งขวาคือสิ่งที่ส่งมาจาก front end
                title: title,
                tourCode: tourCode,
                category: {
                    connect: { id: Number(categoryId) }
                },
                country: {
                    connect: { id: Number(countryId) }
                },
                airline: airline,
                starRating: starRating,
                startDate: formattedStartDate,
                endDate: formattedEndDate,
                duration: duration,
                priceAdult: Number(priceAdult),
                priceChild: Number(priceChild),
                singleStayExtra: Number(singleStayExtra),
                priceVisa: Number(priceVisa),
                priceGuide: Number(priceGuide),
                maxSeats: Number(maxSeats),
                itinerary: itinerary,
                isRecommend: isRecommend,
                isActive: isActive,
                seatStatus: seatStatusUpdate,
                images: {
                    create: cleanedImages.map((image) => ({
                        public_id: image.public_id,
                        asset_id: image.asset_id,
                        url: image.url,
                        secure_url: image.secure_url
                    }))
                },
                // ใช้ upsert แทน create เพื่อรองรับกรณีที่มีไฟล์เดิมอยู่แล้ว Prisma ไม่สามารถ create ซ้ำในความสัมพันธ์แบบ one-to-one ได้
                tourPDF: {
                    upsert: {
                        update: {
                            asset_id: tourPDF.asset_id,
                            public_id: tourPDF.public_id,
                            url: tourPDF.url,
                            secure_url: tourPDF.secure_url
                        },
                        create: {
                            asset_id: tourPDF.asset_id,
                            public_id: tourPDF.public_id,
                            url: tourPDF.url,
                            secure_url: tourPDF.secure_url
                        }
                    }
                }
            }
        })
        res.status(200).json(tourPackage)

    } catch (err) {
        console.log(err)
        res.status(500).json({ message: 'Server Error' })
    }
}

exports.remove = async (req, res) => { 
    try {

        const { id } = req.params // ต้องส่ง url path และ id มาลบ

        if (!id) {
            return res.status(400).json({ message: 'ID is required' });
        }

        // step 1 เอา id ที่ส่งมา ค้นหาสินค้า เพราะต้อง include ตัว images ด้วยว่า มันมี่กี่รูปใน id นี้
        const tourpackage = await prisma.tourPackage.findFirst({
            where: { id: Number(id) }, // หา ID
            include: {
                images: true,
                tourPDF: true // เข้าถึงข้อมูล PDF
            }
        })

        if (!tourpackage) {
            return res.status(404).json({ message: 'Tourpackage not found!' });
        }
        console.log(tourpackage)

        // step 2 Promise ลบรูปภาพใน cloud แบบรอฉันด้วย EP11. 20.00
        const deletedImage = tourpackage.images.map((image) =>
            new Promise((resolve, reject) => { // เอาไว้ลบจาก cloud
                cloudinary.uploader.destroy(image.public_id, (error, result) => {
                    if (error) {
                        reject(error)
                    } else {
                        resolve(result)
                    }
                })

            })
        )

        await Promise.all(deletedImage)

        const publicId = tourpackage.tourPDF?.public_id;
        if (!publicId) {
            throw new Error('TourPackage is expected to have a PDF but none was found.');
        }

        // NOTE: ชื่อfolder ต้องตรงกับใน cloud เช่น pdfs/ ต้องใช้ pdfs/${publicId}
        await cloudinary.uploader.destroy(`findtrip2025/pdf/${publicId}`, {
            resource_type: 'raw', // ต้องระบุว่าเป็นไฟล์ raw ไม่ใช่ image
        });

        // ลบสินค้า
        await prisma.tourPackage.delete({ // เราจะลบอะไรก็ส่ง id มา
            where: {
                id: Number(id)
            }
        })
        res.status(200).json('Remove Tourpackage') // ส่งข้อมูลหมวดหมู่ที่เพิ่งสร้างกลับไปยัง client
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: 'Server Error' })
    }

}

// public/user
exports.getRecommend = async (req, res) => {
    try {

        const deadline = new Date() // 1. สร้างเงื่อนไขเวลา เอาเวลาปัจจุบัน + 3 วัน
        deadline.setDate(deadline.getDate() + 3)

        // รองรับ pagination แบบเลือกได้ (เพื่อไม่ให้ Home ที่เรียกแบบเดิมพัง)
        const page = parseInt(req.query.page, 10)
        const limit = parseInt(req.query.limit, 10)
        const hasPagination = Number.isFinite(page) && Number.isFinite(limit) && page > 0 && limit > 0

        const whereCondition = {
            isActive: true,
            isRecommend: true,
            startDate: { gte: deadline },
            seatStatus: { notIn: ['FULL', 'CLOSED'] },
        }

        const selectCondition = {
            id: true,
            title: true,
            tourCode: true,
            country: {
                select: { name: true }
            },
            startDate: true,
            endDate: true,
            airline: true,
            priceAdult: true,
            images: {
                select: { url: true },
                orderBy: { createdDate: 'asc' }
            },
        }

        if (hasPagination) {
            const skip = (page - 1) * limit

            const [tours, totalCount] = await Promise.all([
                prisma.tourPackage.findMany({
                    where: whereCondition,
                    select: selectCondition,
                    orderBy: {
                        createdDate: 'desc'
                    },
                    skip,
                    take: limit,
                }),
                prisma.tourPackage.count({
                    where: whereCondition
                })
            ])

            return res.status(200).json({
                data: tours,
                currentPage: page,
                totalPage: Math.ceil(totalCount / limit),
                totalCount
            })
        }

        const tourRecommend = await prisma.tourPackage.findMany({
            where: whereCondition,
            select: selectCondition,
            orderBy: {
                createdDate: 'desc'
            },
            take: 9,
        })

        res.status(200).json(tourRecommend)
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: 'Server Error' })
    }
}

exports.getAllTours = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1
        const limit = parseInt(req.query.limit) || 10
        const skip = (page - 1) * limit

        const deadline = new Date()     // 1. สร้างเงื่อนไขเดดไลน์ 3 วัน
        deadline.setDate(deadline.getDate() + 3)

        const whereCondition = { // 2. สร้างตัวแปร where สำหรับ User โดยเฉพาะ
            isActive: true,
            startDate: { gt: deadline }, // 3. กรองทัวร์ที่มีวันเริ่มต้นเดินทางมากกว่าเดดไลน์
            seatStatus: { // กรองเพิ่ม ไม่เอาทัวร์ที่เต็มหรือปิดการขายแล้วออกจากรายการ List
                notIn: ['FULL', 'CLOSED']
            }
        };

        const [allTours, totalCount] = await Promise.all([
            prisma.tourPackage.findMany({
                where: whereCondition,
                select: {
                    id: true,
                    title: true,
                    tourCode: true,
                    country: {
                        select: { name: true }
                    },
                    startDate: true,
                    endDate: true,
                    airline: true,
                    priceAdult: true,
                    seatStatus: true,
                    images: {
                        select: { url: true },
                        orderBy: { id: 'asc' },
                    },
                },
                orderBy: {
                    createdDate: 'desc'
                },
                skip,
                take: limit,
            }),
            prisma.tourPackage.count({
                where: whereCondition // ต้องใช้ where เดียวกันเพื่อให้เลข totalCount ถูกต้อง
            })
        ])
        res.status(200).json({
            data: allTours,
            currentPage: page,
            totalPage: Math.ceil(totalCount / limit),
            totalCount,
            message: 'ดึงข้อมูลรายการทัวร์ทั้งหมดสำเร็จ'
        })
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: 'Server Error' })
    }
}

exports.getTourDetail = async (req, res) => {
    try {
        const { id } = req.params

        const tourPackage = await prisma.tourPackage.findFirst({
            where: {
                id: Number(id),
                isActive: true // User ควรจะดูได้เฉพาะทัวร์ที่ยังเปิดใช้งานอยู่เท่านั้น
            },
            include: { // ดึงทุกฟิลด์ และดึงความสัมพันธ์แบบ relation 
                country: {
                    select: { name: true },
                },
                images: true,
                tourPDF: true,
            }
        })

        if (!tourPackage) { // ถ้าไม่เจอทัวร์ หรือทัวร์โดนลบ/ปิดไปแล้ว
            return res.status(404).json({ message: 'ไม่พบข้อมูลทัวร์ที่ท่านต้องการ' })
        }

        // 2. คำนวณส่วนต่างวัน (Logic 3 วันก่อนเดินทาง)
        const today = new Date()
        today.setHours(0, 0, 0, 0)

        const startDateForCompare = new Date(tourPackage.startDate)
        startDateForCompare.setHours(0, 0, 0, 0)

        const timeDiff = startDateForCompare.getTime() - today.getTime()
        const daysDiff = Math.floor(timeDiff / (1000 * 3600 * 24))

        let finalStatus = tourPackage.seatStatus  // กำหนดสถานะสุดท้ายเพื่อส่งให้หน้าบ้าน

        // ถ้าเหลือน้อยกว่า 3 วัน ให้บังคับเป็น CLOSED ทันที
        if (daysDiff < 3 && finalStatus !== 'CLOSED') {
            finalStatus = 'CLOSED'
        }

        res.status(200).json({
            data: {
                ...tourPackage,
                seatStatus: finalStatus,
                daysUntilDeparture: daysDiff,
                remainingSeats: tourPackage.maxSeats - tourPackage.sold
            },
            message: 'ดึงข้อมูลรายละเอียดทัวร์สำเร็จ'
        })
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: 'Server Error' })
    }
}

// exports.getListby = async (req, res) => { // 
//     try {

//         const { sort, order, limit } = req.body สิ่งที่ต้องส่งมา 3 อย่าง คุณอยากรู้อะไร ราคา จากน้อยไปมาก 

//         const tourPackage = await prisma.tourPackage.findMany({
//             take: limit,
//             orderBy: { [sort]: order },
//             include: { category: true }
//         })
//         res.status(200).json(tourPackage) 
//     } catch (err) {
//         console.log(err)
//         res.status(500).json({ message: 'Server Error' })
//     }
// }

exports.handleQuery = async (req, res) => {
    try {
        const { search } = req.query
        const page = parseInt(req.query.page) || 1
        const limit = parseInt(req.query.limit) || 10
        const skip = (page - 1) * limit // คำนวนว่าข้ามไปกี่ record

        const where = {}

        where.isActive = true

        if (search) {
            where.title = {
                contains: search,
            }
        }
        const [tours, totalCount] = await Promise.all([
            prisma.tourPackage.findMany({
                where: where, // ค้นหา ด้วยเงื่อนไข 
                include: { // จำเป็น กรณีที่ต้องการข้อมูลจากตารางที่มีความสัมพันธ์กัน 
                    category: true,
                    country: true,
                    images: true
                },
                orderBy: {
                    createdDate: 'desc'
                },
                skip: skip,
                take: limit,
            }),
            prisma.tourPackage.count({
                where: where,
            })
        ])
        return res.status(200).json({
            data: tours,
            currentPage: page,
            totalPage: Math.ceil(totalCount / limit),
            totalCount
        })
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: 'Server Error' })
    }
}

exports.handleTourCode = async (req, res, query) => {
    try {
        const tourPackage = await prisma.tourPackage.findUnique({
            where: {
                tourCode: {
                    contains: query
                }
            },
            include: {
                category: true,
                country: true,
                images: true
            }
        })
        res.status(200).json(tourPackage)
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: 'Server Error' })
    }
}

exports.searchFilters = async (req, res) => {
    try {

        const { category, country, priceAdult, page = 1, limit = 10 } = req.body
        const skip = (page - 1) * limit // ตัวคำนวน skip pagination ว่าจะต้อง skip ไปกี่ตัว

        const filters = { // สร้างตัวแปรมารับเงื่อนไขในการค้นหา
            isActive: true
        }

        if (category) {
            filters.categoryId = Number(category); // ถ้าใช้ ID
            // หรือจะใช้ relation เช่น filters.category = { name: { equals: category } };
        }

        if (country) {
            filters.countryId = Number(country);
        }

        if (priceAdult) {
            if (priceAdult.min != null) {
                filters.priceAdult = { ...filters.priceAdult, gte: priceAdult.min }
            }

            if (priceAdult.max != null) {
                filters.priceAdult = { ...filters.priceAdult, lte: priceAdult.max }
            }
        }

        const [tours, totalCount] = await Promise.all([
            prisma.tourPackage.findMany({
                where: filters,
                include: {
                    category: true,
                    country: true,
                    images: true
                },
                orderBy: {
                    createdDate: 'desc'
                },
                skip,
                take: limit,
            }),
            prisma.tourPackage.count({
                where: filters
            })
        ])
        res.status(200).json({
            data: tours,
            currentPage: page,
            totalPage: Math.ceil(totalCount / limit),
            totalCount
        });
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: 'Server Error' })
    }
}

exports.createImages = async (req, res) => {
    try {
        const result = await cloudinary.uploader.upload(req.body.image, {
            public_id: `findtrip-${Date.now()}`, // ห้ามซ้ำ
            resource_type: 'auto',
            folder: 'findtrip2025'
        })
        res.status(201).json(result)
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: 'Server Error' })
    }
}

exports.removeImages = async (req, res) => {
    try {
        const { public_id } = req.body;
        // console.log(public_id)
        cloudinary.uploader.destroy(public_id, (result) => {
            res.status(200).json({ message: 'Removed Image' })
        })

    } catch (err) {
        console.log(err)
        res.status(500).json({ message: 'Server Error' })
    }
}

exports.createPDF = async (req, res) => {
    try {
        // แปลง buffer เป็น base64 แล้วส่งต่อไป Cloudinary
        const fileStr = `data:application/pdf;base64,${req.file.buffer.toString('base64')}`
        const result = await cloudinary.uploader.upload(fileStr, {
            public_id: `findtripPDF-${Date.now()}.pdf`, // ห้ามซ้ำ
            resource_type: 'raw',
            folder: 'findtrip2025/pdf'
        })
        res.status(201).json(result)
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: 'Server Error' })
    }
}
//  public/user ดูจำนวนแพ็คเกจที่เหลือ
exports.getPackageAvailable = async (req, res) => {
    try {
        const { id } = req.params;

        const tourPackage = await prisma.tourPackage.findUnique({
            where: { id: parseInt(id) },
            select: {
                id: true,
                title: true,
                priceAdult: true,
                priceChild: true,
                quantity: true,
                sold: true,
                startDate: true,
                endDate: true
            }
        });

        if (!tourPackage) {
            return res.status(404).json({ message: 'Tour package not found' });
        }

        const available = tourPackage.quantity - tourPackage.sold;

        res.json({
            tourPackageId: tourPackage.id,
            title: tourPackage.title,
            priceAdult: tourPackage.priceAdult,
            priceChild: tourPackage.priceChild,
            quantity: tourPackage.quantity,
            sold: tourPackage.sold,
            available,
            startDate: tourPackage.startDate,
            endDate: tourPackage.endDate
        });

    } catch (err) {
        console.error('Error checking availability:', err);
        res.status(500).json({ message: 'Server error' });
    }
}
