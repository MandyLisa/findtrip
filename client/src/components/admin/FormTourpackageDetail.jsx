import { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import { Pencil } from 'lucide-react'
import { ImageUp } from 'lucide-react'
import { FileText } from 'lucide-react'
import { createTourpackage, readTourpackage, removeTourpackage, updateTourpackage } from '../../API/tourpackage'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { useNavigate } from 'react-router-dom'
import UploadImage from './UploadImage'
import UploadPDF from './UploadPDF'
import { useParams } from 'react-router-dom' 
import useAuthStore from '../../store/authStore'
import ConfirmDialog from '../ui/ConfirmDialog'
import usePublicStore from '@/store/publicStore'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { th } from 'date-fns/locale'
import { validateTourForm } from '@/utils/validateTourForm'

const createForm = {
  title: '',
  tourCode: '',
  categoryId: '',
  countryId: '',
  airline: '',
  starRating: '',
  startDate: '',
  endDate: '',
  duration: '',
  priceAdult: '',
  priceChild: '',
  singleStayExtra: '',
  priceVisa: '',
  priceGuide: '',
  maxSeats: '',
  itinerary: '',
  isRecommend: false,
  isActive: true,
  images: [],
  tourPDF: null
}

//เรียกใช้ component นี้ที่หน้า pages TourpackageDetail.jsx
const FormTourpackageDetail = () => {

  const { id } = useParams()
  const token = useAuthStore((state) => state.token)
  const categories = usePublicStore((state) => state.categories)
  const countries = usePublicStore((state) => state.countries)
  const fetchCategories = usePublicStore((state) => state.fetchCategories)
  const fetchCountries = usePublicStore((state) => state.fetchCountries)


  const [form, setForm] = useState(createForm) // 24.20 / EP.12 6.30
  const [editMode, setEditMode] = useState(false)

  useEffect(() => {
    if (token) {
      fetchCategories()
      fetchCountries()
      if (id) {
        fetchTourpackage(token, id)
        setEditMode(true)
      }
    }
  }, [token, id])

  const fetchTourpackage = async (token, id) => {
    try {
      const res = await readTourpackage(token, id)
      console.log('ดู fetch Tourpackage', res)
      const data = res.data
      setForm({
        ...data,
        startDate: data.startDate ? data.startDate.slice(0, 10) : '',
        endDate: data.endDate ? data.endDate.slice(0, 10) : ''
      })
      // console.log(data)
    } catch (err) {
      console.log('Error fetch Tourpackage', err)
    }
  }

  // 26.45 เอาไว้เก็บ input ที่มาจากการพิมพ์ใน กล่องข้อความ
  const handleOnChange = (e) => {
    // console.log(e.target.name, e.target.value)
    setForm({
      ...form, // 38.08 คัดลอกข้อมูลเดิม และจะเพิ่ม properties ตัวต่อไป
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const isValid = validateTourForm(form)
    if (!isValid) return


    const formToSubmit = { // แปลงตัวเลขก่อนส่ง
      ...form,
      starRating: Number(form.starRating),
      priceAdult: Number(form.priceAdult),
      priceChild: Number(form.priceChild),
      singleStayExtra: Number(form.singleStayExtra),
      priceGuide: Number(form.priceGuide),
      priceVisa: Number(form.priceVisa || 0),
      maxSeats: Number(form.maxSeats)
    }

    try {
      if (!id) {
        const res = await createTourpackage(token, formToSubmit)
        toast.success(`เพิ่มรายการสำเร็จ`)
        navigate('/admin/tourpackage')

      } else {
        const res = await updateTourpackage(token, id, formToSubmit)
        toast.success(`อัพเดตรายการสำเร็จ`)
        navigate('/admin/tourpackage')
      }
    } catch (err) {
      const message = err?.response?.data?.error
      toast.error(message || 'เกิดข้อผิดพลาดบางอย่าง')
    }
  }

  const [formKey, setFormKey] = useState(0)
  const handleReset = () => {
    setForm(createForm)
    setFormKey((prev) => prev + 1)
    toast.success('ล้างข้อมูลฟอร์มเรียบร้อยแล้ว')
  }

  const handleRemove = async (id) => {
    try {
      const res = await removeTourpackage(token, id)
      toast.success('ลบข้อมูลสำเร็จ')
      navigate('/admin/tourpackage')
    } catch (err) {
      console.log(err)
    }
  }

  const navigate = useNavigate()
  const handleBack = () => {
    navigate('/admin/tourpackage')
  }


  const inputClass = `w-full px-2 py-1 border-2 rounded border-blue-600 
  ${editMode ? 'bg-gray-100 border-gray-400' : 'bg-white border-blue-600'}`


  return (
    <>
      <form onSubmit={handleSubmit}>
        {/* Add Tourpackage Details */}
        <div className='p-4 bg-white shadow-md w-full rounded-md'>
          <div className='inline-flex items-center'>
            <div className='bg-blue-600 w-12 h-12 flex items-center justify-center'>
              <Pencil className='w-6 h-6 text-white' />
            </div>
            <h1 className='ml-3 text-lg font-medium text-gray-700'>เพิ่มรายละเอียดหลัก</h1>
          </div>


          <div className='flex flex-row mt-4 gap-4'>
            <div className='flex flex-col basis-2/3'>
              <label className='text-md mb-2'>ชื่อทัวร์แพ็คเกจ/Title
                <span className='text-red-500'>*</span>
              </label>
              <input
                value={form.title}
                // 27.20 เมื่อ input มีการเปลี่ยนแปลง เช่นมีการพิมพ์ข้อมูลเข้ามา เราก็จะให้เค้าทำ function handleOnChange
                onChange={handleOnChange}
                className={`${inputClass} basis-2/3`}
                placeholder='ตัวอย่าง: ทัวร์ญี่ปุ่น โตเกียว ฟูจิ หมู่บ้านน้ำใสโอชิโนะฮักไก ชิบูย่า 2025'
                name='title' // ต้องตรงกันกับตัว state ที่ประกาศไว้ข้างบน
                type='text'
              />
            </div>

            <div className='flex flex-col basis-1/3'>
              <label className='text-md mb-2'>รหัสทัวร์/Tour Code
                <span className='text-red-500'>*</span>
              </label>
              <input
                value={form.tourCode}
                onChange={handleOnChange}
                className={`${inputClass} basis-1/3`}
                placeholder='ตัวอย่าง: AS-JP-25-001'
                name='tourCode'
                type='text'
                disabled={id}
              />
            </div>

            <div className='flex flex-col basis-1/3'>
              <label className='text-md mb-2'>ประเภท-ทวีป/Category
                <span className='text-red-500'>*</span>
              </label>
              <select
                value={form.categoryId}
                className={`${inputClass} basis-1/3`}
                name='categoryId'
                onChange={handleOnChange}
                required
              >
                <option value='' disabled>กรุณาเลือก</option>
                {
                  categories.map((item, index) =>
                    <option key={index} value={item.id}>{item.name}</option>
                  )
                }
              </select>
            </div>
          </div>


          <div className='flex flex-row mt-4 gap-4'>
            <div className='flex flex-col basis-1/4'>
              <label className='text-md mb-2'>ประเทศ/Country
                <span className='text-red-500'>*</span>
              </label>
              <select
                value={form.countryId}
                className={`${inputClass} basis-1/4`}
                name='countryId'
                onChange={handleOnChange}
                required
              >
                <option value='' disabled>กรุณาเลือก</option>
                {
                  countries.map((item, index) =>
                    <option key={index} value={item.id}>{item.name}</option>
                  )
                }
              </select>
            </div>

            <div className='flex flex-col basis-1/4'>
              <label className='text-md mb-2'>สายการบิน/Airline
                <span className='text-red-500'>*</span>
              </label>
              <input
                value={form.airline}
                onChange={handleOnChange}
                className={`${inputClass} basis-1/4`}
                name='airline'
                type='text'
              />
            </div>

            <div className='flex flex-col basis-1/4'>
              <label className='text-md mb-2'>โรงแรม/Star Rating
                <span className='text-red-500'>*</span>
              </label>
              <input
                value={form.starRating}
                onChange={handleOnChange}
                className={`${inputClass} basis-1/4`}
                name='starRating'
                type='number'
              />
            </div>

            <div className='flex flex-col basis-1/4'>
              <label className='text-md mb-2'>ราคาผู้ใหญ่/Price Adult
                <span className='text-red-500'>*</span>
              </label>
              <input
                value={form.priceAdult}
                onChange={handleOnChange}
                className={`${inputClass} basis-1/4`}
                name='priceAdult'
                type='number'
              />
            </div>
          </div>

          <div className='flex flex-row mt-4 gap-4'>
            <div className='flex flex-col basis-1/4'>
              <label className='text-md mb-2'>วันที่เดินทาง/Start Date
                <span className='text-red-500'>*</span>
              </label>
              <DatePicker
                selected={form.startDate ? new Date(form.startDate) : null}
                onChange={(date) =>
                  handleOnChange({
                    target: {
                      name: 'startDate',
                      value: date.toISOString().split('T')[0], // format: yyyy-MM-dd
                    },
                  })
                }
                className={`${inputClass} basis-1/4`}
                name='startDate'
                dateFormat='dd MMM yyyy'
                locale={th}
              />
            </div>

            <div className='flex flex-col basis-1/4'>
              <label className='text-md mb-2'>วันที่สิ้นสุด/End Date
                <span className='text-red-500'>*</span>
              </label>
              <DatePicker
                selected={form.endDate ? new Date(form.endDate) : null}
                onChange={(date) =>
                  handleOnChange({
                    target: {
                      name: 'endDate',
                      value: date.toISOString().split('T')[0],
                    },
                  })
                }
                className={`${inputClass} basis-1/4`}
                name='endDate'
                dateFormat='dd MMM yyyy'
                locale={th}
              />
            </div>

            <div className='flex flex-col basis-1/4'>
              <label className='text-md mb-2'>ระยะเวลา/Duration
                <span className='text-red-500'>*</span>
              </label>
              <input
                value={form.duration}
                onChange={handleOnChange}
                className={`${inputClass} basis-1/4`}
                placeholder='ตัวอย่าง: 5 วัน 3 คืน'
                name='duration'
                type='text'
              />
            </div>

            <div className='flex flex-col basis-1/4'>
              <label className='text-md mb-2'>จำนวนที่นั่ง/maxSeats
                <span className='text-red-500'>*</span>
              </label>
              <input
                value={form.maxSeats}
                onChange={handleOnChange}
                className={`${inputClass} basis-1/4`}
                name='maxSeats'
                type='number'
              />
            </div>
          </div>


          {/* Tourpackage Status */}
          <div className='mt-8 mb-8 ml-4'>
            <p className='text-lg font-medium text-gray-700'>สถานะทัวร์<span className='text-red-500'>*</span></p>
            <div className='flex items-center gap-8 mt-5'>
              <Switch
                id='isRecommend'
                checked={form.isRecommend}
                onChange={(e) =>
                  setForm({ ...form, isRecommend: e.target.checked })
                }
              />
              <Label htmlFor='isRecommend' className='text-md'>
                {form.isRecommend ? 'แนะนำ' : 'ไม่แนะนำ'}
              </Label>
            </div>

            <div className='flex items-center gap-8 mt-5'>
              <Switch
                id='isActive'
                checked={form.isActive}
                onChange={(e) =>
                  setForm({ ...form, isActive: e.target.checked })
                }
              />
              <Label htmlFor='isActive' className='text-md'>
                 {form.isActive ? 'เปิดการขาย' : 'ปิดการขาย'}
              </Label>
            </div>
          </div>


          {/* Addional Cost */}
          <div className='p-4 mt-6 bg-white shadow-md w-full rounded-md'>
            <div className='inline-flex items-center'>
              <div className='bg-blue-600 w-12 h-12 flex items-center justify-center'>
                <Pencil className='w-6 h-6 text-white' />
              </div>
              <h1 className='ml-3 text-lg font-medium text-gray-700'>ค่าใช้จ่ายเพิ่มเติม</h1>
            </div>

            <div className='flex flex-row gap-5 mt-4'>
              <div className='flex flex-col basis-1/4'>
                <label className='text-md mb-2'>ราคาเด็ก/Price Child
                  <span className='text-red-500'>*</span>
                </label>
                <input
                  value={form.priceChild}
                  onChange={handleOnChange}
                  className={`${inputClass} basis-1/4`}
                  name='priceChild'
                  type='number'
                />
              </div>

              <div className='flex flex-col basis-1/4'>
                <label className='text-md mb-2'>ราคาพักเดี่ยว/Single Stay
                  <span className='text-red-500'>*</span>
                </label>
                <input
                  value={form.singleStayExtra}
                  onChange={handleOnChange}
                  className={`${inputClass} basis-1/4`}
                  name='singleStayExtra'
                  type='number'
                />
              </div>

              <div className='flex flex-col basis-1/4'>
                <label className='text-md mb-2'>ค่าทิปไกด์/Tip Guide
                  <span className='text-red-500'>*</span>
                </label>
                <input
                  value={form.priceGuide}
                  onChange={handleOnChange}
                  className={`${inputClass} basis-1/4`}
                  name='priceGuide'
                  type='number'
                />
              </div>

              <div className='flex flex-col basis-1/4'>
                <label className='text-md mb-2'>ค่าวีซ่า(ถ้ามี)/Visa Price
                  <span className='text-red-500'>*</span>
                </label>
                <input
                  value={form.priceVisa}
                  onChange={handleOnChange}
                  placeholder='หากไม่มีค่าวีซ่าให้กรอก 0'
                  className={`${inputClass} basis-1/4`}
                  name='priceVisa'
                  type='number'
                />
              </div>
            </div>
          </div>

          {/* Itinerary */}
          <div className='p-4 mt-6 bg-white shadow-md w-full rounded-md'>
            <div className='inline-flex items-center'>
              <div className='bg-blue-600 w-12 h-12 flex items-center justify-center'>
                <Pencil className='w-6 h-6 text-white' />
              </div>
              <h1 className='ml-3 text-lg font-medium text-gray-700'>แผนการเดินทาง<span className='text-red-500'>*</span></h1>
            </div>

            <div className='mt-6 mb-2'>
              <p className='w-full mt-6'>แผนการเดินทาง/Itinerary</p>
            </div>
            <div className='flex flex-row gap-5 w-full'>
              <textarea
                value={form.itinerary}
                onChange={handleOnChange}
                className={`${inputClass} w-full in-h-[200px]`}
                name='itinerary'
                type='text'
                rows={10}
              />
            </div>
          </div>

          {/* Image */}
          <div className='p-4 mt-6 bg-white shadow-md w-full rounded-md'>
            <div className='inline-flex items-center'>
              <div className='bg-blue-600 w-12 h-12 flex items-center justify-center'>
                <ImageUp className='w-6 h-6 text-white' />
              </div>
              <h1 className='ml-3 text-lg font-medium text-gray-700'>อัพโหลดรูปภาพ</h1>
            </div>
            <div className='mt-6 mb-2'>
              <p className='w-full mt-6'>อัพโหลดไฟล์รูปภาพ/Upload Images<span className='text-red-500'>*</span></p>
              <div className='mt-4 space-y-2'>
                <UploadImage
                  key={formKey}
                  form={form}
                  setForm={setForm}
                />
              </div>
            </div>
          </div>

          {/* PDF */}
          <div className='p-4 mt-6 bg-white shadow-md w-full rounded-md'>
            <div className='inline-flex items-center'>
              <div className='bg-blue-600 w-12 h-12 flex items-center justify-center'>
                <FileText className='w-6 h-6 text-white' />
              </div>
              <h1 className='ml-3 text-lg font-medium text-gray-700'>อัพโหลด PDF File</h1>
            </div>
            <div className='mt-6 mb-16'>
              <p className='w-full mt-6'>อัพโหลดไฟล์ PDF /Upload PDF File<span className='text-red-500'>*</span></p>
              <div className='mt-4 space-y-2'>
                <UploadPDF
                  form={form}
                  setForm={setForm}
                />
              </div>
            </div>

            {/* Control Button */}
            <div className='flex justify-between mt-8'>
              {editMode ? (
                <ConfirmDialog
                  title='ยืนยันการลบรายการทัวร์นี้?'
                  description='คุณแน่ใจใช่ไหมว่าต้องการลบรายการทัวร์นี้? การลบนี้จะไม่สามารถย้อนกลับได้'
                  confirmText='ลบเลย'
                  cancelText='ยกเลิก'
                  onConfirm={() => handleRemove(id)}
                >
                  <button
                    type='button'
                    className='p-2 bg-red-600 text-white border-2 rounded-md
                hover:bg-red-700 hover:text-white'
                  >
                    ลบรายการ
                  </button>
                </ConfirmDialog>
              ) : (
                <button
                  type='button'
                  className='p-2 bg-orange-500 text-white rounded-md hover:bg-orange-600'
                  onClick={handleReset}
                >
                  ล้างข้อมูล
                </button>
              )}
              
              <div className='flex'>
                <button
                  type='button'
                  className='p-2 mr-6 bg-white text-brand-pink border-2 border-brand-pink rounded-md hover:bg-brand-pink
                hover:text-white'
                  onClick={handleBack}
                >
                  ย้อนกลับ
                </button>
                <button
                  type='submit'
                  className='p-2 bg-brand-pink text-white rounded-md hover:bg-pink-600'
                >
                  บันทึกรายการ
                </button>
              </div>
            </div>
          </div>
        </div>
      </form >
    </>
  )
}

export default FormTourpackageDetail

