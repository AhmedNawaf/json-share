/*
  Warnings:

  - A unique constraint covering the columns `[shortLink]` on the table `JsonBody` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "JsonBody_shortLink_key" ON "JsonBody"("shortLink");
