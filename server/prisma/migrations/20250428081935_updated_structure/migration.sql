/*
  Warnings:

  - You are about to alter the column `bookingStatus` on the `booking` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Enum(EnumId(1))`.
  - You are about to drop the column `amount` on the `payment` table. All the data in the column will be lost.
  - You are about to drop the column `paymentMethod` on the `payment` table. All the data in the column will be lost.
  - You are about to drop the column `slipImage` on the `payment` table. All the data in the column will be lost.
  - The values [COMPLETED,REFUNDED,CANCELLED] on the enum `Payment_paymentStatus` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `description` on the `tourpackage` table. All the data in the column will be lost.
  - You are about to drop the column `isActive` on the `tourpackage` table. All the data in the column will be lost.
  - You are about to drop the column `quantity` on the `tourpackage` table. All the data in the column will be lost.
  - Made the column `categoryId` on table `tourpackage` required. This step will fail if there are existing NULL values in that column.
  - Made the column `countryId` on table `tourpackage` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE `tourpackage` DROP FOREIGN KEY `TourPackage_categoryId_fkey`;

-- DropForeignKey
ALTER TABLE `tourpackage` DROP FOREIGN KEY `TourPackage_countryId_fkey`;

-- DropIndex
DROP INDEX `TourPackage_categoryId_fkey` ON `tourpackage`;

-- DropIndex
DROP INDEX `TourPackage_countryId_fkey` ON `tourpackage`;

-- AlterTable
ALTER TABLE `booking` MODIFY `bookingStatus` ENUM('PENDING', 'PAID', 'FAILED', 'CANCELLED') NOT NULL DEFAULT 'PENDING';

-- AlterTable
ALTER TABLE `payment` DROP COLUMN `amount`,
    DROP COLUMN `paymentMethod`,
    DROP COLUMN `slipImage`,
    MODIFY `paymentStatus` ENUM('PENDING', 'PAID', 'FAILED') NOT NULL DEFAULT 'PENDING';

-- AlterTable
ALTER TABLE `tourpackage` DROP COLUMN `description`,
    DROP COLUMN `isActive`,
    DROP COLUMN `quantity`,
    ADD COLUMN `airline` VARCHAR(191) NOT NULL DEFAULT '',
    ADD COLUMN `isAlmostFull` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `isAvailable` BOOLEAN NOT NULL DEFAULT true,
    ADD COLUMN `itinerary` VARCHAR(191) NOT NULL DEFAULT '',
    ADD COLUMN `maxSeats` INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN `priceDetails` VARCHAR(191) NOT NULL DEFAULT '',
    ADD COLUMN `priceGuide` INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN `priceVisa` INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN `starRating` INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN `tourCode` VARCHAR(191) NOT NULL DEFAULT '',
    MODIFY `categoryId` INTEGER NOT NULL,
    MODIFY `countryId` INTEGER NOT NULL,
    MODIFY `isRecommend` BOOLEAN NOT NULL DEFAULT false,
    MODIFY `duration` VARCHAR(191) NOT NULL,
    MODIFY `singleStayExtra` DOUBLE NULL;

-- AddForeignKey
ALTER TABLE `TourPackage` ADD CONSTRAINT `TourPackage_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `Category`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TourPackage` ADD CONSTRAINT `TourPackage_countryId_fkey` FOREIGN KEY (`countryId`) REFERENCES `Country`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
