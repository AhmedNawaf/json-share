/*
  Warnings:

  - Added the required column `link` to the `JsonBody` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_JsonBody" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "body" TEXT NOT NULL,
    "link" TEXT NOT NULL
);
INSERT INTO "new_JsonBody" ("body", "id") SELECT "body", "id" FROM "JsonBody";
DROP TABLE "JsonBody";
ALTER TABLE "new_JsonBody" RENAME TO "JsonBody";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
