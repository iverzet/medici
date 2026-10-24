ALTER TABLE "Lead" ADD COLUMN "providerId" TEXT;
ALTER TABLE "Lead" ADD COLUMN "closedAt" TIMESTAMP(3);
ALTER TABLE "PartnershipRequest" ADD COLUMN "closedAt" TIMESTAMP(3);
ALTER TABLE "ProviderService" ADD COLUMN "duration" INTEGER;
ALTER TABLE "ProviderService" ADD COLUMN "minPrice" DECIMAL(10,2);
ALTER TABLE "ProviderService" ADD COLUMN "maxPrice" DECIMAL(10,2);
ALTER TABLE "ProviderService" ADD COLUMN "currency" TEXT NOT NULL DEFAULT 'RON';

CREATE INDEX "Lead_providerId_idx" ON "Lead"("providerId");
CREATE INDEX "Lead_closedAt_idx" ON "Lead"("closedAt");
CREATE INDEX "PartnershipRequest_closedAt_idx" ON "PartnershipRequest"("closedAt");

ALTER TABLE "Lead" ADD CONSTRAINT "Lead_providerId_fkey" FOREIGN KEY ("providerId") REFERENCES "Provider"("id") ON DELETE SET NULL ON UPDATE CASCADE;
