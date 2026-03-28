import logo1 from '../../assets/logo.png'
import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { FilePenLine, LayoutDashboard, PencilRuler } from 'lucide-react'
import { UserRound } from 'lucide-react'
import { SquarePen } from 'lucide-react'
import { NotebookPen } from 'lucide-react'
import { Receipt } from 'lucide-react'
import { ShieldUser } from 'lucide-react'
import useAuthStore from '@/store/authStore'

const SidebarAdmin = () => {
    const user = useAuthStore(state => state.user)
    const [isOpen, setIsOpen] = useState(false)

    return (
        <>
            <button
                type='button'
                onClick={() => setIsOpen(true)}
                aria-label='Open sidebar'
                className='md:hidden fixed top-4 left-4 z-50 inline-flex items-center justify-center rounded-xl bg-white/90 text-brand-pink shadow-lg ring-1 ring-black/5 backdrop-blur px-3 py-2 hover:bg-white'
            >
                <span className='block h-0.5 w-5 bg-current mb-1'></span>
                <span className='block h-0.5 w-5 bg-current mb-1'></span>
                <span className='block h-0.5 w-5 bg-current'></span>
            </button>

            <div
                className={`md:hidden fixed inset-0 z-40 ${isOpen ? '' : 'pointer-events-none'}`}
                aria-hidden={!isOpen}
            >
                <div
                    onClick={() => setIsOpen(false)}
                    className={`absolute inset-0 bg-black/40 transition-opacity ${isOpen ? 'opacity-100' : 'opacity-0'}`}
                />
                <div
                    className={`absolute left-0 top-0 h-full w-72 max-w-[85vw] transform transition-transform duration-200 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
                >
                    <div className='bg-brand-pink text-white flex flex-col h-full shadow-2xl'>
                        <div className='h-20 flex items-center justify-center px-5 border-b border-pink-200/30 relative'>
                            <img src={logo1} alt='Logo' className='h-10 w-auto mx-auto' />
                            <button
                                type='button'
                                onClick={() => setIsOpen(false)}
                                aria-label='Close sidebar'
                                className='absolute right-3 inline-flex items-center justify-center rounded-lg px-2 py-2 text-pink-100 hover:bg-white/10 hover:text-white'
                            >
                                <span className='block w-5 h-5 relative'>
                                    <span className='absolute left-0 top-1/2 h-0.5 w-5 -translate-y-1/2 rotate-45 bg-current'></span>
                                    <span className='absolute left-0 top-1/2 h-0.5 w-5 -translate-y-1/2 -rotate-45 bg-current'></span>
                                </span>
                            </button>
                        </div>

                        {user ? (
                            <div className='px-5 pt-5 pb-3 border-b border-pink-200/30'>
                                <div className='flex items-center gap-3'>
                                    <div className='h-10 w-10 rounded-xl bg-white/15 flex items-center justify-center ring-1 ring-white/10'>
                                        <UserRound className='h-5 w-5' />
                                    </div>
                                    <div className='min-w-0'>
                                        <div className='text-sm text-pink-100'>Hello Administrator</div>
                                        <div className='text-base font-semibold truncate'>แอดมิน{user.name}</div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className='px-5 pt-5 pb-3 border-b border-pink-200/30'>
                                <div className='flex items-center gap-3'>
                                    <div className='h-10 w-10 rounded-xl bg-white/15 flex items-center justify-center ring-1 ring-white/10'>
                                        <UserRound className='h-5 w-5' />
                                    </div>
                                    <div className='min-w-0'>
                                        <div className='text-sm text-pink-100'>Hello Administrator</div>
                                        <div className='text-base font-semibold truncate'>แอดมิน</div>
                                    </div>
                                </div>
                            </div>
                        )}

                        <nav className='flex-1 px-3 py-4 space-y-1 overflow-y-auto'>
                            <NavLink
                                to={'/admin'}
                                end
                                className={({ isActive }) =>
                                    isActive
                                        ? 'bg-white text-brand-pink font-semibold flex items-center gap-3 px-4 py-3 rounded-xl shadow-sm'
                                        : 'text-pink-100 px-4 py-3 hover:bg-white/10 hover:text-white rounded-xl flex items-center gap-3'
                                }
                            >
                                <LayoutDashboard className='h-5 w-5' />
                                Dashboard/หน้าหลัก
                            </NavLink>

                            <NavLink
                                to={'tourpackage'}
                                className={({ isActive }) =>
                                    isActive
                                        ? 'bg-white text-brand-pink font-semibold hover: flex items-center gap-3 px-4 py-3 rounded-xl shadow-sm'
                                        : 'text-pink-100 px-4 py-3 hover:bg-white/10 hover:text-white rounded-xl flex items-center gap-3'
                                }
                            >
                                <FilePenLine className='h-5 w-5' />
                                Tourpackage/แพ็คเกจ
                            </NavLink>

                            <NavLink
                                to={'category'}
                                className={({ isActive }) =>
                                    isActive
                                        ? 'bg-white text-brand-pink font-semibold hover: flex items-center gap-3 px-4 py-3 rounded-xl shadow-sm'
                                        : 'text-pink-100 px-4 py-3 hover:bg-white/10 hover:text-white rounded-xl flex items-center gap-3'
                                }
                            >
                                <SquarePen className='h-5 w-5' />
                                Category/ประเภททัวร์
                            </NavLink>

                            <NavLink
                                to={'country'}
                                className={({ isActive }) =>
                                    isActive
                                        ? 'bg-white text-brand-pink font-semibold hover: flex items-center gap-3 px-4 py-3 rounded-xl shadow-sm'
                                        : 'text-pink-100 px-4 py-3 hover:bg-white/10 hover:text-white rounded-xl flex items-center gap-3'
                                }
                            >
                                <PencilRuler className='h-5 w-5' />
                                Country/ประเทศ
                            </NavLink>

                            <NavLink
                                to={'booking'}
                                className={({ isActive }) =>
                                    isActive
                                        ? 'bg-white text-brand-pink font-semibold hover: flex items-center gap-3 px-4 py-3 rounded-xl shadow-sm'
                                        : 'text-pink-100 px-4 py-3 hover:bg-white/10 hover:text-white rounded-xl flex items-center gap-3'
                                }
                            >
                                <NotebookPen className='h-5 w-5' />
                                Booking/การจองทัวร์
                            </NavLink>

                            <NavLink
                                to={'payment'}
                                className={({ isActive }) =>
                                    isActive
                                        ? 'bg-white text-brand-pink font-semibold hover: flex items-center gap-3 px-4 py-3 rounded-xl shadow-sm'
                                        : 'text-pink-100 px-4 py-3 hover:bg-white/10 hover:text-white rounded-xl flex items-center gap-3'
                                }
                            >
                                <Receipt className='h-5 w-5' />
                                Payment/การชำระเงิน
                            </NavLink>

                            <NavLink
                                to={'manage'}
                                className={({ isActive }) =>
                                    isActive
                                        ? 'bg-white text-brand-pink font-semibold hover: flex items-center gap-3 px-4 py-3 rounded-xl shadow-sm'
                                        : 'text-pink-100 px-4 py-3 hover:bg-white/10 hover:text-white rounded-xl flex items-center gap-3'
                                }
                            >
                                <ShieldUser className='h-5 w-5' />
                                Manage/จัดการผู้ใช้
                            </NavLink>
                        </nav>

                        <nav className='px-3 py-4 space-y-2 border-t border-pink-200/30'>
                            <NavLink
                                to={'/'}
                                end
                                className='text-pink-100 px-4 py-3 bg-white/10 hover:bg-white/15 hover:text-white rounded-xl flex items-center gap-3'
                            >
                                <LayoutDashboard className='h-5 w-5' />
                                Go to User/ไปยังหน้าผู้ใช้
                            </NavLink>
                        </nav>
                    </div>
                </div>
            </div>

            <div className='hidden md:flex bg-brand-pink w-72 text-white flex-col h-dvh border-r border-pink-200/30'>
                <div className='h-20 flex items-center justify-center px-5 border-b border-pink-200/30'>
                    <img src={logo1} alt='Logo' className='h-10 w-auto mx-auto' />
                </div>
                {user ? (
                    <div className='px-5 pt-5 pb-3 border-b border-pink-200/30'>
                        <div className='flex items-center gap-3'>
                            <div className='h-10 w-10 rounded-xl bg-white/15 flex items-center justify-center ring-1 ring-white/10'>
                                <UserRound className='h-5 w-5' />
                            </div>
                            <div className='min-w-0'>
                                <div className='text-sm text-pink-100'>Hello Administrator</div>
                                <div className='text-base font-semibold truncate'>แอดมิน {user.name}</div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className='px-5 pt-5 pb-3 border-b border-pink-200/30'>
                        <div className='flex items-center gap-3'>
                            <div className='h-10 w-10 rounded-xl bg-white/15 flex items-center justify-center ring-1 ring-white/10'>
                                <UserRound className='h-5 w-5' />
                            </div>
                            <div className='min-w-0'>
                                <div className='text-sm text-pink-100'>Hello Administrator</div>
                                <div className='text-base font-semibold truncate'>แอดมิน</div>
                            </div>
                        </div>
                    </div>
                )}

                <nav className='flex-1 px-3 py-4 space-y-1 overflow-y-auto'>
                    <NavLink
                        to={'/admin'}
                        end
                        className={({ isActive }) =>
                            isActive
                                ? 'bg-white text-brand-pink font-semibold flex items-center gap-3 px-4 py-3 rounded-xl shadow-sm'
                                : 'text-pink-100 px-4 py-3 hover:bg-white/10 hover:text-white rounded-xl flex items-center gap-3'
                        }
                    >
                        <LayoutDashboard className='h-5 w-5' />
                        Dashboard/หน้าหลัก
                    </NavLink>

                    <NavLink
                        to={'tourpackage'}
                        className={({ isActive }) =>
                            isActive
                                ? 'bg-white text-brand-pink font-semibold hover: flex items-center gap-3 px-4 py-3 rounded-xl shadow-sm'
                                : 'text-pink-100 px-4 py-3 hover:bg-white/10 hover:text-white rounded-xl flex items-center gap-3'
                        }
                    >
                        <FilePenLine className='h-5 w-5' />
                        Tourpackage/แพ็คเกจ
                    </NavLink>

                    <NavLink
                        to={'category'}
                        className={({ isActive }) =>
                            isActive
                                ? 'bg-white text-brand-pink font-semibold hover: flex items-center gap-3 px-4 py-3 rounded-xl shadow-sm'
                                : 'text-pink-100 px-4 py-3 hover:bg-white/10 hover:text-white rounded-xl flex items-center gap-3'
                        }
                    >
                        <SquarePen className='h-5 w-5' />
                        Category/ประเภททัวร์
                    </NavLink>

                    <NavLink
                        to={'country'}
                        className={({ isActive }) =>
                            isActive
                                ? 'bg-white text-brand-pink font-semibold hover: flex items-center gap-3 px-4 py-3 rounded-xl shadow-sm'
                                : 'text-pink-100 px-4 py-3 hover:bg-white/10 hover:text-white rounded-xl flex items-center gap-3'
                        }
                    >
                        <PencilRuler className='h-5 w-5' />
                        Country/ประเทศ
                    </NavLink>

                    <NavLink
                        to={'booking'}
                        className={({ isActive }) =>
                            isActive
                                ? 'bg-white text-brand-pink font-semibold hover: flex items-center gap-3 px-4 py-3 rounded-xl shadow-sm'
                                : 'text-pink-100 px-4 py-3 hover:bg-white/10 hover:text-white rounded-xl flex items-center gap-3'
                        }
                    >
                        <NotebookPen className='h-5 w-5' />
                        Booking/การจองทัวร์
                    </NavLink>

                    <NavLink
                        to={'payment'}
                        className={({ isActive }) =>
                            isActive
                                ? 'bg-white text-brand-pink font-semibold hover: flex items-center gap-3 px-4 py-3 rounded-xl shadow-sm'
                                : 'text-pink-100 px-4 py-3 hover:bg-white/10 hover:text-white rounded-xl flex items-center gap-3'
                        }
                    >
                        <Receipt className='h-5 w-5' />
                        Payment/การชำระเงิน
                    </NavLink>

                    <NavLink
                        to={'manage'}
                        className={({ isActive }) =>
                            isActive
                                ? 'bg-white text-brand-pink font-semibold hover: flex items-center gap-3 px-4 py-3 rounded-xl shadow-sm'
                                : 'text-pink-100 px-4 py-3 hover:bg-white/10 hover:text-white rounded-xl flex items-center gap-3'
                        }
                    >
                        <ShieldUser className='h-5 w-5' />
                        Manage/จัดการผู้ใช้
                    </NavLink>
                </nav>

                <nav className='px-3 py-4 space-y-2 border-t border-pink-200/30'>
                    <NavLink
                        to={'/'}
                        end
                        className='text-pink-100 px-4 py-3 bg-white/10 hover:bg-white/90 hover:text-brand-pink rounded-xl flex items-center gap-3'
                    >
                        <LayoutDashboard className='h-5 w-5'/>
                        Go to User/ไปยังหน้าผู้ใช้
                    </NavLink>
                </nav>
            </div>
        </>
    )
}

export default SidebarAdmin
