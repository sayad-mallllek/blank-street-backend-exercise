/*
  Warnings:

  - Added the required column `locationId` to the `Order` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Order" ADD COLUMN     "locationId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."Order" ADD CONSTRAINT "Order_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "public"."Location"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
