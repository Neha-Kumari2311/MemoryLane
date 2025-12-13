/*
  Warnings:

  - The required column `token` was added to the `Recipient` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- AlterTable
ALTER TABLE "Recipient" ADD COLUMN     "token" TEXT NOT NULL;
