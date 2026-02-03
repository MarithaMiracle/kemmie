-- CreateEnum
CREATE TYPE "MemoryType" AS ENUM ('PHOTO', 'VIDEO');

-- CreateTable
CREATE TABLE "Memory" (
    "id" TEXT NOT NULL,
    "relationshipId" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,
    "type" "MemoryType" NOT NULL,
    "url" TEXT NOT NULL,
    "mimeType" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Memory_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Memory_relationshipId_createdAt_idx" ON "Memory"("relationshipId", "createdAt");

-- AddForeignKey
ALTER TABLE "Memory" ADD CONSTRAINT "Memory_relationshipId_fkey" FOREIGN KEY ("relationshipId") REFERENCES "Relationship"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Memory" ADD CONSTRAINT "Memory_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
