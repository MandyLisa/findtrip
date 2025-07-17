import { useParams } from 'react-router-dom' // ใช้อ่านค่าบน url
import FormTourpackageDetail from '../../components/admin/FormTourpackageDetail'

const TourpackageDetail = () => {

    const { id } = useParams();
    const isEdit = Boolean(id)

    return (
        <>
            <div className="flex justify-between items-center">
                <h1 className='text-lg font-bold'>
                    {isEdit ? `แก้ไขแพ็กเกจ ID: ${id}` : 'สร้างแพ็กเกจใหม่'}
                </h1>
            </div>

            <div className='ml-4 my-4'>
                <FormTourpackageDetail />
            </div>
        </>
    )
}

export default TourpackageDetail
