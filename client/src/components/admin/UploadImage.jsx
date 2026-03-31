import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import Resizer from 'react-image-file-resizer'// ตัวทำให้ไฟล์ที่เราส่งไปเป็นแบบ body ไม่ใช่ไฟล์
import { removeImages, uploadImages } from '../../API/tourpackage'
import { Trash2 } from 'lucide-react'
import { LoaderCircle } from 'lucide-react'
import useAuthStore from '../../store/authStore'

const UploadImage = ({ form, setForm }) => {

    const token = useAuthStore((state) => state.token)
    const [isLoading, setIsLoading] = useState(false)

    // เคลียร์ loading หาก form.images ถูกล้างจากภายนอก
    useEffect(() => {
        if (Array.isArray(form.images) && form.images.length === 0) {
            setIsLoading(false)
        }
    }, [form.images.length])

    // console.log('5555555555555 ', form.images.length)

    const handleUpload = (e) => { // เอา f. นี้ไปผูกกับปุ่ม input ด้านล่าง และพอกดปุ่มก็จะให้ส่งไป backend 

        const images = e.target.files //  รับ FileList จาก <input type="file" />

        if (!images || images.length === 0) return // ถ้าไม่มีไฟล์ไม่ต้องทำอะไร

        setIsLoading(true) // ถ้ามีไฟล์ให้แสดง loading

        let allImages = form.images // สร้างตัวแปรไว้ใช้ push รูปเข้า array เดิม

        for (let i = 0; i < images.length; i++) { // วนแต่ละไฟล์ที่เลือก
            const image = images[i]
            // console.log(images[i])

            if (!image.type.startsWith('image/')) { //  เช็คว่าเป็นไฟล์รูปภาพหรือไม่ ถ้าไม่ใช่ให้ข้ามและแจ้งผู้ใช้
                toast.error(`ไฟล์ ${image.name} ไม่ใช่ไฟล์รูปภาพ`)
                continue
            }

            // Image Resize libray 
            Resizer.imageFileResizer( // Resize รูปภาพให้ขนาด 600x800, ความละเอียด 100%, ไม่หมุน, ได้ผลลัพธ์เป็น base64 ใน data
                image,
                600,
                800,
                'PNG',
                100,
                0,
                (data) => {
                    uploadImages(token, { image: data }) // เรียก API อัปโหลด → เมื่ออัปโหลดสำเร็จให้
                        .then((res) => {
                            allImages.push(res.data) // เพิ่มข้อมูลรูปลง form.images
                            setForm({
                                ...form,
                                images: allImages
                            })
                            setIsLoading(false) // ปิด loading
                            toast.success('อัพโหลดรูปภาพสำเร็จ') // แสดง toast แจ้งสำเร็จ
                        })
                        .catch((err) => {
                            console.log(err)
                            setIsLoading(false)
                        })
                },
                'base64' //แปลงรูปแบบไฟล์ให้อยู่ในรูปแบบ binary
            )
        }

    }

    // console.log(form)

    const handleDelete = (public_id) => { //  ถ้ารูปเหลือ 1 ห้ามลบ (เพื่อกันไม่ให้รูปหายหมด)
        setIsLoading(true)
        const images = form.images

        if (images.length === 1) {
            setIsLoading(false)
            return toast.error('รูปเหลือน้อยกว่า 1 ภาพ ห้ามลบ')
        }

        removeImages(token, public_id)
            .then((res) => { // EP.8 21.30      
                const filterImages = images.filter((item) => { // ถ้าใช้ปีกกาต้องมี return
                    return item.public_id !== public_id // EP.9 37.00
                })
                // console.log('filterImages', filterImages)
                setForm({ // ถ้าลบสำเร็จ → filter รูปที่เหลือไว้ แล้วอัปเดต form.images
                    ...form,
                    images: filterImages // EP9. 38.40 images ตัวนี้มาจากที่เราเซต form ในหน้า FormTourpackageDetail
                })
                setIsLoading(false)
                toast.success('ลบรูปภาพสำเร็จ')
            })
            .catch((err) => {
                console.log(err)
                setIsLoading(false)
            })
    }


    return (
        <div>
            <div className='flex ml-2 gap-4 mb-6'>
                {
                    form.images?.map((item, index) =>
                        <div className='relative' key={item.public_id || index}>
                            <img
                                className='w-24 h-24'
                                src={item.url}
                            />
                            <Trash2
                                onClick={() => handleDelete(item.public_id)}
                                className=' absolute bottom-1 right-0 text-white hover:text-gray-400'
                            />
                        </div>
                    )
                }
                {isLoading && (
                    <div className='w-24 h-24 flex items-center justify-center border-2 border-dashed border-gray-300 rounded'>
                        <LoaderCircle className='w-12 h-12 animate-spin text-gray-400' />
                    </div>
                )}
            </div>

            <div>
                <label className='inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md
               hover:bg-blue-700 transition-colors cursor-pointer'>
                    <span>เลือกรูปภาพ</span>
                    <input
                        type='file'
                        name='images'
                        className='hidden'
                        onChange={handleUpload}
                        multiple // อัพหลายรูป ถ้าไม่มีตรงนี้จะโหลดได้รูปเดียว
                        accept='image/*'
                    />
                </label>
            </div>
        </div>
    )
}
export default UploadImage
