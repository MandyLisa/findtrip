/*
  Warnings:

  - Added the required column `amount` to the `Payment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `paymentMethod` to the `Payment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `booking` MODIFY `totalPrice` DECIMAL(10, 2) NOT NULL;

-- AlterTable
ALTER TABLE `payment` ADD COLUMN `amount` DECIMAL(10, 2) NOT NULL,
    ADD COLUMN `paymentMethod` ENUM('CREDIT_CARD', 'BANK_TRANSFER') NOT NULL;
