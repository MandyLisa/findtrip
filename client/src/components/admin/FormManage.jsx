import { getUserRoleList, listUsers } from "@/API/profile"
import useAuthStore from "@/store/authStore"
import { FileSearch, Loader } from "lucide-react"
import { useEffect, useState } from "react"
import { FaSearch } from "react-icons/fa"
import { Link } from "react-router-dom"
import Pagination from "../card/Pagination"


const FormManage = () => {
    const token = useAuthStore((state) => state.token)
    const [loading, setLoading] = useState(false)

    const [totalPages, setTotalPages] = useState(1)
    const [currentPage, setCurrentPage] = useState(1)
    const limit = 10

    // Search Form
    const searchForm = {
        id: '',
        email: '',
        name: '',
        phone: '',
        role: '',
        enable: ''
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

    // Drop down role list 
    const [roleList, setRoleList] = useState([])
    const fetchRoleList = async () => {
        try {
            const res = await getUserRoleList(token)
            console.log('ดู fetchRoleList', res)
            setRoleList(res.data.data)
            await fetchAllUser(form) // ดึงข้อมูลการจองหลังจากได้ status แล้ว
        } catch (err) {
            console.error('Error loading role list', err)
        }
    }

    // User Table
    const [allUser, setAllUser] = useState([])
    const fetchAllUser = async (form) => {
        setLoading(true)
        try {
            const res = await listUsers(token, currentPage, limit, form || {})
            console.log('ดู fetchAllUser ตรงนี้', res)
            setAllUser(res.data.data)
            setTotalPages(res.data.totalPage)
        } catch (err) {
            console.log('Error fetching All User', err)
        } finally {
            setLoading(false)
        }
    }

    const handleSearch = async (e) => {
        e.preventDefault()
        setCurrentPage(1)
        setForm(formTemp)
        fetchAllUser(formTemp)
    }

    const handleReset = () => {
        setForm(searchForm)
        setFormTemp(searchForm)
        setCurrentPage(1)
        fetchAllUser(searchForm)
    }

    useEffect(() => {
        if (token) {
            fetchRoleList()
            fetchAllUser(form)
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
                        <h1 className='ml-3 text-lg font-medium text-gray-700'>ค้นหาผู้ใช้งาน</h1>
                    </div>

                    <div className='flex flex-row mt-4 gap-4'>
                        <div className='flex flex-col basis-1/4'>
                            <label className='text-md mb-2'>เลขผู้ใช้งาน/User No.</label>
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
                                value={formTemp.email}
                                onChange={handleOnChange}
                                name='email'
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
                            <label className='text-md mb-2'>โทรศัพท์/Phone No.</label>
                            <input
                                value={formTemp.phone}
                                onChange={handleOnChange}
                                name='phone'
                                type='text'
                                className='w-full px-2 py-1 border-2 rounded border-brand-pink'
                            />
                        </div>

                        <div className='flex flex-col basis-1/4'>
                            <label className='text-md mb-2'>บทบาท/Role</label>
                            <select
                                value={formTemp.role}
                                name='role'
                                onChange={handleOnChange}
                                className='w-full px-2 py-1 border-2 rounded border-brand-pink'
                            >
                                <option value='' disabled>กรุณาเลือก</option>
                                {
                                    roleList.map((status) => (
                                        <option key={status} value={status}>{status}</option>
                                    ))
                                }
                            </select>
                        </div>

                        <div className='flex flex-col basis-1/4'>
                            <label className='text-md mb-2'>สถานะบัญชี/Account Status?</label>
                            <select
                                value={formTemp.enable}
                                name='enable'
                                onChange={handleOnChange}
                                className='w-full px-2 py-1 border-2 rounded border-brand-pink'
                            >
                                <option value='' disabled>กรุณาเลือก</option>
                                <option value={true}>เปิด</option>
                                <option value={false}>ปิด</option>

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
                                    <th className='px-4 py-2'>เลขผู้ใช้งาน</th>
                                    <th className='px-4 py-2'>ชื่อ</th>
                                    <th className='px-4 py-2'>อีเมล์</th>
                                    <th className='px-4 py-2'>หมายเลขโทรศัพท์</th>
                                    <th className='px-4 py-2'>บทบาท</th>
                                    <th className='px-4 py-2'>สถานะบัญชี</th>
                                    <th className='px-4 py-2 text-center'>จัดการ</th>
                                </tr>
                            </thead>

                            <tbody>
                                {allUser.length > 0 ? (
                                    allUser.map((item) => (
                                        <tr key={item.id} className='border-b hover:bg-gray-100'>
                                            <td className='px-4 py-2'>{item.id}</td>
                                            <td className='px-4 py-2'>{item.name}</td>
                                            <td className='px-4 py-2'>{item.email}</td>
                                            <td className='px-4 py-2'>{item.phone}</td>
                                            <td className='px-4 py-2'>{item.role}</td>
                                            <td className='px-4 py-2 text center'>
                                                {item.enable ? (
                                                    <span className='text-green-600 text-sm font-bold'>เปิด</span>
                                                ) : (
                                                    <span className='text-red-600 text-sm font-bold'>ปิด</span>
                                                )}
                                            </td>
                                            <td className='px-4 py-2 text-center'>
                                                <Link
                                                    to={`/admin/manage/${item.id}`}
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
                                        <td colSpan={7} className='text-center text-gray-500 font-semibold py-8'>
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

export default FormManage
