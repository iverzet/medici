-- Provider sources, claims and moderated reviews for the verified catalog.
CREATE TYPE "ProviderVerification" AS ENUM ('PENDING', 'VERIFIED', 'REJECTED');
CREATE TYPE "ClaimStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');
CREATE TYPE "ReviewStatus" AS ENUM ('PENDING', 'PUBLISHED', 'REJECTED');

ALTER TABLE "Provider"
  ADD COLUMN "sourceUrl" TEXT,
  ADD COLUMN "sourceCollectedAt" TIMESTAMP(3),
  ALTER COLUMN "verification" DROP DEFAULT,
  ALTER COLUMN "verification" TYPE "ProviderVerification" USING "verification"::"ProviderVerification",
  ALTER COLUMN "verification" SET DEFAULT 'PENDING';

CREATE TABLE "ClaimRequest" (
  "id" TEXT NOT NULL,
  "providerId" TEXT NOT NULL,
  "contactName" TEXT NOT NULL,
  "email" TEXT NOT NULL,
  "evidenceUrl" TEXT,
  "status" "ClaimStatus" NOT NULL DEFAULT 'PENDING',
  "reviewedAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "ClaimRequest_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Review" (
  "id" TEXT NOT NULL,
  "providerId" TEXT NOT NULL,
  "authorName" TEXT NOT NULL,
  "score" INTEGER NOT NULL,
  "body" TEXT NOT NULL,
  "status" "ReviewStatus" NOT NULL DEFAULT 'PENDING',
  "verifiedAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "Review_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "Review_score_range" CHECK ("score" BETWEEN 1 AND 5)
);

CREATE INDEX "ClaimRequest_providerId_status_idx" ON "ClaimRequest"("providerId", "status");
CREATE INDEX "Review_providerId_status_idx" ON "Review"("providerId", "status");
ALTER TABLE "ClaimRequest" ADD CONSTRAINT "ClaimRequest_providerId_fkey" FOREIGN KEY ("providerId") REFERENCES "Provider"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Review" ADD CONSTRAINT "Review_providerId_fkey" FOREIGN KEY ("providerId") REFERENCES "Provider"("id") ON DELETE CASCADE ON UPDATE CASCADE;
