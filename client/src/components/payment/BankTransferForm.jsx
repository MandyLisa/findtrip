import { CheckCircle2, ChevronDown, Upload, X, Eye, Loader2 } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'react-toastify'
import { uploadPaymentSlip } from '../../API/payment'
import { useNavigate } from 'react-router-dom'

const BankTransferForm = ({ token, bookingId, setIsSubmitting, isSubmitting }) => {
    const navigate = useNavigate()

    // local state 
    const [selectedBank, setSelectedBank] = useState(null)
    const [uploadedSlip, setUploadedSlip] = useState(null)
    const [isDropdownOpen, setIsDropdownOpen] = useState(false)
    const [loadingBankTransfer, setLoadingBankTransfer] = useState(false)

    // state สำหรับแสดงรูปภาพ
    const [imagePreview, setImagePreview] = useState(null) // แสดงรูป
    const [showPreview, setShowPreview] = useState(false) // ซ่อนรูป

    // ธนาคาร
    const banks = [
        { id: 'kbank', name: 'ธนาคารกสิกรไทย', account: '123-4-56789-0', accountName: 'บริษัท ฟายทริป จำกัด' },
        { id: 'scb', name: 'ธนาคารไทยพาณิชย์', account: '987-6-54321-0', accountName: 'บริษัท ฟายทริป จำกัด' },
        { id: 'bbl', name: 'ธนาคารกรุงเทพ', account: '555-1-23456-7', accountName: 'บริษัท ฟายทริป จำกัด' }
    ]

    // ฟังชั่นเลือกธนาคาร
    const handleBankSelect = (bank) => {
        setSelectedBank(bank)
        setIsDropdownOpen(false)
    }

    // ฟังชั่นก์อัพโหลดไฟล์
    const handleFileUpload = (e) => {
        const file = e.target.files[0] // เอาไฟล์แรกที่เลือก
        if (file) { // ตรวจสอบว่ามีไฟล์ก่อนส่ง

            setUploadedSlip(file) // อัปเดต state ด้วยไฟล์ที่เลือก
            // console.log('File selected:', file.name)

            const reader = new FileReader() // สร้าง preview สำหรับรูป
            reader.onload = (e) => {
                setImagePreview(e.target.result)

            }
            reader.readAsDataURL(file)
        }
    }

    //  ฟังก์ชันสำหรับประมวลผลการชำระเงินด้วยการโอนเงิน
    const processBankTransferPayment = async () => {

        if (!selectedBank) {
            toast.error('กรุณาเลือกธนาคารที่ต้องการทำรายการ')
            return // หยุดการทำงานถ้าไม่เลือก
        }
        if (!uploadedSlip) {
            toast.error('กรุณาอัปโหลดสลิป')
            return  // หยุดการทำงานถ้าไม่มี
        }

        // Step 1: เตรียม FormData สำหรับอัปโหลดสลิป และ เปลี่ยนสถานะเป็น "รอตรวจสอบ" ทันที
        const formData = new FormData()
        formData.append('bankId', selectedBank.id)
        formData.append('bankName', selectedBank.name)
        formData.append('slip', uploadedSlip)

        const paymentMethod = 'BANK_TRANSFER'

        try {

            setLoadingBankTransfer(true) // เริ่ม loading
            setIsSubmitting(true)        // ล็อคปุ่มยกเลิกที่หน้า Parent

            // Step 2: อัปโหลดสลิปการชำระเงิน
            await uploadPaymentSlip(token, bookingId, formData)
            toast.success('อัปโหลดสลิปสำเร็จแล้ว! กำลังรอการตรวจสอบ')

            // step 3: navigate ไป PaymentSucces
            navigate(`/user/payment-success?booking_id=${bookingId}&paymentMethod=${paymentMethod}&bankName=${selectedBank?.name || ''}`)

        } catch (error) {
            console.error('Bank transfer payment failed', error)
            setIsSubmitting(false)
            setLoadingBankTransfer(false)
            throw error        
        } 
    }

    // ฟังก์ชันลบไฟล์
    const handleRemoveFile = () => {
        setImagePreview(null)
        setShowPreview(false)
        setUploadedSlip(null)
        // document.getElementById('slip-upload').value = ''
    }

    // ฟังก์ชันแสดง/ซ่อนตัวอย่างรูป
    const togglePreview = () => {
        setShowPreview(!showPreview)
    }

    return (
        <div className='space-y-4 mt-4'>
            <div className='relative'>
                <button
                    type='button'
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className='w-full px-4 py-3 border border-gray-300 rounded-lg 
                    focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none
                    bg-white text-left flex items-center justify-between'
                >
                    <span className={selectedBank ? 'text-black' : 'text-gray-500'}>
                        {selectedBank ? selectedBank.name : 'โปรดเลือกธนาคารที่ต้องการทำรายการ'}
                    </span>
                    <ChevronDown className='w-5 h-5 text-gray-400' />
                </button>

                {isDropdownOpen && (
                    <div className='absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg'>
                        {banks.map((bank) => (
                            <button
                                key={bank.id}
                                type='button'
                                onClick={() => handleBankSelect(bank)}
                                className='w-full px-4 py-3 text-left hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg'
                            >
                                {bank.name}
                            </button>
                        ))}
                    </div>
                )}

                {selectedBank && (
                    <div className='bg-gray-50 p-4 mt-3 rounded-lg'>
                        <h3 className='font-medium text-gray-900 mb-2'>รายละเอียดบัญชี</h3>
                        <p className='text-sm text-gray-600'>ธนาคาร: {selectedBank.name}</p>
                        <p className='text-sm text-gray-600'>ชื่อบัญชี: {selectedBank.accountName}</p>
                        <p className='text-sm text-gray-600'>เลขบัญชี: {selectedBank.account}</p>
                    </div>
                )}

                <div>
                    <div className='block text-sm font-medium text-red-500 mt-6 mb-4'>
                        *แนบหลักฐานการโอนเงิน
                    </div>
                    <div className='relative'>
                        <input
                            type='file'
                            accept='image/*'
                            onChange={handleFileUpload}
                            className='hidden'
                            id='slip-upload'
                        />
                        <label
                            htmlFor='slip-upload'
                            className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 
                            cursor-pointer bg-white flex items-center justify-center space-x-2 hover:bg-gray-50'
                        >
                            <Upload className='w-5 h-5 text-gray-400' />
                            <span className='text-gray-600'>
                                {uploadedSlip ? uploadedSlip.name : 'เลือกไฟล์หลักฐานการโอนเงิน'}
                            </span>
                        </label>
                    </div>



                    {/* แสดงสถานะการอัพโหลด */}
                    {uploadedSlip && (
                        <div className='mt-4 space-y-3'>
                            <div className='flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200'>
                                <div className='flex items-center space-x-2 text-green-600'>
                                    <CheckCircle2 className='w-4 h-4' />
                                    <span className='text-sm'>อัพโหลดไฟล์เรียบร้อยแล้ว</span>
                                </div>

                                {/* ปุ่มดูตัวอย่าง */}
                                <div className='flex items-center space-x-2'>
                                    <button
                                        type='button'
                                        onClick={togglePreview}
                                        className='flex items-center space-x-1 px-3 py-1 text-sm text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-md transition-colors'
                                    >
                                        <Eye className='w-4 h-4' />
                                        <span>{showPreview ? 'ซ่อน' : 'ดูตัวอย่าง'}</span>
                                    </button>

                                    {/* ปุ่มลบ */}
                                    <button
                                        type='button'
                                        onClick={handleRemoveFile}
                                        className='flex items-center space-x-1 px-3 py-1 text-sm text-red-600 hover:text-red-800 hover:bg-red-50 rounded-md transition-colors'
                                    >
                                        <X className='w-4 h-4' />
                                        <span>ลบไฟล์</span>
                                    </button>
                                </div>
                            </div>

                            {/* แสดงตัวอย่างรูปภาพ */}
                            {showPreview && imagePreview && (
                                <div className='border border-gray-200 rounded-lg p-4 bg-gray-50'>
                                    <h4 className='text-sm font-medium text-gray-700 mb-3'>ตัวอย่างหลักฐานการโอนเงิน</h4>
                                    <div className='flex justify-center'>
                                        <img
                                            src={imagePreview}
                                            alt='หลักฐานการโอนเงิน'
                                            className='max-w-full max-h-96 object-contain rounded-lg shadow-sm border border-gray-200'
                                        />
                                    </div>
                                    <p className='text-xs text-gray-500 mt-2 text-center'>
                                        ไฟล์: {uploadedSlip.name}
                                    </p>
                                </div>
                            )}
                        </div>
                    )}

                    <div className='bg-brand-pink w-full h-[50px] mt-4 rounded-lg'>
                        <button
                            onClick={processBankTransferPayment}
                            className='text-xl text-white flex items-center justify-center h-[50px] w-full
                            hover:bg-pink-600 disabled:opacity-50 disabled:cursor-not-allowed'
                            disabled={loadingBankTransfer}
                        >
                            {loadingBankTransfer ? (
                                <>
                                    <Loader2 className='animate-spin' size={20} />
                                    กำลังส่งหลักฐานการชำระเงิน...กรุณารอสักครู่
                                </>
                            ) : (
                                'ส่งหลักฐานการชำระเงินที่นี่'
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default BankTransferForm
