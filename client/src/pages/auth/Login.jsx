import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import useAuthStore from '../../store/authStore'
import { validateField, validateLoginForm } from '@/utils/validateRegisterForm'
import Swal from 'sweetalert2'


const Login = () => {
    const navigate = useNavigate() // ถูกใช้ใน handleSubmit
    const actionLogin = useAuthStore((state) => state.actionLogin)
    const user = useAuthStore((state) => state.user)
    const token = useAuthStore((state) => state.token)

    useEffect(() => {
        // ถ้ามี user อยู่แล้ว (เช่น เข้ามาหน้า login ทั้งที่มี token ค้างอยู่) ค่อยดีดออก
        if (user && token) {
            redirectByRole(user.role)
        }
    }, []) // รันแค่รอบเดียวตอน Mount หรือตอน user/token เปลี่ยนจังหวะสำเร็จเท่านั้น

    const [form, setForm] = useState({
        identifier: '', // รับได้ทั้ง email และ username
        password: ''
    })

    // state เพื่อเก็บค่า error แต่ละฟิลด์
    const [errors, setErrors] = useState({})

    // อัปเดตค่าที่ผู้ใช้พิมพ์
    const handleOnChange = (e) => {
        const { name, value } = e.target
        setForm({
            ...form,
            [name]: value
        })

        // Real-time validation
        const fieldError = validateField(name, value, { ...form, isLogin: true })
        setErrors(prev => ({ ...prev, [name]: fieldError }))
    }

    const redirectByRole = (role) => {
        if (role === 'ADMIN' || role === 'SUPER_ADMIN') {
            navigate('/admin', { replace: true })
        } else {
            navigate('/', { replace: true })
        }
    }

    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true) // เริ่มโหลด

        // ตรวจสอบ validation
        const { errors: validationErrors, isValid } = validateLoginForm(form)
        setErrors(validationErrors)

        if (!isValid) return

        try {
            const res = await actionLogin(form)
            // console.log('TEST Login === ', res)

            await Swal.fire({
                title: 'เข้าสู่ระบบสำเร็จ!',
                text: `ยินดีต้อนรับ ${res.data.users.name}`,
                icon: 'success',
                confirmButtonText: 'ตกลง',
                confirmButtonColor: '#ec4899',
            })

            const role = res.data.users.role
            redirectByRole(role) // สั่ง redirects หลังจาก login สำเร็จ โดยดูจาก role ของ user

        } catch (error) {
            const errMsg = error.response?.data?.message || 'เกิดข้อผิดพลาดในการเข้าสู่ระบบ ไม่สามารถติดต่อเซิร์ฟเวอร์ได้'

            await Swal.fire({
                title: 'เข้าสู่ระบบไม่สำเร็จ',
                text: errMsg,
                icon: 'error',
                confirmButtonText: 'ลองอีกครั้ง',
                confirmButtonColor: '#dc2626'
            })
        } finally {
            setLoading(false) // จบโหลด
        }
    }

    return (
        <>
            {!user && (
                <div className='min-h-[calc(100vh-14rem)] flex items-center justify-center py-4 px-2'>
                    <div className='bg-zinc-50 p-4 sm:p-6 lg:p-8 rounded-2xl shadow-lg w-full max-w-md border border-gray-100'>
                        <div className='text-center mb-6'>
                            <h2 className='text-3xl font-semibold text-center text-brand-pink mb-6'>
                                findtrip
                            </h2>
                            <p className='text-gray-700 text-lg font-semibold'>
                                หาทัวร์ที่ใช่ โดนใจคุณ
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className='space-y-4'>
                            {/* Username/Email */}
                            <div>
                                <label className='block text-gray-700 text-md font-medium mb-2'>
                                    Username or Email
                                </label>
                                <input
                                    name='identifier'
                                    type='text'
                                    className='w-full border border-gray-300 p-2 rounded-lg'
                                    placeholder='ชื่อบัญชีหรืออีเมล์'
                                    value={form.identifier}
                                    onChange={handleOnChange}
                                />
                                {errors.identifier && (
                                    <p className='text-red-500 text-sm mt-1'>{errors.identifier}</p>
                                )}
                            </div>

                            {/* Password */}
                            <div>
                                <label className='block text-gray-700 text-md font-medium mb-2'>Password</label>
                                <input
                                    name='password'
                                    type='password'
                                    className='w-full border border-gray-300 p-2 rounded-lg'
                                    placeholder='กรอกรหัสผ่าน'
                                    value={form.password}
                                    onChange={handleOnChange}
                                />
                                {errors.password && (
                                    <p className='text-red-500 text-sm mt-1'>{errors.password}</p>
                                )}
                            </div>

                            {/* Submit Button */}
                            <button
                                disabled={loading} // ถ้าโหลดอยู่ ให้กดไม่ได้
                                type='submit'
                                className='w-full bg-brand-pink text-white py-2 rounded-lg hover:bg-pink-600 font-medium mt-6'>
                                {loading ? 'กำลังตรวจสอบ...' : 'เข้าสู่ระบบ'}
                            </button>

                            {/* Links */}
                            <div className='flex justify-between'>
                                <div className='flex justify-start'>
                                    <p className='text-sm font-medium text-center text-gray-400 mb-1 sm:mb-0 pr-2'>
                                        ยังไม่เป็นสมาชิกใช่ไหม?
                                    </p>
                                    <p className='text-sm font-medium text-center text-brand-pink mb-6'>
                                        <Link
                                            to='/register'
                                            className='text-brand-pink hover:text-pink-600 font-medium'
                                        >
                                            ลงทะเบียนเลย
                                        </Link>
                                    </p>
                                </div>

                                {/* Forgot Password Link */}
                                <p className='text-sm font-medium text-center hover:underline ml-1 text-brand-pink mb-6'>
                                    <Link
                                        to='/forgot-password'
                                    >
                                        ลืมรหัสผ่าน?
                                    </Link>
                                </p>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    )
}

export default Login
