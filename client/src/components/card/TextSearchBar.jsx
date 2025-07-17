import { useState } from 'react'
import { Search } from 'lucide-react';
import { PlaneTakeoff } from 'lucide-react';

const TextSearchBar = ({ onSearch }) => {
  const [searchText, setSearchText] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (onSearch) {
      onSearch({ title: searchText })
    }
  }

  return (
    <form onSubmit={handleSubmit} className='flex justify-center w-full px-4 gap-4'>
      <div className='flex w-full max-w-6xl gap-2'>
        <div className='relative flex-grow'>
          <PlaneTakeoff className='absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400' />
          <input
            type='text'
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            placeholder='พิมพ์ชื่อประเทศหรือชื่อเมืองที่ต้องการ'
            className='w-full border-2 border-brand-pink rounded-md py-3 pl-10 pr-4 text-gray-700 placeholder-gray-400'
          />
        </div>
      </div>

      <button
        type='submit'
        className='bg-brand-pink text-white px-3 py-1 rounded-md hover:bg-pink-600 flex items-center gap-2'
      >
        <Search className='w-4 h-4' />
        <span className='text-xl'>ค้นหา</span>
      </button>
    </form>
  )
}

export default TextSearchBar

