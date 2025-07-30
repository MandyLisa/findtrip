import { getProfileByAdmin, updateProfileByAdmin } from "@/API/profile"
import useAuthStore from "@/store/authStore"
import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"


const FormManageDetail = () => {
    const token = useAuthStore((state) => state.token)
    const { id } = useParams()
    const navigate = useNavigate()

    const [user, setUser] = useState({})
    const [loading, setLoading] = useState(false)

    const [selectedUser, setSelectedUser] = useState(null)


    useEffect(() => {
        if (id) {
            fetchProfileDetail()
        }
    }, [])

    const fetchProfileDetail = async () => {
        setLoading(true)
        try {
            const res = await getProfileByAdmin(token, id)
            console.log('ดู fetchProfileDetail ตรงนี้ ', res)
            setUser(res.data.user)
        } catch (error) {
            console.error('Failed to Fetch profile Detail: ', error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className='my-8 p-6 bg-white rounded-md shadow-md'>
            <div className='flex flex-col'>
                <p className='text-xl md:text-2xl mt-2 md:mt-0'>จัดการผู้ใช้</p>
                <p className='text-md mt-2'>รหัสลูกค้า {user.id}</p>
            </div>
        </div>
    )
}

export default FormManageDetail
