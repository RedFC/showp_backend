/*
  Warnings:

  - The primary key for the `userrating` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Made the column `productId` on table `userrating` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE `userrating` DROP FOREIGN KEY `userrating_ibfk_3`;

-- AlterTable
ALTER TABLE `userrating` DROP PRIMARY KEY,
    MODIFY `productId` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`userId`, `sellerId`, `productId`);

-- AddForeignKey
ALTER TABLE `UserRating` ADD FOREIGN KEY (`productId`) REFERENCES `Product`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
