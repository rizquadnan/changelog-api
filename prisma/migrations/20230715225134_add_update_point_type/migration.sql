/*
  Warnings:

  - Added the required column `type` to the `UpdatePoint` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "UPDATE_POINT_TYPE" AS ENUM ('FEATURE', 'IMPROVEMENT', 'BUG');

-- AlterTable
ALTER TABLE "UpdatePoint" ADD COLUMN     "type" "UPDATE_POINT_TYPE" NOT NULL;
