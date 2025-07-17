// rafce เป็นการเปิดบล็อกของตัว react jsx
import AppRoutes from './routes/AppRoutes'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { Toaster } from 'sonner'

const App = () => {

  return ( // กฏการ return จะ return ออกมาได้แค่ 1 element เท่านั้น เอ้าแล้วถ้ามีหลาย element ต้องทำอย่างไร
    //ให้เอา <> ... <> มาครอบ
    <>
      <AppRoutes /> {/* จุด root ของแอปทั้งหมด */}

      <ToastContainer // แจ้งเตือนแบบสวยงามแทน alert() แบบเดิม โดยใช้ React-toastify
        position='top-center' // กลางด้านบนของหน้าจอ
        autoClose={3000} // ปิดอัตโนมัติใน 3 วินาที
        hideProgressBar // ซ่อน progress bar (แถบที่วิ่งเวลานับถอยหลัง)
        closeOnClick //	สามารถคลิกเพื่อปิด toast ได้
        pauseOnHover // หยุดนับถอยหลังเมื่อเมาส์ไปวางบน toast
        toastClassName='text-center text-lg p-6 bg-white shadow-lg rounded-xl' // จัดข้อความใน toast ให้อยู่ กึ่งกลางแนวนอน
        bodyClassName='flex justify-center items-center' // เนื้อหาใน toast อยู่กึ่งกลางทั้งแนวนอนและแนวตั้ง
        style={{
          position: 'fixed',
          top: '20%',
          left: '50%',
          transform: 'translateY(-50%, -50%)',
          zIndex: 9999
        }}
      />

      {/* Sonner */}
      <Toaster
        richColors
        position='top-center' // เปลี่ยนตำแหน่งเพื่อไม่ให้ทับกัน
        toastOptions={{
          className: 'text-lg shadow-xl rounded-xl',
        }}
      />
    </>
  )
}

export default App

