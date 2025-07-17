import React from 'react'

const Banner = () => {
  return (
      <div className='w-full'>
        <div className=' w-screen -mx-[calc((100vw-100%)/2)]'>
          <img
            src='/images/banner_1.jpg'
            alt="ทัวร์แนะนำ"
            className="w-full h-[450px] object-cover"
          />
        </div>
      </div>
  )
}

export default Banner
