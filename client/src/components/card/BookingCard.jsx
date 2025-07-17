// components/BookingCard.jsx - Enhanced Version
import { X } from 'lucide-react'

const BookingCard = ({
    data,
    onClick,
    onCancel,
    statusBadge,
    formatDateRange,
    showCancelButton = false
}) => {

    const handleCancelClick = (e) => {
        e.stopPropagation() // ป้องกันไม่ให้เรียก onClick ของการ์ด
        onCancel(data.id)
    }

    return (
        <div
            className='border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer bg-white relative'
            onClick={onClick}
        >
            {/* Cancel Button */}
            {showCancelButton && (
                <button
                    onClick={handleCancelClick}
                    className='absolute top-2 right-2 p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors z-10'
                    title='ยกเลิกการจอง'
                >
                    <X size={16} />
                </button>
            )}

            <div className='flex flex-col md:flex-row gap-4'>
                {/* Image */}
                <div className='flex-shrink-0'>
                    <img
                        src={data.images?.[0]?.url || data.tour?.images?.[0]?.url || 'https://via.placeholder.com/150x100'}
                        alt={data.title || data.tour?.title}
                        className='w-full md:w-32 h-24 object-cover rounded-lg'
                        onError={(e) => {
                            e.target.src = 'https://via.placeholder.com/150x100?text=No+Image';
                        }}
                    />
                </div>

                {/* Content */}
                <div className='flex-1 min-w-0'>
                    <div className='flex flex-col md:flex-row md:justify-between md:items-start gap-3'>
                        {/* Tour Details */}
                        <div className='flex-1'>
                            <h3 className='font-semibold text-gray-800 mb-2 line-clamp-2'>
                                {data.title || data.tour?.title}
                            </h3>

                            <div className='space-y-1 text-sm text-gray-600'>
                                <p>
                                    <span className='font-medium'>รหัสทัวร์:</span> ({data.tourCode || data.tour?.tourCode})
                                </p>
                                <p>
                                    <span className='font-medium'>เดินทาง:</span> {
                                        formatDateRange(
                                            data.startDate || data.tour?.startDate,
                                            data.endDate || data.tour?.endDate
                                        )
                                    }
                                </p>
                                <p>
                                    <span className='font-medium'>ประเทศ:</span> {data.country?.name || data.tour?.country?.name}
                                </p>
                                <p>
                                    <span className='font-medium'>สายการบิน:</span> {data.airline || data.tour?.airline}
                                </p>
                                {data.travelerCount && (
                                    <p>
                                        <span className='font-medium'>จำนวนผู้เดินทาง:</span> {data.travelerCount} ท่าน
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Price and Status */}
                        <div className='flex flex-col items-end gap-3'>
                            <div className='text-right'>
                                <p className='text-sm text-gray-500'>ยอดรวม:</p>
                                <p className='text-lg font-bold text-gray-800'>
                                    ฿{Number(data.totalAmount || data.priceAdult).toLocaleString('th-TH')}
                                </p>
                            </div>

                            {statusBadge}

                            {/* Booking Date */}
                            {data.createdAt && (
                                <p className='text-xs text-gray-500'>
                                    วันที่จอง: {new Date(data.createdAt).toLocaleDateString('th-TH')}
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Additional Info for specific statuses */}
            {data.status === 'PENDING' && data.paymentSlip && (
                <div className='mt-3 pt-3 border-t'>
                    <p className='text-sm text-blue-600'>
                        💳 อัพโหลดสลิปแล้ว - รอการตรวจสอบ
                    </p>
                </div>
            )}

            {data.status === 'FAILED' && (
                <div className='mt-3 pt-3 border-t'>
                    <p className='text-sm text-red-600'>
                        ❌ การชำระเงินไม่สำเร็จ - กรุณาลองใหม่อีกครั้ง
                    </p>
                </div>
            )}
        </div>
    )

}

export default BookingCard
