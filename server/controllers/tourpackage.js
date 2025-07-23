const prisma = require('../config/prisma')
const cloudinary = require('../utils/cloudinary')


// tourpackage/admin
exports.create = async (req, res) => {
    try {
        const { // ยังขาด isRecommend, isActive,  images, tourPDF 
            title,
            tourCode,
            categoryId,
            countryId,
            airline,
            starRating,
            startDate,
            endDate,
            duration,
            priceAdult,
            priceChild,
            singleStayExtra,
            priceVisa,
            priceGuide,
            maxSeats,
            itinerary,
            isRecommend,
            isActive,
            images,
            tourPDF
        } = req.body
        // ดึงค่าต่างๆจาก req.body ที่มาจาก Frontend เพื่อใช้สร้างข้อมูลใหม่ใน TourPackage

        // 1. Validation
        const requiredFields = [
            title, tourCode, categoryId, countryId,
            airline, starRating, startDate, endDate,
            duration, priceAdult, priceChild, singleStayExtra,
            priceVisa, priceGuide, maxSeats, itinerary,
            isRecommend, isActive, images, tourPDF
        ];

        if (requiredFields.some(field => field == null)) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        // 2.  แปลงวันที่ให้เป็น DateTime object
        const formattedStartDate = new Date(startDate); // สร้าง Date object จาก string ที่รับเข้ามา
        const formattedEndDate = new Date(endDate);

        // 3. เช็ค validate 
        const existing = await prisma.tourPackage.findUnique({ where: { tourCode } });
        if (existing) {
            return res.status(400).json({ error: 'รหัสทัวร์นี้มีอยู่แล้วในระบบ โปรดติดต่อ Supervisor' });
        }

        // if (starRating < 1 || starRating > 5) {
        //     return res.status(400).json({ error: 'ระดับดาวต้องอยู่ระหว่าง 1 ถึง 5 ดาว' });
        // }

        //  if (Number(maxSeats) > 99) {
        //     return res.status(400).json({ error: 'จำนวนที่นั่งสูงสุดต้องไม่เกินเลข 2 หลัก' });
        // }

        // 4. create ลงฐานข้อมูล
        const newTourPackage = await prisma.tourPackage.create({
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
        res.status(201).json(newTourPackage) // ส่งข้อมูลหมวดหมู่ที่เพิ่งสร้างกลับไปยัง Frontend โดยส่งข้อความ "Hello New Tourpackage" เพื่อยืนยันว่าบันทึกสำเร็จ
    } catch (err) {
        console.error("Create TourPackage Error:", err)
        res.status(500).json({ message: 'Server Error' })
    }
}

exports.list = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1
        const limit = parseInt(req.query.limit) || 10  // ถ้าไม่มีหรือไม่ถูกต้อง → fallback เป็น 10 ใช้เพื่อกำหนดจำนวนข้อมูลที่จะแสดงต่อหน้า
        const skip = (page - 1) * limit

        const { id, tourCode, categoryId, countryId, isRecommend, isActive } = req.query
        console.log('ดู categoryId ======== id ', categoryId)

        // สร้างเงื่อนไข where แบบ dynamic
        const where = {}

        if (id) {
            where.id = Number(id)
        }

        if (tourCode) {
            where.tourCode = {
                contains: tourCode,
            }
        }

        if (categoryId) {
            where.categoryId = Number(categoryId)
        }

        if (countryId) {
            where.countryId = Number(countryId)
        }

        if (isRecommend !== undefined && isRecommend !== '') {
            where.isRecommend = isRecommend === 'true'
        }

        if (isActive !== undefined && isActive !== '') {
            where.isActive = isActive === 'true'
        }

        const [allTours, totalCount] = await Promise.all([
            prisma.tourPackage.findMany({
                select: { // เลือกฟิลด์ที่อยากให้แสดง
                    id: true,
                    title: true,
                    tourCode: true,
                    priceAdult: true,
                    priceChild: true,
                    airline: true,
                    startDate: true,
                    endDate: true,
                    maxSeats: true,
                    sold: true,
                    isRecommend: true,
                    isActive: true,
                    category: {
                        select: {
                            id: true,
                            name: true
                        }
                    },
                    country: {
                        select: {
                            id: true,
                            name: true
                        }
                    }
                },
                where: where,
                orderBy: {
                    createdDate: 'desc'
                },
                skip: skip,
                take: limit
            }),
            prisma.tourPackage.count({
                where: where,
            })
        ])
        res.status(200).json({
            data: allTours,
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
            where: {
                id: Number(id)
            },
            include: { // ดึงทุกฟิลด์ และดึงความสัมพันธ์แบบ relation 
                images: true,
                tourPDF: true,
            }
        })
        res.status(200).json(tourPackage)
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
        const formattedStartDate = new Date(startDate);
        const formattedEndDate = new Date(endDate);

        // ลบรูปเก่า เพื่อ insert รูปใหม่เข้าไปใน database ไม่ได้ลบใน cloud
        await prisma.image.deleteMany({
            where: {
                tourPackageId: Number(req.params.id)
            }
        })

        // กรอง public_id ที่ไม่มี หรือ undefined ออก
        const cleanedImages = (images || []).map((item) => {
            const { public_id, ...rest } = item;
            return public_id ? { public_id, ...rest } : rest;
        });

        console.log(tourPDF.pdf_url);

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

exports.remove = async (req, res) => { // EP.11 12.00 ลบรูปใน table และ ใน cloudinary
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
        const tourRecommend = await prisma.tourPackage.findMany({
            where: {
                isActive: true,
                isRecommend: true
            },
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
                images: {
                    select: { url: true },
                    orderBy: { createdDate: 'asc' }
                },
            },
            orderBy: {
                createdDate: "desc"
            },
            take: 9,
        })
        res.status(200).json(tourRecommend);
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

        const [allTours, totalCount] = await Promise.all([
            prisma.tourPackage.findMany({
                where: { isActive: true },
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
                where: { isActive: true },
            })
        ])
        res.status(200).json({
            data: allTours,
            currentPage: page,
            totalPage: Math.ceil(totalCount / limit),
            totalCount,
        });
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: 'Server Error' })
    }
}

exports.getTourDeatail = async (req, res) => {
    try {
        const { id } = req.params
        const tourPackage = await prisma.tourPackage.findFirst({
            where: {
                id: Number(id)
            },
            include: { // ดึงทุกฟิลด์ และดึงความสัมพันธ์แบบ relation 
                country: {
                    select: { name: true },
                },
                images: true,
                tourPDF: true,
            }
        })
        res.status(200).json(tourPackage)
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: 'Server Error' })
    }
}

exports.getListby = async (req, res) => { // 
    try {

        const { sort, order, limit } = req.body // สิ่งที่ต้องส่งมา 3 อย่าง คุณอยากรู้อะไร ราคา จากน้อยไปมาก 

        const tourPackage = await prisma.tourPackage.findMany({
            take: limit,
            orderBy: { [sort]: order },
            include: { category: true }
        })
        res.status(200).json(tourPackage) // HTTP Status Code: ใช้ 200 สำหรับการค้นหาที่สำเร็จ (201 สำหรับการสร้างข้อมูลใหม่)
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: 'Server Error' })
    }
}
// โชว์ทัวร์ทั้งหมดเรียงตามราคาจากถูกสุด
// {
//   "sort": "priceAdult",
//   "order": "asc",
//   "limit": 10
// }

exports.handleQuery = async (req, res) => {
    try {
        const { search } = req.query
        const page = parseInt(req.query.page) || 1
        const limit = parseInt(req.query.limit) || 10
        const skip = (page - 1) * limit


        const [tours, totalCount] = await Promise.all([
            prisma.tourPackage.findMany({
                where: {
                    isActive: true,
                    title: {
                        contains: search
                    }
                },
                include: { // จำเป็น กรณีที่ต้องการข้อมูลจากตารางที่มีความสัมพันธ์กัน 
                    category: true,
                    country: true,
                    images: true
                },
                orderBy: {
                    createdDate: "desc"
                },
                skip,
                take: limit,
            }),
            prisma.tourPackage.count({
                where: { isActive: true },
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

//  ฟังก์ชันย่อยของ searchFilters
// const handlePrice = async (req, res, priceRange) => {
//     try {

//         const filters = {}

//         if (priceRange.min != null) {
//             filters.gte = priceRange.min
//         }

//         if (priceRange.max != null) {
//             filters.lte = priceRange.max
//         }

//         const tourPackage = await prisma.tourPackage.findMany({
//             where: {
//                 priceAdult: filters
//             },
//             include: {
//                 category: true,
//                 country: true,
//                 images: true
//             }
//         })
//         res.status(200).json(tourPackage)
//     } catch (err) {
//         console.log(err)
//         res.status(500).json({ message: 'Server Error' })
//     }
// }

// const handleCategory = async (req, res, categoryId) => {
//     try {
//         const tourPackage = await prisma.tourPackage.findMany({
//             where: {
//                 categoryId: {
//                     in: categoryId.map((id) => Number(id)) //loop ไปค้นหาใน category
//                 }
//             },
//             include: {
//                 category: true,
//                 country: true,
//                 images: true
//             }
//         })
//         res.status(200).json(tourPackage)
//     } catch (err) {
//         console.log(err)
//         res.status(500).json({ message: 'Server Error' })
//     }
// }

// const handleCountry = async (req, res, countryId) => {
//     try {
//         const tourPackage = await prisma.tourPackage.findMany({
//             where: {
//                 countryId: {
//                     in: countryId.map((id) => Number(id)) //loop ไปค้นหาใน country
//                 }
//             },
//             include: {
//                 category: true,
//                 country: true,
//                 images: true
//             }
//         })
//         res.status(200).json(tourPackage)
//     } catch (err) {
//         console.log(err)
//         res.status(500).json({ message: 'Server Error' })
//     }
// }

exports.searchFilters = async (req, res) => { // รวมการค้นหา controller หลัก ที่รวม logic สำหรับ เงื่อนไขการค้นหาnpm start
    try {
        const { category, country, priceAdult, page = 1, limit = 10 } = req.body
        const skip = (page - 1) * limit
        const filters = {
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
                    createdDate: "desc"
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

// ดึงจำนวนแพ็คเกตคงเหลือ
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
            return res.status(404).json({ message: "Tour package not found" });
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
        console.error("Error checking availability:", err);
        res.status(500).json({ message: "Server error" });
    }
};
