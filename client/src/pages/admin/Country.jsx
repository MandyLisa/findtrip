import FormCountry from '../../components/admin/FormCountry'

const Country = () => {
  return (
    <>
      <div className='ml-2 p-2 bg-blue-600 text-white text-xl font-medium rounded-md w-ful'>
        จัดการประเทศ (Country Management)
      </div>
      <div className='ml-2 my-4'>
        <FormCountry />
      </div>

    </>

  )
}

export default Country
