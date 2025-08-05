import { getProfileByAdmin, updateAcountStatus, updateProfileByAdmin } from '@/API/profile'
import useAuthStore from '@/store/authStore'
import { Loader } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import ConfirmDialog from '../ui/ConfirmDialog'
import { toast } from 'react-toastify'


const FormManageDetail = () => {
    const token = useAuthStore((state) => state.token)
    const stateUser = useAuthStore((state) => state.user)
    const { id } = useParams()
    const navigate = useNavigate()

    const [user, setUser] = useState({})
    const [loading, setLoading] = useState(false)


    useEffect(() => {
        if (id) {
            fetchProfileDetail()
        }
    }, []) // รันครั้งเดียวตอน mount

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

    const [status, setStatus] = useState(null)
    useEffect(() => {
        if (user && user.enable !== undefined) {
            setStatus(user.enable)
        }
    }, [user]) // รันเมื่อ user เปลี่ยน

    const handleChangeAccountStatus = async () => {
        try {
            const res = await updateAcountStatus(token, id, !status)
            console.log('ดู handleChangeAccountStatus', res)
            setStatus(res.data.user.enable)
            toast.success(`เปลี่ยนสถานะบัญชีเป็น ${res.data.user.enable ? 'เปิด' : 'ปิด'} สำเร็จ`)
        } catch (err) {
            console.log('Error in handle change account', err)
            toast.error('เกิดข้อผิดพลาดในการเปลี่ยนสถานะบัญชี')
        }
    }

    const [role, setRole] = useState(null)
    useEffect(() => {
        if (user?.role) {
            setRole(user.role)
        }
    }, [user])

    const handleChangeRole = async () => {
        const newRole = role === 'USER' ? 'ADMIN' : 'USER'
        try {
            const res = await updateProfileByAdmin(token, id, newRole)
            console.log('ดู handleChangeRole', res)
            setRole(res.data.user.role)
            toast.success(`เปลี่ยนบทบาทบัญชีเป็น ${res.data.user.role === 'ADMIN' ? 'แอดมิน' : 'ผู้ใช้ทั่วไป'} สำเร็จ`)
        } catch (err) {
            console.log('Error in change role', err)
            toast.error('เกิดข้อผิดพลาดในการเปลี่ยนบทบาทบัญชี')
        }
    }

    const handleBack = () => {
        navigate(-1)
    }

    if (loading) {
        return (
            <div className='flex flex-col items-center justify-center mt-16'>
                <Loader className='animate-spin text-brand-pink w-10 h-10 mb-2' />
                <p>กำลังโหลดข้อมูล...กรุณารอสักครู่</p>
            </div >
        )
    }

    if (!user) {
        return (
            <div className='items-center justify-center font-semibold'>ไม่พบข้อมูลผู้ใช้งาน</div>
        )
    }

    return (
        <div className='my-8 p-6 bg-white rounded-md shadow-md'>
            <div className='flex flex-col'>
                <p className='text-xl md:text-2xl mt-2 mb-2'>จัดการข้อมูลผู้ใช้งาน</p>
                <p className='text-md mt-2'>รหัสลูกค้า: &nbsp;{user.id}</p>
                <p className='text-md mt-2'>ชื่อ: &nbsp;{user.name}</p>
                <p className='text-md mt-2'>นามสกุล: &nbsp;{user.surname}</p>
                <p className='text-md mt-2'>อีเมล์: &nbsp;{user.email}</p>
                <p className='text-md mt-2'>ชื่อบัญชี: &nbsp;{user.username}</p>
                <p className='text-md mt-2'>เบอร์โทรศัพท์: &nbsp;{user.phone}</p>
                
                {stateUser?.role === 'SUPER_ADMIN' && ( // ให้เห็นเฉพาะ role นี้
                    <>
                        <p className='text-md mt-6 font-semibold'>สถานะบัญชี</p>
                        <div className='flex items-center justify-start space-x-4'>
                            <span className='text-md mt-2'>
                                สถานะบัญชี : <span className={status ? 'text-green-600' : 'text-red-600'}>
                                    {status ? 'เปิด' : 'ปิด'}
                                </span>
                            </span>
                            <ConfirmDialog
                                title='คุณแน่ใจหรือไม่?'
                                description={`คุณต้องการ ${status ? 'ปิด' : 'เปิด'} บัญชีของผู้ใช้รายนี้`}
                                confirmText='ยืนยัน'
                                cancelText='ยกเลิก'
                                onConfirm={() => handleChangeAccountStatus(user.id)}
                            >
                                <button
                                    className={`px-3 py-1 mt-2 rounded text-white transition-colors duration-200
                                ${status
                                            ? 'bg-red-500 hover:bg-red-600'     // ปิดบัญชี
                                            : 'bg-green-500 hover:bg-green-600' // เปิดบัญชี
                                        }`}
                                >
                                    {status ? 'ปิดบัญชี' : 'เปิดบัญชี'}
                                </button>
                            </ConfirmDialog>
                        </div>

                        <p className='text-md mt-6 font-semibold'>บทบาท</p>
                        <div className='flex items-center justify-start space-x-4'>
                            <span className='text-md mt-2'>
                                บทบาทผู้ใช้ : {role}
                            </span>
                            <ConfirmDialog
                                title='คุณแน่ใจหรือไม่?'
                                description={`คุณต้องการเปลี่ยนบทบาทเป็น ${role === 'ADMIN' ? 'ผู้ใช้ทั่วไป' : 'แอดมิน'} ของผู้ใช้รายนี้`}
                                confirmText='ยืนยัน'
                                cancelText='ยกเลิก'
                                onConfirm={handleChangeRole}
                            >
                                <button className='bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600'>
                                    เปลี่ยนบทบาท
                                </button>
                            </ConfirmDialog>
                        </div>
                    </>
                )} 

                <div className='flex mt-8'>
                    <button
                        type='button'
                        className='p-2 mr-6 bg-white text-brand-pink border-2 border-brand-pink rounded-md hover:bg-brand-pink
                    hover:text-white'
                        onClick={handleBack}
                    >
                        ย้อนกลับ
                    </button>
                </div>
            </div>
        </div>
    )
}

export default FormManageDetail
