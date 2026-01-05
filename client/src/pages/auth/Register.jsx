// rafce > React Arrow Function Component Export
import { useState } from 'react'
import axios from 'axios'
import { Link, useNavigate } from 'react-router-dom'
import { validateField, validateRegisterForm } from '@/utils/validateRegisterForm'
import Swal from 'sweetalert2'

const Register = () => {

  const navigate = useNavigate()

  const [form, setForm] = useState({
    username: '',
    name: '',
    surname: '',
    phone: '',
    email: '',
    password: '',
    confirmPassword: '',
  })

  const [errors, setErrors] = useState({})

  const handleOnChange = (e) => { 
    const { name, value } = e.target 
    setForm({
      ...form,
      [name]: value
    })

    // Real-time validation - ตรวจสอบฟิลด์ทันทีที่พิมพ์
    const fieldError = validateField(name, value, form)
    setErrors(prev => ({ ...prev, [name]: fieldError }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // ตรวจสอบ validation ทั้งหมด
    const { errors: validationErrors, isValid } = validateRegisterForm(form)
    setErrors(validationErrors)

    if (!isValid) return

    try {
      const res = await axios.post('/api/auth/register', form)
    //   console.log('TEST ', res)

      await Swal.fire({
        title: 'สำเร็จ!',
        text: res.data.message,
        icon: 'success',
        confirmButtonText: 'ตกลง',
        confirmButtonColor: '#10B981', // สีเขียว
        timer: 2000, // ปิดอัตโนมัติใน 2 วินาที
        timerProgressBar: true
      })

      // ส่ง state ไปด้วยเพื่อบอกว่ามาจากหน้า register
      navigate('/login', {
        state: { fromRegister: true }
      })

    } catch (err) {
    //   console.log('TEST ', err)
      if (err.response && err.response.status === 409) {
        const { field, message } = err.response.data
        setErrors(prev => ({ ...prev, [field]: message }))
      } else {
        Swal.fire({
            title: 'ลงทะเบียนไม่สำเร็จ',
            text: errMsg, 
            confirmButtonText: 'ตกลง'
        })
      }   
    }
  }

  return (
    <div className='min-h-[calc(100vh-14rem)] flex items-center justify-center py-4 px-2'>
      <div className='bg-zinc-50 p-4 sm:p-6 lg:p-8 rounded-2xl shadow-lg w-full max-w-2xl border border-gray-100'>
        <h2 className='text-xl sm:text-2xl font-semibold text-center text-brand-pink mb-4 sm:mb-6'>
          ลงทะเบียนใช้งาน findtrip
        </h2>

        <form onSubmit={handleSubmit} className='space-y-3 sm:space-y-4'>
          {/* Username */}
          <div>
            <label className='block text-gray-700 text-sm font-medium mb-1'>
              ชื่อบัญชี
            </label>
            <input
              type='text' // → กำหนดชนิดของ input 
              name='username' // → กำหนดชื่อฟิลด์ (ใช้ระบุว่า input นี้เก็บข้อมูลอะไร)
              className='w-full border border-gray-300 p-2 rounded-lg focus:ring-2' // → ช่องกรอกข้อมูล
              placeholder='Username กรอกเป็นภาษาอังกฤษ' // → ข้อความตัวอย่างที่แสดงในช่องก่อนผู้ใช้พิมพ์
              value={form.username} // → ค่าที่ผู้ใช้พิมพ์
              onChange={handleOnChange} // → ฟังก์ชันที่ทำงาน เมื่อผู้ใช้พิมพ์เข้ามาในช่องนี้
            />
            {errors.username && (
              <p className='text-red-500 text-sm mt-1'>{errors.username}</p>
            )}
          </div>

          {/* Name & Surname */}
          <div className='grid grid-cols-1 sm:grid-cols-2 gap-3'>
            <div>
              <label className='block text-gray-700'>
                ชื่อ
              </label>
              <input
                type='text'
                name='name'
                className='w-full border border-gray-300 p-2 rounded-lg'
                placeholder='Name'
                value={form.name}
                onChange={handleOnChange}
              />
              {errors.name && (
                <p className='text-red-500 text-sm mt-1'>{errors.name}</p>
              )}
            </div>

            <div>
              <label className='block text-gray-700 text-sm font-medium mb-1'>
                นามสกุล
              </label>
              <input
                type='text'
                name='surname'
                className='w-full border border-gray-300 p-2 rounded-lg'
                placeholder='Surname'
                value={form.surname}
                onChange={handleOnChange}
              />
              {errors.surname && (
                <p className='text-red-500 text-sm mt-1'>{errors.surname}</p>
              )}
            </div>
          </div>

          {/* Phone */}
          <div>
            <label className='block text-gray-700 text-sm font-medium mb-1'>
              เบอร์โทรศัพท์มือถือ
            </label>
            <input
              type='tel'
              name='phone'
              className='w-full border border-gray-300 p-2 rounded-lg'
              placeholder='Phone No.'
              value={form.phone}
              onChange={handleOnChange}
            />
            {errors.phone && (
              <p className='text-red-500 text-sm mt-1'>{errors.phone}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className='block text-gray-700 text-sm font-medium mb-1'>
              อีเมล์
            </label>
            <input
              type='email'
              name='email'
              className='w-full border border-gray-300 p-2 rounded-lg'
              placeholder='Email'
              value={form.email}
              onChange={handleOnChange}
            />
            {errors.email && (
              <p className='text-red-500 text-sm mt-1'>{errors.email}</p>
            )}
          </div>

          {/* Password & Confirm Password */}
          <div className='grid grid-cols-1 sm:grid-cols-2 gap-3'>
            <div>
              <label className='block text-gray-700'>
                รหัสผ่าน
              </label>
              <input
                type='password'
                name='password'
                className='w-full border border-gray-300 p-2 rounded-lg'
                placeholder='Password'
                value={form.password}
                onChange={handleOnChange}
                autoComplete='off'
              />
              {errors.password && (
                <p className='text-red-500 text-sm mt-1'>{errors.password}</p>
              )}
            </div>

            <div>
              <label className='block text-gray-700'>
                ยืนยันรหัสผ่าน
              </label>
              <input
                type='password'
                name='confirmPassword'
                className='w-full border border-gray-300 p-2 rounded-lg'
                placeholder='Confirmed Password'
                value={form.confirmPassword}
                onChange={handleOnChange}
                autoComplete='off'
              />
              {errors.confirmPassword && (
                <p className='text-red-500 text-sm mt-1'>{errors.confirmPassword}</p>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <button
            type='submit'
            className='w-full bg-brand-pink text-white py-2 rounded-lg hover:bg-pink-600 transition-colors duration-200 font-medium text-sm sm:text-base mt-4'>
            ลงทะเบียน
          </button>

          {/* Login Link */}
          <div className='flex flex-col sm:flex-row justify-center sm:justify-between items-center pt-2 text-xs sm:text-sm'>
            <p className='text-gray-400 mb-1 sm:mb-0'>
              เป็นสมาชิกอยู่แล้วใช่ไหม?
            </p>
            <Link
              to='/login'
              className='text-brand-pink hover:text-pink-600 underline transition-colors duration-200'
            >
              เข้าสู่ระบบตอนนี้
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Register
