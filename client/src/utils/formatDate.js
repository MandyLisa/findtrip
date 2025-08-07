// ไม่จำเป็นต้องตั้งชื่อเป็น .jsx สำหรับไฟล์ที่ ไม่มี React JSX (เช่น <div>...</div>) อยู่ข้างใน 

export const formatDateRange = (start, end) => {
    const options = { day: 'numeric', month: 'short', year: 'numeric' }
    const startFormatted = new Date(start).toLocaleDateString('th-TH', options)
    const endFormatted = new Date(end).toLocaleDateString('th-TH', options)
    return `${startFormatted} - ${endFormatted}`
}

export function formatThaiDate(date) {
    if (!date) return 'ไม่ระบุ'
    const options = { day: '2-digit', month: 'short', year: 'numeric' }
    return new Date(date).toLocaleDateString('th-TH', options)
}

export function formatDate_Time(date) {
  if (!date) return 'ไม่ระบุ'

  const d = new Date(date)

  // สร้างวันที่ในรูปแบบไทย เช่น 12/07/2025
  const dateString = d.toLocaleDateString('th-TH', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })

  // สร้างเวลา เช่น 06:56
  const timeString = d.toLocaleTimeString('th-TH', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false, // ถ้าไม่อยากได้ AM/PM
  })

  return `${dateString} ${timeString} น.`
}

  
