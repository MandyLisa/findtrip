import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { FaSearch } from 'react-icons/fa'
import { formatThaiDate } from '../../utils/formatDate'
import Pagination from '../card/Pagination'
import useTourDataStore from '../../store/tourDataStore'
import useAuthStore from '../../store/authStore'
import { FileSearch, Loader } from 'lucide-react'
import usePublicStore from '@/store/publicStore'
import { SEAT_STATUS_CONFIG } from '@/constants/tourStatus'


const FormTourpackage = () => {

    const token = useAuthStore((state) => state.token)
    const getTourpackage = useTourDataStore((state) => state.getTourpackage)
    const tourpackages = useTourDataStore((state) => state.tourpackages)
    const categories = usePublicStore((state) => state.categories)
    const countries = usePublicStore((state) => state.countries)
    const fetchCategories = usePublicStore((state) => state.fetchCategories)
    const fetchCountries = usePublicStore((state) => state.fetchCountries)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null) // เพิ่มตัวนี้เพื่อเก็บข้อความ Error


    const totalPages = useTourDataStore((state) => state.totalPages)
    const [currentPage, setCurrentPage] = useState(1)
    const limit = 10

    // Search filter
    const searchForm = {
        id: '',
        tourCode: '',
        categoryId: '',
        countryId: '',
        isRecommend: '',
        isActive: '',
        seatStatus: ''
    }

    const [form, setForm] = useState(searchForm)
    const [formTemp, setFormTemp] = useState(searchForm)

    const handleOnChange = (e) => {
        const { name, value } = e.target
        setFormTemp((prevForm) => ({
            ...prevForm,
            [name]: value,
        }))
    }

    // List Tourpackage
    const fetchAllTourPackage = async (form) => {
        setLoading(true)
        setError(null) // เคลียร์ Error เก่าทิ้ง ก่อนเริ่มดึงข้อมูลใหม่
        try {
            const res = await getTourpackage(token, currentPage, limit, form || {})
        } catch (err) {
            console.log('Error fetching All TourPackage', err)
            setError('ไม่สามารถดึงข้อมูลได้ กรุณาลองใหม่อีกครั้ง') // เก็บข้อความ Error ไว้ใน State เพื่อเอาไปโชว์ที่หน้าจอ
        } finally {
            setLoading(false) // Clean up สถานะ Loading
        }
    }

    const handleSearch = async (e) => {
        e.preventDefault() 
        setCurrentPage(1)
        setForm(formTemp)
        fetchAllTourPackage(formTemp)
    }

    const handleReset = () => {
        setForm(searchForm)
        setFormTemp(searchForm)
        setCurrentPage(1)
        fetchAllTourPackage(searchForm)
    }


    useEffect(() => {
        if (token) {
            fetchCategories()
            fetchCountries()
            fetchAllTourPackage(form)
        }
    }, [token, currentPage])


    return (
        <>
            <form onSubmit={handleSearch}>
                <div className='mt-8 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-gray-200 sm:p-6'>
                    <div className='flex items-center gap-3'>
                        <div className='bg-brand-pink w-11 h-11 rounded-xl flex items-center justify-center shadow-sm'>
                            <FileSearch className='w-6 h-6 text-white' />
                        </div>
                        <h1 className='text-lg sm:text-xl font-semibold text-gray-800'>ค้นหาแพ็คเกจทัวร์</h1>
                    </div>


                    <div className='mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4'>
                        <div className='flex flex-col'>
                            <label className='text-sm font-medium text-gray-700 mb-2'>เลขไอดี/ID No.</label>
                            <input
                                value={formTemp.id}
                                onChange={handleOnChange}
                                name='id'
                                type='number'
                                className='w-full px-3 py-2 rounded-xl border border-gray-200 bg-gray-50/60 text-gray-900 outline-none focus:ring-2 focus:ring-brand-pink/40 focus:border-brand-pink'
                            />
                        </div>

                        <div className='flex flex-col'>
                            <label className='text-sm font-medium text-gray-700 mb-2'>รหัสทัวร์/Tour Code</label>
                            <input
                                value={formTemp.tourCode}
                                onChange={handleOnChange}
                                name='tourCode'
                                type='text'
                                className='w-full px-3 py-2 rounded-xl border border-gray-200 bg-gray-50/60 text-gray-900 outline-none focus:ring-2 focus:ring-brand-pink/40 focus:border-brand-pink'
                            />
                        </div>

                        <div className='flex flex-col'>
                            <label className='text-sm font-medium text-gray-700 mb-2'>ประเภททัวร์/Category</label>
                            <select
                                value={formTemp.categoryId}
                                name='categoryId'
                                onChange={handleOnChange}
                                className='w-full px-3 py-2 rounded-xl border border-gray-200 bg-gray-50/60 text-gray-900 outline-none focus:ring-2 focus:ring-brand-pink/40 focus:border-brand-pink'
                            >
                                <option value='' disabled>กรุณาเลือก</option>
                                {
                                    categories.map((item, index) =>
                                        <option key={index} value={item.id}>{item.name}</option>
                                    )
                                }
                            </select>
                        </div>

                        <div className='flex flex-col'>
                            <label className='text-sm font-medium text-gray-700 mb-2'>ประเทศ/Country</label>
                            <select
                                value={formTemp.countryId}
                                name='countryId'
                                onChange={handleOnChange}
                                className='w-full px-3 py-2 rounded-xl border border-gray-200 bg-gray-50/60 text-gray-900 outline-none focus:ring-2 focus:ring-brand-pink/40 focus:border-brand-pink'
                            >
                                <option value='' disabled>กรุณาเลือก</option>
                                {
                                    countries.map((item, index) =>
                                        <option key={index} value={item.id}>{item.name}</option>
                                    )
                                }
                            </select>
                        </div>

                        <div className='flex flex-col'>
                            <label className='text-sm font-medium text-gray-700 mb-2'>ทัวร์แนะนำ/isRecommend?</label>
                            <select
                                value={formTemp.isRecommend}
                                name='isRecommend'
                                onChange={handleOnChange}
                                className='w-full px-3 py-2 rounded-xl border border-gray-200 bg-gray-50/60 text-gray-900 outline-none focus:ring-2 focus:ring-brand-pink/40 focus:border-brand-pink'
                            >
                                <option value='' disabled>กรุณาเลือก</option>
                                <option value={true}>ทัวร์แนะนำ</option>
                                <option value={false}>ทัวร์ไม่แนะนำ</option>
                            </select>
                        </div>

                        <div className='flex flex-col'>
                            <label className='text-sm font-medium text-gray-700 mb-2'>สถานะทัวร์/isActive?</label>
                            <select
                                value={formTemp.isActive}
                                name='isActive'
                                onChange={handleOnChange}
                                className='w-full px-3 py-2 rounded-xl border border-gray-200 bg-gray-50/60 text-gray-900 outline-none focus:ring-2 focus:ring-brand-pink/40 focus:border-brand-pink'
                            >
                                <option value='' disabled>กรุณาเลือก</option>
                                <option value={true}>เปิดการขาย</option>
                                <option value={false}>ปิดการขาย</option>

                            </select>
                        </div>
                        <div className='flex flex-col'>
                            <label className='text-sm font-medium text-gray-700 mb-2'>สถานะที่นั่ง/seatStatus?</label>
                            <select
                                value={formTemp.seatStatus}
                                name='seatStatus'
                                onChange={handleOnChange}
                                className='w-full px-3 py-2 rounded-xl border border-gray-200 bg-gray-50/60 text-gray-900 outline-none focus:ring-2 focus:ring-brand-pink/40 focus:border-brand-pink'
                            >
                                <option value='' disabled>กรุณาเลือก</option>
                                <option value='AVAILABLE'>ว่าง</option>
                                <option value='NEARLY_FULL'>ใกล้เต็ม</option>
                                <option value='FULL'>เต็ม</option>
                                <option value='CLOSED'>ปิด</option>
                            </select>
                        </div>
                    </div>


                    {/* ปุ่ม Search */}
                    <div className='flex flex-col sm:flex-row justify-end gap-3 mt-6'>
                        <button
                            type='submit'
                            className='sm:mt-0 px-4 py-2.5 bg-brand-pink text-white rounded-xl hover:bg-pink-600 shadow-sm'
                        >
                            ค้นหา
                        </button>
                        <button
                            type='button'
                            className='sm:mt-0 px-4 py-2.5 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 ring-1 ring-gray-200'
                            onClick={handleReset}
                        >
                            ยกเลิก
                        </button>
                    </div>
                </div>
            </form>


            {/* fetch table  */}
            <div className='overflow-x-auto bg-white shadow-sm ring-1 ring-gray-200/70 rounded-2xl mt-6 p-4 sm:p-6'>
                <div className='flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-5'>
                    <h2 className='text-lg font-semibold text-gray-800'>รายการแพ็คเกจทัวร์</h2>
                    <Link
                        to='/admin/tourpackage/detail'
                        className='inline-flex items-center justify-center px-4 py-2.5 bg-brand-pink text-white rounded-xl hover:bg-pink-600 shadow-sm'
                    >
                        เพิ่มรายการ
                    </Link>
                </div>

                {loading ? (
                    <div className='flex flex-col items-center justify-center py-12'>
                        <Loader className='animate-spin text-brand-pink w-10 h-10 mb-2' />
                        <p className='text-center text-gray-500 mt-2'>กำลังโหลดข้อมูล...กรุณารอสักครู่</p>
                    </div>

                ) : error ? (
                    <div className='flex flex-col items-center justify-center py-12'>
                        <p className='text-center text-red-600 font-semibold'>เกิดข้อผิดพลาด: {error}</p>
                        <button
                            onClick={() => window.location.reload()}
                            className='mt-2 underline'
                        >
                            ลองใหม่อีกครั้ง
                        </button>
                    </div>
                ) : (
                    <>
                        <table className='min-w-full text-sm text-left text-gray-600'>
                            <thead className='text-xs sm:text-sm text-gray-700 uppercase bg-gray-100'>
                                <tr>
                                    <th className='px-4 py-2'>เลขไอดี</th>
                                    <th className='px-4 py-2'>ชื่อทัวร์แพ็คเกจ</th>
                                    <th className='px-4 py-2'>รหัสทัวร์</th>
                                    <th className='px-4 py-2'>จำนวน</th>
                                    <th className='px-4 py-2'>ขายแล้ว</th>
                                    <th className='px-4 py-2'>คงเหลือ</th>
                                    <th className='px-4 py-2'>สถานะที่นั่ง</th>
                                    <th className='px-4 py-2'>ราคาผู้ใหญ่</th>
                                    <th className='px-4 py-2'>ทัวร์แนะนำ</th>
                                    <th className='px-4 py-2'>วันที่เดินทาง</th>
                                    <th className='px-4 py-2'>วันที่สิ้นสุด</th>
                                    <th className='px-4 py-2'>สถานะทัวร์</th>
                                    <th className='px-4 py-2'>ประเภท/ทวีป</th>
                                    <th className='px-4 py-2'>ประเทศ</th>
                                    <th className='px-4 py-2 text-center'>จัดการ</th>
                                </tr>
                            </thead>

                            <tbody>
                                {tourpackages.length > 0 ? (
                                    tourpackages.map((item) => (
                                        <tr key={item.id} className='border-b border-gray-100 hover:bg-pink-50/30'>
                                            <td className='px-4 py-2'>{item.id}</td>
                                            <td className='px-4 py-2'>{item.title}</td>
                                            <td className='px-4 py-2'>{item.tourCode}</td>
                                            <td className='px-4 py-2'>{item.maxSeats}</td>
                                            <td className='px-4 py-2'>{item.sold}</td>
                                            <td className='px-4 py-2'>{item.remainingSeats}</td>
                                            <td className='px-4 py-2 font-bold'>
                                                <span className={SEAT_STATUS_CONFIG[item.seatStatus]?.color || 'text-gray-600'}>
                                                    {SEAT_STATUS_CONFIG[item.seatStatus]?.label || 'ไม่ระบุ'}
                                                </span>
                                            </td>
                                            <td className='px-4 py-2'>{item.priceAdult}</td>
                                            <td className='px-4 py-2'>{item.isRecommend ? '⭐แนะนำ' : '-'}</td>
                                            <td className='px-4 py-2'>{formatThaiDate(item.startDate)}</td>
                                            <td className='px-4 py-2'>{formatThaiDate(item.endDate)}</td>
                                            <td className='px-4 py-2 text-center'>
                                                {item.isActive ? (
                                                    <span className='text-green-600 text-sm font-bold'>เปิด</span>
                                                ) : (
                                                    <span className='text-red-600 text-sm font-bold'>ปิด</span>
                                                )}
                                            </td>
                                            <td className='px-4 py-2'>{item.category?.name}</td>
                                            <td className='px-4 py-2'>{item.country?.name}</td>
                                            <td className='px-4 py-2 text-center'>
                                                <Link
                                                    to={`/admin/tourpackage/detail/${item.id}`}
                                                    className='text-blue-600 hover:text-blue-800 inline-flex items-center gap-1'
                                                >
                                                    <FaSearch />
                                                    ดูรายละเอียด
                                                </Link>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={16} className='text-center text-gray-500 font-semibold py-8'>
                                            ไม่พบข้อมูลแพ็คเกจที่คุณค้นหา
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>

                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={(page) => setCurrentPage(page)}
                        />
                    </>
                )}
            </div>
        </>
    )
}
export default FormTourpackage
