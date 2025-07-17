-- AlterTable
ALTER TABLE `booking` MODIFY `bookingStatus` ENUM('DRAFT', 'PENDING', 'PAID', 'FAILED', 'CANCELLED') NOT NULL DEFAULT 'DRAFT';

-- AlterTable
ALTER TABLE `payment` ADD COLUMN `bankName` VARCHAR(191) NULL,
    ADD COLUMN `public_id` VARCHAR(191) NULL,
    ADD COLUMN `secure_url` VARCHAR(191) NULL;
