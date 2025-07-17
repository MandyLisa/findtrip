export const InfoBox = ({ label, value }) => (
  <div className='flex flex-col items-center'>
    <p className='text-lg text-gray-700 mb-2'>{label}</p>
    <div className='flex justify-center border border-brand-pink rounded-md w-36'>
      <p className='px-3 py-1 text-brand-pink font-semibold'>
        {Number(value).toLocaleString('th-TH')}
      </p>
    </div>
  </div>
)

