const AuthCheckedLoading = ({role}) => {
    const message = role === 'ADMIN' || role === 'SUPER_ADMIN'  ?
    'กำลังตรวจสอบสิทธิ์การเข้าถึงในฐานะผู้ดูแลระบบ...กรุณารอสักครู่' :
    'กำลังตรวจสอบสิทธิ์การเข้าถึง...กรุณารอสักครู่'
  return (
    <div className='flex flex-col items-center justify-center min-h-screen gap-4'>
      <div className='animate-spin rounded-full h-12 w-12 border-4 border-gray-300 border-t-blue-600' />
      <p className='text-gray-600 text-2xl'>{message}</p>
    </div>
  )
}

export default AuthCheckedLoading