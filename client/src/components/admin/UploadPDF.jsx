import { useState } from 'react'
import { toast } from 'react-toastify'
import { uploadPDF } from '../../API/tourpackage'
import { LoaderCircle } from 'lucide-react'
import useAuthStore from '../../store/authStore'

const UploadPDF = ({ form, setForm }) => {

    const token = useAuthStore((state) => state.token)
    const [isLoading, setIsLoading] = useState(false)

    const handleOnChange = (e) => {

        const filePDF = e.target.files[0]
        if (!filePDF) return


        if (filePDF.type !== 'application/pdf') {
            toast.error(`ไฟล์ ${filePDF.name} ไม่ใช่ไฟล์ PDF`)
            return
        }

        setIsLoading(true)

        const formData = new FormData() //เรียกใช้ FormData เพื่อส่งไฟล์ PDF ผ่าน API ไปยัง backend (เก็บได้ทั้งไฟล์และข้อมูลอื่น ๆ ในรูปแบบ key-value) 

        formData.append('upload_preset', 'your_unsigned_preset') // unsigned preset
        formData.append('resource_type', 'raw') // สำหรับ PDF
        formData.append('pdf', filePDF)

        uploadPDF(token, formData)
            .then((res) => {
                setForm({
                    ...form,
                    tourPDF: res.data
                })
                // console.log(res.data)
                toast.success('อัพโหลดไฟล์ PDF สำเร็จ')
                setIsLoading(false)
            })
            .catch((err) => {
                console.log(err)
                toast.error('เกิดข้อผิดพลาดในการอัปโหลดไฟล์ PDF')
                setIsLoading(false)
            })

            .finally(() => {
                setIsLoading(false)
            })
    }

    const getFileName = (url) => {
        if (!url) return ''
        const parts = url.split('/')
        return parts[parts.length - 1]
    }

    return (
        <div>
            <div className='flex gap-4 mt-8 mb-6'>
                <label className='inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors cursor-pointer'>
                    <span>เลือกไฟล์ PDF</span>
                    <input
                        type='file'
                        onChange={handleOnChange}
                        className='hidden'
                        accept='application/pdf'
                    />
                </label>

                {
                    isLoading && <LoaderCircle className='w-12 h-12 animate-spin text-gray-400' />
                }

                {form.tourPDF?.secure_url && (
                    <div className='ml-2 mt-4'>
                        <p className='text-gray-700'>ไฟล์ PDF ที่อัปโหลด:</p>
                        <a
                            href={`http://localhost:5000/api/pdfProxy?url=${encodeURIComponent(form.tourPDF.secure_url)}`}
                            target='_blank'
                            rel='noopener noreferrer'
                            className='text-blue-600 underline hover:text-blue-800'
                        >
                            {getFileName(form.tourPDF.secure_url)}<br />
                        </a>
                    </div>
                )}
            </div>
        </div>
    )
}

export default UploadPDF
