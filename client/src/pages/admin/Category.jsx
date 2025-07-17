import FormCategory from '../../components/admin/FormCategory'

const Category = () => {

    return (
        <>
            <div className='ml-2 p-2 bg-blue-600 text-white text-xl font-medium rounded-md w-full'>
                จัดการประเภททัวร์ (Category Management)
            </div>
            <div className='ml-2 my-4'>
                <FormCategory />
            </div>

        </>
    )
}

export default Category
