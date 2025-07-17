
const DownloadPDF = ({ pdfUrl }) => {
  // console.log(pdfUrl)
  if (!pdfUrl) return null

  const getFileName = (url) => {
    const parts = url.split('/');
    return parts[parts.length - 1];
  }
  
  return (
    <div>
      <div className="my-6">
        <a
          href={pdfUrl}
          download
          className="inline-block mt-2 px-4 py-2 bg-brand-pink text-white rounded-md hover:bg-pink-600"
        >
          ดาวน์โหลด PDF
        </a>
      </div>
    </div>
  )
}

export default DownloadPDF
