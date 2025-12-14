-- AlterTable
ALTER TABLE "Capsule" ADD COLUMN     "letter" TEXT,
ADD COLUMN     "unlocked" BOOLEAN NOT NULL DEFAULT false;
