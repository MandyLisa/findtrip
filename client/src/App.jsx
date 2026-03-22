// rafce เป็นการเปิดบล็อกของตัว react jsx
import AppRoutes from './routes/AppRoutes'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { Toaster } from 'sonner'

const App = () => {

  return ( // return ออกมาได้แค่ 1 element เท่านั้น ถ้ามีหลาย element ให้<> ... <> มาครอบ
    <>
      <AppRoutes /> {/* จุด root ของแอปทั้งหมด */}

      <ToastContainer // กำหนด global UI Toaster ของ react-toastify
        position='top-center' 
        autoClose={3000} 
        hideProgressBar 
        closeOnClick 
        pauseOnHover 
        toastClassName='text-center text-lg p-6 bg-white shadow-lg rounded-xl' 
        bodyClassName='flex justify-center items-center' 
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
        position='top-center' 
        toastOptions={{
          className: 'text-lg shadow-xl rounded-xl',
        }}
      />
    </>
  )
}

export default App

