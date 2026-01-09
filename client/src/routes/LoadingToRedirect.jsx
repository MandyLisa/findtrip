import Footer from '@/components/Footer'
import MainNav from '@/components/MainNav'
import useAuthStore from '@/store/authStore'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const LoadingToRedirect = () => {
    const [count, setCount] = useState(3) // ค่าเริ่มต้นนับถอยหลัง 3 วิ
    const navigate = useNavigate() 
    const actionLogout = useAuthStore((state) => state.actionLogout)

    useEffect(() => {
        const interval = setInterval(() => {
            setCount((currentCount) => {
                if (currentCount === 1) {
                    clearInterval(interval)
                    return 0
                }
                return currentCount - 1 // คืนค่า ปัจจุบัน -1
            })
        }, 1000)

        return () => clearInterval(interval) // เคลียร์ข้อมูลทั้งหมดก่อนที่จะทำงานรอบใหม่
    }, [])

    // ใช้ useEffect แยกต่างหากเพื่อจัดการกับการ Redirect และ Logout
    useEffect(() => {
        if (count === 0) {
            actionLogout() // ล้างข้อมูลใน Store
            navigate('/login') // เปลี่ยนไปหน้า login
        }
    }, [count, navigate, actionLogout])

    return (
        <>
            <MainNav />
            <div className='flex flex-col min-h-screen border-t border-brand-pink bg-gray-50 w-full h-8 rounded-md'>
                <p className='text-lg font font-semibold text-center'>
                    No Permision! The Website will be Redirect in ... {count}
                </p>
            </div>
            <Footer />
        </>
    )
}


export default LoadingToRedirect
