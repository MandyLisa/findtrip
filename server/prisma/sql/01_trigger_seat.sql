-- เก็บโค้ด CREATE TRIGGER ให้ระบบคำนวณที่นั่งลงใน DB ครั้งแรก หรือเมื่อมีการ Deploy ระบบใหม่

DELIMITER //

DROP TRIGGER IF EXISTS update_seat_status_before_update //

CREATE TRIGGER update_seat_status_before_update
BEFORE UPDATE ON TourPackage
FOR EACH ROW
BEGIN
    DECLARE remaining INT;
    SET remaining = NEW.maxSeats - NEW.sold;

    -- เช็คก่อนว่าสถานะปัจจุบันไม่ใช่ CLOSED เพื่อให้สิทธิ์ Admin สูงสุด
    IF OLD.seatStatus <> 'CLOSED' THEN
        IF remaining <= 0 THEN
            SET NEW.seatStatus = 'FULL';
        ELSEIF remaining < 5 THEN
            SET NEW.seatStatus = 'NEARLY_FULL';
        ELSE
            SET NEW.seatStatus = 'AVAILABLE';
        END IF;
    END IF;
END //

DELIMITER ;