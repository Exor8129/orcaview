/*
  Warnings:

  - Changed the type of `date` on the `inRegister` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "inRegister" DROP COLUMN "date",
ADD COLUMN     "date" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "party" DROP NOT NULL,
ALTER COLUMN "item" DROP NOT NULL,
ALTER COLUMN "department" DROP NOT NULL,
ALTER COLUMN "courier" DROP NOT NULL,
ALTER COLUMN "courier" DROP DEFAULT,
ALTER COLUMN "complete" DROP NOT NULL,
ALTER COLUMN "complete" SET DEFAULT 'Open',
ALTER COLUMN "complete" SET DATA TYPE TEXT;
