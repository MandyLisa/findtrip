import { jwtDecode } from 'jwt-decode' // import library สำหรับ ถอดรหัส JWT

export const isTokenExpired = (token) => { // ฟังก์ชันเช็คว่า token หมดอายุหรือยัง
    try {
        const decoded = jwtDecode(token) // ถอดรหัส token เพื่อดูข้อมูลภายใน เช่น exp (เวลาหมดอายุ)
        // console.log(jwtDecode(token))
        // console.log(new Date(decoded.exp * 1000))


        if (!decoded?.exp) return false // ถ้าไม่มี exp ใน token ถือว่าไม่หมดอายุ
        // console.log('exp:', decoded.exp)

        const now = Math.floor(Date.now() / 1000) // เวลาปัจจุบัน แปลงเป็น “วินาที” เพราะ exp อยู่ในหน่วยวินาที
        // console.log('now:', Math.floor(Date.now() / 1000))

        return decoded.exp <= now // ถ้าเวลาหมดอายุ <= เวลาปัจจุบัน → หมดอายุแล้ว → return true

    } catch (error) {
    console.error('Error decoding token:', error) // ถ้าเกิด error ในการถอดรหัส  ก็ถือว่า token หมดอายุ
    return true
}
}
