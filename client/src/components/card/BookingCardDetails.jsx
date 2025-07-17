import { formatDateRange } from '../../utils/formatDate'
import DownloadPDF from './DownloadPDF'

const BookingCardDetails = ({ booking }) => {
    // console.log('ดูตรงนี้', booking) // 

    if (!booking) {
        return <div className='font-semibold'>ไม่พบข้อมูลการจอง</div>
    }

    return (
        <div className='my-8 p-4 border-2 border-gray-700 rounded-md shadow-md'>
            <div className='flex flex-col md:flex-row justify-between items-start md:items-center gap-4'>
                <p className='text-xl md:text-2xl mt-2 md:mt-0'>รายละเอียดการจองของท่าน</p>
                <DownloadPDF pdfUrl={booking.tourPackage.tourPDF?.secure_url} />
            </div>
            <div className='flex flex-col mt-4'>
                <p className='mt-2 text-xl'>{booking.tourPackage.title}</p>
                <p className='mt-2 text-lg'>รหัส ({booking.tourPackage.tourCode})</p>
            </div>
            <div className='flex flex-col mt-6'>
                <p className='text-sm md:text-md mt-2'>ระยะเวลา : {booking.tourPackage.duration}</p>
                <p className='text-sm md:text-md mt-2'>เดินทาง : {formatDateRange(booking.tourPackage.startDate, booking.tourPackage.endDate)}</p>
                <p className='text-sm md:text-md mt-2'>สายการบิน : {booking.tourPackage.airline}</p>
                <p className='text-sm md:text-md mt-2'>โรงแรม : ระดับ {booking.tourPackage.starRating} ดาว</p>
            </div>
            <div className='flex flex-col md:flex-row flex-wrap gap-2 mt-8'>
                <p className='text-lg md:text-2xl'>
                    จำนวนผู้เดินทาง : ผู้ใหญ่&nbsp;&nbsp; {booking.adultCount}&nbsp;&nbsp; ท่าน&nbsp;&nbsp; |
                </p>
                <p className='text-lg md:text-2xl'>
                    เด็ก&nbsp;&nbsp; ( อายุไม่เกิน 2 ปี ) &nbsp;&nbsp;{booking.childCount} &nbsp;&nbsp;ท่าน
                </p>
            </div>
            <div className='text-2xl mt-8'>รายละเอียดราคา :</div>
            <div className="flex flex-col space-y-4 p-4">
                {[
                    {
                        label: '1. ผู้ใหญ่',
                        count: booking.adultCount,
                        price: booking.tourPackage.priceAdult,
                        total: booking.tourPackage.priceAdult * booking.adultCount,
                    },
                    {
                        label: '2. เด็ก',
                        count: booking.childCount,
                        price: booking.tourPackage.priceChild,
                        total: booking.tourPackage.priceChild * booking.childCount,
                    },
                    {
                        label: '3. พักเดี่ยว',
                        count: booking.singleStayCount,
                        price: booking.tourPackage.singleStayExtra,
                        total: booking.tourPackage.singleStayExtra * booking.singleStayCount,
                    },
                ].map((item, index) => (
                    <div
                        key={index}
                        className="grid grid-cols-1 md:grid-cols-[180px_1fr_1fr] gap-2 md:gap-4 items-center bg-gray-50 p-4 rounded-lg shadow-sm"
                    >
                        <p className="text-base md:text-xl">{item.label} {item.count} ท่าน</p>
                        <p className="text-base md:text-xl">X ฿{Number(item.price).toLocaleString('th-TH')} / ท่าน</p>
                        <p className="text-base md:text-xl text-right md:text-right">
                            รวม ฿{Number(item.total).toLocaleString('th-TH')}
                        </p>
                    </div>
                ))}

                <div className="grid grid-cols-1 md:grid-cols-[180px_1fr_1fr] gap-2 md:gap-4 items-center mt-4 pt-4 border-t border-gray-300">
                    <p className="text-base md:text-xl font-semibold text-gray-700">รวมทั้งหมด</p>
                    <div></div>
                    <p className="text-base md:text-xl font-semibold text-brand-pink text-right">
                        ฿{Number(booking.totalPrice).toLocaleString('th-TH')}
                    </p>
                </div>
            </div>
            <div className='flex flex-col md:flex-row gap-2 mt-6'>
                <p className='text-lg md:text-xl font-semibold text-gray-700'>สถานะการจอง : </p>
                <p className='text-lg md:text-xl font-semibold text-brand-pink'>{booking.bookingStatus}</p>
            </div>
            <div className='flex flex-col md:flex-row gap-2 mt-6'>
                <p className='text-lg md:text-xl font-semibold text-gray-700'>ค่าใช้จ่ายเพิ่มเติม : </p>
            </div>
            <div className='flex flex-col gap-2 bg-gray-50 p-6 mt-6 rounded-sm'>
                <p className=''>1. &nbsp;&nbsp;ค่าวีซ่า {Number(booking.tourPackage.priceVisa).toLocaleString('th-TH')} บาท / ท่าน</p>
                <p className=''>2. &nbsp;&nbsp;ค่าใช้จ่ายส่วนตัว</p>
                <p className=''>3. &nbsp;&nbsp;ค่าไกด์ทิป {Number(booking.tourPackage.priceGuide).toLocaleString('th-TH')} บาท / ท่าน</p>
                <p className=''>4. &nbsp;&nbsp;ค่าใช้จ่ายอื่นๆ จากสายการบิน (ถ้ามี)</p>
            </div>
        </div>
    )
}

export default BookingCardDetails
