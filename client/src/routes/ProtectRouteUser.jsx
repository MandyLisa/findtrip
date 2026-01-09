import { useState, useEffect } from 'react'
import { currentUser } from '../API/auth'
import LoadingToRedirect from './LoadingToRedirect'
import useAuthStore from '../store/authStore'
import AuthCheckedLoading from '@/components/ui/authCheckedLoading'


const ProtectRouteUser = ({ element }) => {
    const [ok, setOk] = useState(null) 
    const user = useAuthStore((state) => state.user)
    const token = useAuthStore((state) => state.token)

    useEffect(() => {
        if (user && token) { // ยืนยันตัวตนกับ server
            currentUser(token) 
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

export default ProtectRouteUser
