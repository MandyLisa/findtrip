import axios from 'axios'
import useAuthStore from '@/store/authStore'

// ตั้ง baseURL 
axios.defaults.baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

// ขาไป ตัวดักจับคำขอ แนบ token ทุก request
axios.interceptors.request.use(
    (config) => {
        const token = useAuthStore.getState().token

        if (token && !config.headers.Authorization) { // ถ้ามี token แล้ว และ header ยังไม่มี Authorization แปลว่า ให้ interceptor แปะ token ลงไปที่ header ทุกครั้งที่มีการเรียก API
            config.headers.Authorization = `Bearer ${token}`
        }

        return config
    },
    (error) => Promise.reject(error)
)

//  ขากลับ ดักจับ error 401 | ป้องกันไม่ให้ User ค้างอยู่ในหน้าที่ต้องใช้สิทธิ์ ทั้งที่สิทธิ์หมดอายุไปแล้ว
axios.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401 && window.location.pathname !== '/login') { // ถ้าเจอ error 401 แปลว่า token หมดอายุหรือไม่ถูกต้อง และตอนนี้ไม่ได้อยู่ที่หน้า login อยู่แล้ว (เพื่อป้องกัน loop เด้งไป login ซ้ำๆ)
            const { actionLogout } = useAuthStore.getState() // สั่งหน้าบ้าน Logout ทันที
            actionLogout()
            window.location.href = '/login' // ดีด User กลับไปหน้า Login เพื่อให้ล็อกอินใหม่
        }

        return Promise.reject(error)
    }
)

// ไฟล์นี้ทำงานอยู่ "นอก React Component" มันเลยเรียกใช้ Hook อย่าง useNavigate ของ React ไม่ได้ 
// เลยต้องใช้คำสั่งมาตรฐานของเบราว์เซอร์อย่าง window.location แทน 
