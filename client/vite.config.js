import { defineConfig } from 'vite' // นำเข้าฟังก์ชันหลักของ Vite เพื่อใช้ในการกำหนดค่า
import react from '@vitejs/plugin-react' // นำเข้าปลั๊กอินสำหรับ React เพื่อให้ Vite รู้จักและทำงานกับไฟล์ .jsx 
import path from 'path' // จัดการกับ "ที่อยู่ของไฟล์" หรือ "path" ในระบบ

// https://vite.dev/config/
export default defineConfig({ 
  plugins: [react()], // เปิดใช้งานปลั๊กอิน React ที่นำเข้ามา เพื่อให้โค้ด React ทำงานได้ถูกต้อง
  resolve: { // การตั้งค่าที่ช่วยให้ Vite รู้จักกับที่อยู่ของไฟล์ต่างๆ ในโปรเจกต์ 
    alias: { // ตั้งค่า เอเลียส หรือ ชื่อย่อ โดยใช้ แทนที่อยู่ของโฟลเดอร์ src ที่ใช้คำสั่ง path.resolve()
      '@' : path.resolve(__dirname, './src'),
    },
  },
  server: { // ตั้งค่า "proxy" ซึ่งทำหน้าที่เหมือนตัวกลาง ส่งต่อ คำขอจากเว็บแอปพลิเคชันของเราไปหาเซิร์ฟเวอร์
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
