-- AlterTable
ALTER TABLE "Capsule" ADD COLUMN     "theme" TEXT;

-- AlterTable
ALTER TABLE "Memory" ADD COLUMN     "addedById" INTEGER;

-- CreateTable
CREATE TABLE "Collaborator" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "capsuleId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Collaborator_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Collaborator_userId_capsuleId_key" ON "Collaborator"("userId", "capsuleId");

-- AddForeignKey
ALTER TABLE "Collaborator" ADD CONSTRAINT "Collaborator_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Collaborator" ADD CONSTRAINT "Collaborator_capsuleId_fkey" FOREIGN KEY ("capsuleId") REFERENCES "Capsule"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
