const axios = require('axios')

// Cloudinary ไม่อนุญาตให้แสดง raw files เช่น PDF ผ่าน URL ตรง หากบัญชีถูกจัดอยู่ในสถานะ "untrusted" ก็คือยังไม่ verified (อยู่ในแผนฟรี) 
// ถ้าเปิดลิงก์ PDF ผ่านเบราว์เซอร์โดยตรงจะเจอ error จึงต้องใช้ ตัวกลาง (Proxy server)
// เพื่อให้สามารถดาวน์โหลดไฟล์จาก Cloudinary ผ่านฝั่ง Backend แล้วให้ Frontend เรียกจาก API

exports.proxyPDF = async (req, res) => {

    const { url } = req.query
    const fileUrl = req.query.url
    const download = req.query.download === 'true'

    if (!url) {
        return res.status(400).json({ error: 'Missing PDF URL' })
    }

    // ป้องกัน URL ที่ไม่ใช่ Cloudinary
    if (!url.startsWith('https://res.cloudinary.com/')) {
        return res.status(400).json({ error: 'Invalid URL' })
    }

    try {   // ดึงไฟล์จาก Cloudinary
        const response = await axios.get(fileUrl, {
            responseType: 'stream',
        })

        // ดึงชื่อไฟล์จาก URL
        const fileName = fileUrl.split('/').pop()?.split('?')[0] || 'file.pdf'
        
        if (download) {
            res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`)
        } else {
            res.setHeader('Content-Disposition', 'inline')
        }

        res.setHeader('Content-Type', 'application/pdf')

        // ส่งไฟล์ต่อไปยัง client
        response.data.pipe(res)
    } catch (error) {
        console.error('Proxy Error: ', error?.response?.data || error.message )
        res.status(500).json({ error: 'Failed to fetch PDF from Cloudinary' })
    }
}