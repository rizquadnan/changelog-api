/*
  Warnings:

  - You are about to drop the column `name` on the `Update` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `UpdatePoint` table. All the data in the column will be lost.
  - Added the required column `title` to the `Update` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title` to the `UpdatePoint` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Update" DROP COLUMN "name",
ADD COLUMN     "title" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "UpdatePoint" DROP COLUMN "name",
ADD COLUMN     "title" TEXT NOT NULL;
