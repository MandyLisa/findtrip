import { toast } from 'sonner'

export const validateTourForm = (form) => {
    const requiredFields = [
        'title',
        'tourCode',
        'categoryId',
        'countryId',
        'airline',
        'starRating',
        'startDate',
        'endDate',
        'duration',
        'priceAdult',
        'priceChild',
        'singleStayExtra',
        'priceVisa',
        'priceGuide',
        'maxSeats',
        'itinerary',
    ]

    for (let field of requiredFields) {
        if (form[field] == null || form[field].toString().trim() === '') {
            toast.warning(`กรุณากรอกข้อมูล: ${field}`)
            return false
        }
    }

    if (form.starRating < 1 || form.starRating > 5) {
        toast.error('ระดับดาวต้องอยู่ระหว่าง 1 ถึง 5')
        return false
    }

    if (form.maxSeats > 99) {
        toast.error('จำนวนที่นั่งสูงสุดต้องไม่เกินเลข 2 หลัก')
        return false
    }

    if (new Date(form.endDate) < new Date(form.startDate)) {
        toast.warning('วันที่สิ้นสุดทัวร์ "ต้องมากกว่า" วันที่เริ่มต้น')
        return false
    }

    const priceFields = ['priceAdult', 'priceChild', 'singleStayExtra', 'priceGuide']
    for (let field of priceFields) {
        const value = Number(form[field])
        if (value <= 0) {
            toast.warning(`${field} ต้องมากกว่า 0 และไม่เป็นเลขติดลบ`)
            return false
        }

        if (value > 500000) {
            toast.warning(`โปรดตรวจสอบราคา ${field} อีกครั้ง`)
            return false
        }
    }

    // Validate file uploads
    if (!form.images || form.images.length === 0) {
        toast.warning('กรุณาอัปโหลดรูปภาพอย่างน้อย 1 รูป')
        return false
    }

    if (!form.tourPDF) {
        toast.warning('กรุณาอัปโหลดไฟล์ PDF')
        return false
    }

    // check tourCode RegEx Validation
    const tourCodePattern = /^[A-Z]{2}-[A-Z]{2}-\d{2}-\d{3}$/
    if (!tourCodePattern.test(form.tourCode)) {
        toast.warning('รหัสทัวร์ต้องอยู่ในรูปแบบ AS-JP-25-XXX (XXX = ตัวเลข 3 หลัก)')
        return false
    }
    return true
}