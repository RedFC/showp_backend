-- AlterTable
ALTER TABLE `userrating` ADD COLUMN `productId` VARCHAR(191);

-- AddForeignKey
ALTER TABLE `UserRating` ADD FOREIGN KEY (`productId`) REFERENCES `Product`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
