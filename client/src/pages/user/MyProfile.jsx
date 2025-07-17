import { useEffect, useState } from 'react'
import { Edit3, Loader, PlusCircle } from 'lucide-react'
import useAuthStore from '../../store/authStore'
import { useNavigate } from 'react-router-dom'
import { getUserProfile, updateUserProfile } from '../../API/profile'
import UserSidebar from '../../components/user/UserSidebar'
import { toast } from 'sonner'

const MyProfile = () => {
    const navigate = useNavigate()
    const { token, user: authUser, actionUpdateUser } = useAuthStore()
    const [loading, setLoading] = useState(true)

    // state for fetch and edit profile
    const [userData, setUserData] = useState({ // เก็บข้อมูลโปรไฟล์ที่ได้จาก API
        username: '',
        email: '',
        name: '',
        surname: '',
        phone: '',
        address: '',
    })
    const [editingField, setEditingField] = useState(null) // ใช้เก็บชื่อ field ที่กำลังแก้ไขอยู่ 
    const [editedValue, setEditedValue] = useState('') // เก็บค่าที่ผู้ใช้กำลังพิมพ์แก้ไข


    useEffect(() => {
        if (!token) {
            navigate('/login')
            return
        }
        fetchProfile()
    }, [token, navigate])

    // fetch ข้อมูลจากหลังบ้าน
    const fetchProfile = async () => {
        try {
            setLoading(true)
            const res = await getUserProfile(token)
            // console.log('ดู fetchProfile', res.data.user)
            setUserData(res.data.user)
        } catch (error) {
            console.log('Error fetching Profile', error)
        } finally {
            setLoading(false)
        }
    }

    const handleEdit = (field, currentValue) => {
        setEditingField(field)
        setEditedValue(currentValue || '') // ตั้งค่าค่าเริ่มต้นใน input field
    }

    const handleCancelEdit = () => {
        setEditingField(null) // ยกเลิกการแก้ไข
        setEditedValue('') // ล้างค่าใน input field
    }


    const handleSave = async (fieldToUpdate) => {
        try {
            setLoading(true)

            const updatedUserData = { [fieldToUpdate]: editedValue } // สร้าง object ที่มีเฉพาะ field ที่ต้องการอัพเดต
            const res = await updateUserProfile(token, updatedUserData) // เรียก API เพื่อบันทึกข้อมูลไป Backend
            // console.log('ดู updatedUserData', res.data.user)

            if (res.data.success) { // ถ้า backend ส่งมาว่า สำเร็จ
                setUserData(prevData => ({ // อัพเดต userData ใน state ด้วยข้อมูลใหม่ที่บันทึกสำเร็จ
                    ...prevData,
                    [fieldToUpdate]: editedValue
                }))

                // // อัพเดตข้อมูล user ใน Zustand store
                if (authUser) {
                    actionUpdateUser({ [fieldToUpdate]: editedValue })
                }

                setEditingField(null) // ปิดโหมดแก้ไข
                setEditedValue('') // ล้างค่าที่แก้ไข
                toast.success('บันทึกข้อมูลสำเร็จ!')
            }

        } catch (error) {
            console.error('Error saving profile data: ', error)
            toast.error('ไม่สามารถบันทึกข้อมูลได้ โปรดลองใหม่อีกครั้ง')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className='flex flex-col xl:flex-row gap-4 lg:gap-6 h-full max-h-full overflow-hidden'>
            <UserSidebar />

            {/* Right - Update Profile Section */}
            <div className='flex-1 bg-white rounded-lg shadow-sm border overflow-hidden flex flex-col'>
                <div className='p-4 lg:p-6 flex-1 overflow-y-auto'>
                    <div className='flex items-center justify-between mb-4 lg:mb-6'>
                        <h2 className='text-lg lg:text-xl font-semibold text-gray-800'>อัพเดทข้อมูลส่วนตัว</h2>
                    </div>
                    {loading ? (
                        <div className='flex flex-col items-center justify-center mt-16'>
                            <Loader className='animate-spin text-brand-pink w-10 h-10 mb-2' />
                            <p className='text-center text-gray-500 mt-8'>กำลังโหลดข้อมูล...กรุณารอสักครู่</p>
                        </div>
                    ) : (
                        < div className='space-y-4 lg:space-y-6'>
                            {/* Username */}
                            <div className='border-b pb-3 lg:pb-4'>
                                <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2'>
                                    <div className='text-sm lg:text-base text-gray-600'>ชื่อผู้ใช้</div>
                                    <div className='text-gray-800 font-medium text-sm lg:text-base break-all'>{userData.username}</div>
                                </div>
                            </div>

                            {/* Email */}
                            <div className='border-b pb-3 lg:pb-4'>
                                <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2'>
                                    <div className='text-sm lg:text-base text-gray-600'>อีเมล์</div>
                                    <div className='text-gray-800 font-medium text-sm lg:text-base break-all'>{userData.email}</div>
                                </div>
                            </div>

                            {/* ชื่อ */}
                            <div className='border-b pb-3 lg:pb-4'>
                                <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2'>
                                    <div className='text-sm lg:text-base text-gray-600'>ชื่อ</div>
                                    {editingField === 'name' ? (
                                        <div className='flex flex-col sm:flex-row items-stretch sm:items-center gap-2'>
                                            <input
                                                type='text'
                                                value={editedValue}
                                                onChange={(e) => setEditedValue(e.target.value)}
                                                className='border rounded px-2 py-1 text-sm lg:text-base w-full sm:w-auto'
                                                autoFocus
                                            />
                                            <div className='flex gap-2'>
                                                <button onClick={() => handleSave('name')} className='bg-brand-pink text-white px-3 py-1 rounded text-xs lg:text-sm flex-1 sm:flex-none'>
                                                    บันทึก
                                                </button>
                                                <button onClick={handleCancelEdit} className='bg-gray-300 text-gray-700 px-3 py-1 rounded text-xs lg:text-sm flex-1 sm:flex-none'>
                                                    ยกเลิก
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className='flex items-center gap-2 justify-between sm:justify-end'>
                                            <div className='text-gray-800 font-medium text-sm lg:text-base'>{userData.name}</div>
                                            <button onClick={() => handleEdit('name', userData.name)} className='text-gray-500 hover:text-brand-pink flex-shrink-0'>
                                                <Edit3 size={16} className='lg:w-[18px] lg:h-[18px]' />
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* นามสกุล */}
                            <div className='border-b pb-3 lg:pb-4'>
                                <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2'>
                                    <div className='text-sm lg:text-base text-gray-600'>นามสกุล</div>
                                    {editingField === 'surname' ? (
                                        <div className='flex flex-col sm:flex-row items-stretch sm:items-center gap-2'>
                                            <input
                                                type='text'
                                                value={editedValue}
                                                onChange={(e) => setEditedValue(e.target.value)}
                                                className='border rounded px-2 py-1 text-sm lg:text-base w-full sm:w-auto'
                                                autoFocus
                                            />
                                            <div className='flex gap-2'>
                                                <button onClick={() => handleSave('surname')} className='bg-brand-pink text-white px-3 py-1 rounded text-xs lg:text-sm flex-1 sm:flex-none'>
                                                    บันทึก
                                                </button>
                                                <button onClick={handleCancelEdit} className='bg-gray-300 text-gray-700 px-3 py-1 rounded text-xs lg:text-sm flex-1 sm:flex-none'>
                                                    ยกเลิก
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className='flex items-center gap-2 justify-between sm:justify-end'>
                                            <div className='text-gray-800 font-medium text-sm lg:text-base'>{userData.surname}</div>
                                            <button onClick={() => handleEdit('surname', userData.surname)} className='text-gray-500 hover:text-brand-pink flex-shrink-0'>
                                                <Edit3 size={16} className='lg:w-[18px] lg:h-[18px]' />
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* หมายเลขโทรศัพท์ */}
                            <div className='border-b pb-3 lg:pb-4'>
                                <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2'>
                                    <div className='text-sm lg:text-base text-gray-600'>หมายเลขโทรศัพท์</div>
                                    {editingField === 'phone' ? (
                                        <div className='flex flex-col sm:flex-row items-stretch sm:items-center gap-2'>
                                            <input
                                                type='text'
                                                value={editedValue}
                                                onChange={(e) => setEditedValue(e.target.value)}
                                                className='border rounded px-2 py-1 text-sm lg:text-base w-full sm:w-auto'
                                                autoFocus
                                            />
                                            <div className='flex gap-2'>
                                                <button onClick={() => handleSave('phone')} className='bg-brand-pink text-white px-3 py-1 rounded text-xs lg:text-sm flex-1 sm:flex-none'>
                                                    บันทึก
                                                </button>
                                                <button onClick={handleCancelEdit} className='bg-gray-300 text-gray-700 px-3 py-1 rounded text-xs lg:text-sm flex-1 sm:flex-none'>
                                                    ยกเลิก
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className='flex items-center gap-2 justify-between sm:justify-end'>
                                            <div className='text-gray-800 font-medium text-sm lg:text-base'>{userData.phone || '-'}</div>
                                            <button onClick={() => handleEdit('phone', userData.phone)} className='text-gray-500 hover:text-brand-pink flex-shrink-0'>
                                                <Edit3 size={16} className='lg:w-[18px] lg:h-[18px]' />
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* ที่อยู่ */}
                            <div className='pb-3 lg:pb-4'>
                                <div className='flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2'>
                                    <div className='text-sm lg:text-base text-gray-600 sm:pt-1'>ที่อยู่</div>
                                    {editingField === 'address' ? (
                                        <div className='flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:flex-1 sm:max-w-md'>
                                            <textarea
                                                value={editedValue}
                                                onChange={(e) => setEditedValue(e.target.value)}
                                                className='border rounded px-2 py-1 text-sm lg:text-base w-full resize-none'
                                                rows={2}
                                                autoFocus
                                            />
                                            <div className='flex gap-2 sm:flex-col xl:flex-row'>
                                                <button
                                                    onClick={() => handleSave('address')}
                                                    className='bg-brand-pink text-white px-3 py-1 rounded text-xs lg:text-sm flex-1 sm:flex-none whitespace-nowrap'
                                                >
                                                    บันทึก
                                                </button>
                                                <button
                                                    onClick={handleCancelEdit}
                                                    className='bg-gray-300 text-gray-700 px-3 py-1 rounded text-xs lg:text-sm flex-1 sm:flex-none whitespace-nowrap'
                                                >
                                                    ยกเลิก
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className='flex items-start gap-2 justify-between sm:justify-end sm:flex-1 sm:max-w-md'>
                                            <div className='text-gray-800 font-medium text-sm lg:text-base break-words'>{userData.address || ''}</div>
                                            {userData.address ? (
                                                <button
                                                    onClick={() => handleEdit('address', userData.address)}
                                                    className='text-gray-500 hover:text-brand-pink flex-shrink-0 mt-0.5'
                                                >
                                                    <Edit3 size={16} className='lg:w-[18px] lg:h-[18px]' />
                                                </button>
                                            ) : (
                                                <button
                                                    onClick={() => handleEdit('address', '')}
                                                    className='text-gray-500 hover:text-brand-pink flex items-center gap-1 text-xs lg:text-sm flex-shrink-0'
                                                >
                                                    <PlusCircle size={16} className='lg:w-[18px] lg:h-[18px]' />
                                                    เพิ่ม
                                                </button>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div >
    )
}

export default MyProfile
