import { Outlet } from 'react-router-dom'
import SidebarAdmin from '../components/admin/SidebarAdmin'
import HeaderAdmin from '../components/admin/HeaderAdmin'

// route เป็นแบบ nested (เช่น /admin/tourpackage/detail/:id) ต้องมี <Outlet /> ภายใน AdminLayout 
// เพื่อให้ React Router รู้ว่าจะแสดง route ย่อยตรงไหน
const LayoutAdmin = () => {
    return (
        <div className='flex h-dvh'>
            <SidebarAdmin />
            <div className='flex-1 flex flex-col min-w-0 min-h-0'>
                <HeaderAdmin />
                <main className='flex-1 min-h-0 p-6 bg-slate-100 overflow-y-auto'>
                    <Outlet />
                </main>              
            </div>
        </div>
    )
}

export default LayoutAdmin
