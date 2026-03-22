import { useEffect } from 'react'
import useAuthStore from '../store/authStore'
import { Navigate } from 'react-router-dom'
import { isTokenExpired } from '@/utils/auth'


const ProtectRouteUser = ({ element }) => {
    // const [ok, setOk] = useState(null) // ไว้เก็บสถานะว่าคนนี้ใช่ user รึเปล่า
    const user = useAuthStore((state) => state.user) // ดึงข้อมูล user จาก store ว่ามีการ login ค้างไว้ไหม
    const token = useAuthStore((state) => state.token)
    const actionLogout = useAuthStore((state) => state.actionLogout)

    const isExpired = token && isTokenExpired(token) // เช็คว่า token หมดอายุหรือยัง

    useEffect(() => {
        if (isExpired) {
            actionLogout()
        }
    }, [isExpired, actionLogout])

    if (!token || !user || isExpired) { // ไม่มี token user หรือ token หมดอายุ → เด้งไป /login
        return <Navigate to='/login' replace />
    }

    if (user.role !== 'USER') { //ถ้า role ไม่ใช่ USER → เด้ง /login
        return <Navigate to='/login' replace />
    }

    return element
}

export default ProtectRouteUser
