import { Phone } from 'lucide-react';
import { Mail } from 'lucide-react';
import { FaLine } from "react-icons/fa";
import { Link } from 'react-router-dom';
import { useEffect } from 'react';
import usePublicStore from '../store/publicStore';

const Pre_Footer = () => {
    const countries = usePublicStore((state) => state.countries)
    const fetchCountries = usePublicStore((state) => state.fetchCountries)

    useEffect(() => {
        if (!countries || countries.length === 0) {
            fetchCountries()
        }
    }, [countries, fetchCountries])

    const getCountryIdByName = (name) => {
        const match = countries?.find((c) => c?.name === name)
        return match?.id
    }

    const buildCountryLinkProps = (countryName) => { // สร้างฟังก์ชันช่วยสร้าง props สำหรับ Link ของแต่ละประเทศ โดยรับชื่อประเทศเป็นพารามิเตอร์
        const countryId = getCountryIdByName(countryName)
        if (!countryId) {
            return { to: '/programs' }
        }
        return {
            to: '/programs',
            state: { filters: { country: String(countryId) }, page: 1 }
        }
    }

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

                        <div className='grid grid-cols-1 sm:grid-cols-2 gap-8 lg:contents'>
                            <div className='space-y-8 lg:contents'>
                                {/* Main Navigation */}
                                <div className='lg:col-span-1 space-y-4'>
                                    <Link
                                        to='/programs'
                                        className='block text-gray-700 font-medium hover:text-brand-pink hover:underline transition-colors'
                                    >
                                        แพ็คเกจทั้งหมด
                                    </Link>
                                    <Link
                                        to='/about'
                                        className='block text-gray-700 font-medium hover:text-brand-pink hover:underline transition-colors'
                                    >
                                        เกี่ยวกับเรา
                                    </Link>
                                </div>

                                {/* European Destinations */}
                                <div className='lg:col-span-1 space-y-4'>
                                    <Link {...buildCountryLinkProps('สเปน')} className='block text-gray-700 font-medium hover:text-brand-pink hover:underline transition-colors'>
                                        สเปน
                                    </Link>
                                    <Link {...buildCountryLinkProps('สวิตเซอร์แลนด์')} className='block text-gray-700 font-medium hover:text-brand-pink hover:underline transition-colors'>
                                        สวิตเซอร์แลนด์
                                    </Link>
                                    <Link {...buildCountryLinkProps('อังกฤษ')} className='block text-gray-700 font-medium hover:text-brand-pink hover:underline transition-colors'>
                                        อังกฤษ
                                    </Link>
                                    <Link {...buildCountryLinkProps('ฝรั่งเศส')} className='block text-gray-700 font-medium hover:text-brand-pink hover:underline transition-colors'>
                                        ฝรั่งเศส
                                    </Link>
                                    <Link {...buildCountryLinkProps('อิตาลี')} className='block text-gray-700 font-medium hover:text-brand-pink hover:underline transition-colors'>
                                        อิตาลี
                                    </Link>
                                </div>

                                {/* Middle East/Africa/Special */}
                                <div className='lg:col-span-1 space-y-4'>
                                    <Link {...buildCountryLinkProps('อียิปต์')} className='block text-gray-700 font-medium hover:text-brand-pink hover:underline transition-colors'>
                                        อียิปต์
                                    </Link>
                                    <Link {...buildCountryLinkProps('ตุรกี')} className='block text-gray-700 font-medium hover:text-brand-pink hover:underline transition-colors'>
                                        ตุรกี
                                    </Link>
                                    <Link {...buildCountryLinkProps('จอร์แดน')} className='block text-gray-700 font-medium hover:text-brand-pink hover:underline transition-colors'>
                                        จอร์แดน
                                    </Link>
                                    <Link {...buildCountryLinkProps('นอร์เวย์')} className='block text-gray-700 font-medium hover:text-brand-pink hover:underline transition-colors'>
                                        นอร์เวย์
                                    </Link>
                                    <Link {...buildCountryLinkProps('เยอรมนี')} className='block text-gray-700 font-medium hover:text-brand-pink hover:underline transition-colors'>
                                        เยอรมนี
                                    </Link>
                                </div>
                            </div>

                            <div className='space-y-8 lg:contents'>
                                {/* Asian Destinations */}
                                <div className='lg:col-span-1 space-y-4'>
                                    <Link {...buildCountryLinkProps('ญี่ปุ่น')} className='block text-gray-700 font-medium hover:text-brand-pink hover:underline transition-colors'>
                                        ญี่ปุ่น
                                    </Link>
                                    <Link {...buildCountryLinkProps('จีน')} className='block text-gray-700 font-medium hover:text-brand-pink hover:underline transition-colors'>
                                        จีน
                                    </Link>
                                    <Link {...buildCountryLinkProps('เวียดนาม')} className='block text-gray-700 font-medium hover:text-brand-pink hover:underline transition-colors'>
                                        เวียดนาม
                                    </Link>
                                    <Link {...buildCountryLinkProps('เกาหลีใต้')} className='block text-gray-700 font-medium hover:text-brand-pink hover:underline transition-colors'>
                                        เกาหลีใต้
                                    </Link>
                                    <Link {...buildCountryLinkProps('ฮ่องกง')} className='block text-gray-700 font-medium hover:text-brand-pink hover:underline transition-colors'>
                                        ฮ่องกง
                                    </Link>
                                </div>

                                {/* American/Oceania Destinations */}
                                <div className='lg:col-span-1 space-y-4'>
                                    <Link {...buildCountryLinkProps('อเมริกา')} className='block text-gray-700 font-medium hover:text-brand-pink hover:underline transition-colors'>
                                        อเมริกา
                                    </Link>
                                    <Link {...buildCountryLinkProps('แคนาดา')} className='block text-gray-700 font-medium hover:text-brand-pink hover:underline transition-colors'>
                                        แคนาดา
                                    </Link>
                                    <Link {...buildCountryLinkProps('รัสเซีย')} className='block text-gray-700 font-medium hover:text-brand-pink hover:underline transition-colors'>
                                        รัสเซีย
                                    </Link>
                                    <Link {...buildCountryLinkProps('นิวซีแลนด์')} className='block text-gray-700 font-medium hover:text-brand-pink hover:underline transition-colors'>
                                        นิวซีแลนด์
                                    </Link>
                                    <Link {...buildCountryLinkProps('ออสเตรเลีย')} className='block text-gray-700 font-medium hover:text-brand-pink hover:underline transition-colors'>
                                        ออสเตรเลีย
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Pre_Footer
