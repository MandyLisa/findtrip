import { Smile } from 'lucide-react'
import { PlaneTakeoff } from 'lucide-react'
import { ShieldCheck } from 'lucide-react'

const Whyus = () => {
    return (
        <div className='bg-brand-pink w-screen relative left-1/2 right-1/2 mx-[-50vw] mt-24'>
            <div className='mx-auto px-5 max-w-7xl py-16 md:py-24'>
                <p className='text-2xl md:text-3xl font-semibold text-white mb-8 lg:text-left md:text-center sm:text-center'>
                    ทำไมต้องเลือก findtrip ?
                </p>
                <div className='flex flex-col lg:flex-row justify-center gap-6 lg:gap-8 mt-8'>
                    <div className='flex flex-col border-t border-gray-50 bg-white rounded-md p-5 w-full max-w-md mx-auto lg:mx-0'>
                        <div className='bg-brand-pink w-12 h-12 rounded-md flex-shrink-0 flex items-center justify-center mb-4'>
                            <Smile className='text-white w-8 h-8' />
                        </div>
                        <p className='text-lg md:text-xl font-semibold py-2'>สะดวก รวดเร็ว ใช้งานง่าย</p>
                        <p className='text-base md:text-xl'>ด้วยการออกแบบที่ทันสมัย</p>
                        <p className='text-base md:text-xl'>สามารถเริ่มจองทัวร์ได้ภายในไม่กี่ "คลิก"</p>
                    </div>
                    <div className='flex flex-col border-t border-gray-50 bg-white rounded-md p-5 w-full max-w-md mx-auto lg:mx-0'>
                        <div className='bg-brand-pink w-12 h-12 rounded-md flex-shrink-0 flex items-center justify-center mb-4'>
                            <PlaneTakeoff className='text-white w-8 h-8' />
                        </div>
                        <p className='text-lg md:text-xl font-semibold py-2'>โปรแกรมทัวร์สุดพิเศษ</p>
                        <p className='text-base md:text-xl'>ด้วยประสบการณ์ด้านการท่องเที่ยว</p>
                        <p className='text-base md:text-xl'>เราจัดหาเส้นทางพิเศษมานำเสนอ</p>
                    </div>
                    <div className='flex flex-col border-t border-gray-50 bg-white rounded-md p-5 w-full max-w-md mx-auto lg:mx-0'>
                        <div className='bg-brand-pink w-12 h-12 rounded-md flex-shrink-0 flex items-center justify-center mb-4'>
                            <ShieldCheck className='text-white w-8 h-8' />
                        </div>
                        <p className='text-lg md:text-xl font-semibold py-2'>ปลอดภัย 100%</p>
                        <p className='text-base md:text-xl'>ซื้อทัวร์กับเราได้บินจริง</p>
                        <p className='text-base md:text-xl'>พร้อมใบอนุญาตประกอบธุรกิจนำเที่ยว</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Whyus
