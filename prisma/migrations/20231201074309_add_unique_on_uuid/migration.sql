/*
  Warnings:

  - A unique constraint covering the columns `[uuid]` on the table `JsonBody` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "JsonBody_uuid_key" ON "JsonBody"("uuid");
