/*
  Warnings:

  - You are about to drop the column `pdf_url` on the `tourpdf` table. All the data in the column will be lost.
  - Added the required column `asset_id` to the `TourPDF` table without a default value. This is not possible if the table is not empty.
  - Added the required column `public_id` to the `TourPDF` table without a default value. This is not possible if the table is not empty.
  - Added the required column `secure_url` to the `TourPDF` table without a default value. This is not possible if the table is not empty.
  - Added the required column `url` to the `TourPDF` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `tourpdf` DROP COLUMN `pdf_url`,
    ADD COLUMN `asset_id` VARCHAR(191) NOT NULL,
    ADD COLUMN `public_id` VARCHAR(191) NOT NULL,
    ADD COLUMN `secure_url` VARCHAR(191) NOT NULL,
    ADD COLUMN `url` VARCHAR(191) NOT NULL;
