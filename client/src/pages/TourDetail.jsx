import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { CalendarClock, Loader } from 'lucide-react'
import { formatDateRange } from '../utils/formatDate'
import TourImageGallery from '../components/card/ImageGallery'
import DownloadPDF from '../components/card/DownloadPDF'
import Pre_Footer from '../components/Pre_Footer'
import usePublicStore from '../store/publicStore'
import useAuthStore from '../store/authStore'
import ContactPopup from '../components/card/ContactPopup'

const TourDetail = () => {
  const { id } = useParams() // รับ id มาจาก url
  const navigate = useNavigate()
  const fetchTourDetail = usePublicStore((state) => state.fetchTourDetail)
  const tourDetail = usePublicStore((state) => state.tourDetail)
  // console.log('ดูตรงนี้ ',tourDetail)
  const token = useAuthStore((state) => state.token)
  // console.log('ดู Token', token)
  const isLoading = usePublicStore((state) => state.isLoading)
  const [isContactPopupOpen, setIsContactPopupOpen] = useState(false)

  useEffect(() => {
    if (id) {
      fetchTourDetail(id)
    }
  }, [id])

  const handleBookingClick = () => {
    if (!token) {
      navigate('/login')
    } else {
      navigate(`/user/bookings/${id}`)
    }
  }

  // คำนวณที่นั่งที่เหลือสำหรับการแสดงผล
  const availableSeats = tourDetail ? tourDetail.maxSeats - tourDetail.sold : 0

  // 1. แสดง Loader เมื่อกำลังโหลด
  if (isLoading) {
    return (
      <div className='flex flex-col items-center justify-center mt-16'>
        <Loader className='animate-spin text-brand-pink w-10 h-10 mb-2' />
        <p className='text-gray-500 mt-4 items-center font-semibold'>กำลังโหลดข้อมูล...กรุณารอสักครู่</p>
      </div>
    )
  }

  if (!tourDetail) {
    return (
      <div className='flex justify-center items-center mt-16'>
        <p className='text-gray-700 font-semibold'>ไม่พบข้อมูลทัวร์ หรือเกิดข้อผิดพลาด</p>
      </div>
    )
  }


  return (
    <>
      {/* Layout: Left image + Right details */}
      <div className='flex flex-col lg:flex-row justify-between min-h-[700px]'>

        {/* Left: Images */}
        <div className='w-full lg:w-1/2 p-4'>
          <TourImageGallery images={tourDetail.images} />
        </div>

        {/* Right: Info */}
        <div className='w-full lg:w-1/2 border border-gray-100 p-4 shadow-sm rounded-xl'>
          <p className='text-lg font-bold'>{tourDetail.title} </p>
          <p className='font-semibold'>รหัสทัวร์ ({tourDetail.tourCode})</p>

          <p className='py-1 px-2 mt-6'>ประเทศ : {tourDetail.country.name}</p>
          <span className='flex items-center flex-wrap'>
            <p className='py-1 px-2'>
              ระยะเวลา : <CalendarClock className='inline-block text-gray-600' /> {tourDetail.duration}</p>
          </span>
          <p className='py-1 px-2'>เดินทาง : {formatDateRange(tourDetail.startDate, tourDetail.endDate)}</p>
          <p className='py-1 px-2'>สายการบิน : {tourDetail.airline}</p>
          <p className='py-1 px-2'>โรงแรม : {tourDetail.starRating} ดาว</p>

          <div className='flex flex-col mt-4'>
            <p className='py-1 px-2 text-lg'>จำนวนที่นั่งทั้งหมด : {tourDetail.maxSeats} </p>
            <p className='py-1 px-2 text-lg'>จองแล้ว : {tourDetail.sold} </p>
            <p className='py-1 px-2 text-lg text-brand-pink font-semibold '>คงเหลือ : {availableSeats} </p>
          </div>
          <p className='py-6 px-2 text-xl font-bold'>ราคาเริ่มต้น : {Number(tourDetail.priceAdult).toLocaleString('th-TH')} ต่อท่าน </p>
          <div className='border-t border-gray-300 mr-4 my-4'></div>
          <p className='font-semibold py-1 px-2'>ค่าใช้จ่ายเพิ่มเติม</p>
          <p className='py-1 px-2'>1. กรณีต้องการพักห้องเดี่ยว ท่านต้องเสียค่าใช้จ่ายเพิ่ม {Number(tourDetail.singleStayExtra).toLocaleString('th-TH')} ต่อท่าน</p>
          <p className='py-1 px-2'>2. กรณีเด็กเล็กอายุต่ำกว่า 2 ปี พักกับผู้ปกครอง เสียค่าใช้จ่าย {Number(tourDetail.priceChild).toLocaleString('th-TH')} บาท
            หากอายุเกิน 2 ปี คิดราคาเต็ม
          </p>
          <p className='py-1 px-2'>3. กรณีต้องทำวีซ่า ท่านต้องเสียค่าทำวีซ่า {Number(tourDetail.priceVisa).toLocaleString('th-TH')} บาท ต่อท่าน</p>
          <p className='py-1 px-2 mb-6'>4. ค่าทิปไกด์ {Number(tourDetail.priceGuide).toLocaleString('th-TH')} บาท ต่อท่าน (ยกเว้นเด็กเล็กต่ำกว่า 2 ปี)</p>


          <button
            className='w-full h-12 bg-brand-pink text-white text-xl rounded-3xl ml-auto mb-2 hover:bg-pink-600'
            onClick={handleBookingClick}
          >
            จองเลย
          </button>

          <button
            onClick={() => setIsContactPopupOpen(true)}
            className='w-full h-12 bg-white text-brand-pink border-2 border-brand-pink text-xl rounded-3xl ml-auto mb-2
          hover:bg-gray-50'
          >
            ติดต่อสอบถามเพิ่มเติม
          </button>
          <ContactPopup
            isOpen={isContactPopupOpen}
            onClose={() => setIsContactPopupOpen(false)}
            tourCode={tourDetail.tourCode}
          />
        </div>
      </div>

      <div className='border-t border-gray-300 mr-4 my-4'></div>

      {/* รายละเอียดใต้ภาพ */}
      <div className='px-4'>
        <h1 className='text-2xl sm:text-3xl font-medium text-items-center mt-8'>{tourDetail.title}</h1>
        <div className='flex flex-wrap gap-x-2 mt-4 text-md sm:text-lg'>
          <p className='text-lg mr-2'>{tourDetail.country.name} |</p>
          <p className='text-lg mr-2'>{tourDetail.duration} |</p>
          <p className='text-lg mr-2'>{formatDateRange(tourDetail.startDate, tourDetail.endDate)} |</p>
          <p className='text-lg mr-2'>{tourDetail.airline} |</p>
          <p className='text-lg mr-2'>พักโรงแรม {tourDetail.starRating} ดาว |</p>
        </div>
        <div>
          <DownloadPDF pdfUrl={tourDetail.tourPDF?.secure_url} />
        </div>
      </div>

      {/* กิจกรรมและการเดินทาง */}
      <div className='border-2 border-gray-100 rounded-xl p-3 py-3 shadow-md border-t-brand-pink mt-12'>
        <p className='text-2xl sm:text-3xl font-medium p-2'>กิจกรรมและการเดินทาง</p>
        <p className='text-lg sm:text-xl font-medium p-2'>ระยะเวลาการเดินทาง {tourDetail.duration}</p>
        <div className='text-md sm:text-lg space-y-4 mt-2 p-2'>
          {tourDetail.itinerary &&
            tourDetail.itinerary
              .split(/(วันที่ \d+ ?:)/g) // แยกตามคำว่า "วันที่ X :"
              .filter(Boolean) // กรองค่าว่าง
              .reduce((result, item, index, arr) => {
                if (item.startsWith('วันที่')) {
                  const dayText = item + (arr[index + 1] || '')
                  result.push(dayText)
                }
                return result
              }, [])
              .map((str, index) => (
                <p key={index} className='mb-2'>
                  {str.trim()}
                </p>
              ))
          }
        </div>
      </div>

      {/* ราคานี้รวม */}
      <div className='border-2 border-gray-100 rounded-xl p-3 py-2 shadow-md border-t-brand-pink mt-12'>
        <p className='text-2xl sm:text-3xl font-medium mb-4 p-2'>ราคานี้รวมอะไรบ้าง?</p>

        <div className='flex justify-between md:flex-row gap-4'>
          <div className='md:w-1/2'>
            <p className='text-xl font-medium mb-2 p-2'>แพ็คเกจนี้รวม</p>
            <ul className='list-disc pl-6 space-y-4 text-md p-2'>
              <li>ค่าตั๋วเครื่องบิน ไป-กลับ</li>
              <li>ค่าที่พักตามที่ระบุ</li>
              <li>ค่ารถนำเที่ยวตามรายการ</li>
              <li>ค่ามื้ออาหารตามรายการ</li>
              <li>ค่าเข้าชมสถานที่ต่างๆ</li>
            </ul>
          </div>

          <div className='md:w-1/2'>
            <p className='text-xl font-medium mb-2 p-2'>แพ็คเกจนี้ไม่รวม</p>
            <ul className='list-disc pl-6 space-y-4 text-md p-2'>
              <li>ค่าใช้จ่ายส่วนตัว</li>
              <li>ค่าบริการอื่นๆเพิ่มเติม จากสายการบิน (ถ้ามี)</li>
              <li>กรณีแยกพักห้องเดี่ยว เพิ่มเงินท่านละ {Number(tourDetail.singleStayExtra).toLocaleString('th-TH')} บาท</li>
              <li>ค่าทิปไกด์ {Number(tourDetail.priceGuide).toLocaleString('th-TH')} บาท/ท่าน ยกเว้นเด็กเล็กต่ำกว่า 2 ปี</li>
              <li>ค่าวีซ่า (ถ้ามี)</li>
            </ul>
          </div>
        </div>
      </div>
      <Pre_Footer />
    </>
  )
}

export default TourDetail
