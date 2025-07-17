/*
  Warnings:

  - You are about to drop the column `isAvailable` on the `tourpackage` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `tourpackage` DROP COLUMN `isAvailable`,
    ADD COLUMN `isActive` BOOLEAN NOT NULL DEFAULT true;
