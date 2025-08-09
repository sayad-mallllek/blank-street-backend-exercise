/*
  Warnings:

  - You are about to drop the column `taxes` on the `Order` table. All the data in the column will be lost.
  - Added the required column `totalPrice` to the `Order` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Location" ADD COLUMN     "taxes" DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "public"."Order" DROP COLUMN "taxes",
ADD COLUMN     "totalPrice" DOUBLE PRECISION NOT NULL;
