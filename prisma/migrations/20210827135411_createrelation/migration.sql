/*
  Warnings:

  - You are about to drop the column `roomId` on the `message` table. All the data in the column will be lost.
  - Added the required column `reciever` to the `Message` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `message` DROP COLUMN `roomId`,
    ADD COLUMN `reciever` VARCHAR(191) NOT NULL;

-- AddForeignKey
ALTER TABLE `Message` ADD FOREIGN KEY (`sender`, `reciever`) REFERENCES `Rooms`(`createdBy`, `createdWith`) ON DELETE CASCADE ON UPDATE CASCADE;
