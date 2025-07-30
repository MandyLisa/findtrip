import FormManageDetail from "@/components/admin/FormManageDetail"

const ManageDetail = () => {
  return (
    <>
      <div className='ml-2 p-2 bg-blue-600 text-white text-xl font-medium rounded-md w-full'>
        จัดการผู้ใช้งาน (User Management)
      </div>
      <div className='ml-2 my-4'>
        <FormManageDetail />
      </div>

    </>
  )
}

export default ManageDetail