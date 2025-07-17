import { Mail, MapPin, MessageCircle, Phone } from "lucide-react"

const AboutUs = () => {
  return (
    <div className='py-8 sm:py-12'>
      {/* Header */}
      <div className='text-center mb-8 sm:mb-12'>
        <h1 className='text-3xl sm:text-4xl font-bold text-gray-900 mb-4'>
          ติดต่อ findtrip
        </h1>
        <p className='text-gray-600 text-sm sm:text-base'>
          ใบอนุญาตเลขที่ 11/050500
        </p>
      </div>

      {/* Contact Information Cards */}
      <div className='grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 mb-12'>
        {/* Email */}
        <div className='bg-white rounded-lg shadow-md p-6 border-l-4 border-brand-pink'>
          <div className='flex items-center mb-4'>
            <div className='bg-purple-100 p-3 rounded-full mr-4'>
              <Mail className='h-6 w-6 text-brand-pink' />
            </div>
            <h3 className='text-lg font-semibold text-gray-900'>อีเมล์</h3>
          </div>
          <a
            href='mailto:findtrip@operation.com'
            className='text-gray-600 hover:text-brand-pink hover:underline'
          >
            findtrip@operation.com
          </a>
        </div>

        {/* Phone */}
        <div className='bg-white rounded-lg shadow-md p-6 border-l-4 border-brand-pink'>
          <div className='flex items-center mb-4'>
            <div className='bg-purple-100 p-3 rounded-full mr-4'>
              <Phone className='h-6 w-6 text-brand-pink' />
            </div>
            <h3 className='text-lg font-semibold text-gray-900'>เบอร์โทรติดต่อ</h3>
          </div>
          <a
            href='tel:02-026-3866'
            className='text-gray-600 hover:text-pink-600'
          >
            02-022-2222
          </a>
        </div>

        {/* Line ID */}
        <div className='bg-white rounded-lg shadow-md p-6 border-l-4 border-brand-pink'>
          <div className='flex items-center mb-4'>
            <div className='bg-purple-100 p-3 rounded-full mr-4'>
              <MessageCircle className='h-6 w-6 text-brand-pink' />
            </div>
            <h3 className='text-lg font-semibold text-gray-900'>Line ID</h3>
          </div>
          <a
            href='https://line.me'
            target='_blank'
            rel='noopener noreferrer'
            className='text-gray-700 hover:text-brand-pink font-medium hover:underline'
          >
            @findtrip
          </a>
        </div>

        {/* Address */}
        <div className='bg-white rounded-lg shadow-md p-6 border-l-4 border-brand-pink'>
          <div className='flex items-center mb-4'>
            <div className='bg-purple-100 p-3 rounded-full mr-4'>
              <MapPin className='h-6 w-6 text-brand-pink' />
            </div>
            <h3 className='text-lg font-semibold text-gray-900'>ติดต่อเรา</h3>
          </div>
          <p className='text-gray-700 leading-relaxed'>
            ชั้น 20 ตึก One Bangkok ถนนวิทยุ แขวงลุมพินี เขตปทุมวัน กรุงเทพฯ 10330
          </p>
        </div>
      </div>

      {/* Company Description */}
      <div className='bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-6 sm:p-8'>
        <h2 className='text-2xl sm:text-3xl font-bold text-gray-900 mb-6'>
          ประวัติ findtrip
        </h2>

        <div className='space-y-4 text-gray-700 leading-relaxed'>
          <p>
            <strong>findtrip</strong> อยู่ภายใต้การบริหารงานของบริษัท ไฟน์ทริป จำกัด
            จัดตั้งขึ้นเมื่อปี 2561 เรามีนโยบายที่ชัดเจนด้านการจัดหาโปรแกรมท่องเที่ยวที่มีคุณภาพ
            มานำเสนอและให้บริการลูกค้า
          </p>

          <h3 className='text-xl font-semibold text-gray-900 mt-6 mb-4'>
            จุดประสงค์ของบริษัท findtrip
          </h3>

          <p>
            เพื่อต้องการให้ลูกค้าได้เข้าใจระบบการเลือกซื้อทัวร์แพ็คเกจ ด้วยการออกแบบเวปไซต์ที่ทันสมัย
            เพื่อให้ลูกค้าสามารถเริ่มจองทัวร์กับเราได้ภายในไม่กี่ "คลิก" และด้วยประสบการณ์ด้านการท่องเที่ยว
            มานานหลายปี เรามั่นใจว่า เราจัดหาเส้นทางพิเศษมานำเสนอให้ลูกค้าเสมอ ในราคาที่จับต้องได้
            ซื้อทัวร์กับเรา ท่านมั่นใจได้เลยว่า ได้บินแน่นอน สะดวก รวดเร็ว ปลอดภัย
          </p>
        </div>
      </div>
    </div>
  )
}

export default AboutUs
