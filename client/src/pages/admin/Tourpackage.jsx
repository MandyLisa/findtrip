
import FormTourpackage from '../../components/admin/FormTourpackage'

const Tourpackage = () => {
    return (
        <>
            <div className='ml-4 p-2 bg-blue-600 text-white text-xl font-medium rounded-md w-full'>
                รายการแพ็คเกจทัวร์ (Tourpackage Management)
            </div>
            <div className='ml-4 my-4'>
                <FormTourpackage />
            </div>
        </>
    )
}

export default Tourpackage
