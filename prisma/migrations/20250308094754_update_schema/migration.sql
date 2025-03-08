/*
  Warnings:

  - Added the required column `code` to the `Party` table without a default value. This is not possible if the table is not empty.
  - Added the required column `state` to the `Party` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Party_name_key";

-- AlterTable
ALTER TABLE "Party" ADD COLUMN     "address" TEXT,
ADD COLUMN     "code" INTEGER NOT NULL,
ADD COLUMN     "contact" TEXT,
ADD COLUMN     "credit" DOUBLE PRECISION,
ADD COLUMN     "dlno" TEXT,
ADD COLUMN     "gst" TEXT,
ADD COLUMN     "state" TEXT NOT NULL,
ADD COLUMN     "type" TEXT;
