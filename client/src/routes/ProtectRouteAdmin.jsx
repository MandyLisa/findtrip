import { useState, useEffect } from 'react'
import { currentAdmin } from '../API/auth'
import LoadingToRedirect from './LoadingToRedirect'
import useAuthStore from '../store/authStore'
import AuthCheckedLoading from '@/components/ui/authCheckedLoading'


const ProtectRouteAdmin = ({ element }) => {
    const [ok, setOk] = useState(null)  // ไว้เก็บสถานะว่าคนนี้ใช่ admin รึเปล่า
    const user = useAuthStore((state) => state.user) // ดึงข้อมูล user จาก store ว่ามีการ login ค้างไว้ไหม
    const token = useAuthStore((state) => state.token)

    useEffect(() => {
        if (user && token) {
            currentAdmin(token)
                .then((res) => {
                    // console.log('Respone from backend:', res.data.role)
                    setOk(true)
                })
                .catch((err) => {
                    // console.log('Error from backend:', err)
                    setOk(false)
                })
        }

    }, [])

    if (ok === null) {
        return <AuthCheckedLoading role={user?.role} />
    }

    return ok ? element : <LoadingToRedirect />
}

export default ProtectRouteAdmin
