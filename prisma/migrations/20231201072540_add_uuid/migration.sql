/*
  Warnings:

  - The primary key for the `JsonBody` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `JsonBody` table. The data in that column could be lost. The data in that column will be cast from `String` to `BigInt`.
  - Added the required column `uuid` to the `JsonBody` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_JsonBody" (
    "id" BIGINT NOT NULL PRIMARY KEY,
    "uuid" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "link" TEXT NOT NULL
);
INSERT INTO "new_JsonBody" ("body", "id", "link") SELECT "body", "id", "link" FROM "JsonBody";
DROP TABLE "JsonBody";
ALTER TABLE "new_JsonBody" RENAME TO "JsonBody";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
