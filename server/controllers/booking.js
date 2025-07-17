const prisma = require('../config/prisma')
const { sendBookingConfirmationEmail } = require('../utils/email')

// 1. User ดูการจองของตัวเองทั้งหมด
// GET /api/user/bookings → ดึงข้อมูลการจองทั้งหมด
// กำหนด f.getUser..  ที่เราจะ exports เพื่อให้โมดูลอื่นเรียกใช้
// async: บ่งชี้ว่าฟังก์ชันนี้เป็น Asynchronous Function ซึ่งจะคืนค่าเป็น Promise และสามารถใช้ await เพื่อรอการทำงานของ Promise อื่นๆ ได้
// (req, res) => { ... }: Arrow Function ที่รับพารามิเตอร์สองตัว: req object ที่รับมาจากหน้าบ้าน | res object ใช้สำหรับส่งกลับไปยัง client
exports.getUserBookings = async (req, res) => {
    try {
        const userId = req.user.id
        // ดึงค่าจาก query params และแปลงให้เป็นตัวเลข
        const page = parseInt(req.query.page) || 1
        const limit = parseInt(req.query.limit) || 10
        const skip = (page - 1) * limit

        const bookingStatus = req.query.bookingStatus

        const where = { userId: req.user.id }
        if (bookingStatus && bookingStatus != 'ALL') {
            where.bookingStatus = bookingStatus
        }

        const bookings = await prisma.booking.findMany({
            where: where,
            include: { // คสพ. ที่ต้องการให้โชว์ข้อมูลเหล่านี้ออกมาด้วย
                tourPackage: true,
                Payment: true
            },
            skip: skip,
            take: limit,
            orderBy: {
                createdDate: 'desc'
            }
        })

        // นับจำนวนทั้งหมด (เพื่อใช้คำนวณหน้าทั้งหมด)
        const total = await prisma.booking.count({
            where: where
        })

        if (bookings.length === 0) { // ถ้าผู้ใช้ที่กำลังเข้าสู่ระบบอยู่ ไม่มีรายการจองใดๆ ให้ return ไปหาลค. และหยุดการทำงานของฟังก์ชัน
            return res.status(400).json({ ok: false, message: 'No Booking List' }) // ตอบกลับเป็นรูปแบบของ json ที่มี 2 คีย์ ok: false: บอกว่าการดำเนินการไม่สำเร็จ กับ ข้อความ
        }

        res.json({
            bookings,
            total,
            currentPage: page,
            totalPage: Math.ceil(total / limit)
        })
    } catch (error) { // บล็อกแคช จะทำงานเมื่อ มีข้อผิดพลาดในบล็อก try 
        console.log('ดู getUserBookings', error)
        res.status(500).json({ message: 'Error fetching bookings', error }) // ส่งการตอบกลับในรูปแบบ JSON ด้วยข้อความที่กำหนด และ err รายละเอียดของข้อผิดพลาด
    }
}

// 2. User ดูรายละเอียดการจองจาก ID
// GET /api/user/booking/:id → ดูรายละเอียดการจองจาก id
exports.getBookingById = async (req, res) => {
    try {
        const { id } = req.params;
        const booking = await prisma.booking.findUnique({
            where: {
                id: Number(id),
                userId: req.user.id
            },
            include: {
                tourPackage: {
                    include: { // เพิ่ม include เพื่อดึง tourPDF เพิ่ม (nested ความสัมพันธ์ที่ซ้อนอยู่ภายใน)
                        tourPDF: true // ชื่อ field ที่สัมพันธ์กันใน model TourPackage ของคุณ
                    }
                },
                Payment: true
            }
        });

        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' })
        }

        res.json({ ok: true, booking })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Error fetching booking details', error })
    }
}

// 3. User สร้างการจองใหม่
// POST /api/user/booking → สร้างการจองใหม่
exports.createBooking = async (req, res) => {
    try {
        const { tourPackageId, adultCount, childCount, singleStayCount } = req.body

        // แปลงให้เป็นจำนวนเต็มก่อน
        const parsedTourPackageId = parseInt(tourPackageId)
        if (isNaN(parsedTourPackageId)) {
            return res.status(400).json({ message: 'Invalid tourPackageId provided!' })
        }

        // ตรวจสอบว่าผู้ใช้นี้มีรายการจอง (DRAFT/PENDING) สำหรับทัวร์แพ็กเกจนี้อยู่แล้วหรือไม่
        const existingActiveBooking = await prisma.booking.findFirst({
            where: {
                userId: parseInt(req.user.id), // ใช้ userId จาก JWT (Authenticated user)
                tourPackageId: parsedTourPackageId,
                bookingStatus: {
                    in: ['DRAFT'] // ['DRAFT', 'PENDING_PAYMENT']
                }
            }
        })

        if (existingActiveBooking) { // หากพบการจองที่กำลังดำเนินอยู่
            return res.status(409).json({ // 409 Conflict: เพื่อบอกว่า Request ขัดแย้งกับสถานะปัจจุบัน
                message: 'You already have an active booking for this tourpackage. Please complete or cancel your existing booking',
                bookingId: existingActiveBooking.id // อาจส่ง ID การจองเดิมกลับไปให้ Client เพื่อ redirect
            })
        }

        // 1. ดึงข้อมูลแพ็กเกจทัวร์จาก DB
        const tourPackage = await prisma.tourPackage.findUnique({
            where: { id: parsedTourPackageId }
        })

        if (!tourPackage) {
            return res.status(404).json({ message: 'Tourpackage not found' })
        }

        // 2. ตรวจสอบจำนวนที่เหลือ 
        const remainingQuantity = parseInt(tourPackage.maxSeats) - parseInt(tourPackage.sold)

        if (adultCount > remainingQuantity) {
            return res.status(400).json({ message: 'Not enough tourpackages available' })
        }

        // ... (การคำนวณราคา - ตรวจสอบให้แน่ใจว่า adultCount, childCount, singleStayCount และราคาเป็นตัวเลข)
        const parsedAdultCount = parseInt(adultCount) || 0
        const parsedChildCount = parseInt(childCount) || 0
        const parsedSingleStayCount = parseInt(singleStayCount) || 0
        const priceAdult = parseFloat(tourPackage.priceAdult) || 0 // สมมติว่า priceAdult สามารถเป็นทศนิยมได้
        const priceChild = parseFloat(tourPackage.priceChild) || 0 // สมมติว่า priceChild สามารถเป็นทศนิยมได้
        const singleStayExtra = parseFloat(tourPackage.singleStayExtra) || 0 // สมมติว่า singleStayExtra สามารถเป็นทศนิยมได้

        // 3. คำนวณราคา (ยังรวมเด็กในราคาแต่ไม่นับ quota ที่นั่ง)
        const totalPrice = (parsedAdultCount * priceAdult) +
            (parsedChildCount * priceChild) +
            (parsedSingleStayCount * singleStayExtra)

        // 4. สร้าง booking ใหม่
        const newBooking = await prisma.booking.create({
            data: {
                userId: parseInt(req.user.id), // ได้มาจาก Authentication (เช่น JWT Token) ไม่ต้องรับ userId มาจาก client ซึ่งอาจถูกแก้ไขได้
                tourPackageId: parsedTourPackageId,
                adultCount: parsedAdultCount,
                childCount: parsedChildCount,
                singleStayCount: parsedSingleStayCount,
                totalPrice: totalPrice,
                bookingStatus: 'DRAFT'
            }
        })

        // 5. อัปเดตจำนวน sold (เฉพาะผู้ใหญ่ไม่รวมเด็ก)
        await prisma.tourPackage.update({
            where: { id: parsedTourPackageId },
            data: {
                sold: {
                    increment: parsedAdultCount
                }
            }
        })

        // 6. เรียกส่งอีเมลแจ้งเตือน 
        await sendBookingConfirmationEmail(req.user.email, newBooking.id)

        res.status(201).json({
            message: 'Booking created successfully',
            booking: newBooking
        })
    } catch (error) {
        console.log('Error creating booking: ', error)
        res.status(500).json({ message: 'Booking Server Error', error })
    }
}

// 4. User ยกเลิกการจอง
// DELETE /api/user/booking/:id → ยกเลิกการจอง
exports.cancelBooking = async (req, res) => {
    try {
        const { id } = req.params // id ที่ได้จาก req.params เป็น String อยู่แล้ว

        const numericBookingId = Number(id) // แปลงให้เป็น Number

        // 1. ตรวจสอบว่า Booking มีอยู่จริงและเป็นของ User ที่ถูกต้อง
        const existingBooking = await prisma.booking.findUnique({
            where: {
                id: numericBookingId,
                userId: req.user.id // ตรวจสอบ userId เพื่อให้แน่ใจว่าเป็นของ user ที่ login อยู่
            }
        })

        if (!existingBooking) {
            return res.status(404).json({ message: 'Booking not found' })
        }

        // 2. อัปเดตสถานะ Booking เป็น CANCELLED
        const updateBooking = await prisma.booking.update({
            where: {
                id: numericBookingId,
            },
            data: {
                bookingStatus: 'CANCELLED'
            }
        })

        // 3. อัปเดตสถานะ Payment เป็น CANCELLED (ถ้ามี)
        let updatedPayment = null // กำหนดค่าเริ่มต้นเป็น null
        const existingPayment = await prisma.payment.findUnique({
            where: {
                bookingId: numericBookingId
            }
        })

        // ถ้ามี record อยู่ ให้อัปเดตสถานะ Payment เป็น CANCELLED
        if (existingPayment) {
            updatedPayment = await prisma.payment.update({
                where: {
                    bookingId: numericBookingId,
                },
                data: {
                    paymentStatus: 'CANCELLED'
                }
            })
        }

        // 4. คืนจำนวนที่นั่งกลับไปในระบบ (เฉพาะ adultCount)
        await prisma.tourPackage.update({
            where: {
                id: existingBooking.tourPackageId
            },
            data: {
                sold: {
                    decrement: existingBooking.adultCount
                }
            }
        })

        const updatedTour = await prisma.tourPackage.findUnique({
            where: { id: existingBooking.tourPackageId }
        })

        res.json({
            message: 'Booking cancelled successfully',
            updateBooking,
            updatedPayment,
            updatedTour
        })

    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Error cancelling booking', error })
    }
}


// 5. Admin ดูการจองทั้งหมด
exports.listBookings = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1
        const limit = parseInt(req.query.limit) || 10
        const skip = (page - 1) * limit

        const [bookings, totalCount] = await Promise.all([
            prisma.booking.findMany({
                skip: skip,
                take: limit,
                orderBy: {
                    createdDate: 'desc' 
                },
                include: {
                    user: true,
                    tourPackage: true,
                    Payment: true
                }
            }),
            prisma.booking.count()
        ])

        res.status(200).json({ 
            data: bookings,
            currentPage: page,
            totalPage: Math.ceil(totalCount / limit),
            totalCount,
         })
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: 'Error fetching all bookings', err })
    }
}

// 6. Admin อัปเดตสถานะการจอง จาก 'Pending' เป็น 'Confirmed' หลังจากที่ลูกค้าชำระเงินเรียบร้อยแล้ว

exports.updateBookingStatus = async (req, res) => {
    try {
        const { id } = req.params; // ดึงหมายเลขการจองนั้นๆ ออกมา เพื่อนำไปใช้ค้นหารายการจองในฐานข้อมูล
        const { bookingStatus } = req.body;

        const updatedBooking = await prisma.booking.update({
            where: { id: Number(id) },
            data: { bookingStatus }
        });

        res.json({ ok: true, updatedBooking });
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: 'Error updating booking status', err });
    }
}
