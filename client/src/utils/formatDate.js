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
  
