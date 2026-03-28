import FormBooking from '@/components/admin/FormBooking'

const Booking = () => {
    return (
        <>
            <div className='w-full rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 sm:px-6 sm:py-4 shadow-md ml-2'>
                <h1 className='text-base sm:text-lg md:text-xl font-semibold text-white tracking-tight'>
                    จัดการการจอง (ฺBooking Management)
                </h1>
            </div>
            <div className='ml-2 my-4'>
                <FormBooking />
            </div>

        </>
    )
}



export default Booking
