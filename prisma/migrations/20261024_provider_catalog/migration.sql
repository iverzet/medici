-- Verified-provider catalog, source provenance, claims and moderated reviews.
-- The previous migrations create the lead-management schema only.
DO $$ BEGIN
  CREATE TYPE "ProviderVerification" AS ENUM ('PENDING', 'VERIFIED', 'REJECTED');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
DO $$ BEGIN
  CREATE TYPE "ClaimStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
DO $$ BEGIN
  CREATE TYPE "ReviewStatus" AS ENUM ('PENDING', 'PUBLISHED', 'REJECTED');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

CREATE TABLE "Provider" (
  "id" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "slug" TEXT NOT NULL,
  "kind" "ProviderKind" NOT NULL,
  "description" TEXT NOT NULL,
  "verification" "ProviderVerification" NOT NULL DEFAULT 'PENDING',
  "verifiedAt" TIMESTAMP(3),
  "isPublished" BOOLEAN NOT NULL DEFAULT false,
  "sourceUrl" TEXT,
  "sourceCollectedAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "Provider_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Location" (
  "id" TEXT NOT NULL,
  "providerId" TEXT NOT NULL,
  "address" TEXT NOT NULL,
  "city" TEXT NOT NULL,
  "latitude" DECIMAL(9,6),
  "longitude" DECIMAL(9,6),
  "phone" TEXT,
  "email" TEXT,
  "schedule" JSONB NOT NULL DEFAULT '{}',
  CONSTRAINT "Location_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Specialty" (
  "id" TEXT NOT NULL,
  "code" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  CONSTRAINT "Specialty_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "ProviderSpecialty" (
  "providerId" TEXT NOT NULL,
  "specialtyId" TEXT NOT NULL,
  CONSTRAINT "ProviderSpecialty_pkey" PRIMARY KEY ("providerId", "specialtyId")
);

CREATE TABLE "Service" (
  "id" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "duration" INTEGER,
  "minPrice" DECIMAL(10,2),
  "maxPrice" DECIMAL(10,2),
  "currency" TEXT NOT NULL DEFAULT 'RON',
  CONSTRAINT "Service_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "ProviderService" (
  "providerId" TEXT NOT NULL,
  "serviceId" TEXT NOT NULL,
  CONSTRAINT "ProviderService_pkey" PRIMARY KEY ("providerId", "serviceId")
);

CREATE TABLE "Credential" (
  "id" TEXT NOT NULL,
  "providerId" TEXT NOT NULL,
  "issuer" TEXT NOT NULL,
  "reference" TEXT NOT NULL,
  "verifiedAt" TIMESTAMP(3),
  CONSTRAINT "Credential_pkey" PRIMARY KEY ("id")
);

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

CREATE UNIQUE INDEX "Provider_slug_key" ON "Provider"("slug");
CREATE INDEX "Provider_isPublished_verification_idx" ON "Provider"("isPublished", "verification");
CREATE INDEX "Location_city_idx" ON "Location"("city");
CREATE INDEX "Location_providerId_idx" ON "Location"("providerId");
CREATE UNIQUE INDEX "Specialty_code_key" ON "Specialty"("code");
CREATE UNIQUE INDEX "Credential_issuer_reference_key" ON "Credential"("issuer", "reference");
CREATE INDEX "Credential_providerId_idx" ON "Credential"("providerId");
CREATE INDEX "ClaimRequest_providerId_status_idx" ON "ClaimRequest"("providerId", "status");
CREATE INDEX "Review_providerId_status_idx" ON "Review"("providerId", "status");

ALTER TABLE "Location" ADD CONSTRAINT "Location_providerId_fkey" FOREIGN KEY ("providerId") REFERENCES "Provider"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ProviderSpecialty" ADD CONSTRAINT "ProviderSpecialty_providerId_fkey" FOREIGN KEY ("providerId") REFERENCES "Provider"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ProviderSpecialty" ADD CONSTRAINT "ProviderSpecialty_specialtyId_fkey" FOREIGN KEY ("specialtyId") REFERENCES "Specialty"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ProviderService" ADD CONSTRAINT "ProviderService_providerId_fkey" FOREIGN KEY ("providerId") REFERENCES "Provider"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ProviderService" ADD CONSTRAINT "ProviderService_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "Service"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Credential" ADD CONSTRAINT "Credential_providerId_fkey" FOREIGN KEY ("providerId") REFERENCES "Provider"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ClaimRequest" ADD CONSTRAINT "ClaimRequest_providerId_fkey" FOREIGN KEY ("providerId") REFERENCES "Provider"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Review" ADD CONSTRAINT "Review_providerId_fkey" FOREIGN KEY ("providerId") REFERENCES "Provider"("id") ON DELETE CASCADE ON UPDATE CASCADE;

