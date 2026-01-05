import { StrictMode } from 'react' // development tool ช่วยตรวจสอบโค้ดระหว่างการพัฒนา
import { createRoot } from 'react-dom/client' // เพื่อสร้าง root container ของ React app ที่จะถูกผูกเข้ากับ DOM จริงของ Browser
import './index.css' // นำเข้าไฟล์ CSS มาใช้งานทั้งโปรเจกต์
import App from './App.jsx' // นำเข้า App จากไฟล์ = component หลักที่เป็นจุดเริ่มต้นของ UI

// ไฟล์นี้ เป็นการบอก React ให้ render component <App /> ลงใน DOM  <div id="root">
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)



// createRoot(...) → สร้างพื้นที่ทำงานของ React ผูกกับ DOM
// Dom คือ โครงสร้างหน้าเว็บ (รูปแบบต้นไม้ Dom Tree) ที่ browser สร้างขึ้น จากการโหลดไฟล์ HTML เพื่อให้ dev จัดการผ่านโค้ด JS 
// document.getElementById('root') → คำสั่ง JS เพื่อเข้าถึง DOM element ที่มี id="root" <div id="root"></div> ใน index.html || “ขอ element ใน DOM ที่มี id = root มาให้ฉันหน่อย”
// .render(...) → สั่งให้ React render component ที่กำหนด
// <StrictMode> → ครอบ <App /> เอาไว้ เพื่อเปิดโหมดตรวจสอบใน dev mode
// <App /> → component หลักของโปรเจกต์ ถูก render ลงใน DOM





