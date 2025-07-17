import {useState, useEffect} from 'react'
import { currentAdmin } from '../API/auth'
import LoadingToRedirect from './LoadingToRedirect'
import useAuthStore from '../store/authStore'


const ProtectRouteAdmin = ({ element }) => {
    const [ok, setOk] = useState(null) // ถ้าเป็น true ถึงให้ผ่าน
    const user = useAuthStore((state) => state.user)
    const token = useAuthStore((state) => state.token)
    
    useEffect(() => {
        if(user && token) {
            // send to back
            currentAdmin(token) // ถ้า currentAdmin ทำงานสำเร็จ เค้าจะมาทำงานใน then
            .then((res) => setOk(true))
            .catch((err) => setOk(false))
        }

    },[])
    if (ok === null) return null

    return ok? element : <LoadingToRedirect />
}

export default ProtectRouteAdmin
