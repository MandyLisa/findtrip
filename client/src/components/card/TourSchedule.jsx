import React from 'react'

const TourSchedule = ({ rawSchedule }) => {
  // แยกข้อความโดยใช้ regex เพื่อจับคำว่า "วันที่ X :"
  const splitSchedule = rawSchedule.split(/(วันที่ \d+ ?:)/g).filter(Boolean)

  // รวมหัวข้อ (วันที่) เข้ากับเนื้อหา
  const formattedSchedule = []
  for (let i = 0; i < splitSchedule.length; i += 2) {
    const title = splitSchedule[i]
    const content = splitSchedule[i + 1] || ''
    formattedSchedule.push(title + content)
  }

  return (
    <div className="space-y-2">
      {formattedSchedule.map((item, index) => (
        <p key={index} className="text-gray-700 leading-relaxed">
          {item}
        </p>
      ))}
    </div>
  )
}

export default TourSchedule
