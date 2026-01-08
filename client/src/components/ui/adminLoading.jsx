const AdminLoading = () => {
  return (
    <div className='flex flex-col items-center justify-center min-h-screen gap-4'>
      <div className='animate-spin rounded-full h-12 w-12 border-4 border-gray-300 border-t-blue-600' />
      <p className='text-gray-600 text-2xl'>
        กำลังตรวจสอบสิทธิ์ผู้ดูแลระบบ...กรุณารอสักครู่
      </p>
    </div>
  )
}

export default AdminLoading