import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Mail, CheckCircle } from 'lucide-react'
import Swal from 'sweetalert2'
import { forgotPassword } from '@/API/auth'

const ForgotPassword = () => {

    const [email, setEmail] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [isEmailSent, setIsEmailSent] = useState(false)
    const [errors, setErrors] = useState({})

    // ฟังก์ชั่นตรวจเฉพาะอีเมล์
    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!email.trim()) {
            return 'กรุณากรอกอีเมล์'
        }
        if (!emailRegex.test(email)) {
            return 'กรุณากรอกอีเมล์ให้ถูกต้อง'
        }
        return null
    }

    // ฟังก์ชั่นส่งคำขอรีเซ็ตรหัสผ่าน
    const handleSubmit = async (e) => {
        e.preventDefault()

        // ตรวจสอบอีเมล์
        const emailError = validateEmail(email)
        if (emailError) {
            setErrors({ email: emailError })
            return
        }

        setErrors({})
        setIsLoading(true)

        try {
            // เรียก API ส่งอีเมล์รีเซ็ตรหัสผ่าน
            const res = await forgotPassword(email)
            // console.log('ส่ง forgotPassword สำเร็จ: ', res.data)

            setIsEmailSent(true)
            Swal.fire({
                title: 'ส่งอีเมลสำเร็จ!',
                text: 'กรุณาตรวจสอบอีเมล์ของคุณเพื่อรีเซ็ตรหัสผ่าน',
                icon: 'success',
                confirmButtonText: 'ตกลง',
                confirmButtonColor: '#ea2c6d',
            })
        } catch (error) {
            console.error('Error forgotPassword: ', error)
            Swal.fire({
                title: 'เกิดข้อผิดพลาด',
                text: error.response?.data?.message,
                icon: 'error',
                confirmButtonText: 'ลองอีกครั้ง',
                confirmButtonColor: '#dc2626',
            })
        } finally {
            setIsLoading(false)
        }
    }

    // ฟังก์ชันส่งอีเมลอีกครั้ง
    const handleResendEmail = async () => {
        setIsEmailSent(false)
        await handleSubmit({ preventDefault: () => { } })
    }

    return (
        <div className='min-h-[calc(100vh-14rem)] flex items-center justify-center py-4 px-2'>
            <div className='bg-zinc-50 p-4 sm:p-6 lg:p-8 rounded-2xl shadow-lg w-full max-w-md border border-gray-100'>

                {/* Header */}
                <div className='text-center mb-6'>
                    <h2 className='text-3xl font-semibold text-center text-brand-pink mb-6'>
                        findtrip
                    </h2>
                </div>

                {!isEmailSent ? (
                    // ฟอร์มกรอกอีเมล
                    <div>
                        <div className='text-center mb-6'>
                            <h3 className='text-xl font-semibold text-gray-800 mb-2'>
                                ลืมรหัสผ่าน?
                            </h3>
                            <p className='text-gray-600 text-md'>
                                กรอกอีเมล์ของคุณ เราจะส่งลิงก์สำหรับรีเซ็ตรหัสผ่านให้
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className='space-y-4'>
                            <div>
                                <label className='block text-gray-700 text-md font-medium mb-2'>
                                    อีเมล์
                                </label>
                                <div className='relative'>
                                    <Mail className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5' />
                                    <input
                                        type='email'
                                        className='w-full border border-gray-300 p-2 pl-10 rounded-lg'
                                        placeholder='กรอกอีเมลของคุณ'
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        disabled={isLoading}
                                    />
                                </div>
                                {errors.email && (
                                    <p className='text-red-500 text-sm mt-1'>{errors.email}</p>
                                )}
                            </div>

                            <button
                                type='submit'
                                disabled={isLoading}
                                className='w-full bg-brand-pink text-white py-2 rounded-lg 
                                hover:bg-pink-600 font-medium mt-6 disabled:bg-gray-400 
                                disabled:cursor-not-allowed flex items-center justify-center'
                            >
                                {isLoading ? (
                                    <div className='flex items-center'>
                                        <div className='animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2'></div>
                                        กำลังส่ง...
                                    </div>
                                ) : (
                                    'ส่งลิงก์รีเซ็ตรหัสผ่าน'
                                )}
                            </button>
                        </form>
                    </div>
                ) : (
                    // หน้าจอ popup แสดงผลหลังส่งอีเมลสำเร็จ
                    <div className='text-center'>
                        <CheckCircle className='w-16 h-16 text-green-500 mx-auto mb-4' />
                        <h3 className='text-xl font-semibold text-gray-800 mb-2'>
                            ส่งอีเมลสำเร็จ!
                        </h3>
                        <p className='text-gray-600 text-sm mb-6'>
                            เราได้ส่งลิงก์สำหรับรีเซ็ตรหัสผ่านไปยัง<br />
                            <span className='font-medium text-brand-pink'>{email}</span>
                        </p>
                        <p className='text-gray-500 text-sm mb-6'>
                            กรุณาตรวจสอบกล่องจดหมายและโฟลเดอร์สแปม
                        </p>

                        <div className='space-y-3'>
                            <button
                                onClick={handleResendEmail}
                                disabled={isLoading}
                                className='w-full bg-gray-100 text-gray-700 py-2 rounded-lg 
                                hover:bg-gray-200 font-medium disabled:bg-gray-50 disabled:cursor-not-allowed'
                            >
                                {isLoading ? 'กำลังส่ง...' : 'ส่งอีเมลอีกครั้ง'}
                            </button>

                            <Link
                                to='/login'
                                className='block w-full bg-brand-pink text-white py-2 rounded-lg hover:bg-pink-600 font-medium text-center'
                            >
                                กลับไปหน้าเข้าสู่ระบบ
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default ForgotPassword
