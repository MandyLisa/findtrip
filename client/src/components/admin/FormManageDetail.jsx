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
        <div className='my-8 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-gray-200 sm:p-6'>
            <div className='flex flex-col gap-1'>
                <p className='text-base font-semibold text-gray-800 sm:text-lg'>จัดการข้อมูลผู้ใช้งาน</p>
                <p className='text-sm text-gray-600'>รหัสลูกค้า: {user.id}</p>
            </div>

            <div className='mt-5 grid grid-cols-1 gap-6 lg:grid-cols-2'>
                <div className='space-y-2'>
                    <p className='text-sm text-gray-700'>ชื่อ: {user.name}</p>
                    <p className='text-sm text-gray-700'>นามสกุล: {user.surname}</p>
                    <p className='text-sm text-gray-700'>อีเมล์: {user.email}</p>
                    <p className='text-sm text-gray-700'>ชื่อบัญชี: {user.username}</p>
                    <p className='text-sm text-gray-700'>เบอร์โทรศัพท์: {user.phone}</p>
                </div>

                {stateUser?.role === 'SUPER_ADMIN' && ( // ให้เห็นเฉพาะ role นี้
                    <div className='space-y-6'>
                        <div className='rounded-2xl bg-gray-50 p-4 ring-1 ring-gray-200'>
                            <p className='text-sm font-semibold text-gray-800'>สถานะบัญชี</p>
                            <div className='mt-2 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
                                <span className='text-sm text-gray-700'>
                                    สถานะบัญชี : <span className={status ? 'text-green-600 font-semibold' : 'text-red-600 font-semibold'}>
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
                                        className={`inline-flex items-center justify-center rounded-xl px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors
                                ${status
                                                ? 'bg-red-600 hover:bg-red-700'     // ปิดบัญชี
                                                : 'bg-green-600 hover:bg-green-700' // เปิดบัญชี
                                            }`}
                                    >
                                        {status ? 'ปิดบัญชี' : 'เปิดบัญชี'}
                                    </button>
                                </ConfirmDialog>
                            </div>
                        </div>

                        <div className='rounded-2xl bg-gray-50 p-4 ring-1 ring-gray-200'>
                            <p className='text-sm font-semibold text-gray-800'>บทบาท</p>
                            <div className='mt-2 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
                                <span className='text-sm text-gray-700'>บทบาทผู้ใช้ : {role}</span>
                                <ConfirmDialog
                                    title='คุณแน่ใจหรือไม่?'
                                    description={`คุณต้องการเปลี่ยนบทบาทเป็น ${role === 'ADMIN' ? 'ผู้ใช้ทั่วไป' : 'แอดมิน'} ของผู้ใช้รายนี้`}
                                    confirmText='ยืนยัน'
                                    cancelText='ยกเลิก'
                                    onConfirm={handleChangeRole}
                                >
                                    <button className='inline-flex items-center justify-center rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700'>
                                        เปลี่ยนบทบาท
                                    </button>
                                </ConfirmDialog>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <div className='mt-8 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center'>
                <button
                    type='button'
                    className='inline-flex items-center justify-center rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-brand-pink shadow-sm ring-1 ring-inset ring-brand-pink hover:bg-brand-pink hover:text-white'
                    onClick={handleBack}
                >
                    ย้อนกลับ
                </button>
            </div>
        </div>
    )
}

export default FormManageDetail
