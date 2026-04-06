-- Add Stripe session fields for idempotent credit card checkout
ALTER TABLE `Payment`
  ADD COLUMN `stripeSessionId` VARCHAR(191) NULL,
  ADD COLUMN `stripeClientSecret` VARCHAR(512) NULL,
  ADD COLUMN `stripeSessionCreatedAt` DATETIME(3) NULL;

CREATE UNIQUE INDEX `Payment_stripeSessionId_key` ON `Payment`(`stripeSessionId`);
