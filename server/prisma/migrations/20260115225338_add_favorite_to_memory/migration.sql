-- DropIndex
DROP INDEX "Memory_relationshipId_createdAt_idx";

-- AlterTable
ALTER TABLE "Memory" ADD COLUMN     "favorite" BOOLEAN NOT NULL DEFAULT false;

-- CreateIndex
CREATE INDEX "Memory_relationshipId_favorite_createdAt_idx" ON "Memory"("relationshipId", "favorite", "createdAt");
