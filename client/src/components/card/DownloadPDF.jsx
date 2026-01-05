
const DownloadPDF = ({ pdfUrl }) => {
  // console.log(pdfUrl)
  if (!pdfUrl) return null

  const getFileName = (url) => {  // ดึงชื่อไฟล์จาก URL
    const parts = url.split('/') // แยก string ของ URL ด้วยเครื่องหมาย /
    return parts[parts.length - 1] // ดึงส่วนสุดท้ายของ array → ซึ่งมักจะเป็นชื่อไฟล์ ออกมา 
  }
  
  return (
    <div>
      <div className='my-6'>
        <a
          href={pdfUrl}
          target='_blank'
          className='inline-block mt-2 px-4 py-2 bg-brand-pink text-white rounded-md hover:bg-pink-600'
        >
          ดาวน์โหลด PDF
        </a>
      </div>
    </div>
  )
}

export default DownloadPDF
