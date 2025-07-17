import { useNavigate } from "react-router-dom"
import { formatDateRange } from "../../utils/formatDate"


const X_card = ({ data }) => {

  const navigate = useNavigate()

  const handleOnClick = () => {
    navigate(`/tourdetail/${data.id}`)
  }

    return (
        <div className='flex flex-row sm:flex-row border border-brand-pink rounded-md mt-6 shadow-md p-3 hover:bg-gray-50'
             onClick={handleOnClick}
        >
            <div className='w-full sm:w-48 h-48 bg-gray-300 rounded text-center flex items-center justify-center'>
                <img
                    src={data.images[0].url}
                    className='w-full h-48 object-cover rounded'
                    alt='tour'
                />
            </div>

            <div className='flex flex-col sm:ml-6 flex-grow p-3'>
                <div className='text-xl font-semibold text-gray-800 mb-2 sm:mb-4 hover:underline'>
                    {data.title}
                </div>
                <div>
                    <div className='flex flex-col sm:flex-row text-lg text-gray-700 mb-2 gap-1 sm:gap-4'>
                        <div className=''>
                            รหัสทัวร์: ({data.tourCode})
                        </div>
                        <div className=''>
                            เดินทาง: {formatDateRange(data.startDate, data.endDate)}
                        </div>
                    </div>
                    <div className='flex flex-row sm:flex-row text-lg text-gray-700 mb-2 gap-1 sm:gap-4'>
                        <div className=''>
                            ประเทศ: {data.country.name}
                        </div>
                        <div className=''>
                            สายการบิน: {data.airline}
                        </div>
                    </div>

                    <div className='border-t border-gray-300 mr-4 my-4'></div>

                    <div className='flex flex-col sm:flex-row items-start sm:items-center justify-between text-gray-700 w-full'>
                        <div className='flex-grow text-lg text-gray-800 mb-2 font-semibold sm:mb-0'>
                            ราคาต่อท่าน
                        </div>
                        <button
                            className='w-full sm:w-32 h-10 bg-brand-pink text-white text-lg rounded-3xl 
                            hover:scale-105 hover:duration-200'
                        >
                            ฿{Number(data.priceAdult).toLocaleString('th-TH')}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default X_card
