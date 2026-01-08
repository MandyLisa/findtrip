import { Outlet, useLocation } from 'react-router-dom'
import MainNav from '../components/MainNav'
import Footer from '../components/Footer'
import { useNavigate } from 'react-router-dom'
import useAuthStore from '../store/authStore'
import { useEffect } from 'react'

const Layout = () => {
    const navigate = useNavigate()
    const user = useAuthStore((state) => state.user)
    const token = useAuthStore((state) => state.token)
    const location = useLocation()

    useEffect(() => {
        // ยังไม่ login → ปล่อยให้ดูหน้า public
        if (!user || !token) return

        // ป้องกัน loop
        if (location.pathname.startsWith('/admin') ||
            location.pathname.startsWith('/user')) {
            return
        }

        if (user.role === 'ADMIN' || user.role === 'SUPER_ADMIN') {
            navigate('/admin', { replace: true })
        } else {
            navigate('/user', { replace: true })
        }
    }, [user, token, navigate, location.pathname])

    return (
        <div className='flex flex-col min-h-screen'>
            <MainNav />
            <main className='flex-1 mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-8'>
                <Outlet />
            </main>

            <Footer />
        </div>
    )
}

export default Layout
