-- CreateTable
CREATE TABLE `User` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `email` VARCHAR(255) NOT NULL,
    `username` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NULL,
    `name` VARCHAR(191) NULL,
    `surname` VARCHAR(191) NULL,
    `phone` VARCHAR(20) NULL,
    `picture` VARCHAR(191) NULL,
    `role` ENUM('USER', 'ADMIN') NOT NULL DEFAULT 'USER',
    `enable` BOOLEAN NOT NULL DEFAULT true,
    `address` VARCHAR(191) NULL,
    `createdDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedDate` DATETIME(3) NOT NULL,

    UNIQUE INDEX `User_email_key`(`email`),
    UNIQUE INDEX `User_username_key`(`username`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `TourPackage` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NOT NULL,
    `categoryId` INTEGER NULL,
    `countryId` INTEGER NULL,
    `isRecommend` BOOLEAN NOT NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `priceAdult` DOUBLE NOT NULL,
    `priceChild` DOUBLE NOT NULL,
    `quantity` INTEGER NOT NULL,
    `sold` INTEGER NOT NULL DEFAULT 0,
    `startDate` DATETIME(3) NOT NULL,
    `endDate` DATETIME(3) NOT NULL,
    `duration` INTEGER NOT NULL DEFAULT 1,
    `createdDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedDate` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Category` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `asset_id` VARCHAR(191) NOT NULL,
    `publi_id` VARCHAR(191) NOT NULL,
    `url` VARCHAR(191) NOT NULL,
    `secure_url` VARCHAR(191) NOT NULL,
    `createdDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedDate` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Country` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `createdDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedDate` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Booking` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `tourPackageId` INTEGER NOT NULL,
    `adultCount` INTEGER NOT NULL DEFAULT 0,
    `childCount` INTEGER NOT NULL DEFAULT 0,
    `bookingTotal` DOUBLE NOT NULL,
    `bookingStatus` VARCHAR(191) NOT NULL DEFAULT 'Not Process',
    `createdDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedDate` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Image` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `tourPackageId` INTEGER NOT NULL,
    `asset_id` VARCHAR(191) NOT NULL,
    `publi_id` VARCHAR(191) NOT NULL,
    `url` VARCHAR(191) NOT NULL,
    `secure_url` VARCHAR(191) NOT NULL,
    `createdDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedDate` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `TourPDF` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `tourPackageId` INTEGER NOT NULL,
    `pdf_url` VARCHAR(191) NOT NULL,
    `createdDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedDate` DATETIME(3) NOT NULL,

    UNIQUE INDEX `TourPDF_tourPackageId_key`(`tourPackageId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Payment` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `bookingId` INTEGER NOT NULL,
    `amount` DOUBLE NOT NULL,
    `paymentMethod` ENUM('CREDIT_CARD', 'BANK_TRANSFER') NOT NULL,
    `paymentStatus` ENUM('PENDING', 'COMPLETED', 'FAILED', 'REFUNDED', 'CANCELLED') NOT NULL DEFAULT 'PENDING',
    `transactionId` VARCHAR(191) NULL,
    `paymentDate` DATETIME(3) NULL,
    `createdDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedDate` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Payment_bookingId_key`(`bookingId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PaymentConfirmation` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `paymentId` INTEGER NOT NULL,
    `emailSent` BOOLEAN NOT NULL DEFAULT false,
    `sentAt` DATETIME(3) NULL,
    `retryCount` INTEGER NOT NULL DEFAULT 0,
    `createdDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `PaymentConfirmation_paymentId_key`(`paymentId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `TourPackage` ADD CONSTRAINT `TourPackage_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `Category`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TourPackage` ADD CONSTRAINT `TourPackage_countryId_fkey` FOREIGN KEY (`countryId`) REFERENCES `Country`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Booking` ADD CONSTRAINT `Booking_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Booking` ADD CONSTRAINT `Booking_tourPackageId_fkey` FOREIGN KEY (`tourPackageId`) REFERENCES `TourPackage`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Image` ADD CONSTRAINT `Image_tourPackageId_fkey` FOREIGN KEY (`tourPackageId`) REFERENCES `TourPackage`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TourPDF` ADD CONSTRAINT `TourPDF_tourPackageId_fkey` FOREIGN KEY (`tourPackageId`) REFERENCES `TourPackage`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Payment` ADD CONSTRAINT `Payment_bookingId_fkey` FOREIGN KEY (`bookingId`) REFERENCES `Booking`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PaymentConfirmation` ADD CONSTRAINT `PaymentConfirmation_paymentId_fkey` FOREIGN KEY (`paymentId`) REFERENCES `Payment`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
