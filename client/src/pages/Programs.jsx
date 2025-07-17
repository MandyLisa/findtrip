import { useEffect, useState } from 'react'
import X_card from '../components/card/X_card'
import Pre_Footer from '../components/Pre_Footer'
import { getAllTours, searchByTitle, searchFilters } from '../API/public'
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
  const { category } = useParams() // ดึง path param เช่น /programs/24
  const [searchParams] = useSearchParams() // สำหรับการค้นหาด้วย title
  const searchTitle = searchParams.get('title')

  const [allTours, setAllTours] = useState([])
  const [filterTours, setFilterTours] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [filters, setFilters] = useState(null)
  const [loading, setLoading] = useState(false)
  const limit = 10

  useEffect(() => {
    if (location.state) {
      setFilters(location.state.filters)
      setCurrentPage(location.state.page)
    }
  }, [location.state])

  useEffect(() => {
    const fetchTour = async () => {
      setLoading(true)
      try {
        // console.log('ดูตรงนี้')
        // console.log(searchTitle)
        // console.log(category)
        // console.log(filters)

        if (searchTitle) {
          const res = await searchByTitle(searchTitle, currentPage, limit)
          setFilterTours(res.data.data)
          setTotalPages(res.data.totalPage)

        } else if (category) {
          const res = await searchFilters({ category: Number(category) }, currentPage, limit)
          setFilterTours(res.data.data)
          setTotalPages(res.data.totalPage)

        } else if (filters) {
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

    if (searchTitle || category || filters || (!searchTitle && !category && !filters)) {
      fetchTour()
    }

  }, [searchTitle, category, filters, currentPage]) // ติดตามสถานะของ state ตัวนั้นๆ เมื่อ...มีการเปลี่ยนแปลง function ที่อยู่ในนี้ ก็จะทำงาน 

  const handleSearch = async (filters) => {
    try {
      // console.log('ดูตรงนี้', filters)
      navigate('/programs', { state: { filters, page: 1 } })
    } catch (err) {
      console.log('ค้นหาทัวร์ไม่สำเร็จ', err)
    }
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
          <p className='text-brand-pink text-lg sm:text-xl font-medium mb-6 sm:mb-8'>
            ค้นหาทัวร์ที่ใช่...โดนใจคุณ พร้อมการเดินทางสุดพิเศษไปกับเรา!
          </p>


          {/* Tour List */}
          {loading ? (
            <div className='flex flex-col items-center justify-center mt-16'>
              <Loader className='animate-spin text-brand-pink w-10 h-10 mb-2' />
              <p className='text-gray-500 mt-4 items-center font-semibold'>กำลังโหลดข้อมูลทัวร์...กรุณารอสักครู่</p>
            </div>
          ) : (
            filterTours.length === 0 ? (
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


