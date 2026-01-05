import { useState, useEffect } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, Lock, CheckCircle } from 'lucide-react'
import Swal from 'sweetalert2'
import { resetPassword, verifyResetToken } from '@/API/auth'

const ResetPassword = () => {
    const { token } = useParams() // รับ token จาก URL ใช้ token นี้ส่งไปยัง backend เพื่อรีเซ็ตรหัสผ่าน
    const navigate = useNavigate()

    const [formData, setFormData] = useState({
        newPassword: '',
        confirmPassword: ''
    })
    const [showPassword, setShowPassword] = useState({
        newPassword: false,
        confirmPassword: false
    })
    const [errors, setErrors] = useState({})
    const [isLoading, setIsLoading] = useState(false)
    const [isTokenValid, setIsTokenValid] = useState(null)
    const [isSuccess, setIsSuccess] = useState(false)

    // ตรวจสอบ token เมื่อโหลดหน้า
    useEffect(() => {
        const verifyToken = async () => {

            if (!token) {
                setIsTokenValid(false)
                return
            }

            try {
                const res = await verifyResetToken(token)
                // console.log('ดู Token valid', res.data)
                setIsTokenValid(true)

            } catch (error) {
                console.error('Error verifying token:', error)
                setIsTokenValid(false)
            }
        }
        if (token) {
            verifyToken()
        }

    }, [token])

    // ฟังก์ชันตรวจสอบรหัสผ่าน
    const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[\W_]).{8,}$/

    const validatePassword = (password) => {
        if (!password.trim()) {
            return 'กรุณากรอกรหัสผ่าน'
        }
        if (!passwordRegex.test(password)) {
            return 'รหัสผ่านต้องมีอย่างน้อย 8 ตัว รวมถึง ตัวอักษร ตัวเลข และอักขระพิเศษ'
        }
        return null
    }

    // ฟังก์ชันตรวจสอบรหัสผ่านยืนยัน
    const validateConfirmPassword = (confirmPassword, newPassword) => {
        if (!confirmPassword.trim()) {
            return 'กรุณายืนยันรหัสผ่าน'
        }
        if (confirmPassword !== newPassword) {
            return 'รหัสผ่านไม่ตรงกัน'
        }
        return null
    }

    // ฟังก์ชันจัดการการเปลี่ยนแปลงข้อมูล
    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))

        // Real-time validation
        let error = null
        if (name === 'newPassword') {
            error = validatePassword(value)
        } else if (name === 'confirmPassword') {
            error = validateConfirmPassword(value, formData.newPassword)
        }

        setErrors(prev => ({
            ...prev,
            [name]: error
        }))
    }

    // ฟังก์ชันแสดง/ซ่อนรหัสผ่าน
    const togglePasswordVisibility = (field) => {
        setShowPassword(prev => ({
            ...prev,
            [field]: !prev[field]
        }))
    }

    // ฟังก์ชันส่งข้อมูลรีเซ็ตรหัสผ่าน
    const handleSubmit = async (e) => {
        e.preventDefault()

        // ตรวจสอบข้อมูล
        const newPasswordError = validatePassword(formData.newPassword)
        const confirmPasswordError = validateConfirmPassword(formData.confirmPassword, formData.newPassword)

        if (newPasswordError || confirmPasswordError) {
            setErrors({
                newPassword: newPasswordError,
                confirmPassword: confirmPasswordError
            })
            return
        }

        setErrors({})
        setIsLoading(true)

        try {
            const res = await resetPassword({ token, newPassword: formData.newPassword })
            // console.log('ดู Reset Password', res.data)

            setIsSuccess(true)
            Swal.fire({
                title: 'รีเซ็ตรหัสผ่านสำเร็จ!',
                text: 'รหัสผ่านของคุณได้รับการเปลี่ยนแปลงเรียบร้อยแล้ว',
                icon: 'success',
                confirmButtonText: 'ไปหน้าเข้าสู่ระบบ',
                confirmButtonColor: '#ea2c6d',
            }).then(() => {
                navigate('/login', {replace: true}) // replace = ปิดหน้า reset ไปเลย
            })

        } catch (error) {
            console.error('Error ของ resetPassword: ', error)
            Swal.fire({
                title: 'เกิดข้อผิดพลาด',
                text: error.message || 'ไม่สามารถรีเซ็ตรหัสผ่านได้ในขณะนี้',
                icon: 'error',
                confirmButtonText: 'ลองอีกครั้ง',
                confirmButtonColor: '#dc2626',
            })
        } finally {
            setIsLoading(false)
        }
    }

    // แสดง Loading ระหว่างตรวจสอบ token
    if (isTokenValid === null) {
        return (
            <div className='min-h-[calc(100vh-14rem)] flex items-center justify-center py-4 px-2'>
                <div className='bg-zinc-50 p-8 rounded-2xl shadow-lg w-full max-w-md border border-gray-100'>
                    <div className='text-center'>
                        <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-brand-pink mx-auto mb-4'></div>
                        <p className='text-gray-600'>กำลังตรวจสอบ...</p>
                    </div>
                </div>
            </div>
        )
    }

    // แสดงข้อผิดพลาดหาก token ไม่ถูกต้อง
    if (isTokenValid === false) {
        return (
            <div className='min-h-[calc(100vh-14rem)] flex items-center justify-center py-4 px-2'>
                <div className='bg-zinc-50 p-8 rounded-2xl shadow-lg w-full max-w-md border border-gray-100'>
                    <div className='text-center'>
                        <div className='text-red-500 mb-4'>
                            <svg className='w-16 h-16 mx-auto' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' />
                            </svg>
                        </div>
                        <h3 className='text-xl font-semibold text-gray-800 mb-2'>
                            ลิงก์ไม่ถูกต้องหรือหมดอายุ
                        </h3>
                        <p className='text-gray-600 text-sm mb-6'>
                            ลิงก์รีเซ็ตรหัสผ่านนี้ไม่ถูกต้องหรือหมดอายุแล้ว
                        </p>
                        <div className='space-y-3'>
                            <Link
                                to='/forgot-password'
                                className='block w-full bg-brand-pink text-white py-2 rounded-lg hover:bg-pink-600 font-medium text-center'
                            >
                                ขอลิงก์ใหม่
                            </Link>
                            <Link
                                to='/login'
                                className='block w-full bg-gray-100 text-gray-700 py-2 rounded-lg hover:bg-gray-200 font-medium text-center'
                            >
                                กลับไปหน้าเข้าสู่ระบบ
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className='min-h-[calc(100vh-4rem)] flex items-center justify-center py-4 px-2'>
            <div className='bg-zinc-50 p-4 sm:p-6 lg:p-8 rounded-2xl shadow-lg w-full max-w-md border border-gray-100'>

                {/* Header */}
                <div className='text-center mb-6'>
                    <h2 className='text-3xl font-semibold text-center text-brand-pink mb-6'>
                        findtrip
                    </h2>
                </div>

                {!isSuccess ? (
                    <div>
                        <div className='text-center mb-6'>
                            <h3 className='text-xl font-semibold text-gray-800 mb-2'>
                                ตั้งรหัสผ่านใหม่
                            </h3>
                            <p className='text-gray-600 text-sm'>
                                กรอกรหัสผ่านใหม่ของคุณ
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className='space-y-4'>
                            {/* New Password */}
                            <div>
                                <label className='block text-gray-700 text-md font-medium mb-2'>
                                    รหัสผ่านใหม่
                                </label>
                                <div className='relative'>
                                    <Lock className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5' />
                                    <input
                                        type={showPassword.newPassword ? 'text' : 'password'}
                                        name='newPassword'
                                        className='w-full border border-gray-300 p-2 pl-10 pr-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-pink focus:border-transparent'
                                        placeholder='กรอกรหัสผ่านใหม่'
                                        value={formData.newPassword}
                                        onChange={handleChange}
                                        disabled={isLoading}
                                    />
                                    <button
                                        type='button'
                                        className='absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600'
                                        onClick={() => togglePasswordVisibility('newPassword')}
                                    >
                                        {showPassword.newPassword ? <EyeOff className='w-5 h-5' /> : <Eye className='w-5 h-5' />}
                                    </button>
                                </div>
                                {errors.newPassword && (
                                    <p className='text-red-500 text-sm mt-1'>{errors.newPassword}</p>
                                )}
                            </div>

                            {/* Confirm Password */}
                            <div>
                                <label className='block text-gray-700 text-md font-medium mb-2'>
                                    ยืนยันรหัสผ่านใหม่
                                </label>
                                <div className='relative'>
                                    <Lock className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5' />
                                    <input
                                        type={showPassword.confirmPassword ? 'text' : 'password'}
                                        name='confirmPassword'
                                        className='w-full border border-gray-300 p-2 pl-10 pr-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-pink focus:border-transparent'
                                        placeholder='ยืนยันรหัสผ่านใหม่'
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        disabled={isLoading}
                                    />
                                    <button
                                        type='button'
                                        className='absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600'
                                        onClick={() => togglePasswordVisibility('confirmPassword')}
                                    >
                                        {showPassword.confirmPassword ? <EyeOff className='w-5 h-5' /> : <Eye className='w-5 h-5' />}
                                    </button>
                                </div>
                                {errors.confirmPassword && (
                                    <p className='text-red-500 text-sm mt-1'>{errors.confirmPassword}</p>
                                )}
                            </div>

                            <button
                                type='submit'
                                disabled={isLoading}
                                className='w-full bg-brand-pink text-white py-2 rounded-lg hover:bg-pink-600 font-medium mt-6 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center'
                            >
                                {isLoading ? (
                                    <div className='flex items-center'>
                                        <div className='animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2'></div>
                                        กำลังอัปเดต...
                                    </div>
                                ) : (
                                    'อัปเดตรหัสผ่าน'
                                )}
                            </button>
                        </form>
                    </div>
                ) : (
                    <div className='text-center'>
                        <CheckCircle className='w-16 h-16 text-green-500 mx-auto mb-4' />
                        <h3 className='text-xl font-semibold text-gray-800 mb-2'>
                            รีเซ็ตรหัสผ่านสำเร็จ!
                        </h3>
                        <p className='text-gray-600 text-sm mb-6'>
                            รหัสผ่านของคุณได้รับการเปลี่ยนแปลงเรียบร้อยแล้ว
                        </p>
                        <Link
                            to='/login'
                            className='block w-full bg-brand-pink text-white py-2 rounded-lg hover:bg-pink-600 font-medium text-center'
                        >
                            ไปหน้าเข้าสู่ระบบ
                        </Link>
                    </div>
                )}
            </div>
        </div>
    )
}

export default ResetPassword