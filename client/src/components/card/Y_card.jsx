import React from 'react'
import { useNavigate } from 'react-router-dom'
import { formatDateRange } from "../../utils/formatDate"

const Y_card = ({ data }) => {
    const navigate = useNavigate()

    const handleOnClick = () => {
        navigate(`/tourdetail/${data.id}`)
    }

    return (
        <div className='bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300
      hover:bg-gray-50'
            onClick={handleOnClick}
        >
            <div className='bg-gray-300 rounded text-center flex items-center justify-center'>
                <img
                    src={data?.images?.[0].url} // ป้องกัน error ถ้าไม่มีภาพ
                    className='w-full h-72 object-cover rounded'
                />
            </div>

            <div className='flex flex-col p-3 flex-grow'>
                <div className='text-xl font-semibold text-gray-800 mb-4 hover:underline'>
                    {data.title}
                </div>
                <div>
                    <div className='mb-2 font-semibold'>
                        รหัสทัวร์: ({data.tourCode})
                    </div>
                    <div className='mb-2'>
                        เดินทาง: {formatDateRange(data.startDate, data.endDate)}
                    </div>
                    <div className='mb-2'>
                        <div className='mb-2'>
                            ประเทศ: {data.country.name}
                        </div>
                        <div className='mb-2'>
                            สายการบิน: {data.airline}
                        </div>
                    </div>

                    <div className='border-t border-gray-300 mr-4 my-4'></div>

                    <div className='flex flex-row items-center justify-between text-gray-700 w-full'>
                        <div className='flex-grow text-xl text-gray-800 mb-2 font-semibold'>
                            ราคาต่อท่าน
                        </div>
                        <button
                            className='w-24 h-8 bg-brand-pink text-white text-lg rounded-3xl ml-auto mb-2
                        hover:scale-110 hover:duration-200'
                        >
                            ฿{Number(data.priceAdult).toLocaleString('th-TH')}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Y_card
