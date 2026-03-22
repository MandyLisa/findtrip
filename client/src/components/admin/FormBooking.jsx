import { getBookingStatusList, listBooking } from '@/API/booking'
import useAuthStore from '@/store/authStore'
import { FileSearch, Loader } from 'lucide-react'
import { useEffect, useState } from 'react'
import { FaSearch } from 'react-icons/fa'
import { Link } from 'react-router-dom'
import Pagination from '../card/Pagination'



const FormBooking = () => {
    const token = useAuthStore((state) => state.token)
    const [loading, setLoading] = useState(false)

    const [totalPages, setTotalPages] = useState(1)
    const [currentPage, setCurrentPage] = useState(1)
    const limit = 10

    // Search Form
    const searchForm = {
        id: '',
        userEmail: '',
        name: '',
        bookingStatus: '',
    }

    const [form, setForm] = useState(searchForm)
    const [formTemp, setFormTemp] = useState(searchForm)

    const handleOnChange = (e) => {
        const { name, value } = e.target
        setFormTemp((prevForm) => ({ // เก็บค่าชั่วคราว
            ...prevForm,
            [name]: value,
        }))
    }

    // Drop down
    const [bookingStatusList, setBookingStatusList] = useState([])
    const fetchBookingStatus = async () => {
        try {
            const res = await getBookingStatusList(token)
            // console.log('ดู fetchBookingStatus', res)
            setBookingStatusList(res.data.data)
            await fetchAllBooking(form) // ดึงข้อมูลการจองหลังจากได้ status แล้ว
        } catch (err) {
            console.error('Error loading booking status or booking', err)
        }
    }

    // Booking Table
    const [allBooking, setAllBooking] = useState([])

    const fetchAllBooking = async (form) => {
        setLoading(true)
        try {
            const res = await listBooking(token, currentPage, limit, form || {})
            console.log('ดู listBooking ตรงนี้', res)
            setAllBooking(res.data.data)
            setTotalPages(res.data.totalPage)
        } catch (err) {
            console.log('Error fetching All Booking List', err)
        } finally {
            setLoading(false)
        }
    }

    const handleSearch = async (e) => {
        e.preventDefault()
        setCurrentPage(1)
        setForm(formTemp)
        fetchAllBooking(formTemp)
    }

    const handleReset = () => {
        setForm(searchForm)
        setFormTemp(searchForm)
        setCurrentPage(1)
        fetchAllBooking(searchForm)
    }

    useEffect(() => {
        if (token) {
            fetchBookingStatus()
            // fetchAllBooking(form)
        }
    }, [token, currentPage])


    return (
        <>
            <form onSubmit={handleSearch}>
                <div className='overflow-x-auto bg-white shadow-md rounded-md mt-8 p-6'>
                    <div className='inline-flex items-center'>
                        <div className='bg-blue-600 w-12 h-12 flex items-center justify-center'>
                            <FileSearch className='w-6 h-6 text-white' />
                        </div>
                        <h1 className='ml-3 text-lg font-medium text-gray-700'>ค้นหาแพ็คเกจทัวร์</h1>
                    </div>

                    <div className='flex flex-row mt-4 gap-4'>
                        <div className='flex flex-col basis-1/4'>
                            <label className='text-md mb-2'>เลขการจอง/Booking No.</label>
                            <input
                                value={formTemp.id}
                                onChange={handleOnChange}
                                name='id'
                                type='number'
                                className='w-full px-2 py-1 border-2 rounded border-brand-pink'
                            />
                        </div>

                        <div className='flex flex-col basis-1/4'>
                            <label className='text-md mb-2'>อีเมล์ผู้ใช้/User Email</label>
                            <input
                                value={formTemp.userEmail}
                                onChange={handleOnChange}
                                name='userEmail'
                                type='text'
                                className='w-full px-2 py-1 border-2 rounded border-brand-pink'
                            />
                        </div>

                        <div className='flex flex-col basis-1/4'>
                            <label className='text-md mb-2'>ชื่อผู้ใช้/Name</label>
                            <input
                                value={formTemp.name}
                                onChange={handleOnChange}
                                name='name'
                                type='text'
                                className='w-full px-2 py-1 border-2 rounded border-brand-pink'
                            />
                        </div>

                        <div className='flex flex-col basis-1/4'>
                            <label className='text-md mb-2'>สถานะการจอง/bookingStatus</label>
                            <select
                                value={formTemp.bookingStatus}
                                name='bookingStatus'
                                onChange={handleOnChange}
                                className='w-full px-2 py-1 border-2 rounded border-brand-pink'
                            >
                                <option value='' disabled>กรุณาเลือก</option>
                                {
                                    bookingStatusList.map((status) => (
                                        <option key={status} value={status}>{status}</option>
                                    ))
                                }
                            </select>
                        </div>
                    </div>

                    <div className='flex justify-end gap-4 mt-4'>
                        <button
                            type='submit'
                            className='mt-4 p-2 bg-brand-pink text-white ml-4 rounded-md hover:bg-pink-600'
                        >
                            ค้นหา
                        </button>
                        <button
                            type='button'
                            className='mt-4 p-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300'
                            onClick={handleReset}
                        >
                            ยกเลิก
                        </button>
                    </div>
                </div>
            </form>


            <div className='overflow-x-auto bg-white shadow-md rounded-md mt-8 p-6'>
                <div className='flex justify-between mb-5'>
                    <h2 className='text-lg font-semibold text-gray-700 mb-4'>รายการจองทัวร์</h2>
                </div>

                {loading ? (
                    <div className='flex flex-col items-center justify-center py-12'>
                        <Loader className='animate-spin text-brand-pink w-10 h-10 mb-2' />
                        <p className='text-center text-gray-500 mt-2'>กำลังโหลดข้อมูล...กรุณารอสักครู่</p>
                    </div>
                ) : (
                    <>
                        <table className='min-w-full text-sm text-left text-gray-600'>
                            <thead className='text-sm text-gray-700 uppercase bg-gray-200'>
                                <tr>
                                    <th className='px-4 py-2'>เลขการจอง</th>
                                    <th className='px-4 py-2'>ชื่อ-นามสกุล</th>
                                    <th className='px-4 py-2'>อีเมล์</th>
                                    <th className='px-4 py-2'>เลขทัวร์</th>
                                    <th className='px-4 py-2'>รหัสทัวร์</th>
                                    <th className='px-4 py-2'>ผู้ใหญ่</th>
                                    <th className='px-4 py-2'>เด็ก</th>
                                    <th className='px-4 py-2'>พักแยก</th>
                                    <th className='px-4 py-2'>ราคารวม</th>
                                    <th className='px-4 py-2'>สถานะการจอง</th>
                                    <th className='px-4 py-2 text-center'>จัดการ</th>
                                </tr>
                            </thead>

                            <tbody>
                                {allBooking.length > 0 ? (
                                    allBooking.map((item) => {
                                        // console.log('ดู item ใน allBooking', item)
                                        return (
                                            <tr key={item.id} className='border-b hover:bg-gray-100'>
                                                <td className='px-4 py-2'>{item.id}</td>
                                                <td className='px-4 py-2'>{item.user.name} {item.user.surname}</td>
                                                <td className='px-4 py-2'>{item.user.email}</td>
                                                <td className='px-4 py-2'>{item.tourPackageId}</td>
                                                <td className='px-4 py-2'>{item.tourPackage.tourCode}</td>
                                                <td className='px-4 py-2'>{item.adultCount}</td>
                                                <td className='px-4 py-2'>{item.childCount}</td>
                                                <td className='px-4 py-2'>{item.singleStayCount}</td>
                                                <td className='px-4 py-2'>{item.totalPrice}</td>
                                                <td className='px-4 py-2 font-bold'>
                                                    {item.bookingStatus === 'DRAFT' && <span className='text-gray-500'>DRAFT</span>}          
                                                    {item.bookingStatus === 'PENDING' && <span className='text-blue-500'>PENDING</span>}
                                                    {item.bookingStatus === 'PAID' && <span className='text-green-600'>PAID</span>}
                                                    {item.bookingStatus === 'FAILED' && <span className='text-orange-700'>FAILED</span>}
                                                    {item.bookingStatus === 'CANCELLED' && <span className='text-red-500'>CANCELLED</span>}
                                                    {/* Fallback Case */}
                                                    {!['DRAFT', 'PENDING', 'PAID', 'FAILED', 'CANCELLED'].includes(item.bookingStatus) && (
                                                        <span className='text-gray-400'>{item.bookingStatus || 'ไม่มีสถานะ'}</span>
                                                    )}     
                                                </td>
                                                <td className='px-4 py-2 text-center'>
                                                    <Link
                                                        to={`/admin/booking/${item.id}`}
                                                        className='text-blue-600 hover:text-blue-800 inline-flex items-center gap-1'
                                                    >
                                                        <FaSearch />
                                                        ดูรายละเอียด
                                                    </Link>
                                                </td>
                                            </tr>
                                        )
                                    })
                                ) : (
                                    <tr>
                                        <td colSpan={11} className='text-center text-gray-500 font-semibold py-8'>
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
export default FormBooking
