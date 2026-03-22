import logo1 from '../../assets/logo.png'
import { NavLink, useNavigate } from 'react-router-dom'
import { FilePenLine, LayoutDashboard, LogOut, PencilRuler } from 'lucide-react'
import { UserRound } from 'lucide-react'
import { SquarePen } from 'lucide-react'
import { NotebookPen } from 'lucide-react'
import { Receipt } from 'lucide-react'
import { ShieldUser } from 'lucide-react'
import useAuthStore from '@/store/authStore'

const SidebarAdmin = () => {
    const user = useAuthStore(state => state.user)
    const actionLogout = useAuthStore((state) => state.actionLogout)
    const navigate = useNavigate()

    const handleLogout = () => {
        actionLogout()
        navigate('/login')
    }

    return (
        <div className='bg-brand-pink w-72 text-white flex flex-col h-screen'>
            <div className='h-20 flex justify-center items-center flex-col border-pink-200'>
                <img src={logo1} alt='Logo' className='h-10 w-auto' />
            </div>
            {user ? (
                <div className='flex flex-col'>
                    <div className='h-10 flex items-center p-6 text-xl'>
                        <UserRound className='ml-2' />
                        <span className='ml-4'>Hello Administrator</span>
                    </div>
                    <div className='flex justify-center items-center text-md'>
                        <p className='mb-4'>สวัสดีค่ะ แอดมิน {user.name}</p>
                    </div>
                </div>
            ) : (
                <div className='flex flex-col'>
                    <div className='h-10 flex items-center p-6 text-xl'>
                        <UserRound className='ml-2' />
                        <span className='ml-4'>Hello Administrator</span>
                    </div>
                    <div className='flex justify-center items-center text-md'>
                        <p className='mb-4'>สวัสดีค่ะ แอดมิน</p>
                    </div>
                </div>
            )}


            <nav className='flex-1 px-4 py-4 space-y-4'>
                <NavLink
                    to={'/admin'}
                    end
                    className={({ isActive }) =>
                        isActive
                            ? 'bg-white text-brand-pink font-semibold flex items-center px-4 py-4 '
                            : 'text-pink-100 px-4 py-2 hover:bg-brand-pink hover:text-white rounded flex items-center'
                    }
                >
                    <LayoutDashboard className='mr-2' />
                    Dashboard/หน้าหลัก
                </NavLink>

                <NavLink
                    to={'tourpackage'}
                    className={({ isActive }) =>
                        isActive
                            ? 'bg-white text-brand-pink font-semibold hover: flex items-center px-4 py-4'
                            : 'text-pink-100 px-4 py-2 hover:bg-brand-pink hover:text-white rounded flex items-center'
                    }
                >
                    <FilePenLine className='mr-2' />
                    Tourpackage/แพ็คเกจ
                </NavLink>

                <NavLink
                    to={'category'}
                    className={({ isActive }) =>
                        isActive
                            ? 'bg-white text-brand-pink font-semibold hover: flex items-center px-4 py-4'
                            : 'text-pink-100 px-4 py-2 hover:bg-brand-pink hover:text-white rounded flex items-center'
                    }
                >
                    <SquarePen className='mr-2' />
                    Category/ประเภททัวร์
                </NavLink>

                <NavLink
                    to={'country'}
                    className={({ isActive }) =>
                        isActive
                            ? 'bg-white text-brand-pink font-semibold hover: flex items-center px-4 py-4'
                            : 'text-pink-100 px-4 py-2 hover:bg-brand-pink hover:text-white rounded flex items-center'
                    }
                >
                    <PencilRuler className='mr-2' />
                    Country/ประเทศ
                </NavLink>

                <NavLink
                    to={'booking'}
                    className={({ isActive }) =>
                        isActive
                            ? 'bg-white text-brand-pink font-semibold hover: flex items-center px-4 py-4'
                            : 'text-pink-100 px-4 py-2 hover:bg-brand-pink hover:text-white rounded flex items-center'
                    }
                >
                    <NotebookPen className='mr-2' />
                    Booking/การจองทัวร์
                </NavLink>

                <NavLink
                    to={'payment'}
                    className={({ isActive }) =>
                        isActive
                            ? 'bg-white text-brand-pink font-semibold hover: flex items-center px-4 py-4'
                            : 'text-pink-100 px-4 py-2 hover:bg-brand-pink hover:text-white rounded flex items-center'
                    }
                >
                    <Receipt className='mr-2' />
                    Payment/การชำระเงิน
                </NavLink>

                <NavLink
                    to={'manage'}
                    className={({ isActive }) =>
                        isActive
                            ? 'bg-white text-brand-pink font-semibold hover: flex items-center px-4 py-4'
                            : 'text-pink-100 px-4 py-2 hover:bg-brand-pink hover:text-white rounded flex items-center'
                    }
                >
                    <ShieldUser className='mr-2' />
                    Manage/จัดการผู้ใช้
                </NavLink>

                <button
                    onClick={handleLogout}
                    className='w-full text-pink-100 px-4 py-2 
                    hover:bg-brand-pink hover:text-white rounded flex items-center'
                >
                    <LogOut className='mr-2' />
                    Logout/ออกจากระบบ
                </button>
            </nav>
            
             <nav className='px-4 py-4 space-y-4 border-t border-pink-200'>
                <NavLink
                    to={'/'}
                    end
                    className='text-pink-100 px-4 py-2 bg-brand-pink hover:text-white rounded flex items-center'
                >
                    <LayoutDashboard className='mr-2' />
                    Go to User/ไปยังหน้าผู้ใช้
                </NavLink>
             </nav>

        </div>
    )
}

export default SidebarAdmin
