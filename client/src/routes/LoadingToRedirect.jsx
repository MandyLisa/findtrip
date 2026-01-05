import Footer from '@/components/Footer'
import MainNav from '@/components/MainNav'
import useAuthStore from '@/store/authStore'
import { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'

const LoadingToRedirect = () => {
    const [count, setCount] = useState(3) // ค่าเริ่มต้นนับถอยหลัง 3 วิ
    const [redirect, setRedirect] = useState(false) // ถ้าเป็น true ค่อยสั่ง redirect
    const actionLogout = useAuthStore((state) => state.actionLogout)

        useEffect(() => {
            const interval = setInterval(() => {
                setCount((currentCount) => {
                    if (currentCount === 1) {
                        clearInterval(interval)
                        actionLogout()
                        setRedirect(true)
                    }
                    return currentCount - 1 // คืนค่า ปัจจุบัน -1
                })
            }, 1000)
            return () => clearInterval(interval) // เคลียร์ข้อมูลทั้งหมดก่อนที่จะทำงานรอบใหม่
        }, []) // ใส่ array กัน infinities loop

    if (redirect) {
        return <Navigate to={'/login'} />
    }

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
