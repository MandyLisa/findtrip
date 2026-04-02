const { BookingStatus } = require('@prisma/client')
const prisma = require('../config/prisma')
const { sendBookingConfirmationEmail } = require('../utils/email')

// 1. User ดูการจองของตัวเองทั้งหมด
// GET /api/user/bookings → ดึงข้อมูลการจองทั้งหมด
exports.getUserBookings = async (req, res) => {
    try {
        const id = req.user.id
        if (!id) return res.status(401).json({ message: 'Unauthorized' }) // ตรวจสอบว่ามีข้อมูลผู้ใช้ใน req.user และมี id หรือไม่ กัน middleware ไม่ทำงาน
        const page = parseInt(req.query.page) || 1
        const limit = parseInt(req.query.limit) || 10
        const skip = (page - 1) * limit

        const bookingStatus = req.query.bookingStatus

        const where = { userId: id }

        const allowed = new Set(['DRAFT', 'PENDING', 'PAID', 'FAILED', 'CANCELLED'])
        if (bookingStatus && bookingStatus != 'ALL') {
            if (!allowed.has(bookingStatus)) {
                return res.status(400).json({ message: 'Invalid booking status' })
            }
            where.bookingStatus = bookingStatus
        }

        const [booking, total] = await Promise.all([
            prisma.booking.findMany({
                where,
                include: {
                    tourPackage: true,
                    Payment: true,
                },
                skip,
                take: limit,
                orderBy: { updatedDate: "desc" },
            }),
            prisma.booking.count({ where }),
        ])

        res.status(200).json({
            booking: booking,
            total: total,
            currentPage: page,
            totalPage: Math.ceil(total / limit)
        })
    } catch (error) { // บล็อกแคช จะทำงานเมื่อ มีข้อผิดพลาดในบล็อก try 
        console.error('Error fetching booking', error)
        res.status(500).json({ message: 'Error fetching booking' }) // ส่งการตอบกลับในรูปแบบ JSON ด้วยข้อความที่กำหนด และ err รายละเอียดของข้อผิดพลาด
    }
}

// 2. User ดูรายละเอียดการจองจาก ID
// GET /api/user/booking/:id → ดูรายละเอียดการจองจาก id
exports.getBookingById = async (req, res) => {
    try {
        const { id } = req.params
        const isUser = req.user.role === 'USER'

        const booking = await prisma.booking.findUnique({
            where: {
                id: Number(id)
            },
            include: {
                tourPackage: {
                    include: { // เพิ่ม include เพื่อดึง tourPDF เพิ่ม (nested ความสัมพันธ์ที่ซ้อนอยู่ภายใน)
                        tourPDF: true // ชื่อ field ที่สัมพันธ์กันใน model TourPackage ของคุณ
                    }
                },
                Payment: true,
                user: true
            }
        })

        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' })
        }
        if (isUser && booking.userId !== req.user.id) {
            return res.status(403).json({ message: 'Access denied' })
        }

        res.status(200).json({
            ok: true,
            booking: booking
        })
    } catch (error) {
        console.error('Error get booking by Id: ', error)
        res.status(500).json({ message: 'Error fetching booking details' })
    }
}

// 3. User สร้างการจองใหม่
// POST /api/user/booking → สร้างการจองใหม่
exports.createBooking = async (req, res) => {
    try {
        const { tourPackageId, adultCount, childCount, singleStayCount } = req.body

        // แปลงให้เป็นจำนวนเต็ม
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
        await sendBookingConfirmationEmail(null, newBooking.id)

        res.status(201).json({
            message: 'Booking created successfully',
            booking: newBooking
        })
    } catch (error) {
        console.error('Error creating booking: ', error)
        res.status(500).json({ message: 'Booking Server Error' })
    }
}

// 4. User ยกเลิกการจอง DELETE /api/user/booking/:id → ยกเลิกการจอง
exports.cancelBooking = async (req, res) => {
    try {
        const { id } = req.params
        // 1. ตรวจสอบว่า Booking มีอยู่จริงและเป็นของ User ที่ถูกต้อง
        const existingBooking = await prisma.booking.findFirst({
            where: {
                id: Number(id),
                userId: req.user.id // ตรวจสอบ userId เพื่อให้แน่ใจว่าเป็นของ user ที่ login อยู่
            }
        })

        if (!existingBooking) {
            return res.status(404).json({ message: 'Booking not found' })
        }

        // 2. อัปเดตสถานะ Booking เป็น CANCELLED
        const updateBooking = await prisma.booking.update({
            where: {
                id: Number(id)
            },
            data: {
                bookingStatus: 'CANCELLED'
            }
        })

        // 3. อัปเดตสถานะ Payment เป็น CANCELLED (ถ้ามี)
        let updatedPayment = null // กำหนดค่าเริ่มต้นเป็น null
        const existingPayment = await prisma.payment.findUnique({
            where: {
                bookingId: Number(id)
            }
        })

        // ถ้ามี record อยู่ ให้อัปเดตสถานะ Payment เป็น CANCELLED
        if (existingPayment) {
            // console.log('เข้า updatesPayment ไหม ======== ')
            updatedPayment = await prisma.payment.update({
                where: {
                    bookingId: Number(id)
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

        const booking = await prisma.booking.findUnique({
            where: {
                id: Number(id)
            },
            include: {
                tourPackage: {
                    include: { // เพิ่ม include เพื่อดึง tourPDF เพิ่ม (nested ความสัมพันธ์ที่ซ้อนอยู่ภายใน)
                        tourPDF: true // ชื่อ field ที่สัมพันธ์กันใน model TourPackage ของคุณ
                    }
                },
                Payment: true
            }
        })

        res.status(200).json({
            ok: true,
            message: 'ยกเลิกการจองเรียบร้อยแล้ว',
            booking: booking,
        })
    } catch (err) {
        console.error('Error cancelling booking', err)
        res.status(500).json({ message: 'Error cancelling booking' })
    }
}

// 5. Admin ดูการจองทั้งหมด
exports.listBookings = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1
        const limit = parseInt(req.query.limit) || 10
        const skip = (page - 1) * limit

        const { id, userEmail, name, bookingStatus } = req.query

        const where = {}

        if (id) {
            where.id = Number(id)
        }

        if (bookingStatus) {
            where.bookingStatus = bookingStatus.toUpperCase() // แปลงเป็นตัวพิมพ์ใหญ่เพื่อให้ตรงกับ enum
        }

        if (userEmail || name) {
            where.user = {} // เตรียม object ก่อน
            if (userEmail) {
                where.user.email = {
                    contains: userEmail,
                }
            }

            if (name) {
                where.user.name = {
                    contains: name,
                }
            }
        }

        const [booking, totalCount] = await Promise.all([
            prisma.booking.findMany({
                skip: skip,
                take: limit,
                where: where,
                orderBy: {
                    createdDate: 'desc'
                },
                include: {
                    user: true,
                    tourPackage: true,
                    Payment: true
                }
            }),
            prisma.booking.count({
                where: where,
            })
        ])

        res.status(200).json({
            ok: true,
            message: 'ดึงข้อมูลการจองสำเร็จ',
            data: booking,
            currentPage: page,
            totalPage: Math.ceil(totalCount / limit),
            totalCount,
        })

    } catch (err) {
        console.error('Error fetching all booking', err)
        res.status(500).json({ message: 'Error fetching all booking' })
    }
}

// Drop down Booking Status
exports.listBookingStatus = async (req, res) => {

    try {

        const allStatusList = Object.values(BookingStatus) // แปลง enum เป็น array ของ string

        res.status(200).json({
            data: allStatusList,
            totalCount: allStatusList.length,
        })

    } catch (err) {
        console.error('Error in listBookingStatus', err)
        res.status(500).json({ message: 'Server Error' })
    }
}

// 6. Admin อัปเดตสถานะการจอง
exports.updateBookingStatus = async (req, res) => {
    try {
        const { id } = req.params
        const { bookingStatus } = req.body

        // ตรวจสอบสิทธิ์ Admin
        if (!['ADMIN', 'SUPER_ADMIN'].includes(req.user?.role)) {
            return res.status(403).json({
                message: 'Permission denied'
            })
        }

        // สร้าง object สำหรับ update แบบ dynamic
        const updateData = {
            bookingStatus: bookingStatus
        }

        // audit ตอนอนุมัติ
        if (['PAID', 'FAILED'].includes(bookingStatus)) {
            if (!req.user?.name) {
                return res.status(400).json({
                    message: 'User name is required'
                })
            }
            updateData.approvedBy = req.user.name
            updateData.approvedAt = new Date()
        }

        const updatedBooking = await prisma.booking.update({ // อัปเดตสถานะการจองที่ ตาราง booking
            where: { id: Number(id) },
            data: updateData
        })

        // ตรวจสอบว่ามี payment ที่ผูกกับ bookingId นี้หรือไม่
        const payment = await prisma.payment.findUnique({
            where: { bookingId: Number(id) }
        })

        // ถ้ามี payment ค่อย update
        if (payment) {
            if (bookingStatus === 'CANCELLED') {
                await prisma.payment.update({
                    where: { bookingId: Number(id) },
                    data: { paymentStatus: 'CANCELLED' }
                })
                await prisma.tourPackage.update({
                    where: {
                        id: updatedBooking.tourPackageId,
                    },
                    data: {
                        sold: {
                            decrement: updatedBooking.adultCount
                        }
                    }
                })
            } else if (bookingStatus === 'FAILED') {
                await prisma.payment.update({
                    where: { bookingId: Number(id) },
                    data: { paymentStatus: 'FAILED' }
                })
                await prisma.tourPackage.update({
                    where: {
                        id: updatedBooking.tourPackageId,
                    },
                    data: {
                        sold: {
                            decrement: updatedBooking.adultCount
                        }
                    }
                })
            } else if (bookingStatus === 'PAID') {
                await prisma.payment.update({
                    where: { bookingId: Number(id) },
                    data: { paymentStatus: 'PAID' }
                })
            }
        }

        const booking = await prisma.booking.findUnique({
            where: {
                id: Number(id)
            },
            include: {
                tourPackage: true,
                Payment: true,
                user: true
            }
        })

        res.status(200).json({
            ok: true,
            booking: booking
        })

    } catch (err) {
        console.error('Error updating booking status', err)
        res.status(500).json({ message: 'Error updating booking status' })
    }
}
