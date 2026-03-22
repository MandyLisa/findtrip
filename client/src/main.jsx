import { StrictMode } from 'react' // development tool ช่วยตรวจสอบโค้ดระหว่างการพัฒนา
import { createRoot } from 'react-dom/client' // เพื่อสร้าง root container ของ React app ที่จะถูกผูกเข้ากับ DOM จริงของ Browser
import './index.css' // นำเข้าไฟล์ CSS มาใช้งานทั้งโปรเจกต์
import App from './App.jsx' // นำเข้า App จากไฟล์ = component หลักที่เป็นจุดเริ่มต้นของ UI
import '@/utils/axiosInstance' // นำเข้าไฟล์ที่ตั้งค่า axios instance เพื่อให้ทุกที่ในโปรเจกต์ใช้การตั้งค่านี้ได้เลย โดยไม่ต้อง import ซ้ำทุกไฟล์

//  entry point ของ React app ที่จะถูก render ลงใน DOM
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

// สร้าง root ของ React app และ render component <App /> ลงใน DOM ที่มี id="root" โดยใช้ StrictMode ช่วยตรวจสอบโค้ดในระหว่างการพัฒนา
// createRoot(...) → สร้างพื้นที่ทำงานของ React ผูกกับ DOM
// Dom คือ โครงสร้างหน้าเว็บ ที่ browser สร้างขึ้น จากการโหลดไฟล์ HTML เพื่อให้ dev จัดการโค้ดผ่าน JS 
// document.getElementById('root') → คำสั่ง JS เพื่อเข้าถึง DOM element ที่มี id="root"
// .render(...) → สั่งให้ React render component ที่กำหนด ก็คือ <App /> ลงใน DOM ที่เราเข้าถึงมาได้






