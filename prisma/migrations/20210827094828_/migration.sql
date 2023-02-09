-- AlterTable
ALTER TABLE `userrating` ADD COLUMN `RatingStatus` ENUM('Default', 'Edited') NOT NULL DEFAULT 'Default';
