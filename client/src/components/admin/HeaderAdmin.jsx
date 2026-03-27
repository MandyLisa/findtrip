import { LogOut } from 'lucide-react'
import { useLocation, useNavigate } from 'react-router-dom'
import useAuthStore from '@/store/authStore'

const HeaderAdmin = () => {
    const location = useLocation()
    const actionLogout = useAuthStore((state) => state.actionLogout)
    const navigate = useNavigate()

    const pathname = location?.pathname || ''
    const pageTitle = pathname.includes('/admin/tourpackage')
        ? 'Tourpackage/แพ็คเกจ'
        : pathname.includes('/admin/category')
            ? 'Category/ประเภททัวร์'
            : pathname.includes('/admin/country')
                ? 'Country/ประเทศ'
                : pathname.includes('/admin/booking')
                    ? 'Booking/การจอง'
                    : pathname.includes('/admin/payment')
                        ? 'Payment/การชำระเงิน'
                        : pathname.includes('/admin/manage')
                            ? 'Manage/จัดการผู้ใช้'
                            : 'Dashboard/หน้าหลัก'

    const handleLogout = () => {
        actionLogout()
        navigate('/login')
    }

    return (
        <header className='bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/70 border-b border-gray-200/70 h-12 md:h-16 flex items-center'>
            <div className='w-full pr-3 pl-14 md:px-6'>
                <div className='h-full flex items-center justify-between gap-3'>
                    <div className='min-w-0 flex items-center gap-3'>
                        <div className='h-8 md:h-10 px-3 md:px-4 rounded-xl bg-brand-pink/10 text-brand-pink flex items-center font-semibold text-sm md:text-base'>
                            Admin
                        </div>
                        <div className='hidden md:block h-6 w-px bg-gray-200' />
                        <div className='hidden md:block text-sm text-gray-500 truncate'>
                            {pageTitle}
                        </div>
                    </div>

                    <div className='flex items-center gap-2 md:gap-3'>
                        <div className='hidden md:flex items-center gap-2 px-3 py-2 rounded-xl bg-white shadow-sm ring-1 ring-black/5 text-gray-500'>
                            <span className='h-2 w-2 rounded-full bg-emerald-500'></span>
                            <span className='text-sm'>Online</span>
                        </div>
                        <button
                            type='button'
                            onClick={handleLogout}
                            className='h-9 w-9 md:h-10 md:w-10 rounded-xl bg-brand-pink/10 ring-1 ring-black/5 text-gray-600 hover:bg-brand-pink/20 hover:text-brand-pink inline-flex items-center justify-center'
                            aria-label='Logout'
                            title='Logout/ออกจากระบบ'
                        >
                            <LogOut className='h-5 w-5' />
                        </button>
                    </div>
                </div>
            </div>
        </header>
    )
}

export default HeaderAdmin
