const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    const pageNumbers = []

    // จำกัดจำนวนหน้าที่แสดง
    const visiblePages = [1, 2]

    visiblePages.forEach((page) => {
        if (page <= totalPages) {
            pageNumbers.push(page)
        }
    })

    return (
        <div className='flex flex-col items-center mt-6 space-y-2'>
            <p className='text-gray-500 text-sm'>
                หน้า {currentPage} จาก {totalPages}
            </p>

            {/* ปุ่มก่อนหน้า */}
            <div className='flex justify-center mt-6 space-x-2 flex-wrap'>
                <button
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className='px-3 py-1 rounded border bg-white hover:bg-gray-100 disabled:opacity-50'
                >
                    ก่อนหน้า
                </button>

                {/* ปุ่ม [1, 2] */}
                {pageNumbers.map((page) => (
                    <button
                        key={page}
                        onClick={() => onPageChange(page)}
                        className={`px-3 py-1 rounded border ${currentPage === page ? 'bg-brand-pink text-white' : 'bg-white hover:bg-gray-100'}`}
                    >
                        {page}
                    </button>
                ))}

                {/* จุดไข่ปลา */}
                {totalPages > 2 && (
                    <span className='px-2 py-1 text-gray-400'>...</span>
                )}

                {/* ปุ่มสุดท้าย */}
                <button
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className='px-3 py-1 rounded border bg-white hover:bg-gray-100 disabled:opacity-50'
                >
                    ถัดไป
                </button>
            </div>
        </div >
    )
}

export default Pagination
