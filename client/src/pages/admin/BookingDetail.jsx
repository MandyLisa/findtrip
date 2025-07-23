import FormBookingDetail from '@/components/admin/FormBookingDetail'

const BookingDetail = () => {
    return (
        <>
            <div className='ml-2 p-2 bg-blue-600 text-white text-xl font-medium rounded-md w-full'>
                รายละเอียดการจอง (ฺBooking Detail)
            </div>
            <div className='ml-2 my-4'>
                <FormBookingDetail />
            </div>

        </>
    )
}

export default BookingDetail
