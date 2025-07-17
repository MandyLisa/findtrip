/*
  Warnings:

  - You are about to drop the column `isSingleStay` on the `booking` table. All the data in the column will be lost.
  - Made the column `singleStayExtra` on table `tourpackage` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `booking` DROP COLUMN `isSingleStay`,
    ADD COLUMN `singleStayCount` INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE `tourpackage` MODIFY `singleStayExtra` DOUBLE NOT NULL;
