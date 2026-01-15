-- AlterTable
ALTER TABLE "User" ADD COLUMN     "verificationRejected" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "verificationRejectedReason" TEXT,
ADD COLUMN     "verificationRequested" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "verificationRequestedAt" TIMESTAMP(3);
