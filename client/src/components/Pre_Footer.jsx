import { Phone } from 'lucide-react';
import { Mail } from 'lucide-react';
import { FaLine } from "react-icons/fa";
import { Link } from 'react-router-dom';

const Pre_Footer = () => {
    return (
        <div className='bg-white mt-12 mb-12'>
            <div className='mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl'>
                <div className='py-8 lg:py-12'>
                    <div className='grid grid-cols-1 lg:grid-cols-6 gap-8'>
                        {/* Contact Information Section */}
                        <div className='lg:col-span-1 space-y-6'>
                            {/* Phone */}
                            <div className='flex items-center'>
                                <div className='bg-brand-pink w-12 h-12 rounded-md flex items-center justify-center flex-shrink-0'>
                                    <Phone className='text-white w-6 h-6' />
                                </div>
                                <div className='ml-4'>
                                    <p className='text-gray-700 font-medium'>เบอร์โทรติดต่อ</p>
                                    <p className='text-brand-pink font-medium'>02-022-2222</p>
                                </div>
                            </div>

                            {/* Line ID */}
                            <div className='flex items-center'>
                                <div className='bg-brand-pink w-12 h-12 rounded-md flex items-center justify-center flex-shrink-0'>
                                    <FaLine className='text-white w-6 h-6' />
                                </div>
                                <div className='ml-4'>
                                    <p className='text-gray-700 font-medium'>Line ID</p>
                                    <a
                                        href="https://line.me"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className='text-brand-pink font-medium hover:underline'
                                    >
                                        @findtrip
                                    </a>
                                </div>
                            </div>

                            {/* Email */}
                            <div className='flex items-center'>
                                <div className='bg-brand-pink w-12 h-12 rounded-md flex items-center justify-center flex-shrink-0'>
                                    <Mail className='text-white w-6 h-6' />
                                </div>
                                <div className='ml-4'>
                                    <p className='text-gray-700 font-medium'>Email</p>
                                    <a
                                        href='mailto:findtrip@operation.com'
                                        className='text-brand-pink font-medium hover:underline'
                                    >
                                        findtrip@operation.com
                                    </a>
                                </div>
                            </div>
                        </div>

                        {/* Main Navigation */}
                        <div className='lg:col-span-1 space-y-6 space-x-6'>
                            <Link
                                to='/'
                                className='block text-gray-700 font-medium hover:text-brand-pink hover:underline transition-colors ml-6'
                            >
                                ทัวร์แนะนำ
                            </Link>
                            <Link
                                to='/'
                                className='block text-gray-700 font-medium hover:text-brand-pink hover:underline transition-colors'
                            >
                                แพ็คเกจทัวร์ทั้งหมด
                            </Link>
                            <Link
                                to='/'
                                className='block text-gray-700 font-medium hover:text-brand-pink hover:underline transition-colors'
                            >
                                เกี่ยวกับเรา
                            </Link>
                        </div>

                        {/* Asian Destinations */}
                        <div className='lg:col-span-1 space-y-4 space-x-6'>
                            <Link to='/' className='block text-gray-700 font-medium hover:text-brand-pink hover:underline transition-colors ml-6'>
                                ญี่ปุ่น
                            </Link>
                            <Link to='/' className='block text-gray-700 font-medium hover:text-brand-pink hover:underline transition-colors'>
                                จีน
                            </Link>
                            <Link to='/' className='block text-gray-700 font-medium hover:text-brand-pink hover:underline transition-colors'>
                                เวียดนาม
                            </Link>
                            <Link to='/' className='block text-gray-700 font-medium hover:text-brand-pink hover:underline transition-colors'>
                                เกาหลีใต้
                            </Link>
                            <Link to='/' className='block text-gray-700 font-medium hover:text-brand-pink hover:underline transition-colors'>
                                ฮ่องกง
                            </Link>
                        </div>

                        {/* European Destinations */}
                        <div className='lg:col-span-1 space-y-4 space-x-6'>
                            <Link to='/' className='block text-gray-700 font-medium hover:text-brand-pink hover:underline transition-colors ml-6'>
                                สเปน
                            </Link>
                            <Link to='/' className='block text-gray-700 font-medium hover:text-brand-pink hover:underline transition-colors'>
                                สวิตเซอร์แลนด์
                            </Link>
                            <Link to='/' className='block text-gray-700 font-medium hover:text-brand-pink hover:underline transition-colors'>
                                อังกฤษ
                            </Link>
                            <Link to='/' className='block text-gray-700 font-medium hover:text-brand-pink hover:underline transition-colors'>
                                ฝรั่งเศส
                            </Link>
                            <Link to='/' className='block text-gray-700 font-medium hover:text-brand-pink hover:underline transition-colors'>
                                อิตาลี
                            </Link>
                        </div>

                        {/* American/Oceania Destinations */}
                        <div className='lg:col-span-1 space-y-4 space-x-6'>
                            <Link to='/' className='block text-gray-700 font-medium hover:text-brand-pink hover:underline transition-colors ml-6'>
                                อเมริกา
                            </Link>
                            <Link to='/' className='block text-gray-700 font-medium hover:text-brand-pink hover:underline transition-colors'>
                                แคนาดา
                            </Link>
                            <Link to='/' className='block text-gray-700 font-medium hover:text-brand-pink hover:underline transition-colors'>
                                รัสเซีย
                            </Link>
                            <Link to='/' className='block text-gray-700 font-medium hover:text-brand-pink hover:underline transition-colors'>
                                นิวซีแลนด์
                            </Link>
                            <Link to='/' className='block text-gray-700 font-medium hover:text-brand-pink hover:underline transition-colors'>
                                ออสเตรเลีย
                            </Link>
                        </div>

                        {/* Middle East/Africa/Special */}
                        <div className='lg:col-span-1 space-y-4 space-x-6'>
                            <Link to='/' className='block text-gray-700 font-medium hover:text-brand-pink hover:underline transition-colors ml-6'>
                                อียิปต์
                            </Link>
                            <Link to='/' className='block text-gray-700 font-medium hover:text-brand-pink hover:underline transition-colors'>
                                ตุรกี
                            </Link>
                            <Link to='/' className='block text-gray-700 font-medium hover:text-brand-pink hover:underline transition-colors'>
                                จอร์แดน
                            </Link>
                            <Link to='/' className='block text-gray-700 font-medium hover:text-brand-pink hover:underline transition-colors'>
                                ล่าแสงเหนือ
                            </Link>
                            <Link to='/' className='block text-gray-700 font-medium hover:text-brand-pink hover:underline transition-colors'>
                                รวมยุโรป
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
    // return (
    //     <div className='bg-white mt-4'>
    //         <div className='mx-auto px-5 max-w-7xl bg-white'>
    //             <div className='flex flex-col md:flex-row flex-wrap gap-8 p-8'>
    //                 <div className='flex flex-col space-y-8 mt-16'>
    //                     <div className='flex items-center'>
    //                         <div className='bg-brand-pink w-12 h-12 rounded-md ml-4 flex-shrink-0'>
    //                             <Phone className='text-white w-8 h-8 ml-2 mt-2' />
    //                         </div>
    //                         <div className='ml-8'>
    //                             <p className='text-gray-700 font-medium'>เบอร์โทรติดต่อ</p>
    //                             <p className='text-brand-pink font-medium'>02-022-2222</p>
    //                         </div>
    //                     </div>

    //                     <div className='flex items-center'>
    //                         <div className='bg-brand-pink w-12 h-12 rounded-md ml-4 flex-shrink-0'>
    //                             <FaLine className='text-white w-8 h-8 ml-2 mt-2' />
    //                         </div>

    //                         <div className='ml-8'>
    //                             <p className='text-gray-700 font-medium'>Line ID</p>
    //                             <a
    //                                 href="https://line.me" target="_blank" rel="noopener noreferrer"
    //                                 className='text-brand-pink font-medium'
    //                             >
    //                                 @findtrip
    //                             </a>
    //                         </div>
    //                     </div>


    //                     <div className='flex items-center'>
    //                         <div className='bg-brand-pink w-12 h-12 rounded-md ml-4 flex-shrink-0'>
    //                             <Mail className='text-white w-8 h-8 ml-2 mt-2' />
    //                         </div>

    //                         <div className='ml-8'>
    //                             <p className='text-gray-700 font-medium'>Email</p>
    //                             <a
    //                                 href='mailto:findtrip@operation.com'
    //                                 className='text-brand-pink font-medium hover:underline cursor-pointer'
    //                             >
    //                                 findtrip@operation.com
    //                             </a>
    //                         </div>
    //                     </div>
    //                 </div>

    //                 <div className='flex flex-wrap gap-16 flex-grow'>
    //                     <div className='flex flex-col space-y-8 mt-16 mb-16'>
    //                         <Link
    //                             to='/'
    //                             className='text-gray-700 font-medium hover:text-brand-pink hover:underline'
    //                         >
    //                             ทัวร์แนะนำ
    //                         </Link>
    //                         <Link
    //                             to='/'
    //                             className='text-gray-700 font-medium hover:text-brand-pink hover:underline'
    //                         >
    //                             แพ็คเกจทัวร์ทั้งหมด
    //                         </Link>
    //                         <Link
    //                             to='/'
    //                             className='text-gray-700 font-medium hover:text-brand-pink hover:underline'
    //                         >
    //                             เกี่ยวกับเรา
    //                         </Link>
    //                     </div>

    //                     <div className='flex space-x-24'>
    //                     <div className='flex flex-col space-y-8 mt-16 mb-16'>
    //                         <Link
    //                             to='/'
    //                             className='text-gray-700 font-medium  hover:text-brand-pink hover:underline'
    //                         >
    //                             ญี่ปุ่น
    //                         </Link>
    //                         <Link
    //                             to='/'
    //                             className='text-gray-700 font-medium  hover:text-brand-pink hover:underline'
    //                         >
    //                             จีน
    //                         </Link>
    //                         <Link
    //                             to='/'
    //                             className='text-gray-700 font-medium  hover:text-brand-pink hover:underline'
    //                         >
    //                             เวียดนาม
    //                         </Link>
    //                         <Link
    //                             to='/'
    //                             className='text-gray-700 font-medium  hover:text-brand-pink hover:underline'
    //                         >
    //                             เกาหลีใต้
    //                         </Link>
    //                         <Link
    //                             to='/'
    //                             className='text-gray-700 font-medium  hover:text-brand-pink hover:underline'
    //                         >
    //                             ฮ่องกง
    //                         </Link>
    //                     </div>
    //                     <div className='flex flex-col space-y-8 mt-16 mb-16'>
    //                         <Link
    //                             to='/'
    //                             className='text-gray-700 font-medium  hover:text-brand-pink hover:underline'
    //                         >
    //                             สเปน
    //                         </Link>
    //                         <Link
    //                             to='/'
    //                             className='text-gray-700 font-medium  hover:text-brand-pink hover:underline'
    //                         >
    //                             สวิตเซอร์แลนด์
    //                         </Link>
    //                         <Link
    //                             to='/'
    //                             className='text-gray-700 font-medium  hover:text-brand-pink hover:underline'
    //                         >
    //                             อังกฤษ
    //                         </Link>
    //                         <Link
    //                             to='/'
    //                             className='text-gray-700 font-medium  hover:text-brand-pink hover:underline'
    //                         >
    //                             ฝรั่งเศส
    //                         </Link>
    //                         <Link
    //                             to='/'
    //                             className='text-gray-700 font-medium  hover:text-brand-pink hover:underline'
    //                         >
    //                             อิตาลี
    //                         </Link>
    //                     </div>
    //                     <div className='flex flex-col space-y-8 mt-16 mb-16'>
    //                         <Link
    //                             to='/'
    //                             className='text-gray-700 font-medium  hover:text-brand-pink hover:underline'
    //                         >
    //                             อเมริกา
    //                         </Link>
    //                         <Link
    //                             to='/'
    //                             className='text-gray-700 font-medium  hover:text-brand-pink hover:underline'
    //                         >
    //                             แคนาดา
    //                         </Link>
    //                         <Link
    //                             to='/'
    //                             className='text-gray-700 font-medium  hover:text-brand-pink hover:underline'
    //                         >
    //                             รัสเซีย
    //                         </Link>
    //                         <Link
    //                             to='/'
    //                             className='text-gray-700 font-medium  hover:text-brand-pink hover:underline'
    //                         >
    //                             นิวซีแลนด์
    //                         </Link>
    //                         <Link
    //                             to='/'
    //                             className='text-gray-700 font-medium  hover:text-brand-pink hover:underline'
    //                         >
    //                             ออสเตรเลีย
    //                         </Link>
    //                     </div>

    //                     <div className='flex flex-col space-y-8 mt-16 mb-16'>
    //                         <Link
    //                             to='/'
    //                             className='text-gray-700 font-medium  hover:text-brand-pink hover:underline'
    //                         >
    //                             อียิปต์
    //                         </Link>
    //                         <Link
    //                             to='/'
    //                             className='text-gray-700 font-medium  hover:text-brand-pink hover:underline'
    //                         >
    //                             ตุรกี
    //                         </Link>
    //                         <Link
    //                             to='/'
    //                             className='text-gray-700 font-medium  hover:text-brand-pink hover:underline'
    //                         >
    //                             จอร์แดน
    //                         </Link>
    //                         <Link
    //                             to='/'
    //                             className='text-gray-700 font-medium  hover:text-brand-pink hover:underline'
    //                         >
    //                             ล่าแสงเหนือ
    //                         </Link>
    //                         <Link
    //                             to='/'
    //                             className='text-gray-700 font-medium  hover:text-brand-pink hover:underline'
    //                         >
    //                             รวมยุโรป
    //                         </Link>
    //                         </div>                  
    //                     </div>
    //                 </div>
    //             </div>
    //         </div>
    //     </div>
    // )
}

export default Pre_Footer
