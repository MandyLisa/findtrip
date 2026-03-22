import { useEffect, useState } from 'react'
import X_card from '../components/card/X_card'
import Pre_Footer from '../components/Pre_Footer'
import { getAllTours, searchByTitle, searchFilters, getRecommendPaginated } from '../API/public'
import SearchCard from '../components/card/SearchCard'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { useSearchParams } from 'react-router-dom'
import Banner from '../components/Banner'
import Whyus from '../components/Whyus'
import Pagination from '../components/card/Pagination'
import { Loader } from 'lucide-react'

const Programs = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { category } = useParams() // home ดึง path param เช่น /programs/24
  const [searchParams] = useSearchParams() // home ค้นหาด้วย title อ่าน query string จาก URL
  const searchTitle = searchParams.get('title') // home ค้นหาด้วย title ดึงค่าของ title มาใช้

  const [filters, setFilters] = useState(null)
  const [recommendMode, setRecommendMode] = useState(false)
  const [allTours, setAllTours] = useState([])
  const [filterTours, setFilterTours] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalCount, setTotalCount] = useState(0)
  const [loading, setLoading] = useState(false)
  const limit = 10

  useEffect(() => {
    fetchTour() // เรียกฟังก์ชัน fetchTour() ทันทีเมื่อ Component ถูก mount หรือเมื่อค่า searchTitle, category, filters, currentPage เปลี่ยนแปลง
    // console.log("Programs Component Loaded!")
  }, [searchTitle, category, filters, recommendMode, currentPage]) 

  const fetchTour = async () => {
    setLoading(true)
    try {
      if (recommendMode) {
        const res = await getRecommendPaginated(currentPage, limit)
        setFilterTours(res.data.data)
        setTotalPages(res.data.totalPage)
        return
      }

      if (searchTitle) { // จากหน้า home
        const res = await searchByTitle(searchTitle, currentPage, limit)
        setFilterTours(res.data.data)
        setTotalPages(res.data.totalPage)

      } else if (category) { // จากหน้า home
        const res = await searchFilters({ category: Number(category) }, currentPage, limit)
        setFilterTours(res.data.data)
        setTotalPages(res.data.totalPage)

      } else if (filters) { // จากหน้า searchCard (sidebar) ที่อยู่ในหน้านี้เอง
        const res = await searchFilters(filters, currentPage, limit)
        setFilterTours(res.data.data)
        setTotalPages(res.data.totalPage)

      } else {
        const res = await getAllTours(currentPage, limit)
        setAllTours(res.data.data)
        setFilterTours(res.data.data)
        setTotalPages(res.data.totalPage)
      }
    } catch (err) {
      console.error('Error fetching data', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { // ฟังการเปลี่ยนแปลงของค่า location.state จาก React Router (useLocation)
    if (location.state) {  // ผู้ใช้กดค้นหามาจากหน้าอื่นแล้วส่ง state มา
      setFilters(location.state.filters)
      setCurrentPage(location.state.page)
      setRecommendMode(location.state.mode === 'recommend')
    } else {
      setRecommendMode(false)
    }
  }, [location.state])

  const handleSearch = async (filters) => { // ฟังก์ชันนี้ถูกส่งไปให้ SearchCard เมื่อผู้ใช้กดค้นหาใน SearchCard แล้วส่งค่าฟิลเตอร์มาให้
    try {
      navigate('/programs', { state: { filters: filters, page: 1 } })
    } catch (err) {
      console.log('ค้นหาทัวร์ไม่สำเร็จ', err)
    }
  }

  const handleRecommendAll = () => {
    navigate('/programs', { state: { mode: 'recommend', filters: null, page: 1 } })
  }

  return (
    <>
      <Banner />
      <div className='flex flex-col lg:flex-row w-full bg-white mt-20 px-4 gap-4 rounded-md'>

        {/* Sidebar - SearchCard */}
        <div className='w-full lg:w-1/4'>
          <div className='bg-white p-4'>
            <SearchCard
              showCategory
              showCountry
              showRangePrice
              onSearch={handleSearch}
            />
          </div>
        </div>

        {/* Main Content */}
        <div className='w-full bg-white p-4 mb-4'>
          <p className='text-gray-700 text-2xl sm:text-3xl font-medium mb-4 sm:mb-6'>
            แพ็คเกจทัวร์ทั้งหมด
          </p>
          <div className='flex items-start justify-between gap-4 mb-6 sm:mb-8'>
            <p className='text-brand-pink text-lg sm:text-xl font-medium'>
              ค้นหาทัวร์ที่ใช่...โดนใจคุณ พร้อมการเดินทางสุดพิเศษไปกับเรา!
            </p>
            <button
              type='button'
              onClick={handleRecommendAll}
              className='w-1/5 h-12 bg-brand-pink text-white text-md rounded-3xl 
              hover:scale-105 hover:duration-200'
            >
              ดูทัวร์แนะนำทั้งหมด
            </button>
          </div>


          {/* Tour List */}
          {loading ? (
            <div className='flex flex-col items-center justify-center mt-16'>
              <Loader className='animate-spin text-brand-pink w-10 h-10 mb-2' />
              <p className='text-gray-500 mt-4 items-center font-semibold'>กำลังโหลดข้อมูลทัวร์...กรุณารอสักครู่</p>
            </div>
          ) : (
            filterTours.length === 0 ? ( // ถ้าไม่มีข้อมูล
              <p className='text-gray-500 mt-4 items-center font-semibold'>ไม่พบแพ็คเกจทัวร์ที่ค้นหา</p>
            ) : (
              <div className='flex flex-col'>
                {filterTours.map((item) => (
                  <X_card key={item.id} data={item} />
                ))}
              </div>
            )
          )}
          <div className='mt-6'>
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={(page) => setCurrentPage(page)}
            />
          </div>
        </div>

      </div >
      <Whyus />
      <Pre_Footer />
    </>
  )
}

export default Programs


