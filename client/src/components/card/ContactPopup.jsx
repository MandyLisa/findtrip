import { X, Phone, MessageCircle, Mail } from 'lucide-react'

const ContactPopup = ({ isOpen, onClose, tourCode }) => {
    if (!isOpen) return null

    return (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4'>
            <div className='bg-white rounded-lg shadow-xl max-w-md w-full mx-4'>

                <div className='p-6 text-center'>
                    {/* Title */}
                    <h2 className='text-xl font-bold text-gray-800 mb-2'>
                        บอกรหัสการจองนี้ {tourCode}
                    </h2>
                    <p className='text-gray-600 mb-6'>
                        และแจ้งพนักงานของเราผ่านทางช่องทาง
                    </p>

                    {/* Contact Information */}
                    <div className='space-y-4 mb-6'>
                        <div className='flex items-center justify-center gap-2'>
                            <Phone size={20} className='text-blue-500' />
                            <span className='text-gray-700'>โทร.</span>
                            <a href='tel:02-026-3866' className='text-brand-pink font-medium hover:underline'>
                                02-022-2222
                            </a>
                        </div>

                        <div className='flex items-center justify-center gap-2'>
                            <MessageCircle size={20} className='text-green-500' />
                            <span className='text-gray-700'>Line ID.</span>
                            <a href='https://line.me/ti/p/@kaitour' className='text-brand-pink font-medium hover:underline'>
                                @findtrip
                            </a>
                        </div>

                        <div className='flex items-center justify-center gap-2'>
                            <Mail size={20} className='text-red-500'/>
                            <span className='text-gray-700'>E-mail.</span>
                            <a href='mailto:kaitour@up-operation.com' className='text-brand-pink font-medium hover:underline'>
                                findtrip@operation.com
                            </a>
                        </div>
                    </div>

                    {/* Close button */}
                    <button
                        onClick={onClose}
                        className='w-full bg-brand-pink text-white py-3 px-6 rounded-lg hover:bg-pink-600 transition-colors font-medium'
                    >
                        ตกลง
                    </button>
                </div>
            </div>
        </div>
    )
}

export default ContactPopup
