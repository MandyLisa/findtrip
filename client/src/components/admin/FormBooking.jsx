import { getBookingStatusList, listBooking } from '@/API/booking'
import useAuthStore from '@/store/authStore'
import { FileSearch, Loader } from 'lucide-react'
import { useEffect, useState } from 'react'
import { FaSearch } from 'react-icons/fa'
import { Link } from 'react-router-dom'
import Pagination from '../card/Pagination'



const FormBooking = () => {
    const token = useAuthStore((state) => state.token)
    const [loading, setLoading] = useState(true)

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
            // console.log('ดู listBooking ตรงนี้', res)
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
                <div className='mt-8 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-gray-200 sm:p-6'>
                    <div className='flex items-center gap-3'>
                        <div className='flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600'>
                            <FileSearch className='w-6 h-6 text-white' />
                        </div>
                        <h1 className='text-base font-semibold text-gray-800 sm:text-lg'>ค้นหาแพ็คเกจทัวร์</h1>
                    </div>

                    <div className='mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4'>
                        <div className='flex flex-col'>
                            <label className='mb-2 text-sm font-medium text-gray-700'>เลขการจอง/Booking No.</label>
                            <input
                                value={formTemp.id}
                                onChange={handleOnChange}
                                name='id'
                                type='number'
                                className='w-full rounded-xl border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none placeholder:text-gray-400 focus:border-brand-pink focus:ring-2 focus:ring-brand-pink/30'
                            />
                        </div>

                        <div className='flex flex-col'>
                            <label className='mb-2 text-sm font-medium text-gray-700'>อีเมล์ผู้ใช้/User Email</label>
                            <input
                                value={formTemp.userEmail}
                                onChange={handleOnChange}
                                name='userEmail'
                                type='text'
                                className='w-full rounded-xl border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none placeholder:text-gray-400 focus:border-brand-pink focus:ring-2 focus:ring-brand-pink/30'
                            />
                        </div>

                        <div className='flex flex-col'>
                            <label className='mb-2 text-sm font-medium text-gray-700'>ชื่อผู้ใช้/Name</label>
                            <input
                                value={formTemp.name}
                                onChange={handleOnChange}
                                name='name'
                                type='text'
                                className='w-full rounded-xl border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none placeholder:text-gray-400 focus:border-brand-pink focus:ring-2 focus:ring-brand-pink/30'
                            />
                        </div>

                        <div className='flex flex-col'>
                            <label className='mb-2 text-sm font-medium text-gray-700'>สถานะการจอง/bookingStatus</label>
                            <select
                                value={formTemp.bookingStatus}
                                name='bookingStatus'
                                onChange={handleOnChange}
                                className='w-full rounded-xl border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none focus:border-brand-pink focus:ring-2 focus:ring-brand-pink/30'
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

                    <div className='mt-6 flex flex-col items-stretch justify-end gap-3 sm:flex-row sm:items-center'>
                        <button
                            type='submit'
                            className='inline-flex items-center justify-center rounded-xl bg-brand-pink px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-pink-600'
                        >
                            ค้นหา
                        </button>
                        <button
                            type='button'
                            className='inline-flex items-center justify-center rounded-xl bg-gray-100 px-4 py-2.5 text-sm font-semibold text-gray-700 shadow-sm ring-1 ring-inset ring-gray-200 hover:bg-gray-200'
                            onClick={handleReset}
                        >
                            ยกเลิก
                        </button>
                    </div>
                </div>
            </form>


            <div className='mt-8 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-gray-200 sm:p-6'>
                <div className='mb-5 flex items-center justify-between'>
                    <h2 className='text-base font-semibold text-gray-800 sm:text-lg'>รายการจองทัวร์</h2>
                </div>

                {loading ? (
                    <div className='flex flex-col items-center justify-center py-12'>
                        <Loader className='animate-spin text-brand-pink w-10 h-10 mb-2' />
                        <p className='text-center text-gray-500 mt-2'>กำลังโหลดข้อมูล...กรุณารอสักครู่</p>
                    </div>
                ) : (
                    <>
                        <div className='-mx-4 overflow-x-auto sm:-mx-6'>
                            <div className='inline-block min-w-full align-middle px-4 sm:px-6'>
                                <table className='min-w-full text-sm text-left text-gray-700'>
                                    <thead className='bg-gray-100 text-xs font-semibold uppercase tracking-wider text-gray-700'>
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

                                    <tbody className='divide-y divide-gray-100'>
                                        {allBooking.length > 0 ? (
                                            allBooking.map((item) => {
                                                // console.log('ดู item ใน allBooking', item)
                                                return (
                                                    <tr key={item.id} className='hover:bg-pink-50/30'>
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
                                                                className='inline-flex items-center gap-1 font-semibold text-blue-600 hover:text-blue-800'
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
                            </div>
                        </div>

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
