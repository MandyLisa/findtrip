import { useEffect, useState } from 'react'
import usePublicStore from '../../store/publicStore' // Custom hook สำหรับ global state
import Slider from 'rc-slider'
import 'rc-slider/assets/index.css'

// กำหนดค่าคงที่ของ price range
const STEP = 1000
const MIN = 0
const MAX = 300000

const SearchCard = ({
  showCategory,
  showCountry,
  showRangePrice,
  onSearch, // ฟังก์ชันที่จะถูกเรียกเมื่อกดค้นหา (มาจาก parent component) ต้องรับ prop นี้มาด้วย
}) => {

  // เรียกใช้งาน Global State (จาก Zustand store)
  const categories = usePublicStore((state) => state.categories)
  const countries = usePublicStore((state) => state.countries)
  const fetchCategories = usePublicStore((state) => state.fetchCategories)
  const fetchCountries = usePublicStore((state) => state.fetchCountries)

  // Local State
  const [category, setCategory] = useState('') // เก็บ ID หมวดหมู่ที่เลือก
  const [country, setCountry] = useState('')
  const [priceRange, setPriceRange] = useState([MIN, MAX]) // เก็บช่วงราคา [ต่ำสุด, สูงสุด]

  // ฟังก์ชันตรวจสอบว่าช่วงราคาเป็นค่า default หรือไม่
  const isPriceRangeDefault = () => {
    return priceRange[0] === MIN && priceRange[1] === MAX
  }

  // ฟังก์ชันสร้าง object สำหรับเงื่อนไขการค้นหา
  const buildSearchCriteria = () => {
    const searchTour = {}

    // เพิ่ม category ถ้ามีการเลือก
    if (category) {
      searchTour.category = category
    }

    // เพิ่ม country ถ้ามีการเลือก
    if (country) {
      searchTour.country = country
    }

    // เพิ่ม priceAdult ถ้าไม่ใช่ค่า default
    if (!isPriceRangeDefault()) {
      searchTour.priceAdult = {
        min: priceRange[0],
        max: priceRange[1]
      }
    }

    return searchTour
  }

  // ฟังก์ชันปุ่มค้นหา (ปรับปรุงแล้ว)
  const handleSearch = () => {
    const searchTour = buildSearchCriteria()
    // console.log('ค้นหาด้วย: ', searchTour)
    onSearch?.(searchTour) // เรียกใช้ฟังก์ชันจาก parent component
  }

  // ทำงาน ตอน component mount
  useEffect(() => {
    fetchCategories() // เรียก API ดึงข้อมูล
    fetchCountries()
  }, []) // ทำแค่ครั้งเดียวตอน component mount

  // ฟังก์ชันรีเซ็ต
  const handleReset = () => {
    setCategory('')
    setCountry('')
    setPriceRange([MIN, MAX])
    onSearch?.(null) // ส่ง object (filter) ว่างๆ ไปให้ parent แสดงข้อมูล
  }


  return (
    <div className='p-4 rounded-md shadow-sm bg-zinc-50 space-y-6'>

      {showCategory && (
        <div className='space-y-4'>
          <label className='text-gray-800 font-xl'>เลือกหมวดหมู่</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)} // เมื่อค่าเปลี่ยน ให้ update state
            className='border-2 border-brand-pink rounded-md p-2 w-full text-gray-500'
          >
            <option value=''> เลือกหมวดหมู่ </option>
            {categories.map((category) => ( // วนลูปแสดงหมวดหมู่ทั้งหมด
              <option key={category.id} value={category.id}>{category.name}</option>
            ))}
          </select>
        </div>
      )}

      {showCountry && (
        <div className='space-y-4'>
          <label className='text-gray-800 font-xl'>เลือกประเทศ</label>
          <select
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            className='border-2 border-brand-pink rounded-md p-2 w-full text-gray-500'
          >
            <option>เลือกประเทศ</option>
            {countries.map((country) => (
              <option key={country.id} value={country.id}>{country.name}</option>
            ))}
          </select>
        </div>
      )}

      {showRangePrice && (
        <div className='space-y-6'>
          <label className='text-gray-800 font-xl'>เลือกช่วงราคา</label>
          <div className="px-2">
            <Slider
              range
              min={MIN}
              max={MAX}
              step={STEP}
              value={priceRange}
              onChange={(values) => setPriceRange(values)}

              // Custom styles
              styles={{
                track: {
                  backgroundColor: '#ec4899', // สีแถบที่เลือก (brand-pink)
                  height: 8,
                },
                rail: {
                  backgroundColor: '#dfe4ed', // สีแถบพื้นหลัง
                  height: 8,
                },
                handle: {
                  backgroundColor: '#ec4899', // สีจุดลาก
                  borderColor: '#ec4899',
                  width: 16,
                  height: 16,
                  opacity: 1,
                },
                handleActive: {
                  boxShadow: '0 0 0 5px rgba(236, 72, 153, 0.2)',
                },
              }}
            />

            {/* แสดงค่าราคาปัจจุบัน */}
            <div className='flex justify-between text-sm text-gray-600 pt-2'>
              <span>฿{priceRange[0].toLocaleString()}</span>
              <span>฿{priceRange[1].toLocaleString()}</span>
            </div>
          </div>
        </div>
      )}

      {/* =============== ปุ่มรีเซ็ตและค้นหา =============== */}
      <div className='flex justify-between pt-2'>
        <button
          type='button'
          onClick={handleReset} // เรียกฟังก์ชัน reset
          className='bg-white border-2 border-brand-pink text-brand-pink hover:text-pink-600 font-normal py-1 px-2 rounded-lg'
        >
          รีเซ็ต
        </button>
        <button
          type='button'
          onClick={handleSearch} // เรียกฟังก์ชันค้นหา
          className='bg-brand-pink hover:bg-pink-600 text-white font-normal py-1 px-2 rounded-lg'
        >
          ค้นหา
        </button>
      </div>
    </div>
  )
}

export default SearchCard