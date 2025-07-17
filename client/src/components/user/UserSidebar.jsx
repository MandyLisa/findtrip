import { useLocation, useNavigate } from 'react-router-dom'
import useAuthStore from '../../store/authStore'
import { BookOpen, LogOut, User } from 'lucide-react'

const UserSidebar = () => {

  const navigate = useNavigate()
  const location = useLocation()
  const { actionLogout, user: authUser} = useAuthStore()

  // left menu
  const menuItems = [
    { name: 'บัญชีของฉัน', icon: User, path: '/user' },
    { name: 'การจองของฉัน', icon: BookOpen, path: '/user/mybookings' },
    { name: 'ออกจากระบบ', icon: LogOut, action: actionLogout }
  ]

  // Handle menu click
  const handleMenuClick = (item) => {
    if (item.action) {
      item.action()
    } else if (item.path) {
      navigate(item.path)
    }
  }

  return (
    <div className='xl:w-80 xl:flex-shrink-0 bg-white rounded-lg shadow-sm border xl:h-fit'>
      {/* User Profile Section */}
      <div className='p-4 lg:p-6 border-b'>
        <div className='flex items-center gap-3'>
          <div className='w-10 h-10 lg:w-12 lg:h-12 bg-brand-pink rounded-full flex items-center justify-center text-white font-semibold'>
            <User size={20} className='lg:w-6 lg:h-6' />
          </div>
          <div>
            <span className='text-base lg:text-lg font-medium text-gray-800'>สมาชิก</span>
            {authUser && (
              <p className='text-xs lg:text-sm text-gray-600'>สวัสดี คุณ {authUser.name}</p>
            )}
          </div>
        </div>
      </div>

      {/* Menu Items */}
      <div className='p-3 lg:p-4'>
        <div className='flex xl:flex-col gap-2 overflow-x-auto xl:overflow-x-visible'>
          {menuItems.map((item, index) => {
            const Icon = item.icon
            const isActive = location.pathname === item.path

            return (
              <button
                key={index}
                onClick={() => handleMenuClick(item)}
                className={`flex items-center gap-2 lg:gap-3 px-3 lg:px-4 py-2 lg:py-3 rounded-lg text-left transition-colors whitespace-nowrap xl:w-full ${isActive
                    ? 'bg-brand-pink text-white'
                    : 'text-gray-600 hover:bg-gray-50'
                  }`}
              >
                <Icon size={18} className='lg:w-5 lg:h-5 flex-shrink-0' />
                <span className='font-medium text-sm lg:text-base'>{item.name}</span>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )

}

export default UserSidebar
