/*
  Warnings:

  - You are about to drop the column `isAlmostFull` on the `tourpackage` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `tourpackage` DROP COLUMN `isAlmostFull`,
    ADD COLUMN `seatStatus` ENUM('AVAILABLE', 'NEARLY_FULL', 'FULL', 'CLOSED') NOT NULL DEFAULT 'AVAILABLE';
