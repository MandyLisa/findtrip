import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Layout from '../layouts/Layout'
import LayoutAdmin from '../layouts/LayoutAdmin'
import LayoutUser from '../layouts/LayoutUser'
import Login from '../pages/auth/Login'
import Register from '../pages/auth/Register'
import Home from '../pages/Home'
import Programs from '../pages/Programs'
import TourDetail from '../pages/TourDetail'
import AboutUs from '../pages/AboutUs'
import BookingUser from '../pages/user/Booking'
import PaymentUser from '../pages/user/PaymentUser'
import MyProfile from '../pages/user/MyProfile'
import MyBooking from '../pages/user/MyBooking'
import Tourpackage from '../pages/admin/Tourpackage'
import TourpackageDetail from '../pages/admin/TourpackageDetail'
import Dashboard from '../pages/admin/Dashboard'
import Category from '../pages/admin/Category'
import Country from '../pages/admin/Country'
import Booking from '../pages/admin/Booking'
import Payment from '../pages/admin/Payment'
import Manage from '../pages/admin/Manage'
import ProtectRouteUser from './ProtectRouteUser'
import ProtectRouteAdmin from './ProtectRouteAdmin'
import PaymentSuccess from '../pages/user/PaymentSuccess'
import PaymentReceipt from '../pages/user/PaymentReceipt'
import ForgotPassword from '@/pages/auth/ForgotPassword'
import ResetPassword from '@/pages/auth/ResetPassword'
import BookingDetail from '@/pages/admin/BookingDetail'
import PaymentDetail from '@/pages/admin/PaymentDetail'
import ManageDetail from '@/pages/admin/ManageDetail'


const router = createBrowserRouter([ // กำหนด routing ให้ React เมื่อผู้ใช้เข้ามาที่ URL จะให้แสดง Component อะไร
    {
        path: '/',
        element: <Layout />, // route ทั้งหมดที่เป็น children จะถูก "ห่อ" ด้วย Layout 
        children: [
            { index: true, element: <Home /> }, // path เดียวกันกับตัวแม่ด้านบน
            { path: 'programs/:category?', element: <Programs /> },
            { path: 'about', element: <AboutUs /> },
            { path: 'tourdetail/:id', element: <TourDetail /> },
            { path: 'login', element: <Login /> },
            { path: 'register', element: <Register /> }, // เมื่อมาที่ url path นี้ ให้แสดงที่ component ไหน
            { path: 'forgot-password', element: <ForgotPassword /> }, // เมื่อมาที่ url path นี้ ให้แสดงที่ component ไหน
            { path: 'reset-password/:token', element: <ResetPassword /> }, 
          
        ]
    },

    {
        path: '/admin',
        element: <ProtectRouteAdmin element={<LayoutAdmin />} />,
        children: [
            { index: true, element: <Dashboard /> },
            { path: 'manage', element: <Manage /> },
            { path: 'manage/:id', element: <ManageDetail /> },
            { path: 'category', element: <Category /> },
            { path: 'country', element: <Country /> },
            { path: 'tourpackage', element: <Tourpackage /> }, // list
            { path: 'tourpackage/detail/:id?', element: <TourpackageDetail /> }, // create,update,read
            { path: 'booking', element: <Booking /> },
            { path: 'booking/:id', element: <BookingDetail /> },
            { path: 'payment', element: <Payment /> },
            { path: 'payment/:id', element: <PaymentDetail /> },
        ]
    },

    {
        path: '/user',
        // ส่ง element: <LayoutUser/> ไปเป็น พร็อพให้กับ ProtectRouteUser
        element: <ProtectRouteUser element={<LayoutUser />} />,
        children: [
            { index: true, element: <MyProfile /> },
            { path: 'bookings/:id', element: <BookingUser/> },
            { path: 'mybookings', element: <MyBooking /> },
            { path: 'payments/:bookingId', element: <PaymentUser /> },
            { path: 'payment-success', element: <PaymentSuccess /> },
            { path: 'payment-receipt/:bookingId', element: <PaymentReceipt /> },
            
        ]
    }

])


const AppRoutes = () => {
    return (
        <>
            <RouterProvider router={router} />
        </>
    )
}

export default AppRoutes
