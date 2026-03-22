import Banner from '../components/Banner'
import TextSearchBar from '../components/card/TextSearchBar'
import Pre_Footer from '../components/Pre_Footer'
import { Link, useNavigate } from 'react-router-dom'
import Whyus from '../components/Whyus'
import Y_card from '../components/card/Y_card'
import { useState, useEffect } from 'react'
import { getRecommend } from '../API/public'
import CategoryHome from '../components/card/CategoryHome'
import usePublicStore from '../store/publicStore'
import { Loader } from 'lucide-react'

// Part 1 : ประกาศตัวแปรที่ใช้ในหน้า Home
const Home = () => { // เริ่มต้นสร้าง Page Component
  const navigate = useNavigate() // React ดึงคำสั่งนำทาง 
  const categories = usePublicStore((state) => state.categories) // ดึง Global State มาเตรียมไว้
  const fetchCategories = usePublicStore((state) => state.fetchCategories)

  const [recommendTours, setRecommendTours] = useState([]) // สร้าง State ไว้เก็บข้อมูลทัวร์แนะนำที่ดึงมาจาก API 
  const [isLoading, setIsLoading] = useState(false)

  // PART 2 : เตรียมฟังชั่นคุม logic ในหน้านี้ 
  const handleSearch = (title) => { // รับค่าจาก TextSearchBar (ผ่าน prop onSearch) เมื่อผู้ใช้กดค้นหา  
    const param = new URLSearchParams(title).toString()
    navigate(`/programs?${param}`)
  }

  const fetchTourRecommend = async () => {
    setIsLoading(true) // toggle
    try {
      const res = await getRecommend()
      // console.log(res)
      setRecommendTours(res.data)
    } catch (err) {
      console.log('Error fetching data', err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchCategories()
    fetchTourRecommend()
  }, []) // Dependency array ว่างเปล่า เพื่อให้ทำงานแค่ครั้งเดียวตอน Component mount

  // 1. แสดง Loader เมื่อกำลังโหลด
  if (isLoading) {
    return (
      <div className='flex flex-col items-center justify-center mt-16'>
        <Loader className='animate-spin text-brand-pink w-10 h-10 mb-2' />
        <p className='text-gray-500 mt-4 items-center font-semibold'>กำลังโหลดข้อมูล...กรุณารอสักครู่</p>
      </div>
    )
  }

  return (
    <div>
      <Banner />
      <div className='flex justify-center p-8'>
        <TextSearchBar 
          onSearch={handleSearch} // ส่ง f ไป TextSearchBar(child) ผ่าน prop ชื่อ onSearch
        />
      </div>

      <div className='flex flex-wrap justify-center gap-3 md:gap-6 py-6'>
        {categories.map((cat) => (
          <CategoryHome
            key={cat.id}
            id={cat.id}
            name={cat.name}
          />
        ))}
      </div>

      <div className='flex justify-between items-center py-8'>
        <p className='text-3xl text-gray-700 mb-4'>ทัวร์แนะนำ</p>
        <Link
          to='/programs'
          className='text-lg text-brand-pink hover:underline ml-2'
        >
          ดูทัวร์ทั้งหมด
        </Link>
      </div>

      {recommendTours.length > 0 ? (
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6'>
          {recommendTours.map((item) => (
            <Y_card
              key={item.id}
              data={item} />
          ))}
        </div>
      ) : (
        <p className='text-center text-gray-500 mt-8'>ไม่พบข้อมูลทัวร์ที่แนะนำ</p>
      )}

      <Whyus />
      <Pre_Footer />
    </div>
  )
}

export default Home
