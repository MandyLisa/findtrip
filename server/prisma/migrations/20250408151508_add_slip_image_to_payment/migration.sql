/*
  Warnings:

  - You are about to drop the `paymentconfirmation` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `paymentconfirmation` DROP FOREIGN KEY `PaymentConfirmation_paymentId_fkey`;

-- DropForeignKey
ALTER TABLE `tourpackage` DROP FOREIGN KEY `TourPackage_categoryId_fkey`;

-- DropForeignKey
ALTER TABLE `tourpackage` DROP FOREIGN KEY `TourPackage_countryId_fkey`;

-- DropIndex
DROP INDEX `TourPackage_categoryId_fkey` ON `tourpackage`;

-- DropIndex
DROP INDEX `TourPackage_countryId_fkey` ON `tourpackage`;

-- AlterTable
ALTER TABLE `payment` ADD COLUMN `slipImage` VARCHAR(191) NULL;

-- DropTable
DROP TABLE `paymentconfirmation`;

-- AddForeignKey
ALTER TABLE `TourPackage` ADD CONSTRAINT `TourPackage_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `Category`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TourPackage` ADD CONSTRAINT `TourPackage_countryId_fkey` FOREIGN KEY (`countryId`) REFERENCES `Country`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
