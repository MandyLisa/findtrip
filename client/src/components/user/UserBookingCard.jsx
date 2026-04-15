import { useNavigate } from 'react-router-dom'
import { formatDateRange } from '../../utils/formatDate'

const UserBookingCard = ({ data, bookingStatus }) => {
    const navigate = useNavigate()

    const handleOnClick = () => {
        navigate(`/user/payments/${data.id}`, { state: { bookingData: data } })
    }

    const statusKey = data.bookingStatus?.trim().toUpperCase() || 'UNKNOWN'
    const statusConfig = bookingStatus[statusKey]

    return (
        <div className='flex flex-row border border-brand-pink rounded-md mt-6 shadow-md p-3 hover:bg-gray-50'
            onClick={handleOnClick}
        >

            <div className='flex flex-col ml-6 flex-grow'>
                <div className='text-md font-semibold text-gray-700 mb-4'>
                    หมายเลขการจอง: #{data.id}
                </div>
                <div>
                    <div className='flex flex-row item-center text-sm text-gray-700'>
                        <div className='mb-2'>
                            ชื่อทัวร์: {data.tourPackage.title} ({data.tourPackage.tourCode})
                        </div>
                    </div>
                    <div className='flex flex-row item-center text-sm text-gray-700'>
                        <div className='mb-2'>
                            เดินทาง: {formatDateRange(data.tourPackage.startDate, data.tourPackage.endDate)}
                        </div>
                        <div className='mb-2 ml-4'>
                            สายการบิน: {data.tourPackage.airline}
                        </div>
                    </div>
                    <div className='flex flex-row item-center text-sm text-gray-700'>
                        <div className='mb-2'>
                            ราคารวม: ฿{Number(data.totalPrice).toLocaleString('th-TH')}
                        </div>
                    </div>

                    <div className='border-t border-gray-300 mr-2 my-2'></div>

                    <div className='flex flex-row items-center justify-between text-gray-700 w-full'>
                        <div className='flex-grow text-md text-gray-700 mb-2 font-semibold'>
                            สถานะการจอง
                        </div>
                        <button
                            className={`w-24 h-8 text-md rounded-2xl ml-auto
                            hover:scale-110 hover:duration-200 ${statusConfig?.color || 'text-gray-400'}`}
                        >
                            {statusConfig ? statusConfig.label : 'ไม่ทราบสถานะ'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default UserBookingCard
