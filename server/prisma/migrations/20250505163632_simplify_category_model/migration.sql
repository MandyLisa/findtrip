/*
  Warnings:

  - You are about to drop the column `asset_id` on the `category` table. All the data in the column will be lost.
  - You are about to drop the column `publi_id` on the `category` table. All the data in the column will be lost.
  - You are about to drop the column `secure_url` on the `category` table. All the data in the column will be lost.
  - You are about to drop the column `url` on the `category` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `category` DROP COLUMN `asset_id`,
    DROP COLUMN `publi_id`,
    DROP COLUMN `secure_url`,
    DROP COLUMN `url`;
