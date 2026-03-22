-- ใช้สำหรับ Maintenance หรือล้างข้อมูลเก่าให้ตรงกับ Logic ล่าสุด

-- 1. บังคับอัปเดตสถานะทัวร์ที่ถูกปิด (isActive = 0) ให้เป็น CLOSED ทั้งหมด
UPDATE TourPackage 
SET seatStatus = 'CLOSED' 
WHERE isActive = false;

-- 2. คำสั่งตรวจสอบข้อมูลหลังการอัปเดต (เพื่อความชัวร์)
SELECT id, title, isActive, seatStatus 
FROM TourPackage 
WHERE isActive = false;

-- 3. คำสั่งอัปเดตสถานะตามจำนวนที่นั่งสำหรับทัวร์ที่ยังเปิดขายอยู่
UPDATE TourPackage 
SET seatStatus = CASE 
    WHEN (maxSeats - sold) <= 0 THEN 'FULL'
    WHEN (maxSeats - sold) < 5 THEN 'NEARLY_FULL'
    ELSE 'AVAILABLE'
END
WHERE isActive = true;