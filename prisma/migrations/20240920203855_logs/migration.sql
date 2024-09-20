/*
  Warnings:

  - Added the required column `success` to the `BankLogs` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_BankLogs" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "message" TEXT NOT NULL,
    "success" BOOLEAN NOT NULL,
    "created" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_BankLogs" ("created", "id", "message") SELECT "created", "id", "message" FROM "BankLogs";
DROP TABLE "BankLogs";
ALTER TABLE "new_BankLogs" RENAME TO "BankLogs";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
