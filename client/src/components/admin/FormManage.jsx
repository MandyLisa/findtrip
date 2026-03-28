import { getUserRoleList, listUsers } from '@/API/profile'
import useAuthStore from '@/store/authStore'
import { FileSearch, Loader } from 'lucide-react'
import { useEffect, useState } from 'react'
import { FaSearch } from 'react-icons/fa'
import { Link } from 'react-router-dom'
import Pagination from '../card/Pagination'


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

    useEffect(() => {
        if (token) {
            fetchRoleList()
        }
    }, [token])


    // Drop down role list 
    const [roleList, setRoleList] = useState([])
    const fetchRoleList = async () => {
        try {
            const res = await getUserRoleList(token)
            // console.log('ดู fetchRoleList', res)
            setRoleList(res.data.data)
        } catch (err) {
            console.error('Error loading role list', err)
        }
    }

    useEffect(() => {
        if (token) {
            fetchAllUser(form)
        }
    }, [token, currentPage, form])


    // User Table
    const [allUser, setAllUser] = useState([])
    const fetchAllUser = async (form) => {
        setLoading(true)
        try {
            const res = await listUsers(token, currentPage, limit, form || {})
            // console.log('ดู fetchAllUser ตรงนี้', res)
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
        // fetchAllUser(formTemp)
    }

    const handleReset = () => {
        setForm(searchForm)
        setFormTemp(searchForm)
        setCurrentPage(1)
        // fetchAllUser(searchForm)
    }


    return (
        <>
            <form onSubmit={handleSearch}>
                <div className='mt-8 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-gray-200 sm:p-6'>
                    <div className='flex items-center gap-3'>
                        <div className='flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600'>
                            <FileSearch className='w-6 h-6 text-white' />
                        </div>
                        <h1 className='text-base font-semibold text-gray-800 sm:text-lg'>ค้นหาผู้ใช้งาน</h1>
                    </div>

                    <div className='mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3'>
                        <div className='flex flex-col'>
                            <label className='mb-2 text-sm font-medium text-gray-700'>เลขผู้ใช้งาน/User No.</label>
                            <input
                                value={formTemp.id}
                                onChange={handleOnChange}
                                name='id'
                                type='number'
                                className='w-full px-3 py-2 rounded-xl border border-gray-200 bg-gray-50/60 text-gray-900 outline-none focus:ring-2 focus:ring-brand-pink/40 focus:border-brand-pink'
                            />
                        </div>

                        <div className='flex flex-col'>
                            <label className='mb-2 text-sm font-medium text-gray-700'>อีเมล์ผู้ใช้/User Email</label>
                            <input
                                value={formTemp.email}
                                onChange={handleOnChange}
                                name='email'
                                type='text'
                                className='w-full px-3 py-2 rounded-xl border border-gray-200 bg-gray-50/60 text-gray-900 outline-none focus:ring-2 focus:ring-brand-pink/40 focus:border-brand-pink'
                            />
                        </div>

                        <div className='flex flex-col'>
                            <label className='mb-2 text-sm font-medium text-gray-700'>ชื่อผู้ใช้/Name</label>
                            <input
                                value={formTemp.name}
                                onChange={handleOnChange}
                                name='name'
                                type='text'
                                className='w-full px-3 py-2 rounded-xl border border-gray-200 bg-gray-50/60 text-gray-900 outline-none focus:ring-2 focus:ring-brand-pink/40 focus:border-brand-pink'
                            />
                        </div>

                        <div className='flex flex-col'>
                            <label className='mb-2 text-sm font-medium text-gray-700'>โทรศัพท์/Phone No.</label>
                            <input
                                value={formTemp.phone}
                                onChange={handleOnChange}
                                name='phone'
                                type='text'
                                className='w-full px-3 py-2 rounded-xl border border-gray-200 bg-gray-50/60 text-gray-900 outline-none focus:ring-2 focus:ring-brand-pink/40 focus:border-brand-pink'
                            />
                        </div>

                        <div className='flex flex-col'>
                            <label className='mb-2 text-sm font-medium text-gray-700'>บทบาท/Role</label>
                            <select
                                value={formTemp.role}
                                name='role'
                                onChange={handleOnChange}
                                className='w-full px-3 py-2 rounded-xl border border-gray-200 bg-gray-50/60 text-gray-900 outline-none focus:ring-2 focus:ring-brand-pink/40 focus:border-brand-pink'
                            >
                                <option value='' disabled>กรุณาเลือก</option>
                                {
                                    roleList.map((status) => (
                                        <option key={status} value={status}>{status}</option>
                                    ))
                                }
                            </select>
                        </div>

                        <div className='flex flex-col'>
                            <label className='mb-2 text-sm font-medium text-gray-700'>สถานะบัญชี/Account Status?</label>
                            <select
                                value={formTemp.enable}
                                name='enable'
                                onChange={handleOnChange}
                                className='w-full px-3 py-2 rounded-xl border border-gray-200 bg-gray-50/60 text-gray-900 outline-none focus:ring-2 focus:ring-brand-pink/40 focus:border-brand-pink'
                            >
                                <option value='' disabled>กรุณาเลือก</option>
                                <option value={true}>เปิด</option>
                                <option value={false}>ปิด</option>

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
                                            <th className='px-4 py-2'>เลขผู้ใช้งาน</th>
                                            <th className='px-4 py-2'>ชื่อ</th>
                                            <th className='px-4 py-2'>อีเมล์</th>
                                            <th className='px-4 py-2'>หมายเลขโทรศัพท์</th>
                                            <th className='px-4 py-2'>บทบาท</th>
                                            <th className='px-4 py-2'>สถานะบัญชี</th>
                                            <th className='px-4 py-2 text-center'>จัดการ</th>
                                        </tr>
                                    </thead>

                                    <tbody className='divide-y divide-gray-100'>
                                        {allUser.length > 0 ? (
                                            allUser.map((item) => (
                                                <tr key={item.id} className='hover:bg-pink-50/30'>
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
                                                            className='inline-flex items-center gap-1 font-semibold text-blue-600 hover:text-blue-800'
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

export default FormManage
