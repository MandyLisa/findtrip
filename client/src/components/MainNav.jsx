// rafce (arrow function) หรือ rfce (function declaration) ใช้อันไหนก็ได้
import { Link, useNavigate } from 'react-router-dom'
import logo from '../assets/logo1.png'
import { CircleUserRound } from 'lucide-react'
import { useState } from 'react'
import useAuthStore from '../store/authStore'


const MainNav = () => { // ใช้ global state จะได้ไม่ต้องส่ง props หากัน
    const user = useAuthStore((state) => state.user)
    const actionLogout = useAuthStore((state) => state.actionLogout)
    const navigate = useNavigate()
    const [showDropdown, setShowDropdown] = useState(false)

    const handleLogout = () => {
        actionLogout()
        navigate('/login')
    }

    return (
        <>
            <nav className='bg-zinc-50'>
                <div className='mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl'>
                    <div className='flex items-center justify-between h-16 sm:h-20 lg:h-24'>  {/* div ใหญ่ คลุมทีมงาน 2 ตัว */}

                        {/* Logo และเมนูหลักด้านซ้าย */}
                        <div className='flex items-center gap-2 sm:gap-3 lg:gap-5'>
                            <Link to={'/'} className='flex items-center space-x-2'>
                                <img src={logo} alt='Logo' className='h-8 sm:h-10 w-auto' />
                            </Link>

                            {/* เมนูหลัก */}
                            <div className='flex items-center gap-2 sm:gap-3 lg:gap-5'>
                                <Link to={'/'} className='text-xs sm:text-sm lg:text-base hover:scale-105 hover:duration-200 hover:text-brand-pink'>
                                    หน้าหลัก
                                </Link>
                                <Link to={'/programs'} className='text-xs sm:text-sm lg:text-base hover:scale-105 hover:duration-200 hover:text-brand-pink whitespace-nowrap'>
                                    แพ็คเกจทัวร์ทั้งหมด
                                </Link>
                                <Link to={'/about'} className='text-xs sm:text-sm lg:text-base hover:scale-105 hover:duration-200 hover:text-brand-pink'>
                                    เกี่ยวกับเรา
                                </Link>
                            </div>
                        </div>

                        {/* ส่วนขวา - Login/User Profile */}
                        <div className='flex items-center gap-3'>
                            {!user ? (
                                <div className='flex items-center gap-1 sm:gap-2 lg:gap-5'>
                                    <Link to={'/login'} className='px-2 sm:px-3 lg:px-4 py-1 sm:py-2 text-xs sm:text-sm lg:text-base hover:border-2 border-brand-pink rounded-md transition-all'>
                                        เข้าสู่ระบบ
                                    </Link>
                                    <Link to={'/register'} className='bg-brand-pink text-white px-2 sm:px-3 lg:px-4 py-1 sm:py-2 text-xs sm:text-sm lg:text-base rounded-md hover:bg-pink-600 transition-all'>
                                        ลงทะเบียน
                                    </Link>
                                </div>
                            ) : (
                                <div className='flex items-center gap-3'>
                                    {(user.role === 'ADMIN' || user.role === 'SUPER_ADMIN') && (
                                        <Link
                                            to='/admin'
                                            className='flex items-center gap-1 bg-orange-400 text-white px-3 py-1.5 rounded-full text-sm font-medium hover:bg-orange-600 transition-colors shadow-sm'
                                        >
                                            <span className='hidden sm:inline'>กลับสู่หน้าแอดมิน</span>
                                        </Link>
                                    )}
                                    <div
                                        className='flex items-center gap-1 sm:gap-2 cursor-pointer relative'
                                        onMouseEnter={() => setShowDropdown(true)}
                                        onMouseLeave={() => setShowDropdown(false)}
                                    >
                                        <div className='flex items-center gap-1 sm:gap-2 cursor-pointer'>
                                            <CircleUserRound className='w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8 text-brand-pink' />
                                            <span className='text-xs sm:text-sm lg:text-base truncate max-w-16 sm:max-w-20 lg:max-w-none'>
                                                คุณ {user.name}
                                            </span>
                                        </div>


                                        {/* Dropdown เมื่อ hover */}
                                        {showDropdown && (
                                            <div
                                                className='absolute top-full left-0 w-48 bg-white border rounded shadow-lg z-50'
                                                onMouseEnter={() => setShowDropdown(true)}
                                                onMouseLeave={() => setShowDropdown(false)}
                                            >
                                                <Link
                                                    to='/user'
                                                    className='block px-4 py-2 text-sm hover:bg-gray-100 hover:text-brand-pink'
                                                >
                                                    บัญชีของฉัน
                                                </Link>
                                                <Link
                                                    to='/user/mybookings'
                                                    className='block px-4 py-2 text-sm hover:bg-gray-100 hover:text-brand-pink'
                                                >
                                                    การจองของฉัน
                                                </Link>

                                                <button
                                                    onClick={handleLogout}
                                                    className='w-full px-4 py-2 text-sm text-left hover:bg-gray-100 rounded-md hover:text-brand-pink'
                                                >
                                                    ออกจากระบบ
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </nav >

            {/* Banner Section */}
            < div className='w-full bg-brand-pink h-6 sm:h-8 flex item-center justify-center px-4' >
                <div className='flex items-center gap-2 text-center'>
                    <img src='/icons/plane-1.png' className='w-4 h-4 sm:w-auto sm:h-auto' />
                    <p className='text-xs sm:text-sm text-white'>
                        <span className='hidden sm:inline'>เรามีทัวร์ใหม่ๆ ที่น่าสนใจมากมาย! คุณสามารถดูข้อมูลได้ที่</span>
                        <span className='sm:hidden'>ดูทัวร์ใหม่ได้ที่</span>
                        <Link to='/programs' className='ml-1 font-medium hover:underline'>แพ็คเกจทัวร์ทั้งหมด!</Link>
                    </p>
                </div>
            </div>
        </>
    )
}

export default MainNav
