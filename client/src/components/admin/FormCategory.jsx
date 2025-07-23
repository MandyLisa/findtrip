import { useState, useEffect } from 'react'
import { createCategory, updateCategory, removeCategory } from '../../API/category'
import { toast } from 'react-toastify'
import { Loader, Pencil, Search } from 'lucide-react'
import Pagination from '../card/Pagination'
import useTourDataStore from '../../store/tourDataStore'
import useAuthStore from '../../store/authStore'
import ConfirmDialog from '../ui/ConfirmDialog'

const FormCategory = () => {

    const token = useAuthStore((state) => state.token)
    const [name, setName] = useState('')
    const [editMode, setEditMode] = useState(false)
    const [editId, setEditId] = useState(null)
    const [loading, setLoading] = useState(false)

    const getCategory = useTourDataStore((state) => state.getCategory)
    const categories = useTourDataStore((state) => state.categories)

    const totalPages = useTourDataStore((state) => state.totalPages)
    const [currentPage, setCurrentPage] = useState(1)
    const limit = 5


    // Add Category
    const handleSubmit = async (e) => {
        e.preventDefault() // ป้องกันการ refresh หน้าเวลากด submit

        if (!name.trim()) {
            return toast.warning('กรุณาเพิ่มหมวดหมู่ที่ต้องการ')
        }

        setLoading(true)

        try {
            if (editMode) {
                const res = await updateCategory(token, editId, { name })
                toast.success(`แก้ไขรายการ ${res.data.name} สำเร็จ!`)
                setEditMode(false)
                setEditId(null)
            } else {
                const res = await createCategory(token, { name })
                toast.success(`เพิ่มรายการ ${res.data.name} สำเร็จ!`)
            }
            setName('')
            getCategory(token)
        } catch (err) {
            const message = err?.response?.data?.message
            console.log('ดู message catch error', message)
            if (message) {
                toast.error(`ชื่อ ${name} มีอยู่แล้วในระบบ!`)
            } else {
                toast.error('เกิดข้อผิดพลาดบางอย่าง') // กรณี server ล่ม, network error, หรือ error จาก Axios 
            }
            console.log(err)
        } finally {
            setLoading(false)
        }
    }

    // Edit Category
    const handleEdit = (id, currentName) => {
        setEditMode(true)
        setEditId(id)
        setName(currentName)
    }

    const handleCancelEdit = () => {
        setEditMode(false)
        setEditId(null)
        setName('')
    }

    // Delete Category
    const handleRemove = async (id) => {
        setLoading(true)
        try {
            const res = await removeCategory(token, id)
            toast.success(`ลบ ${res.data.name} สำเร็จ`)
            getCategory(token)
        } catch (err) {
            console.log(err)
        } finally {
            setLoading(false)
        }
    }

    // Search Category
    const searchForm = {
        id: '',
        name: '',
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

    const fetchCategories = async (form) => {
        setLoading(true)
        try {
            const res = await getCategory(token, currentPage, limit, form || {}) // zustand store
        } catch (err) {
            console.log('Error fetchCategories ', err)
        } finally {
            setLoading(false)
        }
    }

    const handleSearch = async (e) => {
        e.preventDefault()
        setCurrentPage(1)
        setForm(formTemp)
        fetchCategories(formTemp)
    }

    const handleReset = () => {
        setForm(searchForm)
        setFormTemp(searchForm)
        setCurrentPage(1)
        fetchCategories(searchForm)
    }

    useEffect(() => {
        fetchCategories(form)
    }, [token, currentPage])


    return (
        <>
            <div className='flex gap-4'>
                {/* เพิ่มประเภททัวร์ */}
                <div className='p-4 bg-white shadow-md w-1/2 rounded-md mt-4'>
                    <div className='inline-flex items-center'>
                        <div className='bg-blue-600 w-12 h-12 flex items-center justify-center'>
                            <Pencil className='w-6 h-6 text-white' />
                        </div>
                        <h1 className='ml-3 text-lg font-medium text-gray-700'>เพิ่มประเภททัวร์</h1>
                    </div>

                    <form className='space-y-6 mt-8' onSubmit={handleSubmit}>
                        <div>
                            <label className='block text-md font-semibold text-gray-700 mt-2 mb-2'>
                                กรุณาเพิ่มประเภททัวร์/Category
                            </label>
                            <input
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className={`w-full px-3 py-1 border-2 border-blue-600 rounded
                                ${editMode ? 'bg-gray-100 border-gray-400' : 'bg-white border-blue-600'}`}
                                type='text'
                            />
                        </div>

                        {/* ปุ่มด้านขวา */}
                        <div className='flex justify-end gap-4'>
                            <button
                                className='p-2 bg-brand-pink text-white rounded-md hover:bg-pink-600'
                                type='submit'
                            >
                                {!editMode ? 'เพิ่มรายการ' : 'บันทึกการแก้ไข'}
                            </button>

                            {editMode && (
                                <button
                                    type='button'
                                    className='p-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300'
                                    onClick={handleCancelEdit}>
                                    ยกเลิก
                                </button>
                            )}
                        </div>
                    </form>
                </div>

                {/* ค้นประเภททัวร์ */}
                <div className='p-4 bg-white shadow-md w-1/2 rounded-md mt-4'>
                    <div className='inline-flex items-center mb-6'>
                        <div className='bg-blue-600 w-12 h-12 flex items-center justify-center'>
                            <Search className='w-6 h-6 text-white' />
                        </div>
                        <h1 className='ml-3 text-lg font-medium text-gray-700'>ค้นหาประเภททัวร์</h1>
                    </div>

                    <form className='space-y-6' onSubmit={handleSearch}>
                        <div className='grid grid-cols-2 gap-6'>
                            <div>
                                <label className='block text-md font-semibold text-gray-700 mt-2 mb-2'>
                                    เลขไอดี/ID No.
                                </label>
                                <input
                                    name='id'
                                    type='text'
                                    value={formTemp.id}
                                    onChange={handleOnChange}
                                    className='w-full px-3 py-1 border-2 border-blue-600 rounded'
                                />
                            </div>

                            <div>
                                <label className='block text-md font-semibold text-gray-700 mt-2 mb-2'>
                                    พิมพ์ชื่อประเภททัวร์/Category
                                </label>
                                <input
                                    name='name'
                                    type='text'
                                    value={formTemp.name}
                                    onChange={handleOnChange}
                                    className='w-full px-3 py-1 border-2 border-blue-600 rounded'
                                />
                            </div>
                        </div>

                        {/* ปุ่มอยู่ด้านขวา */}
                        <div className='flex justify-end gap-4 mt-4'>
                            <button
                                className='p-2 bg-brand-pink text-white rounded-md hover:bg-pink-600'
                                type='submit'
                            >
                                ค้นหา
                            </button>

                            <button
                                type='button'
                                className='p-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300'
                                onClick={handleReset}>
                                ยกเลิก
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            {/* ตาราง */}
            <div className='overflow-x-auto bg-white shadow-md rounded-md mt-8 p-6'>
                <h2 className='text-lg font-semibold text-gray-700 mb-4'>รายการประเภททัวร์</h2>

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
                                    <th className='px-4 py-2'>เลขไอดี</th>
                                    <th className='px-4 py-2'>ชื่อประเภททัวร์</th>
                                    <th className='px-4 py-2'>สร้างเมื่อ</th>
                                    <th className='px-4 py-2'>อัปเดตล่าสุด</th>
                                    <th className='px-4 py-2 text-center'>จัดการ</th>
                                </tr>
                            </thead>

                            <tbody>
                                {categories.length > 0 ? (
                                    categories.map((item) => (
                                        <tr key={item.id} className='border-b hover:bg-gray-100'>
                                            <td className='px-4 py-2'>{item.id}</td>
                                            <td className='px-4 py-2'>{item.name}</td>
                                            <td className='px-4 py-2'>{new Date(item.createdDate).toLocaleString()}</td>
                                            <td className='px-4 py-2'>{new Date(item.updatedDate).toLocaleString()}</td>
                                            <td className='px-4 py-2 text-center'>
                                                <div className='flex justify-center gap-x-5'>
                                                    <button
                                                        onClick={() => handleEdit(item.id, item.name)}
                                                        className='bg-orange-500 text-white px-3 py-1 rounded hover:bg-orange-600'
                                                    >
                                                        แก้ไข
                                                    </button>

                                                    <ConfirmDialog
                                                        title='คุณแน่ใจว่าต้องการลบรายการนี้?'
                                                        description={`คุณต้องการลบประเภท '${item.name}' ใช่หรือไม่? การลบนี้จะไม่สามารถย้อนกลับได้`}
                                                        confirmText='ลบเลย'
                                                        cancelText='ยกเลิก'
                                                        onConfirm={() => handleRemove(item.id)}
                                                    >
                                                        <button
                                                            className='bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600'
                                                        >
                                                            ลบ
                                                        </button>
                                                    </ConfirmDialog>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={5} className='text-center text-md text-gray-500 font-semibold py-8'>
                                            ไม่พบข้อมูลหมวดหมู่ที่คุณค้นหา
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
export default FormCategory
