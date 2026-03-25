import { getPaymentMethodList, getPaymentStatusList, listPayment } from "@/API/payment"
import useAuthStore from "@/store/authStore"
import { FileSearch, Loader } from "lucide-react"
import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import Pagination from "../card/Pagination"
import { FaSearch } from "react-icons/fa"

const FormPayment = () => {
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
        bookingId: '',
        paymentStatus: '',
        paymentMethod: ''
    }

    const [form, setForm] = useState(searchForm)
    const [formTemp, setFormTemp] = useState(searchForm)

    const handleOnChange = (e) => {
        const { name, value } = e.target
        setFormTemp((prevForm) => ({ // setFormTemp
            ...prevForm,
            [name]: value,
        }))
    }

    useEffect(() => {
        if (token) {
            fetchPaymentStatus()
            fetchPaymentMethod()
            // fetchAllPayment(form)
        }
    }, [token])

    // Drop down payment Status
    const [paymentStatusList, setPaymentStatusList] = useState([])
    const fetchPaymentStatus = async () => {
        try {
            const res = await getPaymentStatusList(token)
            // console.log('ดู fetchPaymentStatus', res)
            setPaymentStatusList(res.data.data)
        } catch (err) {
            console.error('Error loading payment status', err)
        }
    }


    // Drop down payment Method
    const [paymentMethodList, setPaymentMethodList] = useState([])
    const fetchPaymentMethod = async () => {
        try {
            const res = await getPaymentMethodList(token)
            // console.log('ดู fetchPaymentMethod', res)
            setPaymentMethodList(res.data.data)
        } catch (err) {
            console.error('Error loading payment method', err)
        }
    }

    useEffect(() => {
        if (token) {
            fetchAllPayment(form)
        }
    }, [token, currentPage, form])

    // Payment Table
    const [allPayment, setAllPayment] = useState([])
    const fetchAllPayment = async (form) => {
        setLoading(true)
        try {
            const res = await listPayment(token, currentPage, limit, form || {})
            // console.log('ดู listPayment ตรงนี้', res)
            setAllPayment(res.data.data)
            setTotalPages(res.data.totalPage)
        } catch (err) {
            console.log('Error fetching All Payment List', err)
        } finally {
            setLoading(false)
        }
    }

    const handleSearch = async (e) => {
        e.preventDefault()
        setCurrentPage(1)
        setForm(formTemp)
    }

    const handleReset = () => {
        setForm(searchForm)
        setFormTemp(searchForm)
        setCurrentPage(1)
    }

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
                            <label className='text-md mb-2'>เลขการชำระเงิน/Payment No.</label>
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
                            <label className='text-md mb-2'>เลขการจอง/Booking No.</label>
                            <input
                                value={formTemp.bookingId}
                                onChange={handleOnChange}
                                name='bookingId'
                                type='text'
                                className='w-full px-2 py-1 border-2 rounded border-brand-pink'
                            />
                        </div>

                        <div className='flex flex-col basis-1/4'>
                            <label className='text-md mb-2'>สถานะการชำระเงิน/paymentStatus</label>
                            <select
                                value={formTemp.paymentStatus}
                                name='paymentStatus'
                                onChange={handleOnChange}
                                className='w-full px-2 py-1 border-2 rounded border-brand-pink'
                            >
                                <option value='' disabled>กรุณาเลือก</option>
                                {
                                    paymentStatusList.map((status) => (
                                        <option key={status} value={status}>{status}</option>
                                    ))
                                }
                            </select>
                        </div>

                        <div className='flex flex-col basis-1/4'>
                            <label className='text-md mb-2'>ช่องทางชำระเงิน/Payment Method</label>
                            <select
                                value={formTemp.paymentMethod}
                                name='paymentMethod'
                                onChange={handleOnChange}
                                className='w-full px-2 py-1 border-2 rounded border-brand-pink'
                            >
                                <option value='' disabled>กรุณาเลือก</option>
                                {
                                    paymentMethodList.map((status) => (
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
                                    <th className='px-4 py-2'>หมายเลขชำระเงิน</th>
                                    <th className='px-4 py-2'>ชื่อ-นามสกุล</th>
                                    <th className='px-4 py-2'>อีเมล์</th>
                                    <th className='px-4 py-2'>เลขทัวร์</th>
                                    <th className='px-4 py-2'>เลขการจอง</th>
                                    <th className='px-4 py-2'>สถานะการจอง</th>
                                    <th className='px-4 py-2'>จำนวนเงิน</th>
                                    <th className='px-4 py-2'>สถานะการชำระเงิน</th>
                                    <th className='px-4 py-2'>ช่องทางชำระเงิน</th>
                                    <th className='px-4 py-2'>ธนาคาร</th>
                                    <th className='px-4 py-2 text-center'>จัดการ</th>
                                </tr>
                            </thead>

                            <tbody>
                                {allPayment.length > 0 ? (
                                    allPayment.map((item) => (
                                        <tr key={item.id} className='border-b hover:bg-gray-100'>
                                            <td className='px-4 py-2'>{item.id}</td>
                                            <td className='px-4 py-2'>{item.booking?.user?.name} {item.booking?.user.surname}</td>
                                            <td className='px-4 py-2'>{item.booking?.user.email}</td>
                                            <td className='px-4 py-2'>{item.booking?.tourPackageId}</td>
                                            <td className='px-4 py-2'>{item.bookingId}</td>
                                            <td className='px-4 py-2'>{item.booking?.bookingStatus}</td>
                                            <td className='px-4 py-2'>{item.amount}</td>
                                            <td className='px-4 py-2 font-bold'>
                                                {item.paymentStatus === 'PENDING' && <span className='text-blue-500'>PENDING</span>}
                                                {item.paymentStatus === 'PAID' && <span className='text-green-600'>PAID</span>}
                                                {item.paymentStatus === 'FAILED' && <span className='text-orange-700'>FAILED</span>}
                                                {item.paymentStatus === 'CANCELLED' && <span className='text-red-500'>CANCELLED</span>}
                                                {/* Fallback Case */}
                                                {!['DRAFT', 'PENDING', 'PAID', 'FAILED', 'CANCELLED'].includes(item.paymentStatus) && (
                                                    <span className='text-gray-400'>{item.paymentStatus || 'ไม่มีสถานะ'}</span>
                                                )}
                                            </td>
                                            <td className='px-4 py-2'>{item.paymentMethod}</td>
                                            <td className='px-4 py-2'>{item.bankName}</td>
                                            <td className='px-4 py-2 text-center'>
                                                <Link
                                                    to={`/admin/payment/${item.id}`}
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

export default FormPayment
