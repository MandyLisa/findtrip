import FormBooking from '@/components/admin/FormBooking'


const Booking = () => {
  return (
    <>
      <div className='ml-2 p-2 bg-blue-600 text-white text-xl font-medium rounded-md w-full'>
        จัดการการจอง (ฺBooking Management)
      </div>
      <div className='ml-2 my-4'>
        <FormBooking />
      </div>

    </>
  )
}

export default Booking
