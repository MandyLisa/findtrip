/*
  Warnings:

  - You are about to drop the column `bookingTotal` on the `booking` table. All the data in the column will be lost.
  - Added the required column `totalPrice` to the `Booking` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `booking` DROP COLUMN `bookingTotal`,
    ADD COLUMN `isSingleStay` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `totalPrice` DOUBLE NOT NULL;

-- AlterTable
ALTER TABLE `tourpackage` ADD COLUMN `singleStayExtra` DOUBLE NULL;
