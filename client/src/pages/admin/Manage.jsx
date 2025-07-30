import FormManage from '@/components/admin/FormManage'

const Manage = () => {
    return (
    <>
        <div className='ml-2 p-2 bg-blue-600 text-white text-xl font-medium rounded-md w-full'>
            จัดการผู้ใช้งาน (User Management)
        </div>
        <div className='ml-2 my-4'>
            <FormManage />
        </div>

    </>
    )
}

export default Manage
