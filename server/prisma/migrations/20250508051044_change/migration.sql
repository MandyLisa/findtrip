/*
  Warnings:

  - You are about to drop the column `picture` on the `user` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[tourCode]` on the table `TourPackage` will be added. If there are existing duplicate values, this will fail.
  - Made the column `singleStayExtra` on table `tourpackage` required. This step will fail if there are existing NULL values in that column.
  - Made the column `password` on table `user` required. This step will fail if there are existing NULL values in that column.
  - Made the column `name` on table `user` required. This step will fail if there are existing NULL values in that column.
  - Made the column `surname` on table `user` required. This step will fail if there are existing NULL values in that column.
  - Made the column `phone` on table `user` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `tourpackage` MODIFY `singleStayExtra` DOUBLE NOT NULL,
    ALTER COLUMN `tourCode` DROP DEFAULT;

-- AlterTable
ALTER TABLE `user` DROP COLUMN `picture`,
    MODIFY `password` VARCHAR(191) NOT NULL,
    MODIFY `name` VARCHAR(191) NOT NULL,
    MODIFY `surname` VARCHAR(191) NOT NULL,
    MODIFY `phone` VARCHAR(20) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `TourPackage_tourCode_key` ON `TourPackage`(`tourCode`);
