/*
  Warnings:

  - The primary key for the `JsonBody` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `JsonBody` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_JsonBody" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "uuid" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "link" TEXT NOT NULL
);
INSERT INTO "new_JsonBody" ("body", "id", "link", "uuid") SELECT "body", "id", "link", "uuid" FROM "JsonBody";
DROP TABLE "JsonBody";
ALTER TABLE "new_JsonBody" RENAME TO "JsonBody";
CREATE UNIQUE INDEX "JsonBody_uuid_key" ON "JsonBody"("uuid");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
