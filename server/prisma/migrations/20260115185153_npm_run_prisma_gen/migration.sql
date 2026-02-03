-- CreateEnum
CREATE TYPE "VibeCategory" AS ENUM ('FOOD', 'ACTIVITY', 'MUSIC', 'SHOPPING', 'PLAN');

-- CreateTable
CREATE TABLE "Vibe" (
    "id" TEXT NOT NULL,
    "relationshipId" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,
    "category" "VibeCategory" NOT NULL,
    "data" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Vibe_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Vibe_relationshipId_category_createdAt_idx" ON "Vibe"("relationshipId", "category", "createdAt");

-- AddForeignKey
ALTER TABLE "Vibe" ADD CONSTRAINT "Vibe_relationshipId_fkey" FOREIGN KEY ("relationshipId") REFERENCES "Relationship"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vibe" ADD CONSTRAINT "Vibe_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
